import PatientRow from "./PatientRow";
import { patients } from "../../utils/patientData";

function PatientTable({ search, status, gender }) {
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || patient.status === status;

    const matchesGender =
      gender === "All" || patient.gender === gender;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesGender
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-[#556B55]">
          Patient Records
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8FAF7]">
            <tr className="text-left text-slate-600">
              <th className="p-4">Name</th>
              <th className="p-4">Age</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-slate-500"
                >
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientTable;