import {
  FiUserPlus,
  FiCalendar,
  FiClipboard,
  FiCreditCard,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "New Patient",
      icon: <FiUserPlus size={30} />,
      onClick: () => navigate("/patients?new=true"),
    },

    {
      title: "Book Appointment",
      icon: <FiCalendar size={30} />,
      onClick: () => navigate("/appointments?new=true"),
    },

    {
      title: "Add Treatment",
      icon: <FiClipboard size={30} />,
      onClick: () => navigate("/treatments?new=true"),
    },

    {
      title: "Generate Invoice",
      icon: <FiCreditCard size={30} />,
      onClick: () => navigate("/billing"),
    },
  ];

  return (
    <div
      className="
        bg-[#F7F4EC]
        rounded-3xl
        border border-[#DDD5C5]
        p-10
      "
    >
      <h2 className="text-3xl font-bold text-center text-[#556B55] mb-10">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            className="
              group
              bg-transparent
              border border-[#DDD5C5]
              rounded-3xl
              p-8
              min-h-[165px]
              flex
              flex-col
              items-center
              justify-center
              gap-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-md
              hover:bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-[#7A8B73]
            "
          >
            <div
              className="
                text-[#556B55]
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              {action.icon}
            </div>

            <span className="text-lg font-medium text-slate-800">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;