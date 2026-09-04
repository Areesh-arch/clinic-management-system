import "../styles/testimonials.css";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    id: 1,
    name: "Ayesha K.",
    treatment: "Skin Rejuvenation",
    rating: 5,
    feedback:
      "The entire experience was wonderful. Everything was explained clearly, and the results feel natural and beautifully suited to my skin.",
  },
  {
    id: 2,
    name: "Maham R.",
    treatment: "Acne & Scar Care",
    rating: 5,
    feedback:
      "I finally feel confident about my skin again. The treatment plan was carefully designed around my concerns and the progress has been amazing.",
  },
  {
    id: 3,
    name: "Sana A.",
    treatment: "Facial Aesthetics",
    rating: 5,
    feedback:
      "I wanted subtle results and that is exactly what I received. The whole process felt professional, comfortable, and very personal.",
  },
];
 
export default function Testimonials() {
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
          {testimonials.map((testimonial) => (
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