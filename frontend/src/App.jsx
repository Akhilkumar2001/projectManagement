import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice.js';
import Layout from './components/layout/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Tasks from './pages/Tasks.jsx';
import Users from './pages/admin/Users.jsx';
import ActivityLog from './pages/admin/ActivityLog.jsx';
import Profile from './pages/Profile.jsx';
import Campaigns from './pages/Campaigns.jsx';
import CampaignDetail from './pages/CampaignDetail.jsx';

const PrivateRoute = ({ children, roles }) => {
  const { token, user } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [token, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="campaigns"
          element={
            <PrivateRoute roles={['admin']}>
              <Campaigns />
            </PrivateRoute>
          }
        />
        <Route
          path="campaigns/:id"
          element={
            <PrivateRoute roles={['admin']}>
              <CampaignDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute roles={['admin']}>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="activity"
          element={
            <PrivateRoute roles={['admin']}>
              <ActivityLog />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
