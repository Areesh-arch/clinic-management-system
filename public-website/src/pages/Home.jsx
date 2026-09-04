import About from "../components/About";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Results from "../components/Results";
import Testimonials from "../components/Testimonials";
import SkinQuiz from "../components/SkinQuiz";
import News from "../components/News";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="website">
      <Navbar />

      <main>
        <About />
        <Services />
        <Results />
        <Testimonials />
        <SkinQuiz />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}