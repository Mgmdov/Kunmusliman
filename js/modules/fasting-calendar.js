// ========== КАЛЕНДАРЬ ПОСТА С МЕТКАМИ ==========

window.openFastingCalendar = function() {
  var existing = document.getElementById('fastingCalendarOverlay');
  if (existing) existing.remove();

  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();

  var overlay = document.createElement('div');
  overlay.id = 'fastingCalendarOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:999997;background:var(--app-bg,#F2F2F7);overflow-y:auto;-webkit-overflow-scrolling:touch;animation:fadeIn 0.3s;';

  overlay.innerHTML = '<div style="padding:16px 16px 80px;max-width:600px;margin:0 auto;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">' +
      '<button onclick="document.getElementById(\'fastingCalendarOverlay\').remove()" style="background:none;border:none;color:#007AFF;font-size:15px;cursor:pointer;">← Назад</button>' +
      '<h2 style="margin:0;font-size:18px;">🌙 Календарь поста</h2>' +
      '<div style="width:50px;"></div>' +
    '</div>' +
    '<div id="fastingCalendarContent">' + renderFastingCalendar(currentYear, currentMonth) + '</div>' +
  '</div>';

  document.body.appendChild(overlay);
};

window._fastingCalYear = new Date().getFullYear();
window._fastingCalMonth = new Date().getMonth();

window.fastingCalPrev = function() {
  window._fastingCalMonth--;
  if (window._fastingCalMonth < 0) { window._fastingCalMonth = 11; window._fastingCalYear--; }
  document.getElementById('fastingCalendarContent').innerHTML = renderFastingCalendar(window._fastingCalYear, window._fastingCalMonth);
};

window.fastingCalNext = function() {
  window._fastingCalMonth++;
  if (window._fastingCalMonth > 11) { window._fastingCalMonth = 0; window._fastingCalYear++; }
  document.getElementById('fastingCalendarContent').innerHTML = renderFastingCalendar(window._fastingCalYear, window._fastingCalMonth);
};

function renderFastingCalendar(year, month) {
  var monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var dayNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  var fastingDays = (window.userData && window.userData.fasting && window.userData.fasting.days) || [];
  var fastedDates = {};
  fastingDays.forEach(function(d) { fastedDates[d.date] = true; });

  var firstDay = new Date(year, month, 1).getDay(); // 0=вс
  var startOffset = (firstDay === 0 ? 6 : firstDay - 1); // сдвиг для Пн=0
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = new Date().toISOString().slice(0, 10);

  // Счётчик за месяц
  var monthFasted = 0;
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    if (fastedDates[dateStr]) monthFasted++;
  }

  var html = '';

  // Навигация месяца
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">';
  html += '<button onclick="fastingCalPrev()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#007AFF;">‹</button>';
  html += '<div style="text-align:center;"><div style="font-size:16px;font-weight:600;">' + monthNames[month] + ' ' + year + '</div>';
  html += '<div style="font-size:12px;color:#8E8E93;">Постился: ' + monthFasted + ' из ' + daysInMonth + ' дней</div></div>';
  html += '<button onclick="fastingCalNext()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#007AFF;">›</button>';
  html += '</div>';

  // Заголовки дней
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px;">';
  dayNames.forEach(function(dn) {
    html += '<div style="text-align:center;font-size:11px;color:#8E8E93;font-weight:600;">' + dn + '</div>';
  });
  html += '</div>';

  // Ячейки
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';

  // Пустые ячейки до первого дня
  for (var i = 0; i < startOffset; i++) {
    html += '<div></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    var isFasted = !!fastedDates[dateStr];
    var isToday = dateStr === today;
    var isPast = dateStr < today;
    var dayOfWeek = new Date(year, month, d).getDay();
    var isMonThu = (dayOfWeek === 1 || dayOfWeek === 4);
    var isWhiteDay = (d === 13 || d === 14 || d === 15);

    var bgColor = isFasted ? '#34C759' : isToday ? '#007AFF' : 'rgba(0,0,0,0.03)';
    var textColor = isFasted || isToday ? '#fff' : isPast ? '#aaa' : 'inherit';
    var border = isToday && !isFasted ? '2px solid #007AFF' : isFasted ? '2px solid #2DA44E' : '2px solid transparent';
    var dotHtml = '';
    if (isMonThu && !isFasted) dotHtml = '<div style="width:4px;height:4px;border-radius:50%;background:#FF9500;margin:1px auto 0;"></div>';
    if (isWhiteDay && !isFasted) dotHtml = '<div style="width:4px;height:4px;border-radius:50%;background:#007AFF;margin:1px auto 0;"></div>';

    html += '<div onclick="toggleFastingDay(\'' + dateStr + '\')" style="text-align:center;padding:8px 0;border-radius:10px;background:' + bgColor + ';color:' + textColor + ';border:' + border + ';cursor:pointer;font-size:14px;font-weight:500;min-height:38px;">';
    html += d;
    if (isFasted) html += '<div style="font-size:8px;margin-top:1px;">✓</div>';
    else html += dotHtml;
    html += '</div>';
  }

  html += '</div>';

  // Легенда
  html += '<div style="display:flex;gap:16px;justify-content:center;margin-top:16px;flex-wrap:wrap;">';
  html += '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#8E8E93;"><div style="width:10px;height:10px;border-radius:50%;background:#34C759;"></div> Постился</div>';
  html += '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#8E8E93;"><div style="width:10px;height:10px;border-radius:50%;background:#FF9500;"></div> Пн/Чт (сунна)</div>';
  html += '<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#8E8E93;"><div style="width:10px;height:10px;border-radius:50%;background:#007AFF;"></div> Белые дни (13-15)</div>';
  html += '</div>';

  return html;
}

window.toggleFastingDay = function(dateStr) {
  if (!window.userData) return;
  if (!window.userData.fasting) window.userData.fasting = { days: [], total: 0 };

  var days = window.userData.fasting.days;
  var index = days.findIndex(function(d) { return d.date === dateStr; });

  if (index >= 0) {
    days.splice(index, 1); // убрать метку
  } else {
    days.push({ date: dateStr, type: 'full' }); // поставить метку
  }

  window.userData.fasting.total = days.length;
  if (typeof window.saveData === 'function') window.saveData();

  // Перерендер
  var parts = dateStr.split('-');
  document.getElementById('fastingCalendarContent').innerHTML = renderFastingCalendar(parseInt(parts[0]), parseInt(parts[1]) - 1);
};

// Добавляем кнопку календаря в модуль поста
(function addCalendarButton() {
  function tryAdd() {
    var module = document.getElementById('module-fasting');
    if (!module) return;
    if (module.querySelector('.fasting-calendar-btn')) return;

    var card = module.querySelector('.ios-card');
    if (!card) return;

    var btn = document.createElement('button');
    btn.className = 'fasting-calendar-btn';
    btn.style.cssText = 'width:100%;padding:14px;background:linear-gradient(180deg,#1a3a20,#0a2a10);color:#5dcaa5;border:2px solid #5dcaa5;border-radius:14px;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:16px;';
    btn.innerHTML = '🌙 Открыть календарь поста';
    btn.onclick = window.openFastingCalendar;

    // Вставляем в начало карточки после заголовка
    var title = card.querySelector('.ios-card-title');
    if (title && title.nextSibling) {
      card.insertBefore(btn, title.nextSibling);
    } else {
      card.appendChild(btn);
    }
  }
  setTimeout(tryAdd, 2000);
  setTimeout(tryAdd, 5000);
})();

console.log('📅 Календарь поста загружен');
