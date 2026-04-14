"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import Link from "next/link";
export default function DepartmentPage() {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axiosInstance.get("/department");
        setDocs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selected.length === docs.length) {
      setSelected([]);
    } else {
      setSelected(docs.map((d) => d._id));
    }
  };

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = doc.rfid.toLowerCase().includes(search.toLowerCase());

    const status = doc.departmentApprovedAt
      ? "APPROVED"
      : doc.rejectionReason
        ? "REJECTED"
        : "PENDING";

    const matchesFilter = filter === "ALL" || filter === status;

    return matchesSearch && matchesFilter;
  });

  const handleApprove = async () => {
    if (selected.length === 0) return alert("Select files");

    try {
      setBtnLoading(true);

      await axiosInstance.put("/department/approve", {
        ids: selected,
      });

      alert("Approved Successfully ✅");

      // 🔥 remove approved from UI
      setDocs((prev) => prev.filter((d) => !selected.includes(d._id)));
      setSelected([]);
    } catch (err) {
      console.error(err);
      alert("Error approving");
    } finally {
      setBtnLoading(false);
    }
  };

  const dept = docs[0]?.department || "-";
  const subDept = docs[0]?.subDepartment || "-";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-green-700 font-semibold">
        Loading Department Files...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="inline-block border px-10 py-2 bg-gray-100 text-lg font-medium shadow">
          Bangalore Development Authority
        </div>
      </div>

      {/* DEPARTMENT BAR */}
      <div className="flex justify-center mb-6">
        <div className="bg-green-900 text-white px-10 py-3 font-semibold shadow border-2 border-yellow-400">
          Department : {dept} &nbsp;&nbsp;&nbsp;&nbsp; Sub Department: {subDept}
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <input
          placeholder="Search RFID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {docs.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No approved files available
        </div>
      ) : (
        <div className="bg-white border border-green-900 shadow overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="border p-2">RFID</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Sub Dept</th>
                <th className="border p-2">Shared Date</th>
                <th className="border p-2">Final Approved</th>
                <th className="border p-2">Cover</th>
                <th className="border p-2">Note</th>
                <th className="border p-2">Main</th>
                <th className="border p-2">Status</th>
                <th className="border p-2 text-center">
                  <input
                    type="checkbox"
                    onChange={selectAll}
                    checked={docs.length > 0 && selected.length === docs.length}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDocs.map((doc) => {
                const status = doc.departmentApprovedAt
                  ? "APPROVED"
                  : doc.rejectionReason
                    ? "REJECTED"
                    : "PENDING";

                return (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="border p-2 font-semibold">
                      <Link
                        href={`/department/${doc._id}`}
                        className="block w-full"
                      >
                        {doc.rfid}
                      </Link>
                    </td>

                    <td className="border p-2">{doc.department}</td>
                    <td className="border p-2">{doc.subDepartment}</td>

                    <td className="border p-2">
                      {new Date(doc.receivedDate).toLocaleDateString()}
                    </td>

                    <td className="border p-2">
                      {doc.finalApprovedAt
                        ? new Date(doc.finalApprovedAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="border p-2">{doc.coverPages || 0}</td>
                    <td className="border p-2">{doc.notePages || 0}</td>
                    <td className="border p-2">{doc.mainPages || 0}</td>

                    {/* STATUS */}
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* CHECKBOX */}
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(doc._id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelect(doc._id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-900 text-white px-4 py-2 font-semibold border border-yellow-400">
            Total Files
          </div>

          <div className="bg-gray-300 px-10 py-2 font-semibold">
            {docs.length}
          </div>
        </div>

        <button
          onClick={handleApprove}
          disabled={btnLoading}
          className="bg-green-900 text-yellow-300 px-6 py-2 font-semibold border-2 border-yellow-400 shadow hover:bg-green-800 flex items-center gap-2"
        >
          {btnLoading ? (
            <span className="animate-spin border-2 border-yellow-300 border-t-transparent w-4 h-4 rounded-full"></span>
          ) : (
            "Approve Selected Files"
          )}
        </button>
      </div>
    </div>
  );
}
