import { useRef, useState } from "react";
import {
  FiEdit3,
  FiImage,
  FiHome,
  FiGrid,
  FiBookOpen,
  FiHelpCircle,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiEye,
} from "react-icons/fi";

import "../../styles/cms.css";
import Layout from "../../components/layout/Layout";


const CMS_SECTIONS = [
  {
    id: "homepage",
    title: "Homepage",
    description: "Manage the main message visitors see.",
    icon: <FiHome />,
  },
  {
    id: "treatments",
    title: "Treatments",
    description: "Manage treatments shown on the website.",
    icon: <FiGrid />,
  },
  {
    id: "results",
    title: "Results",
    description: "Manage before & after results.",
    icon: <FiImage />,
  },
  {
    id: "news",
    title: "News & Blogs",
    description: "Create educational articles and updates.",
    icon: <FiBookOpen />,
  },
  {
    id: "quiz",
    title: "Skin Quiz",
    description: "Manage your website skin quiz.",
    icon: <FiHelpCircle />,
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "Manage contact and consultation details.",
    icon: <FiPhone />,
  },
];


const INITIAL_RESULTS = [
  {
    id: 1,
    title: "Acne Treatment",
    description: "8-week progress with visible improvement.",
    beforeImage: null,
    afterImage: null,
    published: true,
  },
];


