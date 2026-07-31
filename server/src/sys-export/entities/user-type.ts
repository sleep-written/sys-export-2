import type { Relation } from 'typeorm';

import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'UserType' })
export class UserType extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id?: number;

    @Column({ type: 'varchar', length: 32 })
    code!: string;

    @Column({ type: 'nvarchar', length: 128 })
    description!: string;

    @Column({ type: 'bit' })
    system!: boolean;

    @OneToMany(_ => User, r => r.userType)
    users?: Relation<User[]>;
}