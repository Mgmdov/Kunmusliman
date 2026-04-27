// ========== СЕРИИ ВХОДА + ЕЖЕДНЕВНЫЕ ЗАДАНИЯ + ДОСТИЖЕНИЯ СУНДУКА ==========

// ========== СЕРИИ ВХОДА ==========
window.STREAK_REWARDS = [
  { day: 1,  type: 'xp',    amount: 50,  label: '50 XP' },
  { day: 2,  type: 'xp',    amount: 100, label: '100 XP' },
  { day: 3,  type: 'chest', amount: 1,   label: 'Деревянный сундук' },
  { day: 4,  type: 'stars', amount: 100, label: '100 ★' },
  { day: 5,  type: 'wheel', amount: 3,   label: '3 прокрута колеса' },
  { day: 6,  type: 'stars', amount: 200, label: '200 ★' },
  { day: 7,  type: 'card',  rarity: 'rare', label: 'Редкая карта' },
  { day: 15, type: 'card',  rarity: 'legendary', label: 'Легендарная карта' },
  { day: 30, type: 'card',  rarity: 'mythic', label: 'Мифическая карта' }
];

function getStreakData() {
  if (!window.userData) return { streak: 0, lastDate: '', claimedToday: false };
  if (!window.userData.streakData) {
    window.userData.streakData = { streak: 0, lastDate: '', claimedToday: false, tasksCompleted: {} };
  }
  return window.userData.streakData;
}

window.checkAndUpdateStreak = function() {
  var data = getStreakData();
  var today = new Date().toISOString().slice(0, 10);
  var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (data.lastDate === today) return; // уже зашёл сегодня

  if (data.lastDate === yesterday) {
    data.streak++;
  } else if (data.lastDate !== today) {
    data.streak = 1; // серия прервана
  }

  data.lastDate = today;
  data.claimedToday = false;
  data.tasksCompleted = {}; // сброс ежедневных заданий
  if (typeof window.saveData === 'function') window.saveData();

  // Показать награду за серию
  showStreakReward(data.streak);
};

function showStreakReward(day) {
  // Ищем точное совпадение или ближайшее меньшее для 8-14 и 16-29
  var reward = window.STREAK_REWARDS.find(function(r) { return r.day === day; });
  if (!reward && day > 7 && day < 15) {
    reward = { day: day, type: 'stars', amount: 50 + day * 5, label: (50 + day * 5) + ' ★' };
  }
  if (!reward && day > 15 && day < 30) {
    reward = { day: day, type: 'stars', amount: 100 + day * 5, label: (100 + day * 5) + ' ★' };
  }
  if (!reward && day > 30) {
    reward = { day: day, type: 'stars', amount: 200 + day * 3, label: (200 + day * 3) + ' ★' };
  }
  if (!reward) return;

  // Выдаём награду
  giveStreakReward(reward);

  // Показываем popup
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:999990;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.3s;';
  overlay.innerHTML =
    '<div style="background:linear-gradient(180deg,#1a1408,#0a0804);border:2px solid #f4d03f;border-radius:20px;padding:28px 24px;max-width:320px;text-align:center;">' +
      '<div style="font-size:48px;margin-bottom:12px;">🔥</div>' +
      '<div style="color:#f4d03f;font-size:28px;font-weight:700;margin-bottom:4px;">День ' + day + '</div>' +
      '<div style="color:#c0a040;font-size:13px;margin-bottom:20px;">Серия входа</div>' +
      '<div style="background:rgba(244,208,63,0.1);border:1px solid rgba(244,208,63,0.3);border-radius:12px;padding:14px;margin-bottom:20px;">' +
        '<div style="color:#f4d03f;font-size:18px;font-weight:600;">🎁 ' + reward.label + '</div>' +
      '</div>' +
      '<div style="color:#888;font-size:11px;margin-bottom:16px;">' + getNextMilestone(day) + '</div>' +
      '<button onclick="this.parentElement.parentElement.remove()" style="background:linear-gradient(180deg,#d4a937,#8b6914);color:#1a1004;border:none;padding:12px 36px;border-radius:24px;font-size:14px;font-weight:600;cursor:pointer;">Забрать</button>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
}

function getNextMilestone(currentDay) {
  var milestones = [3, 5, 7, 15, 30];
  for (var i = 0; i < milestones.length; i++) {
    if (currentDay < milestones[i]) {
      var reward = window.STREAK_REWARDS.find(function(r) { return r.day === milestones[i]; });
      return 'До ' + reward.label + ': ещё ' + (milestones[i] - currentDay) + ' дн';
    }
  }
  return 'Легендарная серия! Продолжай!';
}

