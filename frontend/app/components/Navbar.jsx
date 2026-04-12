"use client";

import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-bold text-blue-600">
        BDA Document Management System
      </h1>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <span className="text-gray-600 capitalize">
              {user?.publicMetadata?.role || "user"}
            </span>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
