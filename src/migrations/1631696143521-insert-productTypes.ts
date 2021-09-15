import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertProductTypes1631696143521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO `productTypes`(`id`, `name`, `createdAt`, `updatedAt`) VALUES (UUID(), "Customer Journey Maps", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
