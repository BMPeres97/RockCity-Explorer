import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlanProvider } from './context/PlanContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Tourist Pages
import HomePage from './pages/HomePage';
import PlacesPage from './pages/PlacesPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import MapPage from './pages/MapPage';
import PlanPage from './pages/PlanPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages (Sections 14 - 18)
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPlacesPage from './pages/admin/AdminPlacesPage';
import AdminPlaceFormPage from './pages/admin/AdminPlaceFormPage';

function App() {
  return (
    <AuthProvider>
      <PlanProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              <Routes>
                {/* Tourist Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/places" element={<PlacesPage />} />
                <Route path="/places/:id" element={<PlaceDetailPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/plan" element={<PlanPage />} />

                {/* Administrator Routes (Section 14) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/places" element={<AdminPlacesPage />} />
                <Route path="/admin/places/new" element={<AdminPlaceFormPage />} />
                <Route path="/admin/places/:id/edit" element={<AdminPlaceFormPage />} />

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PlanProvider>
    </AuthProvider>
  );
}

export default App;
