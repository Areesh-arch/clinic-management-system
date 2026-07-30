import DoctorStatusBadge from "./DoctorStatusBadge";

function DoctorRow({ doctor }) {
  return (
    <tr className="border-b hover:bg-[#F9F9F9]">
      <td className="p-4">{doctor.name}</td>
      <td className="p-4">{doctor.specialization}</td>
      <td className="p-4">{doctor.phone}</td>
      <td className="p-4">{doctor.experience}</td>
      <td className="p-4">
        <DoctorStatusBadge status={doctor.status} />
      </td>
    </tr>
  );
}

export default DoctorRow;