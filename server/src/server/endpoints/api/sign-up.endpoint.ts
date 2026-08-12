import { Auditor } from 'audit-var';
import { Router } from 'express';
import { hash } from 'argon2';

import { sysExportDataSource } from '@sys-export/data-source.js';
import { EndpointError } from '@/server/endpoint-error.js';
import { UserType } from '@sys-export/entities/user-type.entity.js';
import { User } from '@sys-export/entities/user.entity.js';

const auditor = new Auditor({
    type: 'object',
    keys: {
        username: { type: 'string', min: 4, max: 24 },
        password: { type: 'string', min: 8, max: 32 }
    }
});

export const signUpEndpoint = Router().post('', async (req, res) => {
    await sysExportDataSource.transaction('SERIALIZABLE', async m => {
        try {
            const count = await m.countBy(User, { userType: { system: true } });
            if (count > 0) {
                throw new EndpointError(409, 'Ya existe un usuario con permisos máximos en el sistema');
            }
            
            const { username, password } = auditor.audit(req.body);
            const user = new User();
            user.username = username;
            user.password = await hash(password, { hashLength: 32 });
            user.userType = await m.findOneByOrFail(UserType, { system: true });

            await m.save(user);
            res.end();
        } catch (err) {
            EndpointError.end(err, res);
        }
    });
});