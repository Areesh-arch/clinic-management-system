
import {
  FiArrowRight,
  FiCalendar,
  FiLayers,
} from "react-icons/fi";

const normalizePlan = (plan) => {
  const value = String(plan || "").toUpperCase();

  if (value === "BASIC") return "Basic";
  if (value === "STANDARD") return "Standard";
  if (value === "PREMIUM") return "Premium";

  return plan || "Unknown";
};

const normalizeStatus = (status) => {
  const value = String(status || "")
    .replaceAll("_", " ")
    .replaceAll("-", " ");

  return value
    ? value.charAt(0).toUpperCase() +
        value.slice(1).toLowerCase()
    : "Unknown";
};

const statusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "active") {
    return "bg-[#e4efe5] text-[#315c45]";
  }

  if (value === "trial") {
    return "bg-[#f8eed8] text-[#80672f]";
  }

  if (value === "expired") {
    return "bg-[#f6e3e1] text-[#92534e]";
  }

  return "bg-[#eeeae1] text-[#6e6b65]";
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default function SubscriptionTable({
  subscriptions,
  onChangePlan,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#ded6c6] bg-[#fffdf7] shadow-sm">
      <div className="flex flex-col gap-2 border-b border-[#e8e1d4] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <FiLayers
            className="text-[#A58B52]"
            size={18}
          />

          <h2 className="text-lg font-bold text-[#173B32]">
            Subscription Records
          </h2>
        </div>

        <p className="text-sm text-[#737a75]">
          {subscriptions.length} subscription
          {subscriptions.length === 1
            ? ""
            : "s"} found.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="font-semibold text-[#173B32]">
            No subscriptions found.
          </p>

          <p className="mt-1 text-sm text-[#737a75]">
            Try changing your filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left">
            <thead>
              <tr className="border-b border-[#e8e1d4] bg-[#f8f5ed]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#737a75]">
                  Clinic
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#737a75]">
                  Plan
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#737a75]">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#737a75]">
                  Start Date
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#737a75]">
                  End Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-[#737a75]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map(
                (subscription) => (
                  <tr
                    key={subscription.id}
                    className="border-b border-[#eee8dc] last:border-b-0 hover:bg-[#fcfaf5]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4ede5] text-sm font-bold text-[#173B32]">
                          #
                        </div>

                        <div>
                          <p className="font-semibold text-[#173B32]">
                            Clinic #
                            {subscription.tenant_id}
                          </p>

                          <p className="mt-0.5 text-xs text-[#858b87]">
                            Subscription #
                            {subscription.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-[#edf1ec] px-3 py-1.5 text-xs font-bold text-[#315542]">
                        {normalizePlan(
                          subscription.plan
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(
                          subscription.status
                        )}`}
                      >
                        {normalizeStatus(
                          subscription.status
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-[#536058]">
                        <FiCalendar
                          size={14}
                          className="text-[#A58B52]"
                        />

                        {formatDate(
                          subscription.starts_at
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-[#536058]">
                      {formatDate(
                        subscription.ends_at
                      )}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onChangePlan(
                            subscription
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#173B32] px-3.5 py-2.5 text-xs font-bold text-[#F7F3E9] transition hover:bg-[#23483a]"
                      >
                        Change Plan
                        <FiArrowRight
                          size={14}
                        />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
