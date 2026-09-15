
import { useEffect, useState } from "react";
import {
  FiCheck,
  FiX,
} from "react-icons/fi";

const normalizePlan = (plan) => {
  const value = String(plan || "").toUpperCase();

  if (value === "BASIC") return "Basic";
  if (value === "STANDARD") return "Standard";
  if (value === "PREMIUM") return "Premium";

  return plan || "Plan";
};

const formatPrice = (
  price,
  currency = "PKR"
) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `${currency} ${price}`;
  }

  return `${currency} ${new Intl.NumberFormat(
    "en-PK",
    {
      maximumFractionDigits: 2,
    }
  ).format(numericPrice)}`;
};

export default function ChangePlanModal({
  subscription,
  plans,
  open,
  onClose,
  onChange,
  changing,
}) {
  const [selectedPlan, setSelectedPlan] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!subscription) return;

    setSelectedPlan(
      String(
        subscription.plan || ""
      ).toUpperCase()
    );

    setError("");
  }, [subscription]);

  if (!open || !subscription) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError(
        "Please select a plan."
      );
      return;
    }

    const selectedConfig =
      plans.find(
        (plan) =>
          String(
            plan.plan || ""
          ).toUpperCase() ===
          selectedPlan
      );

    if (
      selectedConfig &&
      !selectedConfig.is_active &&
      selectedPlan !==
        String(
          subscription.plan || ""
        ).toUpperCase()
    ) {
      setError(
        "This plan is currently inactive."
      );
      return;
    }

    try {
      setError("");

      await onChange(
        subscription.tenant_id,
        selectedPlan
      );
    } catch (err) {
      setError(
        err?.message ||
          "Failed to change the subscription plan."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173B32]/55 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#d8cfbf] bg-[#fffdf7] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#e8e1d4] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A58B52]">
              Clinic Subscription
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#173B32]">
              Change Subscription Plan
            </h2>

            <p className="mt-1 text-sm text-[#737a75]">
              Clinic #
              {subscription.tenant_id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={changing}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#66706a] hover:bg-[#f1ede4] hover:text-[#173B32]"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-90px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const planKey =
                String(
                  plan.plan || ""
                ).toUpperCase();

              const isSelected =
                selectedPlan ===
                planKey;

              const isCurrent =
                String(
                  subscription.plan ||
                    ""
                ).toUpperCase() ===
                planKey;

              const isInactive =
                !plan.is_active;

              return (
                <button
                  type="button"
                  key={
                    plan.id ||
                    plan.plan
                  }
                  onClick={() => {
                    if (
                      isInactive &&
                      !isCurrent
                    ) {
                      return;
                    }

                    setSelectedPlan(
                      planKey
                    );
                    setError("");
                  }}
                  disabled={
                    isInactive &&
                    !isCurrent
                  }
                  className={`relative rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[#173B32] bg-[#edf3ed] ring-2 ring-[#d7e4d7]"
                      : "border-[#ded6c6] bg-[#fcfaf5] hover:border-[#A58B52]"
                  } ${
                    isInactive &&
                    !isCurrent
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32] text-white">
                      <FiCheck
                        size={13}
                      />
                    </span>
                  )}

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A58B52]">
                    {normalizePlan(
                      plan.plan
                    )}
                  </p>

                  <p className="mt-2 text-lg font-bold text-[#173B32]">
                    {formatPrice(
                      plan.price,
                      plan.currency
                    )}
                  </p>

                  <p className="mt-1 text-xs text-[#777f79]">
                    /{" "}
                    {plan.billing_interval ||
                      "monthly"}
                  </p>

                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#69736c]">
                    {plan.description ||
                      "No description configured."}
                  </p>

                  <div className="mt-3">
                    {isCurrent && (
                      <span className="inline-flex rounded-full bg-[#e7eee7] px-2.5 py-1 text-[11px] font-bold text-[#315542]">
                        Current plan
                      </span>
                    )}

                    {!isCurrent &&
                      isInactive && (
                        <span className="inline-flex rounded-full bg-[#eeeae1] px-2.5 py-1 text-[11px] font-bold text-[#77746d]">
                          Inactive
                        </span>
                      )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e8e1d4] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={changing}
              className="rounded-xl border border-[#d1c8b8] px-5 py-2.5 text-sm font-semibold text-[#526058] hover:bg-[#f7f3e9] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                changing ||
                !selectedPlan
              }
              className="rounded-xl bg-[#173B32] px-5 py-2.5 text-sm font-semibold text-[#F7F3E9] hover:bg-[#23483a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changing
                ? "Changing..."
                : "Change Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
