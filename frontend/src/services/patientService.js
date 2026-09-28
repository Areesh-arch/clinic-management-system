import { apiRequest } from "./api";

// GET ALL PATIENTS
export const getPatients = async () => {
  return await apiRequest("/patients/");
};

// GET SINGLE PATIENT
export const getPatient = async (patientId) => {
  return await apiRequest(`/patients/${patientId}`);
};

// GET PATIENT PROFILE DATA
export const getPatientProfile = async (patientId) => {
  const patientPromise = getPatient(patientId);

  const appointmentsPromise = apiRequest("/appointments/");
  const visitsPromise = apiRequest("/visits/");
  const paymentsPromise = apiRequest("/payments/payments/");
  const photosPromise = apiRequest("/treatment-photos/");

  const portalAccountPromise = apiRequest(
    `/patients/${patientId}/portal-account`
  );

  const results = await Promise.allSettled([
    patientPromise,
    appointmentsPromise,
    visitsPromise,
    paymentsPromise,
    photosPromise,
    portalAccountPromise,
  ]);

  const getResult = (result, fallback) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    console.warn(
      "Patient profile section could not be loaded:",
      result.reason
    );

    return fallback;
  };

  const patient = getResult(results[0], null);

  if (!patient) {
    throw new Error("Patient could not be loaded.");
  }

  const appointmentsData = getResult(results[1], []);
  const visitsData = getResult(results[2], []);
  const paymentsData = getResult(results[3], []);
  const photosData = getResult(results[4], []);

  const portalAccountData = getResult(results[5], {
    exists: false,
    is_active: false,
  });

  const normalizeList = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  };

  const appointments = normalizeList(appointmentsData);
  const visits = normalizeList(visitsData);
  const payments = normalizeList(paymentsData);
  const photos = normalizeList(photosData);

  const patientAppointments = appointments.filter(
    (appointment) =>
      Number(appointment?.patient_id) === Number(patientId)
  );

  const patientVisits = visits.filter(
    (visit) => Number(visit?.patient_id) === Number(patientId)
  );

  const patientPayments = payments.filter(
    (payment) => Number(payment?.patient_id) === Number(patientId)
  );

  const patientVisitIds = new Set(
    patientVisits
      .map((visit) => visit?.id)
      .filter(Boolean)
      .map(Number)
  );

  const patientPhotos = photos.filter((photo) =>
    patientVisitIds.has(Number(photo?.visit_id))
  );

  return {
    patient,
    appointments: patientAppointments,
    visits: patientVisits,
    payments: patientPayments,
    photos: patientPhotos,
    portalAccount: portalAccountData,
  };
};

// CREATE PATIENT
export const createPatient = async (patientData) => {
  return await apiRequest("/patients/", {
    method: "POST",
    body: JSON.stringify(patientData),
  });
};

// UPDATE PATIENT
export const updatePatient = async (patientId, patientData) => {
  return await apiRequest(`/patients/${patientId}`, {
    method: "PUT",
    body: JSON.stringify(patientData),
  });
};

// DELETE PATIENT
export const deletePatient = async (patientId) => {
  return await apiRequest(`/patients/${patientId}`, {
    method: "DELETE",
  });
};

// GET PATIENT PORTAL ACCOUNT
export const getPatientPortalAccount = async (patientId) => {
  return await apiRequest(`/patients/${patientId}/portal-account`);
};

// CREATE PATIENT PORTAL ACCOUNT
export const createPatientPortalAccount = async (
  patientId,
  accountData
) => {
  return await apiRequest(`/patients/${patientId}/portal-account`, {
    method: "POST",
    body: JSON.stringify(accountData),
  });
};

// UPDATE PATIENT PORTAL ACCOUNT STATUS
export const updatePatientPortalAccountStatus = async (
  patientId,
  isActive
) => {
  return await apiRequest(
    `/patients/${patientId}/portal-account/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        is_active: isActive,
      }),
    }
  );
};