import * as path from 'path';
import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

export const DatabaseConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations//*{.ts,.js}'],
  synchronize: true,
  migrationsRun: false,
};

export default DatabaseConfig;
