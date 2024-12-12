# --- #
# app #
# --- #

# Base image for Node.js
FROM node:18-alpine AS app

# Port on which app will run
EXPOSE 5173

# Build arguments
ARG POSTGRES_PASSWORD
ARG POSTGRES_HOST
ARG POSTGRES_USER
ARG POSTGRES_PORT
ARG POSTGRES_DB
ARG PLATFORM

# Env vars
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}
ENV PLATFORM=${PLATFORM}

# Setup
WORKDIR /app
COPY ./src ./src
COPY ./static ./static
COPY package.json .
COPY svelte.config.js .
COPY vite.config.js .

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
