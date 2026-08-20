import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-[#F7F9F6] overflow-x-hidden">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <Sidebar />

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