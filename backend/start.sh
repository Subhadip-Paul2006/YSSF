#!/bin/sh

echo "=== YSSF Backend Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo 'yes' || echo 'no')"

# Start the app immediately (prisma db push runs in background)
echo "Starting app on port $PORT..."
exec node dist/index.js
