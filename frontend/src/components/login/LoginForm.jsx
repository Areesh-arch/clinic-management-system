import LoginInput from "./LoginInput";
import PasswordInput from "./PasswordInput";
import RememberMe from "./RememberMe";
import LoginButton from "./LoginButton";

export default function LoginForm() {
  return (
    <form className="space-y-6">

      <LoginInput
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      <PasswordInput />

      <RememberMe />

      <LoginButton />

    </form>
  );
}