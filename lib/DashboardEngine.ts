import { StateEngine, type StateEventTarget } from '@rotorjs/core';
import type {
  DashboardAction,
  FactDashboardAction,
  VarDashboardAction,
} from './DashboardAction';
import type { DashboardFact } from './DashboardFact';
import type { DashboardReducer } from './DashboardReducer';
import type { DashboardReducerInit } from './DashboardReducerInit';
import type { DashboardState } from './DashboardState';
import type { DashboardVar } from './DashboardVar';
import { dashboardFactInterest, dashboardVarInterest } from './interests';

export type DashboardEventTarget = StateEventTarget<
  DashboardState,
  DashboardReducerInit,
  DashboardAction
>;

export type DashboardEngineInit = {
  vars?: { [name: string]: DashboardVar };
  facts?: { [name: string]: DashboardFact };
};

export type CreateDashboardReducerFunction<
  Engine extends DashboardEngine = DashboardEngine,
> = {
  bivarianceHack(
    engine: Engine,
    init: DashboardReducerInit,
    callback: (state: DashboardState) => void,
  ): DashboardReducer<Engine>;
}['bivarianceHack'];

export class DashboardEngine extends StateEngine<
  DashboardState,
  DashboardReducerInit,
  DashboardAction
> {
  #createReducer;
  #vars: { [name: string]: DashboardVar };
  #facts: { [name: string]: DashboardFact };

  constructor(
    createReducer: CreateDashboardReducerFunction,
    options?: DashboardEngineInit,
  ) {
    super();

    this.#createReducer = createReducer;
    this.#vars = options?.vars ?? {};
    this.#facts = options?.facts ?? {};

    const signal = this.signal;

    this.addEventListener(
      'action',
      (event) => {
        const action = event.action as
          | VarDashboardAction
          | FactDashboardAction
          | { type: never };

        switch (action.type) {
          case 'var': {
            this.#vars[action.name] = {
              value: action.value,
              exposed: action.exposed,
            };
            this.dispatchInterest(dashboardVarInterest(action.name));
            return;
          }

          case 'fact': {
            this.#facts[action.name] = { value: action.value };
            this.dispatchInterest(dashboardFactInterest(action.name));
            return;
          }
        }
      },
      { signal },
    );
  }

  hasVar(name: string): boolean {
    return Object.hasOwn(this.#vars, name);
  }

  getVar(name: string): DashboardVar | undefined {
    return this.#vars[name];
  }

  hasFact(name: string): boolean {
    return Object.hasOwn(this.#facts, name);
  }

  getFact(name: string): DashboardFact | undefined {
    return this.#facts[name];
  }

  protected createReducer(
    init: DashboardReducerInit,
    callback: (state: DashboardState) => void,
  ): DashboardReducer {
    return this.#createReducer(this, init, callback);
  }
}
