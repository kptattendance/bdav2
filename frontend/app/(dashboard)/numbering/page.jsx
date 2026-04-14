"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../lib/axios";

export default function NumberingPage() {
  const [docs, setDocs] = useState([]);
  const router = useRouter();

  const UserCard = ({ user }) => {
    if (!user) return <span>-</span>;

    return (
      <div className="flex items-center gap-2">
        <img
          src={user.profileImage || "/avatar.png"}
          className="w-8 h-8 rounded-full border"
          alt="user"
        />

        <div className="text-xs leading-tight">
          <div className="font-semibold">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-gray-500">{user.phone}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    axiosInstance.get("/numbering").then((res) => {
      setDocs(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-700">
          Page Numbering Section
        </h1>

        <div className="text-sm text-gray-500">Total Files: {docs.length}</div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden border">
        <table className="w-full">
          {/* HEADER */}
          <thead className="bg-green-600 text-white text-sm sticky top-0">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">RFID</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">RFID Tagged By</th>
              <th className="p-3 text-left">File Prepared By</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {docs.map((doc, i) => (
              <tr
                key={doc._id}
                onClick={() => router.push(`/numbering/${doc._id}`)}
                className="border-b hover:bg-green-50 transition cursor-pointer"
              >
                {/* SL NO */}
                <td className="p-3 text-gray-500">{i + 1}</td>

                {/* RFID */}
                <td className="p-3 font-semibold text-gray-800">{doc.rfid}</td>

                {/* DEPT */}
                <td className="p-3">
                  <div className="font-medium">{doc.department}</div>
                  <div className="text-xs text-gray-500">
                    {doc.subDepartment}
                  </div>
                </td>

                {/* DATE */}
                <td className="p-3 text-sm text-gray-600">
                  {new Date(doc.receivedDate).toLocaleDateString()}
                </td>

                {/* RFID USER */}
                <td className="p-3">
                  <UserCard user={doc.rfidTaggedBy} />
                </td>

                {/* PREP USER */}
                <td className="p-3">
                  <UserCard user={doc.filePreparedBy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
