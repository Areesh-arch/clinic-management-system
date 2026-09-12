
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

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

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

function Stat({ icon, label, value, gold = false }) {
  return (
    <div className="group rounded-2xl border border-[#E5E8E3] bg-[#FFFDF8] p-5 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(23,59,50,0.07)]">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            gold
              ? "bg-[#F7F0E1] text-[#A58B52]"
              : "bg-[#EAF1EC] text-[#5F7A68]"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#7B827D]">
            {label}
          </p>

          <p className="truncate text-lg font-semibold text-[#173B32]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, action, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E4E8E2] bg-[#FFFDF8] shadow-[0_2px_12px_rgba(23,59,50,0.025)]">
      <div className="flex flex-col gap-3 border-b border-[#E8EBE6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF1EC] text-[#587363]">
            {icon}
          </div>

          <div>
            <h2 className="text-[15px] font-semibold text-[#173B32]">
              {title}
            </h2>
          </div>
        </div>

        {action}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function SectionAction({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#173B32] px-3.5 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#245447] sm:w-auto"
    >
      <FiPlus size={14} />
      {children}
    </button>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border-b border-[#EEF0EC] pb-4 last:border-0 md:border-b-0 md:pb-0">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#8A908B]">
        {label}
      </p>

      <p className="wrap-break-words text-sm font-medium leading-5 text-[#273C33]">
        {value || "—"}
      </p>
    </div>
  );
}

function TextCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E8ECE7] bg-[#F8FAF7] p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#818983]">
        {label}
      </p>

      <p className="whitespace-pre-line wrap-break-words text-sm leading-6 text-[#30443B]">
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
          ? "border-[#E6D8B7] bg-[#F8F1E3]"
          : "border-[#E8ECE7] bg-[#F8FAF7]"
      }`}
    >
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#818983]">
        {label}
      </p>

      <p
        className={`text-xl font-semibold ${
          highlight ? "text-[#8A6D35]" : "text-[#173B32]"
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-[#DDE3DD] bg-[#FAFBF9] px-5 py-10 text-center">
      <p className="text-sm text-[#7C847E]">{message}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let className = "bg-[#EEF2EF] text-[#53625A]";

  if (
    normalized.includes("confirm") ||
    normalized.includes("complete") ||
    normalized.includes("active")
  ) {
    className = "bg-[#E8F1EA] text-[#426A50]";
  } else if (
    normalized.includes("cancel") ||
    normalized.includes("reject")
  ) {
    className = "bg-[#FBEDEC] text-[#A34E4A]";
  } else if (
    normalized.includes("pending") ||
    normalized.includes("schedule")
  ) {
    className = "bg-[#F7F0E2] text-[#8A6D35]";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {status || "—"}
    </span>
  );
}

function PhotoGallery({ photos }) {
  if (!photos.length) {
    return <EmptyState message="No patient photos available." />;
  }

  return (
    <div className="space-y-7">
      {["Before", "After"].map((type) => {
        const filteredPhotos = photos.filter(
          (photo) =>
            String(photo?.photo_type || "").toLowerCase() ===
            type.toLowerCase()
        );

        return (
          <div key={type}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-sm font-semibold text-[#173B32]">
                {type}
              </h3>

              <div className="h-px flex-1 bg-[#E9ECE8]" />
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#DDE3DD] px-4 py-6">
                <p className="text-sm text-[#818983]">
                  No {type.toLowerCase()} photos available.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                      className="overflow-hidden rounded-xl border border-[#E4E8E2] bg-[#F8FAF7]"
                    >
                      <div className="relative overflow-hidden bg-[#EEF2EE]">
                        <img
                          src={imageUrl}
                          alt={`${type} patient`}
                          className="h-48 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                      </div>

                      {photo?.caption && (
                        <div className="p-3">
                          <p className="wrap-break-words text-xs leading-5 text-[#657069]">
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
  const location = useLocation();

  /*
   * ============================================================
   * BACK NAVIGATION
   * ============================================================
   *
   * When opened from Appointments:
   * Appointments -> Patient Profile -> Back to Appointments
   *
   * When opened from Patients:
   * Patients -> Patient Profile -> Back to Patients
   *
   * Default remains /patients so existing behavior is preserved.
   * ============================================================
   */
  const backPath = location.state?.from || "/patients";

  const backLabel =
    location.state?.from === "/appointments"
      ? "Back to Appointments"
      : "Back to Patients";

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
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#DDE5DF] border-t-[#173B32]" />

            <p className="text-sm text-[#727B75]">
              Loading patient profile...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile?.patient) {
    return (
      <Layout>
        <div className="p-4 sm:p-6">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#587363] transition-colors hover:text-[#173B32]"
          >
            <FiArrowLeft size={16} />
            {backLabel}
          </button>

          <div className="mt-8 rounded-2xl border border-[#F0D9D7] bg-[#FFFDFB] p-8 text-center">
            <p className="text-sm text-[#A34E4A]">
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
      <div className="min-h-full bg-[#F7F3E9] p-4 sm:p-6 lg:p-7">
        <div className="mx-auto max-w-375 space-y-5">
          {/* Back */}

          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#587363] transition-colors hover:text-[#173B32]"
          >
            <FiArrowLeft size={16} />
            {backLabel}
          </button>

          {/* Patient Header */}

          <div className="relative overflow-hidden rounded-2xl bg-[#173B32] shadow-[0_8px_28px_rgba(23,59,50,0.12)]">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-16 -translate-y-16 rounded-full border border-white/10" />

            <div className="absolute bottom-0 right-20 h-28 w-28 translate-y-16 rounded-full border border-[#B4935A]/20" />

            <div className="relative p-5 sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-semibold text-[#F7F3E9] backdrop-blur-sm sm:h-20 sm:w-20 sm:text-2xl">
                    {patientName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#BDA978]">
                      Patient Profile
                    </p>

                    <h1 className="truncate text-xl font-semibold tracking-[-0.01em] text-white sm:text-2xl">
                      {patientName}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-2.5">
                      {patient?.mrn && (
                        <span className="text-xs text-[#D7E0DA]">
                          MRN: {patient.mrn}
                        </span>
                      )}

                      {patient?.mrn && (
                        <span className="h-1 w-1 rounded-full bg-[#9CAF9F]" />
                      )}

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          patient?.is_active === false
                            ? "bg-red-100 text-red-700"
                            : "bg-[#DCEBDD] text-[#315B3D]"
                        }`}
                      >
                        {patient?.is_active === false
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="h-px w-16 bg-[#B4935A]" />
                </div>
              </div>
            </div>

            <div className="h-0.75 bg-[#B4935A]" />
          </div>

          {/* Quick Stats */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              gold={outstanding > 0}
            />
          </div>

          {/* Basic Information */}

          <Section
            title="Basic Information"
            icon={<FiUser size={17} />}
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  patient?.date_of_birth ||
                    patient?.dob
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <div className="overflow-x-auto rounded-xl border border-[#E8ECE6]">
                <table className="w-full min-w-180">
                  <thead>
                    <tr className="bg-[#F6F8F5]">
                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Time
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Reason
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EEF0EC]">
                    {appointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="transition-colors hover:bg-[#FBFCFA]"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-[#263C32]">
                          {formatDate(
                            appointment?.appointment_date ||
                              appointment?.date
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm text-[#68736C]">
                          {extractTime(
                            appointment?.appointment_time ||
                              appointment?.time
                          )}
                        </td>

                        <td className="max-w-75 px-4 py-4 text-sm text-[#68736C]">
                          <div className="truncate">
                            {appointment?.reason ||
                              appointment?.purpose ||
                              appointment?.notes ||
                              "—"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge
                            status={appointment?.status}
                          />
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
              <div className="space-y-3">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="relative rounded-xl border border-[#E6EAE5] bg-[#FCFDFB] p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF1EC] text-[#587363]">
                            <FiFileText size={15} />
                          </div>

                          <div className="min-w-0">
                            <p className="wrap-break-words text-sm font-semibold text-[#173B32]">
                              {visit?.diagnosis ||
                                "Treatment / Visit"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#7A837D]">
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
                        </div>
                      </div>

                      <div className="border-t border-[#EEF0EC] pt-3 md:border-t-0 md:pt-0 md:text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A908B]">
                          Charges
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#173B32]">
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
                      <div className="mt-4 border-t border-[#E8ECE6] pt-4">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A908B]">
                          Notes
                        </p>

                        <p className="wrap-break-words text-sm leading-6 text-[#526059]">
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
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
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
              <div className="overflow-x-auto rounded-xl border border-[#E8ECE6]">
                <table className="w-full min-w-212.5">
                  <thead>
                    <tr className="bg-[#F6F8F5]">
                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Method
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Visit
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78817B]">
                        Notes
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EEF0EC]">
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="transition-colors hover:bg-[#FBFCFA]"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-[#263C32]">
                          {formatDate(
                            payment?.payment_date ||
                              payment?.date
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-[#173B32]">
                          {formatCurrency(payment?.amount)}
                        </td>

                        <td className="px-4 py-4 text-sm capitalize text-[#68736C]">
                          {payment?.payment_method || "—"}
                        </td>

                        <td className="px-4 py-4 text-sm text-[#68736C]">
                          {payment?.visit_id || "—"}
                        </td>

                        <td className="max-w-65 px-4 py-4 text-sm text-[#68736C]">
                          <div className="truncate">
                            {payment?.notes || "—"}
                          </div>
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
      </div>
    </Layout>
  );
}
