import { DashboardEngine } from '@/DashboardEngine';
import { DashboardReducer } from '@/DashboardReducer';
import type { DashboardState } from '@/DashboardState';

export type DemoAction = { type: 'demo action'; content: string };

export type DemoDashboardReducerInit = { other: boolean };

export class DemoDashboardReducer extends DashboardReducer<DemoDashboardEngine> {
  #other: boolean;

  constructor(
    engine: DemoDashboardEngine,
    other: boolean,
    callback: (state: DashboardState) => void,
  ) {
    super(engine, [{ type: 'demo state' }], callback, { debounce: 100 });

    this.#other = other;

    this.update();
  }

  async reduce(_prevState: DashboardState): Promise<DashboardState> {
    console.log('reduce');

    this.clearInterests();

    this.engine.dispatchAction({
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

export class DemoDashboardEngine extends DashboardEngine {
  constructor() {
    super(
      (engine: DemoDashboardEngine, init, callback) =>
        new DemoDashboardReducer(
          engine,
          (init as Partial<DemoDashboardReducerInit>).other ?? false,
          callback,
        ),
    );

    const signal = this.signal;

    this.addEventListener(
      'action',
      (event) => {
        const action = event.action as DemoAction | { type: never };

        switch (action.type) {
          case 'demo action':
            console.log('got demo action', action.content);

            setTimeout(() => {
              this.dispatchInterest('demo interest');
            }, 5000);
            return;
        }
      },
      { signal },
    );
  }

  getState(other: boolean): DashboardState {
    return [
      other ? { type: 'other demo state' } : { type: 'updated demo state' },
    ];
  }
}

export class ExtendedDemoDashboardEngine extends DemoDashboardEngine {
  getState(other: boolean): DashboardState {
    if (other) return super.getState(other);
    return [{ type: 'extended demo state' }];
  }
}
