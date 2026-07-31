import type { EnvInject } from './env.inject.js';

import { describe, it } from 'node:test';
import { Env } from './env.js';

describe('env', () => {
    const inject: EnvInject = {
        process: {
            env: {
                HOST: 'localhost:8080'
            }
        },
        readFile: () => 'PORT=1433'
    };

    it('Get "HOST" environment variable', (t: it.TestContext) => {
        const e = new Env('jaja', inject);
        const v = e.get('HOST');
        t.assert.deepStrictEqual(v, 'localhost:8080');
    });

    it('Get "PORT" environment variable', (t: it.TestContext) => {
        const e = new Env('jaja', inject);
        const v = e.get('PORT', { callback: v => parseInt(v) });
        t.assert.deepStrictEqual(v, 1433);
    });

    it('Get "FOOO" environment variable (doesn\'t exists)', (t: it.TestContext) => {
        try {
            const e = new Env('jaja', inject);
            e.get('FOOO', { callback: v => parseInt(v) });
            t.assert.fail('This test must be fail.');
        } catch (err: any) {
            t.assert.strictEqual(err?.message, `The environment variable "FOOO" wasn't setled`)
        }
    });
});