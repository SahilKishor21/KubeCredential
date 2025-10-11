import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { IssuancePage } from './pages/IssuancePage';
import { VerificationPage } from './pages/VerificationPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/issue" element={<IssuancePage />} />
          <Route path="/verify" element={<VerificationPage />} />
        </Routes>
      </Layout>
      <Toaster richColors position="top-right" />
    </Router>
  );
}

export default App;