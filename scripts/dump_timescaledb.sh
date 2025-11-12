#!/usr/bin/env bash

file="${1:-docker-compose.yml}"

dump_cmd='pg_dump --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --format=c --file=solar-panel.bak'

docker compose --file="$file" exec timescaledb /bin/bash -c "$dump_cmd"
docker compose --file="$file" cp timescaledb:/home/postgres/solar-panel.bak .