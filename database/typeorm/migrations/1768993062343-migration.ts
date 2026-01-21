import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1768993062343 implements MigrationInterface {
  name = 'Migration1768993062343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Movie" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "year" integer NOT NULL, "title" varchar(255) NOT NULL, "studios" text NOT NULL, "winner" boolean)`,
    );
    await queryRunner.query(
      `CREATE TABLE "Producer" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "name" varchar(255) NOT NULL, CONSTRAINT "UQ_a957990c02db6800706006c69fc" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie_producers_producer" ("movieId" varchar NOT NULL, "producerId" varchar NOT NULL, PRIMARY KEY ("movieId", "producerId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2da7ebb7e07c11646447fd4eba" ON "movie_producers_producer" ("movieId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3cf9363d9cc0d4a1bf396237ee" ON "movie_producers_producer" ("producerId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_2da7ebb7e07c11646447fd4eba"`);
    await queryRunner.query(`DROP INDEX "IDX_3cf9363d9cc0d4a1bf396237ee"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_movie_producers_producer" ("movieId" varchar NOT NULL, "producerId" varchar NOT NULL, CONSTRAINT "FK_2da7ebb7e07c11646447fd4eba0" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_3cf9363d9cc0d4a1bf396237ee8" FOREIGN KEY ("producerId") REFERENCES "Producer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("movieId", "producerId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_movie_producers_producer"("movieId", "producerId") SELECT "movieId", "producerId" FROM "movie_producers_producer"`,
    );
    await queryRunner.query(`DROP TABLE "movie_producers_producer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_movie_producers_producer" RENAME TO "movie_producers_producer"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2da7ebb7e07c11646447fd4eba" ON "movie_producers_producer" ("movieId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3cf9363d9cc0d4a1bf396237ee" ON "movie_producers_producer" ("producerId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_3cf9363d9cc0d4a1bf396237ee"`);
    await queryRunner.query(`DROP INDEX "IDX_2da7ebb7e07c11646447fd4eba"`);
    await queryRunner.query(
      `ALTER TABLE "movie_producers_producer" RENAME TO "temporary_movie_producers_producer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie_producers_producer" ("movieId" varchar NOT NULL, "producerId" varchar NOT NULL, PRIMARY KEY ("movieId", "producerId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "movie_producers_producer"("movieId", "producerId") SELECT "movieId", "producerId" FROM "temporary_movie_producers_producer"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_movie_producers_producer"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_3cf9363d9cc0d4a1bf396237ee" ON "movie_producers_producer" ("producerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2da7ebb7e07c11646447fd4eba" ON "movie_producers_producer" ("movieId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_3cf9363d9cc0d4a1bf396237ee"`);
    await queryRunner.query(`DROP INDEX "IDX_2da7ebb7e07c11646447fd4eba"`);
    await queryRunner.query(`DROP TABLE "movie_producers_producer"`);
    await queryRunner.query(`DROP TABLE "Producer"`);
    await queryRunner.query(`DROP TABLE "Movie"`);
  }
}
