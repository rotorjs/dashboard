import { ActionEvent } from '@rotorjs/state';
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
  vars?: { [name: string]: DashboardVar };
  facts?: { [name: string]: DashboardFact };
  onVar?: (name: string, value: DashboardVar | undefined) => void;
  onFact?: (name: string, value: DashboardFact | undefined) => void;
  signal?: AbortSignal;
};

export class DashboardEnvironment {
  #target;
  #id = uuid();
  #vars: { [name: string]: DashboardVar };
  #facts: { [name: string]: DashboardFact };
  #signal;
  #controller = new AbortController();

  constructor(target: DashboardEventTarget, init?: DashboardEnvironmentInit) {
    this.#target = target;
    this.#vars = Object.fromEntries(
      Object.entries(init?.vars ?? {}).map(([name, value]) => [
        name,
        Object.freeze(value),
      ]),
    );
    this.#facts = Object.fromEntries(
      Object.entries(init?.facts ?? {}).map(([name, value]) => [
        name,
        Object.freeze(value),
      ]),
    );
    this.#signal = init?.signal;

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
            const nextValue = Object.freeze({
              value: action.value,
              exposed: action.exposed ?? false,
            });
            if (!deepEquals(prevValue, nextValue)) {
              this.#vars[action.name] = nextValue;
              init?.onVar?.(action.name, nextValue);
            }
            return;
          }

          case 'fact': {
            const prevValue = this.#facts[action.name];
            const nextValue = Object.freeze({ value: action.value });
            if (!deepEquals(prevValue, nextValue)) {
              this.#facts[action.name] = nextValue;
              init?.onFact?.(action.name, nextValue);
            }
            return;
          }

          case 'sync':
            Object.entries(this.#vars).forEach(([name, { value, exposed }]) => {
              const e = new ActionEvent({
                type: 'var',
                name,
                value,
                exposed,
              } satisfies VarDashboardAction);
              e.emitter = this.#id;
              this.target.dispatchEvent(e);
            });

            Object.entries(this.#facts).forEach(([name, { value }]) => {
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
    if (this.#signal)
      return AbortSignal.any([this.#controller.signal, this.#signal]);
    return this.#controller.signal;
  }

  hasVar(name: string): boolean {
    return Object.hasOwn(this.#vars, name);
  }

  getVar(name: string): DashboardVar | undefined {
    return this.#vars[name];
  }

  getVars(): [name: string, value: DashboardVar][] {
    return Object.entries(this.#vars);
  }

  hasFact(name: string): boolean {
    return Object.hasOwn(this.#facts, name);
  }

  getFact(name: string): DashboardFact | undefined {
    return this.#facts[name];
  }

  getFacts(): [name: string, value: DashboardFact][] {
    return Object.entries(this.#facts);
  }

  stop(): void {
    this.#controller.abort();
  }
}
