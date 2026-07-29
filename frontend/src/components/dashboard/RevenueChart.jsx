import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { revenueData } from "../../utils/dashboardData";

function RevenueChart() {
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
      <h2 className="text-xl font-semibold text-[#4B5A45] mb-6">
        Revenue Overview
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEE8DD" />

          <XAxis
            dataKey="month"
            stroke="#7A8B73"
          />

          <YAxis
            stroke="#7A8B73"
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#7A8B73"
            fill="#D9E5D3"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;