
import { useEffect, useState } from "react";

import "../../styles/crm.css";

import Layout from "../../components/layout/Layout";

import {
  getLeads,
  getLeadStats,
  createLead,
  updateLead,
  deleteLead,
} from "../../services/leadService";

// =========================================================
// STATUS CONFIGURATION
// =========================================================

const statuses = [
  "New",
  "Contacted",
  "Converted",
  "Lost",
];

// Convert UI status -> backend status
const toBackendStatus = (status) => {
  return (status || "New").toLowerCase();
};

// Convert backend status -> UI status
const toDisplayStatus = (status) => {
  const normalized = (status || "new").toLowerCase();

  switch (normalized) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "converted":
      return "Converted";
    case "lost":
      return "Lost";
    default:
      return "New";
  }
};

// =========================================================
// EMPTY FORM
// =========================================================

const emptyLeadForm = {
  full_name: "",
  phone: "",
  email: "",
  message: "",
  source: "Website",
  status: "New",
};

// =========================================================
// CRM COMPONENT
// =========================================================

function CRM() {
  // =======================================================
  // LEADS
  // =======================================================

  const [leads, setLeads] = useState([]);

  // =======================================================
  // FILTERS
  // =======================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =======================================================
  // VIEW MODAL
  // =======================================================

  const [selectedLead, setSelectedLead] = useState(null);

  // =======================================================
  // ADD / EDIT MODAL
  // =======================================================

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);

  // =======================================================
  // DELETE CONFIRMATION
  // =======================================================

  const [deletingLead, setDeletingLead] = useState(null);

  // =======================================================
  // STATISTICS
  // =======================================================

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    lost: 0,
  });

  // =======================================================
  // UI STATES
  // =======================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // =======================================================
  // LOAD LEADS
  // =======================================================

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLeads();

      const normalizedLeads = (data || []).map((lead) => ({
        ...lead,
        displayStatus: toDisplayStatus(lead.status),
      }));

      setLeads(normalizedLeads);

      console.log("CRM leads received:", normalizedLeads);
    } catch (error) {
      console.error("Failed to load CRM leads:", error);

      setError(
        error.message || "Failed to load CRM leads."
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // LOAD STATISTICS
  // =======================================================

  const loadStats = async () => {
    try {
      const data = await getLeadStats();

      setStats({
        total: data?.total ?? 0,
        new: data?.new ?? 0,
        contacted: data?.contacted ?? 0,
        converted: data?.converted ?? 0,
        lost: data?.lost ?? 0,
      });
    } catch (error) {
      console.error(
        "Failed to load CRM statistics:",
        error
      );
    }
  };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadLeads();
    loadStats();
  }, []);

  // =======================================================
  // FILTER LEADS
  // =======================================================

  const filteredLeads = leads.filter((lead) => {
    const searchText = search.trim().toLowerCase();

    const leadName = (
      lead.full_name || ""
    ).toLowerCase();

    const leadPhone = (
      lead.phone || ""
    ).toLowerCase();

    const leadEmail = (
      lead.email || ""
    ).toLowerCase();

    const leadSource = (
      lead.source || ""
    ).toLowerCase();

    const leadMessage = (
      lead.message || ""
    ).toLowerCase();

    const displayStatus = toDisplayStatus(
      lead.status
    );

    const matchesSearch =
      leadName.includes(searchText) ||
      leadPhone.includes(searchText) ||
      leadEmail.includes(searchText) ||
      leadSource.includes(searchText) ||
      leadMessage.includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      displayStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =======================================================
  // OPEN ADD MODAL
  // =======================================================

  const openAddLeadModal = () => {
    setEditingLead(null);
    setLeadForm({ ...emptyLeadForm });
    setError("");
    setShowLeadModal(true);
  };

  // =======================================================
  // OPEN EDIT MODAL
  // =======================================================

  const openEditLeadModal = (lead) => {
    setEditingLead(lead);

    setLeadForm({
      full_name: lead.full_name || "",
      phone: lead.phone || "",
      email: lead.email || "",
      message: lead.message || "",
      source: lead.source || "Website",
      status: toDisplayStatus(lead.status),
    });

    setError("");
    setShowLeadModal(true);
  };

  // =======================================================
  // CLOSE ADD / EDIT MODAL
  // =======================================================

  const closeLeadModal = () => {
    if (saving) {
      return;
    }

    setShowLeadModal(false);
    setEditingLead(null);
    setLeadForm({ ...emptyLeadForm });
    setError("");
  };

  // =======================================================
  // FORM CHANGE
  // =======================================================

  const handleLeadFormChange = (event) => {
    const { name, value } = event.target;

    setLeadForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =======================================================
  // CREATE / UPDATE LEAD
  // =======================================================

  const handleLeadSubmit = async (event) => {
    event.preventDefault();

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!leadForm.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!leadForm.phone.trim()) {
      setError("Contact number is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ---------------------------------------------
      // PAYLOAD
      // ---------------------------------------------

      const payload = {
        full_name: leadForm.full_name.trim(),
        phone: leadForm.phone.trim(),
        email: leadForm.email.trim() || null,
        message: leadForm.message.trim() || null,
        source: leadForm.source.trim(),
        status: toBackendStatus(
          leadForm.status
        ),
      };

      // =================================================
      // UPDATE EXISTING LEAD
      // =================================================

      if (editingLead) {
        const updatedLead = await updateLead(
          editingLead.id,
          payload
        );

        const normalizedLead = {
          ...updatedLead,
          displayStatus: toDisplayStatus(
            updatedLead.status
          ),
        };

        setLeads((previous) =>
          previous.map((lead) =>
            lead.id === editingLead.id
              ? normalizedLead
              : lead
          )
        );

        // Update currently opened view
        setSelectedLead((previous) =>
          previous &&
          previous.id === editingLead.id
            ? normalizedLead
            : previous
        );

        console.log(
          "Lead updated:",
          normalizedLead
        );
      }

      // =================================================
      // CREATE NEW LEAD
      // =================================================

      else {
        const createdLead = await createLead(
          payload
        );

        const normalizedLead = {
          ...createdLead,
          displayStatus: toDisplayStatus(
            createdLead.status
          ),
        };

        setLeads((previous) => [
          normalizedLead,
          ...previous,
        ]);

        console.log(
          "Lead created:",
          normalizedLead
        );
      }

      // =================================================
      // REFRESH STATS
      // =================================================

      await loadStats();

      // =================================================
      // CLOSE MODAL
      // =================================================

      setShowLeadModal(false);
      setEditingLead(null);
      setLeadForm({ ...emptyLeadForm });
    } catch (error) {
      console.error(
        editingLead
          ? "Failed to update lead:"
          : "Failed to create lead:",
        error
      );

      setError(
        error.message ||
          (editingLead
            ? "Failed to update lead."
            : "Failed to create lead.")
      );
    } finally {
      setSaving(false);
    }
  };

  // =======================================================
  // UPDATE STATUS
  // =======================================================

  const handleStatusChange = async (
    id,
    newStatus
  ) => {
    try {
      setError("");

      const payload = {
        status: toBackendStatus(
          newStatus
        ),
      };

      const updatedLead = await updateLead(
        id,
        payload
      );

      const normalizedLead = {
        ...updatedLead,
        displayStatus: toDisplayStatus(
          updatedLead.status
        ),
      };

      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === id
            ? normalizedLead
            : lead
        )
      );

      setSelectedLead((previous) =>
        previous && previous.id === id
          ? normalizedLead
          : previous
      );

      await loadStats();
    } catch (error) {
      console.error(
        "Failed to update lead status:",
        error
      );

      setError(
        error.message ||
          "Failed to update lead status."
      );
    }
  };

  // =======================================================
  // OPEN DELETE CONFIRMATION
  // =======================================================

  const openDeleteConfirmation = (lead) => {
    setError("");
    setDeletingLead(lead);
  };

  // =======================================================
  // CLOSE DELETE CONFIRMATION
  // =======================================================

  const closeDeleteConfirmation = () => {
    if (deleting) {
      return;
    }

    setDeletingLead(null);
  };

  // =======================================================
  // DELETE LEAD
  // =======================================================

  const handleDeleteLead = async () => {
    if (!deletingLead) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteLead(
        deletingLead.id
      );

      // Remove from table
      setLeads((previous) =>
        previous.filter(
          (lead) =>
            lead.id !== deletingLead.id
        )
      );

      // Close view modal if same lead
      setSelectedLead((previous) =>
        previous &&
        previous.id === deletingLead.id
          ? null
          : previous
      );

      // Refresh statistics
      await loadStats();

      console.log(
        "Lead deleted:",
        deletingLead.id
      );

      setDeletingLead(null);
    } catch (error) {
      console.error(
        "Failed to delete lead:",
        error
      );

      setError(
        error.message ||
          "Failed to delete lead."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =======================================================
  // FORMAT DATE
  // =======================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Layout>
      <div className="crm-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="crm-header">
          <div>
            <h1>CRM</h1>

            <p>
              Manage enquiries and follow
              up with potential clinic
              customers.
            </p>
          </div>

          <button
            type="button"
            className="crm-add-button"
            onClick={openAddLeadModal}
          >
            + Add Lead
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="crm-error">
            {error}
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="crm-stats">

          <div className="crm-stat-card">
            <span>
              Total Leads
            </span>

            <strong>
              {stats.total}
            </strong>

            <small>
              All enquiries
            </small>
          </div>

          <div className="crm-stat-card">
            <span>
              New
            </span>

            <strong>
              {stats.new}
            </strong>

            <small>
              Need follow-up
            </small>
          </div>

          <div className="crm-stat-card">
            <span>
              Contacted
            </span>

            <strong>
              {stats.contacted}
            </strong>

            <small>
              In conversation
            </small>
          </div>

          <div className="crm-stat-card">
            <span>
              Converted
            </span>

            <strong>
              {stats.converted}
            </strong>

            <small>
              Successful leads
            </small>
          </div>

        </div>

        {/* =================================================
            LEADS SECTION
        ================================================= */}

        <section className="crm-section">

          <div className="crm-section-header">

            <div>
              <h2>
                Leads
              </h2>

              <p>
                People who contacted the
                clinic through the website.
              </p>
            </div>

            <div className="crm-controls">

              <div className="crm-search">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All statuses
                </option>

                {statuses.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="crm-table-wrapper">

            <table className="crm-table">

              <thead>
                <tr>
                  <th>
                    Lead
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Source
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Added
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="crm-empty-cell"
                    >
                      <div className="crm-empty">
                        <h3>
                          Loading leads...
                        </h3>
                      </div>
                    </td>
                  </tr>

                ) : filteredLeads.length > 0 ? (

                  filteredLeads.map(
                    (lead) => {

                      const displayStatus =
                        toDisplayStatus(
                          lead.status
                        );

                      return (
                        <tr
                          key={lead.id}
                        >

                          {/* LEAD */}

                          <td>
                            <div className="crm-lead">

                              <div className="crm-avatar">
                                {(
                                  lead.full_name ||
                                  "?"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {
                                    lead.full_name
                                  }
                                </strong>

                                <small>
                                  Lead #
                                  {
                                    lead.id
                                  }
                                </small>
                              </div>

                            </div>
                          </td>

                          {/* PHONE */}

                          <td>
                            {
                              lead.phone ||
                              "-"
                            }
                          </td>

                          {/* SOURCE */}

                          <td>
                            <span className="crm-source">
                              {
                                lead.source ||
                                "-"
                              }
                            </span>
                          </td>

                          {/* STATUS */}

                          <td>

                            <select
                              className={
                              "crm-status crm-status-" +
                              displayStatus.toLowerCase()
                        }
                              value={
                                displayStatus
                              }
                              onChange={(event) =>
                                handleStatusChange(
                                  lead.id,
                                  event.target.value
                                )
                              }
                            >
                              {statuses.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                )
                              )}
                            </select>

                          </td>

                          {/* DATE */}

                          <td>
                            {formatDate(
                              lead.created_at
                            )}
                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="crm-actions">

                              {/* VIEW */}

                              <button
                                type="button"
                                className="crm-view-button"
                                onClick={() =>
                                  setSelectedLead(
                                    lead
                                  )
                                }
                              >
                                View
                              </button>

                              {/* EDIT */}

                              <button
                                type="button"
                                className="crm-edit-button"
                                onClick={() =>
                                  openEditLeadModal(
                                    lead
                                  )
                                }
                              >
                                Edit
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                className="crm-delete-button"
                                onClick={() =>
                                  openDeleteConfirmation(
                                    lead
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )

                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      className="crm-empty-cell"
                    >
                      <div className="crm-empty">

                        <h3>
                          No leads found
                        </h3>

                        <p>
                          Try changing your
                          search or filter.
                        </p>

                      </div>
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* =================================================
            ADD / EDIT LEAD MODAL
        ================================================= */}

        {showLeadModal && (

          <div
            className="crm-modal-overlay"
            onClick={closeLeadModal}
          >

            <div
              className="crm-modal crm-lead-form-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="crm-modal-header">

                <div>
                  <span>
                    CRM
                  </span>

                  <h2>
                    {editingLead
                      ? "Edit Lead"
                      : "Add New Lead"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="crm-close-button"
                  onClick={closeLeadModal}
                  disabled={saving}
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleLeadSubmit
                }
              >

                <div className="crm-form-scroll">

                  <div className="crm-form">

                    {/* FULL NAME */}

                    <div className="crm-form-group">

                      <label htmlFor="lead-full-name">
                        Full Name *
                      </label>

                      <input
                        id="lead-full-name"
                        type="text"
                        name="full_name"
                        value={
                          leadForm.full_name
                        }
                        onChange={
                          handleLeadFormChange
                        }
                        placeholder="Enter full name"
                        required
                      />

                    </div>

                    {/* CONTACT NUMBER */}

                    <div className="crm-form-group">

                      <label htmlFor="lead-phone">
                        Contact Number *
                      </label>

                      <input
                        id="lead-phone"
                        type="tel"
                        name="phone"
                        value={
                          leadForm.phone
                        }
                        onChange={
                          handleLeadFormChange
                        }
                        placeholder="0300-1234567"
                        required
                      />

                    </div>

                    {/* EMAIL */}

                    <div className="crm-form-group">

                      <label htmlFor="lead-email">
                        Email
                      </label>

                      <input
                        id="lead-email"
                        type="email"
                        name="email"
                        value={
                          leadForm.email
                        }
                        onChange={
                          handleLeadFormChange
                        }
                        placeholder="patient@example.com"
                      />

                    </div>

                    {/* MESSAGE / REASON */}

                    <div className="crm-form-group">

                      <label htmlFor="lead-message">
                        Message / Reason
                      </label>

                      <textarea
                        id="lead-message"
                        name="message"
                        value={
                          leadForm.message
                        }
                        onChange={
                          handleLeadFormChange
                        }
                        placeholder="Tell us what you need help with..."
                        rows="4"
                      />

                    </div>

                    {/* SOURCE */}

                    <div className="crm-form-group">

                      <label htmlFor="lead-source">
                        Source
                      </label>

                      <select
                        id="lead-source"
                        name="source"
                        value={
                          leadForm.source
                        }
                        onChange={
                          handleLeadFormChange
                        }
                      >
                        <option value="Website">
                          Website
                        </option>

                        <option value="Contact Form">
                          Contact Form
                        </option>

                        <option value="Referral">
                          Referral
                        </option>

                        <option value="Phone">
                          Phone
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>

                    </div>

                    {/* STATUS */}

                    <div className="crm-form-group">

                      <label htmlFor="lead-status">
                        Status
                      </label>

                      <select
                        id="lead-status"
                        name="status"
                        value={
                          leadForm.status
                        }
                        onChange={
                          handleLeadFormChange
                        }
                      >
                        {statuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>

                    </div>

                  </div>

                </div>

                {/* MODAL ACTIONS */}

                <div className="crm-modal-actions">

                  <button
                    type="button"
                    className="crm-cancel-button"
                    onClick={closeLeadModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="crm-call-button"
                    disabled={saving}
                  >
                    {saving
                      ? editingLead
                        ? "Saving..."
                        : "Creating..."
                      : editingLead
                      ? "Save Changes"
                      : "Save Lead"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* =================================================
            VIEW LEAD MODAL
        ================================================= */}

        {selectedLead && (

          <div
            className="crm-modal-overlay"
            onClick={() =>
              setSelectedLead(null)
            }
          >

            <div
              className="crm-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="crm-modal-header">

                <div>
                  <span>
                    Lead Details
                  </span>

                  <h2>
                    {
                      selectedLead.full_name
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  className="crm-close-button"
                  onClick={() =>
                    setSelectedLead(null)
                  }
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

              <div className="crm-details">

                {/* NAME */}

                <div>
                  <label>
                    Full Name
                  </label>

                  <strong>
                    {
                      selectedLead.full_name
                    }
                  </strong>
                </div>

                {/* PHONE */}

                <div>
                  <label>
                    Contact Number
                  </label>

                  <strong>
                    {
                      selectedLead.phone ||
                      "-"
                    }
                  </strong>
                </div>

                {/* EMAIL */}

                <div>
                  <label>
                    Email
                  </label>

                  <strong>
                    {
                      selectedLead.email ||
                      "-"
                    }
                  </strong>
                </div>

                {/* SOURCE */}

                <div>
                  <label>
                    Source
                  </label>

                  <strong>
                    {
                      selectedLead.source ||
                      "-"
                    }
                  </strong>
                </div>

                {/* STATUS */}

                <div>
                  <label>
                    Status
                  </label>

                  <strong>
                    {toDisplayStatus(
                      selectedLead.status
                    )}
                  </strong>
                </div>

                {/* ADDED */}

                <div>
                  <label>
                    Added
                  </label>

                  <strong>
                    {formatDate(
                      selectedLead.created_at
                    )}
                  </strong>
                </div>

                {/* MESSAGE */}

                <div className="crm-detail-full">

                  <label>
                    Message / Reason
                  </label>

                  <strong className="crm-detail-message">
                    {
                      selectedLead.message ||
                      "-"
                    }
                  </strong>

                </div>

              </div>

              <div className="crm-modal-actions">

                <button
                  type="button"
                  className="crm-cancel-button"
                  onClick={() =>
                    setSelectedLead(null)
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="crm-edit-button"
                  onClick={() => {
                    const lead =
                      selectedLead;

                    setSelectedLead(null);

                    openEditLeadModal(
                      lead
                    );
                  }}
                >
                  Edit Lead
                </button>

                <a
                  href={`tel:${selectedLead.phone}`}
                  className="crm-call-button"
                >
                  Call Lead
                </a>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            DELETE CONFIRMATION MODAL
        ================================================= */}

        {deletingLead && (

          <div
            className="crm-modal-overlay"
            onClick={
              closeDeleteConfirmation
            }
          >

            <div
              className="crm-modal crm-delete-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="crm-modal-header">

                <div>
                  <span>
                    CRM
                  </span>

                  <h2>
                    Delete Lead
                  </h2>
                </div>

                <button
                  type="button"
                  className="crm-close-button"
                  onClick={
                    closeDeleteConfirmation
                  }
                  disabled={deleting}
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

              <div className="crm-delete-content">

                <p>
                  Are you sure you want
                  to delete this lead?
                </p>

                <strong>
                  {
                    deletingLead.full_name
                  }
                </strong>

                <small>
                  This action cannot be
                  undone.
                </small>

              </div>

              <div className="crm-modal-actions">

                <button
                  type="button"
                  className="crm-cancel-button"
                  onClick={
                    closeDeleteConfirmation
                  }
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="crm-delete-confirm-button"
                  onClick={
                    handleDeleteLead
                  }
                  disabled={deleting}
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Lead"}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </Layout>
  );
}

export default CRM;
