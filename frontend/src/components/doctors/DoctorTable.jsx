import doctors from "../../utils/doctorData";
import DoctorRow from "./DoctorRow";

function DoctorTable({ search, status }) {
  const filtered = doctors.filter((doctor) => {
    const matchSearch = doctor.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      status === "All" || doctor.status === status;

    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#F8F6F2]">
          <tr>
            <th className="p-4 text-left">Doctor</th>
            <th className="p-4 text-left">Specialization</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Experience</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((doctor) => (
            <DoctorRow
              key={doctor.id}
              doctor={doctor}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorTable;