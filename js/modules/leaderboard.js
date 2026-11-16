// ========== РЕЙТИНГ v5 — Liquid Glass пьедестал ==========
(function(){
var COL='leaderboard';
var TABS=[{k:'xp',l:'XP',i:'⚡',s:' XP'},{k:'stars',l:'Звёзды',i:'★',s:' ★'},{k:'khatms',l:'Хатмы',i:'📖',s:''},{k:'streak',l:'Серия',i:'🔥',s:' дн'},{k:'cards',l:'Карты',i:'🃏',s:''},{k:'zikr',l:'Зикры',i:'📿',s:''},{k:'pages',l:'Страницы',i:'📄',s:''}];
var curTab='xp';
function T(s){return (window.kunT&&window.kunT(s))||s;}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){n=+n||0;return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?(n/1e3).toFixed(1)+'K':String(n);}

// Запись в рейтинг — не чаще раза в 45 сек и только при изменениях
var lastSig='',lastAt=0,tmr=null;
function updLB(force){
  var db=window._db,u=window._currentUser,ud=window.userData;
  if(!db||!u||!ud||u.isAnonymous)return;
  var cc=ud.chestCards?Object.keys(ud.chestCards).length:0;
  var data={name:ud.nickname||u.displayName||u.email||'Мусульманин',avatar:ud.avatar||'👤',xp:ud.xp||0,stars:((ud.stars||{}).totalStars)||0,khatms:((ud.khatm||{}).completedKhatms)||0,streak:((ud.streakData||{}).streak)||0,level:ud.level||1,cards:cc,zikr:ud.totalZikrOverall||0,pages:((ud.khatm||{}).readPages)||0,hidden:!!ud.hideFromLeaderboard};
  var sig=JSON.stringify(data);
  if(!force&&sig===lastSig)return;
  var now=Date.now();
  if(!force&&now-lastAt<45000){clearTimeout(tmr);tmr=setTimeout(function(){updLB();},45000-(now-lastAt)+200);return;}
  lastSig=sig;lastAt=now;
  try{data.ts=firebase.firestore.FieldValue.serverTimestamp();db.collection(COL).doc(u.uid).set(data,{merge:true}).catch(function(){});}catch(e){}
}
window._updLB=updLB;
var origSave=window.saveData;
window.saveData=function(){var r;if(typeof origSave==='function')r=origSave.apply(this,arguments);updLB();return r;};

function avatarHTML(av,cls){return '<span class="lb-av '+(cls||'')+'"><span>'+esc(av||'👤')+'</span></span>';}

window.openLeaderboard=function(){
  var ex=document.getElementById('lbOverlay');if(ex)ex.remove();
  var o=document.createElement('div');o.id='lbOverlay';o.className='fullscreen-overlay lb-ov';
  o.innerHTML='<div class="overlay-header"><button class="overlay-back-btn" onclick="document.getElementById(\'lbOverlay\').remove();">← '+T('Назад')+'</button><span class="overlay-title">'+T('Рейтинг')+'</span><span style="width:60px;"></span></div>'
  +'<div class="overlay-body lb-body"><div class="lb-hero"><div class="lb-ar">تَنَافَسُوا فِي الْخَيْرَاتِ</div><div class="lb-sub">'+T('Соревнуйтесь в добрых делах')+'</div></div>'
  +'<div class="lb-search"><input id="lbSearch" type="text" placeholder="'+T('Поиск по нику')+'" autocomplete="off"><button id="lbSearchBtn" aria-label="search">🔍</button></div>'
  +'<div class="lb-tabs" id="lbTabs"></div><div id="lbContent"></div></div>';
  document.body.appendChild(o);
  var te=document.getElementById('lbTabs');
  TABS.forEach(function(t){var b=document.createElement('button');b.className='lb-tab'+(t.k===curTab?' on':'');b.innerHTML='<i>'+t.i+'</i>'+T(t.l);b.onclick=function(){curTab=t.k;[].forEach.call(te.children,function(x){x.classList.remove('on');});b.classList.add('on');var s=document.getElementById('lbSearch');if(s)s.value='';loadLB(t.k);};te.appendChild(b);});
  var si=document.getElementById('lbSearch');
  document.getElementById('lbSearchBtn').onclick=window._lbSrch;
  si.addEventListener('keydown',function(e){if(e.key==='Enter')window._lbSrch();});
  si.addEventListener('input',function(){if(!si.value)loadLB(curTab);});
  loadLB(curTab);
};

window._lbSrch=function(){
  var q=((document.getElementById('lbSearch')||{}).value||'').trim();if(!q)return;
  var db=window._db,c=document.getElementById('lbContent');if(!db||!c)return;
  c.innerHTML='<div class="lb-msg">…</div>';
  db.collection(COL).where('name','==',q).limit(10).get().then(function(snap){var it=[];snap.forEach(function(d){var x=d.data();x.id=d.id;if(!x.hidden)it.push(x);});renderLB(c,it,curTab,true);}).catch(function(){c.innerHTML='<div class="lb-msg">'+T('Ошибка')+'</div>';});
};

function loadLB(field){
  var db=window._db,c=document.getElementById('lbContent');if(!c)return;
  if(!db){c.innerHTML='<div class="lb-msg">'+T('Войдите в аккаунт')+'</div>';return;}
  c.innerHTML='<div class="lb-skel"></div><div class="lb-skel"></div><div class="lb-skel"></div>';
  updLB(true);
  db.collection(COL).orderBy(field,'desc').limit(50).get().then(function(snap){var it=[];snap.forEach(function(d){var x=d.data();x.id=d.id;if(!x.hidden)it.push(x);});if(curTab===field)renderLB(c,it,field);}).catch(function(e){c.innerHTML='<div class="lb-msg">'+esc(e.message)+'</div>';});
}

function myVal(field){var ud=window.userData||{};return field==='xp'?(ud.xp||0):field==='stars'?((ud.stars||{}).totalStars||0):field==='khatms'?((ud.khatm||{}).completedKhatms||0):field==='streak'?((ud.streakData||{}).streak||0):field==='cards'?(ud.chestCards?Object.keys(ud.chestCards).length:0):field==='zikr'?(ud.totalZikrOverall||0):((ud.khatm||{}).readPages||0);}

function renderLB(c,items,field,isSearch){
  var tb=TABS.filter(function(t){return t.k===field;})[0]||TABS[0];
  if(!items.length){c.innerHTML='<div class="lb-msg">'+T(isSearch?'Никого не найдено':'Пока пусто')+'</div>';return;}
  var uid=(window._currentUser||{}).uid||'',h='';
  var start=0;
  if(!isSearch&&items.length>=3){
    start=3;
    var order=[1,0,2],cl=['s','g','b'];
    h+='<div class="lb-podium">';
    order.forEach(function(idx){var p=items[idx];h+='<div class="lb-pod '+cl[order.indexOf(idx)]+(p.id===uid?' me':'')+'" onclick="window._lbProfile(\''+esc(p.id)+'\')">'+(idx===0?'<div class="lb-crown">👑</div>':'')+avatarHTML(p.avatar,'big')+'<div class="lb-pn">'+esc(p.name)+'</div><div class="lb-pv">'+fmt(p[field])+esc(tb.s)+'</div><div class="lb-step"><b>'+(idx+1)+'</b></div></div>';});
    h+='</div>';
  }
  h+='<div class="lb-list">';
  for(var i=start;i<items.length;i++){var it=items[i],me=it.id===uid;
    h+='<div class="lb-row'+(me?' me':'')+'" onclick="window._lbProfile(\''+esc(it.id)+'\')"><span class="lb-rk">'+(isSearch?'•':(i+1))+'</span>'+avatarHTML(it.avatar)+'<span class="lb-nm">'+esc(it.name)+'<small>'+T('Ур.')+' '+(it.level||1)+'</small></span><span class="lb-vl">'+fmt(it[field])+esc(tb.s)+'</span></div>';}
  h+='</div>';
  if(!isSearch&&uid&&!items.some(function(x){return x.id===uid;})){
    var ud=window.userData||{};
    h+='<div class="lb-row me lb-mine"><span class="lb-rk">—</span>'+avatarHTML(ud.avatar)+'<span class="lb-nm">'+T('Вы')+'<small>'+T('Вне топ-50')+'</small></span><span class="lb-vl">'+fmt(myVal(field))+esc(tb.s)+'</span></div>';
  }
  c.innerHTML=h;
}

window._lbProfile=function(uid){
  var db=window._db;if(!db)return;
  db.collection(COL).doc(uid).get().then(function(doc){
    if(!doc.exists)return;var d=doc.data();
    var o=document.createElement('div');o.className='lb-modal';o.onclick=function(e){if(e.target===o)o.remove();};
    function cell(v,l,col){return '<div class="lb-cell"><b style="color:'+col+'">'+fmt(v)+'</b><span>'+T(l)+'</span></div>';}
    o.innerHTML='<div class="lb-card">'+avatarHTML(d.avatar,'huge')+'<div class="lb-cn">'+esc(d.name)+'</div><div class="lb-cl">'+T('Ур.')+' '+(d.level||1)+'</div><div class="lb-grid">'+cell(d.xp,'XP','#7aa7ff')+cell(d.stars,'Звёзды','#f4d03f')+cell(d.khatms,'Хатмы','#5dcaa5')+cell(d.streak,'Серия','#ff8a5c')+cell(d.cards,'Карты','#c79bff')+cell(d.zikr,'Зикры','#5ad0d0')+'</div><button class="lb-close" onclick="this.closest(\'.lb-modal\').remove()">'+T('Закрыть')+'</button></div>';
    document.body.appendChild(o);
  }).catch(function(){});
};
setTimeout(function(){updLB(true);},6000);
})();
