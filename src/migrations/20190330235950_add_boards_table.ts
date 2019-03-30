import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await knex.schema.createTable('boards', t => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1()'))
      .notNullable();

    t.string('name').notNullable();

    t.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('boards');
}
