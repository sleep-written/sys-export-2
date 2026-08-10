import { DataSource } from 'typeorm';
import { resolve } from 'node:path';
import { Env } from '@utils/env';

const env = new Env(resolve(import.meta.dirname, '../../../.env'));
export const innovaDataSource = new DataSource({
    type:       'mssql',
    host:       env.get('SYS_EXPORT_2_INNOVA_HOST', { default: '127.0.0.1' }),
    port:       env.get('SYS_EXPORT_2_INNOVA_PORT', { default: 1433, callback: v => parseInt(v) }),
    username:   env.get('SYS_EXPORT_2_INNOVA_USERNAME'),
    password:   env.get('SYS_EXPORT_2_INNOVA_PASSWORD'),
    database:   env.get('SYS_EXPORT_2_INNOVA_DATABASE')
});