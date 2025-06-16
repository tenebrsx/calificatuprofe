import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Authenticate with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )
          
          const user = userCredential.user
          
          if (user) {
            return {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0],
              email: user.email,
              image: user.photoURL,
            }
          }
          
          return null
        } catch (error) {
          console.error('Firebase auth error:', error)
          return null
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { user: user?.email, provider: account?.provider });
      
      if (account?.provider === "google") {
        try {
          // Check if user exists in Firestore
          const userDocRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Create new user profile in Firestore
            await setDoc(userDocRef, {
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              createdAt: new Date().toISOString(),
              profileComplete: false,
              isStudent: null,
              institution: null,
            });
            console.log(`New user created: ${user.id}`);
          } else {
            console.log(`Existing user signed in: ${user.id}`);
          }
          
          return true;
        } catch (error) {
          console.error(`Google sign-in error:`, error);
          return "/auth/error?error=DatabaseError";
        }
      }
      
      return true;
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
        
        // Get additional user data from Firestore
        try {
          const userDocRef = doc(db, 'users', token.sub);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            (session.user as any).profileComplete = userData.profileComplete;
            (session.user as any).isStudent = userData.isStudent;
            (session.user as any).institution = userData.institution;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 NextAuth redirect called:", { 
        url, 
        baseUrl, 
        timestamp: new Date().toISOString() 
      });
      
      // Handle relative URLs
      if (url.startsWith("/")) {
        const finalUrl = `${baseUrl}${url}`;
        console.log("✅ Relative URL redirect:", finalUrl);
        return finalUrl;
      }
      
      // Allow same origin redirects
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        
        if (urlObj.origin === baseUrlObj.origin) {
          console.log("✅ Same origin redirect:", url);
          return url;
        }
        
        console.log("⚠️ Different origin detected:", {
          urlOrigin: urlObj.origin,
          baseUrlOrigin: baseUrlObj.origin
        });
      } catch (e) {
        console.error("❌ Invalid URL in redirect:", e);
      }
      
      // Default redirect after successful authentication
      const defaultUrl = `${baseUrl}/`;
      console.log("🏠 Default redirect to home:", defaultUrl);
      return defaultUrl;
    },
  },
} 