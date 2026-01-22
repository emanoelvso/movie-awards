import { DataSource } from 'typeorm';
import path from 'path';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: path.join(process.cwd() + '/database/database.sqlite'),
  synchronize: false,
  logging: true,
  entities: [path.join(process.cwd() + '/src/**/*entity.ts')],
  migrations: [path.join(process.cwd() + '/database/typeorm/migrations/*.ts')],
});

export default AppDataSource;
