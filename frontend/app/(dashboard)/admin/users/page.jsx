"use client";

import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();

  // MOCK DATA (replace later with backend)
  const users = [
    {
      id: 1,
      name: "Ramesh",
      email: "ramesh@gmail.com",
      role: "admin",
    },
    {
      id: 2,
      name: "Sita",
      email: "sita@gmail.com",
      role: "staff",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Users</h1>

        <button
          onClick={() => router.push("/admin/users/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.role}</td>

                <td className="space-x-2">
                  <button className="text-blue-600">Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
