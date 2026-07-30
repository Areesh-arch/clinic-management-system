import doctors from "../../utils/doctorData";

function DoctorStats() {
  const total = doctors.length;

  const available = doctors.filter(
    (d) => d.status === "Available"
  ).length;

  const busy = doctors.filter(
    (d) => d.status === "Busy"
  ).length;

  const leave = doctors.filter(
    (d) => d.status === "On Leave"
  ).length;

  return (
    <div className="grid md:grid-cols-4 gap-5">

      <div className="bg-white rounded-xl p-5 shadow">
        <p>Total Doctors</p>
        <h2 className="text-3xl font-bold">{total}</h2>
      </div>

      <div className="bg-white rounded-xl p-5 shadow">
        <p>Available</p>
        <h2 className="text-3xl font-bold text-green-600">
          {available}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-5 shadow">
        <p>Busy</p>
        <h2 className="text-3xl font-bold text-orange-500">
          {busy}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-5 shadow">
        <p>On Leave</p>
        <h2 className="text-3xl font-bold text-red-500">
          {leave}
        </h2>
      </div>

    </div>
  );
}

export default DoctorStats;