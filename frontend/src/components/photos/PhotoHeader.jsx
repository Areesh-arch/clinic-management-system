import React from "react";

const PhotoHeader = ({
  patientName = "Patient",
  visitId,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Treatment Photos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {patientName}
          {visitId
            ? ` • Visit #${visitId}`
            : ""}
        </p>
      </div>
    </div>
  );
};

export default PhotoHeader;