import { DashboardEventTarget, DashboardStateConsumer } from '@/main';
import { attachWorker } from '@rotorjs/state';
import { useEffect } from 'react';
// eslint-disable-next-line import-x/default
import Worker from './worker?worker';

import './App.css';

const controller = new AbortController();
const signal = controller.signal;

const worker = new Worker();
const engine = new DashboardEventTarget();
attachWorker(engine, worker, { signal });
// const engine = new DemoStateEngine();

engine.addEventListener('action', (event) => {
  console.log('main: action', event.action, event.emitter);

  if (event.action.type === 'stop') controller.abort();
});

engine.addEventListener('interest', (event) => {
  console.log('main: interest', event.interest, event.emitter);
});

engine.addEventListener('subscribe-state', (event) => {
  console.log(
    'main: subscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

engine.addEventListener('unsubscribe-state', (event) => {
  console.log(
    'main: unsubscribe state',
    event.consumer,
    event.descriptor,
    event.emitter,
  );
});

engine.addEventListener('state', (event) => {
  console.log('main: state', event.consumers, event.state, event.emitter);
});

(window as typeof window & { engine: DashboardEventTarget }).engine = engine;

export default function App() {
  useEffect(() => {
    const consumer = new DashboardStateConsumer(
      engine,
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
      engine,
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
