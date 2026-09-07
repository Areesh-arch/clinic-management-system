import {
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

function PatientRow({
  patient,
  onView,
  onEdit,
  onDelete,
}) {
  const statusStyles = {
    Active:
      "bg-[#EAF7EE] text-[#168447] border border-[#C9EBD5]",

    "Follow-up":
      "bg-[#FFF7E6] text-[#B87916] border border-[#F3DEB1]",

    Inactive:
      "bg-[#FDECEC] text-[#C94A4A] border border-[#F3CACA]",
  };

  const patientName =
    patient?.name ||
    `${patient?.first_name || ""} ${
      patient?.last_name || ""
    }`.trim() ||
    "Unnamed Patient";

  return (
    <tr
      className="
        border-b
        border-[#E8EDE7]
        last:border-b-0
        hover:bg-[#F8FAF7]
        transition-colors
        duration-200
      "
    >
      {/* NAME */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-[#EAF2E7]
              text-[#5F7A63]
              flex
              items-center
              justify-center
              font-semibold
              text-sm
              shrink-0
            "
          >
            {patientName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-[#1E2D45] truncate">
              {patientName}
            </p>

            {patient?.medical_record_number && (
              <p className="text-xs text-[#60738F] mt-0.5">
                {patient.medical_record_number}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* AGE */}
      <td className="px-6 py-5">
        <span className="text-[#334B68] font-medium">
          {patient?.age ?? "-"}
        </span>
      </td>

      {/* GENDER */}
      <td className="px-6 py-5">
        <span
          className="
            inline-flex
            items-center
            px-3
            py-1
            rounded-full
            bg-[#F3F6F2]
            text-[#526A58]
            text-sm
            font-medium
            capitalize
          "
        >
          {patient?.gender || "-"}
        </span>
      </td>

      {/* PHONE */}
      <td className="px-6 py-5">
        <span className="text-[#334B68]">
          {patient?.phone || "-"}
        </span>
      </td>

      {/* STATUS */}
      <td className="px-6 py-5">
        <span
          className={`
            inline-flex
            items-center
            px-3
            py-1.5
            rounded-full
            text-sm
            font-semibold
            ${
              statusStyles[patient?.status] ||
              "bg-[#F3F5F4] text-[#60738F] border border-[#DDE5DF]"
            }
          `}
        >
          <span
            className="
              w-1.5
              h-1.5
              rounded-full
              bg-current
              mr-2
            "
          />

          {patient?.status || "Unknown"}
        </span>
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">

          {/* VIEW PROFILE */}
          <button
            type="button"
            onClick={() => {
              if (typeof onView === "function") {
                onView(patient);
              }
            }}
            title="View patient profile"
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              text-[#5F7A63]
              bg-[#EAF2E7]
              hover:bg-[#DCE9D9]
              transition-all
              duration-200
              cursor-pointer
              font-medium
              text-sm
            "
          >
            <FiEye
              size={17}
              strokeWidth={2}
            />

            <span>
              View Profile
            </span>
          </button>

          {/* EDIT */}
          <button
            type="button"
            onClick={() => {
              if (typeof onEdit === "function") {
                onEdit(patient);
              }
            }}
            title="Edit patient"
            className="
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-[#60738F]
              bg-transparent
              hover:bg-[#FFF7E6]
              hover:text-[#C28A20]
              transition-all
              duration-200
              cursor-pointer
            "
          >
            <FiEdit2
              size={19}
              strokeWidth={2}
            />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => {
              if (typeof onDelete === "function") {
                onDelete(patient);
              }
            }}
            title="Delete patient"
            className="
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-[#60738F]
              bg-transparent
              hover:bg-[#FDECEC]
              hover:text-[#C94A4A]
              transition-all
              duration-200
              cursor-pointer
            "
          >
            <FiTrash2
              size={19}
              strokeWidth={2}
            />
          </button>

        </div>
      </td>
    </tr>
  );
}

export default PatientRow;