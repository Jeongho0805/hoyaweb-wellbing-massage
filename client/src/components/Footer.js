import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">웰빙카페지압안마원</h3>
            <p className="footer-description">
              국가공인 안마사들이 제공하는 전문 마사지 서비스로<br/>
              건강한 삶과 진정한 휴식을 선사합니다.
            </p>
            <div className="social-links">
              <a href="#" aria-label="카카오톡">💬</a>
              <a href="#" aria-label="인스타그램">📷</a>
              <a href="#" aria-label="네이버 블로그">📝</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>빠른 링크</h4>
            <ul>
              <li><a href="#home">홈</a></li>
              <li><a href="#services">서비스</a></li>
              <li><a href="#about">소개</a></li>
              <li><a href="#info">매장정보</a></li>
              <li><a href="#contact">예약문의</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>서비스</h4>
            <ul>
              <li>전신 마사지</li>
              <li>지압 마사지</li>
              <li>어깨/목 집중 마사지</li>
              <li>발 마사지</li>
              <li>아로마 테라피</li>
              <li>커플 마사지</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>연락처</h4>
            <div className="contact-info">
              <p>📍 서울특별시 강남구 테헤란로 123길 45</p>
              <p>📞 02-1234-5678</p>
              <p>📱 010-1234-5678</p>
              <p>🕐 월-금 09:00-22:00 | 토 09:00-20:00 | 일 10:00-18:00</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} 웰빙카페지압안마원. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">개인정보처리방침</a>
              <a href="#">이용약관</a>
              <a href="#">사업자정보</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;