import { StateEngine, type StateEventTarget } from '@rotorjs/core';
import type { DashboardAction, VarDashboardAction } from './DashboardAction';
import { dashboardVarInterest } from './DashboardInterest';
import type { DashboardReducer } from './DashboardReducer';
import type { DashboardReducerInit } from './DashboardReducerInit';
import type { DashboardState } from './DashboardState';

export type DashboardEngineInit = {
  vars?: { [name: string]: unknown };
};

export type DashboardEventTarget = StateEventTarget<
  DashboardState,
  DashboardReducerInit,
  DashboardAction
>;

export class DashboardEngine extends StateEngine<
  DashboardState,
  DashboardReducerInit,
  DashboardAction
> {
  #createReducer;
  #vars: { [name: string]: unknown };

  constructor(
    createReducer: (
      engine: DashboardEngine,
      init: DashboardReducerInit,
      callback: (state: DashboardState) => void,
    ) => DashboardReducer,
    options?: DashboardEngineInit,
  ) {
    super();

    this.#createReducer = createReducer;
    this.#vars = options?.vars ?? {};

    const signal = this.signal;

    this.addEventListener(
      'action',
      (event) => {
        switch (event.action.type) {
          case 'vars': {
            const action = event.action as VarDashboardAction;
            this.#vars[action.name] = action.value;
            this.dispatchInterest(dashboardVarInterest(action.name));
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

  getVar(name: string): unknown {
    return this.#vars[name];
  }

  protected createReducer(
    init: DashboardReducerInit,
    callback: (state: DashboardState) => void,
  ): DashboardReducer {
    return this.#createReducer(this, init, callback);
  }
}
