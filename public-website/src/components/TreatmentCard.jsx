export default function TestimonialCard({ testimonial }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-top">
        <span className="testimonial-quote">
          “
        </span>

        <div
          className="testimonial-rating"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: testimonial.rating }).map(
            (_, index) => (
              <span key={index}>★</span>
            )
          )}
        </div>
      </div>

      <p className="testimonial-feedback">
        {testimonial.feedback}
      </p>

      <div className="testimonial-author">
        <div className="testimonial-avatar">
          {testimonial.name.charAt(0)}
        </div>

        <div>
          <h3>{testimonial.name}</h3>
          <p>{testimonial.treatment}</p>
        </div>
      </div>
    </article>
  );
}