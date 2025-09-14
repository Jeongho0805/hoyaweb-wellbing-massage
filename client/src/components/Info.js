import React from 'react';
import { useContent } from '../contexts/ContentContext';
import './Info.css';

const Info = () => {
  const { content } = useContent();
  const { info } = content;

  return (
    <section id="info" className="info section">
      <div className="container">
        <h2 className="section-title">{info.title}</h2>
        <p className="section-subtitle">
          {info.subtitle}
        </p>

        <div className="info-content">
          <div className="info-main">
            <div className="location-info">
              <h3>위치 및 연락처</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div className="contact-text">
                    <strong>주소</strong>
                    <p style={{whiteSpace: 'pre-line'}}>{info.contact.address}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div className="contact-text">
                    <strong>전화번호</strong>
                    <p>{info.contact.phone}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <div className="contact-text">
                    <strong>휴대폰</strong>
                    <p>{info.contact.mobile}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🚇</span>
                  <div className="contact-text">
                    <strong>대중교통</strong>
                    <p style={{whiteSpace: 'pre-line'}}>{info.contact.transport}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hours-info">
              <h3>운영시간</h3>
              <div className="hours-table">
                {info.hours.map((schedule, index) => (
                  <div key={index} className="hours-row">
                    <span className="day">{schedule.day}</span>
                    <span className={`hours ${schedule.isOpen ? 'open' : 'closed'}`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="hours-note">
                {info.notes.map((note, index) => (
                  <p key={index}><strong>{note.split(':')[0]}:</strong> {note.split(':')[1]}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="facilities-section">
            <h3>편의시설</h3>
            <div className="facilities-grid">
              {info.facilities.map((facility, index) => (
                <div key={index} className="facility-item">
                  <span className="facility-icon">{facility.icon}</span>
                  <div className="facility-info">
                    <h4>{facility.name}</h4>
                    <p>{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="map-section">
            <h3>찾아오시는 길</h3>
            <div className="map-placeholder">
              <div className="map-content">
                <span className="map-icon">🗺️</span>
                <p>지도 위치</p>
                <small>경기 수원시 권선구 곡선로50번길 33 4층 웰빙카페지압안마원</small>
              </div>
            </div>
            <div className="map-directions">
              <div className="direction-item">
                <strong>자가용 이용시</strong>
                <p>네비게이션에 '웰빙카페지압안마원'을 검색하여 방문해주세요. 주차 관련 정보는 다음과 같습니다. <br/><br/>
                  [ 오전9시 ~ 오후6시 ] <br/>
                  안마원 근처 거주자 주차 구역에 주차하시면 됩니다. <br/><br/>
                  [ 오후6시 이후 ] <br/>
                  031-232-7775로 전화 주시면 안마원 지정 주차구역으로 안내 해드리겠습니다.
                </p>
              </div>
              <div className="direction-item">
                <strong>대중교통 이용시</strong>
                <p>
                  11-1, 80, 83-1, 92번 버스를 타고 축산물유통센터/수원아이파크시티4단지 정류장에서 하차하시면 됩니다.
                  하차 하신 곡반정동 하고렴사거리에서 도보 6분 거리에 위치해 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;