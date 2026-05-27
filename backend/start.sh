#!/bin/sh

echo "=== YSSF Backend Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Run prisma db push in background with timeout
(
  echo "Running prisma db push..."
  timeout 60 npx prisma db push --accept-data-loss 2>&1
  echo "prisma db push done (exit: $?)"
) &

# Start the app immediately
echo "Starting app on port $PORT..."
exec node dist/index.js
