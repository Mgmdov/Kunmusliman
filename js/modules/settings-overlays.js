// ========== НАСТРОЙКИ — ОВЕРЛЕИ (ИСПРАВЛЕНО) ==========

// Экспортируем функцию применения темы
window.applyTheme = function(theme) {
  document.body.classList.remove('theme-dark','theme-ramadan','theme-mosque','theme-ocean','theme-gold','theme-sakura','theme-sunset');
  if (theme !== 'light') document.body.classList.add('theme-' + theme);
  localStorage.setItem('muslim_tracker_theme', theme);
};

window.openSettingsThemes = function() {
  var existing = document.getElementById('settingsThemesOverlay');
  if (existing) existing.remove();

  var saved = localStorage.getItem('muslim_tracker_theme') || 'light';
  var themes = [
    {id:'light',name:'Светлая',icon:'☀️',bg:'#FFFFFF',color:'#000'},
    {id:'dark',name:'Тёмная',icon:'🌙',bg:'#1C1C1E',color:'#FFD700'},
    {id:'ramadan',name:'Рамадан',icon:'🌟',bg:'linear-gradient(135deg,#1a0a2e,#0d1b2a)',color:'#FFD700'},
    {id:'mosque',name:'Мечеть',icon:'🕌',bg:'linear-gradient(135deg,#0a2f1a,#1a4a2a)',color:'#81C784'},
    {id:'ocean',name:'Океан',icon:'🌊',bg:'linear-gradient(135deg,#001f3f,#004080)',color:'#00BFFF'},
    {id:'gold',name:'Золото',icon:'👑',bg:'linear-gradient(135deg,#1a0a00,#3a2a00)',color:'#FFD700'},
    {id:'sakura',name:'Сакура',icon:'🌸',bg:'linear-gradient(135deg,#1a001a,#330033)',color:'#FFB6C1'},
    {id:'sunset',name:'Закат',icon:'🌅',bg:'linear-gradient(135deg,#2a0a00,#4a1a00)',color:'#FFA500'}
  ];

  var overlay = document.createElement('div');
  overlay.id = 'settingsThemesOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:999997;background:var(--app-bg,#F2F2F7);overflow-y:auto;-webkit-overflow-scrolling:touch;animation:fadeIn 0.3s;';

  var html = '<div style="padding:16px 16px 80px;max-width:600px;margin:0 auto;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">' +
      '<button onclick="document.getElementById(\'settingsThemesOverlay\').remove()" style="background:none;border:none;color:#007AFF;font-size:16px;cursor:pointer;">← Назад</button>' +
      '<h2 style="margin:0;font-size:18px;">Темы</h2>' +
      '<div style="width:60px;"></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';

  themes.forEach(function(t) {
    var isActive = saved === t.id;
    html += '<div class="theme-pick" data-theme="' + t.id + '" style="padding:20px 16px;background:' + t.bg + ';border-radius:16px;border:3px solid ' + (isActive ? '#007AFF' : 'transparent') + ';text-align:center;cursor:pointer;">' +
      '<div style="font-size:2rem;margin-bottom:8px;">' + t.icon + '</div>' +
      '<div style="font-weight:600;color:' + t.color + ';font-size:14px;">' + t.name + '</div>' +
      (isActive ? '<div style="font-size:10px;color:#007AFF;margin-top:4px;">Активна</div>' : '') +
    '</div>';
  });

  html += '</div>';

  // Виджеты
  var hideAyah = localStorage.getItem('hide_ayah_widget') === 'true';
  html += '<div style="margin-top:24px;"><div style="font-weight:600;margin-bottom:12px;">Виджеты</div>' +
    '<label style="display:flex;align-items:center;gap:12px;padding:14px;background:rgba(0,0,0,.03);border-radius:14px;cursor:pointer;">' +
      '<input type="checkbox" id="hideAyahCheck2" ' + (hideAyah ? 'checked' : '') + ' style="width:22px;height:22px;accent-color:#34C759;" onchange="localStorage.setItem(\'hide_ayah_widget\',this.checked)">' +
      '<span style="font-size:14px;">Скрыть виджет «Аят дня»</span>' +
    '</label></div>';

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  // Привязываем клик на темы
  overlay.querySelectorAll('.theme-pick').forEach(function(el) {
    el.addEventListener('click', function() {
      var theme = el.dataset.theme;
      window.applyTheme(theme);
      // Обновляем визуал
      overlay.querySelectorAll('.theme-pick').forEach(function(o) {
        o.style.borderColor = o.dataset.theme === theme ? '#007AFF' : 'transparent';
        var activeLabel = o.querySelector('div[style*="color:#007AFF"]');
        if (activeLabel) activeLabel.remove();
      });
      el.style.borderColor = '#007AFF';
      var label = document.createElement('div');
      label.style.cssText = 'font-size:10px;color:#007AFF;margin-top:4px;';
      label.textContent = 'Активна';
      el.appendChild(label);
    });
  });
};

window.openSettingsData = function() {
  var existing = document.getElementById('settingsDataOverlay');
  if (existing) existing.remove();

  var content = document.getElementById('settingsDataContent');
  if (!content) return;

  var overlay = document.createElement('div');
  overlay.id = 'settingsDataOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:999997;background:var(--app-bg,#F2F2F7);overflow-y:auto;-webkit-overflow-scrolling:touch;animation:fadeIn 0.3s;';

  overlay.innerHTML = '<div style="padding:16px 16px 80px;max-width:600px;margin:0 auto;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">' +
      '<button onclick="document.getElementById(\'settingsDataOverlay\').remove()" style="background:none;border:none;color:#007AFF;font-size:16px;cursor:pointer;">← Назад</button>' +
      '<h2 style="margin:0;font-size:18px;">Данные</h2>' +
      '<div style="width:60px;"></div>' +
    '</div>' +
    content.innerHTML +
  '</div>';
  document.body.appendChild(overlay);
};

console.log('⚙️ Оверлеи настроек загружены (исправлено)');
