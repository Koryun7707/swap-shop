import * as dotenv from 'dotenv';

dotenv.config({
  path: `.${process.env.NODE_ENV}.env`,
});
module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  autoLoadEntities: true,
  migrations: ['src/migrations/*{.ts}'],
  entities: ['src/**/*.entity{.ts,}'],
  migrationsRun: true,
};
// module.exports = {
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: +process.env.DB_PORT,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   namingStrategy: new SnakeNamingStrategy(),
//   entities: ['src/modules/**/*.entity{.ts,.js}'],
//   migrations: ['src/migrations/*{.ts,.js}'],
// };
