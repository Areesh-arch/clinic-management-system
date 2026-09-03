import { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";

import Layout from "../../components/layout/Layout";

import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
} from "../../services/tenantService";


function Tenants() {
  const [tenants, setTenants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  const [form, setForm] = useState({
    business_name: "",
    subdomain: "",
    owner_name: "",
    owner_email: "",
    owner_password: "",
  });


  /* ============================================================
     LOAD TENANTS
     ============================================================ */

  const loadTenants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTenants();

      const tenantList = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setTenants(tenantList);
    } catch (err) {
      console.error("Failed to load tenants:", err);

      setError(
        err.message || "Failed to load clinics."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTenants();
  }, []);


  /* ============================================================
     FORM HANDLING
     ============================================================ */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const resetForm = () => {
    setForm({
      business_name: "",
      subdomain: "",
      owner_name: "",
      owner_email: "",
      owner_password: "",
    });

    setEditingTenant(null);
  };


  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setModalOpen(true);
  };


  const openEditModal = (tenant) => {
    setEditingTenant(tenant);

    setForm({
      business_name: tenant.business_name || "",
      subdomain: tenant.subdomain || "",
      owner_name: "",
      owner_email: "",
      owner_password: "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };


  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    resetForm();
  };


  /* ============================================================
     CREATE / UPDATE
     ============================================================ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingTenant) {
        await updateTenant(
          editingTenant.id,
          {
            business_name: form.business_name,
            subdomain: form.subdomain,
          }
        );

        setSuccess(
          "Clinic information updated successfully."
        );
      } else {
        await createTenant({
          business_name: form.business_name,
          subdomain: form.subdomain,
          owner_name: form.owner_name,
          owner_email: form.owner_email,
          owner_password: form.owner_password,
        });

        setSuccess(
          "Clinic created successfully."
        );
      }

      setModalOpen(false);
      resetForm();

      await loadTenants();
    } catch (err) {
      console.error(
        "Tenant operation failed:",
        err
      );

      setError(
        err.message ||
          "Unable to save clinic."
      );
    } finally {
      setSaving(false);
    }
  };


  /* ============================================================
     DELETE
     ============================================================ */

  const handleDelete = async (tenant) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tenant.business_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteTenant(tenant.id);

      setSuccess(
        "Clinic deleted successfully."
      );

      await loadTenants();
    } catch (err) {
      console.error(
        "Failed to delete tenant:",
        err
      );

      setError(
        err.message ||
          "Unable to delete clinic."
      );
    }
  };


  /* ============================================================
     STATISTICS
     ============================================================ */

  const totalClinics = tenants.length;

  const activeClinics = useMemo(
    () =>
      tenants.filter(
        (tenant) =>
          String(tenant.status).toLowerCase() ===
          "active"
      ).length,
    [tenants]
  );

  const inactiveClinics =
    totalClinics - activeClinics;


  return (
    <Layout>

      <div className="space-y-8">


        {/* ======================================================
            HEADER
        ====================================================== */}

        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-xs font-bold tracking-[0.2em] text-[#9B8246]">
              PLATFORM ADMINISTRATION
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#234D3C]">
              Tenant Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[#647267]">
              Create and manage the clinics registered
              on your DermaCare SaaS platform.
            </p>

          </div>


          <div className="flex gap-3">

            <button
              type="button"
              onClick={loadTenants}
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#D8D2C5]
                bg-white
                px-4
                py-3
                text-sm
                font-semibold
                text-[#45524A]
                transition
                hover:bg-[#F5F1E7]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <FiRefreshCw
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>


            <button
              type="button"
              onClick={openCreateModal}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#315D4B]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#234D3C]
              "
            >
              <FiPlus />

              Create Clinic
            </button>

          </div>

        </section>


        {/* ======================================================
            SUCCESS
        ====================================================== */}

        {success && (

          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">

            <FiCheckCircle />

            <span>{success}</span>

          </div>

        )}


        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && !modalOpen && (

          <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

            <div className="flex items-start gap-3">

              <FiXCircle className="mt-0.5 text-red-600" />

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadTenants}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Try Again
            </button>

          </div>

        )}


        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


          <StatCard
            icon={<FiBriefcase />}
            label="Total Clinics"
            value={loading ? "..." : totalClinics}
          />


          <StatCard
            icon={<FiCheckCircle />}
            label="Active Clinics"
            value={loading ? "..." : activeClinics}
          />


          <StatCard
            icon={<FiClock />}
            label="Inactive Clinics"
            value={loading ? "..." : inactiveClinics}
          />


        </div>


        {/* ======================================================
            TENANT TABLE
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-[#E6E1D8] bg-white shadow-sm">


          <div className="border-b border-[#E6E1D8] px-6 py-5">

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-semibold text-[#234D3C]">
                  Registered Clinics
                </h2>

                <p className="text-sm text-[#647267]">
                  All clinics currently registered
                  on the platform.
                </p>

              </div>

              <span className="text-xs font-semibold tracking-wide text-[#9B8246]">
                {totalClinics} CLINIC
                {totalClinics === 1 ? "" : "S"}
              </span>

            </div>

          </div>


          {loading ? (

            <div className="flex min-h-62.5 items-center justify-center">

              <div className="text-center">

                <FiRefreshCw className="mx-auto animate-spin text-2xl text-[#7A9E7E]" />

                <p className="mt-3 text-sm text-[#647267]">
                  Loading clinics...
                </p>

              </div>

            </div>

          ) : tenants.length === 0 ? (

            <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF3EB] text-2xl text-[#315D4B]">

                <FiBriefcase />

              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#234D3C]">
                No clinics yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-[#647267]">
                Create your first clinic to start
                managing tenants on the platform.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#315D4B]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#234D3C]
                "
              >
                <FiPlus />
                Create First Clinic
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-187.5">

                <thead>

                  <tr className="border-b border-[#E6E1D8] bg-[#FCFBF8]">

                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wide text-[#647267]">
                      CLINIC
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wide text-[#647267]">
                      SUBDOMAIN
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wide text-[#647267]">
                      STATUS
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wide text-[#647267]">
                      ACTIONS
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {tenants.map((tenant) => (

                    <tr
                      key={tenant.id}
                      className="border-b border-[#EEEAE2] last:border-b-0 hover:bg-[#FCFBF8] transition"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF3EB] text-[#315D4B]">

                            <FiBriefcase />

                          </div>

                          <div>

                            <p className="font-semibold text-[#234D3C]">
                              {tenant.business_name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#9B8246]">
                              Tenant #{tenant.id}
                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="px-6 py-5">

                        <span className="rounded-lg bg-[#F5F1E7] px-3 py-2 text-sm font-medium text-[#45524A]">
                          {tenant.subdomain}
                        </span>

                      </td>


                      <td className="px-6 py-5">

                        <StatusBadge
                          status={tenant.status}
                        />

                      </td>


                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(tenant)
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-[#D8D2C5]
                              px-3
                              py-2
                              text-sm
                              font-medium
                              text-[#45524A]
                              hover:bg-[#F5F1E7]
                              transition
                            "
                          >
                            <FiEdit3 />
                            Edit
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(tenant)
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-red-200
                              px-3
                              py-2
                              text-sm
                              font-medium
                              text-red-600
                              hover:bg-red-50
                              transition
                            "
                            aria-label={`Delete ${tenant.business_name}`}
                          >
                            <FiTrash2 />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>


      {/* ========================================================
          CREATE / EDIT MODAL
      ======================================================== */}

      {modalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#E6E1D8] px-6 py-5">

              <div>

                <p className="text-xs font-bold tracking-[0.18em] text-[#9B8246]">
                  {editingTenant
                    ? "CLINIC SETTINGS"
                    : "NEW CLINIC"}
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-[#234D3C]">
                  {editingTenant
                    ? "Edit Clinic"
                    : "Create Clinic"}
                </h2>

                <p className="mt-1 text-sm text-[#647267]">
                  {editingTenant
                    ? "Update clinic information."
                    : "Register a new clinic and create its owner account."}
                </p>

              </div>


              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#647267] hover:bg-[#F3F5F1] transition"
                aria-label="Close"
              >
                <span className="text-2xl">
                  ×
                </span>
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] overflow-y-auto"
            >

              <div className="space-y-6 px-6 py-6">


                {/* CLINIC INFORMATION */}

                <div>

                  <h3 className="text-sm font-bold tracking-wide text-[#234D3C]">
                    CLINIC INFORMATION
                  </h3>

                  <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

                    <FormField
                      label="Business Name"
                      name="business_name"
                      value={form.business_name}
                      onChange={handleChange}
                      placeholder="e.g. DermaCare Lahore"
                      required
                    />

                    <FormField
                      label="Subdomain"
                      name="subdomain"
                      value={form.subdomain}
                      onChange={handleChange}
                      placeholder="e.g. dermacare-lahore"
                      required
                    />

                  </div>

                </div>


                {/* OWNER INFORMATION */}

                {!editingTenant && (

                  <div className="border-t border-[#E6E1D8] pt-6">

                    <h3 className="text-sm font-bold tracking-wide text-[#234D3C]">
                      CLINIC OWNER
                    </h3>

                    <p className="mt-1 text-xs text-[#647267]">
                      This account will be created as the
                      clinic owner.
                    </p>


                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

                      <FormField
                        label="Owner Name"
                        name="owner_name"
                        value={form.owner_name}
                        onChange={handleChange}
                        placeholder="Dr. Ahmed"
                        required
                      />

                      <FormField
                        label="Owner Email"
                        name="owner_email"
                        type="email"
                        value={form.owner_email}
                        onChange={handleChange}
                        placeholder="doctor@example.com"
                        required
                      />

                      <div className="md:col-span-2">

                        <FormField
                          label="Owner Password"
                          name="owner_password"
                          type="password"
                          value={form.owner_password}
                          onChange={handleChange}
                          placeholder="Create a secure password"
                          required
                        />

                      </div>

                    </div>

                  </div>

                )}


                {/* ERROR INSIDE MODAL */}

                {error && (

                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>

                )}

              </div>


              {/* FOOTER */}

              <div className="flex items-center justify-end gap-3 border-t border-[#E6E1D8] bg-[#FCFBF8] px-6 py-4">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    rounded-xl
                    border
                    border-[#D8D2C5]
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#45524A]
                    hover:bg-[#F5F1E7]
                    transition
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#315D4B]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-[#234D3C]
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving && (
                    <FiRefreshCw className="animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingTenant
                    ? "Save Changes"
                    : "Create Clinic"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </Layout>
  );
}


/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#E6E1D8] bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-[#647267]">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#234D3C]">
            {value}
          </p>

        </div>


        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EB] text-xl text-[#315D4B]">
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FORM FIELD
   ============================================================ */

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="block text-sm font-medium text-[#45524A]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          mt-2
          w-full
          rounded-xl
          border
          border-[#D8D2C5]
          bg-white
          px-4
          py-3
          text-sm
          text-[#234D3C]
          outline-none
          transition
          placeholder:text-[#A0A59F]
          focus:border-[#7A9E7E]
          focus:ring-2
          focus:ring-[#DDE6D8]
        "
      />

    </div>
  );
}


/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({ status }) {
  const normalized =
    String(status || "").toLowerCase();

  const isActive =
    normalized === "active";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3
        py-1.5
        text-xs
        font-bold
        ${
          isActive
            ? "bg-[#E8F1E6] text-[#315D4B]"
            : "bg-[#F1EFEB] text-[#7A756B]"
        }
      `}
    >

      <span
        className={`
          h-2
          w-2
          rounded-full
          ${
            isActive
              ? "bg-[#7A9E7E]"
              : "bg-[#A5A097]"
          }
        `}
      />

      {status || "Unknown"}

    </span>
  );
}


export default Tenants;