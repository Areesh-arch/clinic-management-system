
import { FiRefreshCw } from "react-icons/fi";

export default function SubscriptionHeader({
  refreshing,
  onRefresh,
}) {
  return (
    <div className="rounded-3xl border border-[#ded6c6] bg-[#fffdf7] p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#A58B52]" />

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f8f7d]">
              Platform Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#173B32] sm:text-3xl">
            Subscription Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b756f]">
            Configure plans, pricing and clinic
            subscriptions from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cfc5b2] bg-[#f7f3e9] px-4 py-2.5 text-sm font-semibold text-[#173B32] transition hover:border-[#A58B52] hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>
    </div>
  );
}
