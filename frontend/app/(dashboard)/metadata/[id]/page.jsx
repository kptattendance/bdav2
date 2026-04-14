"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function MetadataDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [doc, setDoc] = useState(null);
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    axiosInstance.get(`/metadata/${id}`).then((res) => {
      setDoc(res.data);
      setSubject(res.data.fileSubject || "");
      setYear(res.data.fileYear || "");
    });
  }, []);

  const handleSave = async () => {
    await axiosInstance.put(`/metadata/${id}`, {
      fileSubject: subject,
      fileYear: year,
    });

    alert("Metadata Saved ✅");
    router.push("/metadata");
  };

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Metadata Entry</h1>

      {/* INFO */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <p>
          <b>RFID:</b> {doc.rfid}
        </p>
        <p>
          <b>Department:</b> {doc.department}
        </p>
        <p>
          <b>Quality Checked By:</b> {doc.qualityCheckedBy?.firstName}
        </p>
      </div>

      {/* EDITABLE */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded mb-6">
        <h2 className="font-semibold mb-3">Editable Metadata</h2>

        <input
          placeholder="File Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="number"
          placeholder="File Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Save & Continue
      </button>
    </div>
  );
}
