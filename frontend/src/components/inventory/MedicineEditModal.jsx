import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiLoader, FiX } from "react-icons/fi";

import { getInventory } from "../../services/inventoryService";
import {
  getPrescription,
  updatePrescriptionItem,
} from "../../services/prescriptionService";


// =========================================================
// HELPERS
// =========================================================

function normalizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}


function getInventoryIssueUnit(medicine) {
  return (
    medicine?.issue_unit ||
    medicine?.unit ||
    "unit"
  );
}


function getUnitsPerStockUnit(medicine) {
  const value = Number(
    medicine?.units_per_stock_unit
  );

  return value > 0 ? value : 1;
}


function getAvailableIssueUnits(medicine) {
  if (!medicine) {
    return 0;
  }

  const stockQuantity =
    normalizeNumber(medicine.quantity);

  const conversion =
    getUnitsPerStockUnit(medicine);

  const looseQuantity =
    normalizeNumber(
      medicine.loose_quantity
    );

  return (
    stockQuantity * conversion +
    looseQuantity
  );
}


function getIssueUnitPrice(medicine) {
  if (!medicine) {
    return 0;
  }

  const sellingPrice =
    normalizeNumber(
      medicine.selling_price
    );

  const conversion =
    getUnitsPerStockUnit(medicine);

  return sellingPrice / conversion;
}


// =========================================================
// COMPONENT
// =========================================================

