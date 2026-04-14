"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function RFIDListPage() {
  const router = useRouter();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const load = async () => {
      const res = await axiosInstance.get("/rfid/all");
      setDocuments(res.data);
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
          {/* HEADER */}
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

          {/* BODY */}
          <tbody>
            {currentDocs.map((doc, index) => (
              <tr key={doc._id} className="border-t hover:bg-gray-50">
                {/* SL NO */}
                <td className="p-3">{indexOfFirst + index + 1}</td>

                {/* DOCUMENT IMAGE */}
                <td>
                  <img
                    src={doc.coverImage}
                    alt="cover"
                    className="w-12 h-12 object-cover rounded border"
                  />
                </td>

                {/* RFID */}
                <td className="font-medium">{doc.rfid}</td>

                {/* DEPARTMENT */}
                <td>{doc.department}</td>

                {/* SUB DEPARTMENT */}
                <td>{doc.subDepartment}</td>

                {/* FILE NAME */}
                <td>{doc.fileName}</td>

                {/* TAGGED BY */}
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={doc.taggedUser?.image || "/user.png"}
                      alt="user"
                      className="w-8 h-8 rounded-full border"
                    />

                    <div className="text-sm">
                      <div className="font-medium">
                        {doc.taggedUser?.name || "Unknown"}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {doc.taggedUser?.email || ""}
                      </div>
                    </div>
                  </div>
                </td>

                {/* TAGGED DATE */}
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
                    onClick={() => router.push(`/rfid/${doc._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/dashboard/file-prep/${doc._id}`)
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Next
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
