import { StateReducer } from '@rotorjs/state';
import { v7 as uuid } from 'uuid';
import type { DashboardAction } from './DashboardAction';
import type { DashboardEngine } from './DashboardEngine';
import type { ErrorDashboardNode } from './DashboardNode';
import type { DashboardReducerInit } from './DashboardReducerInit';
import type { DashboardState } from './DashboardState';

export abstract class DashboardReducer<
  Engine extends DashboardEngine = DashboardEngine,
> extends StateReducer<
  DashboardState,
  DashboardReducerInit,
  DashboardAction,
  Engine
> {
  recover(_prevState: DashboardState, error: unknown): DashboardState {
    return [{ type: 'error', id: uuid(), error } satisfies ErrorDashboardNode];
  }
}
