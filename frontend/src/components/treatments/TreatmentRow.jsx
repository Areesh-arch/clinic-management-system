import { FiEdit2, FiTrash2 } from "react-icons/fi";
import TreatmentStatusBadge from "./TreatmentStatusBadge";

function TreatmentRow({ treatment }) {
  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="p-4">{treatment.patient}</td>

      <td className="p-4">{treatment.doctor}</td>

      <td className="p-4">{treatment.treatment}</td>

      <td className="p-4">{treatment.date}</td>

      <td className="p-4">{treatment.cost}</td>

      <td className="p-4">
        <TreatmentStatusBadge status={treatment.status} />
      </td>

      <td className="p-4">
        <div className="flex gap-3">

          <button className="text-blue-600 hover:text-blue-800">
            <FiEdit2 />
          </button>

          <button className="text-red-600 hover:text-red-800">
            <FiTrash2 />
          </button>

        </div>
      </td>

    </tr>
  );
}

export default TreatmentRow;