import Layout from "../../components/layout/Layout";
import StatCard from "../../components/ui/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RevenueChart from "../../components/dashboard/RevenueChart";
import PatientChart from "../../components/dashboard/PatientChart";
import AppointmentTable from "../../components/dashboard/AppointmentTable";
import LowStockCard from "../../components/dashboard/LowStockCard";

import {
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";

function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            <h1 className="text-4xl font-bold tracking-tight text-slate-800">
    Good Morning 👋
</h1>
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Welcome back to DermaCare Dashboard
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
      </div>
    </Layout>
  );
}

export default Dashboard;