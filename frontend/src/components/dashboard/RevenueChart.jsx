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
        w-full
        min-w-0
        bg-white
        rounded-2xl
        border border-[#E6E0D5]
        shadow-sm
        p-5
        sm:p-6
      "
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#4B5A45]">
          Revenue Overview
        </h2>

        <span className="text-xs text-[#8A918B]">
          Last 7 days
        </span>
      </div>

      {data.length === 0 ? (
        <div className="h-65 flex items-center justify-center">
          <p className="text-sm text-[#8A918B]">
            No revenue data available.
          </p>
        </div>
      ) : (
        <div className="w-full h-65">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#EEE8DD"
              />

              <XAxis
                dataKey="day"
                stroke="#7A8B73"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                stroke="#7A8B73"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `${value / 1000}k`
                    : value
                }
              />

              <Tooltip
                formatter={(value) => [
                  `PKR ${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                labelFormatter={(label) =>
                  `Day: ${label}`
                }
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7A9E7E"
                fill="#D9E5D3"
                strokeWidth={2}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default RevenueChart;