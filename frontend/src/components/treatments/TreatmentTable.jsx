import treatmentData from "../../utils/treatmentData";
import TreatmentRow from "./TreatmentRow";

function TreatmentTable({
  search,
  doctor,
  status,
}) {

  const filteredTreatments = treatmentData.filter((item) => {

    const matchesSearch =
      item.patient.toLowerCase().includes(search.toLowerCase()) ||
      item.treatment.toLowerCase().includes(search.toLowerCase());

    const matchesDoctor =
      doctor === "All" || item.doctor === doctor;

    const matchesStatus =
      status === "All" || item.status === status;

    return (
      matchesSearch &&
      matchesDoctor &&
      matchesStatus
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E6E1D8]">

      <table className="w-full">

        <thead className="bg-[#F6F4EF]">

          <tr>

            <th className="text-left p-4">Patient</th>

            <th className="text-left p-4">Doctor</th>

            <th className="text-left p-4">Treatment</th>

            <th className="text-left p-4">Date</th>

            <th className="text-left p-4">Cost</th>

            <th className="text-left p-4">Status</th>

            <th className="text-left p-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredTreatments.map((treatment) => (

            <TreatmentRow
              key={treatment.id}
              treatment={treatment}
            />

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default TreatmentTable;