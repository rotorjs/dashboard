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
  vars?: { [name: string]: DashboardVar };
  facts?: { [name: string]: DashboardFact };
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
      onVar: (name) => {
        this.target.dispatchInterest(dashboardVarInterest(name));
      },
      onFact: (name) => {
        this.target.dispatchInterest(dashboardFactInterest(name));
      },
      signal: this.signal,
    });
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
