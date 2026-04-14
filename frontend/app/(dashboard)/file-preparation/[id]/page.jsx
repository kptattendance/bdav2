"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "../../../lib/axios";
import { useUser } from "@clerk/nextjs";

export default function FilePreparationDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [doc, setDoc] = useState(null);
  const [description, setDescription] = useState("");
  const [preparedDate, setPreparedDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/file-preparation/${id}`).then((res) => {
      setDoc(res.data);
      setDescription(res.data.fileDescription || "");
    });
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axiosInstance.put(`/file-preparation/${id}`, {
        fileDescription: description,
        filePreparedAt: preparedDate,
      });

      alert("File Prepared Successfully ✅");
      router.push("/file-preparation");
    } catch (err) {
      console.error(err);
      alert("Error saving file");
    } finally {
      setLoading(false);
    }
  };

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        File Preparation
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Editable fields are highlighted below.
      </p>

      {/* FILE INFO (READ ONLY) */}
      <div className="mb-8">
        <h2 className="text-green-700 font-semibold mb-3">File Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <ReadField label="RFID Tag" value={doc.rfid} highlight />
          <ReadField label="Department" value={doc.department} />
          <ReadField label="Sub Department" value={doc.subDepartment} />
          <ReadField label="File Name" value={doc.fileName} />
          <ReadField label="Shared By" value={doc.fileSharedBy} />
        </div>
      </div>

      {/* RFID INFO */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
        <h2 className="text-green-700 font-semibold mb-4">RFID Details</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <ReadField label="Tagged By" value={doc.rfidTaggedBy} />
          <ReadField
            label="Tagged Date"
            value={new Date(doc.rfidTaggedAt).toLocaleDateString()}
          />
        </div>
      </div>

      {/* EDITABLE SECTION */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
        <h2 className="text-green-700 font-semibold mb-4">
          File Preparation (Editable)
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <ReadField
            label="Prepared By"
            value={user?.fullName || "Current User"}
          />

          <EditableField
            label="Prepared Date"
            type="date"
            value={preparedDate}
            onChange={setPreparedDate}
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-green-700">
            File Description
          </label>

          <textarea
            className="mt-2 w-full rounded-xl bg-green-50 border border-green-200 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTON */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}

//
// COMPONENTS
//

const ReadField = ({ label, value, highlight }) => (
  <div>
    <div className="text-xs text-gray-400 uppercase">{label}</div>
    <div
      className={`mt-1 ${
        highlight ? "text-green-700 font-semibold text-lg" : "text-gray-800"
      }`}
    >
      {value || "-"}
    </div>
  </div>
);

const EditableField = ({ label, value, onChange, type = "text" }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 focus-within:ring-2 focus-within:ring-green-500">
    <label className="text-sm font-semibold text-green-700">{label}</label>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full bg-transparent outline-none text-gray-800 font-medium"
    />
  </div>
);
