import { useMemo } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";

const FOREST = "#173B32";
const GOLD = "#B4935A";
const IVORY = "#F7F3E9";
const SAGE = "#6F8F7D";

// =====================================================
// HELPERS
// =====================================================

function formatMoney(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function getPatientName(item) {
  return (
    item?.patient_name ||
    item?.patient?.name ||
    item?.patient?.full_name ||
    "Unknown Patient"
  );
}

function getPatientMrn(item) {
  return (
    item?.medical_record_number ||
    item?.patient?.medical_record_number ||
    "—"
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function OutstandingSection({
  outstanding = [],
  loading = false,
  onRefresh,
}) {
  const totalOutstanding = useMemo(() => {
    return outstanding.reduce(
      (total, item) =>
        total + Number(item?.outstanding_amount || 0),
      0
    );
  }, [outstanding]);

  const totalPaid = useMemo(() => {
    return outstanding.reduce(
      (total, item) =>
        total + Number(item?.total_paid || 0),
      0
    );
  }, [outstanding]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section
        className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        style={{
          borderColor: "#e9e2d3",
        }}
      >
        <div
          className="flex min-h-75 items-center justify-center"
          style={{ backgroundColor: IVORY }}
        >
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <FiLoader
              size={20}
              className="animate-spin"
              style={{ color: FOREST }}
            />
            Loading outstanding payments...
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{
        borderColor: "#e9e2d3",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="border-b px-5 py-5 sm:px-6"
        style={{
          backgroundColor: IVORY,
          borderColor: "#eee9dd",
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${GOLD}18`,
                color: "#7b622f",
              }}
            >
              <FiAlertCircle size={21} />
            </div>

            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: FOREST }}
              >
                Outstanding
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Track unpaid visit balances.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="rounded-xl border bg-white px-4 py-2.5"
              style={{
                borderColor: `${GOLD}45`,
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Outstanding
              </p>

              <p
                className="mt-0.5 text-base font-bold"
                style={{ color: "#9b7225" }}
              >
                Rs. {formatMoney(totalOutstanding)}
              </p>
            </div>

            {typeof onRefresh === "function" && (
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-[#fbf9f3]"
                style={{
                  borderColor: `${FOREST}22`,
                  color: FOREST,
                }}
              >
                <FiRefreshCw size={16} />
                Refresh
              </button>
            )}
          </div>
        </div>

        <div
          className="mt-4 h-0.75 w-full rounded-full"
          style={{
            backgroundColor: GOLD,
          }}
        />
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-3 border-b bg-white p-4 sm:grid-cols-2">
        <div
          className="rounded-xl border px-4 py-3"
          style={{
            borderColor: `${FOREST}18`,
            backgroundColor: `${FOREST}05`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Paid
              </p>

              <p
                className="mt-1 text-lg font-bold"
                style={{ color: FOREST }}
              >
                Rs. {formatMoney(totalPaid)}
              </p>
            </div>

            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${SAGE}18`,
                color: FOREST,
              }}
            >
              <FiDollarSign size={17} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border px-4 py-3"
          style={{
            borderColor: `${GOLD}35`,
            backgroundColor: `${GOLD}08`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pending Amount
              </p>

              <p
                className="mt-1 text-lg font-bold"
                style={{ color: "#9b7225" }}
              >
                Rs. {formatMoney(totalOutstanding)}
              </p>
            </div>

            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${GOLD}18`,
                color: "#9b7225",
              }}
            >
              <FiAlertCircle size={17} />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {outstanding.length === 0 ? (
        <div
          className="flex min-h-70 flex-col items-center justify-center px-6 py-12 text-center"
          style={{ backgroundColor: IVORY }}
        >
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: `${SAGE}18`,
              color: FOREST,
            }}
          >
            <FiCheckCircle size={29} />
          </div>

          <h3
            className="text-lg font-semibold"
            style={{ color: FOREST }}
          >
            No Outstanding Payments
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-500">
            All visit balances are currently settled.
          </p>
        </div>
      ) : (
        /* =================================================
           TABLE
        ================================================= */

        <div className="overflow-x-auto">
          <div className="min-w-237.5">
            {/* TABLE HEADER */}

            <div
              className="grid grid-cols-[1.6fr_1fr_1.1fr_1.1fr_1.2fr_1.1fr] gap-4 border-b px-5 py-3"
              style={{
                backgroundColor: "#fbfaf6",
                borderColor: "#eee9dd",
              }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Patient
              </span>

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Visit
              </span>

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Amount
              </span>

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Paid
              </span>

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Outstanding
              </span>

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Date
              </span>
            </div>

            {/* TABLE ROWS */}

            {outstanding.map((item) => {
              const outstandingAmount = Number(
                item?.outstanding_amount || 0
              );

              const isPaid = outstandingAmount <= 0;

              return (
                <div
                  key={item?.id}
                  className="grid grid-cols-[1.6fr_1fr_1.1fr_1.1fr_1.2fr_1.1fr] items-center gap-4 border-b px-5 py-4 transition last:border-b-0 hover:bg-[#fbf9f3]"
                  style={{
                    borderColor: "#eee9dd",
                  }}
                >
                  {/* PATIENT */}

                  <div className="min-w-0">
                    <p
                      className="truncate font-semibold"
                      style={{ color: FOREST }}
                    >
                      {getPatientName(item)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      MRN: {getPatientMrn(item)}
                    </p>
                  </div>

                  {/* VISIT */}

                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {item?.visit_id
                        ? `Visit #${item.visit_id}`
                        : "—"}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: FOREST }}
                    >
                      Rs. {formatMoney(item?.total_charge)}
                    </p>
                  </div>

                  {/* PAID */}

                  <div>
                    <p className="font-medium text-slate-600">
                      Rs. {formatMoney(item?.total_paid)}
                    </p>
                  </div>

                  {/* OUTSTANDING */}

                  <div>
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: isPaid
                          ? `${SAGE}18`
                          : `${GOLD}20`,
                        color: isPaid
                          ? FOREST
                          : "#8b6825",
                      }}
                    >
                      {isPaid
                        ? "Paid"
                        : `Rs. ${formatMoney(
                            outstandingAmount
                          )}`}
                    </span>
                  </div>

                  {/* DATE */}

                  <div className="text-sm text-slate-500">
                    {formatDate(
                      item?.updated_at ||
                        item?.created_at
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      {outstanding.length > 0 && (
        <div
          className="border-t px-5 py-3"
          style={{
            backgroundColor: "#fbfaf6",
            borderColor: "#eee9dd",
          }}
        >
          <p className="text-xs text-slate-400">
            Showing {outstanding.length} outstanding{" "}
            {outstanding.length === 1
              ? "record"
              : "records"}
            .
          </p>
        </div>
      )}
    </section>
  );
}