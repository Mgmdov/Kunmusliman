// ========== ДРУЗЬЯ v2 — ПОИСК ПО НИКУ ==========
(function(){
var FR='friends',REQ='friend_requests';
window.openFriends=function(){
  var ex=document.getElementById('friendsOverlay');if(ex)ex.remove();
  var o=document.createElement('div');o.id='friendsOverlay';
  o.style.cssText='position:fixed;inset:0;z-index:999997;background:#000;overflow-y:auto;-webkit-overflow-scrolling:touch;opacity:0;transition:opacity .3s;';
  o.innerHTML='<div style="padding:16px 16px 80px;max-width:600px;margin:0 auto;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><button onclick="document.getElementById(\'friendsOverlay\').style.opacity=0;setTimeout(function(){document.getElementById(\'friendsOverlay\').remove();},300);" style="background:none;border:none;color:#007AFF;font-size:15px;cursor:pointer;">← Назад</button><h2 style="margin:0;font-size:18px;color:#e8dcc8;">Друзья</h2><div style="width:50px;"></div></div>'+
  '<div style="margin-bottom:16px;"><input type="text" id="frSearchInput" placeholder="Никнейм или ID друга" style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#e8dcc8;font-size:14px;box-sizing:border-box;"><div style="display:flex;gap:8px;margin-top:8px;"><button onclick="window._frSearch()" style="flex:1;padding:10px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.25);border-radius:10px;color:#5a8acf;font-size:13px;cursor:pointer;">Найти</button><button onclick="window._frShare()" style="flex:1;padding:10px;background:rgba(93,202,165,0.15);border:1px solid rgba(93,202,165,0.25);border-radius:10px;color:#5dcaa5;font-size:13px;cursor:pointer;">Поделиться моим ID</button></div></div>'+
  '<div id="frSearchResult"></div><div id="frRequests"></div><div id="frList"><div style="text-align:center;padding:30px;color:#666;">Загрузка...</div></div></div>';
  document.body.appendChild(o);requestAnimationFrame(function(){o.style.opacity='1';});loadReq();loadFr();
};

// Поиск по нику или ID
window._frSearch=function(){
  var q=(document.getElementById('frSearchInput')||{}).value;if(!q||!q.trim())return;q=q.trim();
  var db=window._db,me=window._currentUser,el=document.getElementById('frSearchResult');
  if(!db||!me||!el)return;
  el.innerHTML='<div style="padding:12px;color:#666;text-align:center;">Поиск...</div>';
  // Сначала пробуем как ID
  db.collection('leaderboard').doc(q).get().then(function(doc){
    if(doc.exists){showSearchResult(el,[{id:doc.id,...doc.data()}]);return;}
    // Ищем по имени
    return db.collection('leaderboard').where('name','==',q).limit(10).get().then(function(snap){
      var results=[];snap.forEach(function(d){results.push({id:d.id,...d.data()});});
      showSearchResult(el,results);
    });
  }).catch(function(e){el.innerHTML='<div style="padding:12px;color:#666;">Ошибка: '+e.message+'</div>';});
};

function showSearchResult(el,results){
  var uid=(window._currentUser||{}).uid;
  results=results.filter(function(r){return r.id!==uid;});
  if(!results.length){el.innerHTML='<div style="padding:12px;color:#666;text-align:center;">Не найдено</div>';return;}
  var h='';results.forEach(function(r){
    h+='<div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,0.03);border-radius:12px;margin-bottom:4px;"><div style="font-size:20px;">'+(r.avatar||'👤')+'</div><div style="flex:1;"><div style="font-size:14px;color:#e8dcc8;">'+r.name+'</div><div style="font-size:11px;color:rgba(255,255,255,0.35);">Ур. '+(r.level||1)+' · '+(r.xp||0)+' XP</div></div><button onclick="window._frSendReq(\''+r.id+'\')" style="padding:8px 14px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.25);border-radius:10px;color:#5a8acf;font-size:12px;cursor:pointer;">Добавить</button></div>';
  });
  el.innerHTML=h;
}

window._frSendReq=function(uid){
  var db=window._db,me=window._currentUser;if(!db||!me)return;
  var ud=window.userData||{};var myName=ud.nickname||me.displayName||'Мусульманин';var myAvatar=ud.avatar||'👤';
  db.collection('users').doc(uid).collection(REQ).doc(me.uid).set({from:me.uid,name:myName,avatar:myAvatar,ts:firebase.firestore.FieldValue.serverTimestamp(),status:'pending'}).then(function(){alert('Запрос отправлен!');}).catch(function(e){alert(e.message);});
};

window._frShare=function(){var me=window._currentUser;if(!me||me.isAnonymous){alert('Войдите');return;}var ud=window.userData||{};var nick=ud.nickname||me.displayName||'';var text='Добавь меня в Muslim Tracker!\nНик: '+nick+'\nID: '+me.uid;if(navigator.share)navigator.share({title:'Muslim Tracker',text:text}).catch(function(){});else{try{navigator.clipboard.writeText(me.uid);alert('ID скопирован: '+me.uid);}catch(e){prompt('ID:',me.uid);}}};

function loadReq(){var db=window._db,me=window._currentUser,el=document.getElementById('frRequests');if(!db||!me||!el)return;db.collection('users').doc(me.uid).collection(REQ).where('status','==','pending').get().then(function(snap){if(snap.empty){el.innerHTML='';return;}var h='<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;">Запросы</div>';snap.forEach(function(doc){var d=doc.data();h+='<div style="padding:12px;background:rgba(244,208,63,0.06);border:1px dashed rgba(244,208,63,0.2);border-radius:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;"><div style="font-size:20px;">'+(d.avatar||'👤')+'</div><div style="flex:1;font-size:14px;color:#f4d03f;">'+d.name+'</div><button onclick="window._frAccept(\''+doc.id+'\')" style="padding:6px 12px;background:rgba(93,202,165,0.15);border:1px solid rgba(93,202,165,0.3);border-radius:8px;color:#5dcaa5;font-size:12px;cursor:pointer;">Принять</button><button onclick="window._frDecline(\''+doc.id+'\')" style="padding:6px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:rgba(255,255,255,0.3);font-size:12px;cursor:pointer;">✕</button></div>';});el.innerHTML=h;}).catch(function(){});}
window._frAccept=function(uid){var db=window._db,me=window._currentUser;if(!db||!me)return;var b=db.batch();b.set(db.collection('users').doc(me.uid).collection(FR).doc(uid),{uid:uid,ts:firebase.firestore.FieldValue.serverTimestamp()});b.set(db.collection('users').doc(uid).collection(FR).doc(me.uid),{uid:me.uid,ts:firebase.firestore.FieldValue.serverTimestamp()});b.delete(db.collection('users').doc(me.uid).collection(REQ).doc(uid));b.commit().then(function(){loadReq();loadFr();});};
window._frDecline=function(uid){var db=window._db,me=window._currentUser;if(!db||!me)return;db.collection('users').doc(me.uid).collection(REQ).doc(uid).delete().then(function(){loadReq();});};

function loadFr(){var db=window._db,me=window._currentUser,el=document.getElementById('frList');if(!db||!me||!el){if(el)el.innerHTML='<div style="text-align:center;padding:30px;color:#666;">Войдите в аккаунт</div>';return;}db.collection('users').doc(me.uid).collection(FR).get().then(function(snap){if(snap.empty){el.innerHTML='<div style="text-align:center;padding:30px;color:#666;">Пока нет друзей</div>';return;}var ps=[];snap.forEach(function(doc){ps.push(db.collection('leaderboard').doc(doc.id).get().then(function(ld){return ld.exists?{uid:doc.id,...ld.data()}:{uid:doc.id,name:'Друг'};}));});return Promise.all(ps);}).then(function(fr){if(!fr||!fr.length)return;var h='<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;">Друзья ('+fr.length+')</div>';fr.forEach(function(f){h+='<div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,0.03);border-radius:12px;margin-bottom:4px;"><div style="font-size:20px;">'+(f.avatar||'👤')+'</div><div style="flex:1;"><div style="font-size:14px;color:#e8dcc8;">'+f.name+'</div><div style="font-size:11px;color:rgba(255,255,255,0.35);">Ур. '+(f.level||1)+' · '+(f.xp||0)+' XP · 🔥'+(f.streak||0)+'</div></div></div>';});el.innerHTML=h;}).catch(function(e){if(el)el.innerHTML='<div style="text-align:center;padding:20px;color:#666;">'+e.message+'</div>';});}
console.log('👥 Друзья v2');
})();
