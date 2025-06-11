# Clean Website Copy - Rate My Professor

This is a clean copy of the Rate My Professor website containing only the essential components needed to run the application, without the bloated dependencies and generated files.

## What's Included

### Core Application Files:
- `app/` - Next.js App Router pages and layouts
- `components/` - React components for the UI
- `lib/` - Utility functions and Firebase configuration
- `utils/` - Additional utility functions
- `data/` - Application data files
- `public/` - Static assets (images, icons, etc.)
- `pages/api/` - API routes

### Configuration Files:
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.cjs` - PostCSS configuration
- `middleware.ts` - Next.js middleware
- `next-env.d.ts` - Next.js TypeScript definitions

### Firebase Configuration:
- `firebase.json` - Firebase project configuration
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules
- `firestore.indexes.json` - Firestore indexes

## What's NOT Included (Bloated Dependencies):
- `node_modules/` - Install with `npm install`
- `.next/` - Generated during build process
- `package-lock.json` - Will be regenerated
- `.git/` - Version control history
- Various cache and temporary files

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file with your Firebase and other configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... add other necessary environment variables
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## File Size Comparison
- Original project with dependencies: ~500MB+ (with node_modules)
- Clean copy: ~50MB (essential files only)

This clean copy contains everything needed to recreate the full functionality of the website while being much more portable and manageable. 