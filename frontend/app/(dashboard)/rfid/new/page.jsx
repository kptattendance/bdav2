"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import axiosInstance from "../../../lib/axios";
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
      Swal.fire({
        icon: "warning",
        title: "Missing Data",
        text: "RFID and Image required",
      });
      return;
    }

    if (!form.department || !form.subDepartment || !form.fileName) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Department, SubDepartment, File Name required",
      });
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    formData.append("image", image);

    try {
      Swal.fire({
        title: "Processing...",
        text: "Uploading & Saving Document",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axiosInstance.post("/rfid", formData);

      // ✅ SUCCESS ALERT
      Swal.fire({
        icon: "success",
        title: "Saved Successfully",
        text: "Document has been created",
        timer: 1500,
        showConfirmButton: false,
      });

      // 🔥 RESET FORM (THIS IS WHAT YOU NEED)
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

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
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
            className="bg-green-900 text-yellow-400 px-10 py-2 border border-yellow-500 shadow"
          >
            Save
          </button>
        </div>
      </div>
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
