import SignOutIcon from '@/icons/SignOutIcon';
import { signOut } from 'next-auth/react';
import React from 'react';

interface SignOutButtonProps {
  isExpanded: boolean;
  isHovered: boolean;
}

const SignOutButton = ({ isExpanded, isHovered }: SignOutButtonProps) => {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/signin" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
    >
      {
        isExpanded && (
          <>
            <SignOutIcon
            />
            Sign Out
          </>
        ) || <SignOutIcon />
        || isHovered && "Sign Out"
      }
    </button>
  );
};

export default SignOutButton;
