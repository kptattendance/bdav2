"use client";

import { useEffect, useState } from "react";
import axiosInstance, { attachToken }  from "../../lib/axios";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { useAuth } from "@clerk/nextjs";
export default function RFIDListPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  attachToken(getToken);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingId, setLoadingId] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const load = async () => {
      const res = await axiosInstance.get("/rfid/all");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      setDocuments(data);
    };
    load();
  }, []);

  // 🔍 SEARCH
  const filtered = documents.filter((doc) =>
    doc.rfid?.toLowerCase().includes(search.toLowerCase()),
  );

  // 📄 PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDocs = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-green-900">RFID Documents</h1>

        {/* SEARCH */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by RFID..."
            className="w-full pl-10 pr-3 py-2 border border-green-800 rounded"
          />
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => router.push("/rfid/new")}
          className="bg-green-800 text-white px-5 py-2 rounded shadow hover:bg-green-700"
        >
          + New Scan
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">#</th>
              <th>Image</th>
              <th>RFID</th>
              <th>Department</th>
              <th>Sub Dept</th>
              <th>File Name</th>
              <th>Tagged By</th>
              <th>Tagged Date</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentDocs.map((doc, index) => (
              <tr key={doc._id} className="border-t hover:bg-gray-50">
                {/* SL NO */}
                <td className="p-3">{indexOfFirst + index + 1}</td>

                {/* IMAGE */}
                <td>
                  <img
                    src={doc.coverImage || "/no-image.png"}
                    alt="cover"
                    className="w-12 h-12 object-cover rounded border"
                  />
                </td>

                {/* RFID */}
                <td className="font-medium">{doc.rfid}</td>

                {/* DEPT */}
                <td>{doc.department}</td>

                {/* SUB DEPT */}
                <td>{doc.subDepartment}</td>

                {/* FILE NAME */}
                <td>{doc.fileName}</td>

                {/* USER */}
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={doc.rfidTaggedBy?.profileImage || "/user.png"}
                      className="w-8 h-8 rounded-full border"
                    />

                    <div className="text-sm">
                      <div className="font-medium">
                        {doc.rfidTaggedBy
                          ? `${doc.rfidTaggedBy.firstName} ${
                              doc.rfidTaggedBy.lastName || ""
                            }`
                          : "Unknown"}
                      </div>

                      <div className="text-gray-500 text-xs">
                        {doc.rfidTaggedBy?.phone || ""}
                      </div>
                    </div>
                  </div>
                </td>

                {/* DATE */}
                <td className="text-sm">
                  {doc.rfidTaggedAt
                    ? new Date(doc.rfidTaggedAt).toLocaleDateString()
                    : "-"}
                </td>

                {/* STATUS */}
                <td>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded">
                    {doc.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="flex gap-2 justify-center py-2">
                  <button
                    onClick={() => {
                      setLoadingId(doc._id);
                      router.push(`/rfid/${doc._id}`);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-2"
                  >
                    {loadingId === doc._id ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                    ) : (
                      "View"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setLoadingId(doc._id);
                      router.push(`/dashboard/file-prep/${doc._id}`);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-2"
                  >
                    {loadingId === doc._id ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                    ) : (
                      "Next"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-green-800 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
