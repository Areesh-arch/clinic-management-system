import "../styles/services.css";

const services = [
  {
    number: "01",
    title: "Skin Rejuvenation",
    description:
      "Refined treatments designed to restore luminosity, texture, and a naturally healthy appearance.",
  },
  {
    number: "02",
    title: "Facial Aesthetics",
    description:
      "Thoughtfully tailored aesthetic treatments that enhance your natural features with subtle results.",
  },
  {
    number: "03",
    title: "Acne & Scar Care",
    description:
      "Personalized dermatological care focused on clearer skin and improved texture.",
  },
  {
    number: "04",
    title: "Advanced Injectables",
    description:
      "Precise, medically guided treatments designed to create balanced and natural-looking results.",
  },
];

export default function Services() {
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
          {services.map((service) => (
            <article
              className="service-card"
              key={service.number}
            >
              <span className="service-number">
                {service.number}
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