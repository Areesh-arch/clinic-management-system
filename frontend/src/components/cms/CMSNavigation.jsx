import {
  FiHome,
  FiGrid,
  FiImage,
  FiBookOpen,
  FiHelpCircle,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";

const ICONS = {
  homepage: <FiHome />,
  treatments: <FiGrid />,
  results: <FiImage />,
  blogs: <FiBookOpen />,
  quiz: <FiHelpCircle />,
  testimonials: <FiMessageSquare />,
  contact: <FiPhone />,
};

function CMSNavigation({
  sections,
  activeSection,
  onSectionChange,
}) {
  return (
    <aside className="cms-navigation">
      <div className="cms-navigation-header">
        <span>CONTENT</span>

        <p>Select a section to manage.</p>
      </div>

      <nav className="cms-navigation-list">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={
              activeSection === section.id
                ? "cms-navigation-item active"
                : "cms-navigation-item"
            }
            onClick={() => onSectionChange(section.id)}
          >
            <span className="cms-navigation-icon">
              {ICONS[section.id]}
            </span>

            <span className="cms-navigation-text">
              <strong>{section.title}</strong>

              <small>{section.description}</small>
            </span>

            <span className="cms-navigation-arrow">
              →
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default CMSNavigation;