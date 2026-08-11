import type { DeepPartial, EntityTarget, MigrationInterface, QueryRunner } from 'typeorm';

import { MenuPermission } from '@sys-export/entities/menu-permission.entity.js';
import { UserType } from '@sys-export/entities/user-type.entity.js';
import { Menu } from '@sys-export/entities/menu.entity.js';

export class CreateMenu1786456969322 implements MigrationInterface {
    name = 'CreateMenu1786456969322';

    async #createAndSave<T>(
        { manager }: QueryRunner,
        target: EntityTarget<T>,
        data: DeepPartial<T>
    ): Promise<T> {
        const item = manager.create(target, data);
        return manager.save(item);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Menu" ("id" int NOT NULL IDENTITY(1,1), "icon" varchar(64) NOT NULL, "text" nvarchar(128) NOT NULL, "path" varchar(512), "parentId" int, CONSTRAINT "PK_b2683c330c5e6d700266a6f46d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "MenuPermission" ("id" int NOT NULL IDENTITY(1,1), "menuId" int, "userTypeId" int, CONSTRAINT "PK_285c0dfd4d275912cbe9923fe50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Menu" ADD CONSTRAINT "FK_c4c5fa3bc158c089f076ec35d08" FOREIGN KEY ("parentId") REFERENCES "Menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MenuPermission" ADD CONSTRAINT "FK_88aa6689e7eaba9af95a7fe0982" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MenuPermission" ADD CONSTRAINT "FK_f8169311232c380f2f2431c899c" FOREIGN KEY ("userTypeId") REFERENCES "UserType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        const systemType = await queryRunner.manager.findOneByOrFail(UserType, {
            code: 'SYSTEM'
        });

        const guestType = await queryRunner.manager.findOneByOrFail(UserType, {
            code: 'GUEST'
        });

        const loginMenu = await this.#createAndSave(queryRunner, Menu, {
            icon: 'login',
            text: 'Iniciar sesión',
            path: '/login'
        });

        const logoutMenu = await this.#createAndSave(queryRunner, Menu, {
            icon: 'logout',
            text: 'Cerrar sesión',
            path: '/logout'
        });

        await this.#createAndSave(queryRunner, MenuPermission, { menu: loginMenu,   userType: guestType });
        await this.#createAndSave(queryRunner, MenuPermission, { menu: logoutMenu,  userType: systemType });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MenuPermission" DROP CONSTRAINT "FK_f8169311232c380f2f2431c899c"`);
        await queryRunner.query(`ALTER TABLE "MenuPermission" DROP CONSTRAINT "FK_88aa6689e7eaba9af95a7fe0982"`);
        await queryRunner.query(`ALTER TABLE "Menu" DROP CONSTRAINT "FK_c4c5fa3bc158c089f076ec35d08"`);
        await queryRunner.query(`DROP TABLE "MenuPermission"`);
        await queryRunner.query(`DROP TABLE "Menu"`);
    }

}
