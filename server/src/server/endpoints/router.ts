import { Router } from 'express';

import { clientEndpoint } from './client.endpoint.js';
import { apiRouter } from './api/router.js';

export const endpointsRouter = Router()
    .use('/api', apiRouter)
    .use('/', clientEndpoint);