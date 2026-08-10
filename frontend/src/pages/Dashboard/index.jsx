import Layout from "../../components/layout/Layout";
import StatCard from "../../components/ui/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RevenueChart from "../../components/dashboard/RevenueChart";
import PatientChart from "../../components/dashboard/PatientChart";
import AppointmentTable from "../../components/dashboard/AppointmentTable";
import LowStockCard from "../../components/dashboard/LowStockCard";

import { useAuth } from "../../context/AuthContext";

import {
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <Layout>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">
          Good Morning 👋
        </h1>

        <p className="text-slate-500 mt-3 text-lg">
          Welcome back,{" "}
          <span className="font-semibold text-slate-700">
            {user?.name || user?.full_name || "User"}
          </span>
          {" "}to DermaCare Dashboard
        </p>

        <p className="text-sm text-slate-400 mt-1">
          Role: {user?.role || "Unknown"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Today's Revenue"
          value="PKR 185,000"
          growth="+12%"
          icon={<FiDollarSign size={26} />}
        />

        <StatCard
          title="Patients"
          value="248"
          growth="+8%"
          icon={<FiUsers size={26} />}
        />

        <StatCard
          title="Appointments"
          value="32"
          growth="+15%"
          icon={<FiCalendar size={26} />}
        />

        <StatCard
          title="Inventory"
          value="98"
          growth="-3%"
          icon={<FiPackage size={26} />}
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <RevenueChart />

        <PatientChart />

      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <AppointmentTable />

        <LowStockCard />

      </div>

      <QuickActions />

    </Layout>
  );
}

export default Dashboard;