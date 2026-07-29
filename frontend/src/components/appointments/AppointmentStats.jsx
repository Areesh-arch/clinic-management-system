import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

import StatCard from "../ui/StatCard";

function AppointmentStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        title="Today's Appointments"
        value="32"
        growth="+8%"
        icon={<FiCalendar size={24} />}
      />

      <StatCard
        title="Completed"
        value="18"
        growth="+5%"
        icon={<FiCheckCircle size={24} />}
      />

      <StatCard
        title="Pending"
        value="10"
        growth="+2%"
        icon={<FiClock size={24} />}
      />

      <StatCard
        title="Cancelled"
        value="4"
        growth="-1%"
        icon={<FiXCircle size={24} />}
      />

    </div>
  );
}

export default AppointmentStats;