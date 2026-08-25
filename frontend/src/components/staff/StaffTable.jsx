import StaffRow from "./StaffRow";

function StaffTable({ staff, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-[#F8F6F2]">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Designation</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Salary</th>
              <th className="p-4 text-left">Hire Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.length > 0 ? (
              staff.map((member) => (
                <StaffRow
                  key={member.id}
                  staff={member}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-8 text-center text-gray-500"
                >
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default StaffTable;