import {
  FiGlobe,
  FiActivity,
} from "react-icons/fi";

function CMSHeader() {
  return (
    <header className="cms-header">
      <div className="cms-header-content">
        <span className="cms-eyebrow">
          WEBSITE MANAGEMENT
        </span>

        <h1>CMS</h1>

        <p>
          Manage the content and visual information displayed
          on your public clinic website.
        </p>
      </div>

      <div className="cms-header-status">
        <span className="cms-status-dot" />

        <FiGlobe />

        <span>Website Content</span>

        <FiActivity />
      </div>
    </header>
  );
}

export default CMSHeader;