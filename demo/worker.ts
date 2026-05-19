import { attachWorker } from '@rotorjs/state';
import { ExtendedDemoDashboardEngine } from './DemoDashboardEngine';

const controller = new AbortController();
const signal = controller.signal;

const engine = new ExtendedDemoDashboardEngine();
attachWorker(engine, self, { signal });

engine.addEventListener('action', (event) => {
  console.log('worker: action', event.action, event.emitter);

  if (event.action.type === 'stop') {
    engine.stop();
    controller.abort();
  }
});

engine.addEventListener('interest', (event) => {
  console.log('worker: interest', event.interest, event.emitter);
});

engine.addEventListener('subscribe-state', (event) => {
  console.log(
    'worker: subscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

engine.addEventListener('unsubscribe-state', (event) => {
  console.log(
    'worker: unsubscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

engine.addEventListener('state', (event) => {
  console.log('worker: state', event.consumers, event.state, event.emitter);
});
