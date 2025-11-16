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
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;