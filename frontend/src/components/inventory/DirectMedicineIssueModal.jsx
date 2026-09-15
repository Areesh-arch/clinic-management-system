import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { getPatients } from "../../services/patientService";
import { issueMedicine } from "../../services/inventoryService";

export default function DirectMedicineIssueModal({
  medicines = [],
  onClose,
  onSuccess,
}) {
  const [recipientType, setRecipientType] =
    useState("patient");

  const [selectedMedicineId, setSelectedMedicineId] =
    useState("");

  const [quantity, setQuantity] = useState(1);

  const [customerName, setCustomerName] =
    useState("");

  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] =
    useState("");
  const [selectedPatientId, setSelectedPatientId] =
    useState("");

  const [patientsLoading, setPatientsLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setPatientsLoading(true);

        const data = await getPatients();

        setPatients(
          Array.isArray(data)
            ? data
            : data?.items ||
                data?.data ||
                []
        );
      } catch (err) {
        console.error(
          "Failed to load patients:",
          err
        );

        setPatients([]);
      } finally {
        setPatientsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const availableMedicines = useMemo(() => {
    return medicines.filter(
      (medicine) =>
        !medicine.is_archived &&
        Number(medicine.quantity || 0) > 0
    );
  }, [medicines]);

  const selectedMedicine = useMemo(() => {
    return availableMedicines.find(
      (medicine) =>
        String(medicine.id) ===
        String(selectedMedicineId)
    );
  }, [
    availableMedicines,
    selectedMedicineId,
  ]);

  const filteredPatients = useMemo(() => {
    const search =
      patientSearch.trim().toLowerCase();

    if (!search) {
      return patients.slice(0, 8);
    }

    return patients
      .filter((patient) => {
        const name = String(
          patient.name ||
            patient.full_name ||
            ""
        ).toLowerCase();

        const mrn = String(
          patient.medical_record_number ||
            patient.mrn ||
            ""
        ).toLowerCase();

        return (
          name.includes(search) ||
          mrn.includes(search)
        );
      })
      .slice(0, 8);
  }, [patients, patientSearch]);

  const totalAmount =
    selectedMedicine && quantity
      ? Number(selectedMedicine.selling_price || 0) *
        Number(quantity || 0)
      : 0;

  const handleRecipientChange = (type) => {
    setRecipientType(type);
    setError("");

    if (type === "patient") {
      setCustomerName("");
    } else {
      setSelectedPatientId("");
      setPatientSearch("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedMedicine) {
      setError("Please select a medicine.");
      return;
    }

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      setError(
        "Quantity must be at least 1."
      );
      return;
    }

    if (
      requestedQuantity >
      Number(selectedMedicine.quantity || 0)
    ) {
      setError(
        `Only ${selectedMedicine.quantity} ${selectedMedicine.issue_unit || selectedMedicine.unit || "units"} available in stock.`
      );
      return;
    }

    if (
      recipientType === "patient" &&
      !selectedPatientId
    ) {
      setError(
        "Please select a patient."
      );
      return;
    }

    try {
      setSubmitting(true);

      await issueMedicine(
        selectedMedicine.id,
        {
          patient_id:
            recipientType === "patient"
              ? selectedPatientId
              : null,

          customer_name:
            recipientType === "walk_in"
              ? customerName.trim() ||
                "Walk-in Customer"
              : null,

          quantity: requestedQuantity,
        }
      );

      setSuccess(
        "Medicine issued successfully and stock has been updated."
      );

      if (onSuccess) {
        await onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 700);
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
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#173B32]/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFDF8] shadow-[0_24px_70px_rgba(23,59,50,0.22)]"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-[#E7E1D5] bg-[#F8F5ED] px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3EEE6] text-[#173B32]">
              <FiPackage size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#173B32] sm:text-xl">
                Direct Medicine Issue
              </h2>

              <p className="mt-1 text-xs text-[#7D8882] sm:text-sm">
                Issue medicine directly from clinic stock.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#718078] transition-colors hover:bg-[#EDEAE2] hover:text-[#173B32]"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
            {/* RECIPIENT */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#29483D]">
                Recipient
              </label>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    handleRecipientChange(
                      "patient"
                    )
                  }
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    recipientType === "patient"
                      ? "border-[#6F8F7D] bg-[#EAF1EC] text-[#173B32] shadow-sm"
                      : "border-[#DDD7CA] bg-[#FFFDF8] text-[#65736C] hover:border-[#AFC0B5]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      recipientType === "patient"
                        ? "bg-[#173B32] text-white"
                        : "bg-[#F0EEE7] text-[#6F7D75]"
                    }`}
                  >
                    <FiUser size={17} />
                  </span>

                  <span>
                    <span className="block text-sm font-semibold">
                      Existing Patient
                    </span>

                    <span className="mt-0.5 block text-xs opacity-75">
                      Link medicine to patient
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleRecipientChange(
                      "walk_in"
                    )
                  }
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    recipientType === "walk_in"
                      ? "border-[#6F8F7D] bg-[#EAF1EC] text-[#173B32] shadow-sm"
                      : "border-[#DDD7CA] bg-[#FFFDF8] text-[#65736C] hover:border-[#AFC0B5]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      recipientType === "walk_in"
                        ? "bg-[#173B32] text-white"
                        : "bg-[#F0EEE7] text-[#6F7D75]"
                    }`}
                  >
                    <FiUsers size={17} />
                  </span>

                  <span>
                    <span className="block text-sm font-semibold">
                      Walk-in / Non-patient
                    </span>

                    <span className="mt-0.5 block text-xs opacity-75">
                      No patient record required
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* PATIENT */}
            {recipientType === "patient" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#29483D]">
                  Patient
                </label>

                <input
                  type="text"
                  value={patientSearch}
                  onChange={(event) => {
                    setPatientSearch(
                      event.target.value
                    );
                    setSelectedPatientId("");
                  }}
                  placeholder="Search patient by name or MRN..."
                  className="w-full rounded-xl border border-[#DCD8CE] bg-[#FFFDF8] px-3.5 py-3 text-sm text-[#29483D] outline-none transition-all placeholder:text-[#A2A8A4] focus:border-[#6F8F7D] focus:ring-2 focus:ring-[#6F8F7D]/15"
                />

                {selectedPatientId && (
                  <div className="mt-2 flex items-center justify-between rounded-xl border border-[#C9D9CF] bg-[#EDF5EF] px-3 py-2.5">
                    <span className="text-sm font-medium text-[#173B32]">
                      {
                        patients.find(
                          (patient) =>
                            String(
                              patient.id
                            ) ===
                            String(
                              selectedPatientId
                            )
                        )?.name
                      }
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(
                          ""
                        );
                        setPatientSearch(
                          ""
                        );
                      }}
                      className="text-xs font-semibold text-[#6F5D3F] hover:text-[#173B32]"
                    >
                      Change
                    </button>
                  </div>
                )}

                {!selectedPatientId &&
                  patientSearch.trim() && (
                    <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-[#E3DED3] bg-white shadow-sm">
                      {patientsLoading ? (
                        <div className="px-4 py-4 text-center text-sm text-[#7B8580]">
                          Loading patients...
                        </div>
                      ) : filteredPatients.length >
                        0 ? (
                        filteredPatients.map(
                          (patient) => (
                            <button
                              key={
                                patient.id
                              }
                              type="button"
                              onClick={() => {
                                setSelectedPatientId(
                                  patient.id
                                );

                                setPatientSearch(
                                  patient.name ||
                                    patient.full_name ||
                                    ""
                                );
                              }}
                              className="flex w-full items-center justify-between border-b border-[#F0ECE3] px-4 py-3 text-left last:border-b-0 hover:bg-[#F7F4EC]"
                            >
                              <span className="text-sm font-semibold text-[#29483D]">
                                {patient.name ||
                                  patient.full_name ||
                                  "Unnamed Patient"}
                              </span>

                              <span className="text-xs text-[#8A938E]">
                                {patient.medical_record_number ||
                                  patient.mrn ||
                                  ""}
                              </span>
                            </button>
                          )
                        )
                      ) : (
                        <div className="px-4 py-4 text-center text-sm text-[#7B8580]">
                          No patient found.
                        </div>
                      )}
                    </div>
                  )}
              </div>
            )}

            {/* WALK-IN NAME */}
            {recipientType ===
              "walk_in" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#29483D]">
                  Customer Name
                  <span className="ml-1 text-xs font-normal text-[#929A95]">
                    (optional)
                  </span>
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Walk-in Customer"
                  className="w-full rounded-xl border border-[#DCD8CE] bg-[#FFFDF8] px-3.5 py-3 text-sm text-[#29483D] outline-none transition-all placeholder:text-[#A2A8A4] focus:border-[#6F8F7D] focus:ring-2 focus:ring-[#6F8F7D]/15"
                />
              </div>
            )}

            {/* MEDICINE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#29483D]">
                Medicine
              </label>

              <select
                value={selectedMedicineId}
                onChange={(event) => {
                  setSelectedMedicineId(
                    event.target.value
                  );
                  setQuantity(1);
                  setError("");
                }}
                className="w-full rounded-xl border border-[#DCD8CE] bg-[#FFFDF8] px-3.5 py-3 text-sm text-[#29483D] outline-none transition-all focus:border-[#6F8F7D] focus:ring-2 focus:ring-[#6F8F7D]/15"
              >
                <option value="">
                  Select medicine
                </option>

                {availableMedicines.map(
                  (medicine) => (
                    <option
                      key={medicine.id}
                      value={medicine.id}
                    >
                      {medicine.name} — Stock:{" "}
                      {medicine.quantity}
                    </option>
                  )
                )}
              </select>

              {availableMedicines.length ===
                0 && (
                <p className="mt-2 text-xs text-[#8B554D]">
                  No medicines with available stock.
                </p>
              )}
            </div>

            {/* MEDICINE INFO */}
            {selectedMedicine && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#E4DED1] bg-[#F8F5ED] p-4">
                  <p className="text-xs font-medium text-[#87918B]">
                    Available Stock
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#173B32]">
                    {selectedMedicine.quantity}
                    <span className="ml-1 text-xs font-medium text-[#718078]">
                      {selectedMedicine.issue_unit ||
                        selectedMedicine.unit ||
                        "unit"}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-[#E4DED1] bg-[#F8F5ED] p-4">
                  <p className="text-xs font-medium text-[#87918B]">
                    Selling Price
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#173B32]">
                    PKR{" "}
                    {Number(
                      selectedMedicine.selling_price ||
                        0
                    ).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-[#D8C9A8] bg-[#FBF6E9] p-4">
                  <p className="text-xs font-medium text-[#8A7959]">
                    Total Amount
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#80683D]">
                    PKR{" "}
                    {totalAmount.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#29483D]">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                max={
                  selectedMedicine?.quantity ||
                  undefined
                }
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-[#DCD8CE] bg-[#FFFDF8] px-3.5 py-3 text-sm text-[#29483D] outline-none transition-all focus:border-[#6F8F7D] focus:ring-2 focus:ring-[#6F8F7D]/15"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-[#E4CAC5] bg-[#F8ECE9] px-4 py-3">
                <FiAlertCircle
                  className="mt-0.5 shrink-0 text-[#9A5A50]"
                  size={18}
                />

                <p className="text-sm font-medium text-[#8B554D]">
                  {error}
                </p>
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-[#C8D9CE] bg-[#EDF5EF] px-4 py-3">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[#3F7258]"
                  size={18}
                />

                <p className="text-sm font-medium text-[#315E49]">
                  {success}
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#E7E1D5] bg-[#FAF8F2] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full rounded-xl border border-[#D8D2C5] bg-[#FFFDF8] px-5 py-3 text-sm font-semibold text-[#65736C] transition-colors hover:bg-[#F3F0E8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                availableMedicines.length === 0
              }
              className="w-full rounded-xl bg-[#173B32] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(23,60,50,0.14)] transition-all hover:bg-[#245346] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submitting
                ? "Issuing..."
                : "Issue Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}