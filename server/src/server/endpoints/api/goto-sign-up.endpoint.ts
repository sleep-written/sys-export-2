import { User } from '@sys-export/entities/user.entity.js';
import { Router } from 'express';

export const gotoSignUpEndpoint = Router().get('', async (req, res) => {
    const count = await User.countBy({
        userType: { system: true }
    });

    res.json(count === 0);
});