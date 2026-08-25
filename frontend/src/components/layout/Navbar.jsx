import { useState } from "react";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";

import Avatar from "../ui/Avatar";
import { logoutUser } from "../../services/authService";

function Navbar() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();

    // Send owner back to login
    window.location.href = "/login";
  };

  return (
    <header className="bg-[#FCFBF8] h-20 border-b border-slate-200 px-8 flex items-center justify-end">

      <div className="relative">

        {/* PROFILE BUTTON */}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F3F5F1] transition"
        >

          <Avatar image="https://i.pravatar.cc/150?img=8" />

          <div className="hidden sm:block text-left">

            <p className="text-sm font-semibold text-[#45524A]">
              Owner
            </p>

            <p className="text-xs text-[#8C938D]">
              Clinic Administrator
            </p>

          </div>

          <FiChevronDown
            className={`text-[#45524A] transition ${
              open ? "rotate-180" : ""
            }`}
          />

        </button>

        {/* DROPDOWN */}

        {open && (
          <div className="absolute right-0 top-16 w-64 bg-white rounded-2xl shadow-lg border border-[#E6E1D8] py-2 z-50">

            <div className="px-4 py-3 border-b border-[#E6E1D8]">

              <p className="font-semibold text-[#45524A]">
                Clinic Owner
              </p>

              <p className="text-sm text-[#8C938D]">
                Manage your clinic
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition"
            >

              <FiLogOut />

              <span className="font-medium">
                Logout
              </span>

            </button>

          </div>
        )}

      </div>

    </header>
  );
}

export default Navbar;