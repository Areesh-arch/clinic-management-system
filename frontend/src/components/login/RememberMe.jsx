export default function RememberMe() {
  return (
    <div className="flex justify-between items-center">

      <label className="flex items-center gap-2 text-[#45524A]">

        <input type="checkbox" />

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