function giveStreakReward(reward) {
  if (!window.userData) return;
  var starsObj = window.userData.stars || { totalStars: 0 };

  switch (reward.type) {
    case 'xp':
      if (typeof window.awardXP === 'function') window.awardXP(reward.amount, 'Серия входа');
      break;
    case 'stars':
      starsObj.totalStars = parseInt(starsObj.totalStars || 0) + reward.amount;
      window.userData.stars = starsObj;
      break;
    case 'chest':
      starsObj.totalStars = parseInt(starsObj.totalStars || 0) + 50; // бесплатный деревянный
      window.userData.stars = starsObj;
      break;
    case 'wheel':
      // Разрешаем 3 бесплатных прокрута
      localStorage.setItem('fath_bonus_spins', String(reward.amount));
      break;
    case 'card':
      var pool = (window.CHEST_CARDS || []).filter(function(c) { return c.rarity === reward.rarity; });
      if (pool.length > 0) {
        var card = pool[Math.floor(Math.random() * pool.length)];
        var userChest = window.getUserChestCards ? window.getUserChestCards() : {};
        if (!userChest[card.id]) {
          userChest[card.id] = { firstOpened: Date.now(), count: 1 };
        } else {
          userChest[card.id].count++;
        }
      }
      break;
  }

  if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
  if (typeof window.saveData === 'function') window.saveData();
}

// ========== ЕЖЕДНЕВНЫЕ ЗАДАНИЯ ==========
window.DAILY_TASKS = [
  { id: 'read_azkar',   title: 'Прочитать утренние азкары',    reward: 7,  icon: '📿' },
  { id: 'read_quran',   title: 'Прочитать страницу Корана',    reward: 7,  icon: '📖' },
  { id: 'do_zikr',      title: 'Сделать 33 зикра',             reward: 7,  icon: '🤲' }
];

window.isDailyTaskCompleted = function(taskId) {
  var data = getStreakData();
  return !!(data.tasksCompleted && data.tasksCompleted[taskId]);
};

window.completeDailyTask = function(taskId) {
  var data = getStreakData();
  if (!data.tasksCompleted) data.tasksCompleted = {};
  if (data.tasksCompleted[taskId]) return; // уже выполнено

  var task = window.DAILY_TASKS.find(function(t) { return t.id === taskId; });
  if (!task) return;

  data.tasksCompleted[taskId] = Date.now();

  // Начисляем звёзды
  var starsObj = window.userData.stars || { totalStars: 0 };
  starsObj.totalStars = parseInt(starsObj.totalStars || 0) + task.reward;
  window.userData.stars = starsObj;

  if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
  if (typeof window.saveData === 'function') window.saveData();

  // Уведомление
  showTaskCompleteNotification(task);
};

