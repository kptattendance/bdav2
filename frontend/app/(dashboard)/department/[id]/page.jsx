"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";

export default function DepartmentDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/department/${id}`).then((res) => {
      setDoc(res.data);
    });
  }, [id]);

  const handleApprove = async () => {
    setLoading(true);
    await axiosInstance.put("/department/approve", {
      ids: [doc._id],
    });
    setLoading(false);

    alert("Approved ✅");
    router.push("/department");
  };

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Document Review
      </h1>

      {/* INFO */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <p>
          <b>RFID:</b> {doc.rfid}
        </p>
        <p>
          <b>Department:</b> {doc.department}
        </p>
        <p>
          <b>File:</b> {doc.fileName}
        </p>
      </div>

      {/* IMAGES */}
      <Section title="Note Files" files={doc.noteFiles} />
      <Section title="Main Files" files={doc.mainFiles} />
      <Section title="Cover Files" files={doc.coverFiles} />

      {/* ACTION */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleApprove}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Processing..." : "Approve"}
        </button>

        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}

const Section = ({ title, files }) => (
  <div className="bg-white p-5 rounded-xl shadow mb-4">
    <h3 className="font-semibold mb-3">{title}</h3>

    {files && files.length > 0 ? (
      <div className="grid grid-cols-4 gap-3">
        {files.map((img, i) =>
          img ? (
            <img
              key={i}
              src={img}
              className="w-full h-32 object-cover rounded"
            />
          ) : null,
        )}
      </div>
    ) : (
      <div className="text-gray-400">No files</div>
    )}
  </div>
);
