# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Environment variables for PostgreSQL
# ENV POSTGRES_USER=admin
# ENV POSTGRES_PASSWORD=password
# ENV POSTGRES_DB=taskdb

# Copy the schema.sql file into the Docker container
COPY db/schema.sql /docker-entrypoint-initdb.d/
