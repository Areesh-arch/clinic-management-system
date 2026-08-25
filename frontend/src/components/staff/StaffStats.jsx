function StaffStats({ staff }) {
  const total = staff.length;

  const active = staff.filter(
    (member) => member.is_active
  ).length;

  const inactive = staff.filter(
    (member) => !member.is_active
  ).length;

  return (
    <div className="grid md:grid-cols-3 gap-5">

      <div className="bg-white rounded-xl p-5 shadow">
        <p>Total Staff</p>
        <h2 className="text-3xl font-bold">
          {total}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-5 shadow">
        <p>Active</p>
        <h2 className="text-3xl font-bold text-green-600">
          {active}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-5 shadow">
        <p>Inactive</p>
        <h2 className="text-3xl font-bold text-red-500">
          {inactive}
        </h2>
      </div>

    </div>
  );
}

export default StaffStats;