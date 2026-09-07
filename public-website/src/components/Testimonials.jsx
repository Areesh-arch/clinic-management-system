import "../styles/testimonials.css";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials({
  testimonials = [],
}) {
  const activeTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.is_active !== false
  );

  return (
    <section className="testimonials" id="feedback">
      <div className="testimonials-container">
        <div className="testimonials-heading">
          <div>
            <p className="section-eyebrow">
              PATIENT FEEDBACK
            </p>

            <h2>
              Trusted by patients.
              <br />
              <em>Made for you.</em>
            </h2>
          </div>

          <p className="testimonials-intro">
            Every patient deserves care that feels personal.
            Here are some of the experiences shared by patients
            who trusted us with their skin and aesthetic journey.
          </p>
        </div>

        <div className="testimonials-grid">
          {activeTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}