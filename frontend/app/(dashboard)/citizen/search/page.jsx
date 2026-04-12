"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const mockResults = [
    {
      id: 1,
      title: "Land Record 2020",
      department: "Revenue",
      date: "2020-05-10",
    },
    {
      id: 2,
      title: "Building Approval",
      department: "Urban Planning",
      date: "2022-08-15",
    },
  ];

  return (
    <div className="flex gap-6">
      {/* LEFT FILTER PANEL */}
      <div className="w-64 bg-white p-4 shadow rounded">
        <h2 className="font-bold mb-4">Filters</h2>

        <div className="mb-3">
          <label className="text-sm">Department</label>
          <select className="w-full border p-2 mt-1 rounded">
            <option>All</option>
            <option>Revenue</option>
            <option>Urban Planning</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="text-sm">Document Type</label>
          <select className="w-full border p-2 mt-1 rounded">
            <option>All</option>
            <option>Land Record</option>
            <option>Approval</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Date</label>
          <input type="date" className="w-full border p-2 mt-1 rounded" />
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1">
        {/* SEARCH BAR */}
        <div className="bg-white p-4 shadow rounded mb-4 flex gap-3">
          <input
            type="text"
            placeholder="Search documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button className="bg-blue-600 text-white px-4 rounded">
            Search
          </button>
        </div>

        {/* RESULTS */}
        <div className="space-y-3">
          {mockResults.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/citizen/view/${doc.id}`)}
              className="bg-white p-4 shadow rounded hover:bg-gray-50 cursor-pointer"
            >
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="text-sm text-gray-600">Dept: {doc.department}</p>
              <p className="text-sm text-gray-600">Date: {doc.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
