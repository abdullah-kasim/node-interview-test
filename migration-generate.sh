#!/usr/bin/env bash

# reference: https://medium.com/@samratshaw/sequelize-cli-migrations-with-typescript-bd1bd41cbd6
# example: ./migration-generate.sh add_users_table


cat > ./src/migrations/$(date +"%Y%m%d%H%M%S")-$1.ts << EOF
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {

  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {

  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {

  },
};
EOF
