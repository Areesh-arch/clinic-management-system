import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginInput from "./LoginInput";
import PasswordInput from "./PasswordInput";
import RememberMe from "./RememberMe";
import LoginButton from "./LoginButton";

import { useAuth } from "../../context/AuthContext";


export default function LoginForm() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const { login } =
    useAuth();

  const navigate =
    useNavigate();


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      if (!email.trim()) {
        setError(
          "Please enter your email."
        );
        return;
      }


      if (!password) {
        setError(
          "Please enter your password."
        );
        return;
      }


      try {

        setLoading(true);


        const user =
          await login(
            email.trim(),
            password,
            rememberMe
          );


        console.log(
          "Authenticated user:",
          user
        );


        setSuccess(
          "Login successful!"
        );


        navigate(
          "/dashboard"
        );

      } catch (error) {

        console.error(
          "Login failed:",
          error
        );


        setError(
          error.message ||
            "Login failed. Please try again."
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <LoginInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) =>
          setEmail(
            event.target.value
          )
        }
      />


      <PasswordInput
        value={password}
        onChange={(event) =>
          setPassword(
            event.target.value
          )
        }
      />


      <RememberMe
        checked={rememberMe}
        onChange={(event) =>
          setRememberMe(
            event.target.checked
          )
        }
      />


      {error && (
        <p
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}


      {success && (
        <p
          className="text-sm text-green-600"
          role="status"
        >
          {success}
        </p>
      )}


      <LoginButton
        loading={loading}
      />

    </form>
  );
}