import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function PatientChart({ data = [] }) {
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
      <h2 className="text-2xl font-bold mb-6 text-[#556B55]">
        Weekly Appointments
      </h2>

      {data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center">
          <p className="text-slate-400">
            No appointment data available.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EEE8DD"
            />

            <XAxis
              dataKey="day"
              stroke="#7A8B73"
            />

            <YAxis
              stroke="#7A8B73"
            />

            <Tooltip />

            <Bar
              dataKey="appointments"
              fill="#A8B99A"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PatientChart;