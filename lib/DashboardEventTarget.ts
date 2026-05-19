import { StateEventTarget } from '@rotorjs/state';
import type {
  DashboardAction,
  FactDashboardAction,
  VarDashboardAction,
} from './DashboardAction';
import type { DashboardState } from './DashboardState';
import type { DashboardStateDescriptor } from './DashboardStateDescriptor';

export class DashboardEventTarget extends StateEventTarget<
  DashboardStateDescriptor,
  DashboardState,
  DashboardAction
> {
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
}
