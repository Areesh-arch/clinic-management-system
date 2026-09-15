
import {
  FiSearch,
  FiX,
} from "react-icons/fi";

const PLAN_OPTIONS = [
  "All Plans",
  "Basic",
  "Standard",
  "Premium",
];

const STATUS_OPTIONS = [
  "All Statuses",
  "Active",
  "Trial",
  "Expired",
];

export default function SubscriptionFilters({
  search,
  setSearch,
  planFilter,
  setPlanFilter,
  statusFilter,
  setStatusFilter,
}) {
  const hasFilters =
    search ||
    planFilter !== "All Plans" ||
    statusFilter !== "All Statuses";

  const clearFilters = () => {
    setSearch("");
    setPlanFilter("All Plans");
    setStatusFilter("All Statuses");
  };

  return (
    <section className="rounded-3xl border border-[#ded6c6] bg-[#fffdf7] p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#173B32]">
          Clinic Subscriptions
        </h2>

        <p className="mt-1 text-sm text-[#737a75]">
          Search and manage subscription plans
          assigned to clinics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        <div className="relative">
          <FiSearch
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a918c]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by clinic ID, plan or status..."
            className="w-full rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] py-2.5 pl-10 pr-4 text-sm text-[#173B32] outline-none transition placeholder:text-[#9a9d98] focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
          />
        </div>

        <select
          value={planFilter}
          onChange={(event) =>
            setPlanFilter(event.target.value)
          }
          className="rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-3.5 py-2.5 text-sm font-medium text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
        >
          {PLAN_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-3.5 py-2.5 text-sm font-medium text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8cfbf] px-4 py-2.5 text-sm font-semibold text-[#526058] transition hover:border-[#A58B52] hover:bg-[#f7f3e9]"
          >
            <FiX size={15} />
            Clear
          </button>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
