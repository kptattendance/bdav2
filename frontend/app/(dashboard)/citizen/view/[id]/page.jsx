"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Required for PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentViewer() {
  const [numPages, setNumPages] = useState(null);

  // MOCK DATA (replace later with API)
  const doc = {
    title: "Land Record 2020",
    department: "Revenue",
    date: "2020-05-10",
    owner: "Ramesh",
    location: "Bangalore",
    fileUrl: "/sample.pdf", // place sample.pdf in public folder
  };

  return (
    <div className="flex gap-6">
      {/* PDF VIEWER */}
      <div className="flex-1 bg-white p-4 shadow rounded">
        <Document
          file={doc.fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={index} pageNumber={index + 1} />
          ))}
        </Document>
      </div>

      {/* METADATA PANEL */}
      <div className="w-80 bg-white p-4 shadow rounded">
        <h2 className="font-bold mb-4">Document Details</h2>

        <p>
          <strong>Title:</strong> {doc.title}
        </p>
        <p>
          <strong>Department:</strong> {doc.department}
        </p>
        <p>
          <strong>Date:</strong> {doc.date}
        </p>
        <p>
          <strong>Owner:</strong> {doc.owner}
        </p>
        <p>
          <strong>Location:</strong> {doc.location}
        </p>

        {/* ACTIONS */}
        <div className="mt-6 space-y-2">
          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Download
          </button>

          <button className="w-full bg-gray-600 text-white py-2 rounded">
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
