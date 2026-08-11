import type { Relation } from 'typeorm';

import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from './user-type.entity.js';

@Entity({ name: 'User' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id?: number;

    @Column({ type: 'varchar', length: 32 })
    username!: string;

    @Column({ type: 'varchar', length: 128 })
    password!: string;

    @ManyToOne(_ => UserType, r => r.users)
    userType?: Relation<UserType>;
}