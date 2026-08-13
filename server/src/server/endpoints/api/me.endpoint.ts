import { EndpointError } from '@/server/endpoint-error.js';
import { User } from '@sys-export/entities/user.entity.js';
import { Router } from 'express';

export const meEndpoint = Router().get('', async (req, res) => {
    try {
        const me = typeof req.session.userId === 'number'
        ?   await User.findOne({
                where:      { id: req.session.userId },
                relations:  { userType: true }
            })
        :   undefined;

        if (me) {
            res.json({
                username: me.username,
                userType: me.userType!.code
            });
        } else {
            res.json(undefined);
        }
    } catch (err) {
        EndpointError.end(err, res);
    }
});