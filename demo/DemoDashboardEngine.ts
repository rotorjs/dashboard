import {
  DashboardEngine,
  DashboardStateReducer,
  type DashboardEventTarget,
  type DashboardState,
} from '@/main';

export type DemoDashboardStateDescriptor = {
  type: 'state' | 'other state';
};

export type DemoAction = { type: 'demo action'; content: string };

export class DemoDashboardReducer extends DashboardStateReducer<DemoDashboardEngine> {
  #other: boolean;

  constructor(
    engine: DemoDashboardEngine,
    descriptor: DemoDashboardStateDescriptor,
  ) {
    super(engine, descriptor);

    this.#other = descriptor.type === 'other state';

    this.setDebounce(100);

    this.update();
  }

  async reduce(
    _prevState: DashboardState | undefined,
  ): Promise<DashboardState> {
    console.log('reduce');

    this.clearInterests();

    this.target.dispatchAction({
      type: 'demo action',
      content: 'demo',
    } satisfies DemoAction);

    this.addInterest('demo interest');

    return this.engine.getState(this.#other);
  }

  recover(_prevState: DashboardState, error: unknown): DashboardState {
    throw error;
  }
}

const demoReducerConfig = {
  getReducerID: () => '',
  createReducer: (
    engine: DemoDashboardEngine,
    descriptor: DemoDashboardStateDescriptor,
  ) => new DemoDashboardReducer(engine, descriptor),
};

export class DemoDashboardEngine extends DashboardEngine {
  constructor(target: DashboardEventTarget) {
    super(
      target,
      // any key returns demoReducerConfig
      new Proxy(
        {},
        {
          get: () => demoReducerConfig,
          getOwnPropertyDescriptor: () => ({
            configurable: true,
            enumerable: true,
          }),
        },
      ),
    );
  }

  protected onAction(action: DemoAction | { type: never }): void {
    super.onAction(action);

    switch (action.type) {
      case 'demo action':
        console.log('got demo action', action.content);

        setTimeout(() => {
          this.target.dispatchInterest('demo interest');
        }, 5000);
        return;
    }
  }

  getState(other: boolean): DashboardState {
    return [
      other ? { type: 'other demo state' } : { type: 'updated demo state' },
    ];
  }
}

export class ExtendedDemoDashboardEngine extends DemoDashboardEngine {
  #n = 0;

  getState(other: boolean): DashboardState {
    if (other) return super.getState(other);
    return [{ type: `extended demo state ${this.#n++}` }];
  }
}
