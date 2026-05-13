import { StateReducer } from '@rotorjs/core';
import type { DashboardAction } from './DashboardAction';
import type { DashboardEngine } from './DashboardEngine';
import type { DashboardReducerInit } from './DashboardReducerInit';
import type { DashboardState } from './DashboardState';
import type { ErrorDashboardNode } from './DashboardNode';

export abstract class DashboardReducer<
  Engine extends DashboardEngine = DashboardEngine,
> extends StateReducer<
  DashboardState,
  DashboardReducerInit,
  DashboardAction,
  Engine
> {
  recover(_prevState: DashboardState, error: unknown): DashboardState {
    return [{ type: 'error', error } satisfies ErrorDashboardNode];
  }
}
