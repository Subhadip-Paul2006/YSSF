#!/bin/sh
set -e

echo "=== YSSF Backend Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo 'yes' || echo 'no')"

echo ""
echo "Running prisma db push..."
npx prisma db push --accept-data-loss 2>&1
echo "prisma db push exit code: $?"

echo ""
echo "Starting application on port $PORT..."
exec node dist/index.js
