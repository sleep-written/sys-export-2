import { Router } from 'express';

import { gotoSignUpEndpoint } from './goto-sign-up.endpoint.js';
import { signOutEndpoint } from './sign-out.endpoint.js';
import { signInEndpoint } from './sign-in.endpoint.js';
import { signUpEndpoint } from './sign-up.endpoint.js';
import { menuEndpoint } from './menu.endpoint.js';
import { meEndpoint } from './me.endpoint.js';

export const apiRouter = Router()
    .use('/goto-sign-up', gotoSignUpEndpoint)
    .use('/sign-out', signOutEndpoint)
    .use('/sign-in', signInEndpoint)
    .use('/sign-up', signUpEndpoint)
    .use('/menu', menuEndpoint)
    .use('/me', meEndpoint);