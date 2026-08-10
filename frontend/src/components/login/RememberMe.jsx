import { useNavigate } from "react-router-dom";

export default function RememberMe({ checked, onChange }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-[#45524A] cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4"
        />

        Remember Me
      </label>

      <button
        type="button"
        className="text-[#7A9E7E] hover:underline"
      >
        Forgot Password?
      </button>
    </div>
  );
}