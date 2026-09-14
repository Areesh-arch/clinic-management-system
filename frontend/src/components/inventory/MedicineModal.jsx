import { FiX } from "react-icons/fi";

import MedicineForm from "./MedicineForm";

export default function MedicineModal({
  onClose,
  onSave,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#173C32]/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-[0_20px_60px_rgba(23,60,50,0.20)]"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between border-b border-[#E7E1D5] bg-[#F8F5ED] px-5 py-5 sm:px-6">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3EEE6] text-[#173C32]">
              <span className="text-xl font-semibold">
                +
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#173C32] sm:text-xl">
                Add Medicine
              </h2>

              <p className="mt-1 text-xs text-[#7D8882] sm:text-sm">
                Add a medicine to your clinic inventory.
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#718078] transition-colors hover:bg-[#EDEAE2] hover:text-[#173C32]"
          >
            <FiX size={19} />
          </button>

        </div>


        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <MedicineForm
            onSave={onSave}
            onCancel={onClose}
          />
        </div>

      </div>
    </div>
  );
}