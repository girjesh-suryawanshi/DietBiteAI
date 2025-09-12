#!/bin/bash

# Copy static SEO files to production directory
echo "Copying static files for production..."

# Create server/public directory if it doesn't exist
mkdir -p server/public

# Copy SEO files
cp public/sitemap.xml server/public/
cp public/robots.txt server/public/

echo "✅ Static files copied to server/public/ for production deployment"
echo "Files available at:"
echo "  - /sitemap.xml"
echo "  - /robots.txt"