import { FiBell, FiSearch } from "react-icons/fi";

function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">

      <h1 className="text-xl font-bold text-slate-800">
        DermaCare
      </h1>

      <div className="flex items-center gap-5">

        <FiSearch
          className="text-slate-500 cursor-pointer"
          size={20}
        />

        <FiBell
          className="text-slate-500 cursor-pointer"
          size={20}
        />

        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />

      </div>

    </header>
  );
}

export default Navbar;