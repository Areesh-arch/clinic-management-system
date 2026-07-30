import { FiEye } from "react-icons/fi";

export default function PasswordInput() {
  return (
    <div className="space-y-2">

      <label className="text-[#45524A] font-medium">
        Password
      </label>

      <div className="relative">

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full rounded-xl border border-[#E6E1D8] px-4 py-3 pr-12 focus:outline-none focus:border-[#7A9E7E]"
        />

        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7E867F]"
        >
          <FiEye />
        </button>

      </div>

    </div>
  );
}