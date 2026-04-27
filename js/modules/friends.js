// ========== ДРУЗЬЯ v4 — ТОЧНО КАК НА МОКАПЕ ==========
(function(){
var FR='friends',REQ='friend_requests';
window.openFriends=function(){
  var ex=document.getElementById('friendsOverlay');if(ex)ex.remove();
  var o=document.createElement('div');o.id='friendsOverlay';o.className='fullscreen-overlay';
  o.innerHTML='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'friendsOverlay\').remove();">← Назад</button><span class="overlay-title">Друзья</span><span style="width:60px;"></span></div><div class="overlay-body">'+
  '<div style="text-align:center;margin-bottom:16px;"><div style="font-family:Amiri,serif;font-size:20px;color:inherit;">أَصْدِقَاء</div><div style="font-size:11px;color:rgba(128,128,128,0.5);" id="frOnlineCount">Друзья</div></div>'+
  '<div style="margin-bottom:16px;"><div style="display:flex;gap:8px;"><input type="text" id="frSearchInput" placeholder="Никнейм или ID" style="flex:1;padding:12px 14px;border-radius:12px;border:1px solid rgba(128,128,128,0.15);background:rgba(128,128,128,0.06);font-size:14px;color:inherit;"><button onclick="window._frSearch()" style="padding:12px 16px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.2);border-radius:12px;color:#5a8acf;font-size:14px;cursor:pointer;">Найти</button></div><div style="display:flex;gap:8px;margin-top:8px;"><button onclick="window._frShare()" style="flex:1;padding:10px;background:rgba(93,202,165,0.1);border:1px solid rgba(93,202,165,0.2);border-radius:10px;color:#5dcaa5;font-size:12px;cursor:pointer;">Поделиться ID</button><button onclick="window._frInvLink()" style="flex:1;padding:10px;background:rgba(244,208,63,0.08);border:1px solid rgba(244,208,63,0.15);border-radius:10px;color:#f4d03f;font-size:12px;cursor:pointer;">Пригласить</button></div></div>'+
  '<div id="frSR"></div><div id="frReq"></div><div id="frList"><div style="text-align:center;padding:30px;color:#888;">Загрузка...</div></div></div>';
  document.body.appendChild(o);loadReq();loadFr();
};

window._frSearch=function(){var q=(document.getElementById('frSearchInput')||{}).value;if(!q)return;q=q.trim();var db=window._db,el=document.getElementById('frSR');if(!db||!el)return;el.innerHTML='<div style="padding:12px;color:#888;text-align:center;">Поиск...</div>';db.collection('leaderboard').where('name','==',q).limit(10).get().then(function(snap){var r=[];snap.forEach(function(d){r.push({id:d.id,...d.data()});});if(!r.length)return db.collection('leaderboard').doc(q).get().then(function(doc){if(doc.exists)showSR(el,[{id:doc.id,...doc.data()}]);else el.innerHTML='<div style="padding:12px;color:#888;text-align:center;">Не найдено</div>';});showSR(el,r);}).catch(function(){el.innerHTML='';});};

function showSR(el,res){var uid=(window._currentUser||{}).uid;res=res.filter(function(r){return r.id!==uid;});if(!res.length){el.innerHTML='<div style="padding:12px;color:#888;text-align:center;">Не найдено</div>';return;}var h='';res.forEach(function(r){h+='<div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(128,128,128,0.04);border-radius:12px;margin-bottom:4px;"><div style="font-size:20px;">'+(r.avatar||'👤')+'</div><div style="flex:1;"><div style="font-size:14px;color:inherit;">'+r.name+'</div><div style="font-size:11px;color:rgba(128,128,128,0.5);">Ур. '+(r.level||1)+'</div></div><button onclick="window._frSend(\''+r.id+'\')" style="padding:8px 14px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.2);border-radius:10px;color:#5a8acf;font-size:12px;cursor:pointer;">Добавить</button></div>';});el.innerHTML=h;}

window._frSend=function(uid){var db=window._db,me=window._currentUser;if(!db||!me)return;var ud=window.userData||{};db.collection('users').doc(uid).collection(REQ).doc(me.uid).set({from:me.uid,name:ud.nickname||me.displayName||'Мусульманин',avatar:ud.avatar||'👤',ts:firebase.firestore.FieldValue.serverTimestamp(),status:'pending'}).then(function(){alert('Запрос отправлен!');}).catch(function(e){alert(e.message);});};
window._frShare=function(){var me=window._currentUser;if(!me||me.isAnonymous){alert('Войдите');return;}var ud=window.userData||{};var t='Muslim Tracker! Ник: '+(ud.nickname||'')+' ID: '+me.uid;if(navigator.share)navigator.share({title:'Muslim Tracker',text:t}).catch(function(){});else{try{navigator.clipboard.writeText(me.uid);alert('ID: '+me.uid);}catch(e){prompt('ID:',me.uid);}}};
window._frInvLink=function(){var me=window._currentUser;if(!me)return;var l='https://mgmdov.github.io/?invite='+me.uid;if(navigator.share)navigator.share({title:'Muslim Tracker',url:l}).catch(function(){});else{try{navigator.clipboard.writeText(l);alert('Ссылка скопирована');}catch(e){prompt('Ссылка:',l);}}};

function loadReq(){var db=window._db,me=window._currentUser,el=document.getElementById('frReq');if(!db||!me||!el)return;db.collection('users').doc(me.uid).collection(REQ).where('status','==','pending').get().then(function(snap){if(snap.empty){el.innerHTML='';return;}var h='<div style="padding:14px;background:rgba(244,208,63,0.05);border:1px dashed rgba(244,208,63,0.2);border-radius:14px;margin-bottom:16px;"><div style="font-size:11px;color:rgba(128,128,128,0.5);margin-bottom:8px;letter-spacing:0.5px;">ЗАПРОСЫ</div>';snap.forEach(function(doc){var d=doc.data();h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;"><div style="font-size:22px;">'+(d.avatar||'👤')+'</div><div style="flex:1;"><div style="font-size:14px;color:#f4d03f;font-weight:500;">'+d.name+'</div><div style="font-size:11px;color:rgba(128,128,128,0.4);">хочет добавить тебя</div></div><button onclick="window._frAcc(\''+doc.id+'\')" style="padding:7px 14px;background:rgba(93,202,165,0.15);border:1px solid rgba(93,202,165,0.25);border-radius:10px;color:#5dcaa5;font-size:12px;cursor:pointer;">Принять</button><button onclick="window._frDec(\''+doc.id+'\')" style="padding:7px 10px;background:rgba(128,128,128,0.06);border:1px solid rgba(128,128,128,0.1);border-radius:10px;color:rgba(128,128,128,0.4);font-size:12px;cursor:pointer;">Нет</button></div>';});h+='</div>';el.innerHTML=h;}).catch(function(){});}

window._frAcc=function(uid){var db=window._db,me=window._currentUser;if(!db||!me)return;var b=db.batch();b.set(db.collection('users').doc(me.uid).collection(FR).doc(uid),{uid:uid,ts:firebase.firestore.FieldValue.serverTimestamp()});b.set(db.collection('users').doc(uid).collection(FR).doc(me.uid),{uid:me.uid,ts:firebase.firestore.FieldValue.serverTimestamp()});b.delete(db.collection('users').doc(me.uid).collection(REQ).doc(uid));b.commit().then(function(){loadReq();loadFr();});};
window._frDec=function(uid){var db=window._db,me=window._currentUser;if(!db||!me)return;db.collection('users').doc(me.uid).collection(REQ).doc(uid).delete().then(function(){loadReq();});};

function loadFr(){var db=window._db,me=window._currentUser,el=document.getElementById('frList');if(!db||!me||!el){if(el)el.innerHTML='<div style="text-align:center;padding:30px;color:#888;">Войдите</div>';return;}
db.collection('users').doc(me.uid).collection(FR).get().then(function(snap){if(snap.empty){el.innerHTML='<div style="text-align:center;padding:30px;color:#888;">Пока нет друзей</div>';return;}var ps=[];snap.forEach(function(doc){ps.push(db.collection('leaderboard').doc(doc.id).get().then(function(ld){return ld.exists?{uid:doc.id,...ld.data()}:{uid:doc.id,name:'Друг'};}));});return Promise.all(ps);}).then(function(fr){
  if(!fr||!fr.length)return;
  var h='<div style="font-size:11px;color:rgba(128,128,128,0.5);margin-bottom:8px;letter-spacing:0.5px;">ДРУЗЬЯ ('+fr.length+')</div>';
  fr.forEach(function(f){
    // Определяем онлайн (если ts менее 5 мин назад)
    var online=false,timeAgo='';
    if(f.ts){
      var tsMs=f.ts.seconds?f.ts.seconds*1000:0;
      var diff=Date.now()-tsMs;
      if(diff<300000){online=true;}
      else if(diff<3600000){timeAgo=Math.floor(diff/60000)+' мин назад';}
      else if(diff<86400000){timeAgo=Math.floor(diff/3600000)+' ч назад';}
      else{timeAgo=Math.floor(diff/86400000)+' дн назад';}
    }
    h+='<div onclick="window._lbProfile(\''+f.uid+'\')" style="display:flex;align-items:center;gap:12px;padding:14px;background:rgba(128,128,128,0.04);border-radius:14px;margin-bottom:4px;cursor:pointer;">';
    // Аватар с точкой онлайн
    h+='<div style="position:relative;"><div style="width:44px;height:44px;border-radius:50%;background:'+(online?'linear-gradient(135deg,#d4a937,#8b6914)':'rgba(128,128,128,0.1)')+';display:flex;align-items:center;justify-content:center;font-size:20px;">'+(f.avatar||'👤')+'</div>';
    if(online)h+='<div style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:#5dcaa5;border:2px solid #060a14;"></div>';
    h+='</div>';
    h+='<div style="flex:1;"><div style="font-size:15px;color:inherit;font-weight:500;">'+f.name+'</div><div style="font-size:11px;color:rgba(128,128,128,0.5);">Ур. '+(f.level||1)+' · '+(f.xp||0)+' XP · 🔥'+(f.streak||0)+'</div></div>';
    // Статус
    if(online)h+='<div style="font-size:11px;color:#5dcaa5;">онлайн</div>';
    else if(timeAgo)h+='<div style="font-size:11px;color:rgba(128,128,128,0.3);">'+timeAgo+'</div>';
    h+='</div>';
  });
  el.innerHTML=h;
}).catch(function(e){if(el)el.innerHTML='<div style="padding:20px;color:#888;text-align:center;">'+e.message+'</div>';});}
console.log('👥 Друзья v4');
})();
