import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiBox,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: FiHome },
  { name: "Patients", path: "/patients", icon: FiUsers },
  { name: "Appointments", path: "/appointments", icon: FiCalendar },
  { name: "Inventory", path: "/inventory", icon: FiBox },
  { name: "Settings", path: "/settings", icon: FiSettings },
];

function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-teal-400">
          DermaCare
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Dermatology Clinic
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4 text-xs text-slate-400">
        Version 1.0.0
      </div>
    </aside>
  );
}

export default Sidebar;