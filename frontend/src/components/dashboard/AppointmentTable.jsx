import { recentPatients } from "../../utils/dashboardData";

function AppointmentTable() {
  return (
   <div
  className="
    bg-white
    rounded-3xl
    border border-slate-200
    shadow-sm
    hover:scale-105
    transition-all
    duration-300
    p-8
  "
>

      <h2 className="text-3xl font-bold text-[#556B55] mb-6">
        Recent Patients
      </h2>

      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="py-3">Patient</th>

            <th>Treatment</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {recentPatients.map((patient) => (

            <tr
              key={patient.name}
              className="border-b hover:bg-[#F7F4EC]"
            >

              <td className="py-4 font-medium">
                {patient.name}
              </td>

              <td>
                {patient.treatment}
              </td>

              <td>

                <span className="bg-[#D9E6D3] text-[#556B55] px-3 py-1 rounded-full text-sm">

                  {patient.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default AppointmentTable;