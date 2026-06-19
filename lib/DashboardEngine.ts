import { StateEngine } from '@rotorjs/state';
import type { DashboardAction } from './DashboardAction';
import { DashboardEnvironment } from './DashboardEnvironment';
import type { DashboardEventTarget } from './DashboardEventTarget';
import type { DashboardFact } from './DashboardFact';
import type { DashboardState } from './DashboardState';
import type { DashboardStateDescriptor } from './DashboardStateDescriptor';
import type { DashboardStateReducer } from './DashboardStateReducer';
import type { DashboardStateReducerConfig } from './DashboardStateReducerConfig';
import type { DashboardVar } from './DashboardVar';
import { dashboardFactInterest, dashboardVarInterest } from './interests';

export type DashboardStateReducerMap<
  Engine extends DashboardEngine = DashboardEngine,
> = { [type: string]: DashboardStateReducerConfig<Engine> };

export type DashboardEngineInit = {
  vars?: [name: string, value: DashboardVar][];
  facts?: [name: string, value: DashboardFact][];
};

export class DashboardEngine extends StateEngine<
  DashboardStateDescriptor,
  DashboardState,
  DashboardAction,
  DashboardEventTarget
> {
  #reducerInit;
  #environment;

  constructor(
    target: DashboardEventTarget,
    reducerInit: DashboardStateReducerMap,
    init?: DashboardEngineInit,
  ) {
    super(target);

    this.#reducerInit = reducerInit;
    this.#environment = new DashboardEnvironment(this.target, {
      vars: init?.vars,
      facts: init?.facts,
    });

    const signal = this.signal;

    this.#environment.addEventListener(
      'var',
      (event) => {
        this.target.dispatchInterest(dashboardVarInterest(event.name));
      },
      { signal },
    );

    this.#environment.addEventListener(
      'fact',
      (event) => {
        this.target.dispatchInterest(dashboardFactInterest(event.name));
      },
      { signal },
    );

    signal.addEventListener('abort', () => {
      this.#environment.stop();
    });
  }

  get vars(): readonly [name: string, value: DashboardVar][] {
    return this.#environment.vars;
  }

  get facts(): readonly [name: string, value: DashboardFact][] {
    return this.#environment.facts;
  }

  hasVar(name: string): boolean {
    return this.#environment.hasVar(name);
  }

  getVar(name: string): DashboardVar | undefined {
    return this.#environment.getVar(name);
  }

  hasFact(name: string): boolean {
    return this.#environment.hasFact(name);
  }

  getFact(name: string): DashboardFact | undefined {
    return this.#environment.getFact(name);
  }

  protected getReducerConfig(
    descriptor: DashboardStateDescriptor,
  ): DashboardStateReducerConfig {
    if (!Object.hasOwn(this.#reducerInit, descriptor.type))
      throw new Error(`Unknown reducer type "${descriptor.type}"`);
    return this.#reducerInit[descriptor.type];
  }

  getReducerID(descriptor: DashboardStateDescriptor): string {
    return `${encodeURIComponent(descriptor.type)}:${encodeURIComponent(this.getReducerConfig(descriptor).getReducerID(descriptor.params))}`;
  }

  protected createReducer(
    descriptor: DashboardStateDescriptor,
  ): DashboardStateReducer<DashboardEngine> {
    return this.getReducerConfig(descriptor).createReducer(this, descriptor);
  }
}
