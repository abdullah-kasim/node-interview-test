import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('board_user', t => {
    t.increments('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1()'))
      .notNullable();
    t.uuid('board_id')
      .index()
      .notNullable()
      .references('id')
      .inTable('boards')
      .onDelete('cascade');

    t.integer('user_id')
      .index()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('cascade');

    t.string('type').notNullable();

    t.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('items');
}
