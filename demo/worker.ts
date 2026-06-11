import { DashboardEventTarget } from '@/DashboardEventTarget';
import { attachWorker } from '@rotorjs/state';
import { ExtendedDemoDashboardEngine } from './DemoDashboardEngine';

const controller = new AbortController();
const signal = controller.signal;

const target = new DashboardEventTarget();
attachWorker(target, self, { signal });
const engine = new ExtendedDemoDashboardEngine(target);

target.addEventListener('action', (event) => {
  console.log('worker: action', event.action, event.emitter);

  if (event.action.type === 'stop') {
    engine.stop();
    controller.abort();
  }
});

target.addEventListener('interest', (event) => {
  console.log('worker: interest', event.interest, event.emitter);
});

target.addEventListener('subscribe-state', (event) => {
  console.log(
    'worker: subscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

target.addEventListener('unsubscribe-state', (event) => {
  console.log(
    'worker: unsubscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

target.addEventListener('state', (event) => {
  console.log('worker: state', event.consumers, event.state, event.emitter);
});
