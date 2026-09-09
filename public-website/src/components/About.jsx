
import "../styles/about.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ""
);

export default function About({ siteSettings }) {
  const eyebrow =
    siteSettings?.homepage_eyebrow ||
    "ABOUT OUR CLINIC";

  const title =
    siteSettings?.homepage_title ||
    "Where refined care meets beautiful results.";

  const description =
    siteSettings?.homepage_description ||
    "We believe aesthetic and dermatological care should feel personal, thoughtful, and effortless. Our approach combines modern treatments with careful consultation to create results that feel natural and uniquely yours.";

  const rawImageUrl =
    siteSettings?.homepage_image_url || "";

  const imageUrl = rawImageUrl
    ? rawImageUrl.startsWith("http://") ||
      rawImageUrl.startsWith("https://")
      ? rawImageUrl
      : `${API_ORIGIN}${
          rawImageUrl.startsWith("/") ? "" : "/"
        }${rawImageUrl}`
    : "";

  return (
    <section
      className="about-section"
      id="about"
      style={
        imageUrl
          ? {
              "--about-background-image": `url("${imageUrl}")`,
            }
          : undefined
      }
    >
      <div className="about-overlay"></div>

      <div className="about-container">

        <div className="about-content">

          <p className="about-eyebrow">
            {eyebrow}
          </p>

          <h2>
            {title}
          </h2>

          <p className="about-description">
            {description}
          </p>

          <button
            className="about-button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Discover Our Approach
          </button>

        </div>

      </div>
    </section>
  );
}
