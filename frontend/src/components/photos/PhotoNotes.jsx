import React from "react";

const PhotoNotes = ({
  notes,
  onChange,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        Treatment Photo Notes
      </label>

      <textarea
        value={notes || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={4}
        placeholder="Add notes about the treatment photos..."
        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default PhotoNotes;