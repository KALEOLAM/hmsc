// 登入表單邏輯
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // 透過 POST 請求進行登入驗證
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById("login-container").classList.add("hidden");
      document.getElementById("main-container").classList.remove("hidden");
      initCalendar();
      updateTime();
      setInterval(updateTime, 1000);
      loadHomeworkData(); // 登入成功後加載家課資料
    } else {
      errorMessage.textContent = data.message;
      errorMessage.style.display = "block";
    }
  });
});

// 動態生成日曆
function initCalendar() {
  const today = new Date();
  const currentMonth = today.toLocaleString("zh-Hant", { month: "long" });
  const year = today.getFullYear();
  const firstDay = new Date(year, today.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();

  document.getElementById("current-month").textContent = `${currentMonth} ${year}`;
  const table = document.getElementById("calendar-table");
  table.innerHTML = "<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>";

  let row = document.createElement("tr");
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement("td"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("td");
    cell.textContent = day;
    if (day === today.getDate()) {
      cell.classList.add("today");
    }
    row.appendChild(cell);
    if ((firstDay + day) % 7 === 0) {
      table.appendChild(row);
      row = document.createElement("tr");
    }
  }
  table.appendChild(row);
}

// 更新香港時間
function updateTime() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
  const timeString = now.toLocaleTimeString("zh-Hant", { hour12: false });
  const dateString = now.toLocaleDateString("zh-Hant", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  document.getElementById("current-time").textContent = `${dateString} ${timeString}`;
}

// 加載家課資料
function loadHomeworkData() {
  // 透過 GET 請求從後端加載家課資料
  fetch('/api/homework')
    .then(response => response.json())
    .then(homeworkData => {
      const homeworkList = document.getElementById("homework-list");
      homeworkList.innerHTML = ''; // 清空現有的列表
      if (homeworkData.length > 0) {
        homeworkData.forEach(homework => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${homework.subject} (${homework.class})</strong><br>${homework.description}`;
          homeworkList.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "今天沒有家課。";
        homeworkList.appendChild(li);
      }
    });
}
