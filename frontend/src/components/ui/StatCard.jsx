function StatCard({ title, value, growth, icon }) {
  return (
    <div
  className="
  bg-white
  rounded-3xl
  border border-slate-200
  p-6
  shadow-sm
  hover:scale-105
  transition-al
  duration-300
  hover:-translate-y-1
  transition-all
  duration-300
"
>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-[#6E766F]">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-[#25312A] mt-3">
            {value}
          </h2>

          <p
            className={`mt-5 font-medium ${
              growth.startsWith("+")
                ? "text-[#7A9E7E]"
                : "text-[#C65B5B]"
            }`}
          >
            {growth}
          </p>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-[#EEF4EC] flex items-center justify-center text-[#7A9E7E] text-3xl">

          {icon}

        </div>

      </div>

    </div>
  );
}

export default StatCard;