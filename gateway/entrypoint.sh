#!/bin/sh

# Wait for database to be ready
sleep 5

# Push Prisma schema to the database
pnpm exec prisma db push --skip-generate

# Start the application
node dist/index.js
