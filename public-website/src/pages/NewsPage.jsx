import Navbar from "../components/Navbar";
import "../styles/newsPage.css";

const articles = [
  {
    id: 1,
    title: "Understanding Your Skin: A Guide to Healthy Skin",
    category: "Skin Health",
    date: "August 20, 2026",
    excerpt:
      "Discover simple, dermatologist-backed ways to understand and care for your skin every day.",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "The Science Behind Modern Aesthetic Treatments",
    category: "Aesthetic Care",
    date: "August 12, 2026",
    excerpt:
      "Learn how modern aesthetic treatments can enhance natural features while keeping results refined.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Why Professional Skin Consultation Matters",
    category: "Expert Advice",
    date: "August 05, 2026",
    excerpt:
      "Every skin journey is different. Here's why professional assessment is an important first step.",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function NewsPage() {
  return (
    <div className="news-page">

      <Navbar />

      <main>

        <section className="news-page-hero">

          <div className="news-page-hero-inner">

            <span>THE JOURNAL</span>

            <h1>
              Clinic <em>News</em>
            </h1>

            <p>
              Insights, advice and knowledge from our world of
              dermatology and aesthetic care.
            </p>

          </div>

        </section>

        <section className="news-page-content">

          <div className="news-page-grid">

            {articles.map((article) => (
              <article
                className="news-page-card"
                key={article.id}
              >

                <div className="news-page-image">
                  <img
                    src={article.image}
                    alt={article.title}
                  />
                </div>

                <div className="news-page-card-content">

                  <div className="news-page-meta">
                    <span>{article.category}</span>
                    <span>{article.date}</span>
                  </div>

                  <h2>{article.title}</h2>

                  <p>{article.excerpt}</p>

                  <a href={`/news/${article.id}`}>
                    Read Article
                    <span>→</span>
                  </a>

                </div>

              </article>
            ))}

          </div>

        </section>

      </main>

    </div>
  );
}