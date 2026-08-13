import type { EntityManager, Relation } from 'typeorm';
import type { UserType } from './user-type.entity.js';

import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuPermission } from './menu-permission.entity.js';

type MenuDeclaration = Omit<Menu, 'menuPermissions' | 'children' | keyof BaseEntity> & {
    userTypes: UserType[];
    children?: MenuDeclaration[];
};

@Entity({ name: 'Menu' })
export class Menu extends BaseEntity {
    static async generate(manager: EntityManager, data: MenuDeclaration): Promise<Menu> {
        const menu = manager.create(Menu, {
            parent: data.parent,
            icon: data.icon,
            text: data.text,
            path: data.path
        });

        await manager.save(menu);
        for (const userType of data.userTypes ?? []) {
            const menuPermission = manager.create(MenuPermission, { menu, userType });
            await manager.save(menuPermission);
        }

        const children: Menu[] = [];
        for (const child of data.children ?? []) {
            const innerMenu = await Menu.generate(manager, {
                parent: menu,
                ...child
            });

            delete innerMenu.parent;
            children.push(innerMenu);
        }

        menu.children = children;
        return menu;
    }

    @PrimaryGeneratedColumn({ type: 'int' })
    id?: number;
    
    @Column({ type: 'varchar', length: 64 })
    icon!: string;
    
    @Column({ type: 'nvarchar', length: 128 })
    text!: string;
    
    @Column({ type: 'varchar', length: 512, nullable: true })
    path!: string | null;

    @OneToMany(_ => Menu, r => r.parent)
    children?: Relation<Menu[]>;

    @ManyToOne(_ => Menu, r => r.children)
    parent?: Relation<Menu | null>;

    @OneToMany(_ => MenuPermission, r => r.menu)
    menuPermissions?: Relation<MenuPermission[]>;
}