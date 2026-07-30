import LoginForm from "./LoginForm";
import { FiActivity } from "react-icons/fi";

export default function LoginCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-[#E6E1D8]">

      <div className="flex flex-col items-center mb-8">

        <div className="w-20 h-20 rounded-full bg-[#A8C5A0] flex items-center justify-center">

          <FiActivity
            className="text-white"
            size={40}
          />

        </div>

        <h1 className="text-4xl font-bold text-[#45524A] mt-5">
          DermaCare
        </h1>

        <p className="text-[#7E867F]">
          Dermatology Clinic
        </p>

      </div>

      <div className="mb-8">

        <h2 className="text-2xl font-semibold text-[#45524A]">
          Welcome Back
        </h2>

        <p className="text-[#7E867F] mt-1">
          Sign in to continue managing your clinic.
        </p>

      </div>

      <LoginForm />

    </div>
  );
}