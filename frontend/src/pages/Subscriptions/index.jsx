import { useEffect, useMemo, useState } from "react";

import {
  FiCreditCard,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiChevronDown,
  FiArrowUpRight,
  FiRefreshCw,
} from "react-icons/fi";

import Layout from "../../components/layout/Layout";
import {
  getAllSubscriptions,
  changeSubscriptionPlan,
} from "../../services/subscriptionService";


const PLAN_OPTIONS = [
  "All Plans",
  "Basic",
  "Professional",
  "Premium",
];

const STATUS_OPTIONS = [
  "All Statuses",
  "Active",
  "Trial",
  "Expired",
];


const PLAN_DETAILS = {
  Basic: {
    label: "Basic",
    description: "Essential tools for small clinics.",
    price: "Rs. 4,999",
    features: [
      "Patient management",
      "Appointments",
      "Basic billing",
      "Inventory",
    ],
  },

  Professional: {
    label: "Professional",
    description: "Complete clinic management for growing practices.",
    price: "Rs. 9,999",
    features: [
      "Everything in Basic",
      "Staff management",
      "Treatment records",
      "CRM & CMS",
    ],
  },

  Premium: {
    label: "Premium",
    description: "Advanced tools for established aesthetic clinics.",
    price: "Rs. 19,999",
    features: [
      "Everything in Professional",
      "Advanced analytics",
      "Advanced clinic controls",
      "Priority platform support",
    ],
  },
};


function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function normalizePlan(plan) {
  if (!plan) {
    return "—";
  }

  const value = String(plan).toLowerCase();

  switch (value) {
    case "basic":
      return "Basic";

    case "professional":
      return "Professional";

    case "premium":
      return "Premium";

    default:
      return String(plan)
        .charAt(0)
        .toUpperCase() + String(plan).slice(1);
  }
}


function normalizeStatus(status) {
  if (!status) {
    return "—";
  }

  const value = String(status).toLowerCase();

  switch (value) {
    case "active":
      return "Active";

    case "trial":
      return "Trial";

    case "expired":
      return "Expired";

    case "cancelled":
      return "Cancelled";

    case "canceled":
      return "Cancelled";

    default:
      return String(status)
        .charAt(0)
        .toUpperCase() + String(status).slice(1);
  }
}


function getPlanClass(plan) {
  switch (normalizePlan(plan)) {
    case "Premium":
      return "subscription-plan premium";

    case "Professional":
      return "subscription-plan professional";

    default:
      return "subscription-plan basic";
  }
}


function getStatusClass(status) {
  switch (normalizeStatus(status)) {
    case "Active":
      return "subscription-status active";

    case "Trial":
      return "subscription-status trial";

    default:
      return "subscription-status expired";
  }
}


function getClinicInitials(clinicName) {
  if (!clinicName) {
    return "CL";
  }

  return clinicName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}


function StatCard({
  icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <div className={`subscription-stat-card ${type || ""}`}>
      <div className="subscription-stat-top">
        <div className="subscription-stat-icon">
          {icon}
        </div>

        <span className="subscription-stat-arrow">
          <FiArrowUpRight size={15} />
        </span>
      </div>

      <div className="subscription-stat-value">
        {value}
      </div>

      <div className="subscription-stat-label">
        {label}
      </div>

      <div className="subscription-stat-description">
        {description}
      </div>
    </div>
  );
}