function showTaskCompleteNotification(task) {
  var notif = document.createElement('div');
  notif.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(180deg,#1a3020,#0a1810);border:1px solid #5dcaa5;border-radius:14px;padding:12px 20px;z-index:999995;display:flex;align-items:center;gap:10px;animation:slideDown 0.3s ease-out;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
  notif.innerHTML =
    '<span style="font-size:20px;">' + task.icon + '</span>' +
    '<div>' +
      '<div style="color:#5dcaa5;font-size:13px;font-weight:600;">' + task.title + '</div>' +
      '<div style="color:#7df0c0;font-size:12px;">+' + task.reward + ' ★</div>' +
    '</div>';
  document.body.appendChild(notif);
  setTimeout(function() {
    notif.style.animation = 'slideUp 0.3s ease-in forwards';
    setTimeout(function() { notif.remove(); }, 300);
  }, 2500);
}

window.renderDailyTasksWidget = function() {
  var html = '<div class="daily-tasks-widget">';

  var pendingTasks = [];
  var doneTasks = [];
  window.DAILY_TASKS.forEach(function(task) {
    if (window.isDailyTaskCompleted(task.id)) doneTasks.push(task);
    else pendingTasks.push(task);
  });

  // Показываем только невыполненные
  if (pendingTasks.length > 0) {
    html += '<div class="daily-tasks-title">Ежедневные задания</div>';
    pendingTasks.forEach(function(task) {
      html += '<div class="daily-task-item">';
      html += '<span class="daily-task-icon">' + task.icon + '</span>';
      html += '<div class="daily-task-text">';
      html += '<div class="daily-task-name">' + task.title + '</div>';
      html += '<div class="daily-task-reward">+' + task.reward + ' ★</div>';
      html += '</div>';
      html += '<div class="daily-task-check"></div>';
      html += '</div>';
    });
  } else {
    html += '<div style="text-align:center;padding:12px;"><div style="color:#5dcaa5;font-size:14px;font-weight:600;">Все задания выполнены!</div><div style="color:#888;font-size:11px;margin-top:4px;">Обновление в полночь</div></div>';
  }

  // Серия
  var data = getStreakData();
  html += '<div class="daily-streak-info">';
  html += '<span>🔥 ' + (data.streak || 0) + ' дн подряд</span>';
  html += '<span>' + getNextMilestone(data.streak || 0) + '</span>';
  html += '</div>';

  html += '</div>';
  return html;
};

// ========== ДОСТИЖЕНИЯ ЗА СУНДУК ==========
window.CHEST_ACHIEVEMENTS = [
  { id: 'chest_10',  cards: 10, reward: 1000, label: 'Собрано 10 карт',  title: 'Начинающий коллекционер' },
  { id: 'chest_20',  cards: 20, reward: 2000, label: 'Собрано 20 карт',  title: 'Опытный коллекционер' },
  { id: 'chest_30',  cards: 30, reward: 2500, label: 'Собрано 30 карт',  title: 'Мастер коллекции' },
  { id: 'chest_50',  cards: 50, reward: 5000, label: 'Собрано 50 карт',  title: 'Мастер коллекции' },
  { id: 'chest_65',  cards: 65, reward: 10000, label: 'Все 65 карт!',  title: 'Полная коллекция' }
];

window.checkChestAchievements = function() {
  if (!window.userData) return;
  var userChest = window.getUserChestCards ? window.getUserChestCards() : {};
  var ownedCount = Object.keys(userChest).length;

  if (!window.userData.chestAchievements) window.userData.chestAchievements = {};

  window.CHEST_ACHIEVEMENTS.forEach(function(ach) {
    if (ownedCount >= ach.cards && !window.userData.chestAchievements[ach.id]) {
      // Достижение разблокировано!
      window.userData.chestAchievements[ach.id] = Date.now();

      var starsObj = window.userData.stars || { totalStars: 0 };
      starsObj.totalStars = parseInt(starsObj.totalStars || 0) + ach.reward;
      window.userData.stars = starsObj;

      if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
      if (typeof window.saveData === 'function') window.saveData();

      // Показываем popup
      showAchievementPopup(ach);
    }
  });
};

function showAchievementPopup(ach) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:999991;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.3s;';
  overlay.innerHTML =
    '<div style="background:linear-gradient(180deg,#180a28,#0a0418);border:2px solid #b080e0;border-radius:20px;padding:28px 24px;max-width:320px;text-align:center;">' +
      '<div style="font-size:48px;margin-bottom:12px;">🏆</div>' +
      '<div style="color:#b080e0;font-size:12px;letter-spacing:2px;margin-bottom:8px;">ДОСТИЖЕНИЕ</div>' +
      '<div style="color:#d0b0f0;font-size:22px;font-weight:700;margin-bottom:4px;">' + ach.title + '</div>' +
      '<div style="color:#a080c0;font-size:13px;margin-bottom:20px;">' + ach.label + '</div>' +
      '<div style="background:rgba(176,128,224,0.15);border:1px solid rgba(176,128,224,0.3);border-radius:12px;padding:14px;margin-bottom:20px;">' +
        '<div style="color:#d0b0f0;font-size:20px;font-weight:600;">+' + ach.reward + ' ★</div>' +
      '</div>' +
      '<button onclick="this.parentElement.parentElement.remove()" style="background:linear-gradient(180deg,#8050c0,#5030a0);color:#fff;border:none;padding:12px 36px;border-radius:24px;font-size:14px;font-weight:600;cursor:pointer;">Забрать</button>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
}

// ========== АВТОЗАПУСК ==========
// Проверяем серию при загрузке
setTimeout(function() {
  if (window.userData) {
    window.checkAndUpdateStreak();
  } else {
    setTimeout(function() { window.checkAndUpdateStreak(); }, 3000);
  }
}, 2000);

// Проверяем достижения сундука периодически
setInterval(function() {
  if (window.userData && window.getUserChestCards) {
    window.checkChestAchievements();
  }
}, 10000);

// Инъекция виджета ежедневных заданий в существующий грид на главной
function injectDailyTasks() {
  var grid = document.getElementById('dailyTasksGrid');
  if (!grid) return;
  if (grid._tasksInjected) return;
  grid._tasksInjected = true;

  // Рендерим виджет
  grid.innerHTML = window.renderDailyTasksWidget();

  // Перерисовка каждые 30 секунд
  setInterval(function() {
    var g = document.getElementById('dailyTasksGrid');
    if (g) g.innerHTML = window.renderDailyTasksWidget();
  }, 30000);
}

setTimeout(injectDailyTasks, 2500);
setTimeout(injectDailyTasks, 5000);

// Обновляем бейдж серии вверху
function updateStreakBadge() {
  var badge = document.getElementById('homeStreakBadge');
  if (!badge) return;
  var data = getStreakData();
  badge.textContent = '🔥 ' + (data.streak || 0) + ' дн';
}
setTimeout(updateStreakBadge, 3000);
setInterval(updateStreakBadge, 10000);

