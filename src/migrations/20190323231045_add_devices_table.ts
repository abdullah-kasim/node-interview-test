import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('devices', t => {
    t.increments('id')
      .primary()
      .notNullable();

    t.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .notNullable();

    t.string('refresh_token')
      .unique()
      .notNullable();

    t.string('type').notNullable();

    t.string('firebase_cloud_token')
      .unique()
      .nullable();

    t.string('device_id')
      .unique()
      .notNullable();

    t.unique(['user_id', 'device_id']);

    t.timestamp('expire_at').notNullable();

    t.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('devices');
}
