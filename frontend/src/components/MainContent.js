import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Workflow from '../pages/Workflow';
import Recon from '../pages/Recon';
import Persistence from '../pages/Persistence';
import Exploit from '../pages/Exploit';
import Payloads from '../pages/Payloads';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Terminal from '../pages/Terminal'; // Import the new Terminal component

const MainContent = () => {
  return (
    <main className="flex-grow p-6 transition-all duration-300 ease-in-out">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/recon" element={<Recon />} />
        <Route path="/persistence" element={<Persistence />} />
        <Route path="/exploit" element={<Exploit />} />
        <Route path="/payloads/:type" element={<Payloads />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terminal" element={<Terminal />} /> {/* Add the new Terminal route */}
      </Routes>
    </main>
  );
};

export default MainContent;