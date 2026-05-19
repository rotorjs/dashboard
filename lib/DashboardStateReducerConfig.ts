import type { DashboardEngine } from './DashboardEngine';
import type { DashboardStateDescriptor } from './DashboardStateDescriptor';
import type { DashboardStateReducer } from './DashboardStateReducer';

export type GetDashboardStateReducerIDFunction = (
  params: unknown | undefined,
) => string;

export type CreateDashboardStateReducerFunction<
  Engine extends DashboardEngine = DashboardEngine,
> = {
  bivarianceHack(
    engine: Engine,
    descriptor: DashboardStateDescriptor,
  ): DashboardStateReducer<Engine>;
}['bivarianceHack'];

export type DashboardStateReducerConfig<
  Engine extends DashboardEngine = DashboardEngine,
> = {
  getReducerID: GetDashboardStateReducerIDFunction;
  createReducer: CreateDashboardStateReducerFunction<Engine>;
};
