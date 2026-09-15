import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";
import StaffHeader from "../../components/staff/StaffHeader";
import StaffStats from "../../components/staff/StaffStats";
import StaffSearch from "../../components/staff/StaffSearch";
import StaffFilters from "../../components/staff/StaffFilters";
import StaffTable from "../../components/staff/StaffTable";
import StaffModal from "../../components/staff/StaffModal";
import StaffForm from "../../components/staff/StaffForm";

import {
  getStaff,
  deleteStaff,
} from "../../services/staffService";

function Staff() {
  const [staff, setStaff] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD STAFF
  // =========================================================

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStaff();

      /*
       * IMPORTANT:
       * This number is ONLY a display number.
       *
       * We do NOT change:
       * - staff.id
       * - user.id
       * - tenant_id
       *
       * The API already returns staff for the currently
       * selected tenant, so numbering starts from 1 for
       * that tenant's staff list.
       */
      const staffWithDisplayNumber = (data || []).map(
        (member, index) => ({
          ...member,
          display_number: index + 1,
        })
      );

      setStaff(staffWithDisplayNumber);

    } catch (err) {
      console.error(
        "Failed to load staff:",
        err
      );

      setError(
        err.message ||
        "Failed to load staff."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // =========================================================
  // ADD
  // =========================================================

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setShowModal(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditStaff = (member) => {
    setSelectedStaff(member);
    setShowModal(true);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteStaff = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStaff(member.id);

      await loadStaff();

    } catch (err) {
      console.error(
        "Failed to delete staff:",
        err
      );

      setError(
        err.message ||
        "Failed to delete staff."
      );
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredStaff = staff.filter(
    (member) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        member.name
          ?.toLowerCase()
          .includes(searchText) ||

        member.email
          ?.toLowerCase()
          .includes(searchText) ||

        member.designation
          ?.toLowerCase()
          .includes(searchText) ||

        member.employee_code
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "All" ||
        (
          status === "Active" &&
          member.is_active
        ) ||
        (
          status === "Inactive" &&
          !member.is_active
        );

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Layout>

      <div className="space-y-8">

        <StaffHeader
          onAddStaff={handleAddStaff}
        />

        <StaffStats
          staff={staff}
        />

        <div className="flex flex-col lg:flex-row gap-4">

          <StaffSearch
            search={search}
            setSearch={setSearch}
          />

          <StaffFilters
            status={status}
            setStatus={setStatus}
          />

        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            Loading staff...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-700 rounded-2xl p-5">
            {error}

            <button
              onClick={loadStaff}
              className="ml-4 underline font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <StaffTable
            staff={filteredStaff}
            onEdit={handleEditStaff}
            onDelete={handleDeleteStaff}
          />
        )}

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <StaffModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedStaff(null);
          }}
        >

          <StaffForm
            staff={selectedStaff}
            onSuccess={() => {
              setShowModal(false);
              setSelectedStaff(null);
              loadStaff();
            }}
          />

        </StaffModal>
      )}

    </Layout>
  );
}

export default Staff;