export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [selectedSubscription, setSelectedSubscription] =
    useState(null);

  const [selectedPlan, setSelectedPlan] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [changeError, setChangeError] = useState("");


  async function loadSubscriptions(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAllSubscriptions();

      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load subscriptions:", err);

      setError(
        err?.message ||
          "Failed to load subscriptions. Please try again."
      );

      setSubscriptions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


  useEffect(() => {
    loadSubscriptions();
  }, []);


  const filteredSubscriptions = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const clinicName =
        subscription.clinic_name || "";

      const tenantId =
        String(subscription.tenant_id || "");

      const normalizedPlan =
        normalizePlan(subscription.plan);

      const normalizedStatus =
        normalizeStatus(subscription.status);

      const matchesSearch =
        !normalizedSearch ||
        clinicName
          .toLowerCase()
          .includes(normalizedSearch) ||
        tenantId.includes(normalizedSearch);

      const matchesPlan =
        planFilter === "All Plans" ||
        normalizedPlan === planFilter;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        normalizedStatus === statusFilter;

      return (
        matchesSearch &&
        matchesPlan &&
        matchesStatus
      );
    });
  }, [
    subscriptions,
    search,
    planFilter,
    statusFilter,
  ]);


  const stats = useMemo(() => {
    return {
      total: subscriptions.length,

      active: subscriptions.filter(
        (item) =>
          normalizeStatus(item.status) === "Active"
      ).length,

      trial: subscriptions.filter(
        (item) =>
          normalizeStatus(item.status) === "Trial"
      ).length,

      expired: subscriptions.filter(
        (item) =>
          normalizeStatus(item.status) === "Expired"
      ).length,
    };
  }, [subscriptions]);


  function openPlanModal(subscription) {
    setSelectedSubscription(subscription);
    setSelectedPlan(
      normalizePlan(subscription.plan)
    );
    setChangeError("");
    setIsModalOpen(true);
  }


  function closePlanModal() {
    if (changingPlan) {
      return;
    }

    setIsModalOpen(false);
    setSelectedSubscription(null);
    setSelectedPlan("");
    setChangeError("");
  }


  async function handlePlanChange() {
    if (!selectedSubscription || !selectedPlan) {
      return;
    }

    const currentPlan =
      normalizePlan(selectedSubscription.plan);

    if (currentPlan === selectedPlan) {
      closePlanModal();
      return;
    }

    try {
      setChangingPlan(true);
      setChangeError("");

      await changeSubscriptionPlan(
        selectedSubscription.tenant_id,
        selectedPlan.toLowerCase()
      );

      await loadSubscriptions(true);

      setIsModalOpen(false);
      setSelectedSubscription(null);
      setSelectedPlan("");
    } catch (err) {
      console.error(
        "Failed to change subscription plan:",
        err
      );

      setChangeError(
        err?.message ||
          "Failed to change subscription plan. Please try again."
      );
    } finally {
      setChangingPlan(false);
    }
  }


  function resetFilters() {
    setSearch("");
    setPlanFilter("All Plans");
    setStatusFilter("All Statuses");
  }


  return (
    <Layout>
      <div className="subscriptions-page">

        <style>{`
          .subscriptions-page {
            min-height: 100%;
            background: #FBF8F0;
            padding: 28px 30px 40px;
            color: #45524A;
          }

          .subscriptions-container {
            max-width: 1500px;
            margin: 0 auto;
          }

          .subscriptions-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 24px;
            margin-bottom: 28px;
          }

          .subscriptions-eyebrow {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #9B8246;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 8px;
          }

          .subscriptions-eyebrow-line {
            width: 26px;
            height: 1px;
            background: #D8C99B;
          }

          .subscriptions-title {
            margin: 0;
            color: #193D2F;
            font-size: 30px;
            line-height: 1.2;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .subscriptions-subtitle {
            margin: 8px 0 0;
            color: #748077;
            font-size: 14px;
            line-height: 1.6;
            max-width: 650px;
          }

          .subscription-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .subscription-header-badge {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 11px 15px;
            background: #FFFDF8;
            border: 1px solid #E5E1D8;
            border-radius: 12px;
            color: #536258;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 5px 18px rgba(35, 77, 60, 0.04);
          }

          .subscription-header-badge svg {
            color: #7A9E7E;
          }

          .subscription-refresh-btn {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #E5E1D8;
            border-radius: 11px;
            background: #FFFDF8;
            color: #536258;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .subscription-refresh-btn:hover {
            border-color: #B8C7B4;
            color: #234D3C;
            background: #F7F5ED;
          }

          .subscription-refresh-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .subscription-refresh-btn.spinning svg {
            animation: subscription-spin 0.8s linear infinite;
          }

          @keyframes subscription-spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          .subscription-stats {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 25px;
          }

          .subscription-stat-card {
            background: #FFFDF8;
            border: 1px solid #E6E1D8;
            border-radius: 15px;
            padding: 18px;
            min-height: 150px;
            box-shadow: 0 8px 25px rgba(35, 77, 60, 0.035);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .subscription-stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(35, 77, 60, 0.07);
          }

          .subscription-stat-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .subscription-stat-icon {
            width: 38px;
            height: 38px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #DDE6D8;
            color: #41654E;
          }

          .subscription-stat-arrow {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F4F2EB;
            color: #8B948D;
          }

          .subscription-stat-value {
            margin-top: 18px;
            color: #193D2F;
            font-size: 27px;
            line-height: 1;
            font-weight: 700;
          }

          .subscription-stat-label {
            margin-top: 7px;
            color: #4F5C54;
            font-size: 13px;
            font-weight: 700;
          }

          .subscription-stat-description {
            margin-top: 4px;
            color: #89918B;
            font-size: 11px;
          }

          .subscription-stat-card.active .subscription-stat-icon {
            background: #DDE9DD;
            color: #47704E;
          }

          .subscription-stat-card.trial .subscription-stat-icon {
            background: #F1EBD8;
            color: #927B40;
          }

          .subscription-stat-card.expired .subscription-stat-icon {
            background: #F1E2DE;
            color: #98665D;
          }

          .subscription-content {
            background: #FFFDF8;
            border: 1px solid #E6E1D8;
            border-radius: 17px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(35, 77, 60, 0.04);
          }

          .subscription-content-header {
            padding: 20px 22px;
            border-bottom: 1px solid #ECE8DF;
          }

          .subscription-content-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 17px;
          }

          .subscription-content-title {
            margin: 0;
            color: #193D2F;
            font-size: 17px;
            font-weight: 700;
          }

          .subscription-content-caption {
            margin: 4px 0 0;
            color: #8A938C;
            font-size: 12px;
          }

          .subscription-result-count {
            color: #7E867F;
            font-size: 12px;
            font-weight: 600;
          }

          .subscription-filters {
            display: grid;
            grid-template-columns: minmax(240px, 1fr) 180px 180px auto;
            gap: 10px;
            align-items: center;
          }

          .subscription-search {
            position: relative;
          }

          .subscription-search-icon {
            position: absolute;
            left: 13px;
            top: 50%;
            transform: translateY(-50%);
            color: #8A948D;
            pointer-events: none;
          }

          .subscription-input,
          .subscription-select {
            width: 100%;
            height: 43px;
            border: 1px solid #DDD9D0;
            background: #FBF9F4;
            border-radius: 10px;
            color: #45524A;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .subscription-input {
            padding: 0 13px 0 39px;
          }

          .subscription-select {
            padding: 0 34px 0 12px;
            appearance: none;
            cursor: pointer;
          }

          .subscription-input:focus,
          .subscription-select:focus {
            border-color: #A8C5A0;
            box-shadow: 0 0 0 3px rgba(168, 197, 160, 0.18);
          }

          .subscription-select-wrapper {
            position: relative;
          }

          .subscription-select-chevron {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #879189;
          }

          .subscription-reset-btn {
            height: 43px;
            padding: 0 15px;
            border-radius: 10px;
            border: 1px solid #DDD9D0;
            background: #FFFDF8;
            color: #647067;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .subscription-reset-btn:hover {
            border-color: #B8C7B4;
            color: #234D3C;
            background: #F7F5ED;
          }

          .subscription-error {
            margin: 0 22px 18px;
            padding: 12px 14px;
            border: 1px solid #E5C9C3;
            border-radius: 10px;
            background: #FBF0ED;
            color: #8C5C53;
            font-size: 12px;
            line-height: 1.5;
          }

          .subscription-table-wrap {
            width: 100%;
            overflow-x: auto;
          }

          .subscription-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 850px;
          }

          .subscription-table th {
            padding: 13px 20px;
            text-align: left;
            color: #8A938C;
            background: #FCFAF5;
            border-bottom: 1px solid #EAE6DD;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .subscription-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #EEEAE2;
            vertical-align: middle;
            font-size: 13px;
          }

          .subscription-table tbody tr {
            transition: background 0.2s ease;
          }

          .subscription-table tbody tr:hover {
            background: #FCFBF7;
          }

          .subscription-table tbody tr:last-child td {
            border-bottom: none;
          }

          .clinic-cell {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 210px;
          }

          .clinic-avatar {
            width: 40px;
            height: 40px;
            flex: 0 0 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #DDE6D8;
            color: #315B43;
            font-weight: 800;
            font-size: 13px;
          }

          .clinic-name {
            color: #234D3C;
            font-size: 13px;
            font-weight: 700;
          }

          .clinic-id {
            margin-top: 3px;
            color: #8A938C;
            font-size: 10px;
          }

          .subscription-plan {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
          }

          .subscription-plan.basic {
            background: #EEF1EC;
            color: #60705F;
          }

          .subscription-plan.professional {
            background: #E2EBE0;
            color: #41634B;
          }

          .subscription-plan.premium {
            background: #F1EAD5;
            color: #8D743C;
          }

          .subscription-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
          }

          .subscription-status::before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }

          .subscription-status.active {
            color: #4E7455;
          }

          .subscription-status.active::before {
            background: #78A47C;
          }

          .subscription-status.trial {
            color: #927B40;
          }

          .subscription-status.trial::before {
            background: #C9A95D;
          }

          .subscription-status.expired {
            color: #95665D;
          }

          .subscription-status.expired::before {
            background: #BD8278;
          }

          .subscription-date {
            color: #5F6B63;
            font-size: 12px;
            white-space: nowrap;
          }

          .subscription-date-icon {
            margin-right: 6px;
            color: #9AA29B;
            vertical-align: -2px;
          }

          .subscription-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            height: 35px;
            padding: 0 11px;
            border: 1px solid #D9DFD6;
            border-radius: 8px;
            background: #F8FAF6;
            color: #41634B;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .subscription-action:hover {
            background: #DDE6D8;
            border-color: #B9CBB4;
          }

          .subscription-action:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .subscription-empty {
            padding: 55px 20px;
            text-align: center;
          }

          .subscription-empty-icon {
            width: 52px;
            height: 52px;
            margin: 0 auto 13px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #EEF1EC;
            color: #6C846D;
          }

          .subscription-empty-title {
            margin: 0;
            color: #405047;
            font-size: 15px;
            font-weight: 700;
          }

          .subscription-empty-text {
            margin: 6px 0 0;
            color: #929991;
            font-size: 12px;
          }

          .subscription-loading {
            padding: 65px 20px;
            text-align: center;
            color: #7E887F;
            font-size: 13px;
          }

          .subscription-loading-icon {
            margin-bottom: 10px;
            animation: subscription-spin 0.9s linear infinite;
          }

          .subscription-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(25, 61, 47, 0.38);
            backdrop-filter: blur(5px);
          }

          .subscription-modal {
            width: min(560px, 100%);
            max-height: 90vh;
            overflow-y: auto;
            background: #FFFDF8;
            border: 1px solid #E4DED2;
            border-radius: 18px;
            box-shadow: 0 25px 70px rgba(25, 61, 47, 0.22);
          }

          .subscription-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
            padding: 22px 23px 18px;
            border-bottom: 1px solid #ECE8DF;
          }

          .subscription-modal-eyebrow {
            color: #9B8246;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.2px;
            text-transform: uppercase;
          }

          .subscription-modal-title {
            margin: 5px 0 0;
            color: #193D2F;
            font-size: 19px;
            font-weight: 700;
          }

          .subscription-modal-close {
            width: 33px;
            height: 33px;
            border: 1px solid #E0DCD3;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FBF9F4;
            color: #727C75;
            cursor: pointer;
          }

          .subscription-modal-close:hover {
            background: #F1EEE6;
            color: #234D3C;
          }

          .subscription-modal-body {
            padding: 21px 23px;
          }

          .subscription-current-clinic {
            padding: 13px;
            border-radius: 11px;
            background: #F5F5EE;
            border: 1px solid #E5E3D9;
            margin-bottom: 19px;
          }

          .subscription-current-label {
            color: #8A938C;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          .subscription-current-name {
            margin-top: 4px;
            color: #31513E;
            font-size: 13px;
            font-weight: 700;
          }

          .subscription-plan-options {
            display: grid;
            gap: 10px;
          }

          .subscription-plan-option {
            position: relative;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px;
            border: 1px solid #E0DDD4;
            border-radius: 12px;
            cursor: pointer;
            background: #FFFDF8;
            transition: all 0.2s ease;
          }

          .subscription-plan-option:hover {
            border-color: #B8C9B3;
            background: #FAFBF7;
          }

          .subscription-plan-option.selected {
            border-color: #8EAA88;
            background: #F3F7F1;
            box-shadow: 0 0 0 2px rgba(142, 170, 136, 0.12);
          }

          .subscription-radio {
            width: 17px;
            height: 17px;
            margin-top: 2px;
            accent-color: #6F916F;
            flex: 0 0 auto;
          }

          .subscription-plan-option-content {
            flex: 1;
          }

          .subscription-plan-option-top {
            display: flex;
            justify-content: space-between;
            gap: 12px;
          }

          .subscription-plan-option-name {
            color: #31513E;
            font-size: 13px;
            font-weight: 800;
          }

          .subscription-plan-price {
            color: #8D743C;
            font-size: 12px;
            font-weight: 800;
            white-space: nowrap;
          }

          .subscription-plan-description {
            margin-top: 4px;
            color: #7C867E;
            font-size: 11px;
            line-height: 1.5;
          }

          .subscription-plan-features {
            display: flex;
            flex-wrap: wrap;
            gap: 5px 12px;
            margin-top: 9px;
          }

          .subscription-plan-feature {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: #6A756D;
            font-size: 10px;
          }

          .subscription-plan-feature svg {
            color: #789476;
          }

          .subscription-change-error {
            margin-top: 14px;
            padding: 10px 12px;
            border-radius: 9px;
            background: #FBF0ED;
            border: 1px solid #E5C9C3;
            color: #8C5C53;
            font-size: 11px;
            line-height: 1.5;
          }

          .subscription-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 9px;
            padding: 16px 23px 21px;
            border-top: 1px solid #ECE8DF;
          }

          .subscription-modal-btn {
            height: 40px;
            padding: 0 17px;
            border-radius: 9px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          .subscription-modal-btn.cancel {
            border: 1px solid #DDD9D0;
            background: #FFFDF8;
            color: #68736C;
          }

          .subscription-modal-btn.confirm {
            border: 1px solid #315B43;
            background: #234D3C;
            color: white;
            box-shadow: 0 5px 15px rgba(35, 77, 60, 0.15);
          }

          .subscription-modal-btn.confirm:hover {
            background: #193D2F;
          }

          .subscription-modal-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          @media (max-width: 1100px) {
            .subscription-stats {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .subscription-filters {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 700px) {
            .subscriptions-page {
              padding: 20px 15px 30px;
            }

            .subscriptions-header {
              flex-direction: column;
              margin-bottom: 21px;
            }

            .subscriptions-title {
              font-size: 25px;
            }

            .subscription-header-actions {
              width: 100%;
            }

            .subscription-header-badge {
              flex: 1;
              justify-content: center;
            }

            .subscription-stats {
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }

            .subscription-stat-card {
              min-height: 135px;
              padding: 14px;
            }

            .subscription-stat-value {
              font-size: 23px;
            }

            .subscription-content-header {
              padding: 17px 15px;
            }

            .subscription-content-title-row {
              align-items: flex-start;
              flex-direction: column;
              gap: 5px;
            }

            .subscription-filters {
              grid-template-columns: 1fr;
            }

            .subscription-table th,
            .subscription-table td {
              padding-left: 14px;
              padding-right: 14px;
            }
          }

          @media (max-width: 450px) {
            .subscription-stats {
              grid-template-columns: 1fr;
            }
          }
        `}</style>


        <div className="subscriptions-container">

          {/* HEADER */}

          <div className="subscriptions-header">
            <div>
              <div className="subscriptions-eyebrow">
                <span className="subscriptions-eyebrow-line" />
                Platform Management
              </div>

              <h1 className="subscriptions-title">
                Subscription Management
              </h1>

              <p className="subscriptions-subtitle">
                Manage clinic subscriptions, plans, trial periods
                and subscription status from one central platform.
              </p>
            </div>

            <div className="subscription-header-actions">
              <div className="subscription-header-badge">
                <FiCreditCard size={16} />
                SaaS Subscription Center
              </div>

              <button
                type="button"
                className={`subscription-refresh-btn ${
                  refreshing ? "spinning" : ""
                }`}
                onClick={() => loadSubscriptions(true)}
                disabled={loading || refreshing}
                title="Refresh subscriptions"
              >
                <FiRefreshCw size={16} />
              </button>
            </div>
          </div>


          {/* STATS */}

          <div className="subscription-stats">
            <StatCard
              icon={<FiCreditCard size={18} />}
              label="Total Subscriptions"
              value={stats.total}
              description="All clinic subscriptions"
            />

            <StatCard
              icon={<FiCheckCircle size={18} />}
              label="Active"
              value={stats.active}
              description="Currently active plans"
              type="active"
            />

            <StatCard
              icon={<FiClock size={18} />}
              label="Trial"
              value={stats.trial}
              description="Clinics in trial period"
              type="trial"
            />

            <StatCard
              icon={<FiAlertCircle size={18} />}
              label="Expired"
              value={stats.expired}
              description="Subscriptions requiring attention"
              type="expired"
            />
          </div>


          {/* MAIN CONTENT */}

          <div className="subscription-content">

            <div className="subscription-content-header">

              <div className="subscription-content-title-row">

                <div>
                  <h2 className="subscription-content-title">
                    Clinic Subscriptions
                  </h2>

                  <p className="subscription-content-caption">
                    Review and manage subscriptions for every clinic.
                  </p>
                </div>

                <div className="subscription-result-count">
                  Showing {filteredSubscriptions.length} of{" "}
                  {subscriptions.length} clinics
                </div>

              </div>


              {/* FILTERS */}

              <div className="subscription-filters">

                <div className="subscription-search">
                  <FiSearch
                    className="subscription-search-icon"
                    size={16}
                  />

                  <input
                    className="subscription-input"
                    type="text"
                    placeholder="Search clinic or tenant ID..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />
                </div>


                <div className="subscription-select-wrapper">
                  <FiFilter
                    className="subscription-filter-icon"
                    size={14}
                  />

                  <select
                    className="subscription-select"
                    value={planFilter}
                    onChange={(event) =>
                      setPlanFilter(event.target.value)
                    }
                  >
                    {PLAN_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>

                  <FiChevronDown
                    className="subscription-select-chevron"
                    size={14}
                  />
                </div>


                <div className="subscription-select-wrapper">
                  <select
                    className="subscription-select"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>

                  <FiChevronDown
                    className="subscription-select-chevron"
                    size={14}
                  />
                </div>


                <button
                  type="button"
                  className="subscription-reset-btn"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>

              </div>
            </div>


            {/* BACKEND ERROR */}

            {error && (
              <div className="subscription-error">
                {error}
              </div>
            )}


            {/* TABLE */}

            <div className="subscription-table-wrap">

              {loading ? (
                <div className="subscription-loading">
                  <FiRefreshCw
                    className="subscription-loading-icon"
                    size={20}
                  />

                  <div>
                    Loading subscriptions...
                  </div>
                </div>

              ) : filteredSubscriptions.length > 0 ? (

                <table className="subscription-table">

                  <thead>
                    <tr>
                      <th>Clinic</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>Trial Ends</th>
                      <th>End Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>


                  <tbody>

                    {filteredSubscriptions.map(
                      (subscription) => {

                        const plan =
                          normalizePlan(
                            subscription.plan
                          );

                        const status =
                          normalizeStatus(
                            subscription.status
                          );

                        return (
                          <tr
                            key={subscription.id}
                          >

                            <td>
                              <div className="clinic-cell">

                                <div className="clinic-avatar">
                                  {getClinicInitials(
                                    subscription.clinic_name
                                  )}
                                </div>

                                <div>
                                  <div className="clinic-name">
                                    {subscription.clinic_name ||
                                      `Clinic #${subscription.tenant_id}`}
                                  </div>

                                  <div className="clinic-id">
                                    Tenant #{subscription.tenant_id}
                                  </div>
                                </div>

                              </div>
                            </td>


                            <td>
                              <span
                                className={getPlanClass(
                                  plan
                                )}
                              >
                                {plan}
                              </span>
                            </td>


                            <td>
                              <span
                                className={getStatusClass(
                                  status
                                )}
                              >
                                {status}
                              </span>
                            </td>


                            <td>
                              <span className="subscription-date">
                                <FiCalendar
                                  className="subscription-date-icon"
                                  size={12}
                                />

                                {formatDate(
                                  subscription.starts_at
                                )}
                              </span>
                            </td>


                            <td>
                              <span className="subscription-date">
                                {formatDate(
                                  subscription.trial_ends_at
                                )}
                              </span>
                            </td>


                            <td>
                              <span className="subscription-date">
                                {formatDate(
                                  subscription.ends_at
                                )}
                              </span>
                            </td>


                            <td>
                              <button
                                type="button"
                                className="subscription-action"
                                onClick={() =>
                                  openPlanModal(
                                    subscription
                                  )
                                }
                              >
                                <FiEdit3 size={13} />
                                Change Plan
                              </button>
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>
                </table>

              ) : (

                <div className="subscription-empty">

                  <div className="subscription-empty-icon">
                    <FiSearch size={21} />
                  </div>

                  <h3 className="subscription-empty-title">
                    {subscriptions.length === 0
                      ? "No subscriptions found"
                      : "No matching subscriptions"}
                  </h3>

                  <p className="subscription-empty-text">
                    {subscriptions.length === 0
                      ? "There are currently no subscriptions in the system."
                      : "Try changing your search or filters."}
                  </p>

                </div>
              )}

            </div>
          </div>
        </div>


        {/* CHANGE PLAN MODAL */}

        {isModalOpen &&
          selectedSubscription && (

            <div
              className="subscription-modal-overlay"
              onMouseDown={(event) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  closePlanModal();
                }
              }}
            >

              <div className="subscription-modal">

                <div className="subscription-modal-header">

                  <div>
                    <div className="subscription-modal-eyebrow">
                      Subscription Plan
                    </div>

                    <h2 className="subscription-modal-title">
                      Change Plan
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="subscription-modal-close"
                    onClick={closePlanModal}
                    disabled={changingPlan}
                    aria-label="Close"
                  >
                    <FiX size={17} />
                  </button>

                </div>


                <div className="subscription-modal-body">

                  <div className="subscription-current-clinic">

                    <div className="subscription-current-label">
                      Clinic
                    </div>

                    <div className="subscription-current-name">
                      {selectedSubscription.clinic_name ||
                        `Clinic #${selectedSubscription.tenant_id}`}
                    </div>

                  </div>


                  <div className="subscription-plan-options">

                    {Object.values(
                      PLAN_DETAILS
                    ).map((plan) => (

                      <label
                        key={plan.label}
                        className={`subscription-plan-option ${
                          selectedPlan ===
                          plan.label
                            ? "selected"
                            : ""
                        }`}
                      >

                        <input
                          className="subscription-radio"
                          type="radio"
                          name="subscription-plan"
                          value={plan.label}
                          checked={
                            selectedPlan ===
                            plan.label
                          }
                          onChange={(event) =>
                            setSelectedPlan(
                              event.target.value
                            )
                          }
                          disabled={changingPlan}
                        />


                        <div className="subscription-plan-option-content">

                          <div className="subscription-plan-option-top">

                            <span className="subscription-plan-option-name">
                              {plan.label}
                            </span>

                            <span className="subscription-plan-price">
                              {plan.price}
                            </span>

                          </div>


                          <div className="subscription-plan-description">
                            {plan.description}
                          </div>


                          <div className="subscription-plan-features">

                            {plan.features.map(
                              (feature) => (

                                <span
                                  key={feature}
                                  className="subscription-plan-feature"
                                >
                                  <FiCheckCircle
                                    size={11}
                                  />

                                  {feature}
                                </span>

                              )
                            )}

                          </div>

                        </div>

                      </label>

                    ))}

                  </div>


                  {changeError && (
                    <div className="subscription-change-error">
                      {changeError}
                    </div>
                  )}

                </div>


                <div className="subscription-modal-footer">

                  <button
                    type="button"
                    className="subscription-modal-btn cancel"
                    onClick={closePlanModal}
                    disabled={changingPlan}
                  >
                    Cancel
                  </button>


                  <button
                    type="button"
                    className="subscription-modal-btn confirm"
                    onClick={handlePlanChange}
                    disabled={
                      changingPlan ||
                      !selectedPlan
                    }
                  >
                    {changingPlan
                      ? "Updating..."
                      : "Update Plan"}
                  </button>

                </div>

              </div>

            </div>
          )}

      </div>
    </Layout>
  );
}