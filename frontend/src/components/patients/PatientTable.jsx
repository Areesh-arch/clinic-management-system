
import { useEffect, useState } from "react";

import PatientRow from "./PatientRow";

import {
  getPatients,
  getPatient,
  deletePatient,
} from "../../services/patientService";

function PatientTable({
  search = "",
  status = "All",
  gender = "All",
  refreshKey = 0,
  onView,
  onEdit,
  onDelete,
}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients();

      console.log("Patients loaded from database:", data);

      if (Array.isArray(data)) {
        setPatients(data);
      } else if (Array.isArray(data?.items)) {
        setPatients(data.items);
      } else if (Array.isArray(data?.results)) {
        setPatients(data.results);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error("Failed to load patients:", err);

      setError(
        err.message || "Failed to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [refreshKey]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return "-";
    }

    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
      return "-";
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    return age >= 0 ? age : "-";
  };

  const getPatientStatus = (patient) => {
    return patient?.is_active === false
      ? "Inactive"
      : "Active";
  };

  const formattedPatients = patients.map((patient) => {
    const firstName =
      patient?.first_name || "";

    const lastName =
      patient?.last_name || "";

    return {
      ...patient,

      name:
        `${firstName} ${lastName}`.trim() ||
        "Unnamed Patient",

      age: calculateAge(
        patient?.date_of_birth
      ),

      status: getPatientStatus(patient),
    };
  });

  const filteredPatients = formattedPatients.filter(
    (patient) => {
      const searchText =
        search.trim().toLowerCase();

      const patientName =
        patient.name?.toLowerCase() || "";

      const medicalRecordNumber =
        String(
          patient.medical_record_number || ""
        ).toLowerCase();

      const phone =
        String(
          patient.phone || ""
        ).toLowerCase();

      /*
       * SEARCH
       */
      const matchesSearch =
        searchText === "" ||
        patientName.includes(searchText) ||
        medicalRecordNumber.includes(searchText) ||
        phone.includes(searchText);

      /*
       * STATUS
       */
      const matchesStatus =
        status === "All" ||
        String(patient.status || "").toLowerCase() ===
          String(status || "").toLowerCase();

      /*
       * GENDER
       *
       * Backend may return:
       * male / female
       *
       * Frontend filter uses:
       * Male / Female
       *
       * So compare both values in lowercase.
       */
      const patientGender =
        String(patient?.gender || "")
          .trim()
          .toLowerCase();

      const selectedGender =
        String(gender || "")
          .trim()
          .toLowerCase();

      const matchesGender =
        selectedGender === "all" ||
        patientGender === selectedGender;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGender
      );
    }
  );

  const handleView = async (patient) => {
    console.log("Viewing patient:", patient);

    const patientId =
      patient?.id ||
      patient?.patient_id;

    let patientDetails = patient;

    if (patientId) {
      try {
        patientDetails =
          await getPatient(patientId);

        console.log(
          "Latest patient details:",
          patientDetails
        );
      } catch (err) {
        console.warn(
          "Could not fetch latest patient details. Using table data.",
          err
        );
      }
    }

    if (typeof onView === "function") {
      onView(patientDetails);
    } else {
      console.warn(
        "PatientTable: onView was not provided."
      );
    }
  };

  const handleEdit = (patient) => {
    console.log("Editing patient:", patient);

    if (typeof onEdit === "function") {
      onEdit(patient);
    } else {
      console.warn(
        "PatientTable: onEdit was not provided."
      );
    }
  };

  const handleDelete = async (patient) => {
    const patientId =
      patient?.id ||
      patient?.patient_id;

    if (!patientId) {
      console.error(
        "Cannot delete patient: patient ID is missing.",
        patient
      );

      return;
    }

    const patientName =
      patient.name ||
      `${patient.first_name || ""} ${
        patient.last_name || ""
      }`.trim();

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        patientName || "this patient"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePatient(patientId);

      console.log(
        "Patient deleted:",
        patientId
      );

      setPatients((previousPatients) =>
        previousPatients.filter(
          (item) =>
            (item?.id ||
              item?.patient_id) !== patientId
        )
      );

      if (typeof onDelete === "function") {
        onDelete(patient);
      }
    } catch (err) {
      console.error(
        "Failed to delete patient:",
        err
      );

      setError(
        err.message ||
          "Failed to delete patient."
      );
    }
  };

  if (loading) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-[#DDE5DF]
          shadow-[0_4px_20px_rgba(79,104,83,0.08)]
          p-12
        "
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="
              w-10
              h-10
              rounded-full
              border-4
              border-[#EAF2E7]
              border-t-[#5F7A63]
              animate-spin
            "
          />

          <p className="text-sm text-[#60738F]">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-[#E5CACA]
          shadow-[0_4px_20px_rgba(79,104,83,0.08)]
          p-12
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              w-12
              h-12
              rounded-full
              bg-[#FDECEC]
              text-[#C94A4A]
              flex
              items-center
              justify-center
              font-bold
              text-lg
              mb-4
            "
          >
            !
          </div>

          <p className="text-[#C94A4A] font-medium">
            {error}
          </p>

          <button
            type="button"
            onClick={loadPatients}
            className="
              mt-5
              px-5
              py-2.5
              rounded-xl
              bg-[#5F7A63]
              text-white
              font-semibold
              hover:bg-[#4F6853]
              transition-colors
              cursor-pointer
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-[#DDE5DF]
        shadow-[0_4px_20px_rgba(79,104,83,0.08)]
        overflow-hidden
      "
    >
      {/* HEADER */}

      <div
        className="
          px-8
          py-7
          border-b
          border-[#E5EBE4]
          bg-linear-to-r
          from-[#F8FAF7]
          to-white
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              className="
                text-2xl
                font-semibold
                text-[#1E2D45]
              "
            >
              Patient Records
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[#60738F]
              "
            >
              {filteredPatients.length} patient
              {filteredPatients.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div
            className="
              px-4
              py-2
              rounded-full
              bg-[#EAF2E7]
              text-[#5F7A63]
              border
              border-[#D5E4D1]
              text-sm
              font-semibold
            "
          >
            {filteredPatients.length} Records
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead>
            <tr
              className="
                bg-[#F8FAF7]
                border-b
                border-[#E1E8E0]
              "
            >
              <th
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-semibold
                  text-[#425D78]
                "
              >
                Name
              </th>

              <th
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-semibold
                  text-[#425D78]
                "
              >
                Age
              </th>

              <th
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-semibold
                  text-[#425D78]
                "
              >
                Gender
              </th>

              <th
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-semibold
                  text-[#425D78]
                "
              >
                Phone
              </th>

              <th
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-semibold
                  text-[#425D78]
                "
              >
                Status
              </th>

              <th
                className="
                  px-6
                  py-5
                  text-left
                  text-sm
                  font-semibold
                  text-[#425D78]
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientRow
                  key={
                    patient.id ||
                    patient.patient_id
                  }
                  patient={patient}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="
                        w-14
                        h-14
                        rounded-full
                        bg-[#EAF2E7]
                        text-[#5F7A63]
                        flex
                        items-center
                        justify-center
                        mb-4
                      "
                    >
                      <span className="text-xl">
                        👤
                      </span>
                    </div>

                    <p
                      className="
                        text-[#1E2D45]
                        font-semibold
                      "
                    >
                      No patients found
                    </p>

                    <p
                      className="
                        text-sm
                        text-[#60738F]
                        mt-1
                      "
                    >
                      Try changing your search or
                      filter.
                    </p>
                  </div>
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
