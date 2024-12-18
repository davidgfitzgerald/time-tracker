
# -------- #
# app base #
# -------- #
FROM node:18-alpine AS app_base
WORKDIR /app
COPY package.json .

# Unsure exactly what this does?
RUN npm set progress=false && npm config set depth 0
RUN npm install

# --- #
# app #
# --- #

# Base image for Node.js
FROM app_base AS app
# copy production node_modules

# Port on which app will run
EXPOSE 5173

# Build arguments
ARG POSTGRES_PASSWORD
ARG POSTGRES_HOST
ARG POSTGRES_USER
ARG POSTGRES_PORT
ARG POSTGRES_DB

# Env vars
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}

# Work from /app
WORKDIR /app

# Copy dependencies from app_base
COPY --from=app_base /app/node_modules ./node_modules

# Copy source code
COPY ./src ./src
COPY ./static ./static
COPY svelte.config.js .
COPY vite.config.js .

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