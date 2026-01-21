import { DataSource } from 'typeorm';
import path from 'path';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: path.join(process.cwd() + '/database/database.sqlite'), // File path for your SQLite database
  synchronize: false, // Set to false when using migrations
  logging: true,
  entities: [path.join(process.cwd() + '/src/**/*entity.ts')], // Path to your entity files
  migrations: [path.join(process.cwd() + '/database/typeorm/migrations/*.ts')], // Path to your migration files
  // subscribers: ['src/subscriber/**/*.ts'],
  // CLI configuration for where to output generated files
  // cli: {
  //   entitiesDir: 'src/entity',
  //   migrationsDir: 'src/migration',
  //   subscribersDir: 'src/subscriber',
  // },
});

export default AppDataSource;
