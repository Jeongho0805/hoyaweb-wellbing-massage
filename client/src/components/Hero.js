import React from 'react';
import { useContent } from '../contexts/ContentContext';
import './Hero.css';

const Hero = () => {
  const { content } = useContent();
  const { hero, reservation } = content;

  const handleReservation = () => {
    window.open(reservation.naverUrl, '_blank');
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">{hero.title}</h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <div className="hero-features">
          {hero.features.map((feature, index) => (
            <div key={index} className="feature">
              <span className="feature-icon">{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
        <div className="hero-buttons">
          <button 
            className="cta-button primary"
            onClick={handleReservation}
          >
            {reservation.buttonText}
          </button>
          <button 
            className="cta-button secondary"
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
          >
            서비스 보기
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;