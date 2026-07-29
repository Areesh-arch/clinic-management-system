import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FAFBF8] to-[#F2F5EE]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

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