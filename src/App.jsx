import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Code-split each page so its JavaScript loads only when the route is opened.
// By default every page ships in one up-front bundle; lazy() splits them into
// separate chunks, so the first load is smaller.
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ApartmentDetail = lazy(() => import('./pages/ApartmentDetail'))
const Profile = lazy(() => import('./pages/Profile'))

function App() {
  return (
    // Suspense shows a fallback while a route's chunk is loading.
    <Suspense fallback={<div className="route-loading">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apartment/:id"
          element={
            <ProtectedRoute>
              <ApartmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
