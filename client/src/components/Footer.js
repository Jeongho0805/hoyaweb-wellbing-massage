import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <h3 className="footer-title">웰빙카페지압안마원</h3>
          <p className="business-info">
            상호명: 웰빙카페지압안마원 | 대표자: 박영찬 | 사업자등록번호: 380-95-00635
          </p>
          <p className="copyright">&copy; {currentYear} 웰빙카페지압안마원. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;