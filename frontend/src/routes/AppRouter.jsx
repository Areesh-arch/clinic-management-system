import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Staff from "../pages/Staff";
import Treatments from "../pages/Treatments";
import Appointments from "../pages/Appointments";
import Billing from "../pages/Billing";
import Inventory from "../pages/Inventory";
import Settings from "../pages/Settings";
import Photos from "../pages/Photos";

import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

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
            path="/billing"
            element={<Billing />}
          />

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/photos"
            element={<Photos />}
          />

          <Route
            path="/billing"
            element={<Billing />}
          />

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