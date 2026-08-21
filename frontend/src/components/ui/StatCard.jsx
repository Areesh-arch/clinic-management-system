function StatCard({ title, value, growth, icon }) {
  const isPositive = growth?.startsWith("+");

  return (
    <div
      className="
        w-full
        min-w-0
        bg-white
        rounded-2xl
        border border-[#E6E0D5]
        px-5
        py-4
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between gap-3">

        {/* Text */}
        <div className="min-w-0 flex-1">

          <p className="text-xs sm:text-sm text-[#6E766F] truncate">
            {title}
          </p>

          <h2
            className="
              text-xl
              sm:text-2xl
              font-bold
              text-[#25312A]
              mt-1.5
              truncate
            "
          >
            {value}
          </h2>

          {growth && (
            <p
              className={`mt-1.5 text-xs font-medium ${
                isPositive
                  ? "text-[#7A9E7E]"
                  : "text-[#C65B5B]"
              }`}
            >
              {growth}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className="
            w-11
            h-11
            sm:w-12
            sm:h-12
            shrink-0
            rounded-xl
            bg-[#EEF4EC]
            flex
            items-center
            justify-center
            text-[#55705A]
          "
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard;