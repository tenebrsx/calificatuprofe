#!/bin/bash

# Create ultra-minimal deployment
mkdir -p minimal-deploy

# Copy ONLY the most essential files
cp package.json minimal-deploy/
cp vercel.json minimal-deploy/
cp next.config.js minimal-deploy/
cp tailwind.config.js minimal-deploy/
cp tsconfig.json minimal-deploy/
cp .gitignore minimal-deploy/
cp middleware.ts minimal-deploy/

# Copy essential directories but only specific files
mkdir -p minimal-deploy/app
cp app/layout.tsx minimal-deploy/app/
cp app/page.tsx minimal-deploy/app/
cp app/globals.css minimal-deploy/app/

mkdir -p minimal-deploy/components
cp components/Navigation.tsx minimal-deploy/components/

echo "Minimal deployment ready!"
echo "Files: $(find minimal-deploy -type f | wc -l)"
echo "Size: $(du -sh minimal-deploy/)" 