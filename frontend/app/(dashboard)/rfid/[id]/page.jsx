"use client";

import { useEffect, useState } from "react";
import axiosInstance, { attachToken }  from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
export default function RFIDViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  attachToken(getToken);
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/rfid/${id}`);
        setDoc(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) load();
  }, [id]);

  if (!doc) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Document Details</h1>

        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
          {doc.status}
        </span>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* TOP SECTION */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* IMAGE */}
          <div className="flex justify-center">
            <img
              src={doc.coverImage}
              alt="cover"
              className="w-64 h-80 object-cover rounded-xl shadow-md"
            />
          </div>

          {/* BASIC INFO */}
          <div className="space-y-4">
            <Info label="RFID" value={doc.rfid} highlight />
            <Info label="File Name" value={doc.fileName} />
            <Info label="Subject" value={doc.fileSubject} />
            <Info label="Year" value={doc.fileYear} />
            <Info label="Shared By" value={doc.fileSharedBy} />
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h2 className="text-green-700 font-semibold mb-4">
            Additional Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Department" value={doc.department} />
            <Info label="Sub Department" value={doc.subDepartment} />

            <Info
              label="Tagged Date"
              value={new Date(doc.rfidTaggedAt).toLocaleDateString()}
            />

            <Info
              label="Received Date"
              value={new Date(doc.receivedDate).toLocaleDateString()}
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.back()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

//
// COMPONENT
//

const Info = ({ label, value, highlight }) => (
  <div>
    <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>

    <div
      className={`mt-1 ${
        highlight ? "text-green-700 font-semibold text-lg" : "text-gray-800"
      }`}
    >
      {value || "-"}
    </div>
  </div>
);
