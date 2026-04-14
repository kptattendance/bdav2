"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  const role = user?.publicMetadata?.role || "citizen";

  const MenuButton = ({ href, label }) => {
    const isActive = pathname === href; // ✅ ONLY exact match

    return (
      <Link href={href}>
        <div
          className={`px-4 py-2 mb-3 text-center cursor-pointer rounded-md transition-all duration-200 font-medium
          ${
            isActive
              ? "bg-white text-green-900 shadow-md"
              : "bg-green-700 text-gray-100 hover:bg-green-600 hover:shadow"
          }`}
        >
          {label}
        </div>
      </Link>
    );
  };

  const SectionTitle = ({ title }) => (
    <h3 className="text-gray-200 text-xs mt-6 mb-2 border-b border-green-600 pb-1 tracking-wider uppercase">
      {title}
    </h3>
  );

  return (
    <div className="w-64 min-h-screen bg-green-900 p-4">
      {/* TITLE */}
      <h2 className="text-white text-lg font-semibold text-center mb-6 tracking-wide">
        DMS PANEL
      </h2>

      {/* COMMON */}
      <MenuButton href="/dashboard" label="Dashboard" />

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <SectionTitle title="Admin Controls" />

          <MenuButton href="/admin/users/add" label="Add User" />
          <MenuButton href="/admin/users" label="Manage Users" />
          <MenuButton href="/admin/reports" label="Reports" />
        </>
      )}

      {/* ADMIN */}
      {role === "RFIDTagging" && (
        <>
          <SectionTitle title="RFIDTagging Controls" />

          <MenuButton href="/rfid/new" label="New RFID Tagging" />
          <MenuButton href="/rfid" label="List of RFIDs" />
          <MenuButton href="/rfid/reports" label="Reports" />
        </>
      )}

      {/* STAFF */}
      {role === "FilePreparation" && (
        <>
          <SectionTitle title="FilePreparation Operations" />

          <MenuButton href="/file-preparation/upload" label="Details" />
          <MenuButton href="/file-preparation" label="List" />
        </>
      )}

      {/* OFFICER */}
      {role === "officer" && (
        <>
          <SectionTitle title="Officer Panel" />

          <MenuButton href="/officer/search" label="Search Records" />
          <MenuButton href="/officer/reports" label="View Reports" />
        </>
      )}

      {/* CITIZEN */}
      {role === "citizen" && (
        <>
          <SectionTitle title="Citizen Services" />

          <MenuButton href="/citizen/search" label="Search Documents" />
          <MenuButton href="/citizen/request" label="Request Copy" />
        </>
      )}
    </div>
  );
}
