// ========== РЕЙТИНГ ==========
(function(){
var COL='leaderboard';
var TABS=[{k:'xp',l:'По XP',s:' XP'},{k:'stars',l:'Звёзды',s:' ★'},{k:'khatms',l:'Хатмы',s:''},{k:'streak',l:'Серия',s:' дн'}];
var curTab='xp';

var origSave=window.saveData;
window.saveData=function(){if(typeof origSave==='function')origSave();updateLB();};

function updateLB(){
  var db=window._db,u=window._currentUser,ud=window.userData;
  if(!db||!u||!ud||u.isAnonymous)return;
  try{db.collection(COL).doc(u.uid).set({
    name:ud.nickname||u.displayName||u.email||'Мусульманин',
    xp:ud.xp||0,stars:((ud.stars||{}).totalStars)||0,
    khatms:((ud.khatm||{}).completedKhatms)||0,
    streak:((ud.streakData||{}).streak)||0,
    level:ud.level||1,ts:firebase.firestore.FieldValue.serverTimestamp()
  },{merge:true});}catch(e){}
}

window.openLeaderboard=function(){
  var ex=document.getElementById('lbOverlay');if(ex)ex.remove();
  var o=document.createElement('div');o.id='lbOverlay';
  o.style.cssText='position:fixed;inset:0;z-index:999997;background:#000;overflow-y:auto;-webkit-overflow-scrolling:touch;opacity:0;transition:opacity .3s;';
  o.innerHTML='<div style="padding:16px 16px 80px;max-width:600px;margin:0 auto;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><button onclick="document.getElementById(\'lbOverlay\').style.opacity=0;setTimeout(function(){document.getElementById(\'lbOverlay\').remove();},300);" style="background:none;border:none;color:#007AFF;font-size:15px;cursor:pointer;">← Назад</button><h2 style="margin:0;font-size:18px;color:#e8dcc8;">Рейтинг</h2><div style="width:50px;"></div></div><div id="lbTabs" style="display:flex;gap:4px;margin-bottom:16px;background:rgba(255,255,255,0.04);border-radius:10px;padding:3px;"></div><div id="lbContent"></div></div>';
  document.body.appendChild(o);
  requestAnimationFrame(function(){o.style.opacity='1';});
  var tabsEl=document.getElementById('lbTabs');
  TABS.forEach(function(t){
    var b=document.createElement('button');b.textContent=t.l;
    b.style.cssText='flex:1;padding:8px;text-align:center;border:none;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;'+(t.k===curTab?'background:rgba(90,138,207,0.15);color:#5a8acf;':'background:transparent;color:rgba(255,255,255,0.4);');
    b.onclick=function(){curTab=t.k;loadLB(t.k);tabsEl.querySelectorAll('button').forEach(function(x){x.style.background='transparent';x.style.color='rgba(255,255,255,0.4)';});b.style.background='rgba(90,138,207,0.15)';b.style.color='#5a8acf';};
    tabsEl.appendChild(b);
  });
  loadLB('xp');
};

function loadLB(field){
  var db=window._db,c=document.getElementById('lbContent');
  if(!db){if(c)c.innerHTML='<div style="text-align:center;padding:40px;color:#666;">Войдите в аккаунт</div>';return;}
  if(c)c.innerHTML='<div style="text-align:center;padding:40px;color:#666;">Загрузка...</div>';
  db.collection(COL).orderBy(field,'desc').limit(50).get().then(function(snap){
    var items=[];snap.forEach(function(d){var data={id:d.id,...d.data()};if(!data.hidden)items.push(data);});
    renderLB(c,items,field);
  }).catch(function(e){if(c)c.innerHTML='<div style="text-align:center;padding:40px;color:#666;">'+e.message+'</div>';});
}

function renderLB(c,items,field){
  if(!c)return;
  var sf=TABS.find(function(t){return t.k===field;})||TABS[0];
  if(!items.length){c.innerHTML='<div style="text-align:center;padding:40px;color:#666;">Пока пусто</div>';return;}
  var uid=(window._currentUser||{}).uid||'';
  var h='';var medals=['','🥇','🥈','🥉'];
  items.forEach(function(it,i){
    var r=i+1,me=it.id===uid,v=(it[field]||0)+sf.s;
    var bg=me?'rgba(93,202,165,0.08)':r<=3?'rgba(244,208,63,0.04)':'rgba(255,255,255,0.02)';
    h+='<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:'+bg+';border-radius:12px;margin-bottom:3px;"><div style="width:24px;text-align:center;font-size:'+(r<=3?16:13)+'px;color:'+(me?'#5dcaa5':'rgba(255,255,255,0.3)')+';">'+(r<=3?medals[r]:r)+'</div><div style="width:32px;height:32px;border-radius:50%;background:'+(me?'#5dcaa5':r<=3?'#d4a937':'rgba(255,255,255,0.1)')+';display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:500;">'+(it.name||'?').charAt(0)+'</div><div style="flex:1;font-size:14px;color:'+(me?'#5dcaa5':'#e8dcc8')+';">'+(me?'Ты':it.name)+'</div><div style="font-size:14px;font-weight:500;color:'+(me?'#5dcaa5':r<=3?'#f4d03f':'rgba(255,255,255,0.4)')+';">'+v+'</div></div>';
  });
  c.innerHTML=h;
}
setTimeout(updateLB,5000);
console.log('🏆 Рейтинг');
})();
