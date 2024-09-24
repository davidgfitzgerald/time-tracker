# Base image for Node.js
FROM node:18-alpine

# Env vars
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}

# Set working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your app will run
EXPOSE 5173

# Build the Svelte app (production build if needed)
RUN npm run build

# Command to start the app (assuming your app runs with 'npm run dev' for development or 'npm start' for production)
CMD ["npm", "run", "dev"]
