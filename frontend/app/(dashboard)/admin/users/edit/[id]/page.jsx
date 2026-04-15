"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance, { attachToken } from "../../../../../lib/axios";
import { useAuth } from "@clerk/nextjs";

export default function AddUserPage() {
  const { id } = useParams(); // 👈 edit mode if exists
  const router = useRouter();
  const { getToken } = useAuth();
  const roles = [
    "SuperAdmin",
    "admin",
    "RFIDTagging",
    "FilePreparation",
    "Numbering",
    "Scanning",
    "Quality",
    "Metadata",
    "FinalReview",
    "DepartmentUser",
  ];
  const isEdit = !!id;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔥 Attach token
  useEffect(() => {
    attachToken(getToken);
  }, []);

  // 🔥 LOAD USER (EDIT MODE)
  useEffect(() => {
    if (!isEdit) return;

    const loadUser = async () => {
      const res = await axiosInstance.get(`/users/${id}`);
      const user = res.data;

      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        department: user.department || "",
      });

      if (user.profileImage) {
        setPreview(user.profileImage);
      }
    };

    loadUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 SUBMIT (CREATE / UPDATE)
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      if (isEdit) {
        // ✏️ UPDATE
        await axiosInstance.put(`/users/${id}`, formData);
        alert("User updated successfully");
      } else {
        // ➕ CREATE
        await axiosInstance.post("/users/add", formData);
        alert("User created successfully");
      }

      router.push("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* HEADER */}
      <div className="bg-green-900 text-yellow-400 text-center py-6 text-2xl font-bold">
        {isEdit ? "Edit User" : "Add User"}
      </div>

      {/* FORM (same as yours — no change needed) */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6 px-6 py-6">
        <input
          name="firstName"
          value={form.firstName}
          placeholder="First Name"
          onChange={handleChange}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <input
          name="lastName"
          value={form.lastName}
          placeholder="Last Name"
          onChange={handleChange}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="Phone"
          onChange={handleChange}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <input
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="p-2 border col-span-2"
        >
          <option value="">Select Role</option>

          {roles.map((role) => (
            <option key={role} value={role}>
              {role.replace(/([A-Z])/g, " $1")}
            </option>
          ))}
        </select>

        {/* IMAGE */}
        <div className="col-span-2">
          <div
            className="border-2 border-dashed p-4 text-center cursor-pointer"
            onClick={() => document.getElementById("imageInput").click()}
          >
            Upload Image
            <input
              id="imageInput"
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <img src={preview} className="w-24 h-24 mt-3 rounded-full" />
          )}
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-center py-6">
        <button
          onClick={handleSubmit}
          className="bg-green-800 text-yellow-400 px-8 py-2 border border-yellow-500 shadow transition transform hover:scale-105 active:scale-95"
        >
          {isEdit ? "Update User" : "Add User"}
        </button>
      </div>
    </div>
  );
}
