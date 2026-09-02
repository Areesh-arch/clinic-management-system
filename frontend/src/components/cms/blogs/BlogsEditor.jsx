import { useCallback, useEffect, useState } from "react";
import {
  FiPlus,
  FiBookOpen,
} from "react-icons/fi";

import BlogForm from "./BlogForm";
import BlogCard from "./BlogCard";
import cmsService from "../../../services/cmsService";

function BlogsEditor({ onStatsChange }) {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD BLOGS
  // =====================================================

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);

      const data = await cmsService.getBlogs();

      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      alert(error.message || "Failed to load blog articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // =====================================================
  // UPDATE CMS SUMMARY
  // =====================================================

  useEffect(() => {
    onStatsChange?.({
      blogs: blogs.filter(
        (blog) => blog.is_published
      ).length,
    });
  }, [blogs, onStatsChange]);

  // =====================================================
  // SAVE BLOG
  // =====================================================

  const handleSave = async (blogData) => {
    try {
      setSaving(true);

      const createdBlog =
        await cmsService.createBlog(blogData);

      setBlogs((previous) => [
        createdBlog,
        ...previous,
      ]);

      setShowForm(false);
    } catch (error) {
      console.error("Failed to save blog:", error);

      alert(
        error.message ||
          "Failed to save blog article."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE BLOG
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cmsService.deleteBlog(id);

      setBlogs((previous) =>
        previous.filter(
          (blog) => blog.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete blog:",
        error
      );

      alert(
        error.message ||
          "Failed to delete blog article."
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

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
          disabled={saving}
        >
          <FiPlus />
          Create Article
        </button>
      </div>

      {showForm && (
        <BlogForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}

      {loading ? (
        <div className="cms-loading-state">
          Loading blog articles...
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default BlogsEditor;