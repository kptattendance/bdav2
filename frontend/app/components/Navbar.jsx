"use client";

import { useUser, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { user } = useUser();

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-bold text-blue-600">
        BDA Document Management System
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 capitalize">
          {user?.publicMetadata?.role}
        </span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
