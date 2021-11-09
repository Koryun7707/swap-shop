import {MigrationInterface, QueryRunner} from "typeorm";
import { ProductTypes } from '../common/constants/product-types';

export class insertProductTypes1635830848061 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        Object.entries(ProductTypes).forEach(async ([key,value])=>{

            let size_group = await queryRunner.query(`select id from size_group where name = '${key}' limit 1`);
            let id = size_group[0]['id'];

            value.forEach(async (item) => {
                await queryRunner.query(
                  `INSERT INTO "productTypes" (name,"sizeGroupId") VALUES ('${item}','${id}')`,
                );
            });

        })



    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "productTypes"');
    }

}
