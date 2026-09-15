import { useEffect, useState } from "react";

import {
  FiChevronDown,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

import Avatar from "../ui/Avatar";

import { logoutUser } from "../../services/authService";

import { getCurrentUser } from "../../services/settingsService";

import {
  getSelectedTenantName,
  subscribeToTenantChanges,
} from "../../utils/tenantContext";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN =
  API_BASE_URL.replace(
    /\/api\/v1\/?$/,
    ""
  );


// ============================================================
// IMAGE URL
// ============================================================

function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_ORIGIN}${imageUrl}`;
  }

  return `${API_ORIGIN}/${imageUrl}`;
}


// ============================================================
// NAVBAR
// ============================================================

function Navbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(null);

  const [clinicName, setClinicName] =
    useState(
      getSelectedTenantName() || "Clinic"
    );

  const [imageVersion, setImageVersion] =
    useState(Date.now());


  // ============================================================
  // LOAD CURRENT USER
  // ============================================================

  const loadNavbarData = async () => {
    try {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);

      setImageVersion(Date.now());

    } catch (error) {
      console.error(
        "Failed to load navbar user:",
        error
      );
    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadNavbarData();
  }, []);


  // ============================================================
  // PROFILE IMAGE CHANGE
  // ============================================================

  useEffect(() => {
    const handleProfileImageChange = () => {
      setImageVersion(Date.now());

      loadNavbarData();
    };

    window.addEventListener(
      "dermacare-profile-image-changed",
      handleProfileImageChange
    );

    return () => {
      window.removeEventListener(
        "dermacare-profile-image-changed",
        handleProfileImageChange
      );
    };
  }, []);


  // ============================================================
  // CLINIC CHANGE
  // ============================================================

  useEffect(() => {
    const unsubscribe =
      subscribeToTenantChanges(
        (selectedTenant) => {
          if (
            !selectedTenant ||
            !selectedTenant.id
          ) {
            setClinicName("Clinic");
            return;
          }

          setClinicName(
            selectedTenant.business_name ||
              getSelectedTenantName() ||
              "Clinic"
          );
        }
      );

    return unsubscribe;
  }, []);


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    logoutUser();

    window.location.href = "/login";
  };


  // ============================================================
  // USER IMAGE
  // ============================================================

  const profileImage =
    user?.profile_image_url
      ? `${getImageUrl(
          user.profile_image_url
        )}?v=${imageVersion}`
      : null;


  // ============================================================
  // USER NAME
  // ============================================================

  const userName =
    user?.name ||
    "User";


  // ============================================================
  // UI
  // ============================================================

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#E6E1D8] bg-[#FCFBF8] px-4 sm:px-8">

      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={onMenuClick}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-[#E6E1D8]
          bg-[#F7F3E9]
          text-[#173B32]
          shadow-sm
          transition-all
          hover:bg-[#EEF3EB]
          hover:border-[#D8CDB5]
          lg:hidden
        "
        aria-label="Open navigation menu"
      >
        <FiMenu size={22} />
      </button>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="relative ml-auto">

        <button
          type="button"
          onClick={() =>
            setOpen((prev) => !prev)
          }
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-[#F3F5F1]"
        >

          {/* USER AVATAR */}

          <Avatar
            image={profileImage}
            name={userName}
          />


          {/* USER / CLINIC INFO */}

          <div className="hidden text-left sm:block">

            <p className="text-sm font-semibold text-[#45524A]">
              {userName}
            </p>

            <p className="text-xs text-[#8C938D]">
              {clinicName}
            </p>

          </div>


          <FiChevronDown
            className={`text-[#45524A] transition ${
              open
                ? "rotate-180"
                : ""
            }`}
          />

        </button>


        {/* ======================================================
            DROPDOWN
        ====================================================== */}

        {open && (
          <div className="absolute right-0 top-16 z-50 w-64 rounded-2xl border border-[#E6E1D8] bg-white py-2 shadow-lg">

            <div className="border-b border-[#E6E1D8] px-4 py-3">

              <p className="font-semibold text-[#45524A]">
                {userName}
              </p>

              <p className="mt-0.5 text-xs text-[#8C938D]">
                {clinicName}
              </p>

              <p className="mt-1 truncate text-sm text-[#8C938D]">
                {user?.email ||
                  "User"}
              </p>

            </div>


            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
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