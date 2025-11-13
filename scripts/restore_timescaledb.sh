#!/usr/bin/env bash

file="${1:-docker-compose.yml}"

dump_cmd='pg_restore --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --format=c solar-panel.bak'

docker compose --file="$file" cp ./solar-panel.bak timescaledb:/home/postgres
docker compose --file="$file" exec timescaledb /bin/bash -c "$dump_cmd"