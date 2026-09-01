import {
  FiEdit3,
  FiTrash2,
  FiBookOpen,
} from "react-icons/fi";

function BlogCard({ blog, onDelete }) {
  return (
    <article className="cms-content-card">
      <div className="cms-content-card-icon">
        <FiBookOpen />
      </div>

      <div className="cms-content-card-main">
        <span className="cms-result-label">
          {blog.category || "ARTICLE"}
        </span>

        <h3>{blog.title}</h3>

        <p>
          {blog.excerpt ||
            "No short description added."}
        </p>
      </div>

      <div className="cms-content-card-actions">
        <span
          className={
            blog.published
              ? "cms-published"
              : "cms-unpublished"
          }
        >
          {blog.published
            ? "Published"
            : "Draft"}
        </span>

        <button
          type="button"
          className="cms-icon-button"
          title="Edit"
        >
          <FiEdit3 />
        </button>

        <button
          type="button"
          className="cms-icon-button danger"
          title="Delete"
          onClick={() => onDelete(blog.id)}
        >
          <FiTrash2 />
        </button>
      </div>
    </article>
  );
}

export default BlogCard;