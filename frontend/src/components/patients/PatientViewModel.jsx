import { FiX } from "react-icons/fi";

function PatientViewModal({
  patient,
  onClose,
}) {
  if (!patient) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Patient Details
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {patient.medical_record_number}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-red-500 transition"
          >
            <FiX size={24} />
          </button>

        </div>


        {/* BODY */}
        <div className="p-6 space-y-6">

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Info
                label="First Name"
                value={patient.first_name}
              />

              <Info
                label="Last Name"
                value={patient.last_name}
              />

              <Info
                label="Gender"
                value={patient.gender}
              />

              <Info
                label="Date of Birth"
                value={patient.date_of_birth}
              />

              <Info
                label="Phone"
                value={patient.phone}
              />

              <Info
                label="Email"
                value={patient.email}
              />

            </div>
          </div>


          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Info
                label="City"
                value={patient.city}
              />

              <Info
                label="Country"
                value={patient.country}
              />

              <Info
                label="Address"
                value={patient.address}
              />

            </div>
          </div>


          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Medical Information
            </h3>

            <div className="space-y-4">

              <Info
                label="Blood Group"
                value={patient.blood_group}
              />

              <Info
                label="Allergies"
                value={patient.allergies}
              />

              <Info
                label="Medical History"
                value={patient.medical_history}
              />

              <Info
                label="Notes"
                value={patient.notes}
              />

            </div>
          </div>

        </div>


        {/* FOOTER */}
        <div className="flex justify-end px-6 py-5 border-t border-slate-200">

          <button
            type="button"
            onClick={onClose}
            className="
              px-5
              py-3
              rounded-xl
              border
              border-slate-300
              text-slate-700
              hover:bg-slate-50
              transition
            "
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}


function Info({ label, value }) {
  return (
    <div className="bg-[#F8FAF7] rounded-xl p-4">

      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-800 mt-1">
        {value || "-"}
      </p>

    </div>
  );
}


export default PatientViewModal;