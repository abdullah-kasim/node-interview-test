#!/usr/bin/env bash

# This script should only be run for testing - it's destroyed after it has done its job!

docker run --rm --name postgres-test -e POSTGRES_PASSWORD=docker -d -p 15433:5432 postgres
