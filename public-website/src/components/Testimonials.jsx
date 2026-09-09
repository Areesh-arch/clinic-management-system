import { useEffect, useRef, useState } from "react";

import "../styles/testimonials.css";

import TestimonialCard from "./TestimonialCard";

const DEFAULT_TESTIMONIALS = [
  {
    id: "default-testimonial-1",
    patient_name: "Sarah M.",
    name: "Sarah M.",
    feedback:
      "The entire experience felt thoughtful and personal. I finally feel confident about my skin and the care plan was easy to follow.",
    rating: 5,
    is_active: true,
  },
  {
    id: "default-testimonial-2",
    patient_name: "Ayesha K.",
    name: "Ayesha K.",
    feedback:
      "I loved how carefully everything was explained before my treatment. The approach felt natural, professional, and completely comfortable.",
    rating: 5,
    is_active: true,
  },
  {
    id: "default-testimonial-3",
    patient_name: "Mariam R.",
    name: "Mariam R.",
    feedback:
      "From consultation to follow-up, everything felt warm and professional. My skin has improved beautifully and I am very happy with the results.",
    rating: 5,
    is_active: true,
  },
];

const TESTIMONIAL_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=2000&q=85";

export default function Testimonials({
  testimonials = [],
}) {
  const [isVisible, setIsVisible] = useState(false);

  const headingRef = useRef(null);

  const cmsTestimonials = Array.isArray(testimonials)
    ? testimonials
    : [];

  const activeCmsTestimonials =
    cmsTestimonials.filter(
      (testimonial) =>
        testimonial?.is_active !== false
    );

  /*
   * CMS testimonials have priority.
   * If CMS has active testimonials, show only CMS data.
   * If CMS has no active testimonials, show defaults.
   */
  const activeTestimonials =
    activeCmsTestimonials.length > 0
      ? activeCmsTestimonials
      : DEFAULT_TESTIMONIALS;

  /*
   * Heading reveal animation.
   */
  useEffect(() => {
    const element = headingRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      className="testimonials"
      id="feedback"
    >
      <div
        className="testimonials-background"
        style={{
          backgroundImage: `url("${TESTIMONIAL_BACKGROUND_IMAGE}")`,
        }}
      />

      <div className="testimonials-background-overlay" />

      <div className="testimonials-container">
        <div
          ref={headingRef}
          className={`testimonials-heading ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <div className="testimonials-heading-content">
            <p className="section-eyebrow">
              PATIENT FEEDBACK
            </p>

            <h2>
              Trusted by patients.
              <br />
              <em>Made for you.</em>
            </h2>
          </div>

          <div className="testimonials-intro-wrapper">
            <p className="testimonials-intro">
              Every patient deserves care that feels
              personal. Here are some of the
              experiences shared by patients who
              trusted us with their skin and aesthetic
              journey.
            </p>

            <span
              className="testimonials-intro-line"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="testimonials-grid">
          {activeTestimonials.map(
            (testimonial, index) => (
              <div
                className="testimonial-card-wrapper"
                key={
                  testimonial?.id ??
                  testimonial?.slug ??
                  `testimonial-${index}`
                }
              >
                <TestimonialCard
                  testimonial={testimonial}
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}