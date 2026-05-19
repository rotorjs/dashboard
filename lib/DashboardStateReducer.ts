import { StateReducer } from '@rotorjs/state';
import deepEquals from 'fast-deep-equal';
import { v7 as uuid } from 'uuid';
import type { DashboardAction } from './DashboardAction';
import type { DashboardEngine } from './DashboardEngine';
import type { DashboardState } from './DashboardState';
import type { DashboardStateDescriptor } from './DashboardStateDescriptor';
import type { ErrorDashboardNode } from './nodes';

export abstract class DashboardStateReducer<
  Engine extends DashboardEngine = DashboardEngine,
> extends StateReducer<
  DashboardStateDescriptor,
  DashboardState,
  DashboardAction,
  Engine
> {
  recover(_prevState: DashboardState, error: unknown): DashboardState {
    return [{ type: 'error', id: uuid(), error } satisfies ErrorDashboardNode];
  }

  protected compareStates(
    nextState: DashboardState,
    prevState: DashboardState,
  ): boolean {
    return deepEquals(nextState, prevState);
  }
}
