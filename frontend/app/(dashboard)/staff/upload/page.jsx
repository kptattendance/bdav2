"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    department: "",
    docType: "",
    date: "",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    console.log("Uploading:", form, file);

    // Later → send to backend
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Document</h1>

      {/* FILE UPLOAD */}
      <div className="bg-white p-6 shadow rounded mb-6">
        <input type="file" onChange={handleFileChange} />
        {file && <p className="mt-2 text-sm">{file.name}</p>}
      </div>

      <div
        className="border-2 border-dashed p-6 text-center cursor-pointer"
        onClick={() => document.getElementById("fileInput").click()}
      >
        <p>Drag & Drop or Click to Upload</p>

        <input id="fileInput" type="file" hidden onChange={handleFileChange} />
      </div>

      {/* METADATA FORM */}
      <div className="bg-white p-6 shadow rounded space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Document Title"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="docType"
          placeholder="Document Type"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
