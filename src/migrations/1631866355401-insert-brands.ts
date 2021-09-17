import {MigrationInterface, QueryRunner} from "typeorm";
import { ProductTypes } from '../common/constants/product-types';

export class insertBrands1631866355401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
