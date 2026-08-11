import type { Relation } from 'typeorm';

import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from './user-type.entity.js';
import { Menu } from './menu.entity.js';

@Entity({ name: 'MenuPermission' })
export class MenuPermission extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id?: number;

    @ManyToOne(_ => Menu, r => r.menuPermissions)
    menu?: Relation<Menu>;

    @ManyToOne(_ => UserType, r => r.menuPermissions)
    userType?: Relation<UserType>;
}