import {
  FiEye,
  FiTrash2,
  FiImage,
} from "react-icons/fi";

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

function ResultCard({ result, onDelete }) {
  const beforeImage = getImageUrl(
    result?.beforeImage
  );

  const afterImage = getImageUrl(
    result?.afterImage
  );

  const title =
    result?.title || "Treatment Result";

  const description =
    result?.description ||
    "No description added.";

  const published =
    result?.published ?? false;

  return (
    <article className="cms-result-card">
      <div className="cms-result-images">
        <div className="cms-result-image">
          {beforeImage ? (
            <img
              src={beforeImage}
              alt={`${title} before`}
              onError={(event) => {
                console.error(
                  "Failed to load before result image:",
                  beforeImage
                );

                event.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="cms-result-placeholder">
              <FiImage />
            </div>
          )}

          <span>BEFORE</span>
        </div>

        <div className="cms-result-image">
          {afterImage ? (
            <img
              src={afterImage}
              alt={`${title} after`}
              onError={(event) => {
                console.error(
                  "Failed to load after result image:",
                  afterImage
                );

                event.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="cms-result-placeholder">
              <FiImage />
            </div>
          )}

          <span>AFTER</span>
        </div>
      </div>

      <div className="cms-result-content">
        <div>
          <span className="cms-result-label">
            TREATMENT RESULT
          </span>

          <h3>{title}</h3>

          <p>{description}</p>
        </div>

        <div className="cms-result-actions">
          <span
            className={
              published
                ? "cms-published"
                : "cms-unpublished"
            }
          >
            {published
              ? "Published"
              : "Draft"}
          </span>

          <button
            type="button"
            className="cms-icon-button"
            title="Preview"
          >
            <FiEye />
          </button>

          <button
            type="button"
            className="cms-icon-button danger"
            title="Delete"
            onClick={() =>
              onDelete(result.id)
            }
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ResultCard;