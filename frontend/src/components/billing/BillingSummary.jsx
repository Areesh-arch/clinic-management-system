import React from "react";

function BillingSummary({
  totalPaid = 0,
  totalOutstanding = 0,
  totalExpenses = 0,
}) {
  const formatAmount = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const cards = [
    {
      title: "Total Paid",
      value: totalPaid,
      description: "Total payments received",
      icon: "✓",
      accent: "#173B32",
    },
    {
      title: "Outstanding",
      value: totalOutstanding,
      description: "Current unpaid balance",
      icon: "!",
      accent: "#b4935a",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      description: "Clinic expenses",
      icon: "−",
      accent: "#6f8f7d",
    },
  ];

  return (
    <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style={{
            borderColor: "rgba(23, 59, 50, 0.10)",
            backgroundColor: "#fffdf8",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p
                className="text-sm font-medium"
                style={{ color: "#6f8f7d" }}
              >
                {card.title}
              </p>

              <p
                className="mt-2 wrap-break-words text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "#173B32" }}
              >
                Rs. {formatAmount(card.value)}
              </p>

              <p
                className="mt-2 text-xs"
                style={{ color: "#8a9a91" }}
              >
                {card.description}
              </p>
            </div>

            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
              style={{
                backgroundColor: `${card.accent}12`,
                color: card.accent,
              }}
            >
              {card.icon}
            </div>
          </div>

          <div
            className="mt-5 h-1 rounded-full"
            style={{
              background: `linear-gradient(to right, ${card.accent}, ${card.accent}25)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default BillingSummary;