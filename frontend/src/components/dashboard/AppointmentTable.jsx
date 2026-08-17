function AppointmentTable({ data = [] }) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border border-slate-200
        shadow-sm
        p-8
      "
    >
      <h2 className="text-2xl font-bold text-[#556B55] mb-6">
        Recent Patients
      </h2>

      {data.length === 0 ? (
        <p className="text-slate-400">
          No recent patients found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-200">
                <th className="py-3">Patient</th>
                <th className="py-3">Treatment</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((patient, index) => (
                <tr
                  key={patient.id || patient.patient_id || index}
                  className="
                    border-b
                    
                    hover:bg-[#F7F4EC]
                  "
                >
                  <td className="py-4 font-medium">
                    {patient.name ||
                      patient.full_name ||
                      "Unknown"}
                  </td>

                  <td className="py-4">
                    {patient.treatment || "—"}
                  </td>

                  <td className="py-4">
                    <span
                      className="
                        bg-[#D9E6D3]
                        text-[#556B55]
                        px-3
                        py-1
                        rounded-full
                        text-sm
                      "
                    >
                      {patient.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AppointmentTable;