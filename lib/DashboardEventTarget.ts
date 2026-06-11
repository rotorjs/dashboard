import { StateEventTarget } from '@rotorjs/state';
import type {
  DashboardAction,
  FactDashboardAction,
  SyncDashboardAction,
  VarDashboardAction,
} from './DashboardAction';
import type { DashboardState } from './DashboardState';
import type { DashboardStateDescriptor } from './DashboardStateDescriptor';

export class DashboardEventTarget extends StateEventTarget<
  DashboardStateDescriptor,
  DashboardState,
  DashboardAction
> {
  dispatchVar(name: string, value: unknown, exposed?: boolean): void {
    this.dispatchAction({
      type: 'var',
      name,
      value,
      exposed,
    } satisfies VarDashboardAction);
  }

  dispatchFact(name: string, value: unknown): void {
    this.dispatchAction({
      type: 'fact',
      name,
      value,
    } satisfies FactDashboardAction);
  }

  sync(): void {
    this.dispatchAction({ type: 'sync' } satisfies SyncDashboardAction);
  }
}
