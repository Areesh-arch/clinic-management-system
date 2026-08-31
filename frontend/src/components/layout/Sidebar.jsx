import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiPackage,
  FiCamera,
  FiSettings,
  FiClipboard,
  FiUserCheck,
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
      name: "Staff",
      icon: <FiUserCheck />,
      path: "/staff",
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
    {
      name: "Settings",
      icon: <FiSettings />,
      path: "/settings",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#FCFBF8] border-r border-[#E6E1D8]">

      {/* Logo */}
      <div className="px-8 py-8">
        <h1 className="text-4xl font-bold text-[#7A9E7E]">
          DermaCare
        </h1>

        <p className="text-[#7E867F] mt-2">
          Dermatology Clinic
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-5 space-y-3">

        {menus.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300
              ${
                isActive
                  ? "bg-[#A8C5A0] text-white shadow-md"
                  : "text-[#45524A] hover:scale-105"
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

      {/* Footer */}
      <div className="p-6 border-t border-[#E6E1D8]">
        <p className="text-sm text-[#8C938D]">
          Version 1.0.0
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;