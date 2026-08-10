export default function LoginInput({
  label,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#45524A] font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E6E1D8] px-4 py-3 focus:outline-none focus:border-[#7A9E7E]"
      />
    </div>
  );
}