import { EndpointError } from '@/server/endpoint-error.js';
import { Router } from 'express';

export const signOutEndpoint = Router().get('', async (req, res) => {
    try {
        delete req.session.userId;
        req.session.save();

        await new Promise(r => setTimeout(r, 1500));
        res.end();
    } catch (err) {
        EndpointError.end(err, res);
    }
});