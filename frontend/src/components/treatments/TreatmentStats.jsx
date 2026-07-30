import treatmentData from "../../utils/treatmentData";

function TreatmentStats() {

  const total = treatmentData.length;

  const completed = treatmentData.filter(
    (t) => t.status === "Completed"
  ).length;

  const scheduled = treatmentData.filter(
    (t) => t.status === "Scheduled"
  ).length;

  const progress = treatmentData.filter(
    (t) => t.status === "In Progress"
  ).length;

  const card =
    "bg-white rounded-2xl shadow-sm p-6 border border-[#E6E1D8]";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <div className={card}>
        <h3>Total Treatments</h3>
        <p className="text-3xl font-bold mt-3">{total}</p>
      </div>

      <div className={card}>
        <h3>Completed</h3>
        <p className="text-3xl font-bold mt-3">{completed}</p>
      </div>

      <div className={card}>
        <h3>Scheduled</h3>
        <p className="text-3xl font-bold mt-3">{scheduled}</p>
      </div>

      <div className={card}>
        <h3>In Progress</h3>
        <p className="text-3xl font-bold mt-3">{progress}</p>
      </div>

    </div>
  );
}

export default TreatmentStats;