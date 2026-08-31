import { useState } from "react";
import "../../styles/crm.css";
import Layout from "../../components/layout/Layout";

const initialLeads = [
  {
    id: 1,
    name: "Ayesha Khan",
    phone: "0300-1234567",
    clinic: "Khan Dermatology",
    source: "Website",
    status: "New",
    note: "",
    createdAt: "25 Aug 2026",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    phone: "0312-7654321",
    clinic: "Glow Skin Clinic",
    source: "Website",
    status: "Contacted",
    note: "Called and scheduled a follow-up.",
    createdAt: "24 Aug 2026",
  },
  {
    id: 3,
    name: "Dr. Hamza Ali",
    phone: "0333-4567890",
    clinic: "Derma Plus",
    source: "Contact Form",
    status: "Converted",
    note: "Interested in the clinic management system.",
    createdAt: "22 Aug 2026",
  },
];

const statuses = ["New", "Contacted", "Converted", "Lost"];

function CRM() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter((lead) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      lead.name.toLowerCase().includes(searchText) ||
      lead.phone.toLowerCase().includes(searchText) ||
      lead.clinic.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    setLeads((previous) =>
      previous.map((lead) =>
        lead.id === id
          ? { ...lead, status: newStatus }
          : lead
      )
    );

    setSelectedLead((previous) =>
      previous && previous.id === id
        ? { ...previous, status: newStatus }
        : previous
    );
  };

  const updateNote = (id, note) => {
    setLeads((previous) =>
      previous.map((lead) =>
        lead.id === id
          ? { ...lead, note }
          : lead
      )
    );
  };

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  return (
    <Layout>
      <div className="crm-page">

        {/* ================= HEADER ================= */}

        <div className="crm-header">
          <div>
            <h1>CRM</h1>

            <p>
              Manage enquiries and follow up with potential clinic customers.
            </p>
          </div>

          <button className="crm-add-button">
            + Add Lead
          </button>
        </div>

        {/* ================= STATISTICS ================= */}

        <div className="crm-stats">

          <div className="crm-stat-card">
            <span>Total Leads</span>

            <strong>{totalLeads}</strong>

            <small>
              All enquiries
            </small>
          </div>

          <div className="crm-stat-card">
            <span>New</span>

            <strong>{newLeads}</strong>

            <small>
              Need follow-up
            </small>
          </div>

          <div className="crm-stat-card">
            <span>Contacted</span>

            <strong>{contactedLeads}</strong>

            <small>
              In conversation
            </small>
          </div>

          <div className="crm-stat-card">
            <span>Converted</span>

            <strong>{convertedLeads}</strong>

            <small>
              Successful leads
            </small>
          </div>

        </div>

        {/* ================= LEADS ================= */}

        <section className="crm-section">

          <div className="crm-section-header">

            <div>
              <h2>Leads</h2>

              <p>
                People who contacted the clinic through the website.
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
                    setSearch(event.target.value)
                  }
                />

              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">
                  All statuses
                </option>

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="crm-table-wrapper">

            <table className="crm-table">

              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Phone</th>
                  <th>Clinic</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {filteredLeads.length > 0 ? (

                  filteredLeads.map((lead) => (

                    <tr key={lead.id}>

                      {/* Lead */}

                      <td>

                        <div className="crm-lead">

                          <div className="crm-avatar">
                            {lead.name.charAt(0)}
                          </div>

                          <div>
                            <strong>
                              {lead.name}
                            </strong>

                            <small>
                              {lead.note || "No note added"}
                            </small>
                          </div>

                        </div>

                      </td>

                      {/* Phone */}

                      <td>
                        {lead.phone}
                      </td>

                      {/* Clinic */}

                      <td>
                        {lead.clinic}
                      </td>

                      {/* Source */}

                      <td>
                        <span className="crm-source">
                          {lead.source}
                        </span>
                      </td>

                      {/* Status */}

                      <td>

                        <select
                          className={`crm-status crm-status-${lead.status.toLowerCase()}`}
                          value={lead.status}
                          onChange={(event) =>
                            updateStatus(
                              lead.id,
                              event.target.value
                            )
                          }
                        >

                          {statuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}

                        </select>

                      </td>

                      {/* Date */}

                      <td>
                        {lead.createdAt}
                      </td>

                      {/* View */}

                      <td>

                        <button
                          type="button"
                          className="crm-view-button"
                          onClick={() =>
                            setSelectedLead(lead)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="crm-empty-cell"
                    >

                      <div className="crm-empty">

                        <h3>
                          No leads found
                        </h3>

                        <p>
                          Try changing your search or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ================= LEAD MODAL ================= */}

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
                    {selectedLead.name}
                  </h2>
                </div>

                <button
                  type="button"
                  className="crm-close-button"
                  onClick={() =>
                    setSelectedLead(null)
                  }
                >
                  ×
                </button>

              </div>

              <div className="crm-details">

                <div>
                  <label>
                    Phone
                  </label>

                  <strong>
                    {selectedLead.phone}
                  </strong>
                </div>

                <div>
                  <label>
                    Clinic
                  </label>

                  <strong>
                    {selectedLead.clinic}
                  </strong>
                </div>

                <div>
                  <label>
                    Source
                  </label>

                  <strong>
                    {selectedLead.source}
                  </strong>
                </div>

                <div>
                  <label>
                    Status
                  </label>

                  <strong>
                    {selectedLead.status}
                  </strong>
                </div>

              </div>

              <div className="crm-note">

                <label htmlFor="lead-note">
                  Internal Note
                </label>

                <textarea
                  id="lead-note"
                  value={selectedLead.note}
                  placeholder="Add a note about this lead..."
                  onChange={(event) => {

                    const note =
                      event.target.value;

                    setSelectedLead({
                      ...selectedLead,
                      note,
                    });

                    updateNote(
                      selectedLead.id,
                      note
                    );
                  }}
                />

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

      </div>
    </Layout>
  );
}

export default CRM;