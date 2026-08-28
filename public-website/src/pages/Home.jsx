import About from "../components/About";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Results from "../components/Results";
import SkinQuiz from "../components/SkinQuiz";
import News from "../components/News";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="website">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Services />
        <Results />
        <SkinQuiz />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}