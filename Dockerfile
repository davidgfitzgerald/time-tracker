# --- #
# app #
# --- #

# Base image for Node.js
FROM node:18-alpine AS app

# Port on which app will run
EXPOSE 5173

# Env vars
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}

# Setup
WORKDIR /app
COPY . .
RUN npm install

# Build
RUN npm run build

# Run
CMD ["npm", "run", "dev"]

# ---#
# db #
# ---#

# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest AS db

# Copy the schema.sql file into the Docker container
COPY db/schema.sql /docker-entrypoint-initdb.d/
COPY db/seed.sql /docker-entrypoint-initdb.d/
