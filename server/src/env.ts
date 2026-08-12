import { Env } from '@utils/env';
import { resolve } from 'node:path';

const path = resolve(
    import.meta.dirname,
    '../../.env'
);

export const env = new Env(path);