"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axiosInstance, { attachToken } from "../../../lib/axios";

export default function UsersPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    attachToken(getToken);

    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
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

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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
          className="bg-green-800 text-white px-5 py-2 rounded"
        >
          + Add User
        </button>
      </div>

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
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
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
