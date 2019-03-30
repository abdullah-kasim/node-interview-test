import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('items', t => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1()'))
      .notNullable();
    t.uuid('board_id')
      .index()
      .notNullable()
      .references('id')
      .inTable('boards')
      .onDelete('cascade');

    t.string('content').notNullable();

    t.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('items');
}
