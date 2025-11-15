import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

// layouts
import MainLayout from "../layouts/MainLayout";
import PatientLayout from "../layouts/PatientLayout";
import DoctorLayout from "../layouts/DoctorLayout";

// pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientAppointmentsPage from "../pages/patient/PatientAppointmentPage";
import PatientProfilePage from "../pages/patient/PatientProfilePage";

import DoctorDashboard from "../pages/doctor/DoctorDashboard";

// helpers
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on first load
  useEffect(() => {
    (async () => {
      try {
        const user = await api("/api/auth/me");
        setMe(user);
      } catch {
        // not logged in, ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public layout (header + main) */}
        <Route element={<MainLayout me={me} setMe={setMe} />}>
          <Route
            path="/"
            element={
              me ? (
                <Navigate
                  to={
                    me.role === "doctor"
                      ? "/doctor/dashboard"
                      : "/patient/dashboard"
                  }
                />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/login" element={<LoginPage me={me} setMe={setMe} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Patient section */}
        <Route
          element={
            <ProtectedRoute me={me} allowedRoles={["patient"]}>
              <PatientLayout me={me} setMe={setMe} />
            </ProtectedRoute>
          }
        >
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route
            path="/patient/appointments"
            element={<PatientAppointmentsPage />}
          />
          <Route path="/patient/profile" element={<PatientProfilePage />} />
        </Route>

        {/* Doctor section */}
        <Route
          element={
            <ProtectedRoute me={me} allowedRoles={["doctor"]}>
              <DoctorLayout me={me} />
            </ProtectedRoute>
          }
        >
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
