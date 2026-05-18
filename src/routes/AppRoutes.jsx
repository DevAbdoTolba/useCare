import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

import AdminLayout from '../components/layout/AdminLayout.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import UsersListPage from '../pages/admin/UsersListPage.jsx';
import SpecialtiesPage from '../pages/admin/SpecialtiesPage.jsx';
import AppointmentsPage from '../pages/admin/AppointmentsPage.jsx';
import SystemSettingsPage from '../pages/admin/SystemSettingsPage.jsx';

import DoctorLayout from '../components/layout/DoctorLayout.jsx';
import DoctorCalendarPage from '../pages/doctor/DoctorCalendarPage.jsx';
import DaySchedulePage from '../pages/doctor/DaySchedulePage.jsx';

import PatientLayout from '../components/layout/PatientLayout.jsx';
import PatientHomePage from '../pages/patient/PatientHomePage.jsx';
import WeekPickerPage from '../pages/patient/WeekPickerPage.jsx';
import AvailableSlotsPage from '../pages/patient/AvailableSlotsPage.jsx';
import MyAppointmentsPage from '../pages/patient/MyAppointmentsPage.jsx';

/**
 * Route map. Auth guards are intentionally OFF for the scaffold so devs
 * can navigate anywhere while building. Wrap the role groups with
 * <Route element={<ProtectedRoute roles={['admin']} />}> when ready.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="specialties" element={<SpecialtiesPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
      </Route>

      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorCalendarPage />} />
        <Route path="day/:date" element={<DaySchedulePage />} />
      </Route>

      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<PatientHomePage />} />
        <Route path="doctor/:doctorId/week" element={<WeekPickerPage />} />
        <Route path="doctor/:doctorId/slots" element={<AvailableSlotsPage />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
