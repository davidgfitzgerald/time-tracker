#!/bin/bash

ENV=${1:-dev}

if [[ $ENV = 'prod' ]]; then
    SERVICE=rds
else
    SERVICE=local
fi

echo "Using env: $ENV"
echo "Using service: $SERVICE"
echo "Wiping DB"

if [[ $confirm != [yY] ]]; then
    echo "Aborting"
    exit 1
fi

psql service=${SERVICE} -f db/wipe.sql