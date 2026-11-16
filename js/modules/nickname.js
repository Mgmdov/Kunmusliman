// ========== НИКНЕЙМ + АВАТАР + ID ==========
(function(){
var NICK_KEY='mt_nickname';
var AVATAR_KEY='mt_avatar';

// Восстанавливаем при загрузке
function restoreNickname(){
  if(!window.userData)return;
  var savedNick=localStorage.getItem(NICK_KEY);
  var savedAvatar=localStorage.getItem(AVATAR_KEY);
  if(savedNick&&!window.userData.nickname){window.userData.nickname=savedNick;}
  if(savedAvatar&&!window.userData.avatar){window.userData.avatar=savedAvatar;}
}
setTimeout(restoreNickname,500);
setTimeout(restoreNickname,2000);
setTimeout(restoreNickname,4000);

// Установка ника — сохраняем В ТРЁХ местах: userData, localStorage, Firestore
function T(x){return (window.kunT&&window.kunT(x))||x;}
function nickKey(n){return n.trim().toLowerCase().replace(/\s+/g,' ').replace(/\//g,'_');}
function nickMsg(text,cls){
  var inp=document.getElementById('settingsNickInput');if(!inp)return;
  var m=document.getElementById('nickMsg');
  if(!m){m=document.createElement('div');m.id='nickMsg';m.className='nick-msg';inp.parentNode.appendChild(m);}
  m.textContent=text||'';m.className='nick-msg '+(cls||'');
}
function applyNick(nick){
  if(!window.userData)window.userData={};
  window.userData.nickname=nick;
  localStorage.setItem(NICK_KEY,nick);
  if(typeof window.saveData==='function')window.saveData();
  var db=window._db,u=window._currentUser;
  if(db&&u&&!u.isAnonymous){db.collection('leaderboard').doc(u.uid).set({name:nick},{merge:true}).catch(function(){});}
  var st=document.getElementById('settingsStatus');if(st)st.textContent=nick;
}
// Уникальный ник: документ nicknames/{key} = {uid}. Транзакция гарантирует, что два человека не займут один ник.
window.setNickname=function(nick){
  if(!nick||!nick.trim())return Promise.resolve(false);
  nick=nick.trim().replace(/\s+/g,' ');
  if(nick.length<2){nickMsg(T('Ник слишком короткий'),'err');return Promise.resolve(false);}
  if(nick.length>20){nickMsg(T('Максимум 20 символов'),'err');return Promise.resolve(false);}
  var old=(window.userData&&window.userData.nickname)||'';
  if(old===nick){nickMsg('');return Promise.resolve(true);}
  var db=window._db,u=window._currentUser;
  if(!db||!u||u.isAnonymous){applyNick(nick);nickMsg('');return Promise.resolve(true);}
  var key=nickKey(nick),oldKey=old?nickKey(old):'',ref=db.collection('nicknames').doc(key);
  nickMsg(T('Проверка…'),'');
  return db.runTransaction(function(tx){
    return tx.get(ref).then(function(d){
      if(d.exists&&d.data().uid!==u.uid){var e=new Error('taken');e.taken=true;throw e;}
      tx.set(ref,{uid:u.uid,nick:nick});
    });
  }).then(function(){
    if(oldKey&&oldKey!==key){db.collection('nicknames').doc(oldKey).get().then(function(d){if(d.exists&&d.data().uid===u.uid)d.ref.delete();}).catch(function(){});}
    applyNick(nick);nickMsg('✓ '+T('Ник сохранён'),'ok');return true;
  }).catch(function(e){
    if(e&&e.taken){nickMsg('✕ '+T('Ник занят'),'err');var i=document.getElementById('settingsNickInput');if(i)i.value=old;return false;}
    // нет сети / правила не опубликованы — не блокируем пользователя
    applyNick(nick);nickMsg(T('Сохранено локально'),'');return true;
  });
};

window.setAvatar=function(emoji){
  if(!emoji)return;
  if(!window.userData)window.userData={};
  window.userData.avatar=emoji;
  localStorage.setItem(AVATAR_KEY,emoji);
  if(typeof window.saveData==='function')window.saveData();
  var db=window._db,u=window._currentUser;
  if(db&&u&&!u.isAnonymous){
    db.collection('leaderboard').doc(u.uid).set({avatar:emoji},{merge:true}).catch(function(){});
  }
};

// Скрыть/показать рейтинг
window.toggleLeaderboardVisibility=function(hide){
  if(!window.userData)return;
  window.userData.hideFromLeaderboard=hide;
  if(typeof window.saveData==='function')window.saveData();
  var db=window._db,u=window._currentUser;
  if(db&&u&&!u.isAnonymous){
    db.collection('leaderboard').doc(u.uid).update({hidden:hide}).catch(function(){});
  }
};

// Звёзды только для зарегистрированных
var origCompleteDailyTask=window.completeDailyTask;
window.completeDailyTask=function(taskId){
  var u=window._currentUser;
  if(!u||u.isAnonymous){
    showRegisterPrompt();return;
  }
  if(typeof origCompleteDailyTask==='function')origCompleteDailyTask(taskId);
};

function showRegisterPrompt(){
  if(document.querySelector('.register-prompt'))return;
  var d=document.createElement('div');d.className='register-prompt';
  d.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#1a1408;border:1px solid #f4d03f;border-radius:14px;padding:12px 20px;z-index:999999;color:#f4d03f;font-size:13px;text-align:center;max-width:280px;';
  d.innerHTML='Войдите в аккаунт, чтобы получать звёзды<br><span style="font-size:11px;color:#c0a040;">Настройки → Войти</span>';
  document.body.appendChild(d);setTimeout(function(){d.remove();},4000);
}

// (v55) Серия входа: единая логика в daily-tasks.js — popup раз в день, локальная полночь, защита часов.

// Инжектим профиль в настройки
function injectProfile(){
  var status=document.getElementById('settingsStatus');
  var email=document.getElementById('settingsEmail');
  if(!status)return;
  var u=window._currentUser,ud=window.userData||{};
  // Восстанавливаем из localStorage если в userData нет
  var nick=ud.nickname||localStorage.getItem(NICK_KEY)||'';
  var avatar=ud.avatar||localStorage.getItem(AVATAR_KEY)||'👤';
  // Применяем обратно если из localStorage
  if(!ud.nickname&&nick)window.userData.nickname=nick;
  if(!ud.avatar&&avatar!=='👤')window.userData.avatar=avatar;

  if(u&&!u.isAnonymous){
    status.textContent=nick||(u.displayName||'Мусульманин');
    if(email)email.textContent=u.email||'';
  }
  // Обновляем все поля настроек B
  var avatarEl=document.getElementById('settingsAvatarDisplay');
  if(avatarEl)avatarEl.textContent=avatar;
  var nickInput=document.getElementById('settingsNickInput');
  if(nickInput&&!nickInput.value)nickInput.value=nick;
  var idEl=document.getElementById('settingsIdDisplay');
  if(idEl&&u)idEl.textContent='ID: '+u.uid.substring(0,8)+'...';
  var starsEl=document.getElementById('settingsStarsDisplay');
  if(starsEl)starsEl.textContent='★ '+((ud.stars||{}).totalStars||0);
  var streakEl=document.getElementById('settingsStreakDisplay');
  if(streakEl)streakEl.textContent='🔥 '+((ud.streakData||{}).streak||0);
  var khatmsEl=document.getElementById('settingsKhatmsDisplay');
  if(khatmsEl)khatmsEl.textContent='📖 '+((ud.khatm||{}).completedKhatms||0);
  var hideCheck=document.getElementById('hideFromLeaderboardCheck');
  if(hideCheck)hideCheck.checked=!!ud.hideFromLeaderboard;
  var profileBlock=status.parentElement.parentElement;
  if(!profileBlock)return;
  // Не нужно больше инжектить HTML — всё уже в index.html
}
setTimeout(injectProfile,3000);
setTimeout(injectProfile,6000);
setTimeout(injectProfile,10000);

// Пикер аватарок (нижняя шторка, сетка не выходит за рамки)
window.openAvatarPicker=function(){
  var emojis=['😊','😎','🥰','🤩','🧔','👳','🧕','👨‍🦱','👩‍🦰','🕌','🕋','🌙','☪️','⭐','🌟','💫','✨','🔥','💎','👑','🦁','🦅','🐪','🐎','🌴','🌿','🌺','🪷','📖','📿','🤲','💚','🟢','🔵','🟣','🟡','⚡','❤️','🏔️','🌅'];
  var cur=(window.userData&&window.userData.avatar)||localStorage.getItem(AVATAR_KEY)||'👤';
  var ex=document.getElementById('avOv');if(ex)ex.remove();
  var o=document.createElement('div');o.id='avOv';o.className='av-ov';
  o.innerHTML='<div class="av-sheet"><div class="av-grab"></div><div class="av-title">'+T('Выбери аватарку')+'</div><div class="av-prev"><span class="lb-av"><span id="avPrev">'+cur+'</span></span></div><div class="av-grid" id="avGrid"></div><button class="av-cancel" id="avCancel">'+T('Закрыть')+'</button></div>';
  var g=o.querySelector('#avGrid');
  emojis.forEach(function(e){var b=document.createElement('button');b.className='av-it'+(e===cur?' on':'');b.textContent=e;b.onclick=function(){window.setAvatar(e);var a=document.getElementById('settingsAvatarDisplay');if(a)a.textContent=e;o.remove();};g.appendChild(b);});
  o.querySelector('#avCancel').onclick=function(){o.remove();};
  o.onclick=function(ev){if(ev.target===o)o.remove();};
  document.body.appendChild(o);
};

console.log('👤 Никнейм/аватар загружен');
})();
