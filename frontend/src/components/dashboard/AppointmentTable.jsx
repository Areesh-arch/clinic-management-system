function AppointmentTable({ data = [] }) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border border-[#E6E0D4]
        shadow-sm
        hover:-translate-y-1
        hover:shadow-md
        transition-all
        duration-300
        p-8
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#3F5140]">
          Recent Patients
        </h2>

        <p className="text-sm text-[#8A9188] mt-1">
          Recently registered patients
        </p>
      </div>

      {data.length === 0 ? (
        <div
          className="
            py-12
            text-center
            rounded-2xl
            bg-[#FAF9F4]
            border border-[#EEE8DD]
          "
        >
          <p className="text-[#7A847A] font-medium">
            No recent patients found.
          </p>

          <p className="text-sm text-[#A0A69F] mt-1">
            New patients will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EAE5DB]">
                <th
                  className="
                    py-3
                    pr-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#8A9188]
                  "
                >
                  Patient
                </th>

                <th
                  className="
                    py-3
                    pr-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#8A9188]
                  "
                >
                  MRN
                </th>

                <th
                  className="
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#8A9188]
                  "
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((patient, index) => {
                const isActive =
                  patient.status === "Active";

                return (
                  <tr
                    key={
                      patient.id ||
                      patient.patient_id ||
                      index
                    }
                    className="
                      border-b
                      border-[#F1EEE7]
                      last:border-b-0
                      hover:bg-[#FAF9F4]
                      transition-colors
                    "
                  >
                    {/* Patient */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-10
                            h-10
                            shrink-0
                            rounded-full
                            bg-[#EEF4EC]
                            text-[#5E7D63]
                            flex
                            items-center
                            justify-center
                            font-semibold
                            text-sm
                          "
                        >
                          {(patient.first_name ||
                            patient.name ||
                            "P")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              font-semibold
                              text-[#3F5140]
                              truncate
                            "
                          >
                            {patient.name ||
                              patient.full_name ||
                              "Unknown Patient"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Medical Record Number */}
                    <td className="py-4 pr-4">
                      <span
                        className="
                          text-sm
                          font-medium
                          text-[#6E766F]
                        "
                      >
                        {patient.medical_record_number ||
                          "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      <span
                        className={`
                          inline-flex
                          items-center
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-semibold
                          ${
                            isActive
                              ? "bg-[#EEF4EC] text-[#5E7D63]"
                              : "bg-[#F2F0EC] text-[#8A8A82]"
                          }
                        `}
                      >
                        {patient.status ||
                          "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AppointmentTable;