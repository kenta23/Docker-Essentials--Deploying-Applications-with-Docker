#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
until bunx prisma db push > /dev/null 2>&1
do
  echo "Waiting for database connection..."
  sleep 5
done

echo "PostgreSQL is up and running!"

# Run Prisma migrations
bunx prisma generate
bunx prisma db push || bunx prisma migrate dev

# Start the application
exec "$@"
