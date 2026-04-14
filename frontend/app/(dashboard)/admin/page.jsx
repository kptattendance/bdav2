"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const role = user?.publicMetadata?.role;

  useEffect(() => {
    if (isLoaded && role !== "admin") {
      router.replace("/dashboard"); // ✅ better than push
    }
  }, [isLoaded, role]);

  // 🔄 Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-green-800 text-lg font-semibold animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // 🚫 Prevent render before redirect
  if (role !== "admin") return null;

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-xl font-semibold text-green-900 mb-6">
        Admin Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow border border-gray-200 p-5 rounded">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold text-green-800">120</h2>
        </div>

        <div className="bg-white shadow border border-gray-200 p-5 rounded">
          <p className="text-sm text-gray-500">Documents Uploaded</p>
          <h2 className="text-2xl font-bold text-green-800">2,340</h2>
        </div>

        <div className="bg-white shadow border border-gray-200 p-5 rounded">
          <p className="text-sm text-gray-500">Active Projects</p>
          <h2 className="text-2xl font-bold text-green-800">8</h2>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="mt-8 bg-white shadow border border-gray-200 rounded p-5">
        <h2 className="text-md font-semibold text-green-900 mb-3">
          Recent Activity
        </h2>

        <ul className="text-sm text-gray-600 space-y-2">
          <li>• User "Ramesh" added</li>
          <li>• 50 documents uploaded</li>
          <li>• Project "BBMP" updated</li>
        </ul>
      </div>
    </div>
  );
}
