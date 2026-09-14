import { FiX, FiPackage } from "react-icons/fi";

import MedicineLogForm from "./MedicineLogForm";


export default function MedicineLogModal({
  onClose,
  onSuccess,
}) {
  const handleSuccess = async () => {
    if (onSuccess) {
      await onSuccess();
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#173B32]/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-[0_20px_60px_rgba(23,59,50,0.20)]"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between border-b border-[#E7E1D5] bg-[#F8F5ED] px-5 py-5 sm:px-6">

          <div className="flex min-w-0 items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3EEE6] text-[#173B32]">
              <FiPackage size={19} />
            </div>

            <div className="min-w-0">

              <h2 className="text-lg font-bold text-[#173B32] sm:text-xl">
                Issue Medicine
              </h2>

              <p className="mt-1 text-xs text-[#7D8882] sm:text-sm">
                Issue medicine to a patient from clinic stock.
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#718078] transition-colors hover:bg-[#EDEAE2] hover:text-[#173B32]"
          >
            <FiX size={19} />
          </button>

        </div>


        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">

          <MedicineLogForm
            onSuccess={handleSuccess}
            onCancel={onClose}
          />

        </div>

      </div>

    </div>
  );
}