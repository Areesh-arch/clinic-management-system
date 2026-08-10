import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setMessage(
      "If an account exists for this email, you will receive password reset instructions."
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-[#45524A]">
          Forgot Password
        </h1>

        <p className="text-[#7E867F] mt-2 mb-8">
          Enter your email address and we'll send you instructions to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[#45524A] font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-[#E6E1D8] px-4 py-3 focus:outline-none focus:border-[#7A9E7E]"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-700 text-sm">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#7A9E7E] hover:bg-[#6D8F72] text-white py-3 rounded-xl font-semibold transition"
          >
            Send Reset Instructions
          </button>
        </form>
      </div>
    </div>
  );
}