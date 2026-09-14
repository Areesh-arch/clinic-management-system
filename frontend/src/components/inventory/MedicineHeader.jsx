export default function MedicineHeader({ onAddMedicine }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-1 rounded-full bg-[#B4935A]" />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#173C32] sm:text-3xl">
              Inventory
            </h1>

            <p className="mt-1 text-sm text-[#718078]">
              Manage clinic medicines, stock and medicine history.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddMedicine}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C32] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(23,60,50,0.14)] transition-all hover:bg-[#245346] hover:shadow-[0_7px_20px_rgba(23,60,50,0.18)] sm:w-auto"
      >
        <span className="text-lg leading-none">+</span>
        Add Medicine
      </button>
    </div>
  );
}