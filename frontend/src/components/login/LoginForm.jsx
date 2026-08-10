import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginInput from "./LoginInput";
import PasswordInput from "./PasswordInput";
import RememberMe from "./RememberMe";
import LoginButton from "./LoginButton";

import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Authenticate user
      // This will:
      // 1. Call POST /auth/login
      // 2. Save the JWT token
      // 3. Call GET /auth/me
      // 4. Store the current user in AuthContext
      const user = await login(email.trim(), password, false);

      console.log("Authenticated user:", user);

      setSuccess("Login successful!");

      // Redirect to dashboard after successful authentication
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <LoginInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      {/* Password */}
      <PasswordInput
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {/* Remember Me + Forgot Password */}
      <RememberMe />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Success message */}
      {success && (
        <p className="text-sm text-green-600" role="status">
          {success}
        </p>
      )}

      {/* Login button */}
      <LoginButton loading={loading} />
    </form>
  );
}