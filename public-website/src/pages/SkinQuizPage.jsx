import Navbar from "../components/Navbar";
import SkinQuiz from "../components/SkinQuiz";

export default function SkinQuizPage() {
  return (
    <div className="website">
      <Navbar />

      <main>
        <SkinQuiz />
      </main>
    </div>
  );
}