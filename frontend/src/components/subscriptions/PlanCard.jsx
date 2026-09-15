
import {
  FiCheck,
  FiEdit2,
  FiLock,
} from "react-icons/fi";

const formatPrice = (
  price,
  currency = "PKR"
) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `${currency} ${price}`;
  }

  try {
    return new Intl.NumberFormat(
      "en-PK",
      {
        maximumFractionDigits: 2,
      }
    ).format(numericPrice);
  } catch {
    return numericPrice.toLocaleString();
  }
};

const normalizePlan = (plan) => {
  const value = String(plan || "").toUpperCase();

  if (value === "BASIC") return "Basic";
  if (value === "STANDARD") return "Standard";
  if (value === "PREMIUM") return "Premium";

  return plan || "Plan";
};

export default function PlanCard({
  plan,
  onEdit,
}) {
  const planName = normalizePlan(
    plan?.plan
  );

  const features = Array.isArray(
    plan?.features
  )
    ? plan.features
    : [];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#ded6c6] bg-[#fffdf7] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-1.5 bg-[#173B32]" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A58B52]">
              {planName}
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#173B32]">
              {plan?.display_name ||
                planName}
            </h3>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              plan?.is_active
                ? "bg-[#e4efe5] text-[#315c45]"
                : "bg-[#eeeae1] text-[#77746d]"
            }`}
          >
            {plan?.is_active
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#173B32]">
              {formatPrice(
                plan?.price,
                plan?.currency
              )}
            </span>

            <span className="pb-1 text-sm text-[#7b827d]">
              {plan?.currency || "PKR"} /
              {plan?.billing_interval ||
                "monthly"}
            </span>
          </div>
        </div>

        <p className="mt-4 min-h-12 text-sm leading-6 text-[#6d756f]">
          {plan?.description ||
            "No description configured."}
        </p>

        <div className="my-5 h-px bg-[#e8e1d4]" />

        <div className="flex-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#7a817d]">
            Included features
          </p>

          {features.length > 0 ? (
            <div className="space-y-2.5">
              {features.map(
                (feature, index) => (
                  <div
                    key={`${feature}-${index}`}
                    className="flex items-start gap-2.5 text-sm text-[#44514a]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5eee5] text-[#315c45]">
                      <FiCheck size={12} />
                    </span>

                    <span>
                      {feature}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-[#8a8f8b]">
              No features configured.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEdit(plan)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#cfc5b2] bg-[#f7f3e9] px-4 py-2.5 text-sm font-semibold text-[#173B32] transition hover:border-[#A58B52] hover:bg-[#fff8e9]"
        >
          <FiEdit2 size={15} />
          Edit Plan
        </button>
      </div>
    </div>
  );
}
