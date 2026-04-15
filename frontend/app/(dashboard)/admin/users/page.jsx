"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axiosInstance, { attachToken } from "../../../lib/axios";
import Swal from "sweetalert2";
export default function UsersPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  attachToken(getToken);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    attachToken(getToken);

    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users
    .filter((u) => u.email !== "rajleelavathi6@gmail.com") // ❌ hide this user
    .filter((u) =>
      `${u.firstName} ${u.email} ${u.phone}`
        ?.toLowerCase()
        .includes(search.toLowerCase()),
    );
  // 📄 PAGINATION LOGIC
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setDeleteLoading(id);

      await axiosInstance.delete(`/users/${id}`);

      setUsers(users.filter((u) => u._id !== id));

      // ✅ SUCCESS ALERT
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      // ❌ ERROR ALERT
      Swal.fire({
        title: "Error!",
        text: "Failed to delete user.",
        icon: "error",
      });
    } finally {
      setDeleteLoading(null);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex items-center gap-3 text-green-800 font-semibold">
          <span className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></span>
          Loading Users...
        </div>
      </div>
    );
  }
  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-green-900">Manage Users</h1>

        {/* SEARCH */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page
            }}
            placeholder="Search users..."
            className="w-full pl-10 pr-3 py-2 border border-green-800 rounded"
          />
        </div>

        {/* ADD */}
        <button
          onClick={() => router.push("/admin/users/add")}
          className="bg-green-800 cursor-pointer text-white px-5 py-2 rounded"
        >
          + Add User
        </button>
      </div>
      {currentUsers.length === 0 && (
        <div className="text-center py-10 text-gray-500">No users found</div>
      )}
      {/* TABLE */}
      <div className="bg-white shadow rounded border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                {/* SL NO */}
                <td className="p-3">{indexOfFirst + index + 1}</td>

                {/* IMAGE */}
                <td className="p-3">
                  <img
                    src={user.profileImage || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full"
                  />
                </td>

                {/* NAME */}
                <td className="p-3">
                  {user.firstName} {user.lastName}
                </td>

                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone || "-"}</td>

                <td className="p-3">
                  <span className="bg-green-100 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/users/edit/${user._id}`)}
                    className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deleteLoading === user._id}
                    className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded flex items-center gap-2"
                  >
                    {deleteLoading === user._id ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION UI */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        <span className="px-4 py-1">
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
