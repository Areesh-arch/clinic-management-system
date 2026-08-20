import React from "react";

const SavePhotosButton = ({
  onSave,
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={disabled || loading}
      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save Photos"}
    </button>
  );
};

export default SavePhotosButton;