import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import IntroHero from './components/IntroHero/IntroHero';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<IntroHero />} />
        <Route path="/contact" element={<h2>Contact Page</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
