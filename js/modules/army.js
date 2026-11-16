/* Kunmusliman v21 — исторические кампании и коллекционные награды.
   Клиентские ограничения не являются серверным античитом. */
(() => {
 const KEY='kun_army_v3';
 const events=[
  {id:'badr',card:'battle_badr',name:'Битва при Бадре',date:'2 г. х.',icon:'⚔️',rarity:'Легендарная',required:313,desc:'Первая крупная битва мусульманской общины. Игровой порог отсылает к традиционно приводимой численности участников.'},
  {id:'uhud',card:'battle_uhud',name:'Битва при Ухуде',date:'3 г. х.',icon:'🏹',rarity:'Эпическая',required:500,desc:'Изучите ход событий и урок о дисциплине лучников.'},
  {id:'khandaq',card:'battle_khandaq',name:'Битва у Рва',date:'5 г. х.',icon:'🛡️',rarity:'Эпическая',required:700,desc:'Оборона Медины и стратегия рва, предложенная Салманом аль-Фариси.'},
  {id:'khaybar',card:'battle_khaybar',name:'Хайбар',date:'7 г. х.',icon:'🏰',rarity:'Эпическая',required:900,desc:'История похода к укреплениям Хайбара.'},
  {id:'mutah',card:'battle_muta',name:'Битва при Муте',date:'8 г. х.',icon:'🐎',rarity:'Легендарная',required:1100,desc:'История трёх назначенных командиров и действий Халида ибн аль-Валида.'},
  {id:'fath',card:'battle_fath',name:'Завоевание Мекки',date:'8 г. х.',icon:'🕋',rarity:'Мифическая',required:1300,desc:'Историческое событие, известное проявлением прощения и всеобщей амнистии.'},
  {id:'hunain',card:'battle_hunayn',name:'Битва при Хунайне',date:'8 г. х.',icon:'🏜️',rarity:'Эпическая',required:1500,desc:'Сражение, упомянутое в суре Ат-Тауба (9:25–26).'},
  {id:'tabuk',card:'battle_tabuk',name:'Поход на Табук',date:'9 г. х.',icon:'🌄',rarity:'Редкая',required:1700,desc:'Поход, известный как испытание трудности; крупного сражения не произошло.'},
  {id:'yarmouk',card:'battle_yarmouk',name:'Битва при Ярмуке',date:'15 г. х.',icon:'🏞️',rarity:'Легендарная',required:2000,desc:'Крупное сражение эпохи Праведных халифов.'},
  {id:'qadisiyyah',card:'battle_qadisiyyah',name:'Битва при Кадисии',date:'15 г. х.',icon:'🐘',rarity:'Легендарная',required:2300,desc:'Сражение между войсками халифата и Сасанидской державы.'},
  {id:'hattin',card:'battle_hattin',name:'Битва при Хаттине',date:'583 г. х.',icon:'🛡️',rarity:'Легендарная',required:2600,desc:'Победа войска Салахуддина аль-Аюби в 1187 году.'},
  {id:'aynjalut',card:'battle_aynjalut',name:'Битва при Айн-Джалуте',date:'658 г. х.',icon:'⚔️',rarity:'Мифическая',required:3000,desc:'Сражение 1260 года, остановившее продвижение монгольских войск в регион.'}
 ];
 const day=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;};
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(_){return {};}};
 let st={units:0,merit:0,completed:[],lastAward:0,day:'',daily:0,...read()};
 st.completed=Array.isArray(st.completed)?st.completed:[];
 function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){console.warn('Не удалось сохранить прогресс армии',e);}}
 function unitGain(source){return source==='quran'?5:(source==='azkar'||source==='salawat'||source==='zikr')?3:2;}
 window.armyPop=function(t){try{const d=document.createElement('div');d.className='army-unit-pop';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1700);}catch(e){}};
