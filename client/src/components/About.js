import React from 'react';
import { useContent } from '../contexts/ContentContext';
import './About.css';

const About = () => {
  const { content } = useContent();
  const { about } = content;

  return (
    <section id="about" className="about section">
      <div className="container">
        <h2 className="section-title">{about.title}</h2>
        <p className="section-subtitle">
          {about.subtitle}
        </p>

        <div className="about-content">
          <div className="about-text">
            <h3>{about.mainTitle}</h3>
            {about.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="features-grid">
            {about.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="therapists-section">
          <h3 className="therapists-title">{about.therapistsTitle}</h3>
          <div className="therapists-grid">
            {about.therapists.map((therapist, index) => (
              <div key={index} className="therapist-card">
                <div className="therapist-avatar">
                  <span className="avatar-icon">👩‍⚕️</span>
                </div>
                <div className="therapist-info">
                  <h4 className="therapist-name">{therapist.name}</h4>
                  <p className="therapist-license">{therapist.license}</p>
                  <p className="therapist-experience">경력 {therapist.experience}</p>
                  <p className="therapist-specialty">전문분야: {therapist.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;