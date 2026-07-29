import { FiX } from "react-icons/fi";

function PatientModal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl relative">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-500 hover:text-red-500 transition"
        >
          <FiX size={24} />
        </button>

        {children}

      </div>
    </div>
  );
}

export default PatientModal;