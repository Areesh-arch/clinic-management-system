import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

import { appointmentData } from "../../utils/dashboardData";

function AppointmentChart() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">

      <h2 className="text-3xl font-bold text-[#4D5C46] mb-6">
        Weekly Appointments
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={appointmentData}>
          <XAxis dataKey="day" />
          <Tooltip />
          <Bar
            dataKey="appointments"
            fill="#A8BFA1"
            radius={[8,8,0,0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default AppointmentChart;