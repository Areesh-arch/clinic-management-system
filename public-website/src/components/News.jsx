
import "../styles/news.css";

const newsPosts = [
  {
    id: 1,
    slug: "understanding-your-skin",
    title: "Understanding Your Skin: A Guide to Healthy Skin",
    category: "Skin Health",
    date: "August 20, 2026",
    excerpt:
      "Discover simple, dermatologist-backed ways to understand and care for your skin every day.",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    slug: "science-behind-modern-aesthetic-treatments",
    title: "The Science Behind Modern Aesthetic Treatments",
    category: "Aesthetic Care",
    date: "August 12, 2026",
    excerpt:
      "Learn how modern aesthetic treatments can enhance natural features while keeping results refined.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    slug: "why-professional-skin-consultation-matters",
    title: "Why Professional Skin Consultation Matters",
    category: "Expert Advice",
    date: "August 05, 2026",
    excerpt:
      "Every skin journey is different. Here's why professional assessment is an important first step.",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80",
  },
];

export { newsPosts };

export default function News() {
  return (
    <section className="news-section" id="news">
      <div className="news-container">

        <div className="news-heading">
          <span className="section-eyebrow">FROM THE CLINIC</span>

          <h2>
            Latest <em>Insights</em>
          </h2>

          <p>
            Expert knowledge, skincare guidance and the latest insights
            from our clinic.
          </p>
        </div>

        <div className="news-grid">
          {newsPosts.map((post) => (
            <article className="news-card" key={post.id}>

              <div className="news-image-wrapper">
                <img
                  src={post.image}
                  alt={post.title}
                  className="news-image"
                />
              </div>

              <div className="news-content">

                <div className="news-meta">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>

                <h3>{post.title}</h3>

                <p>{post.excerpt}</p>

                <a
                  href={`/news/${post.slug}`}
                  className="news-read-more"
                >
                  Read Article
                  <span>→</span>
                </a>

              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
