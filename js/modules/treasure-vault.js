/* Kunmusliman — Сокровищница: ежедневные испытания и три сундука.
   Использует существующую коллекцию CHEST_CARDS/getUserChestCards; не меняет обычные сундуки. */
(function(){
  'use strict';
  var KEY='treasureVault';
  var QUESTS=[
    {id:'quran',title:'Прочитать суру Корана',desc:'Открой задание и отметь суру прочитанной',icon:'📖',stars:3,source:'read_quran',module:'khatm'},
    {id:'azkar',title:'Выполнить азкары',desc:'Отметь все азкары в открытом разделе',icon:'📿',stars:3,source:'read_azkar',module:'azkar'},
    {id:'zikr',title:'Выполнить круг зикра',desc:'Набрать 33 зикра за сегодня',icon:'🤲',stars:3,source:'do_zikr',module:'zikr'},
    {id:'salawat',title:'Прочитать 100 салаватов',desc:'Набрать 100 салаватов за сегодня',icon:'🌹',stars:3,source:'salawat',module:'zikr'},
    {id:'daily',title:'Завершить все задания дня',desc:'Коран, азкары, зикр и салават',icon:'🌙',stars:5,source:'all'}
  ];

  // ===== v51: три сундука с картинками, «Что внутри», награды: звёзды, карточки, воины, прокруты =====
  var CHESTS=[
    {id:'gold',name:'Золотой сундук',img:'images/chests/gold.jpg',need:6,period:'day',sub:'Награда за 2 задания дня',stars:[20,30],units:25,spins:0,cards:[{n:1,w:{common:70,rare:30}}],tag:'ЕЖЕДНЕВНЫЙ'},
    {id:'emerald',name:'Изумрудный сундук',img:'images/chests/emerald.jpg',need:17,period:'day',sub:'Награда за все задания дня',stars:[50,70],units:100,spins:1,cards:[{n:1,w:{rare:45,epic:45,legendary:10}}],tag:'ЕЖЕДНЕВНЫЙ'},
    {id:'sapphire',name:'Сапфировый сундук',img:'images/chests/sapphire.jpg',need:7,period:'week',sub:'Награда за 7 дней заданий',stars:[150,200],units:500,spins:3,cards:[{n:1,w:{epic:70,legendary:25,mythic:5},g:'эпическая или выше'},{n:1,w:{rare:50,epic:35,legendary:15}}],tag:'НЕДЕЛЬНЫЙ'}
  ];
  var RN={common:'Обычная',rare:'Редкая',epic:'Эпическая',legendary:'Легендарная',mythic:'Мифическая'},RC={common:'#9ca3af',rare:'#60a5fa',epic:'#a78bfa',legendary:'#f4c542',mythic:'#e879f9'};
  function rint(a,b){return a+Math.floor(Math.random()*(b-a+1));}
  function pickRarity(w){var t=0,k;for(k in w)t+=w[k];var r=Math.random()*t;for(k in w){r-=w[k];if(r<=0)return k;}return Object.keys(w)[0];}
  function pickCardR(rar){var all=window.CHEST_CARDS||[];var pool=all.filter(function(c){return (c.rarity||'common')===rar;});if(!pool.length)pool=all;return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;}
  function chestState(c){var s=state();if(c.period==='week')return {have:s.weekDays||0,need:c.need,claimed:!!s.weeklyClaimed,unit:'дн'};return {have:s.stars,need:c.need,claimed:!!s.claimed[c.id],unit:'⭐'};}
  function sellPrice(r){return (window.DUPLICATE_PRICES||{common:5,rare:15,epic:40,legendary:100,mythic:250})[r]||5;}
  function grant(c){
    var st=chestState(c);if(!st||st.claimed||st.have<st.need)return;var s=state();
    var stars=rint(c.stars[0],c.stars[1]),cards=[];
    c.cards.forEach(function(slot){for(var n=0;n<slot.n;n++){var card=pickCardR(pickRarity(slot.w));if(card){var had=!!((window.getUserChestCards?window.getUserChestCards():{})[card.id]);ownedCard(card);cards.push({card:card,dup:had});}}});
    if(c.period==='week')s.weeklyClaimed=true;else s.claimed[c.id]=true;
    var key='treasure-chest:'+c.id+':'+(c.period==='week'?s.weekStart:dateKey());
    if(typeof window.awardStars==='function')window.awardStars(stars,'Награда: '+c.name,key);
    if(c.units&&typeof window.addArmyUnits==='function')window.addArmyUnits(c.units);
    if(c.spins){try{localStorage.setItem('fath_bonus_spins',String((parseInt(localStorage.getItem('fath_bonus_spins')||'0',10)||0)+c.spins));}catch(e){}}
    save();render();showReward(c,{stars:stars,cards:cards});
  }
  function fmtW(w){var t=0,k;for(k in w)t+=w[k];return Object.keys(w).map(function(r){return {r:r,p:Math.round(w[r]*100/t)};});}
  function previewHtml(c){
    var st=chestState(c),ready=st.have>=st.need&&!st.claimed;
    var h='<div class="tv-pv"><div class="tv-pv-img" style="background-image:url('+c.img+')"></div><span class="tv-kicker">'+c.tag+'</span><h2>'+c.name+'</h2><p class="tv-pv-sub">'+c.sub+'</p><div class="tv-pv-prog"><span style="width:'+Math.min(100,st.have*100/st.need)+'%"></span></div><small>'+Math.min(st.have,st.need)+' / '+st.need+' '+st.unit+'</small><div class="tv-pv-list">';
    h+='<div class="tv-pv-row"><i>⭐</i><span>Звёзды</span><b>'+c.stars[0]+'–'+c.stars[1]+'</b></div>';
    if(c.units)h+='<div class="tv-pv-row"><i>⚔️</i><span>Воины для Армии</span><b>+'+c.units+'</b></div>';
    if(c.spins)h+='<div class="tv-pv-row"><i>🎡</i><span>Бесплатные прокруты колеса</span><b>+'+c.spins+'</b></div>';
    c.cards.forEach(function(slot,i){h+='<div class="tv-pv-row col"><div class="tv-pv-rh"><i>🎴</i><span>Карточка'+(c.cards.length>1?' №'+(i+1):'')+(slot.g?' · гарантия: '+slot.g:'')+'</span></div><div class="tv-pv-odds">'+fmtW(slot.w).map(function(o){return '<em style="--c:'+RC[o.r]+'"><u style="width:'+o.p+'%"></u><b>'+RN[o.r]+' '+o.p+'%</b></em>';}).join('')+'</div></div>';});
    h+='</div><p class="tv-pv-note">Повторная карточка — это дубликат: его можно продать в «Коллекции → Дубли» за звёзды.</p><div class="tv-pv-btns"><button type="button" class="tv-pv-close">Закрыть</button><button type="button" class="tv-pv-open" '+(ready?'':'disabled')+'>'+(st.claimed?'Получено':ready?'Открыть сундук':'Ещё не доступен')+'</button></div></div>';
    return h;
  }
  window.previewTreasureChest=function(id){
    var c=CHESTS.find(function(x){return x.id===id;});if(!c)return;
    var ov=document.createElement('div');ov.className='tv-reward-overlay';ov.innerHTML=previewHtml(c);document.body.appendChild(ov);
    var close=function(){ov.remove();};ov.onclick=function(e){if(e.target===ov)close();};ov.querySelector('.tv-pv-close').onclick=close;
    var ob=ov.querySelector('.tv-pv-open');ob.onclick=function(){if(ob.disabled)return;close();grant(c);};
  };
  function showReward(c,res){
    var ov=document.createElement('div');ov.className='tv-reward-overlay';
    var cardsH=res.cards.map(function(x,i){var r=x.card.rarity||'common';return '<div class="tv-rc" style="--c:'+RC[r]+';animation-delay:'+(0.25+i*0.35)+'s"><small>'+RN[r].toUpperCase()+'</small><b>'+(x.card.name||x.card.title||'Карточка')+'</b><span>'+(x.dup?'Дубль · продать за '+sellPrice(r)+' ★':'НОВАЯ КАРТОЧКА')+'</span></div>';}).join('');
    ov.innerHTML='<div class="tv-reward-box"><div class="tv-pv-img small" style="background-image:url('+c.img+')"></div><div class="tv-reward-kicker">СОКРОВИЩНИЦА</div><h2>'+c.name+' открыт!</h2><div class="tv-rc-row">'+cardsH+'</div><div class="tv-gets"><span>⭐ +'+res.stars+'</span>'+(c.units?'<span>⚔️ +'+c.units+' воинов</span>':'')+(c.spins?'<span>🎡 +'+c.spins+' прокр.</span>':'')+'</div><button type="button">Продолжить</button></div>';
    document.body.appendChild(ov);ov.querySelector('button').onclick=function(){ov.remove();};ov.onclick=function(e){if(e.target===ov)ov.remove();};
  }
  window.renderTreasureVault=function(){
    sync();updateWeekly();var s=state();if(!s)return '<div class="tv-panel">Загрузка профиля…</div>';
    var total=17,pct=Math.min(100,Math.round(s.stars/total*100));
    var html='<div class="tv-panel"><div class="tv-topline"><div><span class="tv-kicker">ЕЖЕДНЕВНЫЙ ПРОГРЕСС</span><h2>Сокровищница</h2><p>Выполняй задания — открывай сундуки. Нажми на сундук, чтобы увидеть награды.</p></div><div class="tv-counter">⭐ <b>'+s.stars+'</b><small>звёзд дня</small></div></div>';
    html+='<div class="tv-chests v51">';
    CHESTS.forEach(function(c){var st=chestState(c),ready=st.have>=st.need&&!st.claimed;
      html+='<button type="button" class="tv-chest v51 '+(ready?'unlocked ':'locked ')+(st.claimed?'claimed':'')+'" onclick="window.previewTreasureChest(\''+c.id+'\')"><span class="tv-chest-art img" style="background-image:url('+c.img+')">'+(st.claimed?'<i class="tv-ok">✓</i>':ready?'<i class="tv-glow">!</i>':'<i class="tv-lock">🔒</i>')+'</span><small class="tv-tag">'+c.tag+'</small><b>'+c.name+'</b><em>'+(st.claimed?'Получено':ready?'Открыть':Math.min(st.have,st.need)+'/'+st.need+' '+st.unit)+'</em></button>';});
    html+='</div><div class="tv-progress-head"><span>Путь к изумрудному сундуку</span><b>'+Math.min(s.stars,total)+' / '+total+' ⭐</b></div><div class="tv-progress"><span style="width:'+pct+'%"></span></div><div class="tv-quest-title">Задания на сегодня <small>Обновление каждый день</small></div><div class="tv-quests">';
    QUESTS.forEach(function(q){var done=!!s.done[q.id];html+='<button type="button" class="tv-quest '+(done?'is-done':'')+'" data-tv-module="'+(q.module||'')+'" '+(done?'disabled':'')+'><span class="tv-quest-icon">'+q.icon+'</span><span class="tv-quest-copy"><b>'+q.title+'</b><small>'+q.desc+'</small></span><strong>+'+q.stars+' ⭐</strong><i>'+(done?'✓':'›')+'</i></button>';});
    html+='</div><div class="tv-weekly"><div><span>🔥 Недельная серия → Сапфировый сундук</span><b>'+(s.weekDays||0)+' / 7 дней</b></div><div class="tv-week-progress"><span style="width:'+Math.min(100,(s.weekDays||0)/7*100)+'%"></span></div><p>'+(s.weeklyClaimed?'Недельный сундук получен':s.weekDays>=7?'Сундук доступен — нажми на него выше':'Выполняй хотя бы одно задание каждый день. За 7 дней — сапфировый сундук с редкими наградами.')+'</p></div><div class="tv-footnote">Звёзды Сокровищницы — отдельный ежедневный прогресс. Они не заменяют звёзды профиля и не оценивают духовную ценность поклонения.</div></div>';
    return html;
  };
  window.claimTreasureChest=function(id){var c=CHESTS.find(function(x){return x.id===id;});if(c)grant(c);};
  window.claimTreasureWeekly=function(){var c=CHESTS.find(function(x){return x.id==='sapphire';});if(c)grant(c);};
  window.TREASURE_CHESTS=CHESTS;

  function dateKey(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function state(){if(!window.userData)return null;var s=window.userData[KEY];if(!s||typeof s!=='object')s=window.userData[KEY]={day:'',stars:0,done:{},claimed:{},dailyZikr:0,weekStart:'',weekDays:0,lastActiveDay:'',weeklyClaimed:false,fragments:{}};var today=dateKey();if(s.day!==today){s.day=today;s.stars=0;s.done={};s.claimed={};s.dailyZikr=0;}return s;}
  function save(){if(typeof window.saveData==='function')window.saveData();}
  function salawatToday(){return parseInt(localStorage.getItem('salawat_'+dateKey())||'0',10)||0;}
  function sync(){var s=state();if(!s)return;var done=s.done||{};if(window.isDailyTaskCompleted){['quran','azkar','zikr'].forEach(function(k){var q=QUESTS.find(function(x){return x.id===k;});if(window.isDailyTaskCompleted(q.source))mark(k);});}if(salawatToday()>=100)mark('salawat');if(done.quran&&done.azkar&&done.zikr&&done.salawat)mark('daily');}
  function mark(id){var s=state();if(!s||s.done[id])return;var q=QUESTS.find(function(x){return x.id===id;});if(!q)return;s.done[id]=true;s.stars=(s.stars||0)+q.stars;save();}
  function updateWeekly(){var s=state();if(!s)return;var today=dateKey();var d=new Date();var monday=new Date(d);monday.setDate(d.getDate()-((d.getDay()+6)%7));var wk=monday.getFullYear()+'-'+String(monday.getMonth()+1).padStart(2,'0')+'-'+String(monday.getDate()).padStart(2,'0');if(s.weekStart!==wk){s.weekStart=wk;s.weekDays=0;s.weeklyClaimed=false;s.lastActiveDay='';}if(s.lastActiveDay!==today){var yesterday=new Date(Date.now()-86400000);var y=yesterday.getFullYear()+'-'+String(yesterday.getMonth()+1).padStart(2,'0')+'-'+String(yesterday.getDate()).padStart(2,'0');s.weekDays=s.lastActiveDay===y?Math.min(7,(s.weekDays||0)+1):1;s.lastActiveDay=today;save();}}
  function ownedCard(card){var cards=window.getUserChestCards?window.getUserChestCards():(window.userData.chestCards||(window.userData.chestCards={}));if(!cards[card.id])cards[card.id]={firstOpened:Date.now(),count:1};else{cards[card.id].count=(cards[card.id].count||1)+1;var s=state();s.fragments[card.id]=(s.fragments[card.id]||0)+1;}return cards;}
  function render(){var el=document.getElementById('treasureVaultContent');if(el)el.innerHTML=window.renderTreasureVault();}
  window.openTreasureVault=function(){if(typeof window.openModule==='function')window.openModule('treasure-vault');setTimeout(render,80);};
  document.addEventListener('click',function(e){var b=e.target.closest('#module-treasure-vault');if(b&&b.classList.contains('active'))render();});
  document.addEventListener('kunmusliman:daily-task-completed',function(e){var map={read_quran:'quran',read_azkar:'azkar',do_zikr:'zikr'};var id=e.detail&&e.detail.taskId;if(map[id]){mark(map[id]);sync();render();}});
  window.recordTreasureZikr=function(amount){var s=state();if(!s)return;s.dailyZikr=(s.dailyZikr||0)+Math.max(0,Number(amount)||0);if(s.dailyZikr>=33)mark('zikr');sync();render();};
  window.recordTreasureSalawat=function(){if(salawatToday()>=100)mark('salawat');sync();render();};
  document.addEventListener('click',function(e){var q=e.target.closest('.tv-quest[data-tv-module]');if(!q||q.disabled)return;var target=q.getAttribute('data-tv-module');if(target&&typeof window.openModule==='function')window.openModule(target);});
  // Салаваты также проверяются при открытии сокровищницы.
  setInterval(function(){if(window.userData){sync();render();}},15000);
  var style=document.createElement('style');style.textContent=`
  #module-treasure-vault{padding:14px 14px 100px}.tv-panel{color:var(--text-primary,inherit);background:linear-gradient(155deg,rgba(38,31,17,.98),rgba(13,17,18,.98));border:1px solid rgba(218,177,83,.35);border-radius:22px;padding:16px;box-shadow:0 14px 35px rgba(0,0,0,.18)}.tv-topline{display:flex;justify-content:space-between;gap:12px;align-items:center}.tv-kicker{font-size:10px;letter-spacing:2px;color:#d8b66a}.tv-topline h2{margin:5px 0;color:#f4dfaa;font-size:24px}.tv-topline p{margin:0;color:#b9ad94;font-size:11px;line-height:1.4}.tv-counter{min-width:70px;text-align:center;color:#f5d477;background:rgba(244,208,63,.1);border:1px solid rgba(244,208,63,.3);border-radius:14px;padding:10px}.tv-counter b{font-size:20px}.tv-counter small{display:block;font-size:9px;color:#c7b88f}.tv-chests{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:20px 0 16px}.tv-chest{min-width:0;border:1px solid rgba(210,175,100,.3);border-radius:14px;padding:9px 5px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(0,0,0,.15));color:#eee0bd;display:flex;flex-direction:column;align-items:center;gap:4px}.tv-chest:disabled{opacity:.5}.tv-chest.unlocked{border-color:#e5c66b;box-shadow:0 0 18px rgba(222,181,79,.18)}.tv-chest.claimed{border-color:#67bd8e;opacity:.72}.tv-chest-art svg{width:100%;max-width:90px;height:65px;filter:drop-shadow(0 5px 5px #0008)}.tv-chest b{font-size:10px;text-align:center}.tv-chest small{font-size:11px;color:#e7c56d}.tv-chest em{font-style:normal;font-size:9px;color:#b6d7b8}.tv-progress-head{display:flex;justify-content:space-between;font-size:11px;color:#d8c99f;margin-bottom:7px}.tv-progress{height:10px;background:#15140f;border:1px solid rgba(230,197,112,.3);border-radius:20px;overflow:hidden}.tv-progress span,.tv-week-progress span{display:block;height:100%;background:linear-gradient(90deg,#9b6b20,#f6d66e,#fff0a8);border-radius:20px;transition:width .4s}.tv-quest-title{font-size:15px;font-weight:700;color:#f1dfb5;margin:22px 0 10px}.tv-quest-title small{display:block;font-size:10px;color:#a99d83;font-weight:400;margin-top:3px}.tv-quests{display:grid;gap:7px}.tv-quest{width:100%;text-align:left;display:grid;grid-template-columns:30px 1fr auto 18px;gap:8px;align-items:center;padding:10px;border:1px solid rgba(218,177,83,.18);border-radius:12px;background:rgba(255,255,255,.035);color:inherit;cursor:pointer}.tv-quest:disabled{cursor:default;opacity:.78}.tv-quest-copy{min-width:0}.tv-quest.is-done{border-color:rgba(103,189,142,.4);background:rgba(60,130,86,.1)}.tv-quest-icon{font-size:21px}.tv-quest b{display:block;font-size:11px;color:#eee0c4}.tv-quest small{display:block;font-size:9px;line-height:1.35;color:#a99f8c;margin-top:3px}.tv-quest strong{font-size:10px;color:#e9c66c;white-space:nowrap}.tv-quest i{font-style:normal;color:#70d49a;font-weight:bold}.tv-weekly{margin-top:18px;padding:13px;border:1px solid rgba(218,177,83,.25);border-radius:14px;background:rgba(0,0,0,.18)}.tv-weekly>div:first-child{display:flex;justify-content:space-between;font-size:11px;color:#e8d6a8}.tv-week-progress{height:6px;background:#29251b;border-radius:10px;margin:10px 0;overflow:hidden}.tv-weekly p,.tv-footnote{font-size:10px;line-height:1.5;color:#a99f8c}.tv-weekly button{width:100%;border:1px solid #d5b45d;border-radius:10px;padding:10px;background:linear-gradient(180deg,#d9b95f,#987126);color:#201707;font-weight:700}.tv-weekly button:disabled{opacity:.4}.tv-footnote{margin-top:12px}.tv-reward-overlay{position:fixed;inset:0;z-index:1000000;background:rgba(0,0,0,.86);display:flex;align-items:center;justify-content:center;padding:20px;animation:tvFade .25s}.tv-reward-box{width:100%;max-width:340px;text-align:center;padding:25px 20px;border:1px solid #e5c66b;border-radius:22px;background:radial-gradient(circle at 50% 0%,#5c431b,#17140e 65%);color:#f5e6bf;box-shadow:0 0 50px #d6a83c33}.tv-reward-glow{font-size:54px;animation:tvPulse 1.2s infinite alternate}.tv-reward-kicker{font-size:10px;letter-spacing:3px;color:#e5c66b}.tv-reward-box h2{font-size:21px}.tv-reward-card{padding:18px;margin:16px 0;border:1px solid #b68b3d;border-radius:14px;background:#ffffff0b}.tv-card-rarity{font-size:10px;letter-spacing:2px;color:#eacb76}.tv-card-name{font-size:18px;margin:8px 0}.tv-card-type{font-size:10px;color:#b8aa8b}.tv-reward-box p{color:#e8c96f}.tv-reward-box button{border:0;border-radius:20px;padding:12px 35px;background:linear-gradient(#f2d47c,#a97a25);font-weight:700;color:#211606}@keyframes tvFade{from{opacity:0}to{opacity:1}}@keyframes tvPulse{to{transform:scale(1.08);filter:drop-shadow(0 0 12px #ffdc70)}}
  @media(prefers-reduced-motion:reduce){.tv-reward-glow{animation:none}.tv-progress span{transition:none}}
  `;document.head.appendChild(style);
})();
