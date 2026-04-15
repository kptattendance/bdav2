"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance, { attachToken } from "../../../../lib/axios";
import { useAuth } from "@clerk/nextjs";
import Swal from "sweetalert2";
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
  const [loading, setLoading] = useState(false);
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

  const validateForm = () => {
    if (!form.firstName.trim()) return "First Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.role) return "Role is required";

    // simple email check
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) return "Invalid email format";

    // phone basic validation
    if (form.phone.length < 10) return "Phone must be at least 10 digits";

    return null;
  };

  const handleSubmit = async () => {
    try {
      const error = validateForm();

      if (error) {
        return Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: error,
        });
      }

      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      if (isEdit) {
        await axiosInstance.put(`/users/${id}`, formData);
      } else {
        await axiosInstance.post("/users/add", formData);
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        department: "",
      });
      setImage(null);
      setPreview(null);

      await Swal.fire({
        icon: "success",
        title: isEdit ? "User Updated" : "User Created",
        confirmButtonColor: "#166534",
      });

      router.push("/admin/users");
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* HEADER */}
      <div className="bg-green-900  text-yellow-400 text-center py-6 text-2xl font-bold">
        {isEdit ? "Edit User" : "Add User"}
      </div>

      {/* FORM (same as yours — no change needed) */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6 px-6 py-6">
        <input
          name="firstName"
          value={form.firstName}
          placeholder="First Name"
          onChange={handleChange}
          className="p-2 border"
        />

        <input
          name="lastName"
          value={form.lastName}
          placeholder="Last Name"
          onChange={handleChange}
          className="p-2 border"
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="Phone"
          onChange={handleChange}
          className="p-2 border"
        />

        <input
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          className="p-2 border"
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
      <div className="flex justify-center  py-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-800 text-yellow-400 px-8 py-2 border border-yellow-500 shadow flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
              Saving User...
            </>
          ) : isEdit ? (
            "Update User"
          ) : (
            "Add User"
          )}
        </button>
      </div>
    </div>
  );
}
