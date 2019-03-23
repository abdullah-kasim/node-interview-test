#!/usr/bin/env bash

# This script should only be run for testing - it's destroyed after it has done its job!

docker run --rm --name pg-docker-test -e POSTGRES_PASSWORD=docker -d -p 15433:15433 postgres
