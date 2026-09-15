import { useEffect, useRef, useState } from "react";

import {
  FiCamera,
  FiCheckCircle,
  FiLoader,
  FiTrash2,
  FiUpload,
  FiUser,
  FiX,
} from "react-icons/fi";

import {
  removeProfileImage,
  uploadProfileImage,
} from "../../services/settingsService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ""
);


// ============================================================
// IMAGE URL
// ============================================================

function getProfileImageUrl(imageUrl, version) {
  if (!imageUrl) {
    return null;
  }

  let finalUrl = imageUrl;

  if (
    !imageUrl.startsWith("http://") &&
    !imageUrl.startsWith("https://")
  ) {
    if (imageUrl.startsWith("/")) {
      finalUrl = `${API_ORIGIN}${imageUrl}`;
    } else {
      finalUrl = `${API_ORIGIN}/${imageUrl}`;
    }
  }

  if (version) {
    finalUrl = `${finalUrl}${
      finalUrl.includes("?") ? "&" : "?"
    }v=${version}`;
  }

  return finalUrl;
}


// ============================================================
// INITIALS
// ============================================================

function getInitials(name) {
  return (
    name
      ?.trim()
      ?.split(/\s+/)
      ?.map((word) => word[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "U"
  );
}


// ============================================================
// COMPONENT
// ============================================================

export default function ProfileSettings({
  profile,
  setProfile,
}) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [uploadError, setUploadError] =
    useState("");

  const [imageError, setImageError] =
    useState(false);

  const [imageVersion, setImageVersion] =
    useState(Date.now());

  const [showRemoveModal, setShowRemoveModal] =
    useState(false);


  // ============================================================
  // RESET IMAGE STATE
  // ============================================================

  useEffect(() => {
    setImageError(false);
    setUploadMessage("");
    setUploadError("");
    setImageVersion(Date.now());
  }, [profile?.profileImageUrl]);


  // ============================================================
  // ESCAPE KEY FOR MODAL
  // ============================================================

  useEffect(() => {
    if (!showRemoveModal) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !removing) {
        setShowRemoveModal(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [showRemoveModal, removing]);


  // ============================================================
  // FIELD CHANGE
  // ============================================================

  const handleChange = (
    field,
    value
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  // ============================================================
  // UPLOAD USER PROFILE IMAGE
  // ============================================================

  const handleProfileImageChange =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setUploadMessage("");
      setUploadError("");
      setImageError(false);


      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          "Please select a JPG, PNG, or WEBP image."
        );

        event.target.value = "";
        return;
      }


      if (
        file.size >
        10 * 1024 * 1024
      ) {
        setUploadError(
          "Image size must be 10 MB or less."
        );

        event.target.value = "";
        return;
      }


      try {
        setUploading(true);

        const result =
          await uploadProfileImage(file);

        const imageUrl =
          result?.profile_image_url;

        if (!imageUrl) {
          throw new Error(
            "Image uploaded, but no image URL was returned."
          );
        }

        const newVersion =
          Date.now();

        setImageError(false);
        setImageVersion(newVersion);

        setProfile((previous) => ({
          ...previous,
          profileImageUrl: imageUrl,
        }));

        window.dispatchEvent(
          new CustomEvent(
            "dermacare-profile-image-changed",
            {
              detail: {
                profile_image_url:
                  imageUrl,
              },
            }
          )
        );

        setUploadMessage(
          "Profile picture updated successfully."
        );

      } catch (error) {
        console.error(
          "Profile image upload failed:",
          error
        );

        setUploadError(
          error?.message ||
            "Failed to upload profile picture."
        );

      } finally {
        setUploading(false);
        event.target.value = "";
      }
    };


  // ============================================================
  // OPEN REMOVE MODAL
  // ============================================================

  const handleRemoveClick = () => {
    if (!profile?.profileImageUrl) {
      return;
    }

    setUploadMessage("");
    setUploadError("");
    setShowRemoveModal(true);
  };


  // ============================================================
  // REMOVE PROFILE IMAGE
  // ============================================================

  const handleRemoveProfileImage =
    async () => {
      try {
        setRemoving(true);
        setUploadMessage("");
        setUploadError("");

        const result =
          await removeProfileImage();

        setProfile((previous) => ({
          ...previous,
          profileImageUrl: null,
        }));

        setImageVersion(Date.now());
        setImageError(false);

        window.dispatchEvent(
          new CustomEvent(
            "dermacare-profile-image-changed",
            {
              detail: {
                profile_image_url: null,
              },
            }
          )
        );

        setShowRemoveModal(false);

        setUploadMessage(
          result?.message ||
            "Profile picture removed successfully."
        );

      } catch (error) {
        console.error(
          "Profile image removal failed:",
          error
        );

        setUploadError(
          error?.message ||
            "Failed to remove profile picture."
        );

      } finally {
        setRemoving(false);
      }
    };


  // ============================================================
  // IMAGE
  // ============================================================

  const profileImage =
    getProfileImageUrl(
      profile?.profileImageUrl,
      imageVersion
    );

  const userName =
    profile?.administrator ||
    "User";

  const initials =
    getInitials(userName);


  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <div className="rounded-2xl border border-[#ded5c3] bg-[#fffdf7] p-6 shadow-sm">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dfeadd] text-[#23483a]">
              <FiUser size={19} />
            </div>

            <div>

              <h2 className="text-xl font-semibold text-[#23483a]">
                Profile Information
              </h2>

              <p className="mt-1 text-sm text-[#7c837b]">
                Manage your personal profile information and picture.
              </p>

            </div>

          </div>

        </div>


        {/* ======================================================
            PROFILE PICTURE
        ====================================================== */}

        <div className="mb-8 rounded-2xl border border-[#e5dccb] bg-[#faf7ef] p-5">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* AVATAR */}

            <div className="relative shrink-0">

              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#A58B52] bg-[#173B32] text-2xl font-semibold text-[#F7F3E9]">

                {profileImage &&
                !imageError ? (
                  <img
                    key={profileImage}
                    src={profileImage}
                    alt={`${userName} profile`}
                    className="h-full w-full object-cover"
                    onError={() => {
                      setImageError(true);
                    }}
                  />
                ) : (
                  <span>
                    {initials}
                  </span>
                )}

              </div>


              {/* CAMERA BUTTON */}

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={
                  uploading ||
                  removing
                }
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#fffdf7] bg-[#173B32] text-white shadow-md transition hover:bg-[#23483a] disabled:cursor-not-allowed disabled:opacity-60"
                title="Change profile picture"
              >

                {uploading ? (
                  <FiLoader
                    className="animate-spin"
                    size={16}
                  />
                ) : (
                  <FiCamera size={16} />
                )}

              </button>

            </div>


            {/* CONTROLS */}

            <div className="min-w-0 flex-1">

              <h3 className="text-base font-semibold text-[#23483a]">
                Profile Picture
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#7c837b]">
                Upload a professional picture for your profile.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">

                {/* UPLOAD */}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploading ||
                    removing
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#173B32] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#23483a] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {uploading ? (
                    <FiLoader
                      className="animate-spin"
                      size={16}
                    />
                  ) : (
                    <FiUpload size={16} />
                  )}

                  {uploading
                    ? "Uploading..."
                    : "Upload Picture"}

                </button>


                {/* REMOVE */}

                {profile?.profileImageUrl && (
                  <button
                    type="button"
                    onClick={
                      handleRemoveClick
                    }
                    disabled={
                      uploading ||
                      removing
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <FiTrash2 size={16} />

                    Remove Picture

                  </button>
                )}


                <span className="text-xs text-[#8C938D]">
                  JPG, PNG or WEBP · Max 10 MB
                </span>

              </div>

            </div>

          </div>


          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              handleProfileImageChange
            }
            className="hidden"
          />


          {/* SUCCESS */}

          {uploadMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#c7d8c9] bg-[#edf5ed] px-4 py-3 text-sm text-[#23483a]">

              <FiCheckCircle />

              <span>
                {uploadMessage}
              </span>

            </div>
          )}


          {/* ERROR */}

          {uploadError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {uploadError}
            </div>
          )}

        </div>


        {/* ======================================================
            USER INFORMATION
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-[#385448]">
              Full Name
            </label>

            <input
              type="text"
              value={
                profile?.administrator || ""
              }
              onChange={(e) =>
                handleChange(
                  "administrator",
                  e.target.value
                )
              }
              placeholder="Your full name"
              className="w-full rounded-xl border border-[#d8cdb5] bg-[#fffefb] px-4 py-3 text-[#23483a] outline-none transition placeholder:text-[#a29c8f] focus:border-[#78977d] focus:ring-2 focus:ring-[#dfeadd]"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-medium text-[#385448]">
              Email Address
            </label>

            <input
              type="email"
              value={
                profile?.email || ""
              }
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target.value
                )
              }
              placeholder="admin@clinic.com"
              className="w-full rounded-xl border border-[#d8cdb5] bg-[#fffefb] px-4 py-3 text-[#23483a] outline-none transition placeholder:text-[#a29c8f] focus:border-[#78977d] focus:ring-2 focus:ring-[#dfeadd]"
            />

          </div>

        </div>

      </div>


      {/* ========================================================
          REMOVE PROFILE PICTURE MODAL
      ======================================================== */}

      {showRemoveModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#173B32]/45 px-4 py-6 backdrop-blur-[3px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !removing
            ) {
              setShowRemoveModal(false);
            }
          }}
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#ded5c3] bg-[#fffdf7] shadow-[0_24px_70px_rgba(23,59,50,0.20)]"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-[#e8dfcf] px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <FiTrash2 size={19} />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-[#23483a]">
                    Remove Profile Picture
                  </h3>

                  <p className="mt-1 text-xs text-[#8C938D]">
                    Profile settings
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  !removing &&
                  setShowRemoveModal(false)
                }
                disabled={removing}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7c837b] transition hover:bg-[#f1eee7] hover:text-[#23483a] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="px-6 py-6">

              <p className="text-sm leading-6 text-[#5f6861]">
                Are you sure you want to remove your
                profile picture? Your account will continue
                to use your initials as the profile avatar.
              </p>

            </div>


            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#e8dfcf] bg-[#faf7ef] px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowRemoveModal(false)
                }
                disabled={removing}
                className="rounded-xl border border-[#d8cdb5] bg-white px-5 py-2.5 text-sm font-medium text-[#385448] transition hover:bg-[#f4f1e9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleRemoveProfileImage
                }
                disabled={removing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {removing ? (
                  <>
                    <FiLoader
                      className="animate-spin"
                      size={16}
                    />

                    Removing...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />

                    Remove Picture
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}