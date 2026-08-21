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
        setError(error.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadDashboard();
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EA]">
        <p className="text-[#6E766F]">Loading user...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EA]">
        <p className="text-[#6E766F]">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EA]">
        <div className="text-center max-w-md px-6">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load dashboard
          </h2>

          <p className="text-[#6E766F] mt-2">
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
      <div className="w-full max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#25312A]">
            Good Morning 👋
          </h1>

          <p className="text-[#6E766F] mt-2 text-sm sm:text-base">
            Welcome back{" "}
            <span className="font-semibold text-[#3E4D42]">
              {user?.name || user?.full_name || "User"}
            </span>{" "}
            to DermaCare Dashboard
          </p>

          <p className="text-xs text-[#8A918B] mt-1">
            Role: {user?.role || "Unknown"}
          </p>
        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            min-[520px]:grid-cols-2
            lg:grid-cols-4
            gap-4
            xl:gap-5
          "
        >
          <StatCard
            title="Today's Revenue"
            value={`PKR ${Number(stats.today_revenue || 0).toLocaleString()}`}
            icon={<FiDollarSign size={22} />}
          />

          <StatCard
            title="Patients"
            value={stats.patients || 0}
            icon={<FiUsers size={22} />}
          />

          <StatCard
            title="Appointments"
            value={stats.appointments || 0}
            icon={<FiCalendar size={22} />}
          />

          <StatCard
            title="Inventory"
            value={stats.inventory || 0}
            icon={<FiPackage size={22} />}
          />
        </div>

        {/* =====================================================
            CHARTS
        ===================================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
          "
        >
          <RevenueChart
            data={dashboardData.revenue || []}
          />

          <PatientChart
            data={dashboardData.weekly_appointments || []}
          />
        </div>

        {/* =====================================================
            TABLES
        ===================================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
          "
        >
          <AppointmentTable
            data={dashboardData.recent_patients || []}
          />

          <LowStockCard
            data={dashboardData.low_stock || []}
          />
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <div className="mt-5">
          <QuickActions />
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;