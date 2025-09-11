#!/bin/bash

# Script to run the application in Docker with proper MySQL connection

echo "Setting up Docker environment for MySQL connection..."

# Option 1: Run with host.docker.internal (recommended)
echo "Running with host.docker.internal..."
docker run -p 3000:3333 \
  -e DATABASE_HOST=host.docker.internal \
  -e DATABASE_PORT=3306 \
  -e DATABASE_NAME=realworld \
  -e DATABASE_USERNAME=realworld_user \
  -e DATABASE_PASSWORD=realworld_password \
  -e DEVELOPMENT=DEVELOPMENT \
  -e JWT_SECRET=your-super-secret-jwt-key \
  -e PORT=3333 \
  -v .:/usr/src/app \
  --name next-realworld-api-dev \
  next-realworld-api-dev:latest
