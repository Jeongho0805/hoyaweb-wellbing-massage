import React from 'react';
import { useContent } from '../contexts/ContentContext';
import './Services.css';

const Services = () => {
  const { content } = useContent();
  const { services, reservation } = content;

  const handleReservation = () => {
    window.open(reservation.naverUrl, '_blank');
  };

  return (
    <section id="services" className="services section">
      <div className="container">
        <h2 className="section-title">{services.title}</h2>
        <p className="section-subtitle">
          {services.subtitle}
        </p>

        {/* 상단 예약 버튼 */}
        <div className="reservation-banner">
          <button className="main-reservation-btn" onClick={handleReservation}>
            <span className="btn-icon">📞</span>
            <span className="btn-text">{reservation.buttonText}</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
        
        <div className="services-grid">
          {services.items.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <h3 className="service-name">{service.name}</h3>
                <div className="service-meta">
                  <span className="duration">{service.duration}</span>
                  <span className="price">{service.price}</span>
                </div>
              </div>
              
              <p className="service-description">{service.description}</p>
              
              <div className="service-features">
                {service.features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;