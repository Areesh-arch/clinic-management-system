
import {
  FiActivity,
  FiClock,
  FiCreditCard,
  FiXCircle,
} from "react-icons/fi";

const STAT_ITEMS = [
  {
    key: "total",
    label: "Total Subscriptions",
    icon: FiCreditCard,
  },
  {
    key: "active",
    label: "Active",
    icon: FiActivity,
  },
  {
    key: "trial",
    label: "Trial",
    icon: FiClock,
  },
  {
    key: "expired",
    label: "Expired",
    icon: FiXCircle,
  },
];

export default function SubscriptionStats({
  stats,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="rounded-2xl border border-[#ded6c6] bg-[#fffdf7] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a817d]">
                  {item.label}
                </p>

                <p className="mt-3 text-3xl font-bold text-[#173B32]">
                  {stats?.[item.key] ?? 0}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7eee7] text-[#173B32]">
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
