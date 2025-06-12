#!/bin/bash

echo "🚀 Creating final clean deployment..."

# Remove any existing deployment directory
rm -rf final-deploy

# Create clean deployment structure
mkdir -p final-deploy/app
mkdir -p final-deploy/components
mkdir -p final-deploy/lib
mkdir -p final-deploy/public

# Copy essential configuration files (working ones)
cp package.json final-deploy/
cp vercel.json final-deploy/
cp next.config.js final-deploy/
cp tailwind.config.js final-deploy/
cp postcss.config.cjs final-deploy/
cp middleware.ts final-deploy/
cp tsconfig-fixed.json final-deploy/tsconfig.json

# Copy working source files
cp app/layout.tsx final-deploy/app/
cp app/page.tsx final-deploy/app/
cp app/providers.tsx final-deploy/app/
cp app/globals.css final-deploy/app/

# Copy essential components
cp components/Navigation.tsx final-deploy/components/

# Copy lib files
cp lib/firebase.ts final-deploy/lib/

# Create a clean .gitignore
cat > final-deploy/.gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
.next/
out/
build/

# Environment variables
.env*

# Logs
logs
*.log

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

# Create a basic README
cat > final-deploy/README.md << 'EOF'
# CalificaTuProfe

Dominican Republic Rate My Professor Platform with AI-Powered Analytics.

## Getting Started

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Deployment

This project is configured for deployment on Vercel with automatic dependency resolution.
EOF

echo "✅ Final deployment ready in final-deploy/"
echo "📦 Files: $(find final-deploy -type f | wc -l)"
echo "📏 Size: $(du -sh final-deploy/)"
echo ""
echo "🔥 Ready to upload to GitHub!" 