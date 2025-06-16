// OAuth Configuration Checker
// Run this in your browser console on your Netlify site

console.log('🔍 OAuth Configuration Checker');
console.log('================================');

// Check current domain
const currentDomain = window.location.origin;
console.log('📍 Current Domain:', currentDomain);

// Check if NextAuth is configured
const nextAuthUrl = currentDomain + '/api/auth/providers';
console.log('🔗 NextAuth Providers URL:', nextAuthUrl);

// Expected Google OAuth redirect URI
const expectedRedirectUri = currentDomain + '/api/auth/callback/google';
console.log('🎯 Expected Google OAuth Redirect URI:', expectedRedirectUri);

console.log('\n📋 Configuration Checklist:');
console.log('1. Add this redirect URI to Google Cloud Console:');
console.log('   ' + expectedRedirectUri);
console.log('2. Set NEXTAUTH_URL environment variable to:');
console.log('   ' + currentDomain);
console.log('3. Ensure all other environment variables are set in Netlify');

// Test NextAuth providers endpoint
fetch(nextAuthUrl)
  .then(response => response.json())
  .then(data => {
    console.log('\n✅ NextAuth Providers Response:', data);
    if (data.google) {
      console.log('✅ Google provider is configured');
    } else {
      console.log('❌ Google provider not found');
    }
  })
  .catch(error => {
    console.log('❌ Error fetching providers:', error);
  });

// Check environment variables (client-side only)
console.log('\n🔧 Client-side Environment Check:');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Not set');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ Not set'); 