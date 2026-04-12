"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const { user } = useUser();

  const role = user?.publicMetadata?.role || "citizen";

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">DMS Panel</h2>

      {/* Common */}
      <Link href="/dashboard" className="block mb-3 hover:text-blue-400">
        Dashboard
      </Link>

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <Link href="/admin/users/add">Add User</Link>
          <Link href="/admin/users" className="block mb-3 hover:text-blue-400">
            Manage Users
          </Link>
          <Link
            href="/admin/reports"
            className="block mb-3 hover:text-blue-400"
          >
            Reports
          </Link>
        </>
      )}

      {/* STAFF */}
      {role === "staff" && (
        <>
          <Link href="/staff/upload" className="block mb-3 hover:text-blue-400">
            Upload Documents
          </Link>
          <Link href="/staff/manage" className="block mb-3 hover:text-blue-400">
            Manage Records
          </Link>
        </>
      )}

      {/* OFFICER */}
      {role === "officer" && (
        <>
          <Link
            href="/officer/search"
            className="block mb-3 hover:text-blue-400"
          >
            Search Records
          </Link>
          <Link
            href="/officer/reports"
            className="block mb-3 hover:text-blue-400"
          >
            View Reports
          </Link>
        </>
      )}

      {/* CITIZEN */}
      {role === "citizen" && (
        <>
          <Link
            href="/citizen/search"
            className="block mb-3 hover:text-blue-400"
          >
            Search Documents
          </Link>
          <Link
            href="/citizen/request"
            className="block mb-3 hover:text-blue-400"
          >
            Request Copy
          </Link>
        </>
      )}
    </div>
  );
}
