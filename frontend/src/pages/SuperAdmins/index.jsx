import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import SuperAdminHeader from "../../components/superAdmins/SuperAdminHeader";
import SuperAdminStats from "../../components/superAdmins/SuperAdminStats";
import SuperAdminTable from "../../components/superAdmins/SuperAdminTable";
import SuperAdminModal from "../../components/superAdmins/SuperAdminModal";

import {
  createPlatformAdmin,
  deletePlatformAdmin,
  getPlatformAdmins,
  updatePlatformAdmin,
} from "../../services/platformService";


function SuperAdmins() {
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedAdmin, setSelectedAdmin] =
    useState(null);


  // ==========================================================
  // LOAD ADMINS
  // ==========================================================

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getPlatformAdmins();

      setAdmins(
        Array.isArray(response)
          ? response
          : response?.items ||
            response?.admins ||
            []
      );
    } catch (err) {
      console.error(
        "Failed to load Super Admins:",
        err
      );

      setError(
        err?.message ||
          "Failed to load Super Admins."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadAdmins();
  }, []);


  // ==========================================================
  // ADD
  // ==========================================================

  const handleAdd = () => {
    setSelectedAdmin(null);
    setError("");
    setModalOpen(true);
  };


  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setError("");
    setModalOpen(true);
  };


  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSave = async (data) => {
    try {
      setSaving(true);
      setError("");

      if (selectedAdmin) {
        await updatePlatformAdmin(
          selectedAdmin.id,
          data
        );
      } else {
        await createPlatformAdmin(data);
      }

      setModalOpen(false);
      setSelectedAdmin(null);

      await loadAdmins();
    } catch (err) {
      console.error(
        "Failed to save Super Admin:",
        err
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (admin) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${admin.full_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deletePlatformAdmin(
        admin.id
      );

      await loadAdmins();
    } catch (err) {
      console.error(
        "Failed to delete Super Admin:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete Super Admin."
      );
    }
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Layout>

      <div className="space-y-6">

        <SuperAdminHeader
          onAdd={handleAdd}
        />


        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}


        <SuperAdminStats
          admins={admins}
        />


        <SuperAdminTable
          admins={admins}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>


      <SuperAdminModal
        open={modalOpen}
        admin={selectedAdmin}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setSelectedAdmin(null);
          }
        }}
        onSave={handleSave}
        saving={saving}
      />

    </Layout>
  );
}


export default SuperAdmins;