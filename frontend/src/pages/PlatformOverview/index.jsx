import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiUsers,
} from "react-icons/fi";

import Layout from "../../components/layout/Layout";
import { getPlatformOverview } from "../../services/platformService";


const formatLabel = (value) => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const statusClass = (status) => {
  switch (status) {
    case "active":
      return "platform-status platform-status-active";

    case "trial":
      return "platform-status platform-status-trial";

    case "expired":
    case "cancelled":
    case "inactive":
    case "suspended":
      return "platform-status platform-status-inactive";

    default:
      return "platform-status";
  }
};


function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="platform-stat-card">
      <div className="platform-stat-top">
        <div className="platform-stat-icon">
          {icon}
        </div>
      </div>

      <p className="platform-stat-title">
        {title}
      </p>

      <div className="platform-stat-value">
        {value}
      </div>

      <p className="platform-stat-description">
        {description}
      </p>
    </div>
  );
}


function PlatformOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPlatformOverview();

      setOverview(data);
    } catch (err) {
      console.error(
        "Failed to load platform overview:",
        err
      );

      setError(
        err?.message ||
          "Unable to load platform overview."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadOverview();
  }, []);


  const stats = overview?.stats || {};

  const recentClinics =
    overview?.recent_clinics || [];

  const planBreakdown =
    overview?.subscription_breakdown || {};


  const planEntries = useMemo(() => {
    return Object.entries(planBreakdown);
  }, [planBreakdown]);


  const renderStatValue = (value) => {
    if (loading) {
      return (
        <span className="platform-loading-value">
          —
        </span>
      );
    }

    if (value === null || value === undefined) {
      return "—";
    }

    return value;
  };


  return (
    <Layout>
      <style>{`
        .platform-page {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          color: #45524A;
        }

        .platform-eyebrow {
          color: #9B8246;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .platform-title {
          margin: 0;
          color: #234D3C;
          font-size: 38px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .platform-subtitle {
          margin-top: 14px;
          color: #647267;
          font-size: 17px;
          line-height: 1.6;
        }

        .platform-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          margin-top: 42px;
        }

        .platform-stat-card {
          background: #FFFDF8;
          border: 1px solid #E7E1D7;
          border-radius: 22px;
          padding: 28px 30px;
          min-height: 182px;
          box-shadow:
            0 2px 4px rgba(35, 77, 60, 0.05),
            0 12px 28px rgba(35, 77, 60, 0.04);
        }

        .platform-stat-top {
          display: flex;
          justify-content: flex-end;
        }

        .platform-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #DDE6D8;
          color: #234D3C;
          font-size: 19px;
        }

        .platform-stat-title {
          margin: 20px 0 0;
          color: #647267;
          font-size: 16px;
        }

        .platform-stat-value {
          margin-top: 15px;
          color: #234D3C;
          font-size: 34px;
          font-weight: 700;
          line-height: 1;
        }

        .platform-stat-description {
          margin: 15px 0 0;
          color: #879188;
          font-size: 14px;
        }

        .platform-loading-value {
          display: inline-block;
          animation: platformPulse 1.2s ease-in-out infinite;
        }

        @keyframes platformPulse {
          0%, 100% {
            opacity: 0.35;
          }

          50% {
            opacity: 1;
          }
        }

        .platform-welcome {
          margin-top: 40px;
          padding: 42px;
          border-radius: 26px;
          background: #234D3C;
          color: white;
          box-shadow: 0 12px 30px rgba(35, 77, 60, 0.12);
        }

        .platform-welcome-eyebrow {
          color: #D8C99B;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.23em;
          text-transform: uppercase;
        }

        .platform-welcome-title {
          margin: 18px 0 0;
          font-size: 30px;
          font-weight: 700;
          line-height: 1.25;
        }

        .platform-welcome-text {
          margin-top: 18px;
          max-width: 900px;
          color: rgba(255, 255, 255, 0.84);
          font-size: 16px;
          line-height: 1.8;
        }

        .platform-section-grid {
          display: grid;
          grid-template-columns: 1.65fr 1fr;
          gap: 24px;
          margin-top: 30px;
        }

        .platform-panel {
          background: #FFFDF8;
          border: 1px solid #E7E1D7;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 8px 22px rgba(35, 77, 60, 0.04);
        }

        .platform-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 26px;
          border-bottom: 1px solid #ECE7DE;
        }

        .platform-panel-heading {
          margin: 0;
          color: #234D3C;
          font-size: 20px;
          font-weight: 700;
        }

        .platform-panel-description {
          margin: 5px 0 0;
          color: #879188;
          font-size: 13px;
        }

        .platform-panel-body {
          padding: 0;
        }

        .platform-table {
          width: 100%;
          border-collapse: collapse;
        }

        .platform-table th {
          padding: 14px 22px;
          background: #FBF8F0;
          color: #7B847D;
          font-size: 12px;
          font-weight: 700;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .platform-table td {
          padding: 17px 22px;
          border-top: 1px solid #EEE9E0;
          color: #45524A;
          font-size: 14px;
        }

        .platform-clinic-name {
          color: #234D3C;
          font-weight: 700;
        }

        .platform-clinic-owner {
          margin-top: 4px;
          color: #8A938C;
          font-size: 12px;
        }

        .platform-status {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 6px 11px;
          background: #F0F1EE;
          color: #69736C;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .platform-status-active {
          background: #DDEBE1;
          color: #286046;
        }

        .platform-status-trial {
          background: #F3EBD5;
          color: #947A39;
        }

        .platform-status-inactive {
          background: #EEE8E2;
          color: #876E60;
        }

        .platform-manage-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: none;
          background: transparent;
          color: #557B65;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .platform-manage-button:hover {
          color: #234D3C;
        }

        .platform-empty {
          padding: 44px 25px;
          text-align: center;
          color: #8A938C;
          font-size: 14px;
        }

        .platform-plan-list {
          padding: 10px 24px 24px;
        }

        .platform-plan-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 4px;
          border-bottom: 1px solid #EEE9E0;
        }

        .platform-plan-row:last-child {
          border-bottom: none;
        }

        .platform-plan-name {
          color: #45524A;
          font-size: 14px;
          font-weight: 600;
        }

        .platform-plan-count {
          min-width: 34px;
          height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #DDE6D8;
          color: #234D3C;
          font-size: 13px;
          font-weight: 700;
        }

        .platform-error {
          margin-top: 30px;
          padding: 18px 20px;
          border-radius: 16px;
          border: 1px solid #E8CFC7;
          background: #FFF7F4;
          color: #8A5145;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .platform-retry {
          border: none;
          border-radius: 10px;
          padding: 9px 15px;
          background: #234D3C;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .platform-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .platform-section-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .platform-stats {
            grid-template-columns: 1fr;
          }

          .platform-title {
            font-size: 31px;
          }

          .platform-welcome {
            padding: 28px;
          }

          .platform-table {
            min-width: 760px;
          }

          .platform-panel-body {
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="platform-page">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="platform-eyebrow">
          Platform Administration
        </div>

        <h1 className="platform-title">
          Platform Overview
        </h1>

        <p className="platform-subtitle">
          Monitor your DermaCare SaaS platform,
          clinics, subscriptions, patients and
          overall activity.
        </p>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="platform-error">
            <span>{error}</span>

            <button
              type="button"
              className="platform-retry"
              onClick={loadOverview}
            >
              Try Again
            </button>
          </div>
        )}


        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="platform-stats">

          <StatCard
            icon={<FiUsers />}
            title="Total Clinics"
            value={renderStatValue(
              stats.total_clinics
            )}
            description="Platform-wide"
          />

          <StatCard
            icon={<FiCreditCard />}
            title="Active Subscriptions"
            value={renderStatValue(
              stats.active_subscriptions
            )}
            description="Currently active"
          />

          <StatCard
            icon={<FiUsers />}
            title="Total Patients"
            value={renderStatValue(
              stats.total_patients
            )}
            description="Across all clinics"
          />

          <StatCard
            icon={<FiBarChart2 />}
            title="Platform Revenue"
            value={renderStatValue(
              stats.platform_revenue
            )}
            description="Subscription revenue"
          />

        </div>


        {/* =====================================================
            WELCOME
        ====================================================== */}

        <section className="platform-welcome">

          <div className="platform-welcome-eyebrow">
            SaaS Platform
          </div>

          <h2 className="platform-welcome-title">
            Welcome to DermaCare Platform Administration
          </h2>

          <p className="platform-welcome-text">
            This dashboard gives you a complete
            overview of the clinics using the
            DermaCare platform, subscription activity
            and platform-wide operational metrics.
          </p>

        </section>


        {/* =====================================================
            LOWER DASHBOARD
        ====================================================== */}

        <div className="platform-section-grid">

          {/* RECENT CLINICS */}

          <section className="platform-panel">

            <div className="platform-panel-header">

              <div>
                <h2 className="platform-panel-heading">
                  Recent Clinics
                </h2>

                <p className="platform-panel-description">
                  Recently registered clinics on the platform
                </p>
              </div>

            </div>

            <div className="platform-panel-body">

              {loading ? (
                <div className="platform-empty">
                  Loading clinics...
                </div>
              ) : recentClinics.length === 0 ? (
                <div className="platform-empty">
                  No clinics found.
                </div>
              ) : (
                <table className="platform-table">

                  <thead>
                    <tr>
                      <th>Clinic</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>

                    {recentClinics.map((clinic) => (
                      <tr key={clinic.id}>

                        <td>
                          <div className="platform-clinic-name">
                            {clinic.business_name}
                          </div>

                          <div className="platform-clinic-owner">
                            {clinic.owner_name ||
                              "Owner not available"}
                          </div>
                        </td>

                        <td>
                          {formatLabel(
                            clinic.plan
                          )}
                        </td>

                        <td>
                          <span
                            className={statusClass(
                              clinic.subscription_status
                            )}
                          >
                            {formatLabel(
                              clinic.subscription_status
                            )}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            clinic.created_at
                          )}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              )}

            </div>

          </section>


          {/* SUBSCRIPTION BREAKDOWN */}

          <section className="platform-panel">

            <div className="platform-panel-header">

              <div>
                <h2 className="platform-panel-heading">
                  Subscription Plans
                </h2>

                <p className="platform-panel-description">
                  Current distribution across clinics
                </p>
              </div>

              <FiActivity
                style={{
                  color: "#557B65",
                  fontSize: "20px",
                }}
              />

            </div>

            <div className="platform-plan-list">

              {loading ? (
                <div className="platform-empty">
                  Loading plans...
                </div>
              ) : planEntries.length === 0 ? (
                <div className="platform-empty">
                  No subscription data available.
                </div>
              ) : (
                planEntries.map(
                  ([plan, count]) => (
                    <div
                      className="platform-plan-row"
                      key={plan}
                    >

                      <span className="platform-plan-name">
                        {formatLabel(plan)}
                      </span>

                      <span className="platform-plan-count">
                        {count}
                      </span>

                    </div>
                  )
                )
              )}

            </div>

          </section>

        </div>

      </div>
    </Layout>
  );
}

export default PlatformOverview;