// Инжектим задания ТАКЖЕ в модуль Тауба (сверху)
function injectTasksToTauba() {
  var tauba = document.getElementById('module-tauba');
  if (!tauba) return;
  if (tauba.querySelector('.tauba-tasks-injected')) return;
  var card = tauba.querySelector('.ios-card');
  if (!card) return;
  var title = card.querySelector('.ios-card-title');
  if (!title) return;
  var div = document.createElement('div');
  div.className = 'tauba-tasks-injected';
  div.innerHTML = window.renderDailyTasksWidget();
  title.insertAdjacentElement('afterend', div);
  setInterval(function() {
    var d = tauba.querySelector('.tauba-tasks-injected');
    if (d) d.innerHTML = window.renderDailyTasksWidget();
  }, 15000);
}
setTimeout(injectTasksToTauba, 3000);
setTimeout(injectTasksToTauba, 6000);

// CSS для анимаций
(function addTaskCSS() {
  var style = document.createElement('style');
  style.textContent =
    '@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }' +
    '@keyframes slideDown { 0% { opacity: 0; transform: translateX(-50%) translateY(-20px); } 100% { opacity: 1; transform: translateX(-50%) translateY(0); } }' +
    '@keyframes slideUp { 0% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(-20px); } }' +
    '.daily-tasks-widget { background: rgba(0,0,0,0.05); border-radius: 14px; padding: 14px; margin: 12px 0; }' +
    '.daily-tasks-title { font-size: 14px; font-weight: 600; margin: 0 0 10px; color: inherit; }' +
    '.daily-task-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; margin-bottom: 6px; background: rgba(255,255,255,0.05); transition: opacity 0.3s; }' +
    '.daily-task-item.done { opacity: 0.5; }' +
    '.daily-task-icon { font-size: 20px; flex-shrink: 0; }' +
    '.daily-task-text { flex: 1; }' +
    '.daily-task-name { font-size: 13px; font-weight: 500; }' +
    '.daily-task-reward { font-size: 11px; color: #f4d03f; }' +
    '.daily-task-item.done .daily-task-reward { color: #5dcaa5; }' +
    '.daily-task-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #5dcaa5; display: flex; align-items: center; justify-content: center; color: #5dcaa5; font-size: 14px; font-weight: 700; }' +
    '.daily-task-item:not(.done) .daily-task-check { border-color: #444; color: transparent; }' +
    '.daily-streak-info { display: flex; justify-content: space-between; padding: 8px 4px 0; font-size: 11px; color: #888; }';
  document.head.appendChild(style);
})();

console.log('📅 Серии входа + задания + достижения загружены');

// ========== МОСТЫ К СУЩЕСТВУЮЩИМ МОДУЛЯМ ==========

// Мост для азкаров — вызывается из azkar.js через checkDailyTasks()
window.checkDailyTasks = function() {
  // Когда пользователь читает азкары — засчитываем задание
  window.completeDailyTask('read_azkar');
};

// Мост для зикра — проверяем общий счётчик зикра
window.checkZikrForDailyTask = function() {
  if (!window.userData || !window.userData.zikrCounters) return;
  var counters = window.userData.zikrCounters;
  var total = 0;
  for (var key in counters) {
    total += parseInt(counters[key] || 0);
  }
  // Если суммарно 33+ зикров за сегодня
  if (total >= 33) {
    window.completeDailyTask('do_zikr');
  }
};

// Мост для Корана — проверяем что страница была прочитана
window.checkQuranForDailyTask = function() {
  window.completeDailyTask('read_quran');
};

// Привязка к зикру — добавляем проверку при каждом клике
(function hookZikr() {
  function tryHook() {
    document.querySelectorAll('#module-zikr button, #module-zikr [onclick]').forEach(function(btn) {
      if (btn._dailyHooked) return;
      btn._dailyHooked = true;
      btn.addEventListener('click', function() {
        setTimeout(window.checkZikrForDailyTask, 300);
      });
    });
  }
  setTimeout(tryHook, 3000);
  setTimeout(tryHook, 6000);
})();

// Привязка к Корану — при перелистывании страницы
(function hookQuran() {
  function tryHook() {
    var quranBtns = document.querySelectorAll('[onclick*="nextQuranPage"], [onclick*="prevQuranPage"], [onclick*="loadQuranPage"]');
    quranBtns.forEach(function(btn) {
      if (btn._dailyHooked) return;
      btn._dailyHooked = true;
      btn.addEventListener('click', function() {
        setTimeout(window.checkQuranForDailyTask, 1000);
      });
    });
  }
  setTimeout(tryHook, 3000);
  setTimeout(tryHook, 6000);
})();
