import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './pages/Dashboard';
import CreateLink from './pages/CreateLink';
import AllLinks from './pages/AllLinks';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // corrected import
import './App.css';

const App = () => {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateLink />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-links"
          element={
            <PrivateRoute>
              <AllLinks />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
