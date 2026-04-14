import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}

      <div className="w-64 fixed top-[72px] left-0 h-[calc(100vh-72px)]">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64">
        {/* CONTENT AREA */}

        <div className="bg-white shadow rounded p-6 min-h-[85vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
