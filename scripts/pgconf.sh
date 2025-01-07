#!/bin/bash

# File to write
PG_SERVICE_CONF=~/.pg_service.conf

# Check if the file exists
if [ -f "$PG_SERVICE_CONF" ]; then
  echo "The file $PG_SERVICE_CONF already exists."
  read -p "Are you sure you want to overwrite it? (y/n): " choice
  case "$choice" in
    y|Y ) echo "Overwriting $PG_SERVICE_CONF...";;
    n|N ) echo "Aborting"; exit 1;;
    * ) echo "Invalid choice. Aborting."; exit 1;;
  esac
fi

echo "Initialising $PG_SERVICE_CONF"

cat <<EOF > $PG_SERVICE_CONF
# Enter your prod postgres host/user/dbname credentials
[rds]
host=
user=
dbname=

[local]
host=127.0.0.1
user=admin
dbname=time_tracker
password=password
EOF

vim "$PG_SERVICE_CONF"