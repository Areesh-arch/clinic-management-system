import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import PlatformOverview from "../pages/PlatformOverview/index.jsx";
import Tenants from "../pages/Tenants";
import Subscriptions from "../pages/Subscriptions/index.jsx";

import Patients from "../pages/Patients";
import Staff from "../pages/Staff";
import Treatments from "../pages/Treatments";
import Appointments from "../pages/Appointments";
import Billing from "../pages/Billing";
import Inventory from "../pages/Inventory";
import Settings from "../pages/Settings";
import Photos from "../pages/Photos";
import CRM from "../pages/CRM";
import CMS from "../pages/CMS";

import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ===================================================
              OWNER DASHBOARD
          =================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* ===================================================
              SUPER ADMIN DASHBOARD
          =================================================== */}

          <Route
            path="/platform"
            element={<PlatformOverview />}
          />

          <Route
            path="/tenants"
            element={<Tenants />}
          />
          
          <Route
            path="/subscriptions"
            element={<Subscriptions />}
          />
          
          {/* ===================================================
              CLINIC MODULES
          =================================================== */}

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/staff"
            element={<Staff />}
          />

          <Route
            path="/appointments"
            element={<Appointments />}
          />

          <Route
            path="/treatments"
            element={<Treatments />}
          />

          <Route
            path="/photos"
            element={<Photos />}
          />

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/billing"
            element={<Billing />}
          />

          <Route
            path="/crm"
            element={<CRM />}
          />

          <Route
            path="/cms"
            element={<CMS />}
          />


          {/* ===================================================
              SUPER ADMIN SYSTEM SETTINGS
          =================================================== */}

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRouter;