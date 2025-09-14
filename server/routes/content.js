const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// content.json 파일의 경로
const contentFilePath = path.join(__dirname, '..', 'data', 'content.json');

// GET /api/content - 컨텐츠 데이터 조회
router.get('/', async (req, res, next) => {
  try {
    const data = await fs.readFile(contentFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    next(error);
  }
});

// POST /api/content - 컨텐츠 데이터 저장
router.post('/', async (req, res, next) => {
  try {
    const updatedContent = req.body;
    await fs.writeFile(contentFilePath, JSON.stringify(updatedContent, null, 2), 'utf8');
    res.status(200).json({ message: '컨텐츠가 성공적으로 저장되었습니다.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
