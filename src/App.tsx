import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import Vocabulary from './pages/my-vocabulary/Vocabulary';
import Unit from './pages/units/Unit';  
import Categories from './pages/categories/Categories';
import Units from './pages/units/Units';
import UnitDetails from './pages/units/UnitDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-vocabulary" element={<Vocabulary />} />
          <Route path="/units" element={<Units />} />
          <Route path="/units/:id" element={<UnitDetails />} />
          <Route path="/categories" element={<Categories />} />
          {/* Add other authenticated routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;