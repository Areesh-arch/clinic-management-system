
import { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const normalizePlan = (plan) => {
  const value = String(plan || "").toUpperCase();

  if (value === "BASIC") return "Basic";
  if (value === "STANDARD") return "Standard";
  if (value === "PREMIUM") return "Premium";

  return plan || "Plan";
};

export default function EditPlanModal({
  plan,
  open,
  onClose,
  onSave,
  saving,
}) {
  const [form, setForm] = useState({
    display_name: "",
    price: "",
    currency: "PKR",
    billing_interval: "monthly",
    description: "",
    features: [],
    is_active: true,
  });

  const [featureInput, setFeatureInput] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!plan) return;

    setForm({
      display_name:
        plan.display_name || "",
      price:
        plan.price !== undefined &&
        plan.price !== null
          ? String(plan.price)
          : "",
      currency:
        plan.currency || "PKR",
      billing_interval:
        plan.billing_interval ||
        "monthly",
      description:
        plan.description || "",
      features: Array.isArray(
        plan.features
      )
        ? [...plan.features]
        : [],
      is_active:
        plan.is_active !== false,
    });

    setFeatureInput("");
    setError("");
  }, [plan]);

  if (!open || !plan) {
    return null;
  }

  const updateField = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addFeature = () => {
    const value =
      featureInput.trim();

    if (!value) return;

    const alreadyExists =
      form.features.some(
        (feature) =>
          String(feature).toLowerCase() ===
          value.toLowerCase()
      );

    if (alreadyExists) {
      setFeatureInput("");
      return;
    }

    setForm((previous) => ({
      ...previous,
      features: [
        ...previous.features,
        value,
      ],
    }));

    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setForm((previous) => ({
      ...previous,
      features:
        previous.features.filter(
          (_, featureIndex) =>
            featureIndex !== index
        ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const price = Number(form.price);

    if (
      form.display_name.trim() === ""
    ) {
      setError(
        "Display name is required."
      );
      return;
    }

    if (
      form.price === "" ||
      Number.isNaN(price) ||
      price < 0
    ) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (
      form.currency.trim() === ""
    ) {
      setError(
        "Currency is required."
      );
      return;
    }

    if (
      form.billing_interval.trim() === ""
    ) {
      setError(
        "Billing interval is required."
      );
      return;
    }

    try {
      await onSave(plan.plan, {
        display_name:
          form.display_name.trim(),

        price,

        currency:
          form.currency
            .trim()
            .toUpperCase(),

        billing_interval:
          form.billing_interval.trim(),

        description:
          form.description.trim(),

        features:
          form.features,

        is_active:
          form.is_active,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Failed to save the plan."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173B32]/55 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#d8cfbf] bg-[#fffdf7] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#e8e1d4] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A58B52]">
              Plan Configuration
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#173B32]">
              Edit{" "}
              {normalizePlan(
                plan.plan
              )}{" "}
              Plan
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#66706a] transition hover:bg-[#f1ede4] hover:text-[#173B32] disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(92vh-90px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#39483f]">
                Display Name
              </label>

              <input
                type="text"
                value={
                  form.display_name
                }
                onChange={(event) =>
                  updateField(
                    "display_name",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-4 py-3 text-sm text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#39483f]">
                Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-4 py-3 text-sm text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#39483f]">
                Currency
              </label>

              <input
                type="text"
                value={form.currency}
                onChange={(event) =>
                  updateField(
                    "currency",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-4 py-3 text-sm uppercase text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#39483f]">
                Billing Interval
              </label>

              <input
                type="text"
                value={
                  form.billing_interval
                }
                onChange={(event) =>
                  updateField(
                    "billing_interval",
                    event.target.value
                  )
                }
                placeholder="monthly"
                className="w-full rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-4 py-3 text-sm text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
              />
            </div>

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#39483f]">
                    Plan Active
                  </p>

                  <p className="mt-0.5 text-xs text-[#7b837e]">
                    Available for assignment
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    form.is_active
                  }
                  onChange={(event) =>
                    updateField(
                      "is_active",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 accent-[#173B32]"
                />
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#39483f]">
                Description
              </label>

              <textarea
                rows={3}
                value={
                  form.description
                }
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-4 py-3 text-sm text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#39483f]">
                Features
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(event) =>
                    setFeatureInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();
                      addFeature();
                    }
                  }}
                  placeholder="e.g. Billing"
                  className="min-w-0 flex-1 rounded-xl border border-[#d8cfbf] bg-[#fcfaf5] px-4 py-3 text-sm text-[#173B32] outline-none focus:border-[#6f8f7d] focus:ring-2 focus:ring-[#dfeadd]"
                />

                <button
                  type="button"
                  onClick={addFeature}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-[#173B32] px-4 py-3 text-sm font-semibold text-[#F7F3E9] hover:bg-[#23483a]"
                >
                  <FiPlus size={16} />
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {form.features.length >
                0 ? (
                  form.features.map(
                    (
                      feature,
                      index
                    ) => (
                      <span
                        key={`${feature}-${index}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[#d4dfd4] bg-[#edf3ed] px-3 py-1.5 text-sm text-[#315542]"
                      >
                        {feature}

                        <button
                          type="button"
                          onClick={() =>
                            removeFeature(
                              index
                            )
                          }
                          className="text-[#718078] hover:text-red-600"
                        >
                          <FiTrash2
                            size={13}
                          />
                        </button>
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-[#8a918c]">
                    No features added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e8e1d4] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[#d1c8b8] px-5 py-2.5 text-sm font-semibold text-[#526058] hover:bg-[#f7f3e9] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#173B32] px-5 py-2.5 text-sm font-semibold text-[#F7F3E9] hover:bg-[#23483a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
