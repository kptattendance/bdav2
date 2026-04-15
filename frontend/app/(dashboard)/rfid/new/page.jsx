"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import axiosInstance, { attachToken } from "../../../lib/axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
export default function RFIDPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  attachToken(getToken);
  const [form, setForm] = useState({
    rfid: "",
    department: "",
    subDepartment: "",
    fileName: "",
    fileSubject: "",
    fileDescription: "",
    fileYear: "",
    fileSharedBy: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file)); // 🔥 PREVIEW
    }
  };

  const handleSubmit = async () => {
    if (!form.rfid || !image) {
      setError("RFID and Image required");
      return;
    }

    if (!form.department || !form.subDepartment || !form.fileName) {
      setError("Fill all required fields");
      return;
    }

    setError("");

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    formData.append("image", image);
    try {
      setSaving(true);

      await axiosInstance.post("/rfid", formData);

      // ✅ SUCCESS ALERT (ONLY HERE)
      Swal.fire({
        icon: "success",
        title: "RFID Tagged Successfully",
        text: "Document saved successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      // ✅ reset form
      setForm({
        rfid: "",
        department: "",
        subDepartment: "",
        fileName: "",
        fileSubject: "",
        fileDescription: "",
        fileYear: "",
        fileSharedBy: "",
      });

      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* HEADER */}
      <div className="bg-green-900 text-yellow-400 text-center py-5 text-2xl font-bold">
        Document Digitization and Management Software
      </div>

      {/* PROJECT */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="bg-green-900 text-yellow-400 px-6 py-2 border border-yellow-500">
          Project
        </div>

        <div className="bg-gray-300 px-10 py-2 border">
          Bangalore Development Authority
        </div>
      </div>

      {/* SECTION */}
      <div className="text-center mt-6">
        <div className="inline-block bg-green-900 text-yellow-400 px-10 py-2 border border-yellow-500">
          RFID Tagging Section
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-6xl mx-auto mt-8 px-6">
        <div className="grid grid-cols-2 gap-6">
          <Field label="RFID Tag">
            <input
              name="rfid"
              onChange={handleChange}
              className="w-full mt-2 p-2 border"
            />
          </Field>

          <Field label="File Shared By">
            <input
              name="fileSharedBy"
              onChange={handleChange}
              className="w-full mt-2 p-2 border"
            />
          </Field>

          <Field label="Date">
            <input
              value={new Date().toLocaleDateString()}
              disabled
              className="w-full mt-2 p-2 border bg-gray-300"
            />
          </Field>

          <Field label="RFID Tagged By">
            <input
              value="Auto"
              disabled
              className="w-full mt-2 p-2 border bg-gray-300"
            />
          </Field>

          <Field label="Department">
            <select
              name="department"
              onChange={handleChange}
              className="w-full mt-2 p-2 border"
            >
              <option value="">Select</option>
              <option>Finance</option>
              <option>Admin</option>
              <option>IT Cell</option>
            </select>
          </Field>

          <Field label="Sub Department">
            <select
              name="subDepartment"
              onChange={handleChange}
              className="w-full mt-2 p-2 border"
            >
              <option value="">Select</option>
              <option>Receivables</option>
              <option>Payroll</option>
              <option>Legal</option>
            </select>
          </Field>

          <Field label="File Name">
            <input
              name="fileName"
              onChange={handleChange}
              className="w-full mt-2 p-2 border"
            />
          </Field>

          <Field label="File Subject">
            <input
              name="fileSubject"
              onChange={handleChange}
              className="w-full mt-2 p-2 border"
            />
          </Field>

          <Field label="File Year">
            <input
              name="fileYear"
              onChange={handleChange}
              className="w-full mt-2 p-2 border"
            />
          </Field>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6">
          <div className="bg-green-900 text-yellow-400 px-4 py-2 inline-block border border-yellow-500">
            File Description
          </div>

          <input
            name="fileDescription"
            onChange={handleChange}
            className="w-full mt-2 p-2 border"
          />
        </div>

        {/* IMAGE PREVIEW */}
        <div className="mt-6">
          <div className="bg-green-900 text-yellow-400 px-4 py-2 inline-block border border-yellow-500">
            Cover Image
          </div>
          <input
            key={preview || ""} // 🔥 forces reset
            type="file"
            onChange={handleImage}
            className="mt-3"
          />

          {preview && (
            <div className="mt-4 flex justify-center">
              <img src={preview} alt="preview" className="max-h-80 border" />
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-center mt-4 font-medium">
            {error}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-center gap-10 mt-10 pb-10">
          <button
            onClick={() => router.back()}
            className="bg-green-900 text-yellow-400 px-10 py-2 border border-yellow-500 shadow"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-green-900 text-yellow-400 px-10 py-2 border border-yellow-500 shadow flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      {saving && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow flex items-center gap-3">
            <span className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></span>
            Saving document...
          </div>
        </div>
      )}
    </div>
  );
}

// 🔥 reusable field
const Field = ({ label, children }) => (
  <div className="flex items-center gap-4">
    <div className="w-48 bg-green-900 text-yellow-400 text-center py-2 border border-yellow-500">
      {label}
    </div>
    {children}
  </div>
);
