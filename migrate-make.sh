#!/usr/bin/env bash


node -r ts-node/register \
  ./node_modules/.bin/knex --knexfile knexfile.ts \
   migrate:make -x ts "$1"
