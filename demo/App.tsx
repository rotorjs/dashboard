import { DashboardEventTarget, DashboardStateConsumer } from '@/main';
import { useEffect } from 'react';
// eslint-disable-next-line import-x/default
import Worker from './worker?worker';

import { attachWorker } from '@rotorjs/state';
import './App.css';

const controller = new AbortController();
const signal = controller.signal;

const worker = new Worker();
const target = new DashboardEventTarget();
attachWorker(target, worker, { signal });
// const engine = new DemoStateEngine(target);

target.addEventListener('action', (event) => {
  console.log('main: action', event.action, event.emitter);

  if (event.action.type === 'stop') controller.abort();
});

target.addEventListener('interest', (event) => {
  console.log('main: interest', event.interest, event.emitter);
});

target.addEventListener('subscribe-state', (event) => {
  console.log(
    'main: subscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

target.addEventListener('unsubscribe-state', (event) => {
  console.log(
    'main: unsubscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

target.addEventListener('state', (event) => {
  console.log('main: state', event.consumers, event.state, event.emitter);
});

(window as typeof window & { target: DashboardEventTarget }).target = target;

export default function App() {
  useEffect(() => {
    const consumer = new DashboardStateConsumer(
      target,
      { type: 'state' },
      (state) => {
        console.log(`Consumer ${consumer.id} got state:`, state);
      },
    );

    return () => {
      consumer.stop();
    };
  }, []);

  useEffect(() => {
    const consumer = new DashboardStateConsumer(
      target,
      { type: 'other state' },
      (state) => {
        console.log(`Consumer ${consumer.id} got state:`, state);
      },
    );

    return () => {
      consumer.stop();
    };
  }, []);

  return 'Demo';
}
