import {
  FiShield,
  FiPlus,
} from "react-icons/fi";


function SuperAdminHeader({
  onAdd,
}) {
  return (
    <div className="rounded-3xl border border-[#E6E1D8] bg-[#FCFBF8] p-6 shadow-sm sm:p-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#173B32] text-xl text-[#F7F3E9] shadow-sm">
            <FiShield />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A58B52]">
              Platform Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#173B32] sm:text-3xl">
              Super Admins
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66736B]">
              Manage the administrators who have access to
              the DermaCare platform.
            </p>
          </div>

        </div>


        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#173B32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#23483A] active:scale-[0.98]"
        >
          <FiPlus className="text-lg" />
          Add Super Admin
        </button>

      </div>

    </div>
  );
}


export default SuperAdminHeader;