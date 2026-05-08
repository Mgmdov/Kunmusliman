// ========== СОВМЕСТНЫЙ ХАТМ v3 — КРУГОВОЙ ПРОГРЕСС ==========
(function(){
var ROOMS='khatm_rooms',TP=604;
window.openCoopKhatm=function(){
  var ex=document.getElementById('coopOverlay');if(ex)ex.remove();
  var o=document.createElement('div');o.id='coopOverlay';o.className='fullscreen-overlay';
  o.innerHTML='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'coopOverlay\').remove();">← Назад</button><span class="overlay-title">Совместный хатм</span><span style="width:60px;"></span></div><div class="overlay-body"><div style="text-align:center;margin-bottom:16px;"><div style="font-family:Amiri,serif;font-size:20px;color:inherit;">خَتْم جَمَاعِي</div></div><div style="display:flex;gap:8px;margin-bottom:20px;"><button onclick="window._ckCreate()" style="flex:1;padding:14px;background:rgba(93,202,165,0.1);border:1px solid rgba(93,202,165,0.2);border-radius:14px;color:#5dcaa5;font-size:14px;font-weight:500;cursor:pointer;">Создать</button><button onclick="window._ckJoin()" style="flex:1;padding:14px;background:rgba(90,138,207,0.1);border:1px solid rgba(90,138,207,0.2);border-radius:14px;color:#5a8acf;font-size:14px;font-weight:500;cursor:pointer;">Войти по коду</button></div><div id="ckRooms"><div style="text-align:center;padding:40px;color:#888;">Загрузка...</div></div></div>';
  document.body.appendChild(o);loadR();
};
window._ckCreate=function(){var db=window._db,me=window._currentUser;if(!db||!me||me.isAnonymous){alert('Войдите');return;}var days=parseInt(prompt('Срок хатма (дней):','30'));if(!days||days<1)return;var code=String(Math.floor(100000+Math.random()*900000));var ud=window.userData||{};var n=ud.nickname||me.displayName||'Мусульманин';var a=ud.avatar||'👤';var room={code:code,creator:me.uid,days:days,created:firebase.firestore.FieldValue.serverTimestamp(),deadline:new Date(Date.now()+days*86400000).toISOString(),status:'active',memberOrder:[me.uid],memberData:{}};room.memberData[me.uid]={name:n,avatar:a,pages:0};db.collection(ROOMS).doc(code).set(room).then(function(){alert('Код: '+code);loadR();}).catch(function(e){alert(e.message);});};
window._ckJoin=function(){var code=prompt('Код комнаты:');if(!code)return;code=code.trim();var db=window._db,me=window._currentUser;if(!db||!me||me.isAnonymous){alert('Войдите');return;}var ud=window.userData||{};db.collection(ROOMS).doc(code).get().then(function(doc){if(!doc.exists){alert('Не найдена');return;}var d=doc.data();if(d.status!=='active'){alert('Завершён');return;}if(d.memberOrder&&d.memberOrder.includes(me.uid)){alert('Вы уже внутри');return;}var upd={};upd['memberData.'+me.uid]={name:ud.nickname||me.displayName||'Мусульманин',avatar:ud.avatar||'👤',pages:0};upd.memberOrder=firebase.firestore.FieldValue.arrayUnion(me.uid);return db.collection(ROOMS).doc(code).update(upd);}).then(function(){alert('Присоединились!');loadR();}).catch(function(e){alert(e.message);});};

function loadR(){var db=window._db,me=window._currentUser,el=document.getElementById('ckRooms');if(!db||!me||!el){if(el)el.innerHTML='<div style="text-align:center;padding:40px;color:#888;">Войдите</div>';return;}db.collection(ROOMS).where('status','==','active').limit(20).get().then(function(snap){var my=[];snap.forEach(function(d){var data=d.data();if(data.memberOrder&&data.memberOrder.includes(me.uid))my.push({id:d.id,...data});});renderR(el,my);}).catch(function(e){el.innerHTML='<div style="padding:20px;color:#888;text-align:center;">'+e.message+'</div>';});}

function renderR(el,rooms){
  if(!rooms.length){el.innerHTML='<div style="text-align:center;padding:40px;color:#888;">Нет активных комнат</div>';return;}
  var h='';var colors=['#5dcaa5','#d4a937','#5a8acf','#a878d8','#D85A30','#7F77DD','#e24b4a','#EF9F27'];
  var uid=(window._currentUser||{}).uid;
  rooms.forEach(function(room){
    var order=room.memberOrder||[];var md=room.memberData||{};
    var n=order.length;var pp=Math.ceil(TP/Math.max(1,n));
    var totalRead=0;order.forEach(function(u){totalRead+=((md[u]||{}).pages||0);});
    var pct=Math.round(totalRead*100/TP);
    var daysLeft=Math.max(0,Math.ceil((new Date(room.deadline)-Date.now())/86400000));
    var isCreator=room.creator===uid;
    // SVG ring
    var circ=264,offset=Math.round(circ-(pct/100)*circ);

    h+='<div style="background:rgba(128,128,128,0.03);border:1px solid rgba(128,128,128,0.06);border-radius:18px;padding:18px;margin-bottom:12px;">';
    h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div><div style="font-size:16px;font-weight:500;color:inherit;">Комната #'+room.code+'</div><div style="font-size:11px;color:rgba(128,128,128,0.4);">Создал: '+(md[room.creator]||{}).name+' · '+daysLeft+' дн</div></div></div>';

    // КРУГОВОЙ ПРОГРЕСС SVG
    h+='<div style="text-align:center;margin-bottom:14px;"><svg viewBox="0 0 100 100" width="100" height="100" style="display:block;margin:0 auto;"><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(128,128,128,0.08)" stroke-width="7"/><circle cx="50" cy="50" r="42" fill="none" stroke="#5dcaa5" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+offset+'" transform="rotate(-90 50 50)"/><text x="50" y="46" text-anchor="middle" fill="#5dcaa5" font-size="20" font-weight="500">'+pct+'%</text><text x="50" y="60" text-anchor="middle" fill="rgba(128,128,128,0.4)" font-size="9">'+totalRead+' / '+TP+'</text></svg></div>';

    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;"><div style="background:rgba(93,202,165,0.06);border:1px solid rgba(93,202,165,0.1);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:18px;font-weight:500;color:#5dcaa5;">'+n+'</div><div style="font-size:10px;color:rgba(128,128,128,0.4);">участников</div></div><div style="background:rgba(90,138,207,0.06);border:1px solid rgba(90,138,207,0.1);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:18px;font-weight:500;color:#5a8acf;">'+daysLeft+' дн</div><div style="font-size:10px;color:rgba(128,128,128,0.4);">осталось</div></div></div>';

    h+='<div style="font-size:11px;color:rgba(128,128,128,0.4);margin-bottom:8px;letter-spacing:0.5px;">УЧАСТНИКИ</div>';

    // Участники с распределением
    order.forEach(function(u,i){
      var m=md[u]||{};var me2=u===uid;
      var startP=i*pp+1;var endP=Math.min((i+1)*pp,TP);
      var mp=m.pages||0;var mPct=Math.min(100,Math.round(mp*100/pp));
      var col=colors[i%colors.length];
      h+='<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:'+(me2?'rgba(93,202,165,0.05)':'rgba(128,128,128,0.02)')+';border:'+(me2?'1px solid rgba(93,202,165,0.1)':'none')+';border-radius:10px;margin-bottom:4px;">';
      h+='<div style="font-size:18px;">'+(m.avatar||'👤')+'</div>';
      h+='<div style="flex:1;"><div style="font-size:13px;color:'+(me2?'#5dcaa5':'inherit')+';font-weight:'+(me2?'500':'400')+';">'+(me2?'Ты':m.name)+'</div><div style="font-size:10px;color:rgba(128,128,128,0.35);">стр. '+startP+' — '+endP+'</div></div>';
      h+='<div style="text-align:right;"><div style="font-size:12px;color:'+col+';">'+mp+'/'+pp+'</div><div style="width:44px;height:4px;background:rgba(128,128,128,0.08);border-radius:2px;margin-top:3px;"><div style="width:'+mPct+'%;height:100%;background:'+col+';border-radius:2px;"></div></div></div></div>';
    });

    h+='<div style="display:flex;gap:6px;margin-top:14px;"><button onclick="window._ckAP(\''+room.code+'\',1)" style="flex:1;padding:12px;background:rgba(93,202,165,0.12);border:1px solid rgba(93,202,165,0.2);border-radius:12px;color:#5dcaa5;font-size:13px;font-weight:500;cursor:pointer;">+1 стр.</button><button onclick="window._ckAP(\''+room.code+'\',20)" style="flex:1;padding:12px;background:rgba(90,138,207,0.12);border:1px solid rgba(90,138,207,0.2);border-radius:12px;color:#5a8acf;font-size:13px;font-weight:500;cursor:pointer;">+20 стр.</button><button onclick="window._ckInv(\''+room.code+'\')" style="padding:12px 14px;background:rgba(128,128,128,0.04);border:1px solid rgba(128,128,128,0.08);border-radius:12px;color:rgba(128,128,128,0.5);font-size:13px;cursor:pointer;">Пригласить</button></div>';

    h+='<div style="display:flex;gap:6px;margin-top:8px;">';
    if(isCreator){h+='<button onclick="window._ckDel(\''+room.code+'\')" style="flex:1;padding:10px;background:rgba(226,75,74,0.08);border:1px solid rgba(226,75,74,0.15);border-radius:10px;color:#e24b4a;font-size:12px;cursor:pointer;">Удалить комнату</button>';}
    else{h+='<button onclick="window._ckLeave(\''+room.code+'\')" style="flex:1;padding:10px;background:rgba(226,75,74,0.06);border:1px solid rgba(226,75,74,0.12);border-radius:10px;color:#e24b4a;font-size:12px;cursor:pointer;">Выйти</button>';}
    h+='</div></div>';
  });
  el.innerHTML=h;
}

window._ckAP=function(code,n){var db=window._db,me=window._currentUser;if(!db||!me)return;var upd={};upd['memberData.'+me.uid+'.pages']=firebase.firestore.FieldValue.increment(n);db.collection(ROOMS).doc(code).update(upd).then(function(){loadR();db.collection(ROOMS).doc(code).get().then(function(doc){if(!doc.exists)return;var d=doc.data(),t=0;Object.values(d.memberData||{}).forEach(function(m){t+=(m.pages||0);});if(t>=TP&&d.status==='active'){db.collection(ROOMS).doc(code).update({status:'completed'});showDone();}});}).catch(function(e){alert(e.message);});};
window._ckLeave=function(code){if(!confirm('Выйти из комнаты?'))return;var db=window._db,me=window._currentUser;if(!db||!me)return;var upd={};upd['memberData.'+me.uid]=firebase.firestore.FieldValue.delete();upd.memberOrder=firebase.firestore.FieldValue.arrayRemove(me.uid);db.collection(ROOMS).doc(code).update(upd).then(function(){loadR();});};
window._ckDel=function(code){if(!confirm('Удалить комнату навсегда?'))return;var db=window._db;if(!db)return;db.collection(ROOMS).doc(code).delete().then(function(){loadR();});};
window._ckInv=function(code){var t='Совместный хатм! Код: '+code+'\nhttps://mgmdov.github.io/?room='+code;if(navigator.share)navigator.share({title:'Хатм',text:t}).catch(function(){});else{try{navigator.clipboard.writeText(code);alert('Код: '+code);}catch(e){prompt('Код:',code);}}};

function showDone(){var d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';d.innerHTML='<div style="background:#0a2a18;border:2px solid #5dcaa5;border-radius:20px;padding:28px;max-width:320px;text-align:center;"><div style="font-size:48px;">🎉</div><div style="font-family:Amiri,serif;font-size:24px;color:#5dcaa5;margin:8px 0;">خَتْم مُبَارَك</div><div style="color:#e8dcc8;font-size:18px;">Хатм завершён!</div><div style="color:rgba(255,255,255,0.6);font-size:14px;margin:8px 0 20px;">+500 ★ · +200 XP</div><button onclick="this.parentElement.parentElement.remove();" style="background:#5dcaa5;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:15px;cursor:pointer;">Альхамдулиллях!</button></div>';document.body.appendChild(d);if(window.userData){var s=window.userData.stars||{totalStars:0};s.totalStars=(parseInt(s.totalStars)||0)+500;window.userData.stars=s;if(typeof window.saveData==='function')window.saveData();}}
console.log('🤝 Совместный хатм v3 (SVG ring)');
})();
