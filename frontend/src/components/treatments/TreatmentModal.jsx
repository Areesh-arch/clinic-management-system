import { IoClose } from "react-icons/io5";
import TreatmentForm from "./TreatmentForm";

function TreatmentModal({
  isOpen,
  onClose,
  onSuccess,
  treatment,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <IoClose className="w-6 h-6" />
        </button>

        {/* FORM */}
        <TreatmentForm
          treatment={treatment}
          onSuccess={onSuccess}
          onClose={onClose}
        />

      </div>
    </div>
  );
}

export default TreatmentModal;