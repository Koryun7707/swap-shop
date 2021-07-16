import {MigrationInterface, QueryRunner} from "typeorm";

export class uppp1626437415726 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          'ALTER TABLE `product` ALTER COLUMN `dropOff` SET NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
