function AppointmentModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl relative">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-3xl text-slate-500 hover:text-red-500 transition"
        >
          ×
        </button>

        {children}

      </div>

    </div>
  );
}

export default AppointmentModal;