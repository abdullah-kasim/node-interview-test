import { QueryInterface, Sequelize } from 'sequelize';
import {DataType} from "sequelize-typescript";

module.exports = {

  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: 'SERIAL'
      },
      nickname: {
        type: 'varchar(255)',
        allowNull: false,
      },
      email: {
        type: 'varchar(255)',
        unique: true,
        allowNull: false,
      },
      password: {
        type: 'varchar(255)',
        unique: true,
        allowNull: false,
      },
      created_at: {
        type: 'timestamptz',
        allowNull: false,
        defaultValue: 'now()'
      },
      updated_at: {
        type: 'timestamptz',
        allowNull: false,
        defaultValue: 'now()'
      },
    })
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.dropTable('users', {
      cascade: true,
    })
  },
};
