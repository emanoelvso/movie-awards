import knex from 'knex';
import path from 'path';

export const testDbClient = knex({
  client: 'better-sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.join(process.cwd() + '/database/database.sqlite'),
  },
  searchPath: ['movie', 'producer', 'public'],
});
