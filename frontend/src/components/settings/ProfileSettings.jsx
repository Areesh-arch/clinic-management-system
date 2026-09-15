import { useEffect, useRef, useState } from "react";

import {
  FiCamera,
  FiCheckCircle,
  FiLoader,
  FiUpload,
  FiUser,
} from "react-icons/fi";

import { uploadProfileImage } from "../../services/settingsService";

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
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [imageVersion, setImageVersion] = useState(Date.now());


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
  // FIELD CHANGE
  // ============================================================

  const handleChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  // ============================================================
  // UPLOAD USER PROFILE IMAGE
  // ============================================================

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadMessage("");
    setUploadError("");
    setImageError(false);


    // ----------------------------------------------------------
    // FILE TYPE
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // FILE SIZE
    // ----------------------------------------------------------

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(
        "Image size must be 10 MB or less."
      );

      event.target.value = "";
      return;
    }


    try {
      setUploading(true);

      const result = await uploadProfileImage(file);

      console.log(
        "Profile image upload response:",
        result
      );

      const imageUrl =
        result?.profile_image_url;

      if (!imageUrl) {
        throw new Error(
          "Image uploaded, but no image URL was returned."
        );
      }

      const newVersion = Date.now();

      setImageError(false);
      setImageVersion(newVersion);

      setProfile((previous) => ({
        ...previous,
        profileImageUrl: imageUrl,
      }));

      // Notify Navbar that the user's profile image changed.
      window.dispatchEvent(
        new CustomEvent(
          "dermacare-profile-image-changed",
          {
            detail: {
              profile_image_url: imageUrl,
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
  // IMAGE
  // ============================================================

  const profileImage = getProfileImageUrl(
    profile?.profileImageUrl,
    imageVersion
  );

  const userName =
    profile?.administrator ||
    "User";

  const initials = getInitials(userName);


  // ============================================================
  // UI
  // ============================================================

  return (
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

          <div className="relative shrink-0">

            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#A58B52] bg-[#173B32] text-2xl font-semibold text-[#F7F3E9]">

              {profileImage && !imageError ? (
                <img
                  key={profileImage}
                  src={profileImage}
                  alt={`${userName} profile`}
                  className="h-full w-full object-cover"
                  onError={() => {
                    console.error(
                      "Profile image failed to load:",
                      profileImage
                    );

                    setImageError(true);
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}

            </div>


            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
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


          <div className="min-w-0 flex-1">

            <h3 className="text-base font-semibold text-[#23483a]">
              Profile Picture
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#7c837b]">
              Upload a professional picture for your profile.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#173B32] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#23483a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiUpload size={16} />

                {uploading
                  ? "Uploading..."
                  : "Upload Picture"}
              </button>

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
          onChange={handleProfileImageChange}
          className="hidden"
        />


        {uploadMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#c7d8c9] bg-[#edf5ed] px-4 py-3 text-sm text-[#23483a]">

            <FiCheckCircle />

            <span>{uploadMessage}</span>

          </div>
        )}


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
            value={profile?.administrator || ""}
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
            value={profile?.email || ""}
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
  );
}