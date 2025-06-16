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
      if (account?.provider === "google") {
        try {
          console.log(`Google sign-in successful:`, user);
          
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
            console.log(`Created new user profile for Google user:`, user.id);
          }
          
          return true;
        } catch (error) {
          console.error(`Error during Google sign-in:`, error);
          return false;
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
      console.log("NextAuth redirect:", { url, baseUrl });
      
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // If it's the same origin, allow it
      try {
        if (new URL(url).origin === baseUrl) {
          return url;
        }
      } catch (e) {
        // Invalid URL, default to baseUrl
      }
      
      // Default to home page
      return baseUrl;
    },
  },
} 