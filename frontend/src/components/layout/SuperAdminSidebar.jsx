import { useEffect } from "react";

import {
  FiHome,
  FiBriefcase,
  FiCreditCard,
  FiUsers,
  FiShield,
  FiCalendar,
  FiUserCheck,
  FiClipboard,
  FiCamera,
  FiPackage,
  FiDollarSign,
  FiEdit3,
  FiSettings,
  FiX,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";


function SuperAdminSidebar({
  mobileOpen = false,
  onClose = () => {},
}) {

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
      name: "Super Admins",
      icon: <FiShield />,
      path: "/platform/admins",
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
      name: "CMS",
      icon: <FiEdit3 />,
      path: "/cms",
    },
  ];


  // =====================================================
  // ESC KEY
  // =====================================================

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [mobileOpen, onClose]);


  // =====================================================
  // BODY SCROLL LOCK
  // =====================================================

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileOpen]);


  // =====================================================
  // MENU RENDER
  // =====================================================

  const renderMenu = (menus) =>
    menus.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        onClick={onClose}
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
    <>
      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-9998
          bg-[#173B32]/40
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          lg:hidden
          ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={onClose}
        aria-hidden="true"
      />


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-9999
          flex
          w-75
          max-w-[88vw]
          flex-col
          border-r
          border-[#D8C99B]/60
          bg-[#FCFBF8]
          shadow-2xl
          transition-transform
          duration-300
          ease-out
          lg:static
          lg:z-auto
          lg:w-72
          lg:max-w-none
          lg:translate-x-0
          lg:shrink-0
          lg:shadow-none

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* =================================================
            MOBILE HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-[#E6E1D8] px-6 py-5 lg:hidden">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-[#234D3C]">
              DermaCare
            </h1>

            <div className="mt-2 inline-flex items-center rounded-full border border-[#D8C99B] bg-[#F5F1E7] px-3 py-1">

              <span className="text-[9px] font-bold tracking-[0.18em] text-[#9B8246]">
                PLATFORM ADMIN
              </span>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#E6E1D8]
              bg-[#F7F3E9]
              text-[#173B32]
              transition
              hover:bg-[#EEF3EB]
            "
            aria-label="Close navigation menu"
          >
            <FiX size={20} />
          </button>

        </div>


        {/* =================================================
            DESKTOP BRAND
        ================================================= */}

        <div className="hidden border-b border-[#E6E1D8] px-7 py-7 lg:block">

          <h1 className="text-3xl font-bold tracking-tight text-[#234D3C]">
            DermaCare
          </h1>

          <div className="mt-3 inline-flex items-center rounded-full border border-[#D8C99B] bg-[#F5F1E7] px-3 py-1">

            <span className="text-[10px] font-bold tracking-[0.18em] text-[#9B8246]">
              PLATFORM ADMIN
            </span>

          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

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


          {/* SYSTEM */}

          <div className="mt-8 border-t border-[#E6E1D8] pt-6">

            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-[#9B8246]">
              SYSTEM
            </p>

            <NavLink
              to="/settings"
              onClick={onClose}
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


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="border-t border-[#E6E1D8] p-6">

          <p className="text-xs font-medium text-[#647267]">
            DermaCare SaaS
          </p>

          <p className="mt-1 text-xs text-[#9B8246]">
            Platform Administration
          </p>

        </div>

      </aside>
    </>
  );
}


export default SuperAdminSidebar;