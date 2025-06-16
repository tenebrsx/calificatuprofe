#!/bin/bash

# Create a clean deployment directory
mkdir -p deploy-clean

# Copy only essential files/directories
cp -r app/ deploy-clean/
cp -r components/ deploy-clean/
cp -r lib/ deploy-clean/
cp -r public/ deploy-clean/
cp -r utils/ deploy-clean/
cp -r prisma/ deploy-clean/
cp package.json deploy-clean/
cp vercel.json deploy-clean/
cp tsconfig.json deploy-clean/
cp next.config.js deploy-clean/
cp tailwind.config.js deploy-clean/
cp .gitignore deploy-clean/
cp middleware.ts deploy-clean/

echo "Clean deployment files ready in deploy-clean/"
echo "Size: $(du -sh deploy-clean/)" 