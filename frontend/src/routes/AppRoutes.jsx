import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROLES } from '../constants/roles';

// Code Splitting & Lazy Loading Page Components
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Properties = lazy(() => import('../pages/Properties'));
const PropertyDetails = lazy(() => import('../pages/PropertyDetails'));
const AddProperty = lazy(() => import('../pages/AddProperty'));
const EditProperty = lazy(() => import('../pages/EditProperty'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const BookingsPage = lazy(() => import('../pages/BookingsPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
      <Routes>
        {/* Main Application Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetails />} />

          {/* Protected Routes for Property Owners & Admin */}
          <Route
            path="properties/add"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="properties/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <EditProperty />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes for Authenticated Users */}
          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="chat/:id"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
