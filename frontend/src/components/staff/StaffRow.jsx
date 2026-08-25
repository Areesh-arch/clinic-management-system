import StaffStatusBadge from "./StaffStatusBadge";

function StaffRow({ staff, onEdit, onDelete }) {
  return (
    <tr className="border-b hover:bg-[#F9F9F9]">

      {/* Employee */}
      <td className="p-4">
        <div>
          <p className="font-semibold text-[#45524A]">
            {staff.name}
          </p>

          <p className="text-sm text-gray-500">
            {staff.email}
          </p>

          <p className="text-xs text-gray-400">
            {staff.employee_code}
          </p>
        </div>
      </td>

      {/* Designation */}
      <td className="p-4">
        {staff.designation}
      </td>

      {/* Phone */}
      <td className="p-4">
        {staff.phone}
      </td>

      {/* Salary */}
      <td className="p-4">
        {staff.salary
          ? `Rs. ${staff.salary}`
          : "—"}
      </td>

      {/* Hire Date */}
      <td className="p-4">
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
            className="px-3 py-2 rounded-lg text-sm font-medium
                       bg-[#EEF4EC] text-[#5E7F62]
                       hover:bg-[#DDEAD9] transition"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(staff)}
            className="px-3 py-2 rounded-lg text-sm font-medium
                       bg-red-50 text-red-600
                       hover:bg-red-100 transition"
          >
            Delete
          </button>

        </div>
      </td>

    </tr>
  );
}

export default StaffRow;