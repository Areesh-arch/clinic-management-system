
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCamera,
  FiCreditCard,
  FiFileText,
  FiHeart,
  FiPlus,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import { getPatientProfile } from "../../services/patientService";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const extractTime = (value) => {
  if (!value) return "—";

  if (typeof value === "string") {
    if (value.includes("T")) {
      return value.split("T")[1]?.slice(0, 5) || value;
    }

    return value.slice(0, 5);
  }

  return value;
};

function Stat({ icon, label, value }) {
  return (
    <div className="bg-white border border-[#E6E9E4] rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#EEF4EB] text-[#5F7A63] flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-[#26372A]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, action, children }) {
  return (
    <section className="bg-white border border-[#E6E9E4] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E6E9E4] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF4EB] text-[#5F7A63] flex items-center justify-center">
            {icon}
          </div>

          <h2 className="text-base font-semibold text-[#26372A]">
            {title}
          </h2>
        </div>

        {action}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function SectionAction({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5F7A63] text-white text-sm font-medium hover:bg-[#4F6953] transition-colors"
    >
      <FiPlus size={15} />
      {children}
    </button>
  );
}

function InfoCard({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-sm text-[#26372A] wrap-break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function TextCard({ label, value }) {
  return (
    <div className="bg-[#F8FAF7] border border-[#E8ECE6] rounded-xl p-4">
      <p className="text-xs font-medium text-gray-500 mb-2">
        {label}
      </p>

      <p className="text-sm text-[#26372A] whitespace-pre-line">
        {value || "—"}
      </p>
    </div>
  );
}

function MoneyCard({ label, value, highlight = false }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "bg-[#F8F3E7] border-[#E9DDBD]"
          : "bg-[#F8FAF7] border-[#E8ECE6]"
      }`}
    >
      <p className="text-xs font-medium text-gray-500 mb-1">
        {label}
      </p>

      <p
        className={`text-xl font-semibold ${
          highlight ? "text-[#8A6D35]" : "text-[#26372A]"
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function PhotoGallery({ photos }) {
  if (!photos.length) {
    return <EmptyState message="No patient photos available." />;
  }

  return (
    <div className="space-y-6">
      {["Before", "After"].map((type) => {
        const filteredPhotos = photos.filter(
          (photo) =>
            String(photo?.photo_type || "").toLowerCase() ===
            type.toLowerCase()
        );

        return (
          <div key={type}>
            <h3 className="text-sm font-semibold text-[#26372A] mb-3">
              {type}
            </h3>

            {filteredPhotos.length === 0 ? (
              <p className="text-sm text-gray-500">
                No {type.toLowerCase()} photos available.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => {
                  const imageUrl =
                    photo?.image_url ||
                    photo?.url ||
                    photo?.image ||
                    photo?.file_url;

                  if (!imageUrl) {
                    return null;
                  }

                  return (
                    <div
                      key={photo.id}
                      className="rounded-xl overflow-hidden border border-[#E6E9E4] bg-[#F8FAF7]"
                    >
                      <img
                        src={imageUrl}
                        alt={`${type} patient`}
                        className="w-full h-48 object-cover"
                      />

                      {photo?.caption && (
                        <div className="p-3">
                          <p className="text-xs text-gray-600">
                            {photo.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPatientProfile(patientId);

        if (mounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load patient profile:", err);

        if (mounted) {
          setError(
            err.message || "Failed to load patient profile."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const goToAppointments = () => {
    navigate(`/appointments?patient_id=${patientId}`);
  };

  const goToTreatments = () => {
    navigate(`/treatments?patient_id=${patientId}`);
  };

  const goToBilling = () => {
    navigate(`/billing?patient_id=${patientId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading patient profile...
          </p>
        </div>
      </Layout>
    );
  }

  if (error || !profile?.patient) {
    return (
      <Layout>
        <div className="p-6">
          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="inline-flex items-center gap-2 text-sm text-[#5F7A63] hover:text-[#435A47]"
          >
            <FiArrowLeft size={16} />
            Back to Patients
          </button>

          <div className="mt-8 bg-white border border-red-100 rounded-2xl p-8 text-center">
            <p className="text-sm text-red-600">
              {error || "Patient profile could not be loaded."}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    patient,
    appointments = [],
    visits = [],
    payments = [],
    photos = [],
  } = profile;

  const patientName =
    `${patient?.first_name || ""} ${patient?.last_name || ""}`.trim() ||
    "Patient";

  const totalCharges = visits.reduce(
    (total, visit) =>
      total +
      Number(
        visit?.charge ||
          visit?.charges ||
          visit?.amount ||
          0
      ),
    0
  );

  const totalPaid = payments.reduce(
    (total, payment) =>
      total + Number(payment?.amount || 0),
    0
  );

  const outstanding = Math.max(
    totalCharges - totalPaid,
    0
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/patients")}
          className="inline-flex items-center gap-2 text-sm text-[#5F7A63] hover:text-[#435A47] transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to Patients
        </button>

        {/* Patient Header */}
        <div className="bg-white border border-[#E6E9E4] rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF2E7] text-[#5F7A63] flex items-center justify-center text-xl font-semibold">
                {patientName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-[#26372A]">
                  {patientName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {patient?.mrn && (
                    <span className="text-sm text-gray-500">
                      MRN: {patient.mrn}
                    </span>
                  )}

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      patient?.is_active === false
                        ? "bg-red-50 text-red-600"
                        : "bg-[#EAF2E7] text-[#5F7A63]"
                    }`}
                  >
                    {patient?.is_active === false
                      ? "Inactive"
                      : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            icon={<FiCalendar size={18} />}
            label="Appointments"
            value={appointments.length}
          />

          <Stat
            icon={<FiFileText size={18} />}
            label="Visits"
            value={visits.length}
          />

          <Stat
            icon={<FiCreditCard size={18} />}
            label="Paid"
            value={formatCurrency(totalPaid)}
          />

          <Stat
            icon={<FiCreditCard size={18} />}
            label="Outstanding"
            value={formatCurrency(outstanding)}
          />
        </div>

        {/* Basic Information */}
        <Section
          title="Basic Information"
          icon={<FiUser size={17} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              label="First Name"
              value={patient?.first_name}
            />

            <InfoCard
              label="Last Name"
              value={patient?.last_name}
            />

            <InfoCard
              label="Gender"
              value={patient?.gender}
            />

            <InfoCard
              label="Date of Birth"
              value={formatDate(
                patient?.date_of_birth || patient?.dob
              )}
            />

            <InfoCard
              label="Phone"
              value={patient?.phone}
            />

            <InfoCard
              label="Email"
              value={patient?.email}
            />

            <InfoCard
              label="CNIC"
              value={patient?.cnic}
            />

            <InfoCard
              label="Occupation"
              value={patient?.occupation}
            />

            <InfoCard
              label="Blood Group"
              value={patient?.blood_group}
            />

            <InfoCard
              label="Marital Status"
              value={patient?.marital_status}
            />

            <InfoCard
              label="Address"
              value={patient?.address}
            />

            <InfoCard
              label="City / Country"
              value={
                [patient?.city, patient?.country]
                  .filter(Boolean)
                  .join(", ") || "—"
              }
            />
          </div>
        </Section>

        {/* Medical Information */}
        <Section
          title="Medical Information"
          icon={<FiHeart size={17} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextCard
              label="Allergies"
              value={patient?.allergies}
            />

            <TextCard
              label="Medical History"
              value={patient?.medical_history}
            />

            <TextCard
              label="Emergency Contact"
              value={patient?.emergency_contact}
            />

            <TextCard
              label="Notes"
              value={patient?.notes}
            />
          </div>
        </Section>

        {/* Appointments */}
        <Section
          title="Appointments"
          icon={<FiCalendar size={17} />}
          action={
            <SectionAction onClick={goToAppointments}>
              Add Appointment
            </SectionAction>
          }
        >
          {appointments.length === 0 ? (
            <EmptyState message="No appointments available." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8ECE6]">
                    <th className="text-left text-xs font-semibold text-gray-500 py-3 pr-4">
                      Date
                    </th>

                    <th className="text-left text-xs font-semibold text-gray-500 py-3 pr-4">
                      Time
                    </th>

                    <th className="text-left text-xs font-semibold text-gray-500 py-3 pr-4">
                      Reason
                    </th>

                    <th className="text-left text-xs font-semibold text-gray-500 py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-[#F0F2EF] last:border-0"
                    >
                      <td className="py-4 pr-4 text-sm text-[#26372A]">
                        {formatDate(
                          appointment?.appointment_date ||
                            appointment?.date
                        )}
                      </td>

                      <td className="py-4 pr-4 text-sm text-gray-600">
                        {extractTime(
                          appointment?.appointment_time ||
                            appointment?.time
                        )}
                      </td>

                      <td className="py-4 pr-4 text-sm text-gray-600">
                        {appointment?.reason ||
                          appointment?.purpose ||
                          appointment?.notes ||
                          "—"}
                      </td>

                      <td className="py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-[#EEF4EB] text-[#5F7A63] text-xs font-medium">
                          {appointment?.status || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Treatment History */}
        <Section
          title="Treatment History"
          icon={<FiFileText size={17} />}
          action={
            <SectionAction onClick={goToTreatments}>
              Add Treatment
            </SectionAction>
          }
        >
          {visits.length === 0 ? (
            <EmptyState message="No treatment history available." />
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="border border-[#E8ECE6] rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#26372A]">
                        {visit?.diagnosis ||
                          "Treatment / Visit"}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2 text-xs text-gray-500">
                        <span>
                          Date:{" "}
                          {formatDate(
                            visit?.visit_date ||
                              visit?.date
                          )}
                        </span>

                        <span>
                          Doctor:{" "}
                          {visit?.doctor?.name ||
                            visit?.doctor_name ||
                            visit?.doctor_id ||
                            "—"}
                        </span>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-500">
                        Charges
                      </p>

                      <p className="text-sm font-semibold text-[#26372A]">
                        {formatCurrency(
                          visit?.charge ||
                            visit?.charges ||
                            visit?.amount ||
                            0
                        )}
                      </p>
                    </div>
                  </div>

                  {(visit?.notes ||
                    visit?.description) && (
                    <div className="mt-4 pt-4 border-t border-[#E8ECE6]">
                      <p className="text-xs text-gray-500 mb-1">
                        Notes
                      </p>

                      <p className="text-sm text-[#26372A]">
                        {visit?.notes ||
                          visit?.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Payments & Billing */}
        <Section
          title="Payments & Billing"
          icon={<FiCreditCard size={17} />}
          action={
            <SectionAction onClick={goToBilling}>
              Add Payment
            </SectionAction>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <MoneyCard
              label="Total Charges"
              value={totalCharges}
            />

            <MoneyCard
              label="Total Paid"
              value={totalPaid}
            />

            <MoneyCard
              label="Outstanding"
              value={outstanding}
              highlight={outstanding > 0}
            />
          </div>

          {payments.length === 0 ? (
            <EmptyState message="No payment history available." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8ECE6]">
                    <th className="text-left text-xs font-semibold text-gray-500 py-3 pr-4">
                      Date
                    </th>

                    <th className="text-left text-xs font-semibold text-gray-500 py-3 pr-4">
                      Amount
                    </th>

                    <th className="text-left text-xs font-semibold text-gray-500 py-3 pr-4">
                      Method
                    </th>

                    <th className="text-left text-xs font-semibold text-gray-500 py-3 pr-4">
                      Visit
                    </th>

                    <th className="text-left text-xs font-semibold text-gray-500 py-3">
                      Notes
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-[#F0F2EF] last:border-0"
                    >
                      <td className="py-4 pr-4 text-sm text-[#26372A]">
                        {formatDate(
                          payment?.payment_date ||
                            payment?.date
                        )}
                      </td>

                      <td className="py-4 pr-4 text-sm font-medium text-[#26372A]">
                        {formatCurrency(payment?.amount)}
                      </td>

                      <td className="py-4 pr-4 text-sm text-gray-600">
                        {payment?.payment_method || "—"}
                      </td>

                      <td className="py-4 pr-4 text-sm text-gray-600">
                        {payment?.visit_id || "—"}
                      </td>

                      <td className="py-4 text-sm text-gray-600">
                        {payment?.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Patient Photos */}
        <Section
          title="Patient Photos"
          icon={<FiCamera size={17} />}
        >
          <PhotoGallery photos={photos} />
        </Section>
      </div>
    </Layout>
  );
}
