"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";

export default function QualityDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [doc, setDoc] = useState(null);
  const [reason, setReason] = useState("");
  const [sendToStage, setSendToStage] = useState("");
  const [sendToUser, setSendToUser] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/quality/${id}`).then((res) => {
      setDoc(res.data);
    });

    axiosInstance.get("/users").then((res) => {
      setUsers(res.data);
    });
  }, [id]);

  const handleApprove = async () => {
    await axiosInstance.put(`/quality/${id}/approve`);
    alert("Approved ✅");
    router.push("/quality");
  };

  const handleReject = async () => {
    if (!reason || !sendToStage || !sendToUser) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    await axiosInstance.put(`/quality/${id}/reject`, {
      reason,
      sendToStage,
      sendToUser,
    });

    setLoading(false);

    alert("Rejected & Sent Back 🔁");
    router.push("/quality");
  };

  // 🔥 FILTER USERS BASED ON SELECTED STAGE

  const getFilteredUsers = () => {
    if (!sendToStage) return [];

    const roleMap = {
      RFID_TAGGED: "RFIDTagging",
      FILE_PREPARED: "FilePreparation",
      NUMBERED: "Numbering",
      SCANNED: "Scanning",
    };

    const requiredRole = roleMap[sendToStage];

    return users.filter((u) => u.role === requiredRole);
  };

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-green-700 mb-6">Quality Check</h1>

      {/* FILE INFO */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="font-semibold text-green-700 mb-3">File Information</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <Info label="RFID" value={doc.rfid} highlight />
          <Info label="Department" value={doc.department} />
          <Info label="Sub Department" value={doc.subDepartment} />
          <Info
            label="Received Date"
            value={new Date(doc.receivedDate).toLocaleDateString()}
          />
        </div>
      </div>

      {/* USERS */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="font-semibold text-green-700 mb-4">Workflow Users</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <UserCard title="RFID Tagged" user={doc.rfidTaggedBy} />
          <UserCard title="Prepared" user={doc.filePreparedBy} />
          <UserCard title="Numbered" user={doc.pageNumberedBy} />
          <UserCard title="Scanned" user={doc.scannedBy} />
        </div>
      </div>

      {/* PAGE SUMMARY */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="font-semibold text-green-700 mb-4">Page Summary</h2>

        <div className="flex gap-4">
          <Badge label="Note" value={doc.notePages} />
          <Badge label="Main" value={doc.mainPages} />
          <Badge label="Cover" value={doc.coverPages} />
        </div>
      </div>

      {/* IMAGES */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="font-semibold text-green-700 mb-4">Scanned Files</h2>

        <ImageSection title="Note Files" files={doc.noteFiles} />
        <ImageSection title="Main Files" files={doc.mainFiles} />
        <ImageSection title="Cover Files" files={doc.coverFiles} />
      </div>

      {/* ACTION */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-green-700 font-semibold mb-4">Quality Decision</h2>

        {/* REASON */}
        <textarea
          placeholder="Enter rejection reason..."
          className="w-full rounded-lg bg-red-50 border border-red-200 p-3 mb-4 focus:ring-2 focus:ring-red-400"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* STAGE */}
        <select
          className="w-full mb-3 p-2 border rounded"
          value={sendToStage}
          onChange={(e) => setSendToStage(e.target.value)}
        >
          <option value="">Select Stage</option>
          <option value="RFID_TAGGED">RFID Tagging</option>
          <option value="FILE_PREPARED">File Preparation</option>
          <option value="NUMBERED">Numbering</option>
          <option value="SCANNED">Scanning</option>
        </select>

        {/* 🔥 USER SELECT (FILTERED) */}
        <select
          className="w-full mb-4 p-2 border rounded"
          value={sendToUser}
          onChange={(e) => setSendToUser(e.target.value)}
        >
          <option value="">Select User</option>

          {getFilteredUsers().map((u) => (
            <option key={u._id} value={u._id}>
              {u.firstName} {u.lastName} ({u.role})
            </option>
          ))}
        </select>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Approve ✅
          </button>

          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow"
          >
            {loading ? "Processing..." : "Reject & Send Back ❌"}
          </button>
        </div>
      </div>
    </div>
  );
}

//
// COMPONENTS
//

const Info = ({ label, value, highlight }) => (
  <div>
    <div className="text-xs text-gray-400 uppercase">{label}</div>
    <div
      className={`mt-1 ${
        highlight ? "text-green-700 font-semibold text-lg" : "text-gray-800"
      }`}
    >
      {value || "-"}
    </div>
  </div>
);

const Badge = ({ label, value }) => (
  <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-xl text-center">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-lg font-bold text-green-700">{value || 0}</div>
  </div>
);

const UserCard = ({ title, user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
      <img
        src={user.profileImage || "/avatar.png"}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <div className="text-sm font-semibold">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-gray-500">{user.phone}</div>
        <div className="text-xs text-green-600">{title}</div>
      </div>
    </div>
  );
};

const ImageSection = ({ title, files }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>

      <div className="grid grid-cols-4 gap-2">
        {files.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-24 object-cover rounded-lg border"
          />
        ))}
      </div>
    </div>
  );
};
