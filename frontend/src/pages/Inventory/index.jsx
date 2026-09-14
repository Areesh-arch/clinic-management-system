
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

import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../../services/inventoryService";

import {
  getMedicineLog,
} from "../../services/medicineLogService";


export default function Inventory() {
  const [activeTab, setActiveTab] =
    useState("stock");

  const [medicines, setMedicines] =
    useState([]);

  const [medicineLog, setMedicineLog] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [logLoading, setLogLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [logError, setLogError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [showMedicineLogModal, setShowMedicineLogModal] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [stockFilter, setStockFilter] =
    useState("all");


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
  // UPDATE
  // =========================================================

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
  // DELETE
  // =========================================================

  const handleMedicineDeleted =
    async (medicineId) => {
      try {
        setError("");

        await deleteInventory(
          medicineId
        );

        setMedicines(
          (previous) =>
            previous.filter(
              (medicine) =>
                medicine.id !== medicineId
            )
        );
      } catch (err) {
        console.error(
          "Failed to delete inventory:",
          err
        );

        setError(
          err?.message ||
            "Failed to delete inventory item."
        );
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
      /*
       * Refresh both:
       *
       * 1. Inventory stock
       * 2. Medicine Log
       *
       * because issuing medicine decreases
       * stock and creates a log record.
       */

      await Promise.all([
        fetchInventory(),
        fetchMedicineLog(),
      ]);
    };


  return (
    <Layout>
      <div className="min-h-full space-y-7 bg-[#F7F4EC]">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <MedicineHeader
          onAddMedicine={() =>
            setShowModal(true)
          }
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
                handleMedicineUpdated
              }
              onDelete={
                handleMedicineDeleted
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


              {/* ISSUE MEDICINE */}

              <button
                type="button"
                onClick={() =>
                  setShowMedicineLogModal(true)
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
              records={
                medicineLog
              }
              loading={
                logLoading
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
          onClose={() =>
            setShowModal(false)
          }
          onSave={
            handleMedicineAdded
          }
        />
      )}


      {/* ================================================= */}
      {/* ISSUE MEDICINE MODAL */}
      {/* ================================================= */}

      {showMedicineLogModal && (
        <MedicineLogModal
          onClose={() =>
            setShowMedicineLogModal(false)
          }
          onSuccess={
            handleMedicineIssued
          }
        />
      )}

    </Layout>
  );
}
