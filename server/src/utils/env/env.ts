import type { EnvInject } from './env.inject.js';

import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

export class Env {
    #path: string;
    #injected: Required<EnvInject>;

    constructor(path: string, inject?: EnvInject) {
        this.#path = path;
        this.#injected = {
            process:    inject?.process                 ?? globalThis.process,
            readFile:   inject?.readFile?.bind(inject)  ?? readFileSync
        };
    }

    #getValue(name: string): string | undefined {
        try {
            const text = this.#injected.readFile(this.#path, 'utf-8');
            const vars = parseEnv(text);
            return typeof vars[name] !== 'string'
            ?   this.#injected.process.env[name]
            :   vars[name];
        } catch {
            return this.#injected.process.env[name];
        }
    }

    get<D extends string | undefined>(
        name: string,
        options?: {
            default?: D;
        }
    ): D extends string ? string : string | undefined;

    get<T, D extends T | undefined>(
        name: string,
        options?: {
            default?: D;
            callback?: (v: string) => T
        }
    ): D extends T ? T : T | undefined;
    get(
        name: string,
        options?: {
            default?: boolean;
            callback?: (v: string) => unknown
        }
    ): unknown {
        const value = this.#getValue(name);
        if (typeof value !== 'string') {
            if (typeof options?.default === 'undefined') {
                throw new Error(`The environment variable "${name}" wasn't setled`);
            } else {
                return options.default;
            }
        }

        return options?.callback
        ?   options?.callback(value)
        :   value;
    }
}