import { useEffect, useState } from "react";
import {
  FiPlus,
  FiBookOpen,
} from "react-icons/fi";

import BlogForm from "./BlogForm";
import BlogCard from "./BlogCard";

function BlogsEditor({ onStatsChange }) {
  const [blogs, setBlogs] = useState([]);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    onStatsChange?.({
      blogs: blogs.filter(
        (blog) => blog.published
      ).length,
    });
  }, [blogs, onStatsChange]);

  const handleSave = (blog) => {
    setBlogs((previous) => [
      {
        id: Date.now(),
        ...blog,
      },
      ...previous,
    ]);

    setShowForm(false);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    setBlogs((previous) =>
      previous.filter((blog) => blog.id !== id)
    );
  };

  return (
    <div className="cms-editor-body">
      <div className="cms-section-toolbar">
        <div>
          <h3>News & Blogs</h3>

          <p>
            Create educational articles, clinic updates and
            skincare information.
          </p>
        </div>

        <button
          type="button"
          className="cms-primary-button"
          onClick={() => setShowForm(true)}
        >
          <FiPlus />
          Create Article
        </button>
      </div>

      {showForm && (
        <BlogForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="cms-results-list">
        {blogs.length === 0 ? (
          <div className="cms-empty-state">
            <div className="cms-empty-icon">
              <FiBookOpen />
            </div>

            <h3>No blog articles yet</h3>

            <p>
              Create your first educational article for the
              public clinic website.
            </p>

            <button
              type="button"
              className="cms-primary-button"
              onClick={() => setShowForm(true)}
            >
              <FiPlus />
              Create Article
            </button>
          </div>
        ) : (
          blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BlogsEditor;