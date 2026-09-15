export default function RememberMe({
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between">

      <label className="flex items-center gap-2 text-[#45524A] cursor-pointer">

        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 accent-[#173B32]"
        />

        <span>
          Remember Me
        </span>

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