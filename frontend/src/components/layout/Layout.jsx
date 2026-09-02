import Sidebar from "./Sidebar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { useAuth } from "../../context/AuthContext";

function Layout({ children }) {
  const { user, loading } = useAuth();

  const isSuperAdmin =
    user?.role?.toLowerCase() === "super_admin";

  return (
    <div className="min-h-screen w-full flex bg-[#F7F9F6] overflow-x-hidden">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      {!loading && isSuperAdmin ? (
        <SuperAdminSidebar />
      ) : (
        <Sidebar />
      )}

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <div className="flex-1 min-w-0 max-w-full flex flex-col">

        {/* Navbar */}
        <Navbar />

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