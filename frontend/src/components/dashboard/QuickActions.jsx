import {
  FiUserPlus,
  FiCalendar,
  FiClipboard,
  FiCreditCard,
} from "react-icons/fi";

const actions = [
  {
    title: "New Patient",
    icon: <FiUserPlus size={24} />,
  },
  {
    title: "Book Appointment",
    icon: <FiCalendar size={24} />,
  },
  {
    title: "Add Treatment",
    icon: <FiClipboard size={24} />,
  },
  {
    title: "Generate Invoice",
    icon: <FiCreditCard size={24} />,
  },
];

function QuickActions() {
  return (
    <div
  className="
flex
flex-col
items-center
justify-center
gap-3
rounded-2xl
border
border-[#D9D2C3]
bg-[#FAF8F2]
p-6
hover:bg-[#EEF5EA]
hover:border-[#8AA17B]
hover:shadow-md
hover:-translate-y-1
transition-all
duration-300
group
"
>
      <h2 className="text-2xl font-bold text-[#556B55] mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#D9D2C3] bg-[#FAF8F2] p-6 transition hover:scale-105
transition-all
duration-300 hover:text-white"
          >
            <div className="text-[#556B55] group-hover:scale-110 transition-transform duration-300">
  {action.icon}
</div>

            <span className="font-medium text-center">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;