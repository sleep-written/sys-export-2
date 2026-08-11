import type { Relation } from 'typeorm';

import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuPermission } from './menu-permission.entity.js';

@Entity({ name: 'Menu' })
export class Menu extends BaseEntity {
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