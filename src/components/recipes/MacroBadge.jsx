import React from "react";

export default function MacroBadge({ label, value, unit, color }) {
  const colorClasses = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className={`flex flex-col items-center px-4 py-3 rounded-xl border ${colorClasses[color] || colorClasses.green}`}>
      <span className="text-2xl font-heading font-bold">{value}</span>
      <span className="text-xs font-medium mt-0.5">{unit}</span>
      <span className="text-[11px] opacity-70 mt-0.5">{label}</span>
    </div>
  );
}