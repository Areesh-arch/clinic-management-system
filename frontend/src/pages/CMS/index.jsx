import { useState } from "react";
import Layout from "../../components/layout/Layout";

import CMSHeader from "../../components/cms/CMSHeader";
import CMSSummary from "../../components/cms/CMSSummary";
import CMSNavigation from "../../components/cms/CMSNavigation";

import HomepageEditor from "../../components/cms/homepage/HomepageEditor";
import TreatmentsEditor from "../../components/cms/treatments/TreatmentsEditor";
import ResultsEditor from "../../components/cms/results/ResultsEditor";
import BlogsEditor from "../../components/cms/blogs/BlogsEditor";
import QuizEditor from "../../components/cms/quiz/QuizEditor";
import ContactEditor from "../../components/cms/contact/ContactEditor";

import "../../styles/cms.css";

const CMS_SECTIONS = [
  {
    id: "homepage",
    title: "Homepage",
    description: "Manage the main message visitors see.",
  },
  {
    id: "treatments",
    title: "Treatments",
    description: "Manage treatments shown on the website.",
  },
  {
    id: "results",
    title: "Results",
    description: "Manage before & after results.",
  },
  {
    id: "blogs",
    title: "News & Blogs",
    description: "Create educational articles and updates.",
  },
  {
    id: "quiz",
    title: "Skin Quiz",
    description: "Manage your website skin quiz.",
  },
  {
    id: "contact",
    title: "Contact Information",
    description: "Manage contact and consultation details.",
  },
];

function CMS() {
  const [activeSection, setActiveSection] = useState("homepage");

  const [stats, setStats] = useState({
    results: 0,
    publishedResults: 0,
    treatments: 0,
    blogs: 0,
  });

  const activeSectionData = CMS_SECTIONS.find(
    (section) => section.id === activeSection
  );

  const updateStats = (newStats) => {
    setStats((previous) => ({
      ...previous,
      ...newStats,
    }));
  };

  const renderEditor = () => {
    switch (activeSection) {
      case "homepage":
        return <HomepageEditor />;

      case "treatments":
        return (
          <TreatmentsEditor
            onStatsChange={updateStats}
          />
        );

      case "results":
        return (
          <ResultsEditor
            onStatsChange={updateStats}
          />
        );

      case "blogs":
        return (
          <BlogsEditor
            onStatsChange={updateStats}
          />
        );

      case "quiz":
        return <QuizEditor />;

      case "contact":
        return <ContactEditor />;

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="cms-page">
        <CMSHeader />

        <CMSSummary
          sectionCount={CMS_SECTIONS.length}
          results={stats.results}
          publishedResults={stats.publishedResults}
          treatments={stats.treatments}
          blogs={stats.blogs}
        />

        <section className="cms-workspace">
          <CMSNavigation
            sections={CMS_SECTIONS}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <main className="cms-editor">
            <div className="cms-editor-header">
              <div>
                <span className="cms-editor-eyebrow">
                  EDIT CONTENT
                </span>

                <h2>{activeSectionData?.title}</h2>

                <p>{activeSectionData?.description}</p>
              </div>

              <span className="cms-editor-state">
                MANAGED
              </span>
            </div>

            {renderEditor()}
          </main>
        </section>
      </div>
    </Layout>
  );
}

export default CMS;