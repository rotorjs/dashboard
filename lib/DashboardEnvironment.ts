import { ActionEvent, TypedEventTarget } from '@rotorjs/state';
import deepEquals from 'fast-deep-equal';
import { v7 as uuid } from 'uuid';
import type {
  FactDashboardAction,
  SyncDashboardAction,
  VarDashboardAction,
} from './DashboardAction';
import type { DashboardEventTarget } from './DashboardEventTarget';
import type { DashboardFact } from './DashboardFact';
import type { DashboardVar } from './DashboardVar';

export type DashboardEnvironmentInit = {
  vars?: readonly [name: string, value: DashboardVar][];
  facts?: readonly [name: string, value: DashboardFact][];
};

export class DashboardEnvironment extends TypedEventTarget<{
  var: VarEvent;
  fact: FactEvent;
}> {
  #target;
  #id = uuid();
  #vars: { [name: string]: DashboardVar };
  #varSnapshot?: readonly [name: string, value: DashboardVar][];
  #facts: { [name: string]: DashboardFact };
  #factSnapshot?: readonly [name: string, value: DashboardFact][];
  #controller = new AbortController();

  constructor(target: DashboardEventTarget, init?: DashboardEnvironmentInit) {
    super();

    this.#target = target;
    this.#vars = Object.fromEntries(
      init?.vars?.map(([name, value]) => [name, Object.freeze(value)]) ?? [],
    );
    this.#facts = Object.fromEntries(
      init?.facts?.map(([name, value]) => [name, Object.freeze(value)]) ?? [],
    );

    const signal = this.signal;

    this.target.addEventListener(
      'action',
      (event) => {
        if (event.emitter === this.#id) return;

        const action = event.action as
          | VarDashboardAction
          | FactDashboardAction
          | SyncDashboardAction
          | { type: never };

        switch (action.type) {
          case 'var': {
            const prevValue = this.#vars[action.name];
            const nextValue = {
              value: action.value,
              exposed: action.exposed ?? false,
            };
            if (!deepEquals(prevValue, nextValue)) {
              this.#vars[action.name] = Object.freeze(nextValue);
              this.#varSnapshot = undefined;
              this.dispatchEvent(
                new VarEvent(action.name, nextValue.value, nextValue.exposed),
              );
            }
            return;
          }

          case 'fact': {
            const prevValue = this.#facts[action.name];
            const nextValue = { value: action.value };
            if (!deepEquals(prevValue, nextValue)) {
              this.#facts[action.name] = Object.freeze(nextValue);
              this.#factSnapshot = undefined;
              this.dispatchEvent(new FactEvent(action.name, nextValue.value));
            }
            return;
          }

          case 'sync':
            this.vars.forEach(([name, { value, exposed }]) => {
              const e = new ActionEvent({
                type: 'var',
                name,
                value,
                exposed,
              } satisfies VarDashboardAction);
              e.emitter = this.#id;
              this.target.dispatchEvent(e);
            });

            this.facts.forEach(([name, { value }]) => {
              const e = new ActionEvent({
                type: 'fact',
                name,
                value,
              } satisfies FactDashboardAction);
              e.emitter = this.#id;
              this.target.dispatchEvent(e);
            });
        }
      },
      { signal },
    );

    this.target.sync();
  }

  get target(): DashboardEventTarget {
    return this.#target;
  }

  get id(): string {
    return this.#id;
  }

  get signal(): AbortSignal {
    return this.#controller.signal;
  }

  get vars(): readonly [name: string, value: DashboardVar][] {
    if (!this.#varSnapshot) {
      this.#varSnapshot = Object.freeze(Object.entries(this.#vars));
    }
    return this.#varSnapshot;
  }

  get facts(): readonly [name: string, value: DashboardFact][] {
    if (!this.#factSnapshot) {
      this.#factSnapshot = Object.freeze(Object.entries(this.#facts));
    }
    return this.#factSnapshot;
  }

  hasVar(name: string): boolean {
    return Object.hasOwn(this.#vars, name);
  }

  getVar(name: string): DashboardVar | undefined {
    return this.#vars[name];
  }

  hasFact(name: string): boolean {
    return Object.hasOwn(this.#facts, name);
  }

  getFact(name: string): DashboardFact | undefined {
    return this.#facts[name];
  }

  stop(): void {
    this.#controller.abort();
  }
}

export class VarEvent extends Event {
  #name;
  #value;
  #exposed;

  constructor(name: string, value: unknown, exposed: boolean) {
    super('var');

    this.#name = name;
    this.#value = value;
    this.#exposed = exposed;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }

  get exposed() {
    return this.#exposed;
  }
}

export class FactEvent extends Event {
  #name;
  #value;

  constructor(name: string, value: unknown) {
    super('fact');

    this.#name = name;
    this.#value = value;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }
}
