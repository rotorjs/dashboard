import { StateReducer } from '@rotorjs/core';
import type { DashboardAction } from './DashboardAction';
import type { DashboardEngine } from './DashboardEngine';
import type { DashboardReducerInit } from './DashboardReducerInit';
import type { DashboardState } from './DashboardState';
import type { ErrorDashboardTile } from './DashboardTile';

export abstract class DashboardReducer<
  Engine extends DashboardEngine = DashboardEngine,
> extends StateReducer<
  DashboardState,
  DashboardReducerInit,
  DashboardAction,
  Engine
> {
  recover(_prevState: DashboardState, error: unknown): DashboardState {
    return [{ type: 'Error', error } satisfies ErrorDashboardTile];
  }
}
