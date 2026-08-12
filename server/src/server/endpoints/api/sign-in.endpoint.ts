import { Auditor } from 'audit-var';
import { Router } from 'express';
import { verify } from 'argon2';

import { sysExportDataSource } from '@sys-export/data-source.js';
import { EndpointError } from '@/server/endpoint-error.js';
import { User } from '@sys-export/entities/user.entity.js';

const auditor = new Auditor({
    type: 'object',
    keys: {
        username: { type: 'string', min: 1, max: 24 },
        password: { type: 'string', min: 1, max: 32 }
    }
});

export const signInEndpoint = Router().post('', async (req, res) => {
    try {
        await sysExportDataSource.transaction('SERIALIZABLE', async m => {
            const { username, password } = auditor.audit(req.body);
            const user = await m.findOneBy(User, { username });
            if (!user || !await verify(user.password, password)) {
                throw new EndpointError(404, 'Usuario o contraseña inválida');
            }

            req.session.userId = user.id;
            req.session.save();
            res.end();
        });
    } catch (err) {
        EndpointError.end(err, res);
    }
});