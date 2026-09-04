
import "../styles/article.css";

const articles = {
  "understanding-your-skin": {
    title: "Understanding Your Skin: A Guide to Healthy Skin",
    category: "Skin Health",
    date: "August 20, 2026",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85",

    introduction:
      "Healthy skin starts with understanding what your skin needs. Every person's skin is different, and factors such as environment, lifestyle, age and skincare habits can influence its condition.",

    sections: [
      {
        heading: "Understanding your skin",
        paragraphs: [
          "Your skin is your body's largest organ and plays an important role in protecting you from the environment. Understanding your skin type and its individual needs is the first step toward building an effective skincare routine.",
          "Rather than following every skincare trend, it is often better to focus on a simple and consistent routine that addresses your specific concerns.",
        ],
      },
      {
        heading: "Building a simple routine",
        paragraphs: [
          "A gentle cleanser, an appropriate moisturizer and daily sun protection form the foundation of a healthy skincare routine.",
          "Additional products can be introduced according to concerns such as dryness, acne, pigmentation or uneven texture.",
        ],
      },
      {
        heading: "When professional advice helps",
        paragraphs: [
          "Persistent or changing skin concerns may benefit from professional assessment. A dermatologist can evaluate your skin and recommend treatments that are appropriate for your individual needs.",
        ],
      },
    ],
  },

  "science-behind-modern-aesthetic-treatments": {
    title: "The Science Behind Modern Aesthetic Treatments",
    category: "Aesthetic Care",
    date: "August 12, 2026",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85",

    introduction:
      "Modern aesthetic medicine has moved toward personalized treatments that focus on refined, natural-looking results rather than dramatic changes.",

    sections: [
      {
        heading: "Modern aesthetic care",
        paragraphs: [
          "Aesthetic medicine continues to evolve as new techniques and technologies become available. The focus is increasingly on understanding each patient's individual anatomy, skin condition and desired outcome.",
        ],
      },
      {
        heading: "Personalized treatment matters",
        paragraphs: [
          "There is no single treatment that is appropriate for everyone. Different concerns and goals require different approaches.",
          "A professional consultation helps determine which treatment options may be suitable for an individual patient.",
        ],
      },
      {
        heading: "The goal: refined results",
        paragraphs: [
          "Thoughtful treatment planning, appropriate techniques and realistic expectations are important when working toward natural-looking aesthetic results.",
        ],
      },
    ],
  },

  "why-professional-skin-consultation-matters": {
    title: "Why Professional Skin Consultation Matters",
    category: "Expert Advice",
    date: "August 05, 2026",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1400&q=85",

    introduction:
      "Every skin journey is different. A professional consultation helps create a treatment and skincare plan based on your individual concerns and goals.",

    sections: [
      {
        heading: "Every skin journey is different",
        paragraphs: [
          "Two people can experience similar skin concerns while requiring completely different approaches. Skin type, lifestyle, previous treatments and individual goals can all influence the right plan.",
        ],
      },
      {
        heading: "Assessment comes first",
        paragraphs: [
          "A professional consultation allows your concerns to be discussed in detail and your skin to be assessed before recommendations are made.",
          "This personalized approach can help create a clearer and more focused skincare strategy.",
        ],
      },
      {
        heading: "A long-term approach",
        paragraphs: [
          "Good skincare is rarely about a single product or treatment. Consistency, professional guidance and realistic expectations are important parts of maintaining healthy-looking skin over time.",
        ],
      },
    ],
  },
};

export default function ArticlePage() {
  const slug = window.location.pathname.replace("/news/", "").replace(/\/$/, "");

  const article = articles[slug];

  if (!article) {
    return (
      <main className="article-not-found">
        <div>
          <span>ARTICLE NOT FOUND</span>

          <h1>We couldn't find that article.</h1>

          <a href="/#news">Back to Articles</a>
        </div>
      </main>
    );
  }

  return (
    <main className="article-page">

      <section className="article-hero">
        <div className="article-hero-inner">

          <a href="/#news" className="article-back">
            ← Back to Articles
          </a>

          <div className="article-meta">
            <span>{article.category}</span>
            <span>{article.date}</span>
          </div>

          <h1>{article.title}</h1>

          <p>{article.introduction}</p>

        </div>
      </section>

      <article className="article-body">

        <div className="article-image">
          <img
            src={article.image}
            alt={article.title}
          />
        </div>

        <div className="article-content">

          {article.sections.map((section) => (
            <section
              className="article-section"
              key={section.heading}
            >
              <h2>{section.heading}</h2>

              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <div className="article-footer">
            <a href="/#news">
              ← Back to Latest Insights
            </a>
          </div>

        </div>

      </article>

    </main>
  );
}
