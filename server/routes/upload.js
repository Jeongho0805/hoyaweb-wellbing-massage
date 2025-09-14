const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 이미지를 저장할 디렉토리
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 스토리지 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일명 중복을 피하기 위해 타임스탬프 사용
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// 파일 필터 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB 파일 사이즈 제한
});

// GET /api/upload - 업로드된 이미지 목록 조회
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    const images = imageFiles.map(filename => {
      // 모든 환경에서 상대 경로 사용 (프록시 활용)
      const filePath = `/api/uploads/${filename}`;
      const fullPath = path.join(uploadDir, filename);
      const stats = fs.statSync(fullPath);

      return {
        filename,
        url: filePath,
        uploadDate: stats.birthtime,
        size: stats.size
      };
    });

    // 최신순으로 정렬
    images.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    res.json({
      message: '이미지 목록 조회 성공',
      images: images,
      count: images.length
    });
  } catch (error) {
    console.error('이미지 목록 조회 실패:', error);
    res.status(500).json({ error: '이미지 목록을 불러올 수 없습니다.' });
  }
});

// POST /api/upload - 이미지 업로드 처리 라우트
router.post('/', upload.single('image'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 전송되지 않았습니다.' });
  }

  // 클라이언트에게 반환할 파일 경로 (모든 환경에서 상대 경로 사용)
  const filePath = `/api/uploads/${req.file.filename}`;

  res.status(201).json({
    message: '이미지 업로드 성공!',
    filePath: filePath,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

module.exports = router;
