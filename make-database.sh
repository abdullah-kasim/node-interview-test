#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"



docker exec -it postgres-current /bin/sh -c "PGPASSWORD=docker psql -h localhost -U postgres -d postgres -c 'create database todo'"
docker exec -it postgres-current /bin/sh -c "PGPASSWORD=docker psql -h localhost -U postgres -d todo -c 'create schema todo'"
