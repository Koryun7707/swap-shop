import { MigrationInterface, QueryRunner } from 'typeorm';
import { Brands } from '../common/constants/brands';

export class insertBrands1631866355401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    Brands.map(async (item) => {
      await queryRunner.query(`INSERT INTO "brands" (name) VALUES ('${item}')`);
    });
  }


  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "brands"');
  }
}
