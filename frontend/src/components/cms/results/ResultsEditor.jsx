import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiImage } from "react-icons/fi";

import ResultForm from "./ResultForm";
import ResultCard from "./ResultCard";

import cmsService from "../../../services/cmsService";

function ResultsEditor({ onStatsChange }) {
  const [results, setResults] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD RESULTS FROM BACKEND
  // =====================================================

  const loadResults = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await cmsService.getResults();

      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load CMS results:", err);

      setError(
        err?.message ||
          "Failed to load website results."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // =====================================================
  // UPDATE CMS SUMMARY STATS
  // =====================================================

  useEffect(() => {
    onStatsChange?.({
      results: results.length,
      publishedResults: results.filter(
        (result) =>
          result.is_active === true ||
          result.published === true
      ).length,
    });
  }, [results, onStatsChange]);

  // =====================================================
  // CREATE RESULT
  // =====================================================

  const handleSave = async (formData) => {
    try {
      setError("");

      await cmsService.createResult(formData);

      // Close form only after successful API request.
      setShowForm(false);

      // Reload from database so the UI displays
      // the actual saved record and database ID.
      await loadResults();
    } catch (err) {
      console.error("Failed to save CMS result:", err);

      setError(
        err?.message ||
          "Failed to save the result."
      );
    }
  };

  // =====================================================
  // DELETE RESULT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this result?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await cmsService.deleteResult(id);

      // Reload from database after deletion.
      await loadResults();
    } catch (err) {
      console.error(
        "Failed to delete CMS result:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete the result."
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
          <h3>Before & After Results</h3>

          <p>
            Add treatment results that you want visitors
            to see on your website.
          </p>
        </div>

        <button
          type="button"
          className="cms-primary-button"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          <FiPlus />
          Add Result
        </button>
      </div>

      {/* =================================================
          ERROR MESSAGE
          ================================================= */}

      {error && (
        <div className="cms-error-state">
          {error}
        </div>
      )}

      {/* =================================================
          FORM
          ================================================= */}

      {showForm && (
        <ResultForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* =================================================
          LOADING
          ================================================= */}

      {loading ? (
        <div className="cms-loading-state">
          Loading results...
        </div>
      ) : (
        <div className="cms-results-list">
          {/* =============================================
              EMPTY STATE
              ============================================= */}

          {results.length === 0 ? (
            <div className="cms-empty-state">
              <div className="cms-empty-icon">
                <FiImage />
              </div>

              <h3>No website results yet</h3>

              <p>
                Add your first before & after treatment
                result to display it on the public website.
              </p>

              <button
                type="button"
                className="cms-primary-button"
                onClick={() => {
                  setError("");
                  setShowForm(true);
                }}
              >
                <FiPlus />
                Add Result
              </button>
            </div>
          ) : (
            /* ===========================================
               RESULTS
               =========================================== */

            results.map((result) => (
              <ResultCard
                key={result.id}
                result={{
                  ...result,

                  // Backend uses before_image / after_image.
                  // ResultCard currently expects beforeImage /
                  // afterImage, so normalize them here.
                  beforeImage:
                    result.beforeImage ||
                    result.before_image,

                  afterImage:
                    result.afterImage ||
                    result.after_image,

                  // Backend uses is_active.
                  // ResultCard currently expects published.
                  published:
                    result.published ??
                    result.is_active ??
                    false,
                }}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ResultsEditor;