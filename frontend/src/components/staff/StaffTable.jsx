import StaffRow from "./StaffRow";

function StaffTable({
  staff,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">

      <div className="overflow-x-auto">

        <table className="min-w-237.5 w-full">

          <thead className="bg-[#F7F3E9]/70">

            <tr className="border-b border-[#E6E1D8]">

              <th className="p-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                Staff Member
              </th>

              <th className="p-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                Designation
              </th>

              <th className="p-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                Phone
              </th>

              <th className="p-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                Salary
              </th>

              <th className="p-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                Hire Date
              </th>

              <th className="p-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                Status
              </th>

              <th className="p-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                Actions
              </th>

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
                  className="p-12 text-center"
                >

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3EB] text-[#315D4B]">
                    —
                  </div>

                  <p className="mt-3 font-semibold text-[#173B32]">
                    No staff members found
                  </p>

                  <p className="mt-1 text-sm text-[#7A857D]">
                    Add a staff member to get started.
                  </p>

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