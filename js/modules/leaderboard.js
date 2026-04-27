// ========== РЕЙТИНГ v4 — ПЬЕДЕСТАЛ ==========
(function(){
var COL='leaderboard';
var TABS=[{k:'xp',l:'По XP',s:' XP'},{k:'stars',l:'Звёзды',s:' ★'},{k:'khatms',l:'Хатмы',s:''},{k:'streak',l:'Серия',s:' дн'},{k:'cards',l:'Карты',s:''}];
var curTab='xp';
var origSave=window.saveData;
window.saveData=function(){if(typeof origSave==='function')origSave();updLB();};
function updLB(){var db=window._db,u=window._currentUser,ud=window.userData;if(!db||!u||!ud||u.isAnonymous)return;var cc=ud.chestCards?Object.keys(ud.chestCards).length:0;try{db.collection(COL).doc(u.uid).set({name:ud.nickname||u.displayName||u.email||'Мусульманин',avatar:ud.avatar||'👤',xp:ud.xp||0,stars:((ud.stars||{}).totalStars)||0,khatms:((ud.khatm||{}).completedKhatms)||0,streak:((ud.streakData||{}).streak)||0,level:ud.level||1,cards:cc,hidden:!!ud.hideFromLeaderboard,ts:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}catch(e){}}

window.openLeaderboard=function(){
  var ex=document.getElementById('lbOverlay');if(ex)ex.remove();
  var o=document.createElement('div');o.id='lbOverlay';o.className='fullscreen-overlay';
  o.innerHTML='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'lbOverlay\').remove();">← Назад</button><span class="overlay-title">Рейтинг</span><span style="width:60px;"></span></div><div class="overlay-body"><div style="text-align:center;margin-bottom:12px;"><div style="font-family:Amiri,serif;font-size:20px;color:inherit;">تَصْنِيف</div></div><div style="margin-bottom:12px;display:flex;gap:8px;"><input type="text" id="lbSearch" placeholder="Поиск по нику..." style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid rgba(128,128,128,0.15);background:rgba(128,128,128,0.06);font-size:14px;color:inherit;"><button onclick="window._lbSrch()" style="padding:10px 16px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.2);border-radius:10px;color:#5a8acf;font-size:13px;cursor:pointer;">Найти</button></div><div id="lbTabs" style="display:flex;gap:3px;margin-bottom:16px;background:rgba(128,128,128,0.06);border-radius:10px;padding:3px;"></div><div id="lbContent"></div></div>';
  document.body.appendChild(o);
  var te=document.getElementById('lbTabs');
  TABS.forEach(function(t){var b=document.createElement('button');b.textContent=t.l;b.style.cssText='flex:1;padding:8px;text-align:center;border:none;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;background:'+(t.k===curTab?'rgba(90,138,207,0.15)':'transparent')+';color:'+(t.k===curTab?'#5a8acf':'rgba(128,128,128,0.5)')+';';b.onclick=function(){curTab=t.k;loadLB(t.k);te.querySelectorAll('button').forEach(function(x){x.style.background='transparent';x.style.color='rgba(128,128,128,0.5)';});b.style.background='rgba(90,138,207,0.15)';b.style.color='#5a8acf';};te.appendChild(b);});
  loadLB('xp');
};

window._lbSrch=function(){var q=(document.getElementById('lbSearch')||{}).value;if(!q)return;var db=window._db,c=document.getElementById('lbContent');if(!db||!c)return;db.collection(COL).where('name','==',q.trim()).limit(10).get().then(function(snap){var it=[];snap.forEach(function(d){var x={id:d.id,...d.data()};if(!x.hidden)it.push(x);});renderLB(c,it,'xp');}).catch(function(){});};

function loadLB(field){var db=window._db,c=document.getElementById('lbContent');if(!db){if(c)c.innerHTML='<div style="text-align:center;padding:40px;color:#888;">Войдите</div>';return;}if(c)c.innerHTML='<div style="text-align:center;padding:40px;color:#888;">Загрузка...</div>';db.collection(COL).orderBy(field,'desc').limit(50).get().then(function(snap){var it=[];snap.forEach(function(d){var x={id:d.id,...d.data()};if(!x.hidden)it.push(x);});renderLB(c,it,field);}).catch(function(e){if(c)c.innerHTML='<div style="padding:40px;color:#888;text-align:center;">'+e.message+'</div>';});}

function renderLB(c,items,field){
  if(!c)return;var sf=TABS.find(function(t){return t.k===field;})||TABS[0];
  if(!items.length){c.innerHTML='<div style="text-align:center;padding:40px;color:#888;">Пока пусто</div>';return;}
  var uid=(window._currentUser||{}).uid||'';var h='';
  // ПЬЕДЕСТАЛ для топ-3
  if(items.length>=3){
    var t1=items[0],t2=items[1],t3=items[2];
    h+='<div style="display:flex;justify-content:center;align-items:flex-end;gap:12px;margin-bottom:20px;padding:0 8px;">';
    // 2 место (слева)
    h+='<div style="text-align:center;flex:1;"><div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#9aa8b8,#6a7888);display:flex;align-items:center;justify-content:center;font-size:20px;margin:0 auto 6px;border:2px solid #9aa8b8;">'+(t2.avatar||'👤')+'</div><div style="font-size:12px;color:#9aa8b8;font-weight:500;">'+t2.name+'</div><div style="font-size:18px;font-weight:500;color:#9aa8b8;">'+(t2[field]||0)+'</div><div style="background:#9aa8b8;color:#060a14;font-size:11px;font-weight:500;padding:3px 10px;border-radius:8px;margin-top:4px;display:inline-block;">2</div></div>';
    // 1 место (центр, больше)
    h+='<div style="text-align:center;flex:1;"><div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#f4d03f,#d4a937);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 6px;border:3px solid #f4d03f;box-shadow:0 0 20px rgba(244,208,63,0.3);">'+(t1.avatar||'👤')+'</div><div style="font-size:14px;color:#f4d03f;font-weight:500;">'+t1.name+'</div><div style="font-size:22px;font-weight:500;color:#f4d03f;">'+(t1[field]||0)+'</div><div style="background:#f4d03f;color:#060a14;font-size:12px;font-weight:600;padding:4px 12px;border-radius:8px;margin-top:4px;display:inline-block;">1</div></div>';
    // 3 место (справа)
    h+='<div style="text-align:center;flex:1;"><div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#8B5A2B,#4A2E14);display:flex;align-items:center;justify-content:center;font-size:20px;margin:0 auto 6px;border:2px solid #8B5A2B;">'+(t3.avatar||'👤')+'</div><div style="font-size:12px;color:#c09060;font-weight:500;">'+t3.name+'</div><div style="font-size:18px;font-weight:500;color:#c09060;">'+(t3[field]||0)+'</div><div style="background:#8B5A2B;color:#fff;font-size:11px;font-weight:500;padding:3px 10px;border-radius:8px;margin-top:4px;display:inline-block;">3</div></div>';
    h+='</div>';
  }
  // Остальные (с 4-го)
  var start=items.length>=3?3:0;
  for(var i=start;i<items.length;i++){
    var it=items[i],r=i+1,me=it.id===uid;
    h+='<div onclick="window._lbProfile(\''+it.id+'\')" style="display:flex;align-items:center;gap:10px;padding:11px 12px;background:'+(me?'rgba(93,202,165,0.06)':'rgba(128,128,128,0.03)')+';border-radius:12px;margin-bottom:3px;cursor:pointer;"><div style="width:22px;text-align:center;font-size:13px;color:'+(me?'#5dcaa5':'rgba(128,128,128,0.3)')+';">'+r+'</div><div style="font-size:18px;">'+(it.avatar||'👤')+'</div><div style="flex:1;font-size:14px;color:'+(me?'#5dcaa5':'inherit')+';">'+(me?'Ты':it.name)+'</div><div style="font-size:13px;font-weight:500;color:'+(me?'#5dcaa5':'rgba(128,128,128,0.4)')+';">'+(it[field]||0)+sf.s+'</div></div>';
  }
  // Моя позиция если не в топе
  if(!items.some(function(x){return x.id===uid;})&&uid){
    var ud=window.userData||{};var mv=field==='xp'?(ud.xp||0):field==='stars'?((ud.stars||{}).totalStars||0):field==='khatms'?((ud.khatm||{}).completedKhatms||0):field==='streak'?((ud.streakData||{}).streak||0):(ud.chestCards?Object.keys(ud.chestCards).length:0);
    h+='<div style="margin-top:12px;padding:12px;background:rgba(93,202,165,0.06);border:1px solid rgba(93,202,165,0.12);border-radius:12px;display:flex;align-items:center;gap:10px;"><div style="width:22px;text-align:center;color:#5dcaa5;">—</div><div style="font-size:18px;">'+(ud.avatar||'👤')+'</div><div style="flex:1;font-size:14px;color:#5dcaa5;font-weight:500;">Ты</div><div style="font-size:13px;font-weight:500;color:#5dcaa5;">'+mv+sf.s+'</div></div>';
  }
  c.innerHTML=h;
}

window._lbProfile=function(uid){var db=window._db;if(!db)return;db.collection(COL).doc(uid).get().then(function(doc){if(!doc.exists)return;var d=doc.data();var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';o.onclick=function(e){if(e.target===o)o.remove();};o.innerHTML='<div style="background:#0a0e1a;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px;max-width:320px;width:100%;text-align:center;"><div style="font-size:48px;margin-bottom:8px;">'+(d.avatar||'👤')+'</div><div style="font-size:20px;font-weight:500;color:#e8dcc8;margin-bottom:4px;">'+d.name+'</div><div style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:16px;">Ур. '+(d.level||1)+'</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;"><div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:12px;"><div style="font-size:18px;font-weight:500;color:#5a8acf;">'+(d.xp||0)+'</div><div style="font-size:10px;color:rgba(255,255,255,0.3);">XP</div></div><div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:12px;"><div style="font-size:18px;font-weight:500;color:#f4d03f;">'+(d.stars||0)+'</div><div style="font-size:10px;color:rgba(255,255,255,0.3);">Звёзды</div></div><div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:12px;"><div style="font-size:18px;font-weight:500;color:#5dcaa5;">'+(d.khatms||0)+'</div><div style="font-size:10px;color:rgba(255,255,255,0.3);">Хатмы</div></div><div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:12px;"><div style="font-size:18px;font-weight:500;color:#D85A30;">🔥 '+(d.streak||0)+'</div><div style="font-size:10px;color:rgba(255,255,255,0.3);">Серия</div></div></div><div style="background:rgba(168,120,216,0.08);border:1px solid rgba(168,120,216,0.15);border-radius:12px;padding:12px;margin-bottom:16px;"><div style="font-size:16px;font-weight:500;color:#a878d8;">'+(d.cards||0)+' / 65</div><div style="font-size:10px;color:rgba(255,255,255,0.3);">Карт собрано</div></div><button onclick="this.parentElement.parentElement.remove();" style="padding:10px 28px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:#e8dcc8;font-size:14px;cursor:pointer;">Закрыть</button></div>';document.body.appendChild(o);});};
setTimeout(updLB,5000);
console.log('🏆 Рейтинг v4 (пьедестал)');
})();
