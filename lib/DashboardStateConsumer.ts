import { StateConsumer } from '@rotorjs/state';
import deepEquals from 'fast-deep-equal';
import type { DashboardAction } from './DashboardAction';
import type { DashboardState } from './DashboardState';
import type { DashboardStateDescriptor } from './DashboardStateDescriptor';

export class DashboardStateConsumer extends StateConsumer<
  DashboardStateDescriptor,
  DashboardState,
  DashboardAction
> {
  protected compareStates(
    nextState: DashboardState,
    prevState: DashboardState,
  ): boolean {
    return deepEquals(nextState, prevState);
  }
}
