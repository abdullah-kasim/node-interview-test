#!/usr/bin/env bash


node -r ts-node/register \
  ./node_modules/.bin/knex --knexfile knexfile.ts \
   seed:make -x ts "$1"
