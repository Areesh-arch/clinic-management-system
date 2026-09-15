import {
  FiUsers,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";


function StatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-[#E6E1D8] bg-[#FCFBF8] p-5 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8B948D]">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#173B32]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#7A857D]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF3EB] text-lg text-[#315D4B]">
          {icon}
        </div>

      </div>

    </div>
  );
}


function SuperAdminStats({
  admins = [],
}) {
  const total = admins.length;

  const active = admins.filter(
    (admin) => admin.is_active === true
  ).length;

  const inactive = admins.filter(
    (admin) => admin.is_active === false
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

      <StatCard
        icon={<FiUsers />}
        label="Total Admins"
        value={total}
        description="Platform administrators"
      />

      <StatCard
        icon={<FiUserCheck />}
        label="Active"
        value={active}
        description="Currently active accounts"
      />

      <StatCard
        icon={<FiUserX />}
        label="Inactive"
        value={inactive}
        description="Disabled administrator accounts"
      />

    </div>
  );
}


export default SuperAdminStats;