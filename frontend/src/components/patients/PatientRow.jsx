import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

function PatientRow({ patient }) {
  const statusColor = {
    Active: "bg-green-100 text-green-700",
    "Follow-up": "bg-yellow-100 text-yellow-700",
    Inactive: "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-[#FAFBF8] transition-all">

      <td className="py-4 px-4 font-medium text-slate-800">
        {patient.name}
      </td>

      <td className="py-4 px-4">
        {patient.age}
      </td>

      <td className="py-4 px-4">
        {patient.gender}
      </td>

      <td className="py-4 px-4">
        {patient.phone}
      </td>

      <td className="py-4 px-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[patient.status]}`}
        >
          {patient.status}
        </span>
      </td>

      <td className="py-4 px-4">
        <div className="flex gap-4 text-slate-500">

          <button className="hover:text-[#556B55] transition">
            <FiEye />
          </button>

          <button className="hover:text-blue-600 transition">
            <FiEdit2 />
          </button>

          <button className="hover:text-red-600 transition">
            <FiTrash2 />
          </button>

        </div>
      </td>

    </tr>
  );
}

export default PatientRow;