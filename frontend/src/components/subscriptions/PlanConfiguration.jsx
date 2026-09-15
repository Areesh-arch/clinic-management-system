
import PlanCard from "./PlanCard";

export default function PlanConfiguration({
  plans,
  onEdit,
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#173B32]">
          Plan Configuration
        </h2>

        <p className="mt-1 text-sm text-[#737a75]">
          Manage pricing, billing intervals,
          descriptions and included features.
        </p>
      </div>

      {plans?.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id || plan.plan}
              plan={plan}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#ded6c6] bg-[#fffdf7] px-6 py-10 text-center">
          <p className="font-semibold text-[#173B32]">
            No subscription plans found.
          </p>

          <p className="mt-1 text-sm text-[#737a75]">
            Configure your plans from the backend
            before managing them here.
          </p>
        </div>
      )}
    </section>
  );
}
