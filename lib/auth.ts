import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

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
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
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
      // Allow localhost redirects for development
      const isLocalhost = baseUrl.includes('localhost')
      
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      else if (isLocalhost && url.includes('localhost')) return url
      return baseUrl
    },
  },
} 