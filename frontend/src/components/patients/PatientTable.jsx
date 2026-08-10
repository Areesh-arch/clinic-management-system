import { useEffect, useState } from "react";
import PatientRow from "./PatientRow";
import { getPatients } from "../../services/patientService";

function PatientTable({ search, status, gender }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients();

      // FastAPI normally returns a list.
      // This also handles common wrapped responses.
      if (Array.isArray(data)) {
        setPatients(data);
      } else if (Array.isArray(data.items)) {
        setPatients(data.items);
      } else if (Array.isArray(data.results)) {
        setPatients(data.results);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Failed to load patients:", error);
      setError(error.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date_of_birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return "-";
    }

    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
      return "-";
    }

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Convert PostgreSQL is_active into the status
  // expected by the existing frontend filters.
  const getPatientStatus = (patient) => {
    return patient.is_active ? "Active" : "Inactive";
  };

  // Convert backend patient data into the structure
  // currently expected by PatientRow.
  const formattedPatients = patients.map((patient) => ({
    ...patient,

    // Database:
    // first_name + last_name
    //
    // Frontend:
    // name
    name: `${patient.first_name || ""} ${
      patient.last_name || ""
    }`.trim(),

    // Database:
    // date_of_birth
    //
    // Frontend:
    // age
    age: calculateAge(patient.date_of_birth),

    // Database:
    // is_active
    //
    // Frontend:
    // status
    status: getPatientStatus(patient),
  }));

  // Apply search and filters
  const filteredPatients = formattedPatients.filter((patient) => {
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10">
        <p className="text-center text-slate-500">
          Loading patients...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-10">
        <p className="text-center text-red-500">
          {error}
        </p>

        <div className="flex justify-center mt-4">
          <button
            onClick={loadPatients}
            className="px-4 py-2 rounded-lg bg-[#5F7A63] text-white hover:bg-[#4F6853]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          Patient Records
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {filteredPatients.length} patient
          {filteredPatients.length !== 1 ? "s" : ""} found
        </p>
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