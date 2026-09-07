import { useEffect, useState } from "react";

import About from "../components/About";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Results from "../components/Results";
import Testimonials from "../components/Testimonials";
import SkinQuiz from "../components/SkinQuiz";
import News from "../components/News";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

import publicWebsiteService from "../services/publicWebsiteService";

export default function Home() {
  const [services, setServices] = useState([]);
  const [results, setResults] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadWebsiteContent() {
      try {
        const [
          servicesData,
          resultsData,
          testimonialsData,
          quizData,
        ] = await Promise.all([
          publicWebsiteService.getServices(),
          publicWebsiteService.getResults(),
          publicWebsiteService.getTestimonials(),
          publicWebsiteService.getQuizQuestions(),
        ]);

        if (!mounted) {
          return;
        }

        setServices(
          Array.isArray(servicesData)
            ? servicesData
            : []
        );

        setResults(
          Array.isArray(resultsData)
            ? resultsData
            : []
        );

        setTestimonials(
          Array.isArray(testimonialsData)
            ? testimonialsData
            : []
        );

        setQuizQuestions(
          Array.isArray(quizData)
            ? quizData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load public website CMS content:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWebsiteContent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="website">

      <Navbar />

      <main>

        <About />

        <Services
          services={services}
        />

        <Results
          results={results}
        />

        <Testimonials
          testimonials={testimonials}
        />

        <SkinQuiz
          questions={quizQuestions}
        />

        <News />

        <Contact />

      </main>

      <Footer />

      {loading && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            fontSize: "12px",
            opacity: 0.7,
          }}
        >
          Loading clinic content...
        </div>
      )}

    </div>
  );
}