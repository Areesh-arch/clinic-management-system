import { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiCreditCard,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiHeart,
  FiLock,
  FiMail,
  FiPlus,
  FiRefreshCw,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiX,
} from "react-icons/fi";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Layout from "../../components/layout/Layout";

import {
  createPatientPortalAccount,
  getPatientProfile,
  resetPatientPortalPassword,
  updatePatientPortalAccountStatus,
} from "../../services/patientService";

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

  const backPath = location.state?.from || "/patients";

  const backLabel =
    location.state?.from === "/appointments"
      ? "Back to Appointments"
      : "Back to Patients";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Patient portal form state
  const [portalEmail, setPortalEmail] = useState("");
  const [portalPassword, setPortalPassword] = useState("");
  const [portalConfirmPassword, setPortalConfirmPassword] = useState("");

  const [showPortalPassword, setShowPortalPassword] = useState(false);
  const [showPortalConfirmPassword, setShowPortalConfirmPassword] =
    useState(false);

  const [showPortalForm, setShowPortalForm] = useState(false);

  // Patient portal password reset state
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] =
    useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const [portalActionLoading, setPortalActionLoading] =
    useState(false);

  const [portalError, setPortalError] = useState("");
  const [portalSuccess, setPortalSuccess] = useState("");

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

  const refreshProfile = async () => {
    try {
      const data = await getPatientProfile(patientId);
      setProfile(data);
    } catch (err) {
      console.error("Failed to refresh patient profile:", err);
    }
  };

  const openPortalForm = () => {
    setPortalError("");
    setPortalSuccess("");

    setPortalEmail(profile?.patient?.email || "");
    setPortalPassword("");
    setPortalConfirmPassword("");

    setShowPortalPassword(false);
    setShowPortalConfirmPassword(false);

    setShowPortalForm(true);
  };

  const closePortalForm = () => {
    if (portalActionLoading) {
      return;
    }

    setShowPortalForm(false);
    setPortalError("");
    setPortalPassword("");
    setPortalConfirmPassword("");
    setShowPortalPassword(false);
    setShowPortalConfirmPassword(false);
  };

  const handleCreatePortalAccount = async (event) => {
    event.preventDefault();

    setPortalError("");
    setPortalSuccess("");

    const email = portalEmail.trim();

    if (!email) {
      setPortalError("Patient email is required.");
      return;
    }

    if (!portalPassword) {
      setPortalError("Temporary password is required.");
      return;
    }

    if (portalPassword.length < 8) {
      setPortalError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!portalConfirmPassword) {
      setPortalError("Please confirm the temporary password.");
      return;
    }

    if (portalPassword !== portalConfirmPassword) {
      setPortalError("Passwords do not match.");
      return;
    }

    try {
      setPortalActionLoading(true);

      await createPatientPortalAccount(patientId, {
        email,
        password: portalPassword,
      });

      setPortalEmail("");
      setPortalPassword("");
      setPortalConfirmPassword("");

      setShowPortalPassword(false);
      setShowPortalConfirmPassword(false);
      setShowPortalForm(false);

      setPortalSuccess(
        "Patient portal account created successfully. Give the patient the email and temporary password securely."
      );

      await refreshProfile();
    } catch (err) {
      console.error(
        "Failed to create patient portal account:",
        err
      );

      setPortalError(
        err.message ||
          "Failed to create patient portal account."
      );
    } finally {
      setPortalActionLoading(false);
    }
  };

  const openResetPasswordForm = () => {
    setPortalError("");
    setPortalSuccess("");

    setResetPassword("");
    setResetConfirmPassword("");
    setShowResetPassword(false);
    setShowResetConfirmPassword(false);
    setShowResetForm(true);
  };

  const closeResetPasswordForm = () => {
    if (portalActionLoading) {
      return;
    }

    setShowResetForm(false);
    setResetPassword("");
    setResetConfirmPassword("");
    setShowResetPassword(false);
    setShowResetConfirmPassword(false);
    setPortalError("");
  };

  const handleResetPortalPassword = async (event) => {
    event.preventDefault();

    setPortalError("");
    setPortalSuccess("");

    if (!resetPassword) {
      setPortalError("New password is required.");
      return;
    }

    if (resetPassword.length < 8) {
      setPortalError("Password must contain at least 8 characters.");
      return;
    }

    if (!resetConfirmPassword) {
      setPortalError("Please confirm the new password.");
      return;
    }

    if (resetPassword !== resetConfirmPassword) {
      setPortalError("Passwords do not match.");
      return;
    }

    try {
      setPortalActionLoading(true);

      await resetPatientPortalPassword(patientId, {
        password: resetPassword,
        confirm_password: resetConfirmPassword,
      });

      setResetPassword("");
      setResetConfirmPassword("");
      setShowResetPassword(false);
      setShowResetConfirmPassword(false);
      setShowResetForm(false);

      setPortalSuccess(
        "Patient portal password reset successfully. Provide the new password to the patient securely."
      );

      await refreshProfile();
    } catch (err) {
      console.error(
        "Failed to reset patient portal password:",
        err
      );

      setPortalError(
        err.message ||
          "Failed to reset patient portal password."
      );
    } finally {
      setPortalActionLoading(false);
    }
  };

  const handlePortalStatusChange = async (isActive) => {
    const action = isActive ? "reactivate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this patient's portal account?`
    );

    if (!confirmed) {
      return;
    }

    setPortalError("");
    setPortalSuccess("");

    try {
      setPortalActionLoading(true);

      await updatePatientPortalAccountStatus(
        patientId,
        isActive
      );

      setPortalSuccess(
        isActive
          ? "Patient portal account reactivated."
          : "Patient portal account deactivated."
      );

      await refreshProfile();
    } catch (err) {
      console.error(
        "Failed to update patient portal account:",
        err
      );

      setPortalError(
        err.message ||
          "Failed to update patient portal account."
      );
    } finally {
      setPortalActionLoading(false);
    }
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
    portalAccount = {
      exists: false,
      is_active: false,
    },
  } = profile;

  const patientName =
    `${patient?.first_name || ""} ${
      patient?.last_name || ""
    }`.trim() || "Patient";

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

  const portalExists = Boolean(portalAccount?.exists);

  const portalActive =
    portalExists && Boolean(portalAccount?.is_active);

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

          {/* Patient Portal */}
          <Section
            title="Patient Portal"
            icon={<FiLock size={17} />}
          >
            <div className="space-y-5">

              {/* Portal Status */}
              <div className="flex flex-col gap-4 rounded-xl border border-[#E5E9E4] bg-[#F8FAF7] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      !portalExists
                        ? "bg-[#EEF1EE] text-[#6D7771]"
                        : portalActive
                          ? "bg-[#E8F1EA] text-[#426A50]"
                          : "bg-[#FBEDEC] text-[#A34E4A]"
                    }`}
                  >
                    {!portalExists ? (
                      <FiLock size={18} />
                    ) : portalActive ? (
                      <FiUserCheck size={18} />
                    ) : (
                      <FiUserX size={18} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#173B32]">
                      Portal Status
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          !portalExists
                            ? "bg-[#EEF1EE] text-[#626C66]"
                            : portalActive
                              ? "bg-[#E8F1EA] text-[#426A50]"
                              : "bg-[#FBEDEC] text-[#A34E4A]"
                        }`}
                      >
                        {!portalExists
                          ? "Not Created"
                          : portalActive
                            ? "Active"
                            : "Inactive"}
                      </span>

                      {portalExists &&
                        portalAccount?.email && (
                          <span className="text-xs text-[#7B847E]">
                            {portalAccount.email}
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {!portalExists ? (
                    <button
                      type="button"
                      onClick={openPortalForm}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#173B32] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245447] sm:w-auto"
                    >
                      <FiPlus size={14} />
                      Create Portal Account
                    </button>
                  ) : portalActive ? (
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      <button
                        type="button"
                        disabled={portalActionLoading}
                        onClick={openResetPasswordForm}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D8DCD8] bg-white px-4 py-2.5 text-xs font-semibold text-[#173B32] transition-colors hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <FiLock size={14} />
                        Reset Password
                      </button>

                      <button
                        type="button"
                        disabled={portalActionLoading}
                        onClick={() =>
                          handlePortalStatusChange(false)
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D8DCD8] bg-white px-4 py-2.5 text-xs font-semibold text-[#6D514F] transition-colors hover:bg-[#FBF5F4] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <FiUserX size={14} />

                        {portalActionLoading
                          ? "Updating..."
                          : "Deactivate Portal"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      <button
                        type="button"
                        disabled={portalActionLoading}
                        onClick={openResetPasswordForm}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D8DCD8] bg-white px-4 py-2.5 text-xs font-semibold text-[#173B32] transition-colors hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <FiLock size={14} />
                        Reset Password
                      </button>

                      <button
                        type="button"
                        disabled={portalActionLoading}
                        onClick={() =>
                          handlePortalStatusChange(true)
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#173B32] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245447] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <FiRefreshCw size={14} />

                        {portalActionLoading
                          ? "Updating..."
                          : "Reactivate Portal"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Create Portal Account Form */}
              {showPortalForm && !portalExists && (
                <form
                  onSubmit={handleCreatePortalAccount}
                  className="rounded-xl border border-[#E3E8E2] bg-[#FFFDF8] p-4 sm:p-5"
                >
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-[#173B32]">
                      Create Patient Portal Account
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#7B847E]">
                      Create login credentials for this patient.
                      The password will be securely hashed and
                      cannot be viewed again after account creation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Email */}
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7C857F]">
                        Patient Email
                      </label>

                      <div className="relative">
                        <FiMail
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928C]"
                        />

                        <input
                          type="email"
                          value={portalEmail}
                          onChange={(event) =>
                            setPortalEmail(
                              event.target.value
                            )
                          }
                          placeholder="patient@example.com"
                          autoComplete="email"
                          disabled={portalActionLoading}
                          className="w-full rounded-lg border border-[#DDE3DD] bg-white py-2.5 pl-9 pr-3 text-sm text-[#273C33] outline-none transition focus:border-[#7B9887] focus:ring-2 focus:ring-[#DCE8E0] disabled:cursor-not-allowed disabled:bg-[#F4F6F3]"
                        />
                      </div>
                    </div>

                    {/* Temporary Password */}
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7C857F]">
                        Temporary Password
                      </label>

                      <div className="relative">
                        <FiLock
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928C]"
                        />

                        <input
                          type={
                            showPortalPassword
                              ? "text"
                              : "password"
                          }
                          value={portalPassword}
                          onChange={(event) =>
                            setPortalPassword(
                              event.target.value
                            )
                          }
                          placeholder="Minimum 8 characters"
                          minLength={8}
                          autoComplete="new-password"
                          disabled={portalActionLoading}
                          className="w-full rounded-lg border border-[#DDE3DD] bg-white py-2.5 pl-9 pr-10 text-sm text-[#273C33] outline-none transition focus:border-[#7B9887] focus:ring-2 focus:ring-[#DCE8E0] disabled:cursor-not-allowed disabled:bg-[#F4F6F3]"
                        />

                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() =>
                            setShowPortalPassword(
                              (current) => !current
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89928C] transition-colors hover:text-[#173B32]"
                          aria-label={
                            showPortalPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPortalPassword ? (
                            <FiEyeOff size={16} />
                          ) : (
                            <FiEye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7C857F]">
                        Confirm Temporary Password
                      </label>

                      <div className="relative">
                        <FiLock
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928C]"
                        />

                        <input
                          type={
                            showPortalConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={portalConfirmPassword}
                          onChange={(event) =>
                            setPortalConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Re-enter the temporary password"
                          minLength={8}
                          autoComplete="new-password"
                          disabled={portalActionLoading}
                          className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm text-[#273C33] outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#F4F6F3] ${
                            portalConfirmPassword &&
                            portalPassword !==
                              portalConfirmPassword
                              ? "border-[#E2B9B5] focus:border-[#C87870] focus:ring-[#F7DEDB]"
                              : portalConfirmPassword &&
                                  portalPassword ===
                                    portalConfirmPassword
                                ? "border-[#BFD8C4] focus:border-[#6D9978] focus:ring-[#E2EFE1]"
                                : "border-[#DDE3DD] focus:border-[#7B9887] focus:ring-[#DCE8E0]"
                          }`}
                        />

                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() =>
                            setShowPortalConfirmPassword(
                              (current) => !current
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89928C] transition-colors hover:text-[#173B32]"
                          aria-label={
                            showPortalConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPortalConfirmPassword ? (
                            <FiEyeOff size={16} />
                          ) : (
                            <FiEye size={16} />
                          )}
                        </button>
                      </div>

                      {portalConfirmPassword &&
                        portalPassword ===
                          portalConfirmPassword && (
                          <p className="mt-1.5 text-[11px] font-medium text-[#426A50]">
                            Passwords match.
                          </p>
                        )}

                      {portalConfirmPassword &&
                        portalPassword !==
                          portalConfirmPassword && (
                          <p className="mt-1.5 text-[11px] font-medium text-[#A34E4A]">
                            Passwords do not match.
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Password note */}
                  <div className="mt-4 rounded-lg border border-[#E6E1D4] bg-[#FAF7EF] px-4 py-3">
                    <p className="text-xs leading-5 text-[#756B58]">
                      Keep this temporary password secure and
                      provide it to the patient privately. The
                      password cannot be retrieved from the system
                      after the account is created.
                    </p>
                  </div>

                  {/* Form errors */}
                  {portalError && (
                    <div className="mt-4 rounded-lg border border-[#F0D9D7] bg-[#FFF7F6] px-4 py-3">
                      <p className="text-xs leading-5 text-[#A34E4A]">
                        {portalError}
                      </p>
                    </div>
                  )}

                  {/* Form actions */}
                  <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={portalActionLoading}
                      onClick={closePortalForm}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDE3DD] bg-white px-4 py-2.5 text-xs font-semibold text-[#637069] transition-colors hover:bg-[#F8FAF7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiX size={14} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={portalActionLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173B32] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245447] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiCheckCircle size={14} />

                      {portalActionLoading
                        ? "Creating..."
                        : "Create Account"}
                    </button>
                  </div>
                </form>
              )}

              {/* Reset Portal Password Form */}
              {showResetForm && portalExists && (
                <form
                  onSubmit={handleResetPortalPassword}
                  className="rounded-xl border border-[#E3E8E2] bg-[#FFFDF8] p-4 sm:p-5"
                >
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-[#173B32]">
                      Reset Patient Portal Password
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#7B847E]">
                      Set a new password for this patient portal account.
                      The previous password will no longer work. The password
                      is securely hashed and cannot be viewed again.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* New Password */}
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7C857F]">
                        New Password
                      </label>

                      <div className="relative">
                        <FiLock
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928C]"
                        />

                        <input
                          type={
                            showResetPassword
                              ? "text"
                              : "password"
                          }
                          value={resetPassword}
                          onChange={(event) =>
                            setResetPassword(event.target.value)
                          }
                          placeholder="Minimum 8 characters"
                          minLength={8}
                          autoComplete="new-password"
                          disabled={portalActionLoading}
                          className="w-full rounded-lg border border-[#DDE3DD] bg-white py-2.5 pl-9 pr-10 text-sm text-[#273C33] outline-none transition focus:border-[#7B9887] focus:ring-2 focus:ring-[#DCE8E0] disabled:cursor-not-allowed disabled:bg-[#F4F6F3]"
                        />

                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() =>
                            setShowResetPassword(
                              (current) => !current
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89928C] transition-colors hover:text-[#173B32]"
                          aria-label={
                            showResetPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showResetPassword ? (
                            <FiEyeOff size={16} />
                          ) : (
                            <FiEye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7C857F]">
                        Confirm New Password
                      </label>

                      <div className="relative">
                        <FiLock
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928C]"
                        />

                        <input
                          type={
                            showResetConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={resetConfirmPassword}
                          onChange={(event) =>
                            setResetConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Re-enter the new password"
                          minLength={8}
                          autoComplete="new-password"
                          disabled={portalActionLoading}
                          className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm text-[#273C33] outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#F4F6F3] ${
                            resetConfirmPassword &&
                            resetPassword !== resetConfirmPassword
                              ? "border-[#E2B9B5] focus:border-[#C87870] focus:ring-[#F7DEDB]"
                              : resetConfirmPassword &&
                                  resetPassword ===
                                    resetConfirmPassword
                                ? "border-[#BFD8C4] focus:border-[#6D9978] focus:ring-[#E2EFE1]"
                                : "border-[#DDE3DD] focus:border-[#7B9887] focus:ring-[#DCE8E0]"
                          }`}
                        />

                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() =>
                            setShowResetConfirmPassword(
                              (current) => !current
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89928C] transition-colors hover:text-[#173B32]"
                          aria-label={
                            showResetConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showResetConfirmPassword ? (
                            <FiEyeOff size={16} />
                          ) : (
                            <FiEye size={16} />
                          )}
                        </button>
                      </div>

                      {resetConfirmPassword &&
                        resetPassword === resetConfirmPassword && (
                          <p className="mt-1.5 text-[11px] font-medium text-[#426A50]">
                            Passwords match.
                          </p>
                        )}

                      {resetConfirmPassword &&
                        resetPassword !== resetConfirmPassword && (
                          <p className="mt-1.5 text-[11px] font-medium text-[#A34E4A]">
                            Passwords do not match.
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-[#E6E1D4] bg-[#FAF7EF] px-4 py-3">
                    <p className="text-xs leading-5 text-[#756B58]">
                      Give the new password to the patient privately.
                      The system stores only a secure password hash and
                      cannot retrieve the password later.
                    </p>
                  </div>

                  {portalError && (
                    <div className="mt-4 rounded-lg border border-[#F0D9D7] bg-[#FFF7F6] px-4 py-3">
                      <p className="text-xs leading-5 text-[#A34E4A]">
                        {portalError}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={portalActionLoading}
                      onClick={closeResetPasswordForm}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDE3DD] bg-white px-4 py-2.5 text-xs font-semibold text-[#637069] transition-colors hover:bg-[#F8FAF7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiX size={14} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={portalActionLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173B32] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245447] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiCheckCircle size={14} />
                      {portalActionLoading
                        ? "Resetting..."
                        : "Reset Password"}
                    </button>
                  </div>
                </form>
              )}

              {/* Success message */}
              {portalSuccess && (
                <div className="flex items-start gap-3 rounded-xl border border-[#D7E7DA] bg-[#F3F9F4] px-4 py-3">
                  <FiCheckCircle
                    size={17}
                    className="mt-0.5 shrink-0 text-[#426A50]"
                  />

                  <p className="text-xs leading-5 text-[#426A50]">
                    {portalSuccess}
                  </p>
                </div>
              )}

              {/* Portal account details */}
              {portalExists && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoCard
                      label="Portal Email"
                      value={portalAccount?.email}
                    />

                    <InfoCard
                      label="Account Status"
                      value={
                        portalActive
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </div>

                  <div className="rounded-lg border border-[#E6E1D4] bg-[#FAF7EF] px-4 py-3">
                    <p className="text-xs leading-5 text-[#756B58]">
                      Portal passwords are never displayed in the patient
                      profile. Use <span className="font-semibold">Reset Password</span>
                      above whenever the patient needs a new password.
                    </p>
                  </div>
                </div>
              )}
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