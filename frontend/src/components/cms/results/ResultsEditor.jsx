import { useEffect, useState } from "react";
import { FiPlus, FiImage } from "react-icons/fi";

import ResultForm from "./ResultForm";
import ResultCard from "./ResultCard";

function ResultsEditor({ onStatsChange }) {
  const [results, setResults] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onStatsChange?.({
      results: results.length,
      publishedResults: results.filter(
        (result) => result.published
      ).length,
    });
  }, [results, onStatsChange]);

  const handleSave = (newResult) => {
    setResults((previous) => [
      {
        id: Date.now(),
        ...newResult,
      },
      ...previous,
    ]);

    setShowForm(false);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this result?"
    );

    if (!confirmed) {
      return;
    }

    setResults((previous) =>
      previous.filter((result) => result.id !== id)
    );
  };

  return (
    <div className="cms-editor-body">
      <div className="cms-section-toolbar">
        <div>
          <h3>Before & After Results</h3>

          <p>
            Add treatment results that you want visitors to see
            on your website.
          </p>
        </div>

        <button
          type="button"
          className="cms-primary-button"
          onClick={() => setShowForm(true)}
        >
          <FiPlus />
          Add Result
        </button>
      </div>

      {showForm && (
        <ResultForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="cms-loading-state">
          Loading results...
        </div>
      ) : (
        <div className="cms-results-list">
          {results.length === 0 ? (
            <div className="cms-empty-state">
              <div className="cms-empty-icon">
                <FiImage />
              </div>

              <h3>No website results yet</h3>

              <p>
                Add your first before & after treatment result
                to display it on the public website.
              </p>

              <button
                type="button"
                className="cms-primary-button"
                onClick={() => setShowForm(true)}
              >
                <FiPlus />
                Add Result
              </button>
            </div>
          ) : (
            results.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
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