window.addArmyUnits=function(n){n=Math.max(0,Math.floor(Number(n)||0));if(!n)return false;st.units+=n;save();render();window.armyPop("⚔️ +"+n+" воинов");return true;};
 window.addArmyMerit=function(source='general'){
  const now=Date.now(),d=day();if(st.day!==d){st.day=d;st.daily=0;}
  // Локальный антиспам: интервал 5 секунд и не более 10 начислений в сутки.
  if(now-st.lastAward<5000||st.daily>=10)return false;
  const gain=unitGain(source);st.lastAward=now;st.daily++;st.merit+=1;st.units+=gain;save();render();return true;
 };
 function rank(){return st.units>=2000?'Знаменосец':st.units>=1000?'Командир':st.units>=500?'Ветеран':st.units>=100?'Воин':'Новобранец';}
 function render(){
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('armyMerit',st.merit);set('armySoldierCount',st.units.toLocaleString('ru-RU'));set('armyRank',rank());set('armyMapProgress',`Кампания: ${st.completed.length}/${events.length}`);
  const fill=document.getElementById('armyMeritFill');if(fill)fill.style.width=Math.min(100,(st.units%500)/5)+'%';
  const map=document.getElementById('mapSoldiers');if(map)map.textContent=st.units?`🛡️ ${st.units.toLocaleString('ru-RU')} · ⚔️ 🐎 🏹`:'Пока нет воинов — выполняйте задания';
  const cards=document.getElementById('campaignBattleCards');if(cards)cards.innerHTML=events.map((e,i)=>{const done=st.completed.includes(e.id),prev=i===0||st.completed.includes(events[i-1].id),ready=st.units>=e.required,available=prev&&ready;return `<article class="campaign-battle-card ${done?'is-done':''} ${available||done?'':'is-locked'}"><div class="campaign-card-icon">${e.icon}</div><div class="campaign-card-copy"><small>${e.date} · ${e.rarity} · УНИКАЛЬНАЯ КАРТОЧКА</small><b>${e.name}</b><p>${e.desc}</p><small>Порог отряда: ${e.required.toLocaleString('ru-RU')} · Сейчас: ${st.units.toLocaleString('ru-RU')}</small></div><button type="button" data-campaign-open="${e.id}" ${available||done?'':'disabled'}>${done?'Открыть историю':!prev?'Предыдущая закрыта':!ready?'Пополнить отряд':'Пройти событие'}</button></article>`}).join('');
  try{const dm=document.getElementById('desertMap');if(dm){let cv=document.getElementById('armyCaravan');if(!cv){cv=document.createElement('div');cv.id='armyCaravan';dm.appendChild(cv);}
   const idx=events.findIndex(e=>!st.completed.includes(e.id)),cur=events[idx<0?events.length-1:idx],nd=cur&&dm.querySelector('[data-campaign-battle="'+cur.id+'"]');
   if(nd){cv.textContent=st.units>=cur.required?'🐎':'🐪';cv.style.left=nd.style.getPropertyValue('--x');cv.style.top=nd.style.getPropertyValue('--y');cv.style.marginLeft='-30px';cv.style.marginTop='-42px';}}}catch(e){}
  document.querySelectorAll('[data-campaign-battle]').forEach(b=>{const i=events.findIndex(e=>e.id===b.dataset.campaignBattle),e=events[i];b.classList.toggle('done',!!e&&st.completed.includes(e.id));b.classList.toggle('locked',!(e&&st.units>=e.required&&(i===0||st.completed.includes(events[i-1].id))));});
 }
 function complete(id){const i=events.findIndex(e=>e.id===id),e=events[i];if(!e||st.completed.includes(id)||st.units<e.required||(i>0&&!st.completed.includes(events[i-1].id)))return false;st.completed.push(id);save();if(typeof unlockCardIfNotHave==='function')unlockCardIfNotHave(e.card);if(typeof window.awardStars==='function')window.awardStars(3,'Изучение исторической кампании: '+e.name,'army:campaign:'+id);else if(typeof userData!=='undefined'){if(!userData.stars)userData.stars={totalStars:0};userData.stars.totalStars=(userData.stars.totalStars||0)+3;if(typeof saveUserData==='function')saveUserData();}if(typeof addXP==='function')addXP(75);if(typeof showNotification==='function')showNotification(`Кампания пройдена: «${e.name}». История и карточка битвы открыты · +3 звезды`);document.dispatchEvent(new CustomEvent('army:battle-unlocked',{detail:{id}}));if(typeof showFirework==='function')showFirework(`${e.icon} ${e.name}`);render();return true;}
 function open(id){const i=events.findIndex(e=>e.id===id),e=events[i];if(!e){return;}if(st.completed.includes(id)){if(typeof window.openBattleHistoryFromArmy==='function')window.openBattleHistoryFromArmy(id);return;}if(st.units<e.required||(i>0&&!st.completed.includes(events[i-1].id))){if(typeof showNotification==='function')showNotification(`Для открытия требуется ${e?.required||0} воинов. Сейчас: ${st.units}.`);return;}
  let m=document.getElementById('armyBattleModal');if(!m){m=document.createElement('div');m.id='armyBattleModal';m.className='army-battle-modal';document.body.appendChild(m);}m.innerHTML=`<div class="army-battle-dialog"><button class="army-battle-close" type="button" aria-label="Закрыть">×</button><div class="battle-modal-art has-scene">${(window.armyScene?window.armyScene(e.id):e.icon)}<em>${e.icon}</em></div><small>ИСТОРИЧЕСКАЯ КАМПАНИЯ · ${e.date}</small><h3>${e.name}</h3><p>${e.desc}</p><div class="battle-modal-squad">⚔️ 🐎 🏹<span>Ваш игровой отряд · ${st.units.toLocaleString('ru-RU')} воинов</span></div><button class="army-battle-start" type="button">Изучить событие и открыть карточку</button><p class="battle-modal-foot">Образовательная историческая механика. Игровая численность не является утверждением о реальном составе войск.</p></div>`;m.classList.add('visible');m.querySelector('.army-battle-close').onclick=()=>m.classList.remove('visible');m.querySelector('.army-battle-start').onclick=()=>{complete(id);m.classList.remove('visible');};
 }
 document.addEventListener('click',e=>{const b=e.target.closest('[data-campaign-open],[data-campaign-battle]');if(b)open(b.dataset.campaignOpen||b.dataset.campaignBattle);});
 document.addEventListener('DOMContentLoaded',render);render();
})();
