import { Router } from 'express';
import { menuEndpoint } from './menu.endpoint.js';

export const apiRouter = Router()
    .use('/menu', menuEndpoint);