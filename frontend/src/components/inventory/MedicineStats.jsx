export default function MedicineStats({
  medicines = [],
  loading,
}) {
  const totalMedicines = medicines.length;

  const inStock = medicines.filter(
    (medicine) =>
      Number(medicine.quantity) >
      Number(medicine.minimum_stock)
  ).length;

  const lowStock = medicines.filter(
    (medicine) =>
      Number(medicine.quantity) > 0 &&
      Number(medicine.quantity) <=
        Number(medicine.minimum_stock)
  ).length;

  const outOfStock = medicines.filter(
    (medicine) => Number(medicine.quantity) === 0
  ).length;

  const stats = [
    {
      title: "Total Medicines",
      value: totalMedicines,
      description: "Items in your inventory",
      accent: "gold",
      icon: "✦",
    },
    {
      title: "In Stock",
      value: inStock,
      description: "Healthy stock levels",
      accent: "sage",
      icon: "✓",
    },
    {
      title: "Low Stock",
      value: lowStock,
      description: "Needs attention",
      accent: "gold",
      icon: "!",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      description: "Currently unavailable",
      accent: "forest",
      icon: "×",
    },
  ];

  const accentStyles = {
    gold: {
      icon: "bg-[#F4EAD7] text-[#9B793D]",
      line: "bg-[#C9A96E]",
    },
    sage: {
      icon: "bg-[#E3EEE6] text-[#496C59]",
      line: "bg-[#8FAF9A]",
    },
    forest: {
      icon: "bg-[#E3EBE7] text-[#173C32]",
      line: "bg-[#173C32]",
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => {
        const styles = accentStyles[stat.accent];

        return (
          <div
            key={stat.title}
            className="relative overflow-hidden bg-[#FFFDF8] border border-[#E7E1D5] rounded-2xl p-5 shadow-[0_4px_20px_rgba(23,60,50,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(23,60,50,0.08)]"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${styles.line}`}
            />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#718078]">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-[#173C32]">
                  {loading ? "—" : stat.value}
                </p>

                <p className="mt-1 text-xs text-[#8A938E]">
                  {stat.description}
                </p>
              </div>

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-semibold ${styles.icon}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}