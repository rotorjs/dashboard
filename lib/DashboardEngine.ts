import { StateEngine } from '@rotorjs/state';
import type {
  DashboardAction,
  FactDashboardAction,
  VarDashboardAction,
} from './DashboardAction';
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

export class DashboardEngine
  extends StateEngine<DashboardStateDescriptor, DashboardState, DashboardAction>
  implements DashboardEventTarget
{
  #reducerInit;
  #vars: { [name: string]: DashboardVar } = {};
  #facts: { [name: string]: DashboardFact } = {};

  constructor(reducerInit: DashboardStateReducerMap) {
    super();

    this.#reducerInit = reducerInit;
  }

  protected onAction(action: DashboardAction): void {
    super.onAction(action);

    const a = action as
      | VarDashboardAction
      | FactDashboardAction
      | { type: never };

    switch (a.type) {
      case 'var': {
        this.#vars[a.name] = {
          value: a.value,
          exposed: a.exposed ?? false,
        };
        this.dispatchInterest(dashboardVarInterest(a.name));
        return;
      }

      case 'fact': {
        this.#facts[a.name] = { value: a.value };
        this.dispatchInterest(dashboardFactInterest(a.name));
        return;
      }
    }
  }

  dispatchVar(name: string, value: unknown, exposed?: boolean) {
    this.dispatchAction({
      type: 'var',
      name,
      value,
      exposed,
    } satisfies VarDashboardAction);
  }

  dispatchFact(name: string, value: unknown) {
    this.dispatchAction({
      type: 'fact',
      name,
      value,
    } satisfies FactDashboardAction);
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
