// ========== НАСТРОЙКИ — ВАРИАНТ B ==========
window.applyTheme=function(theme){
  document.body.classList.remove('theme-dark','theme-ramadan','theme-mosque','theme-ocean','theme-gold','theme-sakura','theme-sunset');
  if(theme!=='light')document.body.classList.add('theme-'+theme);
  localStorage.setItem('muslim_tracker_theme',theme);
};

window.openSettingsThemes=function(){
  var ex=document.getElementById('settingsThemesOverlay');if(ex)ex.remove();
  var saved=localStorage.getItem('muslim_tracker_theme')||'light';
  var themes=[
    {id:'light',n:'Светлая',i:'☀️',bg:'#FFFFFF',c:'#000'},
    {id:'dark',n:'Тёмная',i:'🌙',bg:'#1C1C1E',c:'#FFD700'},
    {id:'ramadan',n:'Рамадан',i:'🌟',bg:'linear-gradient(135deg,#1a0a2e,#0d1b2a)',c:'#FFD700'},
    {id:'mosque',n:'Мечеть',i:'🕌',bg:'linear-gradient(135deg,#0a2f1a,#1a4a2a)',c:'#81C784'},
    {id:'ocean',n:'Океан',i:'🌊',bg:'linear-gradient(135deg,#001f3f,#004080)',c:'#00BFFF'},
    {id:'gold',n:'Золото',i:'👑',bg:'linear-gradient(135deg,#1a0a00,#3a2a00)',c:'#FFD700'},
    {id:'sakura',n:'Сакура',i:'🌸',bg:'linear-gradient(135deg,#1a001a,#330033)',c:'#FFB6C1'},
    {id:'sunset',n:'Закат',i:'🌅',bg:'linear-gradient(135deg,#2a0a00,#4a1a00)',c:'#FFA500'}
  ];
  var o=document.createElement('div');o.id='settingsThemesOverlay';
  o.className='fullscreen-overlay';
  var h='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'settingsThemesOverlay\').remove();">← Назад</button><span class="overlay-title">Темы</span><span style="width:60px;"></span></div>';
  h+='<div class="overlay-body"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
  themes.forEach(function(t){
    var active=saved===t.id;
    h+='<div class="theme-pick-item" data-theme="'+t.id+'" style="padding:20px 16px;background:'+t.bg+';border-radius:16px;border:3px solid '+(active?'#007AFF':'transparent')+';text-align:center;cursor:pointer;"><div style="font-size:2rem;margin-bottom:8px;">'+t.i+'</div><div style="font-weight:500;color:'+t.c+';font-size:14px;">'+t.n+'</div></div>';
  });
  h+='</div></div>';
  o.innerHTML=h;
  document.body.appendChild(o);
  // Привязка — БЕЗ бага "Активна"
  o.querySelectorAll('.theme-pick-item').forEach(function(el){
    el.addEventListener('click',function(){
      var theme=el.dataset.theme;
      window.applyTheme(theme);
      // Просто обновляем бордеры, НЕ добавляем текст
      o.querySelectorAll('.theme-pick-item').forEach(function(x){
        x.style.borderColor=x.dataset.theme===theme?'#007AFF':'transparent';
      });
    });
  });
};

window.openSettingsData=function(){
  var ex=document.getElementById('settingsDataOverlay');if(ex)ex.remove();
  var content=document.getElementById('settingsDataContent');
  if(!content)return;
  var o=document.createElement('div');o.id='settingsDataOverlay';
  o.className='fullscreen-overlay';
  o.innerHTML='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'settingsDataOverlay\').remove();">← Назад</button><span class="overlay-title">Данные</span><span style="width:60px;"></span></div><div class="overlay-body">'+content.innerHTML+'</div>';
  document.body.appendChild(o);
};
console.log('⚙️ Настройки B');
