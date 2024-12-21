#!/bin/bash

# Exit immediately if any command fails
set -e

# The full path to this dir, e.g.: ~/code/time-tracker/scripts
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Dump prod DB
PROD_SQL_DUMP="timetracker-prod.sql"
echo "Dumping prod DB to ${PROD_SQL_DUMP}"
pg_dump service=rds -F p -f ${PROD_SQL_DUMP}

# Dump local DB
DEB_SQL_DUMP="timetracker-dev.sql"
echo "Dumping dev DB to ${DEB_SQL_DUMP}"
pg_dump service=rds -F p -f ${DEB_SQL_DUMP}

# Wipe the local DB
echo "Wiping local DB"
psql service=local -f db/wipe.sql

# Load prod data locally
echo "Loading prod data locally"
psql service=local -f ${PROD_SQL_DUMP}
