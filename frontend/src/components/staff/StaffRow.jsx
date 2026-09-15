import StaffStatusBadge from "./StaffStatusBadge";

function StaffRow({
  staff,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b border-[#EEEAE2] last:border-b-0 hover:bg-[#F7F3E9]/40 transition">

      {/* Staff Number + Employee */}
      <td className="p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173B32] text-sm font-bold text-[#F7F3E9]">
            {staff.display_number}
          </div>

          <div>
            <p className="font-semibold text-[#173B32]">
              {staff.name}
            </p>

            <p className="text-sm text-[#6F7972]">
              {staff.email}
            </p>

            <p className="mt-0.5 text-xs text-[#9A9388]">
              Staff #{staff.display_number}
            </p>

            <p className="text-xs text-[#B09A6A]">
              {staff.employee_code}
            </p>
          </div>

        </div>

      </td>

      {/* Designation */}
      <td className="p-4 text-sm text-[#45524A]">
        {staff.designation}
      </td>

      {/* Phone */}
      <td className="p-4 text-sm text-[#45524A]">
        {staff.phone}
      </td>

      {/* Salary */}
      <td className="p-4 text-sm text-[#45524A]">
        {staff.salary
          ? `Rs. ${staff.salary}`
          : "—"}
      </td>

      {/* Hire Date */}
      <td className="p-4 text-sm text-[#45524A]">
        {staff.hire_date}
      </td>

      {/* Status */}
      <td className="p-4">
        <StaffStatusBadge
          isActive={staff.is_active}
        />
      </td>

      {/* Actions */}
      <td className="p-4">

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => onEdit(staff)}
            className="
              rounded-lg
              bg-[#EEF4EC]
              px-3
              py-2
              text-sm
              font-medium
              text-[#5E7F62]
              transition
              hover:bg-[#DDEAD9]
            "
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(staff)}
            className="
              rounded-lg
              bg-red-50
              px-3
              py-2
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-100
            "
          >
            Delete
          </button>

        </div>

      </td>

    </tr>
  );
}

export default StaffRow;