function CMS() {
  const [activeSection, setActiveSection] = useState("homepage");

  const [homepage, setHomepage] = useState({
    eyebrow: "AESTHETIC & DERMATOLOGY",
    heading: "Your Skin. Your Confidence.",
    description:
      "Personalised dermatology and aesthetic care designed around your individual skin goals.",
  });

  const [results, setResults] = useState(INITIAL_RESULTS);

  const [showResultForm, setShowResultForm] = useState(false);

  const [resultForm, setResultForm] = useState({
    title: "",
    description: "",
    beforeImage: null,
    afterImage: null,
    published: true,
  });

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);


  const activeSectionData = CMS_SECTIONS.find(
    (section) => section.id === activeSection
  );


  const handleImageChange = (event, type) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must not exceed 10 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setResultForm((previous) => ({
      ...previous,
      [type]: {
        file,
        preview: previewUrl,
      },
    }));
  };


  const removeSelectedImage = (type) => {
    const selectedImage = resultForm[type];

    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setResultForm((previous) => ({
      ...previous,
      [type]: null,
    }));
  };


  const resetResultForm = () => {
    if (resultForm.beforeImage?.preview) {
      URL.revokeObjectURL(resultForm.beforeImage.preview);
    }

    if (resultForm.afterImage?.preview) {
      URL.revokeObjectURL(resultForm.afterImage.preview);
    }

    setResultForm({
      title: "",
      description: "",
      beforeImage: null,
      afterImage: null,
      published: true,
    });

    setShowResultForm(false);
  };


  const saveResult = () => {
    if (!resultForm.title.trim()) {
      alert("Please enter a treatment name.");
      return;
    }

    if (!resultForm.beforeImage) {
      alert("Please upload the before image.");
      return;
    }

    if (!resultForm.afterImage) {
      alert("Please upload the after image.");
      return;
    }

    const newResult = {
      id: Date.now(),
      title: resultForm.title,
      description: resultForm.description,
      beforeImage: resultForm.beforeImage.preview,
      afterImage: resultForm.afterImage.preview,
      published: resultForm.published,
    };

    setResults((previous) => [newResult, ...previous]);

    resetResultForm();
  };


  const deleteResult = (id) => {
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


  const publishedResults = results.filter(
    (result) => result.published
  ).length;


  return (
    <Layout>
      <div className="cms-page">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

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
            <span className="cms-status-dot"></span>
            Website Content
          </div>

        </header>


        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <section className="cms-summary">

          <div className="cms-summary-card">
            <span>Website Sections</span>
            <strong>{CMS_SECTIONS.length}</strong>
            <small>Managed sections</small>
          </div>

          <div className="cms-summary-card">
            <span>Results</span>
            <strong>{results.length}</strong>
            <small>Before & after cases</small>
          </div>

          <div className="cms-summary-card">
            <span>Published Results</span>
            <strong>{publishedResults}</strong>
            <small>Visible on website</small>
          </div>

          <div className="cms-summary-card">
            <span>Content Status</span>
            <strong className="cms-status-text">
              Active
            </strong>
            <small>CMS ready</small>
          </div>

        </section>


        {/* =====================================================
            CMS WORKSPACE
        ===================================================== */}

        <section className="cms-workspace">

          {/* ===================================================
              CONTENT NAVIGATION
          =================================================== */}

          <aside className="cms-navigation">

            <div className="cms-navigation-header">

              <span>CONTENT</span>

              <p>
                Select a section to manage.
              </p>

            </div>


            <nav className="cms-navigation-list">

              {CMS_SECTIONS.map((section) => (

                <button
                  key={section.id}
                  type="button"
                  className={
                    activeSection === section.id
                      ? "cms-navigation-item active"
                      : "cms-navigation-item"
                  }
                  onClick={() =>
                    setActiveSection(section.id)
                  }
                >

                  <span className="cms-navigation-icon">
                    {section.icon}
                  </span>

                  <span className="cms-navigation-text">

                    <strong>
                      {section.title}
                    </strong>

                    <small>
                      {section.description}
                    </small>

                  </span>

                  <span className="cms-navigation-arrow">
                    →
                  </span>

                </button>

              ))}

            </nav>

          </aside>


          {/* ===================================================
              EDITOR
          =================================================== */}

          <main className="cms-editor">

            <div className="cms-editor-header">

              <div>

                <span className="cms-editor-eyebrow">
                  EDIT CONTENT
                </span>

                <h2>
                  {activeSectionData?.title}
                </h2>

                <p>
                  {activeSectionData?.description}
                </p>

              </div>

              <span className="cms-editor-state">
                MANAGED
              </span>

            </div>


            {/* =================================================
                HOMEPAGE
            ================================================= */}

            {activeSection === "homepage" && (

              <div className="cms-editor-body">

                <div className="cms-information-box">

                  <div className="cms-information-icon">
                    i
                  </div>

                  <div>

                    <strong>
                      Homepage content
                    </strong>

                    <p>
                      These fields control the main introduction
                      displayed on your public clinic website.
                    </p>

                  </div>

                </div>


                <div className="cms-form">

                  <div className="cms-field">

                    <label>
                      Eyebrow
                    </label>

                    <input
                      type="text"
                      value={homepage.eyebrow}
                      onChange={(event) =>
                        setHomepage({
                          ...homepage,
                          eyebrow: event.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="cms-field">

                    <label>
                      Main Heading
                    </label>

                    <input
                      type="text"
                      value={homepage.heading}
                      onChange={(event) =>
                        setHomepage({
                          ...homepage,
                          heading: event.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="cms-field">

                    <label>
                      Introduction
                    </label>

                    <textarea
                      value={homepage.description}
                      onChange={(event) =>
                        setHomepage({
                          ...homepage,
                          description: event.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="cms-form-actions">

                    <button
                      type="button"
                      className="cms-secondary-button"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      className="cms-primary-button"
                    >
                      Save Changes
                    </button>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                RESULTS
            ================================================= */}

            {activeSection === "results" && (

              <div className="cms-editor-body">

                <div className="cms-section-toolbar">

                  <div>

                    <h3>
                      Before & After Results
                    </h3>

                    <p>
                      Add treatment results that you want
                      visitors to see on your website.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="cms-primary-button"
                    onClick={() =>
                      setShowResultForm(true)
                    }
                  >
                    <FiPlus />
                    Add Result
                  </button>

                </div>


                {/* =============================================
                    ADD RESULT FORM
                ============================================= */}

                {showResultForm && (

                  <div className="cms-result-form">

                    <div className="cms-result-form-header">

                      <div>

                        <span className="cms-editor-eyebrow">
                          NEW RESULT
                        </span>

                        <h3>
                          Add Before & After Result
                        </h3>

                      </div>

                      <button
                        type="button"
                        className="cms-close-button"
                        onClick={resetResultForm}
                      >
                        ×
                      </button>

                    </div>


                    <div className="cms-field">

                      <label>
                        Treatment Name
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Acne Treatment"
                        value={resultForm.title}
                        onChange={(event) =>
                          setResultForm({
                            ...resultForm,
                            title: event.target.value,
                          })
                        }
                      />

                    </div>


                    <div className="cms-field">

                      <label>
                        Description
                      </label>

                      <textarea
                        placeholder="Describe the treatment result..."
                        value={resultForm.description}
                        onChange={(event) =>
                          setResultForm({
                            ...resultForm,
                            description: event.target.value,
                          })
                        }
                      />

                    </div>


                    {/* =========================================
                        IMAGE UPLOADS
                    ========================================= */}

                    <div className="cms-image-grid">

                      {/* BEFORE */}

                      <div className="cms-image-upload">

                        <div className="cms-image-upload-header">

                          <div>

                            <strong>
                              Before Image
                            </strong>

                            <span>
                              Patient condition before treatment
                            </span>

                          </div>

                        </div>


                        {resultForm.beforeImage ? (

                          <div className="cms-image-preview">

                            <img
                              src={
                                resultForm.beforeImage.preview
                              }
                              alt="Before treatment"
                            />

                            <button
                              type="button"
                              className="cms-image-remove"
                              onClick={() =>
                                removeSelectedImage(
                                  "beforeImage"
                                )
                              }
                            >
                              <FiTrash2 />
                              Remove
                            </button>

                          </div>

                        ) : (

                          <button
                            type="button"
                            className="cms-upload-box"
                            onClick={() =>
                              beforeInputRef.current?.click()
                            }
                          >

                            <FiUpload />

                            <strong>
                              Upload Before Image
                            </strong>

                            <span>
                              JPG, PNG or WEBP · Max 10 MB
                            </span>

                          </button>

                        )}

                        <input
                          ref={beforeInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          hidden
                          onChange={(event) =>
                            handleImageChange(
                              event,
                              "beforeImage"
                            )
                          }
                        />

                      </div>


                      {/* AFTER */}

                      <div className="cms-image-upload">

                        <div className="cms-image-upload-header">

                          <div>

                            <strong>
                              After Image
                            </strong>

                            <span>
                              Patient result after treatment
                            </span>

                          </div>

                        </div>


                        {resultForm.afterImage ? (

                          <div className="cms-image-preview">

                            <img
                              src={
                                resultForm.afterImage.preview
                              }
                              alt="After treatment"
                            />

                            <button
                              type="button"
                              className="cms-image-remove"
                              onClick={() =>
                                removeSelectedImage(
                                  "afterImage"
                                )
                              }
                            >
                              <FiTrash2 />
                              Remove
                            </button>

                          </div>

                        ) : (

                          <button
                            type="button"
                            className="cms-upload-box"
                            onClick={() =>
                              afterInputRef.current?.click()
                            }
                          >

                            <FiUpload />

                            <strong>
                              Upload After Image
                            </strong>

                            <span>
                              JPG, PNG or WEBP · Max 10 MB
                            </span>

                          </button>

                        )}

                        <input
                          ref={afterInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          hidden
                          onChange={(event) =>
                            handleImageChange(
                              event,
                              "afterImage"
                            )
                          }
                        />

                      </div>

                    </div>


                    <label className="cms-publish-toggle">

                      <input
                        type="checkbox"
                        checked={resultForm.published}
                        onChange={(event) =>
                          setResultForm({
                            ...resultForm,
                            published: event.target.checked,
                          })
                        }
                      />

                      <span>

                        <strong>
                          Publish on website
                        </strong>

                        <small>
                          When enabled, this result will be
                          visible on the public website.
                        </small>

                      </span>

                    </label>


                    <div className="cms-form-actions">

                      <button
                        type="button"
                        className="cms-secondary-button"
                        onClick={resetResultForm}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="cms-primary-button"
                        onClick={saveResult}
                      >
                        Save Result
                      </button>

                    </div>

                  </div>

                )}


                {/* =============================================
                    RESULT LIST
                ============================================= */}

                <div className="cms-results-list">

                  {results.length === 0 ? (

                    <div className="cms-empty-state">

                      <div className="cms-empty-icon">
                        <FiImage />
                      </div>

                      <h3>
                        No website results yet
                      </h3>

                      <p>
                        Add your first before & after treatment
                        result to display it on the public website.
                      </p>

                      <button
                        type="button"
                        className="cms-primary-button"
                        onClick={() =>
                          setShowResultForm(true)
                        }
                      >
                        <FiPlus />
                        Add Result
                      </button>

                    </div>

                  ) : (

                    results.map((result) => (

                      <article
                        className="cms-result-card"
                        key={result.id}
                      >

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

                            <span>
                              BEFORE
                            </span>

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

                            <span>
                              AFTER
                            </span>

                          </div>

                        </div>


                        <div className="cms-result-content">

                          <div>

                            <span className="cms-result-label">
                              TREATMENT RESULT
                            </span>

                            <h3>
                              {result.title}
                            </h3>

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
                              onClick={() =>
                                deleteResult(result.id)
                              }
                            >
                              <FiTrash2 />
                            </button>

                          </div>

                        </div>

                      </article>

                    ))

                  )}

                </div>

              </div>

            )}


            {/* =================================================
                OTHER SECTIONS
            ================================================= */}

            {[
              "treatments",
              "news",
              "quiz",
              "contact",
            ].includes(activeSection) && (

              <div className="cms-editor-body">

                <div className="cms-information-box">

                  <div className="cms-information-icon">
                    i
                  </div>

                  <div>

                    <strong>
                      {activeSectionData?.title}
                    </strong>

                    <p>
                      This section is now part of the CMS
                      workspace. Its actual website data will
                      be connected in the next integration step.
                    </p>

                  </div>

                </div>


                <div className="cms-placeholder-editor">

                  <div className="cms-placeholder-icon">
                    {activeSectionData?.icon}
                  </div>

                  <h3>
                    {activeSectionData?.title}
                  </h3>

                  <p>
                    Manage this section from the CMS.
                    We will connect its saved content to the
                    public website after the CMS structure is
                    finalized.
                  </p>

                </div>

              </div>

            )}

          </main>

        </section>

      </div>
    </Layout>
  );
}


export default CMS;