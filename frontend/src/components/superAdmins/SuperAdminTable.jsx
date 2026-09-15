import {
  FiEdit2,
  FiTrash2,
  FiUser,
} from "react-icons/fi";


function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SA"
  );
}


function getProfileImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `http://127.0.0.1:8000${imageUrl}`;
  }

  return `http://127.0.0.1:8000/${imageUrl}`;
}


function SuperAdminTable({
  admins = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-[#E6E1D8] bg-[#FCFBF8] p-8 text-center shadow-sm">
        <p className="text-sm text-[#66736B]">
          Loading Super Admins...
        </p>
      </div>
    );
  }


  return (
    <div className="overflow-hidden rounded-3xl border border-[#E6E1D8] bg-[#FCFBF8] shadow-sm">

      <div className="border-b border-[#E6E1D8] px-6 py-5">

        <div>
          <h2 className="text-lg font-bold text-[#173B32]">
            Platform Administrators
          </h2>

          <p className="mt-1 text-sm text-[#7A857D]">
            Users with full platform administration access.
          </p>
        </div>

      </div>


      {admins.length === 0 ? (
        <div className="px-6 py-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF3EB] text-2xl text-[#315D4B]">
            <FiUser />
          </div>

          <h3 className="mt-4 text-base font-semibold text-[#173B32]">
            No Super Admins found
          </h3>

          <p className="mt-1 text-sm text-[#7A857D]">
            Add a Super Admin to manage the platform.
          </p>

        </div>
      ) : (

        <div className="overflow-x-auto">

          <table className="min-w-212.5 w-full">

            <thead>
              <tr className="border-b border-[#E6E1D8] bg-[#F7F3E9]/70">

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                  Administrator
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.12em] text-[#7A857D]">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody>
            {admins.map((admin, index) => {

                const imageUrl =
                  getProfileImageUrl(
                    admin.profile_image_url
                  );

                return (
                  <tr
                    key={admin.id}
                    className="border-b border-[#EEEAE2] last:border-b-0 hover:bg-[#F7F3E9]/40"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={admin.full_name}
                            className="h-11 w-11 rounded-full border-2 border-[#A58B52] object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#A58B52] bg-[#173B32] text-sm font-bold text-[#F7F3E9]">
                            {getInitials(
                              admin.full_name
                            )}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#173B32]">
                            {admin.full_name}
                          </p>

                          <p className="mt-0.5 text-xs text-[#8A948D]">
                            Super Admin #{index + 1}
                          </p>
                        </div>

                      </div>

                    </td>


                    <td className="px-6 py-4">

                      <span className="text-sm text-[#45524A]">
                        {admin.email}
                      </span>

                    </td>


                    <td className="px-6 py-4">

                      <span className="inline-flex rounded-full border border-[#D8C99B] bg-[#F5F1E7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8B733C]">
                        Super Admin
                      </span>

                    </td>


                    <td className="px-6 py-4">

                      {admin.is_active ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F1E8] px-3 py-1.5 text-xs font-semibold text-[#315D4B]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#315D4B]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#F1ECE7] px-3 py-1.5 text-xs font-semibold text-[#88786B]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#88786B]" />
                          Inactive
                        </span>
                      )}

                    </td>


                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(admin)
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8CDB5] bg-[#FFFDF7] text-[#315D4B] transition hover:border-[#A58B52] hover:bg-[#F5F1E7]"
                          title="Edit Super Admin"
                        >
                          <FiEdit2 />
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            onDelete(admin)
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50"
                          title="Delete Super Admin"
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}


export default SuperAdminTable;