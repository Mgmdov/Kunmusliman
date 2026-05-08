// ========== КНОПКА «АКТИВНОСТЬ» ==========
// Показывает выполненные задания, серию, вехи, пасхалки

window.openActivityView = function() {
  var existing = document.getElementById('activityOverlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'activityOverlay';
  overlay.className = 'fullscreen-overlay';

  var streakData = (window.userData && window.userData.streakData) || { streak: 0 };
  var streak = streakData.streak || 0;
  var tasksCompleted = streakData.tasksCompleted || {};

  // Серия
  var html = '<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'activityOverlay\').remove();">← Назад</button><span class="overlay-title">Активность</span><span style="width:60px;"></span></div>';
  html += '<div class="overlay-body">';

  // Серия блок
  html += '<div style="background:linear-gradient(135deg,#1a1408,#2a1c0a);border:2px solid #f4d03f;border-radius:16px;padding:20px;margin-bottom:16px;text-align:center;">';
  html += '<div style="font-size:48px;">🔥</div>';
  html += '<div style="font-size:32px;font-weight:700;color:#f4d03f;">' + streak + ' дн</div>';
  html += '<div style="font-size:13px;color:#c0a040;">Текущая серия</div>';
  html += '</div>';

  // Вехи серии
  html += '<div style="background:var(--card-bg,#fff);border-radius:14px;border:1px solid rgba(0,0,0,.08);padding:16px;margin-bottom:16px;">';
  html += '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">Награды за серию</div>';

  var milestones = window.STREAK_REWARDS || [];
  milestones.forEach(function(m) {
    var done = streak >= m.day;
    html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);">';
    html += '<div style="width:28px;height:28px;border-radius:50%;border:2px solid ' + (done ? '#5dcaa5' : '#ddd') + ';display:flex;align-items:center;justify-content:center;font-size:12px;color:' + (done ? '#5dcaa5' : '#ccc') + ';font-weight:700;">' + (done ? '✓' : m.day) + '</div>';
    html += '<div style="flex:1;"><div style="font-size:13px;font-weight:500;' + (done ? 'color:#5dcaa5;' : '') + '">День ' + m.day + '</div>';
    html += '<div style="font-size:11px;color:#888;">' + m.label + '</div></div>';
    if (done) html += '<span style="font-size:11px;color:#5dcaa5;">Получено</span>';
    html += '</div>';
  });
  html += '</div>';

  // Ежедневные задания сегодня
  html += '<div style="background:var(--card-bg,#fff);border-radius:14px;border:1px solid rgba(0,0,0,.08);padding:16px;margin-bottom:16px;">';
  html += '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">Задания сегодня</div>';

  var tasks = window.DAILY_TASKS || [];
  tasks.forEach(function(task) {
    var done = !!tasksCompleted[task.id];
    html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);">';
    html += '<span style="font-size:18px;">' + task.icon + '</span>';
    html += '<div style="flex:1;"><div style="font-size:13px;' + (done ? 'text-decoration:line-through;color:#888;' : '') + '">' + task.title + '</div></div>';
    html += '<div style="font-size:12px;color:' + (done ? '#5dcaa5' : '#f4d03f') + ';">' + (done ? '✓' : '+' + task.reward + '★') + '</div>';
    html += '</div>';
  });
  html += '</div>';

  // Пасхалки
  var eggs = window.EASTER_EGG_CARDS || [];
  var userEggs = (window.userData && window.userData.easterEggs) || {};
  var unlockedEggs = eggs.filter(function(e) { return userEggs[e.id]; });

  html += '<div style="background:var(--card-bg,#fff);border-radius:14px;border:1px solid rgba(0,0,0,.08);padding:16px;margin-bottom:16px;">';
  html += '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">Секретные карты · ' + unlockedEggs.length + '/' + eggs.length + '</div>';

  eggs.forEach(function(egg) {
    var done = !!userEggs[egg.id];
    html += '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.03);">';
    html += '<span style="font-family:Amiri,serif;font-size:16px;color:' + (done ? '#c060ff' : '#ccc') + ';">' + (done ? egg.arabic : '？') + '</span>';
    html += '<div style="flex:1;font-size:12px;color:' + (done ? 'inherit' : '#aaa') + ';">' + (done ? egg.name + ' · ' + egg.title : '???') + '</div>';
    if (done) html += '<span style="font-size:10px;color:#c060ff;">✦</span>';
    html += '</div>';
  });
  html += '</div>';

  // Достижения сундука
  var chestAchs = window.CHEST_ACHIEVEMENTS || [];
  var userChestAchs = (window.userData && window.userData.chestAchievements) || {};
  var userChest = window.getUserChestCards ? window.getUserChestCards() : {};
  var ownedCards = Object.keys(userChest).length;

  html += '<div style="background:var(--card-bg,#fff);border-radius:14px;border:1px solid rgba(0,0,0,.08);padding:16px;margin-bottom:16px;">';
  html += '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">Достижения сундука · ' + ownedCards + '/50</div>';

  chestAchs.forEach(function(ach) {
    var done = !!userChestAchs[ach.id];
    var progress = Math.min(ownedCards, ach.cards);
    html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);">';
    html += '<div style="font-size:18px;">' + (done ? '🏆' : '🔒') + '</div>';
    html += '<div style="flex:1;">';
    html += '<div style="font-size:13px;font-weight:500;">' + ach.title + '</div>';
    html += '<div style="font-size:11px;color:#888;">' + progress + '/' + ach.cards + ' · +' + ach.reward + '★</div>';
    // Прогресс бар
    html += '<div style="height:4px;background:rgba(0,0,0,.08);border-radius:2px;margin-top:4px;overflow:hidden;">';
    html += '<div style="height:100%;width:' + Math.round(progress * 100 / ach.cards) + '%;background:' + (done ? '#5dcaa5' : '#f4d03f') + ';border-radius:2px;"></div>';
    html += '</div></div>';
    if (done) html += '<span style="font-size:11px;color:#5dcaa5;">Получено</span>';
    html += '</div>';
  });
  html += '</div>';

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
};

console.log('📊 Активность загружена');
