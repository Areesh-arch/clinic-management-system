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

  // =====================================================
  // DATE
  // =====================================================

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


  // =====================================================
  // PATIENT NAME
  // =====================================================

  const patientName =
    treatment.patient_name ||
    treatment.patient?.name ||
    [
      treatment.patient?.first_name,
      treatment.patient?.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Unknown patient";


  // =====================================================
  // PATIENT MRN
  // =====================================================

  const patientMrn =
    treatment.medical_record_number ||
    treatment.patient_mrn ||
    treatment.patient?.medical_record_number ||
    treatment.patient?.mrn ||
    "";


  // =====================================================
  // TREATMENT NAME
  // =====================================================

  const treatmentName =
    treatment.treatment ||
    treatment.diagnosis ||
    "—";


  // =====================================================
  // COST
  // =====================================================
  // Pakistani currency uses whole PKR amounts here.
  // No .00 will be displayed.
  //
  // Example:
  // 5000.00 -> PKR 5,000
  // 4999.00 -> PKR 4,999
  // 4999.85 -> PKR 5,000
  // =====================================================

  const cost =
    Math.round(
      Number(
        treatment.cost || 0
      )
    );


  // =====================================================
  // UI
  // =====================================================

  return (

    <tr className="border-b hover:bg-gray-50">

      {/* =================================================
          PATIENT
          ================================================= */}

      <td className="p-4">

        <div className="font-medium text-gray-900">
          {patientName}
        </div>

        {patientMrn && (

          <div className="text-sm text-gray-500 mt-1">
            {patientMrn}
          </div>

        )}

      </td>


      {/* =================================================
          TREATMENT
          ================================================= */}

      <td className="p-4">

        {treatmentName}

      </td>


      {/* =================================================
          DATE
          ================================================= */}

      <td className="p-4">

        {formattedDate}

      </td>


      {/* =================================================
          COST
          ================================================= */}

      <td className="p-4 font-medium">

        PKR{" "}

        {cost.toLocaleString(
          "en-PK"
        )}

      </td>


      {/* =================================================
          STATUS
          ================================================= */}

      <td className="p-4">

        <TreatmentStatusBadge
          status={
            treatment.status
          }
        />

      </td>


      {/* =================================================
          ACTIONS
          ================================================= */}

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