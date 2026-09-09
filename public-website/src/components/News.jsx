
import "../styles/news.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ""
);

function getImageUrl(rawImageUrl) {
  if (!rawImageUrl) {
    return "";
  }

  if (
    rawImageUrl.startsWith("http://") ||
    rawImageUrl.startsWith("https://")
  ) {
    return rawImageUrl;
  }

  return `${API_ORIGIN}${
    rawImageUrl.startsWith("/") ? "" : "/"
  }${rawImageUrl}`;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function News({ blogs = [] }) {
  const publishedPosts = blogs
    .filter(
      (blog) =>
        blog?.is_published === true
    )
    .sort(
      (a, b) =>
        (a?.display_order ?? 0) -
        (b?.display_order ?? 0)
    );

  return (
    <section
      className="news-section"
      id="news"
    >
      <div className="news-container">
        <div className="news-heading">
          <span className="section-eyebrow">
            FROM THE CLINIC
          </span>

          <h2>
            Latest <em>Insights</em>
          </h2>

          <p>
            Expert knowledge, skincare guidance and
            the latest insights from our clinic.
          </p>
        </div>

        <div className="news-grid">
          {publishedPosts.length === 0 ? (
            <div className="news-empty">
              <p>
                Our latest insights will be available
                here soon.
              </p>
            </div>
          ) : (
            publishedPosts.map((post) => {
              const imageUrl = getImageUrl(
                post?.featured_image_url
              );

              return (
                <article
                  className="news-card"
                  key={post?.id ?? post?.slug}
                >
                  {imageUrl && (
                    <div className="news-image-wrapper">
                      <img
                        src={imageUrl}
                        alt={
                          post?.title ||
                          "Clinic article"
                        }
                        className="news-image"
                        loading="lazy"
                        onError={(event) => {
                          console.error(
                            "Failed to load blog image:",
                            imageUrl
                          );

                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}

                  <div className="news-content">
                    <div className="news-meta">
                      {post?.category && (
                        <span>
                          {post.category}
                        </span>
                      )}

                      {post?.published_at && (
                        <span>
                          {formatDate(
                            post.published_at
                          )}
                        </span>
                      )}
                    </div>

                    <h3>
                      {post?.title ||
                        "Clinic Article"}
                    </h3>

                    {post?.excerpt && (
                      <p>{post.excerpt}</p>
                    )}

                    <a
                      href={`/news/${post.slug}`}
                      className="news-read-more"
                    >
                      Read Article
                      <span>→</span>
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
