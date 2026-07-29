import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { appointmentData } from "../../utils/dashboardData";

function PatientChart() {
  return (
    <div
  className="
    bg-white
    rounded-3xl
    border border-slate-200
    shadow-sm
    hover:scale-105
    transition-all
    duration-300
    p-8
  "
>
      <h2 className="text-2xl font-bold mb-6 text-[#556B55]">
        Weekly Appointments
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={appointmentData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="appointments"
            fill="#A8B99A"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PatientChart;