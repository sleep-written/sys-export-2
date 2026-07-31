import { DataSource } from 'typeorm';
import { resolve } from 'node:path';
import { Env } from '@utils/env';

const env = new Env(resolve(import.meta.dirname, '../../../.env'));
export const sysExportDataSource = new DataSource({
    type:       'mssql',
    host:       env.get('SYS_EXPORT_2_SYS_EXPORT_HOST')  ?? '127.0.0.1',
    port:       env.get('SYS_EXPORT_2_SYS_EXPORT_PORT',  { callback: v => parseInt(v) }) ?? 1433,
    username:   env.get('SYS_EXPORT_2_SYS_EXPORT_USERNAME'),
    password:   env.get('SYS_EXPORT_2_SYS_EXPORT_PASSWORD'),
    database:   env.get('SYS_EXPORT_2_SYS_EXPORT_DATABASE'),

    entities: [
        resolve(import.meta.dirname, 'entities/*.{ts,js}')
    ],

    migrations: [
        resolve(import.meta.dirname, 'migrations/*.{ts,js}')
    ],

    options: {
        trustServerCertificate: true
    }
});