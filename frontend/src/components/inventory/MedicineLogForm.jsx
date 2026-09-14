import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import { getPatients } from "../../services/patientService";
import { getInventory } from "../../services/inventoryService";
import { getVisits } from "../../services/visitService";
import { createPrescription } from "../../services/prescriptionService";


const EMPTY_MEDICINE = {
  inventory_item_id: "",
  quantity: "",
  dosage: "",
  frequency: "",
  duration: "",
  notes: "",
};


export default function MedicineLogForm({
  onSuccess,
  onCancel,
}) {
  const [patients, setPatients] =
    useState([]);

  const [inventory, setInventory] =
    useState([]);

  const [visits, setVisits] =
    useState([]);

  const [patientId, setPatientId] =
    useState("");

  const [visitId, setVisitId] =
    useState("");

  const [medicines, setMedicines] =
    useState([
      { ...EMPTY_MEDICINE },
    ]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadFormData();
  }, []);


  const loadFormData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        patientsData,
        inventoryData,
        visitsData,
      ] = await Promise.all([
        getPatients(),
        getInventory(),
        getVisits(),
      ]);

      setPatients(
        Array.isArray(patientsData)
          ? patientsData
          : patientsData?.items || []
      );

      setInventory(
        Array.isArray(inventoryData)
          ? inventoryData
          : inventoryData?.items || []
      );

      setVisits(
        Array.isArray(visitsData)
          ? visitsData
          : visitsData?.items || []
      );
    } catch (err) {
      console.error(
        "Failed to load medicine form data:",
        err
      );

      setError(
        err?.message ||
          "Unable to load patients, visits or medicines."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // PATIENT VISITS
  // =========================================================

  const patientVisits = useMemo(() => {
    if (!patientId) {
      return [];
    }

    return visits
      .filter(
        (visit) =>
          String(visit.patient_id) ===
          String(patientId)
      )
      .sort(
        (a, b) =>
          new Date(b.visit_time) -
          new Date(a.visit_time)
      );
  }, [patientId, visits]);


  // =========================================================
  // AVAILABLE MEDICINES
  // =========================================================

  const availableInventory = useMemo(() => {
    return inventory.filter(
      (medicine) =>
        Number(medicine.quantity || 0) > 0
    );
  }, [inventory]);


  // =========================================================
  // SELECTED PATIENT
  // =========================================================

  const selectedPatient = useMemo(() => {
    return patients.find(
      (patient) =>
        String(patient.id) ===
        String(patientId)
    );
  }, [patients, patientId]);


  // =========================================================
  // SELECTED VISIT
  // =========================================================

  const selectedVisit = useMemo(() => {
    return visits.find(
      (visit) =>
        String(visit.id) ===
        String(visitId)
    );
  }, [visits, visitId]);


  // =========================================================
  // TOTAL AMOUNT PREVIEW
  // =========================================================

  const totalAmount = useMemo(() => {
    return medicines.reduce(
      (total, medicine) => {
        const inventoryItem =
          inventory.find(
            (item) =>
              String(item.id) ===
              String(
                medicine.inventory_item_id
              )
          );

        const price = Number(
          inventoryItem?.selling_price || 0
        );

        const quantity = Number(
          medicine.quantity || 0
        );

        return total + price * quantity;
      },
      0
    );
  }, [medicines, inventory]);


  // =========================================================
  // PATIENT CHANGE
  // =========================================================

  const handlePatientChange = (e) => {
    const value = e.target.value;

    setPatientId(value);

    // Reset visit when patient changes
    setVisitId("");

    setError("");
    setSuccess("");
  };


  // =========================================================
  // VISIT CHANGE
  // =========================================================

  const handleVisitChange = (e) => {
    setVisitId(e.target.value);

    setError("");
    setSuccess("");
  };


  // =========================================================
  // MEDICINE CHANGE
  // =========================================================

  const handleMedicineChange = (
    index,
    field,
    value
  ) => {
    setMedicines((previous) =>
      previous.map((medicine, medicineIndex) =>
        medicineIndex === index
          ? {
              ...medicine,
              [field]: value,
            }
          : medicine
      )
    );

    setError("");
    setSuccess("");
  };


  // =========================================================
  // ADD MEDICINE ROW
  // =========================================================

  const addMedicine = () => {
    setMedicines((previous) => [
      ...previous,
      {
        ...EMPTY_MEDICINE,
      },
    ]);
  };


  // =========================================================
  // REMOVE MEDICINE ROW
  // =========================================================

  const removeMedicine = (index) => {
    if (medicines.length === 1) {
      return;
    }

    setMedicines((previous) =>
      previous.filter(
        (_, medicineIndex) =>
          medicineIndex !== index
      )
    );
  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -------------------------------------------------------
    // PATIENT
    // -------------------------------------------------------

    if (!patientId) {
      setError(
        "Please select a patient."
      );
      return;
    }

    // -------------------------------------------------------
    // VISIT
    // -------------------------------------------------------

    if (!visitId) {
      setError(
        "Please select the patient's visit."
      );
      return;
    }

    // -------------------------------------------------------
    // MEDICINES
    // -------------------------------------------------------

    for (let index = 0; index < medicines.length; index++) {
      const medicine = medicines[index];

      if (!medicine.inventory_item_id) {
        setError(
          `Please select a medicine for item ${
            index + 1
          }.`
        );
        return;
      }

      if (
        !medicine.quantity ||
        Number(medicine.quantity) <= 0
      ) {
        setError(
          `Please enter a valid quantity for medicine ${
            index + 1
          }.`
        );
        return;
      }

      if (!medicine.dosage.trim()) {
        setError(
          `Please enter the dosage for medicine ${
            index + 1
          }.`
        );
        return;
      }

      if (!medicine.frequency.trim()) {
        setError(
          `Please enter the frequency for medicine ${
            index + 1
          }.`
        );
        return;
      }

      if (!medicine.duration.trim()) {
        setError(
          `Please enter the duration for medicine ${
            index + 1
          }.`
        );
        return;
      }

      const inventoryItem =
        inventory.find(
          (item) =>
            String(item.id) ===
            String(
              medicine.inventory_item_id
            )
        );

      if (!inventoryItem) {
        setError(
          `Selected medicine could not be found.`
        );
        return;
      }

      if (
        Number(medicine.quantity) >
        Number(inventoryItem.quantity || 0)
      ) {
        setError(
          `Not enough stock for ${inventoryItem.name}. Available stock: ${inventoryItem.quantity}.`
        );
        return;
      }
    }


    // -------------------------------------------------------
    // CREATE PAYLOAD
    // -------------------------------------------------------

    const payload = {
      visit_id: Number(visitId),

      instructions: null,

      items: medicines.map(
        (medicine) => ({
          inventory_item_id:
            Number(
              medicine.inventory_item_id
            ),

          dosage:
            medicine.dosage.trim(),

          frequency:
            medicine.frequency.trim(),

          duration:
            medicine.duration.trim(),

          quantity:
            Number(medicine.quantity),

          notes:
            medicine.notes.trim() || null,
        })
      ),
    };


    try {
      setSaving(true);

      await createPrescription(
        payload
      );

      setSuccess(
        "Medicine issued successfully. Stock has been updated."
      );

      if (onSuccess) {
        await onSuccess();
      }

    } catch (err) {
      console.error(
        "Failed to issue medicine:",
        err
      );

      setError(
        err?.message ||
          "Failed to issue medicine."
      );
    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#DDE5DE] border-t-[#173B32]" />

          <p className="mt-3 text-sm text-[#7B8780]">
            Loading medicine information...
          </p>
        </div>
      </div>
    );
  }


  // =========================================================
  // FORM
  // =========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-[#E7CFCA] bg-[#FFF4F1] px-4 py-3">
          <FiAlertCircle
            className="mt-0.5 shrink-0 text-[#A34E4A]"
            size={18}
          />

          <p className="text-sm font-medium leading-5 text-[#914942]">
            {error}
          </p>
        </div>
      )}


      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-[#D3E4D7] bg-[#F0F7F1] px-4 py-3">
          <FiCheckCircle
            className="mt-0.5 shrink-0 text-[#4C7558]"
            size={18}
          />

          <p className="text-sm font-medium leading-5 text-[#42664C]">
            {success}
          </p>
        </div>
      )}


      {/* ================================================= */}
      {/* PATIENT + VISIT */}
      {/* ================================================= */}

      <section className="rounded-2xl border border-[#E6E1D6] bg-[#FAF8F2] p-4 sm:p-5">

        <div className="mb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#B4935A]">
            Patient Visit
          </p>

          <h3 className="mt-1 text-base font-bold text-[#173B32]">
            Select patient and visit
          </h3>

          <p className="mt-1 text-xs text-[#7D8882]">
            Medicines are issued against a recorded patient visit.
          </p>
        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* PATIENT */}

          <Field
            label="Patient"
            required
          >
            <select
              value={patientId}
              onChange={handlePatientChange}
              className={inputClass}
              required
            >
              <option value="">
                Select patient
              </option>

              {patients.map((patient) => {
                const name =
                  `${patient.first_name || ""} ${
                    patient.last_name || ""
                  }`.trim();

                return (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {name || "Unnamed Patient"}
                    {patient.medical_record_number
                      ? ` — ${patient.medical_record_number}`
                      : ""}
                  </option>
                );
              })}
            </select>
          </Field>


          {/* VISIT */}

          <Field
            label="Visit"
            required
          >
            <select
              value={visitId}
              onChange={handleVisitChange}
              disabled={!patientId}
              className={`${inputClass} ${
                !patientId
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
              required
            >
              <option value="">
                {!patientId
                  ? "Select patient first"
                  : patientVisits.length
                    ? "Select visit"
                    : "No visits found"}
              </option>

              {patientVisits.map(
                (visit) => (
                  <option
                    key={visit.id}
                    value={visit.id}
                  >
                    {formatDateTime(
                      visit.visit_time
                    )}{" "}
                    — Visit #{visit.id}
                  </option>
                )
              )}
            </select>
          </Field>

        </div>


        {/* SELECTED PATIENT INFO */}

        {selectedPatient && (
          <div className="mt-4 rounded-xl border border-[#DDE7DF] bg-white p-3.5">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-[#173B32]">
                  {`${selectedPatient.first_name || ""} ${
                    selectedPatient.last_name || ""
                  }`.trim()}
                </p>

                <p className="mt-0.5 text-xs text-[#7E8983]">
                  MRN:{" "}
                  {selectedPatient.medical_record_number ||
                    "—"}
                </p>
              </div>

              {selectedVisit && (
                <span className="inline-flex w-fit rounded-full bg-[#EAF1EB] px-3 py-1 text-[11px] font-semibold text-[#4E705A]">
                  Visit #{selectedVisit.id}
                </span>
              )}

            </div>

          </div>
        )}

      </section>


      {/* ================================================= */}
      {/* MEDICINES */}
      {/* ================================================= */}

      <section>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#B4935A]">
              Medicines
            </p>

            <h3 className="mt-1 text-base font-bold text-[#173B32]">
              Issue from clinic stock
            </h3>

            <p className="mt-1 text-xs text-[#7D8882]">
              Only medicines currently available in inventory can be issued.
            </p>
          </div>

          <button
            type="button"
            onClick={addMedicine}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#CFC8B8] bg-[#FFFDF8] px-4 py-2.5 text-xs font-semibold text-[#52675C] transition-colors hover:border-[#B4935A] hover:bg-[#F8F3E7] hover:text-[#173B32] sm:w-auto"
          >
            <FiPlus size={15} />
            Add Medicine
          </button>

        </div>


        <div className="space-y-4">

          {medicines.map(
            (medicine, index) => {

              const selectedInventory =
                inventory.find(
                  (item) =>
                    String(item.id) ===
                    String(
                      medicine.inventory_item_id
                    )
                );

              const itemAmount =
                Number(
                  selectedInventory?.selling_price ||
                    0
                ) *
                Number(
                  medicine.quantity || 0
                );

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E5E0D5] bg-[#FFFDF8] p-4 shadow-[0_3px_12px_rgba(23,59,50,0.035)]"
                >

                  {/* ROW HEADER */}

                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E7F0E9] text-xs font-bold text-[#173B32]">
                        {index + 1}
                      </span>

                      <span className="text-sm font-semibold text-[#31483E]">
                        Medicine
                      </span>

                    </div>


                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeMedicine(index)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A625B] transition-colors hover:bg-[#FBEDEC] hover:text-[#A34E4A]"
                        aria-label="Remove medicine"
                      >
                        <FiTrash2
                          size={16}
                        />
                      </button>
                    )}

                  </div>


                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* MEDICINE */}

                    <Field
                      label="Medicine"
                      required
                      className="md:col-span-2"
                    >
                      <select
                        value={
                          medicine.inventory_item_id
                        }
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "inventory_item_id",
                            e.target.value
                          )
                        }
                        className={inputClass}
                        required
                      >
                        <option value="">
                          Select medicine from inventory
                        </option>

                        {availableInventory.map(
                          (item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                              {item.brand
                                ? ` — ${item.brand}`
                                : ""}{" "}
                              • Stock:{" "}
                              {item.quantity}
                            </option>
                          )
                        )}
                      </select>
                    </Field>


                    {/* QUANTITY */}

                    <Field
                      label="Quantity"
                      required
                    >
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={
                          medicine.quantity
                        }
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 10"
                        className={inputClass}
                        required
                      />
                    </Field>


                    {/* DOSAGE */}

                    <Field
                      label="Dosage"
                      required
                    >
                      <input
                        type="text"
                        value={
                          medicine.dosage
                        }
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 1 tablet"
                        className={inputClass}
                        required
                      />
                    </Field>


                    {/* FREQUENCY */}

                    <Field
                      label="Frequency"
                      required
                    >
                      <input
                        type="text"
                        value={
                          medicine.frequency
                        }
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 1 daily"
                        className={inputClass}
                        required
                      />
                    </Field>


                    {/* DURATION */}

                    <Field
                      label="Duration"
                      required
                    >
                      <input
                        type="text"
                        value={
                          medicine.duration
                        }
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 10 days"
                        className={inputClass}
                        required
                      />
                    </Field>


                    {/* NOTES */}

                    <Field
                      label="Notes"
                      className="md:col-span-2"
                    >
                      <textarea
                        value={
                          medicine.notes
                        }
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "notes",
                            e.target.value
                          )
                        }
                        rows="2"
                        placeholder="Optional instructions..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>

                  </div>


                  {/* AMOUNT */}

                  {selectedInventory && (
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E8DFC9] bg-[#FBF6E9] px-4 py-3">

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B7650]">
                          Selling Price
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-[#66563B]">
                          Rs.{" "}
                          {formatAmount(
                            selectedInventory.selling_price
                          )}{" "}
                          /{" "}
                          {selectedInventory.unit ||
                            "unit"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B7650]">
                          Amount
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-[#173B32]">
                          Rs.{" "}
                          {formatAmount(
                            itemAmount
                          )}
                        </p>
                      </div>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* ================================================= */}
      {/* TOTAL */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-[#DCE5DE] bg-[#F4F8F4] p-4">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-semibold text-[#607268]">
              Total Medicine Amount
            </p>

            <p className="mt-1 text-[11px] text-[#87918B]">
              Based on current inventory selling prices.
            </p>
          </div>

          <p className="text-xl font-bold text-[#173B32]">
            Rs.{" "}
            {formatAmount(totalAmount)}
          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] pt-5 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="w-full rounded-xl border border-[#D9D5CA] bg-[#FFFDF8] px-5 py-3 text-sm font-semibold text-[#52645B] transition-colors hover:bg-[#F3F0E8] hover:text-[#173C32] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            !patientId ||
            !visitId
          }
          className="w-full rounded-xl bg-[#173B32] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(23,59,50,0.14)] transition-all hover:bg-[#245346] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {saving
            ? "Issuing Medicine..."
            : "Issue Medicine"}
        </button>

      </div>

    </form>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required = false,
  children,
  className = "",
}) {
  return (
    <label
      className={`block ${className}`}
    >
      <span className="mb-1.5 block text-xs font-semibold text-[#52645B]">
        {label}

        {required && (
          <span className="ml-1 text-[#A96B61]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}


/* =========================================================
   INPUT
========================================================= */

const inputClass =
  "w-full rounded-xl border border-[#DCD8CE] bg-[#FFFDF8] px-3.5 py-3 text-sm text-[#29483D] outline-none transition-all placeholder:text-[#A2A8A4] focus:border-[#6F8F7D] focus:ring-2 focus:ring-[#6F8F7D]/15";


/* =========================================================
   DATE
========================================================= */

function formatDateTime(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


/* =========================================================
   AMOUNT
========================================================= */

function formatAmount(value) {
  return Number(
    value || 0
  ).toLocaleString(
    "en-PK",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  );
}