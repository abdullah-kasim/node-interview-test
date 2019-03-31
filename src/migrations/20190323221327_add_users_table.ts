import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("users", t => {
    t.increments("id")
      .primary()
      .notNullable()

    t.string("nickname")
      .unique()
      .notNullable()

    t.string("email")
      .unique()
      .notNullable()

    t.string("password")
      .defaultTo(null)
      .nullable()

    t.boolean("is_firebase_account")
      .defaultTo(false)
      .notNullable()

    t.timestamps(false, true)
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw("drop table if exists users cascade")
}
