import {
  FiHome,
  FiBriefcase,
  FiCreditCard,
  FiUsers,
  FiCalendar,
  FiUserCheck,
  FiClipboard,
  FiCamera,
  FiPackage,
  FiDollarSign,
  FiUserPlus,
  FiEdit3,
  FiSettings,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

function SuperAdminSidebar() {
  const platformMenus = [
    {
      name: "Dashboard",
      icon: <FiHome />,
      path: "/platform",
    },
    {
      name: "Tenants",
      icon: <FiBriefcase />,
      path: "/tenants",
    },
    {
      name: "Subscriptions",
      icon: <FiCreditCard />,
      path: "/subscriptions",
    },
  ];

  const clinicMenus = [
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
      icon: <FiDollarSign />,
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

  const renderMenu = (menus) =>
    menus.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-200 ${
            isActive
              ? "bg-[#315D4B] text-white shadow-md"
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
    ));

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-[#D8C99B]/60 bg-[#FCFBF8]">

      {/* =====================================================
          BRAND
      ===================================================== */}
      <div className="border-b border-[#E6E1D8] px-7 py-7">
        <h1 className="text-3xl font-bold tracking-tight text-[#234D3C]">
          DermaCare
        </h1>

        <div className="mt-3 inline-flex items-center rounded-full border border-[#D8C99B] bg-[#F5F1E7] px-3 py-1">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#9B8246]">
            PLATFORM ADMIN
          </span>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <nav className="flex-1 overflow-y-auto px-5 py-6">

        {/* PLATFORM */}
        <div>
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-[#9B8246]">
            PLATFORM
          </p>

          <div className="space-y-2">
            {renderMenu(platformMenus)}
          </div>
        </div>

        {/* CLINIC PORTAL */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-[#9B8246]">
            CLINIC PORTAL
          </p>

          <div className="space-y-2">
            {renderMenu(clinicMenus)}
          </div>
        </div>

        {/* SETTINGS */}
        <div className="mt-8 border-t border-[#E6E1D8] pt-6">

          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-[#9B8246]">
            SYSTEM
          </p>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-200 ${
                isActive
                  ? "bg-[#315D4B] text-white shadow-md"
                  : "text-[#45524A] hover:bg-[#EEF3EB] hover:text-[#315D4B]"
              }`
            }
          >
            <span className="text-xl">
              <FiSettings />
            </span>

            <span className="font-medium">
              Settings
            </span>
          </NavLink>

        </div>

      </nav>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <div className="border-t border-[#E6E1D8] p-6">
        <p className="text-xs font-medium text-[#647267]">
          DermaCare SaaS
        </p>

        <p className="mt-1 text-xs text-[#9B8246]">
          Platform Administration
        </p>
      </div>

    </aside>
  );
}

export default SuperAdminSidebar;