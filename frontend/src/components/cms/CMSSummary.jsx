import {
  FiLayers,
  FiImage,
  FiCheckCircle,
  FiGrid,
  FiBookOpen,
} from "react-icons/fi";

function CMSSummary({
  sectionCount = 0,
  results = 0,
  publishedResults = 0,
  treatments = 0,
  blogs = 0,
}) {
  return (
    <section className="cms-summary">
      <div className="cms-summary-card">
        <div className="cms-summary-card-icon">
          <FiLayers />
        </div>

        <span>Website Sections</span>

        <strong>{sectionCount}</strong>

        <small>Managed sections</small>
      </div>

      <div className="cms-summary-card">
        <div className="cms-summary-card-icon">
          <FiImage />
        </div>

        <span>Results</span>

        <strong>{results}</strong>

        <small>Before & after cases</small>
      </div>

      <div className="cms-summary-card">
        <div className="cms-summary-card-icon">
          <FiCheckCircle />
        </div>

        <span>Published Results</span>

        <strong>{publishedResults}</strong>

        <small>Visible on website</small>
      </div>

      <div className="cms-summary-card">
        <div className="cms-summary-card-icon">
          <FiGrid />
        </div>

        <span>Treatments</span>

        <strong>{treatments}</strong>

        <small>Website treatments</small>
      </div>

      <div className="cms-summary-card">
        <div className="cms-summary-card-icon">
          <FiBookOpen />
        </div>

        <span>Blogs</span>

        <strong>{blogs}</strong>

        <small>Published articles</small>
      </div>
    </section>
  );
}

export default CMSSummary;