import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";

import MedicineHeader from "../../components/inventory/MedicineHeader";
import MedicineStats from "../../components/inventory/MedicineStats";
import MedicineSearch from "../../components/inventory/MedicineSearch";
import MedicineFilters from "../../components/inventory/MedicineFilters";
import MedicineTable from "../../components/inventory/MedicineTable";
import MedicineModal from "../../components/inventory/MedicineModal";

import MedicineLogTable from "../../components/inventory/MedicineLogTable";
import MedicineLogModal from "../../components/inventory/MedicineLogModal";

import MedicineIssueSlip from "../../components/inventory/MedicineIssueSlip";
import MedicineEditModal from "../../components/inventory/MedicineEditModal";

import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../../services/inventoryService";

import { getMedicineLog } from "../../services/medicineLogService";

import {
  deletePrescriptionItem,
} from "../../services/prescriptionService";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("stock");

  const [medicines, setMedicines] = useState([]);
  const [medicineLog, setMedicineLog] = useState([]);

  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);

  const [error, setError] = useState("");
  const [logError, setLogError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState(null);
  const [showMedicineLogModal, setShowMedicineLogModal] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // =========================================================
  // DELETE CONFIRMATION
  // =========================================================

  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(false);

  const [logItemToDelete, setLogItemToDelete] = useState(null);
  const [deletingLogItem, setDeletingLogItem] = useState(false);

  // =========================================================
  // MEDICINE LOG ACTIONS
  // =========================================================

  const [selectedMedicineSlip, setSelectedMedicineSlip] =
    useState(null);

  const [editingMedicineLog, setEditingMedicineLog] =
    useState(null);

  // =========================================================
  // LOAD INVENTORY
  // =========================================================

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventory();

      setMedicines(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load inventory:",
        err
      );

      setError(
        err?.message ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD MEDICINE LOG
  // =========================================================

  const fetchMedicineLog = async () => {
    try {
      setLogLoading(true);
      setLogError("");

      const data =
        await getMedicineLog();

      setMedicineLog(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load medicine log:",
        err
      );

      setLogError(
        err?.message ||
          "Failed to load medicine log."
      );
    } finally {
      setLogLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchInventory();
  }, []);

  // =========================================================
  // LOAD LOG WHEN TAB OPENS
  // =========================================================

  useEffect(() => {
    if (activeTab === "log") {
      fetchMedicineLog();
    }
  }, [activeTab]);

  // =========================================================
  // CREATE INVENTORY MEDICINE
  // =========================================================

  const handleMedicineAdded =
    async (medicineData) => {
      try {
        setError("");

        const newMedicine =
          await createInventory(
            medicineData
          );

        setMedicines(
          (previous) => [
            ...previous,
            newMedicine,
          ]
        );

        setShowModal(false);
      } catch (err) {
        console.error(
          "Failed to create inventory:",
          err
        );

        setError(
          err?.message ||
            "Failed to create inventory item."
        );

        throw err;
      }
    };

  // =========================================================
  // UPDATE INVENTORY
  // =========================================================
  const handleMedicineEditRequest = (
  medicineId,
  medicine
) => {
  setMedicineToEdit(medicine);
  setShowModal(true);
};

  const handleMedicineUpdated =
    async (
      medicineId,
      medicineData
    ) => {
      try {
        setError("");

        const updatedMedicine =
          await updateInventory(
            medicineId,
            medicineData
          );

        setMedicines(
          (previous) =>
            previous.map(
              (medicine) =>
                medicine.id === medicineId
                  ? updatedMedicine
                  : medicine
            )
        );
      } catch (err) {
        console.error(
          "Failed to update inventory:",
          err
        );

        setError(
          err?.message ||
            "Failed to update inventory item."
        );
      }
    };

  // =========================================================
  // REQUEST INVENTORY DELETE
  // =========================================================

  const handleMedicineDeleteRequest =
    (medicine) => {
      setMedicineToDelete(medicine);
    };

  // =========================================================
  // CONFIRM INVENTORY DELETE
  // =========================================================

  const handleMedicineDeleted =
    async () => {
      if (!medicineToDelete?.id) {
        return;
      }

      try {
        setDeletingMedicine(true);
        setError("");

        await deleteInventory(
          medicineToDelete.id
        );

        setMedicines(
          (previous) =>
            previous.filter(
              (medicine) =>
                medicine.id !==
                medicineToDelete.id
            )
        );

        setMedicineToDelete(null);
      } catch (err) {
        console.error(
          "Failed to delete inventory:",
          err
        );

        setError(
          err?.message ||
            "Failed to delete inventory item."
        );
      } finally {
        setDeletingMedicine(false);
      }
    };

  // =========================================================
  // FILTER STOCK
  // =========================================================

  const filteredMedicines =
    useMemo(() => {
      return medicines.filter(
        (medicine) => {
          const search =
            searchTerm
              .toLowerCase()
              .trim();

          const matchesSearch =
            !search ||
            medicine.name
              ?.toLowerCase()
              .includes(search) ||
            medicine.category
              ?.toLowerCase()
              .includes(search) ||
            medicine.brand
              ?.toLowerCase()
              .includes(search);

          const quantity =
            Number(
              medicine.quantity
            );

          const minimumStock =
            Number(
              medicine.minimum_stock
            );

          let matchesStockFilter =
            true;

          if (
            stockFilter ===
            "in_stock"
          ) {
            matchesStockFilter =
              quantity >
              minimumStock;
          }

          if (
            stockFilter ===
            "low_stock"
          ) {
            matchesStockFilter =
              quantity > 0 &&
              quantity <=
                minimumStock;
          }

          if (
            stockFilter ===
            "out_of_stock"
          ) {
            matchesStockFilter =
              quantity === 0;
          }

          return (
            matchesSearch &&
            matchesStockFilter
          );
        }
      );
    }, [
      medicines,
      searchTerm,
      stockFilter,
    ]);

  // =========================================================
  // REFRESH INVENTORY
  // =========================================================

  const handleRefresh =
    async () => {
      await fetchInventory();
    };

  // =========================================================
  // MEDICINE ISSUED SUCCESSFULLY
  // =========================================================

  const handleMedicineIssued =
    async () => {
      await Promise.all([
        fetchInventory(),
        fetchMedicineLog(),
      ]);
    };

  // =========================================================
  // REQUEST MEDICINE LOG DELETE
  // =========================================================

  const handleLogDeleteRequest =
    (record) => {
      setLogItemToDelete(record);
    };

  // =========================================================
  // CONFIRM MEDICINE LOG DELETE
  // =========================================================

  const handleLogDelete =
    async () => {
      if (
        !logItemToDelete
          ?.prescription_item_id
      ) {
        return;
      }

      try {
        setDeletingLogItem(true);
        setLogError("");

        await deletePrescriptionItem(
          logItemToDelete.prescription_item_id
        );

        setLogItemToDelete(null);

        await Promise.all([
          fetchInventory(),
          fetchMedicineLog(),
        ]);
      } catch (err) {
        console.error(
          "Failed to delete medicine log item:",
          err
        );

        setLogError(
          err?.message ||
            "Failed to delete medicine record."
        );
      } finally {
        setDeletingLogItem(false);
      }
    };

  // =========================================================
  // OPEN EDIT MEDICINE
  // =========================================================

  const handleEditMedicineLog =
    (record) => {
      setEditingMedicineLog(record);
    };

  // =========================================================
  // EDIT SUCCESS
  // =========================================================

  const handleMedicineLogEdited =
    async () => {
      setEditingMedicineLog(null);

      await Promise.all([
        fetchInventory(),
        fetchMedicineLog(),
      ]);
    };

  // =========================================================
  // OPEN MEDICINE SLIP
  // =========================================================

  const handleOpenMedicineSlip =
    (record) => {
      setSelectedMedicineSlip(
        record
      );
    };

  return (
    <Layout>
      <div className="min-h-full space-y-7 bg-[#F7F4EC]">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <MedicineHeader
          onAddMedicine={() =>{
            setMedicineToEdit(null);
            setShowModal(true);
          }}
        />

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <div className="rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] p-2 shadow-[0_4px_20px_rgba(23,60,50,0.04)]">
          <div className="grid grid-cols-2 gap-2">

            {/* STOCK */}

            <button
              type="button"
              onClick={() =>
                setActiveTab("stock")
              }
              className={`
                rounded-xl px-4 py-3 text-sm font-semibold
                transition-all
                ${
                  activeTab === "stock"
                    ? "bg-[#173C32] text-white shadow-[0_4px_12px_rgba(23,60,50,0.14)]"
                    : "text-[#607068] hover:bg-[#F3F0E8] hover:text-[#173C32]"
                }
              `}
            >
              Clinic Stock
            </button>

            {/* MEDICINE LOG */}

            <button
              type="button"
              onClick={() =>
                setActiveTab("log")
              }
              className={`
                rounded-xl px-4 py-3 text-sm font-semibold
                transition-all
                ${
                  activeTab === "log"
                    ? "bg-[#173C32] text-white shadow-[0_4px_12px_rgba(23,60,50,0.14)]"
                    : "text-[#607068] hover:bg-[#F3F0E8] hover:text-[#173C32]"
                }
              `}
            >
              Medicine Log
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* CLINIC STOCK */}
        {/* ================================================= */}

        {activeTab === "stock" && (
          <>
            <MedicineStats
              medicines={medicines}
              loading={loading}
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:flex-1">
                <MedicineSearch
                  searchTerm={searchTerm}
                  onSearchChange={
                    setSearchTerm
                  }
                />
              </div>

              <div className="w-full md:w-auto">
                <MedicineFilters
                  stockFilter={
                    stockFilter
                  }
                  onFilterChange={
                    setStockFilter
                  }
                />
              </div>
            </div>

            {(searchTerm ||
              stockFilter !==
                "all") && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#718078]">
                  Showing{" "}
                  <span className="font-semibold text-[#173C32]">
                    {
                      filteredMedicines.length
                    }
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#173C32]">
                    {medicines.length}
                  </span>{" "}
                  medicines
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStockFilter(
                      "all"
                    );
                  }}
                  className="text-left text-sm font-medium text-[#496C59] transition-colors hover:text-[#173C32] sm:text-right"
                >
                  Clear filters
                </button>
              </div>
            )}

            {error && (
              <div className="flex flex-col gap-3 rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#8B554D]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    handleRefresh
                  }
                  className="rounded-lg bg-[#173C32] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#245346]"
                >
                  Retry
                </button>
              </div>
            )}

            <MedicineTable
              medicines={
                filteredMedicines
              }
              loading={loading}
              onUpdate={
                handleMedicineEditRequest
              }
              onDelete={
                handleMedicineDeleteRequest
              }
            />
          </>
        )}

        {/* ================================================= */}
        {/* MEDICINE LOG */}
        {/* ================================================= */}

        {activeTab === "log" && (
          <>
            {/* LOG HEADER */}

            <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] p-5 shadow-[0_4px_20px_rgba(23,60,50,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-1 rounded-full bg-[#B4935A]" />

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#173C32]">
                      Medicine Log
                    </h2>

                    <p className="mt-1 text-sm text-[#718078]">
                      Track medicines issued to patients.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowMedicineLogModal(
                    true
                  )
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C32] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(23,60,50,0.14)] transition-all hover:bg-[#245346] hover:shadow-[0_7px_20px_rgba(23,60,50,0.18)] sm:w-auto"
              >
                <span className="text-lg leading-none">
                  +
                </span>

                Issue Medicine
              </button>
            </div>

            {/* LOG ERROR */}

            {logError && (
              <div className="flex flex-col gap-3 rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#8B554D]">
                  {logError}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchMedicineLog
                  }
                  className="rounded-lg bg-[#173C32] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#245346]"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOG TABLE */}

            <MedicineLogTable
              records={medicineLog}
              loading={logLoading}
              onSlip={
                handleOpenMedicineSlip
              }
              onEdit={
                handleEditMedicineLog
              }
              onDelete={
                handleLogDeleteRequest
              }
            />
          </>
        )}
      </div>

      {/* ================================================= */}
      {/* ADD MEDICINE MODAL */}
      {/* ================================================= */}

      {showModal && (
  <MedicineModal
    medicine={medicineToEdit}
    onClose={() => {
      setShowModal(false);
      setMedicineToEdit(null);
    }}
    onSave={
      medicineToEdit
        ? handleMedicineUpdated
        : handleMedicineAdded
    }
  />
)}

      {/* ================================================= */}
      {/* ISSUE MEDICINE MODAL */}
      {/* ================================================= */}

      {showMedicineLogModal && (
        <MedicineLogModal
          onClose={() =>
            setShowMedicineLogModal(
              false
            )
          }
          onSuccess={
            handleMedicineIssued
          }
        />
      )}

      {/* ================================================= */}
      {/* INVENTORY DELETE CONFIRMATION */}
      {/* ================================================= */}

      {medicineToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#173C32]/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-2xl">

            <div className="border-b border-[#E7E1D5] px-6 py-5">
              <h3 className="text-lg font-bold text-[#173C32]">
                Delete medicine?
              </h3>

              <p className="mt-1 text-sm text-[#718078]">
                This action will permanently remove this
                medicine from clinic stock.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-xl border border-[#E7E1D5] bg-[#F7F4EC] px-4 py-3">
                <p className="text-sm font-semibold text-[#173C32]">
                  {medicineToDelete.name}
                </p>

                {medicineToDelete.brand && (
                  <p className="mt-1 text-xs text-[#718078]">
                    {medicineToDelete.brand}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setMedicineToDelete(null)
                }
                disabled={
                  deletingMedicine
                }
                className="rounded-xl border border-[#D9D4C9] px-5 py-2.5 text-sm font-semibold text-[#52635B] transition-colors hover:bg-[#F3F0E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleMedicineDeleted
                }
                disabled={
                  deletingMedicine
                }
                className="rounded-xl bg-[#9B4E45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#843F37] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingMedicine
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MEDICINE LOG DELETE CONFIRMATION */}
      {/* ================================================= */}

      {logItemToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#173C32]/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-2xl">

            <div className="border-b border-[#E7E1D5] px-6 py-5">
              <h3 className="text-lg font-bold text-[#173C32]">
                Delete medicine record?
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#718078]">
                The issued quantity will be restored to inventory
                and this medicine record will be removed.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-xl border border-[#E7E1D5] bg-[#F7F4EC] px-4 py-3">
                <p className="text-sm font-semibold text-[#173C32]">
                  {logItemToDelete.medicine_name}
                </p>

                <p className="mt-1 text-xs text-[#718078]">
                  {logItemToDelete.patient_name}{" "}
                  {logItemToDelete.medical_record_number
                    ? `• ${logItemToDelete.medical_record_number}`
                    : ""}
                </p>

                <p className="mt-1 text-xs text-[#718078]">
                  Quantity:{" "}
                  {logItemToDelete.quantity}{" "}
                  {logItemToDelete.medicine_unit || ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setLogItemToDelete(null)
                }
                disabled={
                  deletingLogItem
                }
                className="rounded-xl border border-[#D9D4C9] px-5 py-2.5 text-sm font-semibold text-[#52635B] transition-colors hover:bg-[#F3F0E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleLogDelete
                }
                disabled={
                  deletingLogItem
                }
                className="rounded-xl bg-[#9B4E45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#843F37] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingLogItem
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MEDICINE EDIT MODAL */}
      {/* ================================================= */}

      {editingMedicineLog && (
        <MedicineEditModal
          record={
            editingMedicineLog
          }
          onClose={() =>
            setEditingMedicineLog(
              null
            )
          }
          onSuccess={
            handleMedicineLogEdited
          }
        />
      )}

      {/* ================================================= */}
      {/* MEDICINE ISSUE SLIP */}
      {/* ================================================= */}

      {selectedMedicineSlip && (
        <MedicineIssueSlip
          record={
            selectedMedicineSlip
          }
          onClose={() =>
            setSelectedMedicineSlip(
              null
            )
          }
        />
      )}
    </Layout>
  );
}