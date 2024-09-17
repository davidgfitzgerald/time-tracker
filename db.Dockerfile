# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Copy the schema.sql file into the Docker container
COPY src/lib/db/schema.sql /docker-entrypoint-initdb.d/
COPY src/lib/db/seed.sql /docker-entrypoint-initdb.d/
