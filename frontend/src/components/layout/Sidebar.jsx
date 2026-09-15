import { useEffect, useState } from "react";

import {
  FiHome,
  FiCalendar,
  FiPackage,
  FiCamera,
  FiClipboard,
  FiCreditCard,
  FiEdit3,
  FiSettings,
  FiLock,
  FiX,
  FiArrowUp,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

import { getMySubscription } from "../../services/subscriptionService";
import { getCurrentUser } from "../../services/settingsService";

function Sidebar({
  mobileOpen = false,
  onClose = () => {},
}) {
  // =====================================================
  // SUBSCRIPTION
  // =====================================================

  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [userRole, setUserRole] = useState("");

  // =====================================================
  // UPGRADE MODAL
  // =====================================================

  const [upgradeModule, setUpgradeModule] =
    useState(null);

  // =====================================================
  // LOAD USER + SUBSCRIPTION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    async function loadSidebarAccess() {
      try {
        setLoadingPlan(true);

        const user = await getCurrentUser();

        if (!mounted) return;

        const role = String(user?.role || "")
          .toLowerCase()
          .trim();

        setUserRole(role);

        // -------------------------------------------------
        // SUPER ADMIN
        // -------------------------------------------------

        if (role === "super_admin") {
          setPlan("PREMIUM");
          return;
        }

        // -------------------------------------------------
        // CURRENT SUBSCRIPTION
        // -------------------------------------------------

        const subscription =
          await getMySubscription();

        if (!mounted) return;

        const currentPlan = String(
          subscription?.plan || ""
        )
          .toUpperCase()
          .trim();

        setPlan(currentPlan || "BASIC");

      } catch (error) {
        console.error(
          "Failed to load sidebar subscription:",
          error
        );

        if (mounted) {
          setPlan("BASIC");
        }

      } finally {
        if (mounted) {
          setLoadingPlan(false);
        }
      }
    }

    loadSidebarAccess();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // CLOSE MOBILE SIDEBAR ON ESC
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
  // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR OPEN
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
  // PLAN LEVEL
  // =====================================================

  const PLAN_LEVEL = {
    BASIC: 1,
    STANDARD: 2,
    PREMIUM: 3,
  };

  const currentPlanLevel =
    PLAN_LEVEL[plan] || 1;

  // =====================================================
  // FEATURE ACCESS
  // =====================================================

  const hasAccess = (requiredLevel) => {
    if (userRole === "super_admin") {
      return true;
    }

    return currentPlanLevel >= requiredLevel;
  };

  // =====================================================
  // SIDEBAR MENU
  // =====================================================

  const menus = [
    {
      name: "Dashboard",
      icon: <FiHome />,
      path: "/dashboard",
      requiredLevel: 1,
    },

    {
      name: "Appointments",
      icon: <FiCalendar />,
      path: "/appointments",
      requiredLevel: 1,
    },

    {
      name: "Treatments",
      icon: <FiClipboard />,
      path: "/treatments",
      requiredLevel: 1,
    },

    {
      name: "Billing",
      icon: <FiCreditCard />,
      path: "/billing",
      requiredLevel: 1,
    },

    {
      name: "Inventory",
      icon: <FiPackage />,
      path: "/inventory",
      requiredLevel: 2,
    },

    {
      name: "Photos",
      icon: <FiCamera />,
      path: "/photos",
      requiredLevel: 3,
    },

    {
      name: "CMS",
      icon: <FiEdit3 />,
      path: "/cms",
      requiredLevel: 3,
    },
  ];

  // =====================================================
  // LOCKED MODULE
  // =====================================================

  const handleLockedClick = (module) => {
    setUpgradeModule(module);
  };

  // =====================================================
  // CLOSE UPGRADE MODAL
  // =====================================================

  const closeUpgradeModal = () => {
    setUpgradeModule(null);
  };

  // =====================================================
  // REQUIRED PLAN NAME
  // =====================================================

  const getRequiredPlanName = (requiredLevel) => {
    if (requiredLevel === 3) {
      return "Premium";
    }

    if (requiredLevel === 2) {
      return "Standard";
    }

    return "Basic";
  };

  // =====================================================
  // NAVIGATION ITEM
  // =====================================================

  const renderMenuItem = (item) => {

    // -------------------------------------------------
    // LOADING
    // -------------------------------------------------

    if (loadingPlan) {
      return (
        <div
          key={item.name}
          className="
            flex
            items-center
            gap-4
            rounded-2xl
            px-5
            py-4
            text-[#9A9F9B]
            animate-pulse
          "
        >
          <span className="text-xl">
            {item.icon}
          </span>

          <span className="font-medium">
            {item.name}
          </span>
        </div>
      );
    }

    // -------------------------------------------------
    // CHECK ACCESS
    // -------------------------------------------------

    const unlocked = hasAccess(
      item.requiredLevel
    );

    // -------------------------------------------------
    // LOCKED MODULE
    // -------------------------------------------------

    if (!unlocked) {
      return (
        <button
          key={item.name}
          type="button"
          onClick={() =>
            handleLockedClick(item)
          }
          title={`Upgrade your plan to access ${item.name}`}
          className="
            w-full
            flex
            items-center
            gap-4
            rounded-2xl
            px-5
            py-4
            text-left
            text-[#9A9F9B]
            bg-[#F5F2EB]
            border
            border-transparent
            cursor-not-allowed
            transition-all
            duration-200
            hover:border-[#D8CBAF]
            hover:bg-[#F1EEE6]
          "
        >
          <span className="text-xl opacity-70">
            {item.icon}
          </span>

          <span className="font-medium flex-1">
            {item.name}
          </span>

          <FiLock
            className="
              text-[#A58B52]
              text-base
              shrink-0
            "
          />
        </button>
      );
    }

    // -------------------------------------------------
    // UNLOCKED MODULE
    // -------------------------------------------------

    return (
      <NavLink
        key={item.name}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `
          flex
          items-center
          gap-4
          rounded-2xl
          px-5
          py-4
          transition-all
          duration-200

          ${
            isActive
              ? "bg-[#173B32] text-white shadow-md"
              : "text-[#45524A] hover:bg-[#EEF3EB] hover:text-[#315D4B]"
          }
          `
        }
      >
        <span className="text-xl">
          {item.icon}
        </span>

        <span className="font-medium">
          {item.name}
        </span>
      </NavLink>
    );
  };

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
          w-72.5
          max-w-[85vw]
          flex-col
          bg-[#FCFBF8]
          border-r
          border-[#E6E1D8]
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
          lg:border-r
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
            <h1 className="text-2xl font-bold text-[#173B32]">
              DermaCare
            </h1>

            <p className="mt-1 text-xs text-[#7E867F]">
              Dermatology Clinic
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
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

        <div className="hidden border-b border-[#E6E1D8] px-8 py-8 lg:block">

          <h1 className="text-4xl font-bold text-[#173B32]">
            DermaCare
          </h1>

          <p className="mt-2 text-[#7E867F]">
            Dermatology Clinic
          </p>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-2">

          {menus.map(renderMenuItem)}


          {/* =================================================
              SETTINGS
          ================================================= */}

          <div className="pt-4 mt-4 border-t border-[#E6E1D8]">

            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4
                rounded-2xl
                px-5
                py-4
                transition-all
                duration-200

                ${
                  isActive
                    ? "bg-[#173B32] text-white shadow-md"
                    : "text-[#45524A] hover:bg-[#EEF3EB] hover:text-[#315D4B]"
                }
                `
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
            CURRENT PLAN
        ================================================= */}

        <div className="px-6 pb-4">

          {!loadingPlan && plan && (
            <div
              className="
                rounded-2xl
                border
                border-[#D8CDB5]
                bg-[#F7F3E9]
                px-4
                py-3
              "
            >
              <p className="text-[11px] uppercase tracking-wider text-[#8C938D]">
                Current Plan
              </p>

              <p className="mt-1 font-semibold text-[#173B32]">
                {plan}
              </p>
            </div>
          )}

        </div>


        {/* =================================================
            VERSION
        ================================================= */}

        <div className="border-t border-[#E6E1D8] p-6">

          <p className="text-sm text-[#8C938D]">
            Version 1.0.0
          </p>

        </div>

      </aside>


      {/* ===================================================
          UPGRADE MODAL
      =================================================== */}

      {upgradeModule && (
        <div
          className="
            fixed
            inset-0
            z-10000
            flex
            items-center
            justify-center
            bg-[#173B32]/40
            backdrop-blur-sm
            px-4
          "
          onClick={closeUpgradeModal}
        >

          <div
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-[#D8CDB5]
              bg-[#FCFBF8]
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="h-1.5 bg-[#A58B52]" />

            <button
              type="button"
              onClick={closeUpgradeModal}
              className="
                absolute
                right-5
                top-5
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[#6F776F]
                transition
                hover:bg-[#EEF3EB]
                hover:text-[#173B32]
              "
              aria-label="Close"
            >
              <FiX size={19} />
            </button>

            <div className="px-7 py-8 text-center">

              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#173B32]
                  text-[#F7F3E9]
                  shadow-md
                "
              >
                <FiLock size={26} />
              </div>

              <h2 className="text-2xl font-bold text-[#173B32]">
                {upgradeModule.name} is locked
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6F776F]">
                The{" "}
                <span className="font-semibold text-[#173B32]">
                  {upgradeModule.name}
                </span>{" "}
                module is available on the{" "}
                <span className="font-semibold text-[#A58B52]">
                  {getRequiredPlanName(
                    upgradeModule.requiredLevel
                  )}
                </span>{" "}
                plan.
              </p>

              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-[#E2D8C4]
                  bg-[#F7F3E9]
                  px-5
                  py-4
                "
              >
                <p className="text-xs uppercase tracking-wider text-[#8C938D]">
                  Your Current Plan
                </p>

                <p className="mt-1 text-lg font-bold text-[#173B32]">
                  {plan}
                </p>
              </div>

              <button
                type="button"
                onClick={closeUpgradeModal}
                className="
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#173B32]
                  px-5
                  py-3.5
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  duration-200
                  hover:bg-[#23483A]
                  hover:shadow-lg
                "
              >
                <FiArrowUp size={18} />

                Upgrade Your Plan
              </button>

              <button
                type="button"
                onClick={closeUpgradeModal}
                className="
                  mt-3
                  w-full
                  rounded-2xl
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-[#6F776F]
                  transition
                  hover:text-[#173B32]
                "
              >
                Maybe Later
              </button>

            </div>
          </div>

        </div>
      )}
    </>
  );
}

export default Sidebar;