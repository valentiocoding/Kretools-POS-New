import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const POSLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar always on top and fixed */}
      <div className="fixed top-0 left-0 h-screen z-50">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main content with left margin based on sidebar width */}
      <div
        className="flex-1 p-6 overflow-auto bg-gray-50"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default POSLayout;
