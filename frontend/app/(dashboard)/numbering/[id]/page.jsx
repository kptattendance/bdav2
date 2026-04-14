"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "../../../lib/axios";

export default function NumberingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  attachToken(getToken);
  const [doc, setDoc] = useState(null);
  const [notePages, setNotePages] = useState("");
  const [mainPages, setMainPages] = useState("");
  const [coverPages, setCoverPages] = useState("");

  useEffect(() => {
    axiosInstance.get(`/numbering/${id}`).then((res) => {
      setDoc(res.data);
    });
  }, []);

  const handleSave = async () => {
    await axiosInstance.put(`/numbering/${id}`, {
      notePages,
      mainPages,
      coverPages,
    });

    alert("Numbering Completed ✅");
    router.push("/numbering");
  };

  const total =
    (Number(notePages) || 0) +
    (Number(mainPages) || 0) +
    (Number(coverPages) || 0);

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-green-700 mb-2">Page Numbering</h1>

      <p className="text-sm text-gray-500 mb-6">
        Enter page counts carefully. Editable fields are highlighted.
      </p>

      {/* FILE INFO */}
      <div className="mb-8">
        <h2 className="text-green-700 font-semibold mb-3">File Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <ReadField label="RFID" value={doc.rfid} highlight />
          <ReadField label="Department" value={doc.department} />
          <ReadField label="Sub Department" value={doc.subDepartment} />
          <ReadField
            label="Prepared By"
            value={doc.filePreparedBy?.firstName}
          />
        </div>
      </div>

      {/* EDITABLE SECTION */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
        <h2 className="text-green-700 font-semibold mb-4">
          Page Details (Editable)
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <PageInput
            label="Note Pages"
            value={notePages}
            onChange={setNotePages}
          />

          <PageInput
            label="Main Pages"
            value={mainPages}
            onChange={setMainPages}
          />

          <PageInput
            label="Cover Pages"
            value={coverPages}
            onChange={setCoverPages}
          />
        </div>

        {/* TOTAL */}
        <div className="mt-6 flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg">
          <span className="text-gray-600 font-medium">Total Pages</span>

          <span className="text-xl font-bold text-green-700">{total}</span>
        </div>
      </div>

      {/* BUTTON */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Save & Continue
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

const PageInput = ({ label, value, onChange }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 focus-within:ring-2 focus-within:ring-green-500 transition">
    <label className="text-sm font-semibold text-green-700">{label}</label>

    <input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full bg-transparent outline-none text-xl font-bold text-gray-800"
      placeholder="0"
    />
  </div>
);
