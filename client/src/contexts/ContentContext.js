import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          throw new Error('컨텐츠를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error(error);
        // TODO: 에러 상태 처리
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      const response = await fetch('/api/upload');
      if (!response.ok) {
        throw new Error('이미지 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setUploadedImages(data.images || []);
      return data.images || [];
    } catch (error) {
      console.error('이미지 목록 조회 실패:', error);
      return [];
    }
  };

  const saveContentToFile = async (updatedContent) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        throw new Error('컨텐츠 저장에 실패했습니다.');
      }

      setContent(updatedContent);
      alert('컨텐츠가 성공적으로 저장되었습니다!');
      return true;
    } catch (error) {
      console.error('컨텐츠 저장 실패:', error);
      alert(`컨텐츠 저장에 실패했습니다: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    content,
    saveContentToFile,
    isLoading,
    uploadedImages,
    fetchUploadedImages
  };

  return (
    <ContentContext.Provider value={value}>
      {!isLoading && children}
    </ContentContext.Provider>
  );
};
