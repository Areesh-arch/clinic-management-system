import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#F7F9F6]">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;