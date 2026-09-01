import {
  FiEye,
  FiTrash2,
  FiImage,
} from "react-icons/fi";

function ResultCard({ result, onDelete }) {
  return (
    <article className="cms-result-card">
      <div className="cms-result-images">
        <div className="cms-result-image">
          {result.beforeImage ? (
            <img
              src={result.beforeImage}
              alt={`${result.title} before`}
            />
          ) : (
            <div className="cms-result-placeholder">
              <FiImage />
            </div>
          )}

          <span>BEFORE</span>
        </div>

        <div className="cms-result-image">
          {result.afterImage ? (
            <img
              src={result.afterImage}
              alt={`${result.title} after`}
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

          <h3>{result.title}</h3>

          <p>
            {result.description ||
              "No description added."}
          </p>
        </div>

        <div className="cms-result-actions">
          <span
            className={
              result.published
                ? "cms-published"
                : "cms-unpublished"
            }
          >
            {result.published
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
            onClick={() => onDelete(result.id)}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ResultCard;