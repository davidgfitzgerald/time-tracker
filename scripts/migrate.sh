#!/bin/sh

psql service=rds -f db/schema.sql
psql service=rds -f db/seed.sql