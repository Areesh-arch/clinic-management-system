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
  const [siteSettings, setSiteSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [results, setResults] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadWebsiteContent() {
      try {
        const [
          siteSettingsData,
          servicesData,
          resultsData,
          testimonialsData,
          quizData,
          blogsData,
        ] = await Promise.all([
          publicWebsiteService.getSiteSettings(),
          publicWebsiteService.getServices(),
          publicWebsiteService.getResults(),
          publicWebsiteService.getTestimonials(),
          publicWebsiteService.getQuizQuestions(),
          publicWebsiteService.getBlogs(),
        ]);

        if (!mounted) {
          return;
        }

        setSiteSettings(
          siteSettingsData &&
            typeof siteSettingsData === "object"
            ? siteSettingsData
            : null
        );

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

        setBlogs(
          Array.isArray(blogsData)
            ? blogsData
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
        <About
          siteSettings={siteSettings}
        />

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

        <News
          blogs={blogs}
        />

        <Contact 
        siteSettings={siteSettings} 
        />
      </main>

      <Footer siteSettings={siteSettings} />

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
