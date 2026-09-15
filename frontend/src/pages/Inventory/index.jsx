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

import DirectMedicineIssueModal from "../../components/inventory/DirectMedicineIssueModal";

import InventoryLogModal from "../../components/inventory/InventoryLogModal";

import {
  getInventory,
  getArchivedInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  restoreInventory,
  permanentlyDeleteInventory,
} from "../../services/inventoryService";

import { getMedicineLog } from "../../services/medicineLogService";

import {
  deletePrescriptionItem,
} from "../../services/prescriptionService";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("stock");

  const [medicines, setMedicines] = useState([]);
  const [archivedMedicines, setArchivedMedicines] = useState([]);
  const [medicineLog, setMedicineLog] = useState([]);

  const [loading, setLoading] = useState(true);
  const [archivedLoading, setArchivedLoading] = useState(false);
  const [logLoading, setLogLoading] = useState(false);

  const [error, setError] = useState("");
  const [archivedError, setArchivedError] = useState("");
  const [logError, setLogError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState(null);

  const [showMedicineLogModal, setShowMedicineLogModal] =
    useState(false);

  // =========================================================
  // DIRECT MEDICINE ISSUE
  // =========================================================

  const [showDirectMedicineIssue, setShowDirectMedicineIssue] =
    useState(false);

  // =========================================================
  // INVENTORY LOG
  // =========================================================

  const [showInventoryLog, setShowInventoryLog] =
    useState(false);

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [archivedSearchTerm, setArchivedSearchTerm] =
    useState("");

  // =========================================================
  // ARCHIVE / RESTORE / PERMANENT DELETE
  // =========================================================

  const [medicineToArchive, setMedicineToArchive] =
    useState(null);

  const [medicineToRestore, setMedicineToRestore] =
    useState(null);

  const [
    medicineToPermanentlyDelete,
    setMedicineToPermanentlyDelete,
  ] = useState(null);

  const [archiveLoading, setArchiveLoading] =
    useState(false);

  const [restoreLoading, setRestoreLoading] =
    useState(false);

  const [
    permanentDeleteLoading,
    setPermanentDeleteLoading,
  ] = useState(false);

  // =========================================================
  // MEDICINE LOG ACTIONS
  // =========================================================

  const [logItemToDelete, setLogItemToDelete] =
    useState(null);

  const [deletingLogItem, setDeletingLogItem] =
    useState(false);

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
  // LOAD ARCHIVED INVENTORY
  // =========================================================

  const fetchArchivedInventory = async () => {
    try {
      setArchivedLoading(true);
      setArchivedError("");

      const data = await getArchivedInventory();

      setArchivedMedicines(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load archived inventory:",
        err
      );

      setArchivedError(
        err?.message ||
          "Failed to load archived inventory."
      );
    } finally {
      setArchivedLoading(false);
    }
  };

  // =========================================================
  // LOAD MEDICINE LOG
  // =========================================================

  const fetchMedicineLog = async () => {
    try {
      setLogLoading(true);
      setLogError("");

      const data = await getMedicineLog();

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
  // LOAD DATA WHEN TAB OPENS
  // =========================================================

  useEffect(() => {
    if (activeTab === "log") {
      fetchMedicineLog();
    }

    if (activeTab === "archived") {
      fetchArchivedInventory();
    }
  }, [activeTab]);

  // =========================================================
  // CREATE INVENTORY MEDICINE
  // =========================================================

  const handleMedicineAdded = async (
    medicineData
  ) => {
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

  const handleMedicineUpdated = async (
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

      setShowModal(false);
      setMedicineToEdit(null);
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
  // REQUEST INVENTORY ARCHIVE
  // =========================================================

  const handleMedicineDeleteRequest = (
    medicine
  ) => {
    setMedicineToArchive(medicine);
  };

  // =========================================================
  // CONFIRM INVENTORY ARCHIVE
  // =========================================================

  const handleMedicineArchived = async () => {
    if (!medicineToArchive?.id) {
      return;
    }

    try {
      setArchiveLoading(true);
      setError("");

      await deleteInventory(
        medicineToArchive.id
      );

      setMedicines(
        (previous) =>
          previous.filter(
            (medicine) =>
              medicine.id !==
              medicineToArchive.id
          )
      );

      setMedicineToArchive(null);

      if (activeTab === "archived") {
        await fetchArchivedInventory();
      }
    } catch (err) {
      console.error(
        "Failed to archive inventory:",
        err
      );

      setError(
        err?.message ||
          "Failed to archive inventory item."
      );
    } finally {
      setArchiveLoading(false);
    }
  };

  // =========================================================
  // RESTORE ARCHIVED MEDICINE
  // =========================================================

  const handleRestoreMedicine = async () => {
    if (!medicineToRestore?.id) {
      return;
    }

    try {
      setRestoreLoading(true);
      setArchivedError("");

      const restoredMedicine =
        await restoreInventory(
          medicineToRestore.id
        );

      setArchivedMedicines(
        (previous) =>
          previous.filter(
            (medicine) =>
              medicine.id !==
              medicineToRestore.id
          )
      );

      setMedicines(
        (previous) => [
          ...previous,
          restoredMedicine,
        ]
      );

      setMedicineToRestore(null);
    } catch (err) {
      console.error(
        "Failed to restore inventory:",
        err
      );

      setArchivedError(
        err?.message ||
          "Failed to restore inventory item."
      );
    } finally {
      setRestoreLoading(false);
    }
  };

  // =========================================================
  // PERMANENT DELETE
  // =========================================================

  const handlePermanentDelete = async () => {
    if (
      !medicineToPermanentlyDelete?.id
    ) {
      return;
    }

    try {
      setPermanentDeleteLoading(true);
      setArchivedError("");

      await permanentlyDeleteInventory(
        medicineToPermanentlyDelete.id
      );

      setArchivedMedicines(
        (previous) =>
          previous.filter(
            (medicine) =>
              medicine.id !==
              medicineToPermanentlyDelete.id
          )
      );

      setMedicineToPermanentlyDelete(
        null
      );
    } catch (err) {
      console.error(
        "Failed to permanently delete inventory:",
        err
      );

      setArchivedError(
        err?.message ||
          "Failed to permanently delete inventory item."
      );
    } finally {
      setPermanentDeleteLoading(false);
    }
  };

  // =========================================================
  // FILTER STOCK
  // =========================================================

  const filteredMedicines = useMemo(() => {
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
  // FILTER ARCHIVED INVENTORY
  // =========================================================

  const filteredArchivedMedicines =
    useMemo(() => {
      const search =
        archivedSearchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return archivedMedicines;
      }

      return archivedMedicines.filter(
        (medicine) =>
          medicine.name
            ?.toLowerCase()
            .includes(search) ||
          medicine.category
            ?.toLowerCase()
            .includes(search) ||
          medicine.brand
            ?.toLowerCase()
            .includes(search)
      );
    }, [
      archivedMedicines,
      archivedSearchTerm,
    ]);

  // =========================================================
  // REFRESH INVENTORY
  // =========================================================

  const handleRefresh = async () => {
    await fetchInventory();
  };

  // =========================================================
  // MEDICINE ISSUED SUCCESSFULLY
  // =========================================================

  const handleMedicineIssued = async () => {
    await Promise.all([
      fetchInventory(),
      fetchMedicineLog(),
    ]);
  };

  // =========================================================
  // REQUEST MEDICINE LOG DELETE
  // =========================================================

  const handleLogDeleteRequest = (
    record
  ) => {
    setLogItemToDelete(record);
  };

  // =========================================================
  // CONFIRM MEDICINE LOG DELETE
  // =========================================================

  const handleLogDelete = async () => {
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
  // OPEN EDIT MEDICINE LOG
  // =========================================================

  const handleEditMedicineLog = (
    record
  ) => {
    setEditingMedicineLog(record);
  };

  // =========================================================
  // EDIT MEDICINE LOG SUCCESS
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

  const handleOpenMedicineSlip = (
    record
  ) => {
    setSelectedMedicineSlip(
      record
    );
  };

  // =========================================================
  // OPEN INVENTORY LOG
  // =========================================================

  const handleOpenInventoryLog = () => {
    setShowInventoryLog(true);
  };

  // =========================================================
  // CLOSE INVENTORY LOG
  // =========================================================

  const handleCloseInventoryLog = () => {
    setShowInventoryLog(false);
  };

  return (
    <Layout>
      <div className="min-h-full space-y-7 bg-[#F7F4EC]">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <MedicineHeader
          onAddMedicine={() => {
            setMedicineToEdit(null);
            setShowModal(true);
          }}
        />

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <div className="rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] p-2 shadow-[0_4px_20px_rgba(23,60,50,0.04)]">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

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

            {/* ARCHIVED */}
            <button
              type="button"
              onClick={() =>
                setActiveTab("archived")
              }
              className={`
                rounded-xl px-4 py-3 text-sm font-semibold
                transition-all
                ${
                  activeTab === "archived"
                    ? "bg-[#173C32] text-white shadow-[0_4px_12px_rgba(23,60,50,0.14)]"
                    : "text-[#607068] hover:bg-[#F3F0E8] hover:text-[#173C32]"
                }
              `}
            >
              Archived Inventory

              {archivedMedicines.length >
                0 && (
                <span
                  className={`
                    ml-2 inline-flex min-w-5.5
                    items-center justify-center rounded-full
                    px-1.5 py-0.5 text-[11px] font-bold
                    ${
                      activeTab ===
                      "archived"
                        ? "bg-white/15 text-white"
                        : "bg-[#F0E9DA] text-[#806C48]"
                    }
                  `}
                >
                  {
                    archivedMedicines.length
                  }
                </span>
              )}
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

            {/* STOCK TOOLBAR */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="w-full lg:flex-1">
                <MedicineSearch
                  searchTerm={searchTerm}
                  onSearchChange={
                    setSearchTerm
                  }
                />
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                {/* FILTER */}

                <div className="w-full sm:w-auto">
                  <MedicineFilters
                    stockFilter={
                      stockFilter
                    }
                    onFilterChange={
                      setStockFilter
                    }
                  />
                </div>

                {/* DIRECT MEDICINE ISSUE */}

                <button
                  type="button"
                  onClick={() =>
                    setShowDirectMedicineIssue(
                      true
                    )
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C32] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(23,60,50,0.12)] transition-all hover:bg-[#245346] hover:shadow-[0_7px_20px_rgba(23,60,50,0.16)] sm:w-auto"
                >
                  <span className="text-lg leading-none">
                    +
                  </span>

                  Issue Medicine
                </button>

                {/* INVENTORY LOG */}

                <button
                  type="button"
                  onClick={
                    handleOpenInventoryLog
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#B4935A] bg-[#FFFDF8] px-5 py-3 text-sm font-semibold text-[#173C32] shadow-[0_4px_14px_rgba(23,60,50,0.05)] transition-all hover:border-[#A1844F] hover:bg-[#F9F4E9] hover:shadow-[0_6px_18px_rgba(23,60,50,0.08)] sm:w-auto"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#173C32] text-[11px] text-white">
                    ≡
                  </span>

                  Inventory Log
                </button>

              </div>
            </div>

            {/* FILTER SUMMARY */}

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

            {/* ERROR */}

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

            {/* STOCK TABLE */}

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
        {/* ARCHIVED INVENTORY */}
        {/* ================================================= */}

        {activeTab === "archived" && (
          <>
            <div className="rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] p-5 shadow-[0_4px_20px_rgba(23,60,50,0.04)] sm:p-6">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>
                  <div className="flex items-center gap-3">

                    <div className="h-10 w-1 rounded-full bg-[#B4935A]" />

                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-[#173C32]">
                        Archived Inventory
                      </h2>

                      <p className="mt-1 text-sm text-[#718078]">
                        Medicines removed from active clinic stock.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="w-full lg:max-w-sm">
                  <div className="relative">

                    <input
                      type="text"
                      value={
                        archivedSearchTerm
                      }
                      onChange={(
                        event
                      ) =>
                        setArchivedSearchTerm(
                          event.target
                            .value
                        )
                      }
                      placeholder="Search archived medicines..."
                      className="w-full rounded-xl border border-[#DDD7CA] bg-[#FDFCFA] px-4 py-3 text-sm text-[#173C32] outline-none transition-all placeholder:text-[#9A9F9B] focus:border-[#A58B52] focus:ring-2 focus:ring-[#B4935A]/15"
                    />

                  </div>
                </div>

              </div>
            </div>

            {archivedError && (
              <div className="flex flex-col gap-3 rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm font-medium text-[#8B554D]">
                  {archivedError}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchArchivedInventory
                  }
                  className="rounded-lg bg-[#173C32] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#245346]"
                >
                  Retry
                </button>

              </div>
            )}

            {archivedLoading ? (
              <div className="rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] px-6 py-16 text-center shadow-[0_4px_20px_rgba(23,60,50,0.04)]">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#DCD6C9] border-t-[#173C32]" />

                <p className="mt-4 text-sm font-medium text-[#718078]">
                  Loading archived inventory...
                </p>

              </div>
            ) : filteredArchivedMedicines.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DCD6C9] bg-[#FFFDF8] px-6 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1ECE1] text-2xl text-[#8C7752]">
                  ♢
                </div>

                <h3 className="mt-5 text-base font-bold text-[#173C32]">
                  No archived medicines
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718078]">
                  Archived medicines will appear here.
                  You can restore them to clinic stock or
                  permanently delete them.
                </p>

              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-[0_4px_20px_rgba(23,60,50,0.04)]">

                <div className="overflow-x-auto">

                  <table className="min-w-250 w-full text-left">

                    <thead>
                      <tr className="border-b border-[#E7E1D5] bg-[#F7F4EC]">

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#68766F]">
                          Medicine
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#68766F]">
                          Category
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#68766F]">
                          Stock
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#68766F]">
                          Unit
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#68766F]">
                          Selling Price
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-[0.08em] text-[#68766F]">
                          Actions
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EEE9DF]">

                      {filteredArchivedMedicines.map(
                        (medicine) => (
                          <tr
                            key={
                              medicine.id
                            }
                            className="transition-colors hover:bg-[#FCFAF5]"
                          >

                            <td className="px-5 py-4">
                              <div>

                                <p className="text-sm font-semibold text-[#173C32]">
                                  {medicine.name ||
                                    "—"}
                                </p>

                                {medicine.brand && (
                                  <p className="mt-1 text-xs text-[#7B857F]">
                                    {
                                      medicine.brand
                                    }
                                  </p>
                                )}

                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-lg bg-[#F2EEE5] px-2.5 py-1 text-xs font-medium text-[#68766F]">
                                {medicine.category ||
                                  "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-sm font-semibold text-[#173C32]">
                                {medicine.quantity ??
                                  0}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-sm text-[#68766F]">
                                {medicine.unit ||
                                  "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-sm font-semibold text-[#173C32]">
                                {medicine.selling_price !=
                                null
                                  ? Number(
                                      medicine.selling_price
                                    ).toLocaleString()
                                  : "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4">

                              <div className="flex items-center justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    setMedicineToRestore(
                                      medicine
                                    )
                                  }
                                  className="rounded-lg border border-[#AFC2B7] bg-[#F5F9F5] px-3 py-2 text-xs font-bold text-[#315C4A] transition-colors hover:border-[#7E9E8D] hover:bg-[#EAF3EC]"
                                >
                                  Restore
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setMedicineToPermanentlyDelete(
                                      medicine
                                    )
                                  }
                                  className="rounded-lg border border-[#E2C5C0] bg-[#FBF0EE] px-3 py-2 text-xs font-bold text-[#9B4E45] transition-colors hover:border-[#C99B94] hover:bg-[#F7E5E2]"
                                >
                                  Delete Permanently
                                </button>

                              </div>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="border-t border-[#E7E1D5] bg-[#FBFAF6] px-5 py-3">

                  <p className="text-xs text-[#7B857F]">
                    Showing{" "}
                    <span className="font-semibold text-[#173C32]">
                      {
                        filteredArchivedMedicines.length
                      }
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#173C32]">
                      {
                        archivedMedicines.length
                      }
                    </span>{" "}
                    archived medicines.
                  </p>

                </div>

              </div>
            )}
          </>
        )}

        {/* ================================================= */}
        {/* MEDICINE LOG */}
        {/* ================================================= */}

        {activeTab === "log" && (
          <>
            <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] p-5 shadow-[0_4px_20px_rgba(23,60,50,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div>
                <div className="flex items-center gap-3">

                  <div className="h-9 w-1 rounded-full bg-[#B4935A]" />

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#173C32]">
                      Medicine Log
                    </h2>

                    <p className="mt-1 text-sm text-[#718078]">
                      Track medicines issued to patients and walk-in customers.
                    </p>
                  </div>

                </div>
              </div>

              {/* EXISTING TREATMENT/PRESCRIPTION ISSUE */}

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
      {/* ADD / EDIT MEDICINE MODAL */}
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
      {/* EXISTING TREATMENT / PRESCRIPTION ISSUE MODAL */}
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
      {/* DIRECT MEDICINE ISSUE MODAL */}
      {/* ================================================= */}

      {showDirectMedicineIssue && (
        <DirectMedicineIssueModal
          medicines={medicines}
          onClose={() =>
            setShowDirectMedicineIssue(
              false
            )
          }
          onSuccess={
            handleMedicineIssued
          }
        />
      )}

      {/* ================================================= */}
      {/* INVENTORY LOG MODAL */}
      {/* ================================================= */}

      {showInventoryLog && (
        <InventoryLogModal
          medicines={medicines}
          onClose={
            handleCloseInventoryLog
          }
        />
      )}

      {/* ================================================= */}
      {/* ARCHIVE CONFIRMATION */}
      {/* ================================================= */}

      {medicineToArchive && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#173C32]/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-2xl">

            <div className="border-b border-[#E7E1D5] px-6 py-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1ECE1] text-[#806C48]">
                  ♢
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#173C32]">
                    Archive medicine?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#718078]">
                    This medicine will be removed from active
                    clinic stock but kept safely in Archived
                    Inventory.
                  </p>
                </div>

              </div>

            </div>

            <div className="px-6 py-5">

              <div className="rounded-xl border border-[#E7E1D5] bg-[#F7F4EC] px-4 py-3">

                <p className="text-sm font-semibold text-[#173C32]">
                  {medicineToArchive.name}
                </p>

                {medicineToArchive.brand && (
                  <p className="mt-1 text-xs text-[#718078]">
                    {
                      medicineToArchive.brand
                    }
                  </p>
                )}

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setMedicineToArchive(
                    null
                  )
                }
                disabled={archiveLoading}
                className="rounded-xl border border-[#D9D4C9] px-5 py-2.5 text-sm font-semibold text-[#52635B] transition-colors hover:bg-[#F3F0E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleMedicineArchived
                }
                disabled={archiveLoading}
                className="rounded-xl bg-[#173C32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245346] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {archiveLoading
                  ? "Archiving..."
                  : "Yes, Archive"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* RESTORE CONFIRMATION */}
      {/* ================================================= */}

      {medicineToRestore && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#173C32]/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-2xl">

            <div className="border-b border-[#E7E1D5] px-6 py-5">

              <h3 className="text-lg font-bold text-[#173C32]">
                Restore medicine?
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#718078]">
                This medicine will be returned to active clinic
                stock with its existing stock information.
              </p>

            </div>

            <div className="px-6 py-5">

              <div className="rounded-xl border border-[#DCE7DE] bg-[#F4F8F4] px-4 py-3">

                <p className="text-sm font-semibold text-[#173C32]">
                  {medicineToRestore.name}
                </p>

                {medicineToRestore.brand && (
                  <p className="mt-1 text-xs text-[#718078]">
                    {
                      medicineToRestore.brand
                    }
                  </p>
                )}

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setMedicineToRestore(
                    null
                  )
                }
                disabled={restoreLoading}
                className="rounded-xl border border-[#D9D4C9] px-5 py-2.5 text-sm font-semibold text-[#52635B] transition-colors hover:bg-[#F3F0E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleRestoreMedicine
                }
                disabled={restoreLoading}
                className="rounded-xl bg-[#315C4A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#274B3C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {restoreLoading
                  ? "Restoring..."
                  : "Yes, Restore"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* PERMANENT DELETE CONFIRMATION */}
      {/* ================================================= */}

      {medicineToPermanentlyDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#173C32]/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E7D0CC] bg-[#FFFDF8] shadow-2xl">

            <div className="border-b border-[#E7D0D0] bg-[#FBF0EE] px-6 py-5">

              <h3 className="text-lg font-bold text-[#8E4038]">
                Permanently delete medicine?
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#8B554D]">
                This action cannot be undone. The archived
                inventory record will be permanently removed.
              </p>

            </div>

            <div className="px-6 py-5">

              <div className="rounded-xl border border-[#E7D1CD] bg-[#FBF4F2] px-4 py-3">

                <p className="text-sm font-semibold text-[#173C32]">
                  {
                    medicineToPermanentlyDelete.name
                  }
                </p>

                {medicineToPermanentlyDelete.brand && (
                  <p className="mt-1 text-xs text-[#718078]">
                    {
                      medicineToPermanentlyDelete.brand
                    }
                  </p>
                )}

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E7D0CC] px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setMedicineToPermanentlyDelete(
                    null
                  )
                }
                disabled={
                  permanentDeleteLoading
                }
                className="rounded-xl border border-[#D9D4C9] px-5 py-2.5 text-sm font-semibold text-[#52635B] transition-colors hover:bg-[#F3F0E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handlePermanentDelete
                }
                disabled={
                  permanentDeleteLoading
                }
                className="rounded-xl bg-[#9B4E45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#843F37] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {permanentDeleteLoading
                  ? "Deleting..."
                  : "Delete Permanently"}
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
                  {
                    logItemToDelete.medicine_name
                  }
                </p>

                <p className="mt-1 text-xs text-[#718078]">
                  {logItemToDelete.patient_name ||
                    logItemToDelete.customer_name ||
                    "Walk-in Customer"}

                  {logItemToDelete.medical_record_number
                    ? ` • ${logItemToDelete.medical_record_number}`
                    : ""}
                </p>

                <p className="mt-1 text-xs text-[#718078]">
                  Quantity:{" "}
                  {
                    logItemToDelete.quantity
                  }{" "}
                  {
                    logItemToDelete.medicine_unit ||
                    ""
                  }
                </p>

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setLogItemToDelete(
                    null
                  )
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