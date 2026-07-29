import AppointmentRow from "./AppointmentRow";
import { appointments } from "../../utils/appointmentData";

function AppointmentTable() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

      <div className="p-6 border-b border-slate-200">

        <h2 className="text-2xl font-bold text-[#556B55]">
          Appointment Schedule
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-[#F8FAF7]">

            <tr className="text-left text-slate-600">

              <th className="p-4">Time</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Treatment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {appointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
              />
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AppointmentTable;