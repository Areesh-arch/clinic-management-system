import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getPatients } from "../../services/patientService";
import { getTreatments } from "../../services/treatmentService";

export default function TreatmentInfo({
  visitId,
  setVisitId,
}) {
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);

  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [loadingVisits, setLoadingVisits] =
    useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD PATIENTS
  // =====================================================

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoadingPatients(true);
        setError("");

        const response = await getPatients();

        console.log(
          "Patients received by TreatmentInfo:",
          response
        );

        let patientList = [];

        if (Array.isArray(response)) {
          patientList = response;
        } else if (Array.isArray(response?.items)) {
          patientList = response.items;
        } else if (Array.isArray(response?.results)) {
          patientList = response.results;
        } else if (Array.isArray(response?.data)) {
          patientList = response.data;
        }

        setPatients(patientList);
      } catch (error) {
        console.error(
          "Failed to load patients:",
          error
        );

        setError(
          error.message ||
            "Failed to load patients."
        );
      } finally {
        setLoadingPatients(false);
      }
    };

    loadPatients();
  }, []);

  // =====================================================
  // LOAD VISITS / TREATMENTS
  // =====================================================

  useEffect(() => {
    const loadVisits = async () => {
      try {
        setLoadingVisits(true);

        const response = await getTreatments();

        console.log(
          "Visits received by TreatmentInfo:",
          response
        );

        let visitList = [];

        if (Array.isArray(response)) {
          visitList = response;
        } else if (Array.isArray(response?.items)) {
          visitList = response.items;
        } else if (Array.isArray(response?.results)) {
          visitList = response.results;
        } else if (Array.isArray(response?.data)) {
          visitList = response.data;
        }

        setVisits(visitList);
      } catch (error) {
        console.error(
          "Failed to load visits:",
          error
        );

        setError(
          error.message ||
            "Failed to load visits."
        );
      } finally {
        setLoadingVisits(false);
      }
    };

    loadVisits();
  }, []);

  // =====================================================
  // GET PATIENT ID FROM VISIT
  // =====================================================

  const getVisitPatientId = (visit) => {
    return (
      visit?.patient_id ??
      visit?.patient?.id ??
      visit?.appointment?.patient_id ??
      visit?.appointment?.patient?.id ??
      null
    );
  };

  // =====================================================
  // FILTER VISITS BY SELECTED PATIENT
  // =====================================================

  const filteredVisits = useMemo(() => {
    if (!selectedPatientId) {
      return [];
    }

    const selectedId =
      String(selectedPatientId);

    return visits.filter((visit) => {
      const patientId =
        getVisitPatientId(visit);

      if (!patientId) {
        return false;
      }

      return (
        String(patientId) === selectedId
      );
    });
  }, [
    visits,
    selectedPatientId,
  ]);

  // =====================================================
  // PATIENT CHANGE
  // =====================================================

  const handlePatientChange = (event) => {
    const patientId =
      event.target.value;

    setSelectedPatientId(patientId);

    // Reset selected visit when patient changes
    setVisitId("");

    console.log(
      "Selected patient:",
      patientId
    );
  };

  // =====================================================
  // VISIT CHANGE
  // =====================================================

  const handleVisitChange = (event) => {
    const selectedVisitId =
      event.target.value;

    setVisitId(selectedVisitId);

    console.log(
      "Selected visit:",
      selectedVisitId
    );
  };

  // =====================================================
  // PATIENT NAME
  // =====================================================

  const getPatientName = (patient) => {
    const firstName =
      patient?.first_name || "";

    const lastName =
      patient?.last_name || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      patient?.name ||
      `Patient #${patient?.id}`
    );
  };

  // =====================================================
  // VISIT / TREATMENT LABEL
  // =====================================================

  const getVisitLabel = (visit) => {
    const diagnosis =
      visit?.diagnosis?.trim();

    const date =
      visit?.visit_time ??
      visit?.visit_date ??
      visit?.date ??
      visit?.created_at;

    let formattedDate = "";

    if (date) {
      const parsedDate = new Date(date);

      if (!Number.isNaN(parsedDate.getTime())) {
        formattedDate =
          parsedDate.toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );
      }
    }

    // Primary display:
    // Treatment / Diagnosis + Date
    if (diagnosis && formattedDate) {
      return `${diagnosis} — ${formattedDate}`;
    }

    // If only treatment exists
    if (diagnosis) {
      return diagnosis;
    }

    // If only date exists
    if (formattedDate) {
      return `Visit — ${formattedDate}`;
    }

    // Final fallback
    return "Visit";
  };

  // =====================================================
  // SELECTED VISIT
  // =====================================================

  const selectedVisit = useMemo(() => {
    if (!visitId) {
      return null;
    }

    return visits.find(
      (visit) =>
        String(
          visit?.id ?? visit?.visit_id
        ) === String(visitId)
    );
  }, [visits, visitId]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-[#DDE5DF]
        bg-white
        p-8
        shadow-sm
      "
    >
      {/* HEADER */}

      <div className="mb-8">
        <h2
          className="
            text-2xl
            font-bold
            text-[#1E2D45]
          "
        >
          Treatment Information
        </h2>

        <p
          className="
            mt-1
            text-base
            text-[#60738F]
          "
        >
          Select the patient and treatment
          for these treatment photos.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* FIELDS */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
        "
      >
        {/* =================================================
            PATIENT
        ================================================= */}

        <div>
          <label
            className="
              mb-2
              block
              text-base
              font-medium
              text-[#1E2D45]
            "
          >
            Patient
          </label>

          <select
            value={selectedPatientId}
            onChange={handlePatientChange}
            disabled={loadingPatients}
            className="
              w-full
              rounded-xl
              border
              border-[#DDE5DF]
              bg-white
              px-4
              py-3
              text-base
              text-[#1E2D45]
              outline-none
              transition
              focus:border-[#5F7A63]
              focus:ring-4
              focus:ring-[#EAF2E7]
              disabled:cursor-not-allowed
              disabled:bg-gray-50
            "
          >
            <option value="">
              {loadingPatients
                ? "Loading patients..."
                : "Select Patient"}
            </option>

            {patients.map((patient) => {
              const patientId =
                patient?.id ??
                patient?.patient_id;

              return (
                <option
                  key={patientId}
                  value={patientId}
                >
                  {getPatientName(patient)}
                </option>
              );
            })}
          </select>

          {!loadingPatients &&
            patients.length === 0 && (
              <p className="mt-2 text-sm text-red-600">
                No patients found in the database.
              </p>
            )}
        </div>

        {/* =================================================
            TREATMENT
        ================================================= */}

        <div>
          <label
            className="
              mb-2
              block
              text-base
              font-medium
              text-[#1E2D45]
            "
          >
            Treatment
          </label>

          <select
            value={visitId || ""}
            onChange={handleVisitChange}
            disabled={
              !selectedPatientId ||
              loadingVisits
            }
            className="
              w-full
              rounded-xl
              border
              border-[#DDE5DF]
              bg-white
              px-4
              py-3
              text-base
              text-[#1E2D45]
              outline-none
              transition
              focus:border-[#5F7A63]
              focus:ring-4
              focus:ring-[#EAF2E7]
              disabled:cursor-not-allowed
              disabled:bg-gray-50
            "
          >
            <option value="">
              {!selectedPatientId
                ? "Select patient first"
                : loadingVisits
                ? "Loading treatments..."
                : "Select Treatment"}
            </option>

            {filteredVisits.map((visit) => {
              const id =
                visit?.id ??
                visit?.visit_id;

              return (
                <option
                  key={id}
                  value={id}
                >
                  {getVisitLabel(visit)}
                </option>
              );
            })}
          </select>

          {selectedPatientId &&
            !loadingVisits &&
            filteredVisits.length === 0 && (
              <p className="mt-2 text-sm text-[#60738F]">
                No treatments found for this patient.
              </p>
            )}
        </div>
      </div>

      {/* =================================================
          SELECTED TREATMENT INFO
      ================================================= */}

      {visitId && selectedVisit && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-[#D5E4D1]
            bg-[#EAF2E7]
            px-4
            py-3
            text-sm
            text-[#4F6853]
          "
        >
          <span className="font-semibold">
            Selected Treatment:
          </span>{" "}
          {selectedVisit.diagnosis?.trim() ||
            "Treatment details not available"}
        </div>
      )}
    </div>
  );
}