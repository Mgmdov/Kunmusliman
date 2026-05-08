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
window.setNickname=function(nick){
  if(!nick||!nick.trim())return;
  nick=nick.trim();
  if(!window.userData)window.userData={};
  window.userData.nickname=nick;
  localStorage.setItem(NICK_KEY,nick);
  if(typeof window.saveData==='function')window.saveData();
  var db=window._db,u=window._currentUser;
  if(db&&u&&!u.isAnonymous){
    db.collection('leaderboard').doc(u.uid).set({name:nick},{merge:true}).catch(function(){});
  }
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

// Показываем серию только ОДИН РАЗ в день
var origCheckStreak=window.checkAndUpdateStreak;
window.checkAndUpdateStreak=function(){
  var data=(window.userData||{}).streakData||{};
  var today=new Date().toISOString().slice(0,10);
  var shown=localStorage.getItem('streak_shown_'+today);
  if(shown){
    // Обновляем данные без popup
    if(data.lastDate!==today){
      var yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
      if(data.lastDate===yesterday)data.streak=(data.streak||0)+1;
      else data.streak=1;
      data.lastDate=today;
      data.claimedToday=false;
      data.tasksCompleted={};
      if(typeof window.saveData==='function')window.saveData();
    }
    return;
  }
  localStorage.setItem('streak_shown_'+today,'1');
  if(typeof origCheckStreak==='function')origCheckStreak();
};

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

// Автозаполнение профиля в настройках
function populateSettingsProfile(){
  var u=window._currentUser,ud=window.userData||{};
  var nick=ud.nickname||localStorage.getItem('mt_nickname')||'';
  var avatar=ud.avatar||localStorage.getItem('mt_avatar')||'👤';

  var avatarEl=document.getElementById('settingsAvatarDisplay');
  if(avatarEl)avatarEl.textContent=avatar;

  var statusEl=document.getElementById('settingsStatus');
  if(statusEl&&u)statusEl.textContent=nick||u.displayName||'Мусульманин';

  var emailEl=document.getElementById('settingsEmail');
  if(emailEl&&u)emailEl.textContent=u.email||'';

  var idEl=document.getElementById('settingsIdDisplay');
  if(idEl&&u)idEl.textContent='ID: '+u.uid;

  var nickInput=document.getElementById('settingsNickInput');
  if(nickInput&&nick)nickInput.value=nick;

  var starsEl=document.getElementById('settingsStarsDisplay');
  if(starsEl)starsEl.textContent='★ '+((ud.stars||{}).totalStars||0);

  var streakEl=document.getElementById('settingsStreakDisplay');
  if(streakEl)streakEl.textContent='🔥 '+((ud.streakData||{}).streak||0);

  var khatmsEl=document.getElementById('settingsKhatmsDisplay');
  if(khatmsEl)khatmsEl.textContent='📖 '+((ud.khatm||{}).completedKhatms||0);

  var hideCheck=document.getElementById('hideFromLeaderboardCheck');
  if(hideCheck)hideCheck.checked=!!ud.hideFromLeaderboard;

  var ayahCheck=document.getElementById('hideAyahWidgetCheck');
  if(ayahCheck)ayahCheck.checked=localStorage.getItem('hide_ayah_widget')==='true';
}
setTimeout(populateSettingsProfile,3500);
setTimeout(populateSettingsProfile,6500);
setTimeout(injectProfile,10000);

// Пикер аватарок
window.openAvatarPicker=function(){
  var emojis=['😊','😎','🧔','👳','🧕','🕌','🌙','⭐','🌟','💫','🔥','💎','👑','🦁','🐪','🌴','📖','🤲','💚','🟢','🔵','🟣','🟡','⚡','❤️','🌺','🪷','🕋','☪️','✨'];
  var o=document.createElement('div');
  o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';
  var h='<div style="background:#1a1410;border:2px solid #f4d03f;border-radius:20px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:16px;color:#f4d03f;margin-bottom:16px;font-weight:600;">Выбери аватарку</div><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">';
  emojis.forEach(function(e){
    h+='<button onclick="window.setAvatar(\''+e+'\');var a=document.getElementById(\'settingsAvatarDisplay\');if(a)a.textContent=\''+e+'\';this.parentElement.parentElement.parentElement.remove();" style="font-size:24px;padding:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;">'+e+'</button>';
  });
  h+='</div><button onclick="this.parentElement.parentElement.remove();" style="margin-top:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#e8dcc8;padding:10px 24px;border-radius:12px;cursor:pointer;">Отмена</button></div>';
  o.innerHTML=h;o.onclick=function(e){if(e.target===o)o.remove();};
  document.body.appendChild(o);
};

console.log('👤 Никнейм/аватар загружен');
})();
