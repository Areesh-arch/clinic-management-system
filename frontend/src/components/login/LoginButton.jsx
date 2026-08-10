export default function LoginButton({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#7A9E7E] hover:bg-[#6D8F72] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
    >
      {loading ? "Signing In..." : "Sign In"}
    </button>
  );
}