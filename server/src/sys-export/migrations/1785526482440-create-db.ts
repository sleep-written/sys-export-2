import type { DeepPartial, EntityTarget, MigrationInterface, QueryRunner } from 'typeorm';

import { UserType } from '@sys-export/entities/user-type.entity.js';

export class CreateDb1785526482440 implements MigrationInterface {
    name = 'CreateDb1785526482440';

    async #createAndSave<T>(
        { manager }: QueryRunner,
        target: EntityTarget<T>,
        data: DeepPartial<T>
    ): Promise<T> {
        const item = manager.create(target, data);
        return manager.save(item);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `--sql
            CREATE TABLE "User" (
                "id"            int             NOT NULL IDENTITY(1,1),
                "username"      varchar(32)     NOT NULL,
                "password"      varchar(128)    NOT NULL,
                "userTypeId"    int,
                CONSTRAINT      "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id")
            )`
        );

        await queryRunner.query(
            `--sql
            CREATE TABLE "UserType" (
                "id"            int             NOT NULL IDENTITY(1,1),
                "code"          varchar(32)     NOT NULL,
                "description"   nvarchar(128)   NOT NULL,
                "system"        bit             NOT NULL,
                "guest"         bit             NOT NULL,
                CONSTRAINT      "PK_90a6f7364dbf2de4b666984b419"
                PRIMARY KEY     ("id")
            )`
        );

        await queryRunner.query(
            `--sql
            ALTER TABLE "User" ADD
            CONSTRAINT  "FK_acea3e81de70fa86f694093de1f"
            FOREIGN KEY ("userTypeId")
            REFERENCES  "UserType"("id")
            ON DELETE   NO ACTION
            ON UPDATE   NO ACTION`
        );

        await this.#createAndSave(queryRunner, UserType, {
            code: 'SYSTEM',
            guest: false,
            system: true,
            description: 'Usuario con los permisos máximos del sistema'
        });

        await this.#createAndSave(queryRunner, UserType, {
            code: 'COMEX',
            guest: false,
            system: false,
            description: 'Usuario pertenenciente al área de comercio exterior'
        });

        await this.#createAndSave(queryRunner, UserType, {
            code: 'GUEST',
            guest: true,
            system: false,
            description: 'Usuario sin identificar'
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_acea3e81de70fa86f694093de1f"`);
        await queryRunner.query(`DROP TABLE "UserType"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }
}
