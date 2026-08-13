import { Router } from 'express';
import { IsNull } from 'typeorm';

import { UserType } from '@sys-export/entities/user-type.entity.js';
import { Menu } from '@sys-export/entities/menu.entity.js';

async function getDescendants(userType: UserType, menu?: Menu): Promise<Menu[]> {
    const children = await Menu.findBy({
        menuPermissions: {
            userType: { id: userType.id }
        },
        parent: typeof menu?.id === 'number'
        ?   { id: menu.id  }
        :   { id: IsNull() }
    });

    for (const child of children) {
        child.children = await getDescendants(userType, child);
    }

    return children;
}

export const menuEndpoint = Router().get('', async (req, res) => {
    let userType = typeof req.session.userId === 'number'
    ?   await UserType.findOneByOrFail({ users: { id: req.session.userId } })
    :   undefined;

    if (!userType) {
        userType = await UserType.findOneByOrFail({ guest: true });
    }

    const json = await getDescendants(userType);
    res.json(json);
});