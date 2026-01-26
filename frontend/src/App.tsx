import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TeacherPanel } from './pages/TeacherPanel';
import { DebugDashboard } from './pages/DebugDashboard';
import { MainLayout } from './layouts/MainLayout';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/teacher" replace />} />
          <Route path="/teacher" element={<TeacherPanel />} />
          <Route path="/debug" element={<DebugDashboard />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