export default function MedicineEditModal({
  record,
  onClose,
  onSuccess,
}) {
  const [inventory, setInventory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    inventory_item_id: "",
    quantity: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  });


  // =======================================================
  // LOAD DATA
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!record) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        // -------------------------------------------------
        // Load inventory first
        // -------------------------------------------------

        const inventoryData =
          await getInventory();

        const inventoryList =
          Array.isArray(inventoryData)
            ? inventoryData
            : [];

        if (cancelled) {
          return;
        }

        setInventory(inventoryList);


        // -------------------------------------------------
        // IMPORTANT:
        // Use the Medicine Log record directly for the
        // fields that the user sees.
        // -------------------------------------------------

        let inventoryItemId = "";


        // -------------------------------------------------
        // Try prescription lookup to get the exact
        // inventory_item_id.
        // -------------------------------------------------

        if (record.prescription_id) {
          try {
            const prescription =
              await getPrescription(
                record.prescription_id
              );

            const items =
              Array.isArray(
                prescription?.items
              )
                ? prescription.items
                : [];

            const prescriptionItem =
              items.find(
                (item) =>
                  String(item?.id) ===
                  String(
                    record.prescription_item_id
                  )
              );

            if (
              prescriptionItem?.inventory_item_id !=
              null
            ) {
              inventoryItemId =
                String(
                  prescriptionItem.inventory_item_id
                );
            }
          } catch (prescriptionError) {
            console.warn(
              "Could not load prescription for medicine edit:",
              prescriptionError
            );
          }
        }


        // -------------------------------------------------
        // Fallback:
        // If prescription lookup did not give us the
        // inventory ID, find it from the medicine name.
        // -------------------------------------------------

        if (!inventoryItemId) {
          const matchingMedicine =
            inventoryList.find(
              (medicine) =>
                String(
                  medicine?.name || ""
                )
                  .trim()
                  .toLowerCase() ===
                String(
                  record?.medicine_name || ""
                )
                  .trim()
                  .toLowerCase()
            );

          if (
            matchingMedicine?.id != null
          ) {
            inventoryItemId =
              String(
                matchingMedicine.id
              );
          }
        }


        // -------------------------------------------------
        // Populate the form DIRECTLY from the log record.
        // -------------------------------------------------

        setForm({
          inventory_item_id:
            inventoryItemId,

          quantity:
            record?.quantity ?? "",

          dosage:
            record?.dosage ?? "",

          frequency:
            record?.frequency ?? "",

          duration:
            record?.duration ?? "",

          notes: "",
        });
      } catch (err) {
        console.error(
          "Failed to load medicine edit data:",
          err
        );

        if (!cancelled) {
          setError(
            err?.message ||
              "Failed to load medicine information."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [record]);


  // =======================================================
  // SELECTED MEDICINE
  // =======================================================

  const selectedMedicine =
    useMemo(() => {
      if (!form.inventory_item_id) {
        return null;
      }

      return inventory.find(
        (medicine) =>
          String(medicine?.id) ===
          String(
            form.inventory_item_id
          )
      ) || null;
    }, [
      inventory,
      form.inventory_item_id,
    ]);


  // =======================================================
  // AVAILABLE STOCK
  // =======================================================

  const availableIssueUnits =
    useMemo(() => {
      return getAvailableIssueUnits(
        selectedMedicine
      );
    }, [selectedMedicine]);


  // =======================================================
  // ISSUE UNIT PRICE
  // =======================================================

  const issueUnitPrice =
    useMemo(() => {
      return getIssueUnitPrice(
        selectedMedicine
      );
    }, [selectedMedicine]);


  // =======================================================
  // ESTIMATED TOTAL
  // =======================================================

  const estimatedTotal =
    useMemo(() => {
      const quantity =
        normalizeNumber(
          form.quantity
        );

      return quantity * issueUnitPrice;
    }, [
      form.quantity,
      issueUnitPrice,
    ]);


  // =======================================================
  // FIELD CHANGE
  // =======================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      const quantity =
        Number(form.quantity);

      if (
        !form.inventory_item_id
      ) {
        setError(
          "Please select a valid medicine."
        );
        return;
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        setError(
          "Quantity must be a whole number greater than 0."
        );
        return;
      }

      if (
        quantity >
        availableIssueUnits
      ) {
        setError(
          `Only ${availableIssueUnits} ${getInventoryIssueUnit(
            selectedMedicine
          )} available.`
        );
        return;
      }

      if (
        !form.dosage.trim() ||
        !form.frequency.trim() ||
        !form.duration.trim()
      ) {
        setError(
          "Dosage, frequency and duration are required."
        );
        return;
      }

      try {
        setSaving(true);

        await updatePrescriptionItem(
          record.prescription_item_id,
          {
            inventory_item_id:
              Number(
                form.inventory_item_id
              ),

            quantity,

            dosage:
              form.dosage.trim(),

            frequency:
              form.frequency.trim(),

            duration:
              form.duration.trim(),

            notes:
              form.notes.trim() ||
              null,
          }
        );

        await onSuccess?.();

      } catch (err) {
        console.error(
          "Failed to update medicine:",
          err
        );

        setError(
          err?.message ||
            "Failed to update medicine."
        );
      } finally {
        setSaving(false);
      }
    };


  // =======================================================
  // NO RECORD
  // =======================================================

  if (!record) {
    return null;
  }


  // =======================================================
  // MODAL
  // =======================================================

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-[#173C32]/55
        px-4 py-6
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex w-full max-w-2xl
          max-h-[92vh]
          flex-col
          overflow-hidden
          rounded-2xl
          border border-[#E7E1D5]
          bg-[#FFFDF8]
          shadow-2xl
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex shrink-0
            items-center justify-between
            border-b border-[#31584D]
            bg-[#173C32]
            px-5 py-4
            sm:px-6
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <FiEdit2
                size={18}
                className="text-[#C8A96B]"
              />

              <h2
                className="
                  text-lg font-bold
                  text-white
                  sm:text-xl
                "
              >
                Edit Medicine
              </h2>
            </div>

            <p
              className="
                mt-1 text-xs
                text-[#D9E4DE]
                sm:text-sm
              "
            >
              Correct the medicine issue details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-9 w-9
              shrink-0
              items-center justify-center
              rounded-full
              text-white
              transition
              hover:bg-white/10
            "
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            overflow-y-auto
            px-5 py-5
            sm:px-6 sm:py-6
          "
        >

          {loading ? (
            <div
              className="
                flex min-h-65
                items-center
                justify-center
                text-[#173C32]
              "
            >
              <div className="flex items-center gap-3">
                <FiLoader
                  className="animate-spin"
                  size={20}
                />

                <span className="text-sm font-medium">
                  Loading medicine details...
                </span>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =================================================
                  PATIENT / MEDICINE SUMMARY
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border border-[#E5DED0]
                  bg-[#F7F4EC]
                  p-4
                "
              >
                <div
                  className="
                    grid grid-cols-1
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#6F8F7D]
                      "
                    >
                      Patient
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-[#173C32]
                      "
                    >
                      {record.patient_name ||
                        "Unknown Patient"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-[#6F6B63]
                      "
                    >
                      {record.medical_record_number ||
                        "No MRN"}
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#6F8F7D]
                      "
                    >
                      Medicine
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-[#173C32]
                      "
                    >
                      {record.medicine_name ||
                        "Medicine"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-[#6F6B63]
                      "
                    >
                      {record.medicine_unit ||
                        "unit"}
                    </p>
                  </div>
                </div>
              </div>


              {/* =================================================
                  MEDICINE
              ================================================= */}

              <div>
                <label
                  htmlFor="inventory_item_id"
                  className="
                    mb-1.5 block
                    text-sm
                    font-semibold
                    text-[#173C32]
                  "
                >
                  Medicine
                </label>

                <select
                  id="inventory_item_id"
                  name="inventory_item_id"
                  value={
                    form.inventory_item_id
                  }
                  onChange={handleChange}
                  disabled={saving}
                  className="
                    w-full
                    rounded-xl
                    border border-[#D9D1C3]
                    bg-white
                    px-3.5 py-3
                    text-sm
                    text-[#173C32]
                    outline-none
                    transition
                    focus:border-[#6F8F7D]
                    focus:ring-2
                    focus:ring-[#6F8F7D]/15
                    disabled:bg-[#F3F0E9]
                  "
                >
                  <option value="">
                    Select medicine
                  </option>

                  {inventory.map(
                    (medicine) => (
                      <option
                        key={medicine.id}
                        value={medicine.id}
                      >
                        {medicine.name}
                        {" — "}
                        {getInventoryIssueUnit(
                          medicine
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>


              {/* =================================================
                  QUANTITY + UNIT
              ================================================= */}

              <div
                className="
                  grid grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label
                    htmlFor="quantity"
                    className="
                      mb-1.5 block
                      text-sm
                      font-semibold
                      text-[#173C32]
                    "
                  >
                    Quantity
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={form.quantity}
                    onChange={handleChange}
                    disabled={saving}
                    className="
                      w-full
                      rounded-xl
                      border border-[#D9D1C3]
                      bg-white
                      px-3.5 py-3
                      text-sm
                      text-[#173C32]
                      outline-none
                      transition
                      focus:border-[#6F8F7D]
                      focus:ring-2
                      focus:ring-[#6F8F7D]/15
                    "
                  />

                  <p
                    className="
                      mt-1.5
                      text-xs
                      text-[#777168]
                    "
                  >
                    Available:{" "}
                    <span className="font-semibold">
                      {availableIssueUnits}
                    </span>{" "}
                    {getInventoryIssueUnit(
                      selectedMedicine
                    )}
                  </p>
                </div>


                <div>
                  <label
                    className="
                      mb-1.5 block
                      text-sm
                      font-semibold
                      text-[#173C32]
                    "
                  >
                    Issue Unit
                  </label>

                  <div
                    className="
                      flex min-h-11.5
                      items-center
                      rounded-xl
                      border border-[#D9D1C3]
                      bg-[#F7F4EC]
                      px-3.5
                      text-sm
                      font-medium
                      text-[#173C32]
                    "
                  >
                    {getInventoryIssueUnit(
                      selectedMedicine
                    )}
                  </div>
                </div>
              </div>


              {/* =================================================
                  DOSAGE
              ================================================= */}

              <div>
                <label
                  htmlFor="dosage"
                  className="
                    mb-1.5 block
                    text-sm
                    font-semibold
                    text-[#173C32]
                  "
                >
                  Dosage
                </label>

                <input
                  id="dosage"
                  name="dosage"
                  type="text"
                  value={form.dosage}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="e.g. 1 tablet"
                  className="
                    w-full
                    rounded-xl
                    border border-[#D9D1C3]
                    bg-white
                    px-3.5 py-3
                    text-sm
                    text-[#173C32]
                    outline-none
                    transition
                    focus:border-[#6F8F7D]
                    focus:ring-2
                    focus:ring-[#6F8F7D]/15
                  "
                />
              </div>


              {/* =================================================
                  FREQUENCY + DURATION
              ================================================= */}

              <div
                className="
                  grid grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label
                    htmlFor="frequency"
                    className="
                      mb-1.5 block
                      text-sm
                      font-semibold
                      text-[#173C32]
                    "
                  >
                    Frequency
                  </label>

                  <input
                    id="frequency"
                    name="frequency"
                    type="text"
                    value={form.frequency}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="e.g. 1 daily"
                    className="
                      w-full
                      rounded-xl
                      border border-[#D9D1C3]
                      bg-white
                      px-3.5 py-3
                      text-sm
                      text-[#173C32]
                      outline-none
                      transition
                      focus:border-[#6F8F7D]
                      focus:ring-2
                      focus:ring-[#6F8F7D]/15
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="
                      mb-1.5 block
                      text-sm
                      font-semibold
                      text-[#173C32]
                    "
                  >
                    Duration
                  </label>

                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={form.duration}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="e.g. 10 days"
                    className="
                      w-full
                      rounded-xl
                      border border-[#D9D1C3]
                      bg-white
                      px-3.5 py-3
                      text-sm
                      text-[#173C32]
                      outline-none
                      transition
                      focus:border-[#6F8F7D]
                      focus:ring-2
                      focus:ring-[#6F8F7D]/15
                    "
                  />
                </div>
              </div>


              {/* =================================================
                  NOTES
              ================================================= */}

              <div>
                <label
                  htmlFor="notes"
                  className="
                    mb-1.5 block
                    text-sm
                    font-semibold
                    text-[#173C32]
                  "
                >
                  Notes
                  <span className="ml-1 font-normal text-[#8B857C]">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Optional medicine notes..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border border-[#D9D1C3]
                    bg-white
                    px-3.5 py-3
                    text-sm
                    text-[#173C32]
                    outline-none
                    transition
                    focus:border-[#6F8F7D]
                    focus:ring-2
                    focus:ring-[#6F8F7D]/15
                  "
                />
              </div>


              {/* =================================================
                  PRICE
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border border-[#D9D1C3]
                  bg-[#F7F4EC]
                  px-4 py-3
                "
              >
                <div
                  className="
                    flex items-center
                    justify-between gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        text-[#777168]
                      "
                    >
                      Estimated amount
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-[#8B857C]
                      "
                    >
                      Rs.{" "}
                      {issueUnitPrice.toFixed(2)}
                      {" / "}
                      {getInventoryIssueUnit(
                        selectedMedicine
                      )}
                    </p>
                  </div>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-[#173C32]
                    "
                  >
                    Rs.{" "}
                    {estimatedTotal.toFixed(2)}
                  </p>
                </div>
              </div>


              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div
                  className="
                    rounded-xl
                    border border-[#E4CAC5]
                    bg-[#F8ECE9]
                    px-4 py-3
                    text-sm
                    font-medium
                    text-[#8B554D]
                  "
                >
                  {error}
                </div>
              )}


              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div
                className="
                  flex flex-col-reverse
                  gap-3
                  border-t border-[#E7E1D5]
                  pt-5
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="
                    rounded-xl
                    border border-[#CFC6B7]
                    bg-white
                    px-5 py-3
                    text-sm
                    font-semibold
                    text-[#173C32]
                    transition
                    hover:bg-[#F7F4EC]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    loading ||
                    !form.inventory_item_id
                  }
                  className="
                    flex items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#173C32]
                    px-5 py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#245346]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {saving ? (
                    <>
                      <FiLoader
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiEdit2 size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}