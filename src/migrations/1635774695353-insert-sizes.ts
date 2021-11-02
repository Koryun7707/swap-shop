import {MigrationInterface, QueryRunner} from "typeorm";
import { sizes } from '../common/constants/sizes';

export class insertSizes1635774695354 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await Object.entries(sizes).forEach(async ([key,value]) => {

            await queryRunner.query(`INSERT INTO size_group (name) VALUES ('${key}')`);

            let b = await queryRunner.query(`select id from size_group where name = '${key}' limit 1`)
            let id = b[0]['id'];

                value.forEach(async (size) => {
                    // console.log(id);
                    await queryRunner.query(`INSERT INTO sizes (name,"sizeGroupId") VALUES ('${size}','${id}')`);
                })

        });
    }





    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "size_group"');
        await queryRunner.query('DELETE FROM "sizes"');
    }

}
