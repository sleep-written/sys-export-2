import type { CommandTarget } from '@bleed-believer/commander';

import { styleText } from 'node:util';
import { Command } from '@bleed-believer/commander';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { mkdir } from 'node:fs/promises';

import expressSession from 'express-session';
import express from 'express';

import { sysExportDataSource } from '@sys-export/data-source.js';
import { endpointsRouter } from './endpoints/router.js';
import { env } from '@/env.js';
import { SQLite3Store } from '@bleed-believer/connect-sqlite3';


export const serverCommand = new Command({
    positionals: 'server',
    flags: {
        port: {
            description: [
                'Overrides the port at environment value "SYS_EXPORT_2_PORT". The default',
                'value if environment variable is not setled is ' + styleText('blueBright', '8080') + '.'
            ].join('\n'),
            required: false,
            short: 'p',
            type: 'number'
        }
    },
    callback: c => new class implements CommandTarget {
        #xdgDataHome = resolve(homedir(), '.local/share/sys-export-2');
        #dataSource = [
            sysExportDataSource
        ];

        async onInit(): Promise<void> {
            await mkdir(this.#xdgDataHome, { recursive: true });
            const app = express()
                .use(expressSession({
                    store:  new SQLite3Store(resolve(this.#xdgDataHome, 'SESSION.db')),
                    secret: env.get('SYS_EXPORT_2_SESSION_SECRET', { default: 'sys-export-2-session' }),
                    resave: true,
                    saveUninitialized: false,
                }))
                .use(express.json())
                .use(endpointsRouter);

            const port = typeof c.flags.port === 'number'
            ?   c.flags.port
            :   env.get('SYS_EXPORT_2_PORT', {
                    callback: v => parseInt(v),
                    default: 8080
                });

            await Promise.all(
                this.#dataSource
                    .filter(x => !x.isInitialized)
                    .map(x => x.initialize())
            );

            await new Promise<void>((resolve, reject) => {
                const server = app.listen(port, () => {
                    const callback = () => {
                        if (server.listening) {
                            process.off('SIGTERM', callback);
                            process.off('SIGINT',  callback);
                            server.closeAllConnections();
                            server.close();
                        }
                    };

                    process.once('SIGTERM', callback);
                    process.once('SIGINT',  callback);
                });

                server.once('error', err => reject(err));
                server.once('close', ___ => resolve());
            });
            
            await Promise.all(
                this.#dataSource
                    .filter(x => x.isInitialized)
                    .map(x => x.destroy())
            );
        }
    }
})