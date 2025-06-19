'use client'

import { createContext, useContext, ReactNode } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  profileComplete?: boolean;
  isStudent?: boolean | null;
  institution?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();

  return (
    <AuthContext.Provider value={auth}>
      {auth.loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 