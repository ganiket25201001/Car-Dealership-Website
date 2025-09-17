import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './pages/Login.tsx';
import LeadListing from './pages/LeadListing.tsx';
import LeadDetails from './pages/LeadDetails.tsx';
import LeadEdit from './pages/LeadEdit.tsx';
import LeadManagement from './pages/LeadManagement.tsx';
import Dashboard from './pages/Dashboard.tsx';
import UserProfile from './pages/UserProfile.tsx';
import UserProfileEdit from './pages/UserProfileEdit.tsx';
import AdminUsers from './pages/AdminUsers.tsx';
import AdminGroups from './pages/AdminGroups.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/leads" element={
              <ProtectedRoute>
                <Layout>
                  <LeadListing />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/leads/:id" element={
              <ProtectedRoute>
                <Layout>
                  <LeadDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/leads/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <LeadEdit />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/management" element={
              <ProtectedRoute allowedRoles={['admin', 'leader']}>
                <Layout>
                  <LeadManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <Layout>
                  <UserProfileEdit />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Admin-only routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminUsers />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/admin/groups" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminGroups />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;