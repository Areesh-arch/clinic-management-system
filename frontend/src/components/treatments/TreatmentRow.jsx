import {
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import TreatmentStatusBadge from "./TreatmentStatusBadge";


function TreatmentRow({
  treatment,
  onEdit,
  onDelete,
}) {

  const formattedDate =
    treatment.date
      ? new Date(
          treatment.date
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "—";


  return (

    <tr className="border-b hover:bg-gray-50">

      <td className="p-4">
        {treatment.patient_name ||
          "—"}
      </td>


      <td className="p-4">
        {treatment.doctor_name ||
          "—"}
      </td>


      <td className="p-4">
        {treatment.treatment ||
          "—"}
      </td>


      <td className="p-4">
        {formattedDate}
      </td>


      <td className="p-4">
        £
        {Number(
          treatment.cost || 0
        ).toFixed(2)}
      </td>


      <td className="p-4">

        <TreatmentStatusBadge
          status={
            treatment.status
          }
        />

      </td>


      <td className="p-4">

        <div className="flex gap-3">

          {/* EDIT */}

          <button
            type="button"
            onClick={() =>
              onEdit &&
              onEdit(treatment)
            }
            className="text-blue-600 hover:text-blue-800"
            title="Edit treatment"
          >

            <FiEdit2 />

          </button>


          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              onDelete &&
              onDelete(treatment)
            }
            className="text-red-600 hover:text-red-800"
            title="Delete treatment"
          >

            <FiTrash2 />

          </button>

        </div>

      </td>

    </tr>
  );
}


export default TreatmentRow;