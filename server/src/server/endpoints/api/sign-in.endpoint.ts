import { Auditor } from 'audit-var';
import { Router } from 'express';
import { hash, verify } from 'argon2';
import { rateLimit } from 'express-rate-limit';

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

// Hash "de relleno" para verificar contra él cuando el usuario no existe, así
// verify() siempre corre y el tiempo de respuesta no delata usuarios válidos.
const dummyHash = await hash('sys-export-2-dummy-password', { hashLength: 32 });

// Limita los intentos de login por IP para frenar fuerza bruta / credential stuffing.
const signInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

export const signInEndpoint = Router().post('', signInLimiter, async (req, res) => {
    try {
        await sysExportDataSource.transaction('SERIALIZABLE', async m => {
            const { username, password } = auditor.audit(req.body);
            const user = await m.findOneBy(User, { username });
            const valid = await verify(user?.password ?? dummyHash, password);

            if (!user || !valid) {
                throw new EndpointError(404, 'Usuario o contraseña inválida');
            }

            await new Promise<void>((resolve, reject) => {
                req.session.regenerate(err => err ? reject(err) : resolve());
            });

            req.session.userId = user.id;
            req.session.save();
            res.end();
        });
    } catch (err) {
        EndpointError.end(err, res);
    }
});