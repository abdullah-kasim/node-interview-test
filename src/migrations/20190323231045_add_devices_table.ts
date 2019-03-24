import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('devices', (t) => {
    t.increments('id')
      .primary()
      .notNullable()

    t.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .notNullable()

    t.string('refresh_token')
      .notNullable()

    t.string('type')
      .notNullable()

    t.string('firebase_token')
      .nullable()

    t.string('device_id')
      .notNullable()

    t.unique(['user_id', 'device_id'])

    t.timestamp('expire_at')
      .notNullable()
    t.timestamps()
  })
}


export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('devices')
}

