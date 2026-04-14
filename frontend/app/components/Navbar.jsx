"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="w-full bg-green-900 px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide cursor-pointer hover:text-yellow-300 transition">
          Document Digitization and Management Software
        </h1>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {/* ROLE BADGE */}
              <span
                className="bg-green-800 text-yellow-300 px-4 py-1 rounded-sm shadow-sm capitalize font-medium 
              hover:bg-green-700 hover:shadow cursor-pointer transition"
              >
                {user?.publicMetadata?.role || "user"}
              </span>

              {/* USER BUTTON */}
              <div className="p-1 rounded-sm hover:bg-green-800 transition cursor-pointer">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <button
                className="bg-green-800 text-yellow-300 px-6 py-2 rounded-sm shadow 
              hover:bg-green-700 hover:shadow-lg transition cursor-pointer"
              >
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
