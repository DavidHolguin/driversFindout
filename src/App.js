import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

import Login from './components/Login';
import Register from './components/Register';
import MenuBar from './components/MenuBar';
import Profile from './components/Profile';
import Settings from './components/Settings';

import IOSInstallGuide from './components/IOSInstallGuide'; // Add this import

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto pt-16 pb-14 text-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<Settings />} />

   
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/settings" element={<Settings />} />

            <Route path="/download" element={<IOSInstallGuide />} /> 
            
           
          </Routes>
        </main>
        <MenuBar />
      </div>
    </Router>
  );
}

export default App;