function StatCard({ title, value, growth, icon }) {
  const isPositive = growth?.startsWith("+");

  return (
    <div
      className="
        w-full
        min-w-0
        bg-white
        rounded-3xl
        border border-slate-200
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[#6E766F]">
            {title}
          </p>

          <h2
            className="
              text-3xl
              font-bold
              text-[#25312A]
              mt-3
              break-words
            "
          >
            {value}
          </h2>

          <p
            className={`mt-5 font-medium {
              growth.startsWith("+")
                ? "text-[#7A9E7E]"
                : "text-[#C65B5B]"
            }`}
          >
            {growth}
          </p>
        </div>

        <div
          className="
            w-14
            h-14
            shrink-0
            rounded-2xl
            bg-[#EEF4EC]
            flex
            items-center
            justify-center
            text-3x1
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;