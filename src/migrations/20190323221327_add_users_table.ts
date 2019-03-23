import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('users', (t) => {
    t.increments('id')
      .primary()
      .notNullable()

    t.string('nickname')
      .notNullable()

    t.string('email')
      .notNullable()

    t.string('password')
      .notNullable()

    t.timestamps()

  })
}


export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('users')
}

