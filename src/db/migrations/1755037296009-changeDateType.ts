import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDateType1755037296009 implements MigrationInterface {
  name = 'ChangeDateType1755037296009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD "date" date NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
