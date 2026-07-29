import {
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

function AppointmentRow({ appointment }) {
  return (
    <tr className="border-b hover:bg-[#FAFBF8] transition">

      <td className="p-4">{appointment.time}</td>

      <td className="p-4 font-medium">
        {appointment.patient}
      </td>

      <td className="p-4">
        {appointment.doctor}
      </td>

      <td className="p-4">
        {appointment.treatment}
      </td>

      <td className="p-4">
        <AppointmentStatusBadge
          status={appointment.status}
        />
      </td>

      <td className="p-4">

        <div className="flex gap-4 text-slate-500">

          <FiEye
            className="cursor-pointer hover:text-[#556B55]"
          />

          <FiEdit
            className="cursor-pointer hover:text-blue-600"
          />

          <FiTrash2
            className="cursor-pointer hover:text-red-600"
          />

        </div>

      </td>

    </tr>
  );
}

export default AppointmentRow;