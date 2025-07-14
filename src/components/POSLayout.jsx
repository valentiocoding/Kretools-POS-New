import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const POSLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default POSLayout;
