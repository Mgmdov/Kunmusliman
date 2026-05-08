// ========== ЕЖЕНЕДЕЛЬНЫЕ ЗАДАНИЯ ==========

window.WEEKLY_TASKS = [
  { id: 'w_azkar_7',    title: 'Прочитать азкары 7 дней подряд',      reward: 50,  icon: '📿', target: 7 },
  { id: 'w_quran_5',    title: 'Прочитать 5 страниц Корана',          reward: 35,  icon: '📖', target: 5 },
  { id: 'w_quiz_10',    title: 'Ответить на 10 вопросов викторины',   reward: 30,  icon: '🧠', target: 10 },
  { id: 'w_zikr_100',   title: 'Сделать 100 зикров за неделю',        reward: 40,  icon: '🤲', target: 100 },
  { id: 'w_login_7',    title: 'Заходить 7 дней подряд',              reward: 70,  icon: '🔥', target: 7 }
];

function getWeeklyData() {
  if (!window.userData) return { weekStart: '', progress: {}, claimed: {} };
  if (!window.userData.weeklyTasks) {
    window.userData.weeklyTasks = { weekStart: '', progress: {}, claimed: {} };
  }
  return window.userData.weeklyTasks;
}

function getCurrentWeekStart() {
  var now = new Date();
  var day = now.getDay();
  var diff = day === 0 ? 6 : day - 1; // Пн=0
  var monday = new Date(now);
  monday.setDate(monday.getDate() - diff);
  return monday.toISOString().slice(0, 10);
}

window.checkWeeklyReset = function() {
  var data = getWeeklyData();
  var weekStart = getCurrentWeekStart();
  if (data.weekStart !== weekStart) {
    data.weekStart = weekStart;
    data.progress = {};
    data.claimed = {};
    if (typeof window.saveData === 'function') window.saveData();
  }
};

window.updateWeeklyProgress = function(taskId, increment) {
  window.checkWeeklyReset();
  var data = getWeeklyData();
  if (!data.progress[taskId]) data.progress[taskId] = 0;
  data.progress[taskId] += increment;

  // Проверяем завершение
  var task = window.WEEKLY_TASKS.find(function(t) { return t.id === taskId; });
  if (task && data.progress[taskId] >= task.target && !data.claimed[taskId]) {
    data.claimed[taskId] = Date.now();
    // Начисляем звёзды
    var starsObj = window.userData.stars || { totalStars: 0 };
    starsObj.totalStars = parseInt(starsObj.totalStars || 0) + task.reward;
    window.userData.stars = starsObj;
    if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();

    // Уведомление
    var notif = document.createElement('div');
    notif.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(180deg,#1a2040,#0a1030);border:1px solid #6a8ae0;border-radius:14px;padding:12px 20px;z-index:999995;display:flex;align-items:center;gap:10px;animation:slideDown 0.3s;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
    notif.innerHTML = '<span style="font-size:20px;">' + task.icon + '</span><div><div style="color:#6a8ae0;font-size:13px;font-weight:600;">Еженедельное задание!</div><div style="color:#a0b8f0;font-size:12px;">' + task.title + ' · +' + task.reward + '★</div></div>';
    document.body.appendChild(notif);
    setTimeout(function() { notif.remove(); }, 3500);
  }

  if (typeof window.saveData === 'function') window.saveData();
};

window.renderWeeklyTasksWidget = function() {
  window.checkWeeklyReset();
  var data = getWeeklyData();

  var html = '<div style="margin-top:12px;background:rgba(0,0,0,0.03);border-radius:14px;padding:14px;">';
  html += '<div style="font-size:13px;font-weight:600;margin-bottom:10px;color:inherit;">Еженедельные задания</div>';

  window.WEEKLY_TASKS.forEach(function(task) {
    var progress = data.progress[task.id] || 0;
    var done = !!data.claimed[task.id];
    var pct = Math.min(100, Math.round(progress * 100 / task.target));

    html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.05);' + (done ? 'opacity:0.5;' : '') + '">';
    html += '<span style="font-size:18px;">' + task.icon + '</span>';
    html += '<div style="flex:1;">';
    html += '<div style="font-size:12px;font-weight:500;">' + task.title + '</div>';
    html += '<div style="height:4px;background:rgba(0,0,0,0.08);border-radius:2px;margin-top:4px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:' + (done ? '#5dcaa5' : '#007AFF') + ';border-radius:2px;transition:width 0.3s;"></div></div>';
    html += '</div>';
    html += '<div style="font-size:11px;color:' + (done ? '#5dcaa5' : '#888') + ';white-space:nowrap;">' + (done ? '✓' : progress + '/' + task.target) + '</div>';
    html += '</div>';
  });

  html += '</div>';
  return html;
};

// Автопривязка к действиям
(function hookWeeklyTasks() {
  // Привязка к серии входа
  var origCheckStreak = window.checkAndUpdateStreak;
  window.checkAndUpdateStreak = function() {
    if (typeof origCheckStreak === 'function') origCheckStreak();
    window.updateWeeklyProgress('w_login_7', 1);
  };

  // Привязка к ежедневным заданиям
  var origComplete = window.completeDailyTask;
  window.completeDailyTask = function(taskId) {
    if (typeof origComplete === 'function') origComplete(taskId);
    if (taskId === 'read_azkar') window.updateWeeklyProgress('w_azkar_7', 1);
    if (taskId === 'read_quran') window.updateWeeklyProgress('w_quran_5', 1);
    if (taskId === 'do_zikr') window.updateWeeklyProgress('w_zikr_100', 33);
  };
})();

// Инъекция в виджет ежедневных заданий
(function injectWeekly() {
  function tryInject() {
    var grid = document.getElementById('dailyTasksGrid');
    if (!grid) return;
    // Проверяем не добавлены ли уже
    if (grid.querySelector('.weekly-injected')) return;

    var weeklyDiv = document.createElement('div');
    weeklyDiv.className = 'weekly-injected';
    weeklyDiv.innerHTML = window.renderWeeklyTasksWidget();
    grid.appendChild(weeklyDiv);

    // Обновление каждые 30 сек
    setInterval(function() {
      var wd = grid.querySelector('.weekly-injected');
      if (wd) wd.innerHTML = window.renderWeeklyTasksWidget();
    }, 30000);
  }
  setTimeout(tryInject, 3500);
  setTimeout(tryInject, 6000);
})();

console.log('📋 Еженедельные задания загружены');
