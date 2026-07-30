import MedicineForm from "./MedicineForm";

export default function MedicineModal({ onClose, onSave }) {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[500px]">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            Add Medicine
          </h2>


          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold"
          >
            ✕
          </button>

        </div>


        <MedicineForm
          onSave={onSave}
        />

      </div>

    </div>
  );
}