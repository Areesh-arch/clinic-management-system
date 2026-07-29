function Input({ label, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          focus:outline-none
          focus:ring-2
          focus:ring-teal-600
        "
      />
    </div>
  );
}

export default Input;