"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
export default function FinalReviewPage() {
  const [docs, setDocs] = useState([]);
  const router = useRouter();
  const { getToken } = useAuth();

  attachToken(getToken);
  useEffect(() => {
    axiosInstance.get("/final-review").then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setDocs(data);
    });
  }, []);

  const UserCell = ({ user }) => {
    if (!user) return <span className="text-gray-400 text-xs">-</span>;

    return (
      <div className="flex items-center gap-2">
        <img
          src={user.profileImage || "/avatar.png"}
          className="w-8 h-8 rounded-full border"
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

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          Final Review & Approval
        </h1>

        <div className="text-sm text-gray-500">Total Files: {docs.length}</div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-700 text-white text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">RFID</th>
              <th className="p-3">Department</th>
              <th className="p-3">Date</th>
              <th className="p-3">RFID Tagged</th>
              <th className="p-3">Prepared</th>
              <th className="p-3">Numbered</th>
              <th className="p-3">Scanned</th>
              <th className="p-3">Quality Checked</th>
              <th className="p-3">Metadata Added</th>
              <th className="p-3 text-center">Pages</th>
            </tr>
          </thead>

          <tbody>
            {docs.map((doc, i) => (
              <tr
                key={doc._id}
                onClick={() => router.push(`/final-review/${doc._id}`)}
                className="border-b hover:bg-green-50 cursor-pointer transition"
              >
                {/* SL NO */}
                <td className="p-3 text-gray-500">{i + 1}</td>

                {/* RFID */}
                <td className="p-3 font-semibold">{doc.rfid}</td>

                {/* DEPT */}
                <td className="p-3">
                  <div className="font-medium">{doc.department}</div>
                  <div className="text-xs text-gray-500">
                    {doc.subDepartment}
                  </div>
                </td>

                {/* DATE */}
                <td className="p-3 text-gray-600">
                  {new Date(doc.receivedDate).toLocaleDateString()}
                </td>

                {/* USERS */}
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

                <td className="p-3">
                  <UserCell user={doc.qualityCheckedBy} />
                </td>

                <td className="p-3">
                  <UserCell user={doc.metadataAddedBy} />
                </td>

                {/* TOTAL PAGES */}
                <td className="p-3 text-center">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold inline-block">
                    {(doc.notePages || 0) +
                      (doc.mainPages || 0) +
                      (doc.coverPages || 0)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
