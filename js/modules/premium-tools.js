/* Kunmusliman Premium tools v13: dashboard, progress, Hijri calendar, backup */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  function data(){ try { return typeof userData !== 'undefined' ? userData : (window.userData || {}); } catch(e){ return window.userData || {}; } }
  function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function n(v){ const x=Number(v); return Number.isFinite(x)?x:0; }
  function fmt(v){ return n(v).toLocaleString('ru-RU'); }
  function updateDashboard(){
    const d=data(), k=d.khatm||{};
    const today=new Date();
    const date=$('premiumTodayDate'); if(date) date.textContent=today.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
    const vals={dashPages:n(k.readPages),dashZikr:n(d.totalZikrOverall),dashSalawat:n(d.totalSalawat),dashStars:n(d.stars&&d.stars.totalStars)};
    // «Мой день» — только за сегодня: отсчёт от снимка общих итогов на начало дня.
    // Общие итоги (userData) не меняются и остаются в «Подробной статистике».
    const dk=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let base=null,last=null;try{base=JSON.parse(localStorage.getItem('kun_day_base_v1'));}catch(e){}
    try{last=JSON.parse(localStorage.getItem('kun_day_last_v1'));}catch(e){}
    if(!base||base.day!==dk){
      // Новый день (после 00:00 по местному времени). Если приложение было открыто через полночь,
      // базой берём последние значения до полуночи, чтобы действия сразу после 00:00 не потерялись.
      const midnight=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime();
      const useLast=last&&last.ts>=midnight-180000&&last.ts<midnight&&Object.keys(vals).every(k=>vals[k]>=n(last[k]));
      base=Object.assign({day:dk},useLast?{dashPages:last.dashPages,dashZikr:last.dashZikr,dashSalawat:last.dashSalawat,dashStars:last.dashStars}:vals);
      try{localStorage.setItem('kun_day_base_v1',JSON.stringify(base));}catch(e){}
    }
    // Если итог уменьшился (потратили звёзды, сброс счётчика) — сохраняем уже набранное за сегодня
    let changed=false;
    Object.keys(vals).forEach(id=>{if(vals[id]<n(base[id])){base[id]=vals[id]-n(base.shown&&base.shown[id]);changed=true;}});
    if(changed){try{localStorage.setItem('kun_day_base_v1',JSON.stringify(base));}catch(e){}}
    base.shown=base.shown||{};
    Object.keys(vals).forEach(id=>{const v=Math.max(0,vals[id]-n(base[id]));base.shown[id]=v;const el=$(id);if(el)el.textContent=fmt(v);});
    try{localStorage.setItem('kun_day_last_v1',JSON.stringify(Object.assign({ts:Date.now()},vals)));}catch(e){}
  }
  document.addEventListener('kunmusliman:new-day',()=>{try{updateDashboard();}catch(e){}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{updateDashboard();}catch(e){}}});
  setInterval(()=>{try{updateDashboard();}catch(e){}},15000);
  window.updatePremiumDashboard=updateDashboard;

  function openOverlay(id,title,body){
    const old=$(id); if(old)old.remove();
    const el=document.createElement('section');el.id=id;el.className='premium-tools-overlay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
    el.innerHTML='<div class="premium-tools-sheet"><header><button type="button" class="premium-tools-back" data-close>‹ Назад</button><h2>'+esc(title)+'</h2><span></span></header>'+body+'</div>';
    el.addEventListener('click',e=>{if(e.target===el||e.target.closest('[data-close]'))el.remove();});
    document.body.appendChild(el);return el;
  }
  function hijriParts(date){
    try{
      const f=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'});
      const parts=f.formatToParts(date),o={};parts.forEach(p=>o[p.type]=p.value);
      return {day:Number(o.day),month:Number(o.month),year:Number(o.year)};
    }catch(e){return null;}
  }
  const hijriMonths=['Мухаррам','Сафар','Раби аль-авваль','Раби ас-сани','Джумада аль-уля','Джумада ас-сания','Раджаб','Шаабан','Рамадан','Шавваль','Зуль-каада','Зуль-хиджа'];
  const islamicEvents={
    '1-1':'Начало исламского года','1-10':'День Ашура','9-1':'Начало Рамадана','10-1':'Ид аль-Фитр (Ураза-байрам)','12-9':'День Арафа','12-10':'Ид аль-Адха (Курбан-байрам)'
  };
  window.openIslamicCalendar=function(){
    let shown=new Date();shown.setDate(1);
    function render(){
      const year=shown.getFullYear(),month=shown.getMonth(),first=new Date(year,month,1),days=new Date(year,month+1,0).getDate(),offset=(first.getDay()+6)%7;
      const today=new Date();const cells=[];for(let i=0;i<offset;i++)cells.push('<span class="hijri-empty"></span>');
      let monthLabel='';let marked=[];
      for(let day=1;day<=days;day++){
        const date=new Date(year,month,day,12),hp=hijriParts(date);if(hp&&!monthLabel)monthLabel=hijriMonths[hp.month-1]+' '+hp.year+' г. х.';
        const event=hp&&islamicEvents[hp.month+'-'+hp.day];
        const isToday=date.toDateString()===today.toDateString();
        if(event)marked.push({day,hijri:hp.day,event});
        cells.push('<button type="button" class="hijri-day '+(isToday?'is-today ':'')+(event?'has-event':'')+'" data-day="'+day+'"><b>'+day+'</b><small>'+(hp?hp.day:'—')+'</small>'+(event?'<i></i>':'')+'</button>');
      }
      const content='<div class="hijri-calendar-head"><button type="button" data-prev>‹</button><div><b>'+esc(first.toLocaleDateString('ru-RU',{month:'long',year:'numeric'}))+'</b><small>'+esc(monthLabel||'Хиджри-дата недоступна')+'</small></div><button type="button" data-next>›</button></div><div class="hijri-week">'+['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>'<span>'+x+'</span>').join('')+'</div><div class="hijri-grid">'+cells.join('')+'</div><div class="hijri-events"><h3>Важные даты этого месяца</h3>'+(marked.length?marked.map(x=>'<div><b>'+x.day+' '+first.toLocaleDateString('ru-RU',{month:'long'})+'</b><span>'+esc(x.event)+'</span></div>').join(''):'<p>В этом месяце нет дат из краткого списка праздников.</p>')+'</div><p class="hijri-note">Хиджри-даты рассчитаны календарём Umm al-Qura на устройстве. Фактическое начало лунных месяцев и религиозных дат может отличаться в зависимости от наблюдения луны и принятого календаря.</p>';
      const target=$('hijriCalendarContent');if(target)target.innerHTML=content;
    }
    const overlay=openOverlay('premiumHijriCalendar','Исламский календарь','<div id="hijriCalendarContent"></div>');
    overlay.addEventListener('click',e=>{if(e.target.closest('[data-prev]')){shown.setMonth(shown.getMonth()-1);render();}if(e.target.closest('[data-next]')){shown.setMonth(shown.getMonth()+1);render();}});render();
  };

  window.openPremiumProgress=function(){
    const d=data(),k=d.khatm||{},stars=d.stars||{},fasting=d.fasting||{},cards=Array.isArray(d.unlockedCards)?d.unlockedCards.length:0;
    const allCards=(function(){var L=(window.ALL_COLLECTION_CARDS&&window.ALL_COLLECTION_CARDS.length)?window.ALL_COLLECTION_CARDS:(typeof getAllCollectionCards==='function'?getAllCollectionCards():[]);var ud=window.userData||{};var own=new Set([].concat(ud.unlockedCards||[],(ud.jumaCards||[]).map(function(c){return c&&typeof c==='object'?c.id:c;}),Object.keys(ud.chestCards||{}),Object.keys(ud.easterEggs||{}).filter(function(k){return ud.easterEggs[k];})));return L.filter(function(c){return !(/^ee_/.test(c.id)||c.id==='p24'||c.id==='prophet_story'||c.secret===true)||own.has(c.id);}).length;})();
    const ach=Array.isArray(d.achievements)?d.achievements.length:0;
    const rows=[['Страницы Корана',n(k.readPages),'📖'],['Завершённые хатмы',n(k.completedKhatms),'📚'],['Зикры',n(d.totalZikrOverall),'📿'],['Салаваты',n(d.totalSalawat),'🌹'],['Звёзды',n(stars.totalStars),'⭐'],['Дни поста',Array.isArray(fasting.days)?fasting.days.length:n(fasting.total),'🌙'],['Открытые карточки',cards,'🎴'],['Достижения',ach,'🏆']];
    const body='<div class="premium-progress-summary"><span>Уровень</span><b>'+fmt(d.level||1)+'</b><span>Опыт</span><b>'+fmt(d.xp||0)+' XP</b></div><div class="premium-progress-list">'+rows.map(r=>'<div><span>'+r[2]+' '+r[0]+'</span><b>'+fmt(r[1])+'</b></div>').join('')+'</div><div class="premium-progress-collection"><div><span>Коллекция карточек</span><b>'+fmt(cards)+' / '+fmt(allCards)+'</b></div><div class="premium-progress-track"><i style="width:'+(allCards?Math.min(100,cards/allCards*100):0)+'%"></i></div></div><p class="premium-progress-note">Показаны накопительные значения, которые приложение уже хранит. Исторические графики за прошлые периоды не строятся там, где исходная версия не сохраняла ежедневную историю — фиктивные данные не добавляются.</p>';
    openOverlay('premiumProgressOverlay','Мой прогресс',body);
  };

  // Полный пользовательский backup: userData + безопасные ключи localStorage, без токенов авторизации.
  function backupKeys(){const out={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key)continue;if(/firebase|auth|token|oauth|google|gapi/i.test(key))continue;try{out[key]=localStorage.getItem(key);}catch(e){}}return out;}
  const exportBtn=$('exportDataBtn');if(exportBtn){exportBtn.addEventListener('click',e=>{
    e.stopImmediatePropagation();const payload={app:'Kunmusliman',backupVersion:2,exportDate:new Date().toISOString(),userData:data(),specialDaysCounters:(typeof specialDaysCounters!=='undefined'?specialDaysCounters:{}),localStorage:backupKeys()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='kunmusliman-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);if(typeof showNotification==='function')showNotification('Резервная копия создана');
  },true);}
  const importBtn=$('importDataBtn');if(importBtn)importBtn.addEventListener('click',e=>{e.stopImmediatePropagation();$('importFileInput')?.click();},true);
  const input=$('importFileInput');if(input)input.addEventListener('change',e=>{
    e.stopImmediatePropagation();const file=e.target.files&&e.target.files[0];if(!file)return;
    const reader=new FileReader();reader.onload=async ev=>{try{
      const pack=JSON.parse(ev.target.result);if(!pack||typeof pack!=='object'||(!pack.userData&&!pack.localStorage))throw new Error('Неверный формат резервной копии');
      if(!confirm('Импортировать резервную копию? Текущие значения профиля будут объединены с данными файла, а одноимённые ключи приложения заменены.'))return;
      if(pack.userData&&typeof pack.userData==='object'){Object.assign(data(),pack.userData);if(typeof ensureFullDataStructure==='function')ensureFullDataStructure();}
      if(pack.specialDaysCounters&&typeof specialDaysCounters!=='undefined')Object.assign(specialDaysCounters,pack.specialDaysCounters);
      if(pack.localStorage&&typeof pack.localStorage==='object')Object.keys(pack.localStorage).forEach(key=>{if(!/firebase|auth|token|oauth|google|gapi/i.test(key)&&typeof pack.localStorage[key]==='string')localStorage.setItem(key,pack.localStorage[key]);});
      if(typeof saveLocalBackup==='function')saveLocalBackup();if(typeof saveUserData==='function')await saveUserData();if(typeof updateAllUI==='function')updateAllUI();if(typeof renderCollection==='function')renderCollection();updateDashboard();if(typeof showNotification==='function')showNotification('Резервная копия импортирована');
    }catch(err){alert('Не удалось импортировать копию: '+err.message);}finally{input.value='';}};reader.readAsText(file);
  },true);

  // Unified shell: make every module panel inherit the same app surface, while preserving module-specific art.
  const style=document.createElement('style');style.textContent='';document.head.appendChild(style);
  document.addEventListener('DOMContentLoaded',updateDashboard);setTimeout(updateDashboard,900);setInterval(updateDashboard,15000);
  window.addEventListener('pageshow',updateDashboard);
  // «Мой день» обновляется сразу после действий (зикр, страница, звёзды)
  setTimeout(function(){['updateHomeWidgets','updateKhatmUI'].forEach(function(nm){
    var o=window[nm]; if(typeof o!=='function'||o.__dash)return;
    var w=function(){var r=o.apply(this,arguments);try{updateDashboard();}catch(e){}return r;}; w.__dash=1; window[nm]=w;
  });},500);
})();

if('serviceWorker' in navigator && location.protocol!=='file:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Service worker registration failed',e)));}
