"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import { useParams, useRouter } from "next/navigation";

export default function FinalReviewDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [doc, setDoc] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/final-review/${id}`).then((res) => {
      setDoc(res.data);
    });
  }, [id]);

  const handleApprove = async () => {
    setLoading(true);

    await axiosInstance.put(`/final-review/${id}/approve`);

    setLoading(false);
    alert("Final Approved ✅");
    router.push("/final-review");
  };

  const handleReject = async () => {
    if (!reason) {
      alert("Enter rejection reason");
      return;
    }

    setLoading(true);

    await axiosInstance.put(`/final-review/${id}/reject`, { reason });

    setLoading(false);
    alert("Rejected ❌");
    router.push("/final-review");
  };

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Final Review & Approval
      </h1>

      {/* FILE INFO */}
      <Card title="File Information">
        <Grid>
          <Info label="RFID" value={doc.rfid} highlight />
          <Info label="Department" value={doc.department} />
          <Info label="Sub Department" value={doc.subDepartment} />
          <Info
            label="Received Date"
            value={new Date(doc.receivedDate).toLocaleDateString()}
          />
        </Grid>
      </Card>

      {/* USERS */}
      <Card title="Workflow Summary">
        <Grid>
          <UserCard label="RFID" user={doc.rfidTaggedBy} />
          <UserCard label="Prepared" user={doc.filePreparedBy} />
          <UserCard label="Numbered" user={doc.pageNumberedBy} />
          <UserCard label="Scanned" user={doc.scannedBy} />
          <UserCard label="Quality" user={doc.qualityCheckedBy} />
          <UserCard label="Metadata" user={doc.metadataAddedBy} />
        </Grid>
      </Card>

      {/* PAGE SUMMARY */}
      <Card title="Page Details">
        <div className="flex gap-4">
          <Badge label="Note" value={doc.notePages} />
          <Badge label="Main" value={doc.mainPages} />
          <Badge label="Cover" value={doc.coverPages} />
        </div>
      </Card>

      {/* METADATA */}
      <Card title="Metadata">
        <Grid>
          <Info label="File Name" value={doc.fileName} />
          <Info label="Subject" value={doc.fileSubject} />
          <Info label="Year" value={doc.fileYear} />
        </Grid>
      </Card>

      {/* IMAGES */}
      <Card title="Scanned Files">
        <ImageSection title="Note Files" files={doc.noteFiles} />
        <ImageSection title="Main Files" files={doc.mainFiles} />
        <ImageSection title="Cover Files" files={doc.coverFiles} />
      </Card>

      {/* ACTION */}
      <div className="bg-white rounded-xl shadow p-6">
        <textarea
          placeholder="Reason (if reject)"
          className="w-full p-3 border rounded mb-4 bg-red-50"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Approve ✅
          </button>

          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-2 rounded"
          >
            Reject ❌
          </button>
        </div>
      </div>
    </div>
  );
}

//
// COMPONENTS
//

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-5 mb-6">
    <h2 className="text-green-700 font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-4">{children}</div>
);

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
  <div className="bg-green-50 px-4 py-3 rounded text-center">
    <div className="text-xs">{label}</div>
    <div className="font-bold text-green-700">{value || 0}</div>
  </div>
);

const UserCard = ({ label, user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
      <img
        src={user.profileImage || "/avatar.png"}
        className="w-8 h-8 rounded-full"
      />
      <div className="text-xs">
        <div className="font-semibold">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-gray-500">{user.phone}</div>
        <div className="text-green-600">{label}</div>
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
          <img key={i} src={img} className="w-full h-24 object-cover rounded" />
        ))}
      </div>
    </div>
  );
};
