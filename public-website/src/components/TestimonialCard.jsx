import "../styles/testimonials.css";

export default function TestimonialCard({ testimonial }) {
  const name =
    testimonial?.name ||
    testimonial?.patient_name ||
    testimonial?.patientName ||
    "Anonymous";

  const feedback =
    testimonial?.feedback ||
    testimonial?.message ||
    testimonial?.review ||
    testimonial?.text ||
    "";

  const treatment =
    testimonial?.treatment ||
    testimonial?.service ||
    testimonial?.treatment_name ||
    "";

  const numericRating = Number(testimonial?.rating);

  const rating = Number.isFinite(numericRating)
    ? Math.min(5, Math.max(0, Math.round(numericRating)))
    : 0;

  const firstLetter = String(name).charAt(0).toUpperCase();

  return (
    <article className="testimonial-card">
      <div className="testimonial-top">
        <span className="testimonial-quote">
          "
        </span>

        <div
          className="testimonial-rating"
          aria-label={`${rating} out of 5 stars`}
        >
          {Array.from({ length: rating }).map(
            (_, index) => (
              <span key={index}>★</span>
            )
          )}
        </div>
      </div>

      <p className="testimonial-feedback">
        {feedback}
      </p>

      <div className="testimonial-author">
        <div className="testimonial-avatar">
          {firstLetter}
        </div>

        <div>
          <h3>{name}</h3>

          {treatment && (
            <p>{treatment}</p>
          )}
        </div>
      </div>
    </article>
  );
}
