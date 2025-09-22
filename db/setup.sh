#!/bin/bash

# Check if psql is installed
if ! command -v psql &> /dev/null
then
    echo "psql could not be found. Please install PostgreSQL client tools."
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]
then
    echo "DATABASE_URL is not set. Please set it in your .env file or environment."
    exit 1
fi

# Drop existing tables
echo "Dropping existing tables..."
psql $DATABASE_URL -f db/drop.sql

# Apply schema fixes
echo "Applying schema fixes..."
psql $DATABASE_URL -f db/fix-schema.sql

# Create tables
echo "Creating tables..."
psql $DATABASE_URL -f db/setup.sql

if [ $? -eq 0 ]
then
    echo "Database setup completed successfully!"
else
    echo "Database setup failed!"
    exit 1
fi