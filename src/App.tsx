import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import LeadListing from './pages/LeadListing.tsx';
import LeadDetails from './pages/LeadDetails.tsx';
import LeadEdit from './pages/LeadEdit.tsx';
import LeadManagement from './pages/LeadManagement.tsx';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile.tsx';
import UserProfileEdit from './pages/UserProfileEdit.tsx';
import AdminUsers from './pages/AdminUsers.tsx';
import AdminGroups from './pages/AdminGroups.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Direct routes without authentication */}
              <Route path="/" element={
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              } />
              
              <Route path="/dashboard" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
              
              <Route path="/leads" element={
                <Layout>
                  <LeadListing />
                </Layout>
              } />
              
              <Route path="/leads/:id" element={
                <Layout>
                  <LeadDetails />
                </Layout>
              } />
              
              <Route path="/leads/:id/edit" element={
                <Layout>
                  <LeadEdit />
                </Layout>
              } />
              
              <Route path="/management" element={
            <Layout>
              <LeadManagement />
            </Layout>
          } />
          
          <Route path="/profile" element={
            <Layout>
              <UserProfile />
            </Layout>
          } />
          
          <Route path="/profile/edit" element={
            <Layout>
              <UserProfileEdit />
            </Layout>
          } />

          <Route path="/admin/users" element={
            <Layout>
              <AdminUsers />
            </Layout>
          } />

          <Route path="/admin/groups" element={
            <Layout>
              <AdminGroups />
            </Layout>
          } />

          {/* Catch all route */}
          <Route path="*" element={
            <Layout>
              <Navigate to="/dashboard" replace />
            </Layout>
          } />
        </Routes>
      </Router>
      </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;