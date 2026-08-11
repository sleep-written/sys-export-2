import { DataSource } from 'typeorm';
import { resolve } from 'node:path';
import { env } from '@/env.js';

export const sysExportDataSource = new DataSource({
    type:       'mssql',
    host:       env.get('SYS_EXPORT_2_SYS_EXPORT_HOST', { default: '127.0.0.1' }),
    port:       env.get('SYS_EXPORT_2_SYS_EXPORT_PORT', { default: 1433 , callback: v => parseInt(v)}),
    username:   env.get('SYS_EXPORT_2_SYS_EXPORT_USERNAME'),
    password:   env.get('SYS_EXPORT_2_SYS_EXPORT_PASSWORD'),
    database:   env.get('SYS_EXPORT_2_SYS_EXPORT_DATABASE'),

    entities: [
        resolve(import.meta.dirname, 'entities/*.entity.{ts,js}')
    ],

    migrations: [
        resolve(import.meta.dirname, 'migrations/*.{ts,js}')
    ],

    options: {
        trustServerCertificate: true
    }
});