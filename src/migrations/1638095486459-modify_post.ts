import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyPost1638095486459 implements MigrationInterface {
  name = 'modifyPost1638095486459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "createdAt"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
    await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "updatedAt"
            SET DEFAULT ('now'::text)::timestamp(6) with time zone
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "updatedAt"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "createdAt"
            SET DEFAULT now()
        `);
  }
}
