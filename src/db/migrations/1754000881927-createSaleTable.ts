import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSaleTable1754000881927 implements MigrationInterface {
    name = 'CreateSaleTable1754000881927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "date" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
