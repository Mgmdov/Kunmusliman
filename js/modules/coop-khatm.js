// ========== СОВМЕСТНЫЙ ХАТМ v2 — АВТО-РАСПРЕДЕЛЕНИЕ ==========
(function(){
var ROOMS='khatm_rooms',TP=604;
window.openCoopKhatm=function(){
  var ex=document.getElementById('coopOverlay');if(ex)ex.remove();
  var o=document.createElement('div');o.id='coopOverlay';
  o.style.cssText='position:fixed;inset:0;z-index:999997;background:#000;overflow-y:auto;-webkit-overflow-scrolling:touch;opacity:0;transition:opacity .3s;';
  o.innerHTML='<div style="padding:16px 16px 80px;max-width:600px;margin:0 auto;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><button onclick="document.getElementById(\'coopOverlay\').style.opacity=0;setTimeout(function(){document.getElementById(\'coopOverlay\').remove();},300);" style="background:none;border:none;color:#007AFF;font-size:15px;cursor:pointer;">← Назад</button><h2 style="margin:0;font-size:18px;color:#e8dcc8;">Совместный хатм</h2><div style="width:50px;"></div></div><div style="display:flex;gap:8px;margin-bottom:20px;"><button onclick="window._ckCreate()" style="flex:1;padding:14px;background:rgba(93,202,165,0.15);border:1px solid rgba(93,202,165,0.25);border-radius:14px;color:#5dcaa5;font-size:14px;font-weight:500;cursor:pointer;">Создать</button><button onclick="window._ckJoin()" style="flex:1;padding:14px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.25);border-radius:14px;color:#5a8acf;font-size:14px;font-weight:500;cursor:pointer;">Войти по коду</button></div><div id="ckRooms"><div style="text-align:center;padding:40px;color:#666;">Загрузка...</div></div></div>';
  document.body.appendChild(o);requestAnimationFrame(function(){o.style.opacity='1';});loadR();
};

window._ckCreate=function(){
  var db=window._db,me=window._currentUser;if(!db||!me||me.isAnonymous){alert('Войдите в аккаунт');return;}
  var days=parseInt(prompt('Срок хатма (дней):','30'));if(!days||days<1)return;
  var code=String(Math.floor(100000+Math.random()*900000));
  var ud=window.userData||{};
  var myName=ud.nickname||me.displayName||'Мусульманин';
  var myAvatar=ud.avatar||'👤';
  var room={code:code,creator:me.uid,days:days,created:firebase.firestore.FieldValue.serverTimestamp(),deadline:new Date(Date.now()+days*86400000).toISOString(),status:'active',memberOrder:[me.uid],memberData:{}};
  room.memberData[me.uid]={name:myName,avatar:myAvatar,pages:0,joined:new Date().toISOString()};
  db.collection(ROOMS).doc(code).set(room).then(function(){alert('Код: '+code);loadR();}).catch(function(e){alert(e.message);});
};

window._ckJoin=function(){
  var code=prompt('Код комнаты:');if(!code)return;code=code.trim();
  var db=window._db,me=window._currentUser;if(!db||!me||me.isAnonymous){alert('Войдите');return;}
  var ud=window.userData||{};var myName=ud.nickname||me.displayName||'Мусульманин';var myAvatar=ud.avatar||'👤';
  db.collection(ROOMS).doc(code).get().then(function(doc){
    if(!doc.exists){alert('Не найдена');return;}
    var d=doc.data();if(d.status!=='active'){alert('Завершён');return;}
    if(d.memberOrder&&d.memberOrder.includes(me.uid)){alert('Вы уже внутри');return;}
    var upd={};
    upd['memberData.'+me.uid]={name:myName,avatar:myAvatar,pages:0,joined:new Date().toISOString()};
    upd.memberOrder=firebase.firestore.FieldValue.arrayUnion(me.uid);
    return db.collection(ROOMS).doc(code).update(upd);
  }).then(function(){alert('Присоединились!');loadR();}).catch(function(e){alert(e.message);});
};

function loadR(){
  var db=window._db,me=window._currentUser,el=document.getElementById('ckRooms');
  if(!db||!me||!el){if(el)el.innerHTML='<div style="text-align:center;padding:40px;color:#666;">Войдите</div>';return;}
  db.collection(ROOMS).where('status','==','active').limit(20).get().then(function(snap){
    var my=[];snap.forEach(function(d){var data=d.data();if(data.memberOrder&&data.memberOrder.includes(me.uid))my.push({id:d.id,...data});});
    renderR(el,my);
  }).catch(function(e){el.innerHTML='<div style="padding:20px;color:#666;text-align:center;">'+e.message+'</div>';});
}

function renderR(el,rooms){
  if(!rooms.length){el.innerHTML='<div style="text-align:center;padding:40px;color:#666;">Нет комнат</div>';return;}
  var h='';var colors=['#5dcaa5','#d4a937','#5a8acf','#a878d8','#D85A30','#7F77DD','#e24b4a','#EF9F27'];
  var uid=(window._currentUser||{}).uid;
  rooms.forEach(function(room){
    var order=room.memberOrder||[];var md=room.memberData||{};
    var n=order.length;var pp=Math.ceil(TP/Math.max(1,n));
    var totalRead=0;order.forEach(function(u){totalRead+=((md[u]||{}).pages||0);});
    var pct=Math.round(totalRead*100/TP);
    var daysLeft=Math.max(0,Math.ceil((new Date(room.deadline)-Date.now())/86400000));
    var isCreator=room.creator===uid;

    h+='<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div style="font-size:15px;color:#e8dcc8;font-weight:500;">Комната #'+room.code+'</div><div style="font-size:20px;font-weight:500;color:#5dcaa5;">'+pct+'%</div></div>';
    h+='<div style="height:5px;background:#101828;border-radius:3px;overflow:hidden;margin-bottom:12px;"><div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#5a8acf,#5dcaa5);border-radius:3px;"></div></div>';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;"><div style="background:rgba(93,202,165,0.08);border:1px solid rgba(93,202,165,0.12);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:18px;color:#5dcaa5;">'+n+'</div><div style="font-size:10px;color:rgba(255,255,255,0.35);">участников</div></div><div style="background:rgba(90,138,207,0.08);border:1px solid rgba(90,138,207,0.12);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:18px;color:#5a8acf;">'+daysLeft+'</div><div style="font-size:10px;color:rgba(255,255,255,0.35);">дн осталось</div></div></div>';

    // Участники с авто-распределением
    order.forEach(function(u,i){
      var m=md[u]||{};var me2=u===uid;
      var startP=i*pp+1;var endP=Math.min((i+1)*pp,TP);
      var mp=m.pages||0;var mPct=Math.min(100,Math.round(mp*100/pp));
      var col=colors[i%colors.length];
      h+='<div style="display:flex;align-items:center;gap:8px;padding:8px;background:'+(me2?'rgba(93,202,165,0.06)':'rgba(255,255,255,0.02)')+';border-radius:8px;margin-bottom:2px;">';
      h+='<div style="font-size:16px;">'+(m.avatar||'👤')+'</div>';
      h+='<div style="flex:1;"><div style="font-size:12px;color:'+(me2?'#5dcaa5':'#e8dcc8')+';">'+(me2?'Ты':m.name)+'</div><div style="font-size:10px;color:rgba(255,255,255,0.3);">стр. '+startP+'-'+endP+'</div></div>';
      h+='<div style="font-size:11px;color:rgba(255,255,255,0.4);">'+mp+'/'+pp+'</div>';
      h+='<div style="width:36px;height:4px;background:#101828;border-radius:2px;overflow:hidden;"><div style="width:'+mPct+'%;height:100%;background:'+col+';border-radius:2px;"></div></div></div>';
    });

    h+='<div style="display:flex;gap:6px;margin-top:10px;">';
    h+='<button onclick="window._ckAP(\''+room.code+'\',1)" style="flex:1;padding:10px;background:rgba(93,202,165,0.15);border:1px solid rgba(93,202,165,0.25);border-radius:10px;color:#5dcaa5;font-size:12px;cursor:pointer;">+1</button>';
    h+='<button onclick="window._ckAP(\''+room.code+'\',20)" style="flex:1;padding:10px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.25);border-radius:10px;color:#5a8acf;font-size:12px;cursor:pointer;">+20</button>';
    h+='<button onclick="window._ckInv(\''+room.code+'\')" style="padding:10px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.4);font-size:12px;cursor:pointer;">Пригласить</button>';
    // Выход / Удаление
    if(isCreator){
      h+='<button onclick="window._ckDelete(\''+room.code+'\')" style="padding:10px 12px;background:rgba(226,75,74,0.1);border:1px solid rgba(226,75,74,0.2);border-radius:10px;color:#e24b4a;font-size:12px;cursor:pointer;">Удалить</button>';
    }else{
      h+='<button onclick="window._ckLeave(\''+room.code+'\')" style="padding:10px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.4);font-size:12px;cursor:pointer;">Выйти</button>';
    }
    h+='</div></div>';
  });
  el.innerHTML=h;
}

window._ckAP=function(code,n){
  var db=window._db,me=window._currentUser;if(!db||!me)return;
  var upd={};upd['memberData.'+me.uid+'.pages']=firebase.firestore.FieldValue.increment(n);
  db.collection(ROOMS).doc(code).update(upd).then(function(){loadR();
    db.collection(ROOMS).doc(code).get().then(function(doc){if(!doc.exists)return;var d=doc.data(),t=0;Object.values(d.memberData||{}).forEach(function(m){t+=(m.pages||0);});
    if(t>=TP&&d.status==='active'){db.collection(ROOMS).doc(code).update({status:'completed'});showDone();}});
  });
};

window._ckLeave=function(code){
  if(!confirm('Выйти из комнаты?'))return;
  var db=window._db,me=window._currentUser;if(!db||!me)return;
  var upd={};upd['memberData.'+me.uid]=firebase.firestore.FieldValue.delete();
  upd.memberOrder=firebase.firestore.FieldValue.arrayRemove(me.uid);
  db.collection(ROOMS).doc(code).update(upd).then(function(){loadR();});
};

window._ckDelete=function(code){
  if(!confirm('Удалить комнату? Это необратимо.'))return;
  var db=window._db;if(!db)return;
  db.collection(ROOMS).doc(code).delete().then(function(){loadR();});
};

window._ckInv=function(code){
  var text='Совместный хатм! Код: '+code;
  if(navigator.share)navigator.share({title:'Хатм',text:text}).catch(function(){});
  else{try{navigator.clipboard.writeText(code);alert('Код: '+code);}catch(e){prompt('Код:',code);}}
};

function showDone(){var d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';d.innerHTML='<div style="background:#0a2a18;border:2px solid #5dcaa5;border-radius:20px;padding:28px;max-width:320px;text-align:center;"><div style="font-size:48px;">🎉</div><div style="font-family:Amiri,serif;font-size:24px;color:#5dcaa5;margin:8px 0;">خَتْم مُبَارَك</div><div style="color:#e8dcc8;font-size:18px;">Хатм завершён!</div><div style="color:rgba(255,255,255,0.6);font-size:14px;margin:8px 0 20px;">+500 ★ · +200 XP</div><button onclick="this.parentElement.parentElement.remove();" style="background:#5dcaa5;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:15px;cursor:pointer;">Альхамдулиллях!</button></div>';document.body.appendChild(d);if(window.userData){var s=window.userData.stars||{totalStars:0};s.totalStars=(parseInt(s.totalStars)||0)+500;window.userData.stars=s;if(typeof window.saveData==='function')window.saveData();}}
console.log('🤝 Совместный хатм v2');
})();
