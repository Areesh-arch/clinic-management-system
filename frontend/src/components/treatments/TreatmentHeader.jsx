import { FiPlus } from "react-icons/fi";


function TreatmentHeader({
  onAddTreatment,
}) {

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

      <div>

        <h1 className="text-4xl font-bold text-[#45524A]">
          Treatments
        </h1>

        <p className="text-[#7E867F] mt-2">
          Manage clinic treatments
        </p>

      </div>


      <button
        type="button"
        onClick={onAddTreatment}
        className="flex items-center gap-2 bg-[#A8C5A0] text-white px-5 py-3 rounded-xl hover:bg-[#90B68A]"
      >

        <FiPlus />

        Add Treatment

      </button>

    </div>
  );
}


export default TreatmentHeader;