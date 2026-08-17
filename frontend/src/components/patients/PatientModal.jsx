import { FiX } from "react-icons/fi";

function PatientViewModal({
  patient,
  onClose,
}) {
  if (!patient) {
    return null;
  }

  const fields = [
    ["Medical Record Number", patient.medical_record_number],
    [
      "Name",
      `${patient.first_name || ""} ${
        patient.last_name || ""
      }`.trim(),
    ],
    ["Gender", patient.gender],
    ["Date of Birth", patient.date_of_birth],
    ["Phone", patient.phone],
    ["Email", patient.email],
    ["CNIC", patient.cnic],
    ["Occupation", patient.occupation],
    ["Marital Status", patient.marital_status],
    ["Blood Group", patient.blood_group],
    ["City", patient.city],
    ["Country", patient.country],
    ["Address", patient.address],
    ["Allergies", patient.allergies],
    ["Medical History", patient.medical_history],
    ["Notes", patient.notes],
    [
      "Emergency Contact",
      patient.emergency_contact_name,
    ],
    [
      "Emergency Phone",
      patient.emergency_contact_phone,
    ],
  ];

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        p-4
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div
        className="
          relative
          w-full
          max-w-3xl
          max-h-[90vh]
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            py-5
          "
        >

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Patient Details
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Medical record information
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-800
              transition
            "
          >
            <FiX size={24} />
          </button>

        </div>

        {/* BODY */}

        <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {fields.map(([label, value]) => (

              <div
                key={label}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-[#FAFBF8]
                  p-4
                "
              >

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {label}
                </p>

                <p className="mt-1 text-sm text-slate-800">
                  {value || "-"}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default PatientViewModal;