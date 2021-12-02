import {MigrationInterface, QueryRunner} from "typeorm";

export class addTokenField1638268047523 implements MigrationInterface {
    name = 'addTokenField1638268047523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "currentHashedRefreshToken" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "currentHashedRefreshToken"
        `);
    }

}
