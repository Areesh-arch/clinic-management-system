import "../styles/services.css";

export default function Services({ services = [] }) {
  const activeServices = services.filter(
    (service) => service.is_active !== false
  );

  return (
    <section className="services" id="treatments">
      <div className="services-container">
        <div className="services-heading">
          <div>
            <p className="section-eyebrow">
              OUR EXPERTISE
            </p>

            <h2>
              Treatments designed
              <br />
              <em>around you.</em>
            </h2>
          </div>

          <p className="services-intro">
            Every treatment begins with understanding your skin,
            your concerns, and the result you want to achieve.
          </p>
        </div>

        <div className="services-grid">
          {activeServices.map((service, index) => (
            <article
              className="service-card"
              key={service.id ?? service.slug ?? index}
            >
              <span className="service-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="service-content">
                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}