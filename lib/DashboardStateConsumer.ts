import {
  StateConsumer,
  type StateCallback,
  type StateEventTarget,
} from '@rotorjs/state';
import deepEquals from 'fast-deep-equal';
import type { DashboardAction, SyncDashboardAction } from './DashboardAction';
import type { DashboardState } from './DashboardState';
import type { DashboardStateDescriptor } from './DashboardStateDescriptor';

export class DashboardStateConsumer extends StateConsumer<
  DashboardStateDescriptor,
  DashboardState,
  DashboardAction
> {
  constructor(
    target: StateEventTarget<
      DashboardStateDescriptor,
      DashboardState,
      DashboardAction
    >,
    descriptor: DashboardStateDescriptor,
    callback: StateCallback<DashboardState>,
  ) {
    super(target, descriptor, callback);

    this.target.addEventListener(
      'action',
      (event) => {
        const action = event.action as SyncDashboardAction | { type: never };

        switch (action.type) {
          case 'sync':
            this.target.subscribeState(this.id, this.descriptor);
            return;
        }
      },
      { signal: this.signal },
    );
  }

  protected compareStates(
    nextState: DashboardState,
    prevState: DashboardState,
  ): boolean {
    return deepEquals(nextState, prevState);
  }
}
