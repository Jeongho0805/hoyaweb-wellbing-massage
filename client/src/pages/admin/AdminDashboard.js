import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';
import './AdminDashboard.css';

// 이미지 압축 함수를 컴포넌트 파일 내로 이동
const compressImage = (file, maxWidth = 1200, quality = 0.9) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        }));
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { content, saveContentToFile, isLoading, uploadedImages, fetchUploadedImages } = useContent();
  const [editingContent, setEditingContent] = useState(content);
  const [activeTab, setActiveTab] = useState('hero');
  const [uploadingImages, setUploadingImages] = useState(new Set());
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleSave = async () => {
    const success = await saveContentToFile(editingContent);
    if (success) {
      window.location.reload();
    }
  };

  

  const previewSite = () => {
    window.open('/', '_blank');
  };

  const updateContent = (section, field, value, index = null) => {
    setEditingContent(prev => {
      const newContent = { ...prev };
      
      if (index !== null) {
        if (Array.isArray(newContent[section][field])) {
          newContent[section][field][index] = value;
        }
      } else {
        newContent[section][field] = value;
      }
      
      return newContent;
    });
  };

  const addService = () => {
    const newService = {
      id: Date.now(),
      name: "새 서비스",
      duration: "60분",
      price: "80,000원",
      description: "새로운 마사지 서비스입니다.",
      features: ["새 기능1", "새 기능2"]
    };
    
    setEditingContent(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: [...prev.services.items, newService]
      }
    }));
  };

  const removeService = (index) => {
    if (window.confirm('이 서비스를 삭제하시겠습니까?')) {
      setEditingContent(prev => ({
        ...prev,
        services: {
          ...prev.services,
          items: prev.services.items.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const addTherapist = () => {
    const newTherapist = {
      name: "새 안마사",
      experience: "5년",
      specialty: "전신 마사지",
      license: "국가공인 안마사 1급"
    };
    
    setEditingContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        therapists: [...prev.about.therapists, newTherapist]
      }
    }));
  };

  const removeTherapist = (index) => {
    if (window.confirm('이 안마사 정보를 삭제하시겠습니까?')) {
      setEditingContent(prev => ({
        ...prev,
        about: {
          ...prev.about,
          therapists: prev.about.therapists.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const addPhoto = (photoData = null) => {
    const newPhoto = photoData || {
      id: Date.now(),
      url: '',
      title: `매장 사진 ${editingContent.gallery.photos.length + 1}`,
      description: '매장 사진입니다'
    };
    
    setEditingContent(prev => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        photos: [...prev.gallery.photos, newPhoto]
      }
    }));
  };

  const removePhoto = (index) => {
    if (window.confirm('이 사진을 삭제하시겠습니까?')) {
      setEditingContent(prev => ({
        ...prev,
        gallery: {
          ...prev.gallery,
          photos: prev.gallery.photos.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const renderHeroEditor = () => (
    <div className="editor-section">
      <h3>메인 히어로 섹션</h3>
      
      <div className="form-group">
        <label>메인 제목</label>
        <input
          type="text"
          value={editingContent.hero.title}
          onChange={(e) => updateContent('hero', 'title', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>부제목</label>
        <textarea
          value={editingContent.hero.subtitle}
          onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
        />
      </div>

      <div className="features-editor">
        <label>특징 포인트</label>
        {editingContent.hero.features.map((feature, index) => (
          <div key={index} className="feature-item">
            <input
              type="text"
              placeholder="아이콘"
              value={feature.icon}
              onChange={(e) => updateContent('hero', 'features', { ...feature, icon: e.target.value }, index)}
            />
            <input
              type="text"
              placeholder="텍스트"
              value={feature.text}
              onChange={(e) => updateContent('hero', 'features', { ...feature, text: e.target.value }, index)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderServicesEditor = () => (
    <div className="editor-section">
      <h3>서비스 메뉴</h3>
      
      <div className="form-group">
        <label>섹션 제목</label>
        <input
          type="text"
          value={editingContent.services.title}
          onChange={(e) => updateContent('services', 'title', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>섹션 부제목</label>
        <textarea
          value={editingContent.services.subtitle}
          onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
        />
      </div>

      <div className="services-list">
        <div className="services-header">
          <label>서비스 목록</label>
          <button onClick={addService} className="add-button">서비스 추가</button>
        </div>
        
        {editingContent.services.items.map((service, index) => (
          <div key={service.id} className="service-editor">
            <div className="service-header">
              <h4>서비스 {index + 1}</h4>
              <button onClick={() => removeService(index)} className="remove-button">삭제</button>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>서비스명</label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateContent('services', 'items', { ...service, name: e.target.value }, index)}
                />
              </div>
              <div className="form-group">
                <label>소요시간</label>
                <input
                  type="text"
                  value={service.duration}
                  onChange={(e) => updateContent('services', 'items', { ...service, duration: e.target.value }, index)}
                />
              </div>
              <div className="form-group">
                <label>가격</label>
                <input
                  type="text"
                  value={service.price}
                  onChange={(e) => updateContent('services', 'items', { ...service, price: e.target.value }, index)}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>설명</label>
              <textarea
                value={service.description}
                onChange={(e) => updateContent('services', 'items', { ...service, description: e.target.value }, index)}
              />
            </div>
            
            <div className="form-group">
              <label>특징 (쉼표로 구분)</label>
              <input
                type="text"
                value={service.features.join(', ')}
                onChange={(e) => updateContent('services', 'items', { ...service, features: e.target.value.split(', ') }, index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTherapistEditor = () => (
    <div className="editor-section">
      <h3>전문 안마사 관리</h3>
      
      <div className="therapists-list">
        <div className="therapists-header">
          <label>안마사 목록</label>
          <button onClick={addTherapist} className="add-button">안마사 추가</button>
        </div>
        
        {editingContent.about.therapists.map((therapist, index) => (
          <div key={index} className="therapist-editor">
            <div className="service-header">
              <h4>안마사 {index + 1}</h4>
              <button onClick={() => removeTherapist(index)} className="remove-button">삭제</button>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={therapist.name}
                  onChange={(e) => updateContent('about', 'therapists', { ...therapist, name: e.target.value }, index)}
                />
              </div>
              <div className="form-group">
                <label>경력</label>
                <input
                  type="text"
                  value={therapist.experience}
                  onChange={(e) => updateContent('about', 'therapists', { ...therapist, experience: e.target.value }, index)}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>자격증</label>
              <input
                type="text"
                value={therapist.license}
                onChange={(e) => updateContent('about', 'therapists', { ...therapist, license: e.target.value }, index)}
              />
            </div>
            
            <div className="form-group">
              <label>전문분야</label>
              <input
                type="text"
                value={therapist.specialty}
                onChange={(e) => updateContent('about', 'therapists', { ...therapist, specialty: e.target.value }, index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleImageUpload = async (file, index) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
      alert('이미지 크기는 10MB 이하여야 합니다.');
      return;
    }

    try {
      setUploadingImages(prev => new Set(prev.add(index)));

      // 이미지 압축 로직은 유지합니다.
      const compressedFile = await compressImage(file, 1200, 0.9);

      const formData = new FormData();
      formData.append('image', compressedFile);

      // 백엔드 API로 이미지 업로드 요청
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '서버에서 업로드에 실패했습니다.');
      }

      const result = await response.json();

      // 업로드 성공 시 content 업데이트
      updateContent('gallery', 'photos', { 
        ...editingContent.gallery.photos[index], 
        url: result.filePath, // 서버가 반환한 경로 사용
        fileName: compressedFile.name,
        uploadDate: new Date().toISOString(),
        service: 'local-server' // 서비스 정보 변경
      }, index);
      
      alert(`이미지 업로드 완료!`);
      
    } catch (error) { 
      console.error('Image upload failed:', error);
      alert(`이미지 업로드 실패: ${error.message}`);
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const addPhotoWithUpload = () => {
    const newPhoto = {
      id: Date.now(),
      url: '',
      title: `매장 사진 ${editingContent.gallery.photos.length + 1}`,
      description: '매장 사진입니다',
      fileName: null,
      uploadDate: null
    };
    addPhoto(newPhoto);
  };

  const openImageSelector = (photoIndex) => {
    setSelectedPhotoIndex(photoIndex);
    setShowImageSelector(true);
    fetchUploadedImages(); // 이미지 목록 새로고침
  };

  const selectServerImage = (serverImage) => {
    updateContent('gallery', 'photos', {
      ...editingContent.gallery.photos[selectedPhotoIndex],
      url: serverImage.url,
      fileName: serverImage.filename,
      uploadDate: serverImage.uploadDate,
      service: 'server'
    }, selectedPhotoIndex);

    setShowImageSelector(false);
    setSelectedPhotoIndex(null);
  };

  const getStorageInfo = () => {
    try {
      const data = JSON.stringify(editingContent);
      const sizeInBytes = new Blob([data]).size;
      const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
      
      // 이미지 통계
      const totalImages = editingContent.gallery.photos.length;
      const githubImages = editingContent.gallery.photos.filter(p => 
        p.service && (p.service.includes('github') || p.url.includes('github'))).length;
      const localImages = editingContent.gallery.photos.filter(p => 
        p.url.startsWith('data:')).length;
      const urlImages = editingContent.gallery.photos.filter(p => 
        p.url.startsWith('http') && !p.url.includes('github')).length;
      
      return { 
        sizeInMB, 
        totalImages, 
        githubImages, 
        localImages, 
        urlImages 
      };
    } catch (error) {
      return { 
        sizeInMB: '0', 
        totalImages: 0, 
        githubImages: 0, 
        localImages: 0, 
        urlImages: 0 
      };
    }
  };

  const renderImageSelector = () => {
    if (!showImageSelector) return null;

    return (
      <div className="modal-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div className="modal-content" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '80vw',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>서버에 업로드된 이미지 선택</h3>
            <button
              onClick={() => setShowImageSelector(false)}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          {uploadedImages.length === 0 ? (
            <p>업로드된 이미지가 없습니다.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  style={{
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onClick={() => selectServerImage(image)}
                  onMouseEnter={(e) => e.target.style.borderColor = '#48bb78'}
                  onMouseLeave={(e) => e.target.style.borderColor = '#ddd'}
                >
                  <img
                    src={image.url}
                    alt={image.filename}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    <div><strong>{image.filename}</strong></div>
                    <div>{new Date(image.uploadDate).toLocaleDateString('ko-KR')}</div>
                    <div>{(image.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGalleryEditor = () => {
    const { sizeInMB, totalImages, githubImages, localImages, urlImages } = getStorageInfo();

    return (
      <div className="editor-section">
        <h3>매장 갤러리 관리</h3>
        
        <div className="storage-info" style={{
          background: '#f0f9f0', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #48bb78'
        }}>
          <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
            <span>📊 용량: {sizeInMB}MB</span>
            <span>🖼️ 전체: {totalImages}개</span>
            {githubImages > 0 && <span style={{color: '#48bb78'}}>🐙 GitHub: {githubImages}개</span>}
            {localImages > 0 && <span style={{color: '#e74c3c'}}>💾 로컬: {localImages}개</span>}
            {urlImages > 0 && <span style={{color: '#3498db'}}>🌐 외부URL: {urlImages}개</span>}
          </div>
          <small style={{color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '8px'}}>
            💡 GitHub 호스팅 이미지는 모든 사용자가 볼 수 있습니다 (추천)
          </small>
        </div>
        
        <div className="photos-list">
          <div className="photos-header">
            <label>매장 사진 목록</label>
            <button onClick={addPhotoWithUpload} className="add-button">사진 추가</button>
          </div>
        
        {editingContent.gallery.photos.map((photo, index) => (
          <div key={photo.id} className="photo-editor">
            <div className="service-header">
              <h4>사진 {index + 1}</h4>
              <button onClick={() => removePhoto(index)} className="remove-button">삭제</button>
            </div>
            
            <div className="photo-upload-section">
              <div className="photo-preview">
                {photo.url && (
                  <img 
                    src={photo.url} 
                    alt={`사진 ${index + 1}`} 
                    style={{width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px'}} 
                  />
                )}
              </div>
              
              <div className="upload-controls">
                <div className="form-group">
                  <label>이미지 파일 업로드 (최대 5MB)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(e.target.files[0], index);
                      }
                      e.target.value = ''; // 같은 파일 재선택 가능하도록
                    }}
                    className="file-input"
                    disabled={uploadingImages.has(index)}
                  />

                  <button
                    type="button"
                    onClick={() => openImageSelector(index)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      backgroundColor: '#48bb78',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    서버 이미지 선택
                  </button>
                  
                  {uploadingImages.has(index) && (
                    <div style={{
                      color: '#48bb78', 
                      fontSize: '0.9rem', 
                      marginTop: '10px',
                      padding: '10px',
                      background: '#f0f9f0',
                      borderRadius: '6px',
                      border: '1px solid #48bb78'
                    }}>
                      🔄 업로드 중... 잠시만 기다려주세요
                    </div>
                  )}
                  
                  {photo.fileName && !uploadingImages.has(index) && (
                    <small style={{color: '#48bb78', fontSize: '0.8rem', display: 'block', marginTop: '5px'}}>
                      📁 {photo.fileName}
                      {photo.uploadDate && ` (${new Date(photo.uploadDate).toLocaleDateString('ko-KR')})`}
                      {photo.service && (
                        <span style={{color: '#666', marginLeft: '5px'}}>
                          via {photo.service}
                        </span>
                      )}
                    </small>
                  )}
                </div>
                
                <div className="form-group">
                  <label>또는 이미지 URL 입력</label>
                  <input
                    type="url"
                    value={photo.url.startsWith('data:') ? '' : photo.url}
                    onChange={(e) => updateContent('gallery', 'photos', { ...photo, url: e.target.value }, index)}
                    placeholder="https://example.com/image.jpg"
                    disabled={photo.url.startsWith('data:')}
                  />
                  {photo.url.startsWith('data:') && (
                    <small style={{color: '#666', fontSize: '0.8rem'}}>
                      업로드된 파일이 사용 중입니다. 새 파일을 업로드하거나 URL을 사용하려면 위에서 다시 선택하세요.
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
          {editingContent.gallery.photos.length === 0 && (
            <div className="empty-state">
              <p>등록된 사진이 없습니다. '사진 추가' 버튼을 클릭해서 사진을 추가해보세요.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactEditor = () => (
    <div className="editor-section">
      <h3>매장 정보</h3>
      
      <div className="form-group">
        <label>주소</label>
        <textarea
          value={editingContent.info.contact.address}
          onChange={(e) => updateContent('info', 'contact', { ...editingContent.info.contact, address: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>전화번호</label>
          <input
            type="text"
            value={editingContent.info.contact.phone}
            onChange={(e) => updateContent('info', 'contact', { ...editingContent.info.contact, phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>휴대폰</label>
          <input
            type="text"
            value={editingContent.info.contact.mobile}
            onChange={(e) => updateContent('info', 'contact', { ...editingContent.info.contact, mobile: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>대중교통 안내</label>
        <textarea
          value={editingContent.info.contact.transport}
          onChange={(e) => updateContent('info', 'contact', { ...editingContent.info.contact, transport: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>네이버 예약 URL</label>
        <input
          type="url"
          value={editingContent.reservation?.naverUrl || ''}
          onChange={(e) => updateContent('reservation', 'naverUrl', e.target.value)}
          placeholder="https://map.naver.com/..."
        />
      </div>

      <div className="form-group">
        <label>예약 버튼 텍스트</label>
        <input
          type="text"
          value={editingContent.reservation?.buttonText || ''}
          onChange={(e) => updateContent('reservation', 'buttonText', e.target.value)}
          placeholder="네이버 예약하기"
        />
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {renderImageSelector()}
      <header className="admin-header">
        <div className="admin-nav">
          <h1>웰빙카페지압안마원 관리자</h1>
          <div className="nav-buttons">
            <button onClick={previewSite} className="preview-button">
              사이트 미리보기
            </button>
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={activeTab === 'hero' ? 'active' : ''} 
              onClick={() => setActiveTab('hero')}
            >
              메인 화면
            </button>
            <button 
              className={activeTab === 'services' ? 'active' : ''} 
              onClick={() => setActiveTab('services')}
            >
              서비스 메뉴
            </button>
            <button 
              className={activeTab === 'gallery' ? 'active' : ''} 
              onClick={() => setActiveTab('gallery')}
            >
              갤러리 관리
            </button>
            <button 
              className={activeTab === 'therapists' ? 'active' : ''} 
              onClick={() => setActiveTab('therapists')}
            >
              안마사 관리
            </button>
            <button 
              className={activeTab === 'contact' ? 'active' : ''} 
              onClick={() => setActiveTab('contact')}
            >
              매장 정보
            </button>
          </nav>
        </div>

        <div className="dashboard-main">
          <div className="editor-container">
            {activeTab === 'hero' && renderHeroEditor()}
            {activeTab === 'services' && renderServicesEditor()}
            {activeTab === 'gallery' && renderGalleryEditor()}
            {activeTab === 'therapists' && renderTherapistEditor()}
            {activeTab === 'contact' && renderContactEditor()}
          </div>

          <div className="editor-actions">
            <button 
              onClick={handleSave} 
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;