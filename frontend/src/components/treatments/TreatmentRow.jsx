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
    treatment?.date
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
    treatment?.patient_name ||
    treatment?.patient?.name ||
    [
      treatment?.patient?.first_name,
      treatment?.patient?.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Unknown patient";


  // =====================================================
  // PATIENT MRN
  // =====================================================

  const patientMrn =
    treatment?.medical_record_number ||
    treatment?.patient_mrn ||
    treatment?.patient?.medical_record_number ||
    treatment?.patient?.mrn ||
    "";


  // =====================================================
  // TREATMENT NAME
  // =====================================================

  const treatmentName =
    treatment?.treatment ||
    treatment?.diagnosis ||
    "—";


  // =====================================================
  // COST
  // =====================================================

  const rawCost =
    treatment?.cost ??
    treatment?.charge ??
    0;

  const numericCost =
    Number(rawCost);

  const cost =
    Number.isFinite(
      numericCost
    )
      ? Math.round(numericCost)
      : 0;


  // =====================================================
  // STATUS
  // =====================================================

  const normalizedStatus =
    String(
      treatment?.status ||
      "IN_PROGRESS"
    )
      .trim()
      .toUpperCase()
      .replace(/-/g, "_");


  // =====================================================
  // UI
  // =====================================================

  return (
    <tr
      className="
        border-b
        border-[#E7E2D8]
        last:border-b-0
        odd:bg-[#F7F8F5]
        even:bg-[#FFFDF8]
        transition-colors
        duration-200
        hover:bg-[#EDF3EF]
      "
    >

      {/* =================================================
          PATIENT
          ================================================= */}

      <td
        className="
          px-6
          py-4
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#E7EFEA]
              text-sm
              font-bold
              text-[#365C4F]
            "
          >
            {patientName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-bold
                text-[#173B32]
              "
            >
              {patientName}
            </p>

            {patientMrn ? (
              <p
                className="
                  mt-1
                  text-[11px]
                  font-medium
                  text-[#7D8983]
                "
              >
                {patientMrn}
              </p>
            ) : (
              <p
                className="
                  mt-1
                  text-[11px]
                  text-[#A0AAA5]
                "
              >
                No MRN
              </p>
            )}
          </div>
        </div>
      </td>


      {/* =================================================
          TREATMENT
          ================================================= */}

      <td
        className="
          max-w-65
          px-5
          py-4
        "
      >
        <div>
          <p
            className="
              truncate
              text-sm
              font-semibold
              text-[#334940]
            "
            title={treatmentName}
          >
            {treatmentName}
          </p>

          {treatment?.chief_complaint && (
            <p
              className="
                mt-1
                max-w-60
                truncate
                text-[11px]
                text-[#8A948F]
              "
              title={
                treatment.chief_complaint
              }
            >
              {treatment.chief_complaint}
            </p>
          )}
        </div>
      </td>


      {/* =================================================
          DATE
          ================================================= */}

      <td
        className="
          whitespace-nowrap
          px-5
          py-4
        "
      >
        <span
          className="
            text-sm
            font-medium
            text-[#596861]
          "
        >
          {formattedDate}
        </span>
      </td>


      {/* =================================================
          COST
          ================================================= */}

      <td
        className="
          whitespace-nowrap
          px-5
          py-4
        "
      >
        <div className="flex flex-col">
          <span
            className="
              text-sm
              font-bold
              text-[#173B32]
            "
          >
            PKR{" "}
            {cost.toLocaleString(
              "en-PK"
            )}
          </span>

          <span
            className="
              mt-0.5
              text-[10px]
              font-medium
              uppercase
              tracking-wide
              text-[#9A9588]
            "
          >
            Treatment charge
          </span>
        </div>
      </td>


      {/* =================================================
          STATUS
          ================================================= */}

      <td
        className="
          px-5
          py-4
        "
      >
        <TreatmentStatusBadge
          status={
            normalizedStatus
          }
        />
      </td>


      {/* =================================================
          ACTIONS
          ================================================= */}

      <td
        className="
          px-5
          py-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* EDIT */}

          <button
            type="button"
            onClick={() =>
              onEdit &&
              onEdit(treatment)
            }
            title="Edit treatment"
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#D1DDD6]
              bg-[#F7FAF8]
              text-[#527565]
              transition-all
              duration-200
              hover:border-[#6F8F7D]
              hover:bg-[#E5EEE8]
              hover:text-[#173B32]
            "
          >
            <FiEdit2
              size={15}
            />
          </button>


          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              onDelete &&
              onDelete(treatment)
            }
            title="Delete treatment"
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#E6D0CA]
              bg-[#FCF7F5]
              text-[#A15D50]
              transition-all
              duration-200
              hover:border-[#C98A7D]
              hover:bg-[#F7EAE6]
              hover:text-[#8D4337]
            "
          >
            <FiTrash2
              size={15}
            />
          </button>

        </div>
      </td>
    </tr>
  );
}


export default TreatmentRow;