import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export function SignInButtons() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        onClick={() => signIn('google', { callbackUrl: '/auth/complete-profile' })}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FcGoogle className="w-5 h-5" />
        <span>Continuar con Google</span>
      </button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O</span>
        </div>
      </div>
      
      {/* Email/Password form would go here */}
    </div>
  );
} 