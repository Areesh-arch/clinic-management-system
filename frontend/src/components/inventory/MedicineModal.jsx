import { FiX } from "react-icons/fi";
import MedicineForm from "./MedicineForm";

export default function MedicineModal({
  medicine = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(medicine?.id);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#173C32]/50 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-2xl">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E7E1D5] bg-[#173C32] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-white sm:text-xl">
              {isEditing
                ? "Edit Medicine"
                : "Add Medicine"}
            </h2>

            <p className="mt-1 text-xs text-[#D9E4DE] sm:text-sm">
              {isEditing
                ? "Update the medicine information below."
                : "Add a new medicine to clinic stock."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <MedicineForm
            medicine={medicine}
            onSave={onSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}