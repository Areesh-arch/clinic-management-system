
import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";

import SubscriptionHeader from "../../components/subscriptions/SubscriptionHeader";
import SubscriptionStats from "../../components/subscriptions/SubscriptionStats";
import PlanConfiguration from "../../components/subscriptions/PlanConfiguration";
import SubscriptionFilters from "../../components/subscriptions/SubscriptionFilters";
import SubscriptionTable from "../../components/subscriptions/SubscriptionTable";
import EditPlanModal from "../../components/subscriptions/EditPlanModal";
import ChangePlanModal from "../../components/subscriptions/ChangePlanModal";

import {
  getAllSubscriptions,
  getPlanConfigs,
  updatePlanConfig,
  changeSubscriptionPlan,
} from "../../services/subscriptionService";

const PLAN_ORDER = ["BASIC", "STANDARD", "PREMIUM"];

const normalizePlan = (plan) => {
  const value = String(plan || "").toUpperCase();

  if (value === "BASIC") return "Basic";
  if (value === "STANDARD") return "Standard";
  if (value === "PREMIUM") return "Premium";

  return plan || "Unknown";
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [planConfigs, setPlanConfigs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [editPlan, setEditPlan] = useState(null);
  const [changePlanSubscription, setChangePlanSubscription] =
    useState(null);

  const [savingPlan, setSavingPlan] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);

  const loadData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [subscriptionData, planData] = await Promise.all([
        getAllSubscriptions(),
        getPlanConfigs(),
      ]);

      setSubscriptions(
        Array.isArray(subscriptionData)
          ? subscriptionData
          : []
      );

      setPlanConfigs(
        Array.isArray(planData)
          ? [...planData].sort((a, b) => {
              const aIndex = PLAN_ORDER.indexOf(
                String(a.plan || "").toUpperCase()
              );

              const bIndex = PLAN_ORDER.indexOf(
                String(b.plan || "").toUpperCase()
              );

              return (
                (aIndex === -1 ? 99 : aIndex) -
                (bIndex === -1 ? 99 : bIndex)
              );
            })
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load subscription data:",
        err
      );

      setError(
        err?.message ||
          "Failed to load subscription information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSubscriptions = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return subscriptions.filter((subscription) => {
      const planName = normalizePlan(
        subscription?.plan
      );

      const status = String(
        subscription?.status || ""
      )
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .toLowerCase();

      const tenantText = String(
        subscription?.tenant_id || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        tenantText.includes(searchValue) ||
        planName.toLowerCase().includes(searchValue) ||
        status.includes(searchValue);

      const matchesPlan =
        planFilter === "All Plans" ||
        planName === planFilter;

      const normalizedStatusFilter =
        statusFilter === "All Statuses"
          ? ""
          : statusFilter.toLowerCase();

      const matchesStatus =
        !normalizedStatusFilter ||
        status === normalizedStatusFilter;

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
    const total = subscriptions.length;

    let active = 0;
    let trial = 0;
    let expired = 0;

    subscriptions.forEach((subscription) => {
      const status = String(
        subscription?.status || ""
      ).toLowerCase();

      if (status === "active") {
        active += 1;
      } else if (status === "trial") {
        trial += 1;
      } else if (status === "expired") {
        expired += 1;
      }
    });

    return {
      total,
      active,
      trial,
      expired,
    };
  }, [subscriptions]);

  const openEditPlan = (plan) => {
    setEditPlan(plan);
  };

  const closeEditPlan = () => {
    if (savingPlan) return;
    setEditPlan(null);
  };

  const handleSavePlan = async (plan, data) => {
    try {
      setSavingPlan(true);
      setError("");

      await updatePlanConfig(plan, data);

      setEditPlan(null);

      await loadData(false);
    } catch (err) {
      console.error(
        "Failed to update subscription plan:",
        err
      );

      throw new Error(
        err?.message ||
          "Failed to update subscription plan."
      );
    } finally {
      setSavingPlan(false);
    }
  };

  const openChangePlan = (subscription) => {
    setChangePlanSubscription(subscription);
  };

  const closeChangePlan = () => {
    if (changingPlan) return;
    setChangePlanSubscription(null);
  };

  const handleChangePlan = async (
    tenantId,
    plan
  ) => {
    try {
      setChangingPlan(true);
      setError("");

      await changeSubscriptionPlan(
        tenantId,
        String(plan).toLowerCase()
      );

      setChangePlanSubscription(null);

      await loadData(false);
    } catch (err) {
      console.error(
        "Failed to change subscription plan:",
        err
      );

      throw new Error(
        err?.message ||
          "Failed to change clinic subscription plan."
      );
    } finally {
      setChangingPlan(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-full space-y-7 pb-10">
        <SubscriptionHeader
          refreshing={refreshing}
          onRefresh={() => loadData(false)}
        />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-[#ded6c6] bg-[#fffdf7] px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#d8cfbf] border-t-[#173B32]" />

            <p className="text-sm font-medium text-[#23483a]">
              Loading subscription management...
            </p>
          </div>
        ) : (
          <>
            <SubscriptionStats stats={stats} />

            <PlanConfiguration
              plans={planConfigs}
              onEdit={openEditPlan}
            />

            <SubscriptionFilters
              search={search}
              setSearch={setSearch}
              planFilter={planFilter}
              setPlanFilter={setPlanFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <SubscriptionTable
              subscriptions={
                filteredSubscriptions
              }
              onChangePlan={openChangePlan}
            />
          </>
        )}

        <EditPlanModal
          plan={editPlan}
          open={Boolean(editPlan)}
          onClose={closeEditPlan}
          onSave={handleSavePlan}
          saving={savingPlan}
        />

        <ChangePlanModal
          subscription={
            changePlanSubscription
          }
          plans={planConfigs}
          open={Boolean(
            changePlanSubscription
          )}
          onClose={closeChangePlan}
          onChange={handleChangePlan}
          changing={changingPlan}
        />
      </div>
    </Layout>
  );
}
