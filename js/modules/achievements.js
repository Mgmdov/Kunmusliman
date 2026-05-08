// ========== ДОСТИЖЕНИЯ v2 — ПРЕМИУМ ==========
(function(){
var ACHIEVEMENTS=[
  {id:'cards_10',icon:'🃏',name:'Начинающий коллекционер',desc:'Собрать 10 карт',check:function(){return getCardsCount()>=10;},reward:1000},
  {id:'cards_20',icon:'🎴',name:'Опытный коллекционер',desc:'Собрать 20 карт',check:function(){return getCardsCount()>=20;},reward:2000},
  {id:'cards_30',icon:'🏅',name:'Мастер карт',desc:'Собрать 30 карт',check:function(){return getCardsCount()>=30;},reward:2500},
  {id:'cards_50',icon:'👑',name:'Величайший коллекционер',desc:'Собрать 50 карт',check:function(){return getCardsCount()>=50;},reward:5000},
  {id:'cards_65',icon:'💎',name:'Полная коллекция',desc:'Собрать все 65 карт',check:function(){return getCardsCount()>=65;},reward:10000},
  {id:'khatm_1',icon:'📖',name:'Первый хатм',desc:'Завершить 1 хатм',check:function(){return getKhatms()>=1;},reward:500},
  {id:'khatm_3',icon:'📚',name:'Три хатма',desc:'Завершить 3 хатма',check:function(){return getKhatms()>=3;},reward:1500},
  {id:'khatm_10',icon:'🕋',name:'Десять хатмов',desc:'Завершить 10 хатмов',check:function(){return getKhatms()>=10;},reward:5000},
  {id:'streak_7',icon:'🔥',name:'Неделя подряд',desc:'7 дней серия входа',check:function(){return getStreak()>=7;},reward:200},
  {id:'streak_30',icon:'⚡',name:'Месяц подряд',desc:'30 дней серия входа',check:function(){return getStreak()>=30;},reward:2000},
  {id:'battles_12',icon:'⚔️',name:'Историк битв',desc:'Прочитать все 12 битв',check:function(){try{return Object.keys(JSON.parse(localStorage.getItem('battles_read')||'{}')).length>=12;}catch(e){return false;}},reward:1500},
  {id:'level_10',icon:'⭐',name:'Уровень 10',desc:'Достичь 10 уровня',check:function(){return(window.userData||{}).level>=10;},reward:1000},
  {id:'level_25',icon:'🌟',name:'Уровень 25',desc:'Достичь 25 уровня',check:function(){return(window.userData||{}).level>=25;},reward:3000}
];

function getCardsCount(){var ud=window.userData||{};return ud.chestCards?Object.keys(ud.chestCards).length:0;}
function getKhatms(){return((window.userData||{}).khatm||{}).completedKhatms||0;}
function getStreak(){return((window.userData||{}).streakData||{}).streak||0;}
function getClaimed(){try{return JSON.parse(localStorage.getItem('achievements_claimed')||'{}');}catch(e){return {};}}
function setClaimed(id){var c=getClaimed();c[id]=Date.now();localStorage.setItem('achievements_claimed',JSON.stringify(c));}

function injectAchievements(){
  var el=document.getElementById('achievementsContent');if(!el)return;
  var claimed=getClaimed();
  var total=ACHIEVEMENTS.length;
  var done=ACHIEVEMENTS.filter(function(a){return a.check()||claimed[a.id];}).length;

  var h='';
  h+='<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><div style="font-size:14px;color:rgba(128,128,128,0.5);">'+done+' / '+total+' достижений</div><div style="flex:1;height:4px;background:rgba(255,255,255,0.06);border-radius:2px;"><div style="width:'+Math.round(done*100/total)+'%;height:100%;background:#f4d03f;border-radius:2px;"></div></div></div>';

  ACHIEVEMENTS.forEach(function(ach){
    var unlocked=ach.check();
    var isClaimed=!!claimed[ach.id];
    h+='<div style="display:flex;align-items:center;gap:12px;padding:14px;background:'+(isClaimed?'rgba(93,202,165,0.04)':unlocked?'rgba(244,208,63,0.04)':'rgba(255,255,255,0.02)')+';border:1px solid '+(isClaimed?'rgba(93,202,165,0.1)':unlocked?'rgba(244,208,63,0.1)':'rgba(255,255,255,0.04)')+';border-radius:14px;margin-bottom:6px;">';
    h+='<div style="font-size:28px;width:40px;text-align:center;'+((!unlocked&&!isClaimed)?'filter:grayscale(1);opacity:0.3;':'')+'">'+ach.icon+'</div>';
    h+='<div style="flex:1;"><div style="font-size:14px;font-weight:500;color:'+(isClaimed?'#5dcaa5':unlocked?'#f4d03f':'rgba(128,128,128,0.4)')+';">'+ach.name+'</div><div style="font-size:11px;color:rgba(128,128,128,0.4);">'+ach.desc+'</div></div>';
    if(isClaimed){
      h+='<div style="font-size:12px;color:#5dcaa5;">✓</div>';
    }else if(unlocked){
      h+='<button onclick="window._achClaim(\''+ach.id+'\','+ach.reward+')" style="padding:8px 14px;background:rgba(244,208,63,0.12);border:1px solid rgba(244,208,63,0.25);border-radius:10px;color:#f4d03f;font-size:12px;cursor:pointer;">+'+ach.reward+' ★</button>';
    }else{
      h+='<div style="font-size:12px;color:rgba(128,128,128,0.25);">🔒</div>';
    }
    h+='</div>';
  });
  el.innerHTML=h;
}

window._achClaim=function(id,reward){
  setClaimed(id);
  if(window.userData){
    var s=window.userData.stars||{totalStars:0};
    s.totalStars=(parseInt(s.totalStars)||0)+reward;
    window.userData.stars=s;
    if(typeof window.updateStarsDisplay==='function')window.updateStarsDisplay();
    if(typeof window.saveData==='function')window.saveData();
  }
  injectAchievements();
};

window.renderAchievements=injectAchievements;
setTimeout(injectAchievements,3000);
setTimeout(injectAchievements,7000);
console.log('🏆 Достижения v2');
})();
