import React, { useState, useRef } from 'react';
import { useContent } from '../contexts/ContentContext';
import './Gallery.css';

const Gallery = () => {
  const { content } = useContent();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef(null);

  if (!content || !content.gallery || !content.gallery.photos || content.gallery.photos.length === 0) {
    return (
      <section id="gallery" className="gallery section">
        <div className="container">
          <h2 className="section-title">매장 갤러리</h2>
          <p className="section-subtitle">등록된 사진이 없습니다.</p>
        </div>
      </section>
    );
  }

  const { gallery } = content;

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? gallery.photos.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === gallery.photos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section id="gallery" className="gallery section">
      <div className="container">
        <h2 className="section-title">매장 갤러리</h2>
        
        <div className="gallery-main">
          {/* 메인 이미지 */}
          <div className="main-image-container">
            <button className="main-nav prev" onClick={goToPrevious}>
              ‹
            </button>
            <div className="main-image">
              <img 
                src={gallery.photos[currentImageIndex]?.url} 
                alt={`매장 사진 ${currentImageIndex + 1}`}
                loading="lazy"
              />
            </div>
            <button className="main-nav next" onClick={goToNext}>
              ›
            </button>
          </div>

          {/* 썸네일 스크롤 */}
          <div className="thumbnail-container">
            <button className="gallery-nav prev" onClick={scrollLeft}>
              ‹
            </button>
            <button className="gallery-nav next" onClick={scrollRight}>
              ›
            </button>
            
            <div className="thumbnail-scroll" ref={scrollRef}>
              {gallery.photos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => selectImage(index)}
                >
                  <img 
                    src={photo.url} 
                    alt={`썸네일 ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;