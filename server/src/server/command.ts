import type { CommandTarget } from '@bleed-believer/commander';

import { Command } from '@bleed-believer/commander';
import express from 'express';

import { sysExportDataSource } from '@sys-export/data-source.js';
import { endpointsRouter } from './endpoints/router.js';
import { styleText } from 'node:util';
import { env } from '@/env.js';

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
        #dataSource = [
            sysExportDataSource
        ];

        async onInit(): Promise<void> {
            const app = express()
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