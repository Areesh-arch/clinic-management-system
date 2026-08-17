import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import StatCard from "../../components/ui/StatCard";

import QuickActions from "../../components/dashboard/QuickActions";
import RevenueChart from "../../components/dashboard/RevenueChart";
import PatientChart from "../../components/dashboard/PatientChart";
import AppointmentTable from "../../components/dashboard/AppointmentTable";
import LowStockCard from "../../components/dashboard/LowStockCard";

import { useAuth } from "../../context/AuthContext";

import { getDashboardData } from "../../services/dashboardService";

import {
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";

function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getDashboardData();

        console.log("Dashboard API response:", data);

        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadDashboard();
    }
  }, [authLoading, user]);

  // Authentication still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-lg">
          Loading user...
        </p>
      </div>
    );
  }

  // Dashboard API loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // API error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load dashboard
          </h2>

          <p className="text-slate-500 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const stats = dashboardData.stats || {};

  return (
    <Layout>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">
          Good Morning 👋
        </h1>

        <p className="text-slate-500 mt-3 text-lg">
          Welcome back{" "}
          <span className="font-semibold text-slate-700">
            {user?.name || user?.full_name || "User"}
          </span>{" "}
          to DermaCare Dashboard
        </p>

        <p className="text-sm text-slate-400 mt-1">
          Role: {user?.role || "Unknown"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        <StatCard
          title="Today's Revenue"
          value={`PKR ${stats.today_revenue || 0}`}
          icon={<FiDollarSign size={26} />}
        />

        <StatCard
          title="Patients"
          value={stats.patients || 0}
          icon={<FiUsers size={26} />}
        />

        <StatCard
          title="Appointments"
          value={stats.appointments || 0}
          icon={<FiCalendar size={26} />}
        />

        <StatCard
          title="Inventory"
          value={stats.inventory || 0}
          icon={<FiPackage size={26} />}
        />

      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">

        <RevenueChart
          data={dashboardData.revenue || []}
        />

        <PatientChart
          data={dashboardData.weekly_appointments || []}
        />

      </div>

      {/* Tables */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">

        <AppointmentTable
          data={dashboardData.recent_patients || []}
        />

        <LowStockCard
          data={dashboardData.low_stock || []}
        />

      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>

    </Layout>
  );
}

export default Dashboard;