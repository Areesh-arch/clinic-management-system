import { FiPlus } from "react-icons/fi";

function PatientHeader({ onAddPatient }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Patients
        </h1>

        <p className="text-slate-500 mt-2">
          Manage patient records and medical history.
        </p>
      </div>

      <button
  onClick={onAddPatient}
  className="
    flex
    items-center
    gap-2
    bg-[#556B55]
    text-white
    px-5
    py-3
    rounded-xl
    shadow-sm
    hover:bg-[#465946]
    hover:shadow-md
    transition-all
    duration-300
  "
>
        <FiPlus size={18} />
        Add Patient
      </button>

    </div>
  );
}

export default PatientHeader;