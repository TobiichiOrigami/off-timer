document.addEventListener('DOMContentLoaded', () => {
  // 獲取 DOM 元素
  const startTimeInput = document.getElementById('startTime');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resultArea = document.getElementById('resultArea');
  const endTimeDisplay = document.getElementById('endTimeDisplay');
  const countdownDisplay = document.getElementById('countdown');
  const statusText = document.getElementById('statusText');

  let timerInterval;

  // 初始化：設定預設時間為現在
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  startTimeInput.value = `${hours}:${minutes}`;

  // 事件監聽：點擊開始計算
  calculateBtn.addEventListener('click', startCountdown);

  // 事件監聽：點擊重新設定
  resetBtn.addEventListener('click', resetTimer);

  // 核心功能：開始倒數
  function startCountdown() {
    const timeValue = startTimeInput.value;
    if (!timeValue) {
      alert('請先選擇打卡時間！');
      return;
    }

    // 解析輸入的時間
    const [inputHours, inputMinutes] = timeValue.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(inputHours, inputMinutes, 0, 0);

    // 計算下班時間 (加 9 小時)
    // 9 * 60 * 60 * 1000 = 32400000 毫秒
    const endDate = new Date(startDate.getTime() + 9 * 60 * 60 * 1000);

    // 顯示預計下班時間
    const endHours = String(endDate.getHours()).padStart(2, '0');
    const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
    endTimeDisplay.textContent = `${endHours}:${endMinutes}`;

    // 切換介面狀態
    toggleUIState(true);

    // 立即執行一次更新，避免延遲
    updateCountdown(endDate);

    // 啟動計時器 (每秒更新)
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      updateCountdown(endDate);
    }, 1000);
  }

  // 核心功能：重置
  function resetTimer() {
    clearInterval(timerInterval);
    toggleUIState(false);
    document.title = "下班倒數計時器";

    // 重置倒數顯示
    countdownDisplay.textContent = "00:00:00";
  }

  // 輔助功能：切換 UI 顯示狀態
  function toggleUIState(isRunning) {
    if (isRunning) {
      startTimeInput.disabled = true;
      calculateBtn.classList.add('hidden');
      resetBtn.classList.remove('hidden');
      resultArea.classList.remove('hidden');
    } else {
      startTimeInput.disabled = false;
      calculateBtn.classList.remove('hidden');
      resetBtn.classList.add('hidden');
      resultArea.classList.add('hidden');
    }
  }

  // 核心邏輯：更新倒數時間
  function updateCountdown(endDate) {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      handleTimeUp();
      return;
    }

    // 計算時分秒
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    // 格式化顯示 (補零)
    const formattedTime =
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    countdownDisplay.textContent = formattedTime;

    // 動態更新網頁標題
    document.title = `還剩 ${formattedTime} 下班`;

    // 更新狀態文字
    updateStatusText(h);
  }

  // 輔助功能：時間到的處理
  function handleTimeUp() {
    clearInterval(timerInterval);
    countdownDisplay.textContent = "00:00:00";
    statusText.textContent = "🎉 下班啦！快回家休息吧！";
    statusText.className = "mt-4 text-xl font-bold text-yellow-300 animate-bounce";
    document.title = "🎉 下班啦！";
  }

  // 輔助功能：根據剩餘時間更新鼓勵語
  function updateStatusText(hoursLeft) {
    if (hoursLeft < 1) {
      statusText.textContent = "最後衝刺！再撐一下！🔥";
      statusText.className = "mt-4 text-sm font-bold text-red-300";
    } else if (hoursLeft < 4) {
      statusText.textContent = "午後時光，喝杯咖啡吧 ☕";
      statusText.className = "mt-4 text-sm font-bold text-orange-300";
    } else {
      statusText.textContent = "新的一天，保持專注 💪";
      statusText.className = "mt-4 text-sm font-bold text-green-300";
    }
  }
});