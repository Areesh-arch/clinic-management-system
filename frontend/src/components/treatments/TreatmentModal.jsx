function TreatmentModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl hover:text-red-500"
        >
          ✕
        </button>

        {children}

      </div>

    </div>
  );
}

export default TreatmentModal;