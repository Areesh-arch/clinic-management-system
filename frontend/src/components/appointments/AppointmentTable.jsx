import AppointmentRow from "./AppointmentRow";
import { appointments } from "../../utils/appointmentData";

function AppointmentTable({
  search,
  doctor,
  status,
  date,
}) {

  const filteredAppointments = appointments.filter((appointment) => {

    const matchesSearch =
      appointment.patient.toLowerCase().includes(search.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(search.toLowerCase()) ||
      appointment.treatment.toLowerCase().includes(search.toLowerCase());

    const matchesDoctor =
      doctor === "All" || appointment.doctor === doctor;

    const matchesStatus =
      status === "All" || appointment.status === status;

    const matchesDate =
      date === "All" || appointment.date === date;

    return (
      matchesSearch &&
      matchesDoctor &&
      matchesStatus &&
      matchesDate
    );

  });

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

            {filteredAppointments.length > 0 ? (

              filteredAppointments.map((appointment) => (

                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                />

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-slate-500"
                >
                  No appointments found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AppointmentTable;