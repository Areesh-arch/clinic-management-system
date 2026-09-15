import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import PlatformOverview from "../pages/PlatformOverview/index.jsx";
import SuperAdmins from "../pages/SuperAdmins/index.jsx";
import Tenants from "../pages/Tenants";
import Subscriptions from "../pages/Subscriptions/index.jsx";

import Patients from "../pages/Patients";
import PatientProfile from "../pages/PatientProfile";

import Staff from "../pages/Staff";
import Treatments from "../pages/Treatments";
import TreatmentArchive from "../pages/TreatmentArchive";

import Appointments from "../pages/Appointments";
import AppointmentArchive from "../pages/AppointmentArchive";

import Billing from "../pages/Billing";
import Archive from "../pages/Archive";
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
            path="/platform/admins"
            element={<SuperAdmins />}
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

          {/* PATIENT PROFILE */}

          <Route
            path="/patients/:patientId"
            element={<PatientProfile />}
          />

          <Route
            path="/staff"
            element={<Staff />}
          />


          {/* ===================================================
              APPOINTMENTS
          =================================================== */}

          <Route
            path="/appointments/archive"
            element={<AppointmentArchive />}
          />

          <Route
            path="/appointments"
            element={<Appointments />}
          />


          {/* ===================================================
              TREATMENTS
          =================================================== */}

          <Route
            path="/treatments/archive"
            element={<TreatmentArchive />}
          />

          <Route
            path="/treatments"
            element={<Treatments />}
          />


          {/* ===================================================
              PHOTOS
          =================================================== */}

          <Route
            path="/photos"
            element={<Photos />}
          />


          {/* ===================================================
              INVENTORY
          =================================================== */}

          <Route
            path="/inventory"
            element={<Inventory />}
          />


          {/* ===================================================
              BILLING
          =================================================== */}

          <Route
            path="/billing"
            element={<Billing />}
          />


          {/* ===================================================
              ARCHIVE
          =================================================== */}

          <Route
            path="/archive"
            element={<Archive />}
          />


          {/* ===================================================
              CRM
          =================================================== */}

          <Route
            path="/crm"
            element={<CRM />}
          />


          {/* ===================================================
              CMS
          =================================================== */}

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