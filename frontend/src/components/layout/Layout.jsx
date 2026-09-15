import { useState } from "react";

import Sidebar from "./Sidebar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { useAuth } from "../../context/AuthContext";

function Layout({ children }) {
  const { user, loading } = useAuth();

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const isSuperAdmin =
    user?.role?.toLowerCase() === "super_admin";

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F7F9F6] overflow-x-hidden">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      {!loading && isSuperAdmin ? (
        <SuperAdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={closeMobileSidebar}
        />
      ) : (
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={closeMobileSidebar}
        />
      )}

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <div className="flex-1 min-w-0 max-w-full flex flex-col">

        {/* Navbar */}

        <Navbar
          onMenuClick={openMobileSidebar}
        />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}

        <Footer />

      </div>

    </div>
  );
}

export default Layout;