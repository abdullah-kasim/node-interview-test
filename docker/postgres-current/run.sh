#!/usr/bin/env bash

docker run --rm --name postgres-current -e POSTGRES_PASSWORD=docker -d -p 15432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
