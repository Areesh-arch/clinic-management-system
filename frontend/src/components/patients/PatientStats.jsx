import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiRefreshCw,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Patients",
    value: "1,248",
    icon: <FiUsers size={24} />,
    color: "bg-[#EEF5EA] text-[#556B55]",
  },
  {
    title: "Active Patients",
    value: "986",
    icon: <FiUserCheck size={24} />,
    color: "bg-[#EEF5EA] text-[#556B55]",
  },
  {
    title: "New This Month",
    value: "58",
    icon: <FiUserPlus size={24} />,
    color: "bg-[#FFF8E8] text-[#B88A2D]",
  },
  {
    title: "Follow-ups",
    value: "147",
    icon: <FiRefreshCw size={24} />,
    color: "bg-[#EEF5EA] text-[#556B55]",
  },
];

function PatientStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            shadow-sm
            hover:shadow-lg
            hover:-translate-y-1
            transition-all
            duration-300
            p-6
          "
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {item.value}
              </h2>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
            >
              {item.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default PatientStats;