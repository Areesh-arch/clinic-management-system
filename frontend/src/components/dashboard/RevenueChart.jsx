import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function RevenueChart({ data = [] }) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border border-slate-200
        shadow-sm
        hover:-translate-y-1
        transition-transform
        duration-300
        p-8
      "
    >
      <h2 className="text-xl font-semibold text-[#4B5A45] mb-6">
        Revenue Overview
      </h2>

      {data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center">
          <p className="text-slate-400">
            No revenue data available.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EEE8DD"
            />

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
      )}
    </div>
  );
}

export default RevenueChart;