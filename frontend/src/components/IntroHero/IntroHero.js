import React from 'react';
import { Link } from 'react-router-dom';
import './IntroHero.css';

const IntroHero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Our Platform</h1>
        <p>Discover amazing products and services tailored for you.</p>
        <Link to="/about" className="hero-btn">Learn More</Link>
      </div>
    </section>
  );
};

export default IntroHero;
