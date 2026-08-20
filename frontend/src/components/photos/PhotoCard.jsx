import React from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const PhotoCard = ({
  photo,
  onDelete,
  onEdit,
}) => {
  if (!photo) {
    return null;
  }

  const photoType =
    photo.photo_type?.toLowerCase();

  const isBefore =
    photoType === "before";

  // ---------------------------------------------------------
  // BUILD IMAGE URL
  // ---------------------------------------------------------

  const getImageUrl = () => {
    if (!photo.image_url) {
      return null;
    }

    // If backend already returned a complete URL
    if (
      photo.image_url.startsWith("http://") ||
      photo.image_url.startsWith("https://")
    ) {
      return photo.image_url;
    }

    // If backend returned something like:
    // /uploads/treatment_photos/abc.jpg
    if (photo.image_url.startsWith("/")) {
      return `${API_BASE_URL}${photo.image_url}`;
    }

    // If backend returned:
    // uploads/treatment_photos/abc.jpg
    return `${API_BASE_URL}/${photo.image_url}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-square bg-gray-100">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              photo.caption ||
              `${photo.photo_type} treatment photo`
            }
            className="h-full w-full object-cover"
            onError={(event) => {
              console.error(
                "Failed to load treatment photo:",
                imageUrl
              );

              event.currentTarget.style.display =
                "none";

              const errorElement =
                event.currentTarget.parentElement.querySelector(
                  ".photo-error"
                );

              if (errorElement) {
                errorElement.classList.remove(
                  "hidden"
                );
              }
            }}
          />
        ) : null}

        {/* =====================================================
            IMAGE ERROR / MISSING IMAGE
        ===================================================== */}

        <div
          className={`photo-error ${
            imageUrl ? "hidden" : ""
          } absolute inset-0 flex flex-col items-center justify-center p-6 text-center`}
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-2xl">
            📷
          </div>

          <p className="text-sm font-semibold text-gray-700">
            Image not available
          </p>

          <p className="mt-1 break-all text-xs text-gray-500">
            {photo.image_url || "No image URL returned"}
          </p>
        </div>

        {/* =====================================================
            PHOTO TYPE BADGE
        ===================================================== */}

        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              isBefore
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {photo.photo_type}
          </span>
        </div>

      </div>

      {/* =====================================================
          PHOTO DETAILS
      ===================================================== */}

      <div className="p-4">

        {photo.caption && (
          <p className="mb-3 text-sm text-gray-700">
            {photo.caption}
          </p>
        )}

        <div className="flex items-center justify-between">

          <span className="text-xs text-gray-400">
            Photo #{photo.id}
          </span>

          <div className="flex gap-2">

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(photo)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(photo)}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default PhotoCard;