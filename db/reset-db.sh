#!/bin/bash

# Reset database script for bookstore inventory management system
# This script drops and recreates the database with test data

echo "Resetting bookstore inventory database..."

# Get the container ID of the PostgreSQL container
POSTGRES_CONTAINER=$(docker ps -qf "name=postgres")

if [ -z "$POSTGRES_CONTAINER" ]; then
  echo "Error: PostgreSQL container not found. Make sure the container is running."
  exit 1
fi

# Execute SQL commands to drop and recreate the database
echo "Dropping and recreating database..."
docker exec -i $POSTGRES_CONTAINER psql -U bookstore -d postgres <<EOF
DROP DATABASE IF EXISTS bookstore_inventory;
CREATE DATABASE bookstore_inventory;
EOF

if [ $? -ne 0 ]; then
  echo "Error: Failed to drop and recreate database."
  exit 1
fi

# Apply schema
echo "Applying schema..."
docker exec -i $POSTGRES_CONTAINER psql -U bookstore -d bookstore_inventory <db/init/01-schema.sql

if [ $? -ne 0 ]; then
  echo "Error: Failed to apply schema."
  exit 1
fi

# Load test data
echo "Loading test data..."
docker exec -i $POSTGRES_CONTAINER psql -U bookstore -d bookstore_inventory <db/init/02-test-data.sql

if [ $? -ne 0 ]; then
  echo "Error: Failed to load test data."
  exit 1
fi

echo "Database reset completed successfully!"
echo "The database has been reset with fresh test data."
