// Единая система оформления: только светлая и тёмная темы.
window.applyTheme=function(theme){
  theme = theme === 'light' ? 'light' : 'dark';
  document.body.classList.remove('theme-light','theme-dark','theme-ramadan','theme-mosque','theme-ocean','theme-gold','theme-sakura','theme-sunset');
  document.body.classList.add('theme-'+theme);
  localStorage.setItem('muslim_tracker_theme',theme);
  var meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute('content',theme==='dark'?'#090d0c':'#f4f5f2');
  var btn=document.getElementById('premiumThemeToggle');
  if(btn)btn.innerHTML=theme==='dark'?'<i class="fas fa-sun"></i><span>Светлая</span>':'<i class="fas fa-moon"></i><span>Тёмная</span>';
};
window.togglePremiumTheme=function(){
  var current=document.body.classList.contains('theme-dark')?'dark':'light';
  window.applyTheme(current==='dark'?'light':'dark');
};
(function(){
  var saved=localStorage.getItem('muslim_tracker_theme')||'dark';
  window.applyTheme(saved);
})();
window.openSettingsThemes=function(){
  var old=document.getElementById('settingsThemesOverlay');if(old)old.remove();
  var saved=document.body.classList.contains('theme-dark')?'dark':'light';
  var o=document.createElement('div');o.id='settingsThemesOverlay';o.className='fullscreen-overlay premium-theme-overlay';
  o.innerHTML='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'settingsThemesOverlay\').remove()">← Назад</button><span class="overlay-title">Оформление</span><span></span></div><div class="overlay-body"><p class="premium-theme-note">Выбери оформление приложения</p><div class="premium-theme-choices"><button class="premium-theme-choice light-choice" data-theme="light"><span class="theme-preview light-preview">☀️</span><b>Светлая тема</b><small>Чистый светлый интерфейс</small></button><button class="premium-theme-choice dark-choice" data-theme="dark"><span class="theme-preview dark-preview">🌙</span><b>Тёмная тема</b><small>Графитовый фон и золото</small></button></div></div>';
  document.body.appendChild(o);
  o.querySelectorAll('[data-theme]').forEach(function(b){if(b.dataset.theme===saved)b.classList.add('selected');b.addEventListener('click',function(){window.applyTheme(b.dataset.theme);o.querySelectorAll('[data-theme]').forEach(x=>x.classList.toggle('selected',x===b));});});
};
window.openSettingsData=function(){
  var ex=document.getElementById('settingsDataOverlay');if(ex)ex.remove();
  var content=document.getElementById('settingsDataContent');if(!content)return;
  var home=content.parentNode;
  var o=document.createElement('div');o.id='settingsDataOverlay';o.className='fullscreen-overlay';
  o.innerHTML='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'settingsDataOverlay\').remove()">← Назад</button><span class="overlay-title">Данные</span><span></span></div><div class="overlay-body" id="sdoBody"></div>';
  document.body.appendChild(o);
  // переносим живой блок (а не копию), чтобы кнопки сохраняли обработчики
  o.querySelector('#sdoBody').appendChild(content);
  var mo=new MutationObserver(function(){if(!document.body.contains(o)){home.appendChild(content);mo.disconnect();}});
  mo.observe(document.body,{childList:true});
};
