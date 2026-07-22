import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/pages/Landing';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Analyze from './components/pages/Analyze';
import AnalysisResult from './components/pages/AnalysisResult';
import History from './components/pages/History';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import Support from './components/pages/Support';
import About from './components/pages/About';
import Cases from './components/pages/Cases';
import CaseDetail from './components/pages/CaseDetail';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-background"></div>
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/result" element={<AnalysisResult />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
