const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const adminFilePath = path.join(__dirname, '..', 'data', 'admin.json');

// POST /api/auth/login - 로그인 처리
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
  }

  try {
    const data = await fs.readFile(adminFilePath, 'utf8');
    const admin = JSON.parse(data);

    if (username === admin.username && password === admin.password) {
      res.status(200).json({ success: true, message: '로그인 성공' });
    } else {
      res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error('Admin file read error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
