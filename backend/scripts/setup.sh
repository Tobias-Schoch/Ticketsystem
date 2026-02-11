#!/bin/bash
set -e

echo "=== Ticketsystem Backend Setup ==="

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and set proper JWT secrets before production!"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed database (only if admin doesn't exist)
echo "Seeding database..."
npm run db:seed || echo "Seed skipped (admin may already exist)"

echo ""
echo "=== Setup complete! ==="
echo "Run 'npm run dev' to start the development server"
echo "Run 'npm run build && npm start' for production"
