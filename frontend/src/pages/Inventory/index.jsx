import { useState, useEffect } from "react";

import Layout from "../../components/layout/Layout";

import MedicineHeader from "../../components/inventory/MedicineHeader";
import MedicineStats from "../../components/inventory/MedicineStats";
import MedicineSearch from "../../components/inventory/MedicineSearch";
import MedicineFilters from "../../components/inventory/MedicineFilters";
import MedicineTable from "../../components/inventory/MedicineTable";
import MedicineModal from "../../components/inventory/MedicineModal";

import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../../services/inventoryService";

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // SEARCH + FILTER STATE
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [stockFilter, setStockFilter] = useState("all");

  // =====================================================
  // LOAD INVENTORY
  // =====================================================

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventory();

      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load inventory:", err);

      setError(
        err?.message || "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchInventory();
  }, []);

  // =====================================================
  // CREATE
  // =====================================================

  const handleMedicineAdded = async (medicineData) => {
    try {
      setError("");

      const newMedicine =
        await createInventory(medicineData);

      setMedicines((previous) => [
        ...previous,
        newMedicine,
      ]);

      setShowModal(false);
    } catch (err) {
      console.error(
        "Failed to create inventory:",
        err
      );

      const message =
        err?.message ||
        "Failed to create inventory item.";

      setError(message);

      throw err;
    }
  };

  // =====================================================
  // UPDATE
  // =====================================================

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

      setMedicines((previous) =>
        previous.map((medicine) =>
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

  // =====================================================
  // DELETE
  // =====================================================

  const handleMedicineDeleted = async (
    medicineId
  ) => {
    try {
      setError("");

      await deleteInventory(medicineId);

      setMedicines((previous) =>
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

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    fetchInventory();
  };

  // =====================================================
  // SEARCH + STOCK FILTER
  // =====================================================

  const filteredMedicines = medicines.filter(
    (medicine) => {
      const search =
        searchTerm.toLowerCase().trim();

      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

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

      // -----------------------------------------------
      // STOCK VALUES
      // -----------------------------------------------

      const quantity = Number(
        medicine.quantity
      );

      const minimumStock = Number(
        medicine.minimum_stock
      );

      // -----------------------------------------------
      // STOCK FILTER
      // -----------------------------------------------

      let matchesStockFilter = true;

      if (stockFilter === "in_stock") {
        matchesStockFilter =
          quantity > minimumStock;
      }

      if (stockFilter === "low_stock") {
        matchesStockFilter =
          quantity > 0 &&
          quantity <= minimumStock;
      }

      if (stockFilter === "out_of_stock") {
        matchesStockFilter =
          quantity === 0;
      }

      return (
        matchesSearch &&
        matchesStockFilter
      );
    }
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <Layout>
      <div className="min-h-full bg-[#F7F4EC] space-y-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <MedicineHeader
          onAddMedicine={() =>
            setShowModal(true)
          }
        />

        {/* =================================================
            STATS
        ================================================= */}

        <MedicineStats
          medicines={medicines}
          loading={loading}
        />

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:flex-1">
            <MedicineSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          <div className="w-full md:w-auto">
            <MedicineFilters
              stockFilter={stockFilter}
              onFilterChange={setStockFilter}
            />
          </div>
        </div>

        {/* =================================================
            SEARCH RESULT SUMMARY
        ================================================= */}

        {(searchTerm || stockFilter !== "all") && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#718078]">
              Showing{" "}
              <span className="font-semibold text-[#173C32]">
                {filteredMedicines.length}
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
                setStockFilter("all");
              }}
              className="text-sm font-medium text-[#496C59] hover:text-[#173C32] transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] px-4 py-3">
            <p className="text-sm font-medium text-[#8B554D]">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-lg bg-[#173C32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#245346] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        <MedicineTable
          medicines={filteredMedicines}
          loading={loading}
          onUpdate={handleMedicineUpdated}
          onDelete={handleMedicineDeleted}
        />
      </div>

      {/* ===================================================
          ADD INVENTORY MODAL
      =================================================== */}

      {showModal && (
        <MedicineModal
          onClose={() =>
            setShowModal(false)
          }
          onSave={handleMedicineAdded}
        />
      )}
    </Layout>
  );
}