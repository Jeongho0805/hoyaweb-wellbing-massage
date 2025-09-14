import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import './Contact.css';

const Contact = () => {
  const { content } = useContent();
  const { contact, services, reservation } = content;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = services.items.map(service => service.name);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 네이버 예약 페이지로 리다이렉트
    window.open(reservation.naverUrl, '_blank');
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="contact section">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>예약 문의가 접수되었습니다</h2>
            <p>빠른 시일 내에 연락드리겠습니다.<br/>감사합니다.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <h2 className="section-title">{contact.title}</h2>
        <p className="section-subtitle">
          {contact.subtitle}
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="quick-contact">
              <h3>{contact.quickContactTitle}</h3>
              <div className="quick-contact-methods">
                {contact.methods.map((method, index) => (
                  <div key={index} className="contact-method">
                    <span className="method-icon">{method.icon}</span>
                    <div>
                      <strong>{method.title}</strong>
                      <p>{method.contact}</p>
                      <small>{method.note}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reservation-guide">
              <h4>예약 안내</h4>
              <ul>
                {contact.guidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">이름 *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="홍길동"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">연락처 *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="service">희망 서비스 *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">서비스를 선택하세요</option>
                  {serviceOptions.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredDate">희망 날짜 *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferredTime">희망 시간 *</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">시간을 선택하세요</option>
                    {timeSlots.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">추가 요청사항</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="특별한 요청사항이나 문의사항을 입력해 주세요"
                />
              </div>

              <button type="submit" className="submit-btn">
                {reservation.buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;