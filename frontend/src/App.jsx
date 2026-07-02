import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './routes/Login';
import Overview from './routes/Overview';
import Links from './routes/Links';
import CyberBackground from './components/Background/CyberBackground';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CyberBackground />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Overview />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/links" element={
            <PrivateRoute>
              <Layout>
                <Links />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/stats" element={
            <PrivateRoute>
              <Layout>
                <div className="text-center py-20 text-cyber-textSecondary">صفحه آمار در حال توسعه است...</div>
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout>
                <div className="text-center py-20 text-cyber-textSecondary">صفحه پروفایل در حال توسعه است...</div>
              </Layout>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
