#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"



docker exec -it postgres-current "PGPASSWORD=todo psql -h localhost -d postgres -c 'create database todo'"
docker exec -it postgres-current "PGPASSWORD=todo psql -h localhost -d todo -c 'create schema todo'"
