import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiPackage,
  FiCamera,
  FiClipboard,
  FiCreditCard,
  FiUserPlus,
  FiEdit3,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menus = [
    {
      name: "Dashboard",
      icon: <FiHome />,
      path: "/dashboard",
    },
    {
      name: "Patients",
      icon: <FiUsers />,
      path: "/patients",
    },
    {
      name: "Appointments",
      icon: <FiCalendar />,
      path: "/appointments",
    },
    {
      name: "Treatments",
      icon: <FiClipboard />,
      path: "/treatments",
    },
    {
      name: "Photos",
      icon: <FiCamera />,
      path: "/photos",
    },
    {
      name: "Inventory",
      icon: <FiPackage />,
      path: "/inventory",
    },
    {
      name: "Billing",
      icon: <FiCreditCard />,
      path: "/billing",
    },
    {
      name: "CRM",
      icon: <FiUserPlus />,
      path: "/crm",
    },
    {
      name: "CMS",
      icon: <FiEdit3 />,
      path: "/cms",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-[#FCFBF8] border-r border-[#E6E1D8]">

      {/* =====================================================
          BRAND
      ===================================================== */}
      <div className="px-8 py-8 border-b border-[#E6E1D8]">

        <h1 className="text-4xl font-bold text-[#7A9E7E]">
          DermaCare
        </h1>

        <p className="text-[#7E867F] mt-2">
          Dermatology Clinic
        </p>

      </div>

      {/* =====================================================
          MENU
      ===================================================== */}
      <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-2">

        {menus.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 ${
                isActive
                  ? "bg-[#A8C5A0] text-white shadow-md"
                  : "text-[#45524A] hover:bg-[#EEF3EB] hover:text-[#315D4B]"
              }`
            }
          >
            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <div className="p-6 border-t border-[#E6E1D8]">

        <p className="text-sm text-[#8C938D]">
          Version 1.0.0
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;