import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class insertProductTypes1631696143521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'user',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true,
          isGenerated: true,
          length: '36',
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
          isNullable: true,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          isNullable: true,
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          isNullable: true,
          default: 'CURRENT_TIMESTAMP',
        },
      ],
    });

    await queryRunner.createTable(table);
    await queryRunner.query(
      "INSERT INTO `productTypes`('id', 'name', 'createdAt', 'updatedAt') VALUES (UUID(), 'Customer Journey Maps', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
