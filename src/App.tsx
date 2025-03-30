
import React from 'react';
import { BrowserRouter as Router, useRoutes, Navigate } from 'react-router-dom';
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard';
import './App.css';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Users from './pages/Users';
import { getCurrentUser } from './auth/authService';
import Credentials from './pages/Credentials';




const AppRoutes = () => {
  // Define all routes inside the hook useRoutes
  const isAuthenticated = !!localStorage.getItem('token');
  const privateElement = isAuthenticated ? <Dashboard /> : <Navigate to="/login" />;
  const user = getCurrentUser();

  const routes = useRoutes([
    { path: "/", element: isAuthenticated ? <Dashboard />: <Navigate to="/login" /> },
    { path: "/login", element: <Login /> },
    { path: "/users", element: isAuthenticated && user.role === "admin" ? <Users />: <Navigate to="/login" /> },
    { path: "/register_key_log", element: <Register /> },
    { path: "/dashboard", element:privateElement },
    { path: "/credentials", element: isAuthenticated && user.role === "admin" ? <Credentials />: <Navigate to="/login" />  },
    { path: "*", element: <NotFound /> }, // 404 Page
  ]);

  return routes; // This will render the matched route component
};

function App() {
  return (
    <div className="App">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;