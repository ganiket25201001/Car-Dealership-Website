import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import LeadListing from './pages/LeadListing.tsx';
import LeadDetails from './pages/LeadDetails.tsx';
import LeadEdit from './pages/LeadEdit.tsx';
import LeadManagement from './pages/LeadManagement.tsx';
import Dashboard from './pages/Dashboard.tsx';
import UserProfile from './pages/UserProfile.tsx';
import UserProfileEdit from './pages/UserProfileEdit.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LeadListing />} />
              <Route path="/leads" element={<LeadListing />} />
              <Route path="/leads/:id" element={<LeadDetails />} />
              <Route path="/leads/:id/edit" element={<LeadEdit />} />
              <Route path="/management" element={<LeadManagement />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/edit" element={<UserProfileEdit />} />
            </Routes>
          </Layout>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;