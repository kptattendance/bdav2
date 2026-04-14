"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
export default function QualityPage() {
  const [docs, setDocs] = useState([]);
  const router = useRouter();
const { getToken } = useAuth();

  attachToken(getToken); 
  const UserCell = ({ user }) => {
    if (!user) return <span className="text-gray-400">-</span>;

    return (
      <div className="flex items-center gap-2">
        <img
          src={user.profileImage || "/avatar.png"}
          className="w-9 h-9 rounded-full border shadow-sm"
        />

        <div className="text-xs leading-tight">
          <div className="font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-gray-500">{user.phone}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    axiosInstance.get("/quality").then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setDocs(data);
    });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Quality Check</h1>

      <div className="bg-white rounded-l  shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-green-700  text-white">
            <tr>
              <th>Sl No</th>
              <th>RFID</th>
              <th>Dept</th>
              <th>Sub Dept</th>
              <th>Date</th>
              <th>RFID Tagged</th>
              <th>File Prepared By</th>
              <th>File Numbered By</th>
              <th>File Scanned By</th>
              <th>Pages Count</th>
            </tr>
          </thead>

          <tbody>
            {docs.map((doc, i) => (
              <tr
                key={doc._id}
                className="border-b hover:bg-green-50 cursor-pointer transition"
                onClick={() => router.push(`/quality/${doc._id}`)}
              >
                <td className="p-3 font-semibold">{i + 1}</td>
                <td className="p-3 font-semibold">{doc.rfid}</td>

                <td className="p-3">
                  <div>{doc.department}</div>
                  <div className="text-xs text-gray-500">
                    {doc.subDepartment}
                  </div>
                </td>
                <td className="p-3">
                  <div>{doc.subDepartment}</div>
                </td>

                <td className="p-3 text-sm text-gray-600">
                  {new Date(doc.receivedDate).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <UserCell user={doc.rfidTaggedBy} />
                </td>

                <td className="p-3">
                  <UserCell user={doc.filePreparedBy} />
                </td>

                <td className="p-3">
                  <UserCell user={doc.pageNumberedBy} />
                </td>

                <td className="p-3">
                  <UserCell user={doc.scannedBy} />
                </td>
                <td className="p-3 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {(doc.notePages || 0) +
                      (doc.mainPages || 0) +
                      (doc.coverPages || 0)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
