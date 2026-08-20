import React, {
  useEffect,
  useState,
} from "react";

const PhotoUpload = ({
  onAddPhoto,
  photoType = "before",
  title = "Add Treatment Photo",
  loading = false,
}) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");

  // =====================================================
  // CREATE IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(image);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  // =====================================================
  // SELECT IMAGE
  // =====================================================

  const handleImageChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // ---------------------------------------------------
    // Validate image type
    // ---------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert(
        "Only JPG, PNG, and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    // ---------------------------------------------------
    // Validate image size
    // ---------------------------------------------------

    const maxSize =
      10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert(
        "Image size must not exceed 10 MB."
      );

      event.target.value = "";
      return;
    }

    setImage(selectedFile);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    // Make sure parent callback exists
    if (typeof onAddPhoto !== "function") {
      console.error(
        "PhotoUpload: onAddPhoto callback is missing."
      );

      alert(
        "Photo upload is not connected yet."
      );

      return;
    }

    try {
      await onAddPhoto({
        photoType,
        image,
        caption:
          caption.trim() || null,
      });

      // Reset after successful upload
      setImage(null);
      setCaption("");

      event.target.reset();
    } catch (error) {
      console.error(
        "Photo upload failed:",
        error
      );
    }
  };

  const isBefore =
    photoType === "before";

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-2xl
        border
        border-[#DDE5DF]
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex items-center gap-4">
        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            font-bold
            text-2xl
            ${
              isBefore
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }
          `}
        >
          {isBefore ? "B" : "A"}
        </div>

        <div>
          <h3
            className="
              text-2xl
              font-bold
              text-[#1E2D45]
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              text-base
              text-[#60738F]
            "
          >
            {isBefore
              ? "Upload before treatment photo"
              : "Upload after treatment photo"}
          </p>
        </div>
      </div>

      {/* =================================================
          PHOTO TYPE
      ================================================= */}

      <div className="mb-5">
        <label
          className="
            mb-2
            block
            text-base
            font-medium
            text-[#1E2D45]
          "
        >
          Photo Type
        </label>

        <div
          className={`
            rounded-xl
            border
            px-4
            py-4
            text-base
            font-medium
            ${
              isBefore
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-green-200 bg-green-50 text-green-700"
            }
          `}
        >
          {isBefore
            ? "Before Treatment"
            : "After Treatment"}
        </div>
      </div>

      {/* =================================================
          IMAGE FILE
      ================================================= */}

      <div className="mb-5">
        <label
          className="
            mb-2
            block
            text-base
            font-medium
            text-[#1E2D45]
          "
        >
          Treatment Photo
        </label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="
            w-full
            cursor-pointer
            rounded-xl
            border
            border-[#DDE5DF]
            bg-white
            px-4
            py-3
            text-base
            text-[#1E2D45]
          "
        />

        <p
          className="
            mt-2
            text-sm
            text-[#60738F]
          "
        >
          JPG, PNG or WEBP · Maximum 10 MB
        </p>
      </div>

      {/* =================================================
          PREVIEW
      ================================================= */}

      {previewUrl && (
        <div
          className="
            mb-5
            overflow-hidden
            rounded-xl
            border
            border-[#DDE5DF]
            bg-[#F8FAF7]
          "
        >
          <img
            src={previewUrl}
            alt={`${photoType} treatment preview`}
            className="
              max-h-80
              w-full
              object-contain
            "
          />
        </div>
      )}

      {/* =================================================
          CAPTION
      ================================================= */}

      <div className="mb-5">
        <label
          className="
            mb-2
            block
            text-base
            font-medium
            text-[#1E2D45]
          "
        >
          Caption
        </label>

        <textarea
          value={caption}
          onChange={(event) =>
            setCaption(event.target.value)
          }
          placeholder="Add a note about this photo..."
          rows={4}
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-[#DDE5DF]
            px-4
            py-3
            text-base
            text-[#1E2D45]
            outline-none
            transition
            focus:border-[#5F7A63]
            focus:ring-4
            focus:ring-[#EAF2E7]
          "
        />
      </div>

      {/* =================================================
          UPLOAD BUTTON
      ================================================= */}

      <button
        type="submit"
        disabled={loading || !image}
        className={`
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          px-5
          py-3
          text-base
          font-semibold
          text-white
          transition
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${
            isBefore
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }
        `}
      >
        {loading
          ? "Uploading..."
          : "↑ Upload Photo"}
      </button>
    </form>
  );
};

export default PhotoUpload;