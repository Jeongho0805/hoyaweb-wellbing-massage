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

// POST /api/upload - 이미지 업로드 처리 라우트
router.post('/', upload.single('image'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 전송되지 않았습니다.' });
  }

  // 클라이언트에게 반환할 파일 경로
  // 예: /uploads/image-1678886400000.jpg
  const filePath = path.join('/uploads', req.file.filename).replace(/\\/g, '/');

  res.status(201).json({
    message: '이미지 업로드 성공!',
    filePath: filePath
  });
});

module.exports = router;
