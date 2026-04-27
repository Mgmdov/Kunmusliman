// ========== НИКНЕЙМ + АВАТАР + ID ==========
(function(){
// Установка ника
window.setNickname=function(nick){
  if(!window.userData)return;
  window.userData.nickname=nick;
  if(typeof window.saveData==='function')window.saveData();
  // Обновляем в leaderboard
  var db=window._db,u=window._currentUser;
  if(db&&u&&!u.isAnonymous){
    db.collection('leaderboard').doc(u.uid).update({name:nick}).catch(function(){});
  }
};

// Установка аватара-эмодзи
window.setAvatar=function(emoji){
  if(!window.userData)return;
  window.userData.avatar=emoji;
  if(typeof window.saveData==='function')window.saveData();
  var db=window._db,u=window._currentUser;
  if(db&&u&&!u.isAnonymous){
    db.collection('leaderboard').doc(u.uid).update({avatar:emoji}).catch(function(){});
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
  var nick=ud.nickname||'';
  var avatar=ud.avatar||'👤';
  if(u&&!u.isAnonymous){
    status.textContent=nick||(u.displayName||'Мусульманин');
    if(email)email.textContent=u.email||'';
  }
  // Добавляем поля ника и аватара если их нет
  var profileBlock=status.parentElement;
  if(!profileBlock||profileBlock.querySelector('.nick-input'))return;

  var html='<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;">'+
    '<div style="display:flex;gap:8px;align-items:center;">'+
      '<button class="nick-avatar-btn" onclick="window.openAvatarPicker()" style="width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,0.1);border:2px solid rgba(0,0,0,0.15);font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;" id="avatarDisplay">'+avatar+'</button>'+
      '<input type="text" class="nick-input" placeholder="Введите никнейм" value="'+nick+'" style="flex:1;padding:10px 14px;border-radius:12px;border:1px solid rgba(0,0,0,0.1);font-size:14px;background:rgba(0,0,0,0.03);" oninput="this._changed=true" onblur="if(this._changed){window.setNickname(this.value);this._changed=false;}">'+
    '</div>'+
    '<div style="font-size:11px;color:#888;">ID: '+(u?u.uid:'не авторизован')+'</div>'+
    '<label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">'+
      '<input type="checkbox" '+(ud.hideFromLeaderboard?'checked':'')+' onchange="window.toggleLeaderboardVisibility(this.checked)" style="width:18px;height:18px;">'+
      'Скрыть меня из рейтинга'+
    '</label>'+
  '</div>';

  var div=document.createElement('div');div.innerHTML=html;
  profileBlock.appendChild(div.firstElementChild);
}
setTimeout(injectProfile,3000);
setTimeout(injectProfile,6000);

// Пикер аватарок
window.openAvatarPicker=function(){
  var emojis=['😊','😎','🧔','👳','🧕','🕌','🌙','⭐','🌟','💫','🔥','💎','👑','🦁','🐪','🌴','📖','🤲','💚','🟢','🔵','🟣','🟡','⚡','❤️','🌺','🪷','🕋','☪️','✨'];
  var o=document.createElement('div');
  o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';
  var h='<div style="background:#1a1410;border:2px solid #f4d03f;border-radius:20px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:16px;color:#f4d03f;margin-bottom:16px;font-weight:600;">Выбери аватарку</div><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">';
  emojis.forEach(function(e){
    h+='<button onclick="window.setAvatar(\''+e+'\');document.getElementById(\'avatarDisplay\').textContent=\''+e+'\';this.parentElement.parentElement.parentElement.remove();" style="font-size:24px;padding:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;cursor:pointer;">'+e+'</button>';
  });
  h+='</div><button onclick="this.parentElement.parentElement.remove();" style="margin-top:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#e8dcc8;padding:10px 24px;border-radius:12px;cursor:pointer;">Отмена</button></div>';
  o.innerHTML=h;o.onclick=function(e){if(e.target===o)o.remove();};
  document.body.appendChild(o);
};

console.log('👤 Никнейм/аватар загружен');
})();
