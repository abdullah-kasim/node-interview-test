#!/usr/bin/env bash

docker run --rm --name mailhog -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
