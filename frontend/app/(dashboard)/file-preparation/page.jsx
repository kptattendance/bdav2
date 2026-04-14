"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../lib/axios";

export default function FilePreparationPage() {
  const [documents, setDocuments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();

  const fetchDocs = async () => {
    try {
      const res = await axiosInstance.get("/file-preparation");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-700">
          File Preparation Section
        </h1>

        <div className="text-sm text-gray-500">
          Total Files: {documents.length}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden border">
        <table className="w-full">
          <thead className="bg-green-600 text-white text-sm sticky top-0">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">RFID</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">RFID Tagged By</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc, i) => (
              <tr
                key={doc._id}
                onClick={() => {
                  setLoadingId(doc._id);
                  router.push(`/file-preparation/${doc._id}`);
                }}
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

                {/* ✅ FIXED USER */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={doc.rfidTaggedBy?.profileImage || "/avatar.png"}
                      className="w-8 h-8 rounded-full border"
                      alt="user"
                    />

                    <div className="text-xs leading-tight">
                      <div className="font-semibold">
                        {doc.rfidTaggedBy
                          ? `${doc.rfidTaggedBy.firstName} ${
                              doc.rfidTaggedBy.lastName || ""
                            }`
                          : "-"}
                      </div>

                      <div className="text-gray-500">
                        {doc.rfidTaggedBy?.phone || ""}
                      </div>
                    </div>
                  </div>
                </td>

                {/* LOADING INDICATOR */}
                {loadingId === doc._id && (
                  <td className="p-3">
                    <span className="animate-spin border-2 border-green-600 border-t-transparent rounded-full w-4 h-4 inline-block"></span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
