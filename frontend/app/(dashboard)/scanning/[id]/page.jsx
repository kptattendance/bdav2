"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "../../../lib/axios";

export default function ScanningDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [doc, setDoc] = useState(null);
  const [noteFiles, setNoteFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/scanning/${id}`).then((res) => {
      setDoc(res.data);
    });
  }, []);

  const handleUpload = async (files, setter) => {
    setLoading(true);

    const uploaded = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_preset");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    setter(uploaded);
    setLoading(false);
  };

  const handleSave = async () => {
    await axiosInstance.put(`/scanning/${id}`, {
      noteFiles,
      mainFiles,
      coverFiles,
    });

    alert("Scanning Done ✅");
    router.push("/scanning");
  };

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        Scanning Section
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Upload scanned pages. Highlighted sections are editable.
      </p>

      {/* FILE INFO */}
      <div className="mb-8">
        <h2 className="text-green-700 font-semibold mb-3">File Info</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Info label="RFID" value={doc.rfid} highlight />
          <Info label="Department" value={doc.department} />
          <Info label="Prepared By" value={doc.filePreparedBy?.firstName} />
          <Info label="Numbered By" value={doc.pageNumberedBy?.firstName} />
        </div>
      </div>

      {/* PAGE SUMMARY */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-green-100">
        <h2 className="text-green-700 font-semibold mb-4">Page Summary</h2>

        <div className="flex gap-4">
          <Badge label="Note" value={doc.notePages} />
          <Badge label="Main" value={doc.mainPages} />
          <Badge label="Cover" value={doc.coverPages} />
        </div>
      </div>

      {/* UPLOAD */}
      <div className="grid md:grid-cols-3 gap-5">
        <UploadCard
          title="Note Papers"
          onUpload={(e) => handleUpload(e.target.files, setNoteFiles)}
          files={noteFiles}
        />

        <UploadCard
          title="Main Papers"
          onUpload={(e) => handleUpload(e.target.files, setMainFiles)}
          files={mainFiles}
        />

        <UploadCard
          title="Cover Papers"
          onUpload={(e) => handleUpload(e.target.files, setCoverFiles)}
          files={coverFiles}
        />
      </div>

      {/* BUTTON */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          {loading ? "Uploading..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}

//
// COMPONENTS
//

const Info = ({ label, value, highlight }) => (
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

const Badge = ({ label, value }) => (
  <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-xl text-center">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-lg font-bold text-green-700">{value || 0}</div>
  </div>
);

const UploadCard = ({ title, onUpload, files }) => (
  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
    <h3 className="font-semibold text-green-700 mb-3">{title}</h3>

    <label className="block bg-green-50 border border-dashed border-green-300 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100 transition">
      <span className="text-sm text-gray-600">Click to upload</span>
      <input type="file" multiple onChange={onUpload} className="hidden" />
    </label>

    <div className="text-xs text-gray-500 mt-2">Uploaded: {files.length}</div>

    {/* PREVIEW */}
    <div className="grid grid-cols-3 gap-2 mt-3">
      {files.map((f, i) => (
        <img key={i} src={f} className="w-full h-20 object-cover rounded-lg" />
      ))}
    </div>
  </div>
);
