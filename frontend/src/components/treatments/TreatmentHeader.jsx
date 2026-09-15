import { FiArchive, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function TreatmentHeader({
  onAddTreatment,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* TITLE */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-[#173B32]">
          Treatments
        </h1>

        <p className="mt-2 text-sm text-[#7E867F]">
          Manage clinic treatments
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {/* ARCHIVE */}
        <button
          type="button"
          onClick={() => navigate("/treatments/archive")}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#B4935A]
            bg-[#FFFDF8]
            px-5
            text-sm
            font-semibold
            text-[#173B32]
            shadow-[0_4px_14px_rgba(23,59,50,0.06)]
            transition
            hover:bg-[#F8F4E9]
            hover:shadow-[0_7px_18px_rgba(23,59,50,0.09)]
          "
        >
          <FiArchive size={17} className="text-[#B4935A]" />
          Archive
        </button>

        {/* ADD TREATMENT */}
        <button
          type="button"
          onClick={onAddTreatment}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#173B32]
            px-5
            text-sm
            font-semibold
            text-white
            shadow-[0_5px_16px_rgba(23,59,50,0.16)]
            transition
            hover:bg-[#214B40]
            hover:shadow-[0_8px_20px_rgba(23,59,50,0.22)]
          "
        >
          <FiPlus size={17} />
          Add Treatment
        </button>
      </div>
    </div>
  );
}

export default TreatmentHeader;