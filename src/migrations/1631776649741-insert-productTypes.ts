import { MigrationInterface, QueryRunner } from 'typeorm';
import { ProductTypes } from '../common/constants/product-types';

export class insertProductTypes1631776649741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    ProductTypes.map(async (item) => {
      await queryRunner.query(
        `INSERT INTO "productTypes" (name) VALUES ('${item}')`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "productTypes"');
  }
}
