const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// 允許解析 JSON 請求體
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 提供靜態文件服務

// 模擬用戶數據
const users = {
  user: "password",
};

// 登入表單邏輯
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "用戶名或密碼錯誤，請重試！" });
  }
});

// 讀取家課資料
function getHomeworkData() {
  const filePath = path.join(__dirname, 'homework_data.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];  // 如果檔案不存在或格式不正確，返回空陣列
  }
}

// 保存家課資料
function saveHomeworkData(data) {
  const filePath = path.join(__dirname, 'homework_data.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// API: 取得家課紀錄
app.get('/api/homework', (req, res) => {
  const homeworkData = getHomeworkData();
  res.json(homeworkData);
});

// API: 新增家課紀錄
app.post('/api/homework', (req, res) => {
  const newHomework = req.body;
  const homeworkData = getHomeworkData();
  homeworkData.push(newHomework); // 把新的家課紀錄加入
  saveHomeworkData(homeworkData); // 保存到檔案
  res.status(201).send('家課紀錄已新增');
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器運行於 http://localhost:${port}`);
});
