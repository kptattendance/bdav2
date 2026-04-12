"use client";

import { useState } from "react";

export default function AddUserPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "citizen",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name is required";
    if (!form.email) err.email = "Email is required";
    if (!form.phone) err.phone = "Phone is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    console.log("User Data:", form);
    console.log("Image:", image);

    alert("User Ready (Backend next)");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>

      <div className="bg-white p-6 shadow rounded space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Role */}
        <select
          name="role"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="admin">Admin</option>
          <option value="officer">Officer</option>
          <option value="staff">Staff</option>
          <option value="citizen">Citizen</option>
        </select>

        {/* Image Upload */}
        <div>
          <label className="block mb-1">Profile Image</label>
          <input type="file" onChange={handleImage} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 mt-2 rounded-full object-cover"
            />
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full"
        >
          Create User
        </button>
      </div>
    </div>
  );
}
