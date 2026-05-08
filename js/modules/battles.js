// ========== БИТВЫ v2 — ВКЛАДКИ + КАРТОЧКА ЗА ПРОЧТЕНИЕ ==========
(function(){
var battles=window.ISLAMIC_BATTLES||[];
var curIdx=0;

function getRead(){try{return JSON.parse(localStorage.getItem('battles_read')||'{}');}catch(e){return {};}}
function setRead(id){var r=getRead();r[id]=Date.now();localStorage.setItem('battles_read',JSON.stringify(r));}

function injectBattles(){
  var el=document.getElementById('battlesContent');
  if(!el||!battles.length)return;
  renderBattle(el,curIdx);
}

function renderBattle(el,idx){
  var b=battles[idx];if(!b)return;
  var read=getRead();var isRead=!!read[b.id];
  var total=battles.length;
  var readCount=Object.keys(read).length;

  var h='';
  // Вкладки сверху
  h+='<div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:8px;margin-bottom:16px;scrollbar-width:none;-webkit-overflow-scrolling:touch;">';
  battles.forEach(function(bt,i){
    var isActive=i===idx;
    var isBtRead=!!read[bt.id];
    h+='<button onclick="window._btGo('+i+')" style="padding:8px 12px;white-space:nowrap;border-radius:10px;border:1px solid '+(isActive?'rgba(226,75,74,0.3)':isBtRead?'rgba(93,202,165,0.2)':'rgba(255,255,255,0.06)')+';background:'+(isActive?'rgba(226,75,74,0.12)':isBtRead?'rgba(93,202,165,0.06)':'rgba(255,255,255,0.03)')+';color:'+(isActive?'#e24b4a':isBtRead?'#5dcaa5':'rgba(255,255,255,0.4)')+';font-size:11px;cursor:pointer;flex-shrink:0;">'+(isBtRead?'✓ ':'')+bt.name+'</button>';
  });
  h+='</div>';

  // Прогресс
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;"><div style="font-size:12px;color:rgba(255,255,255,0.4);">Прочитано: '+readCount+' / '+total+'</div><div style="width:100px;height:4px;background:rgba(255,255,255,0.06);border-radius:2px;"><div style="width:'+Math.round(readCount*100/total)+'%;height:100%;background:#5dcaa5;border-radius:2px;"></div></div></div>';

  // Карточка битвы
  var rarColors={common:'#888',rare:'#5a8acf',epic:'#a878d8',legendary:'#D85A30',mythic:'#c060ff'};
  var col=rarColors[b.rarity]||'#888';

  h+='<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:20px;">';
  h+='<div style="text-align:center;margin-bottom:16px;"><div style="font-family:Amiri,serif;font-size:28px;color:#e8dcc8;">'+b.arabic+'</div><div style="font-size:20px;font-weight:500;color:inherit;margin-top:4px;">'+b.name+'</div><div style="font-size:12px;color:'+col+';margin-top:4px;">'+b.year+'</div></div>';

  // История
  h+='<div style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:16px;">'+b.story+'</div>';

  // Детали
  if(b.details){
    h+='<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px;margin-bottom:16px;"><div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:6px;letter-spacing:0.5px;">ПОДРОБНОСТИ</div><div style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">'+b.details+'</div></div>';
  }

  // Кнопка прочитал
  if(!isRead){
    h+='<button onclick="window._btRead(\''+b.id+'\')" style="width:100%;padding:14px;background:rgba(93,202,165,0.12);border:1px solid rgba(93,202,165,0.25);border-radius:14px;color:#5dcaa5;font-size:15px;font-weight:500;cursor:pointer;">Прочитал — забрать карточку</button>';
  } else {
    h+='<div style="text-align:center;padding:14px;background:rgba(93,202,165,0.06);border-radius:14px;color:#5dcaa5;font-size:14px;">✓ Прочитано</div>';
  }
  h+='</div>';

  // Навигация
  h+='<div style="display:flex;gap:8px;margin-top:14px;">';
  if(idx>0)h+='<button onclick="window._btGo('+(idx-1)+')" style="flex:1;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;color:rgba(255,255,255,0.5);font-size:13px;cursor:pointer;">← '+battles[idx-1].name+'</button>';
  if(idx<total-1)h+='<button onclick="window._btGo('+(idx+1)+')" style="flex:1;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;color:rgba(255,255,255,0.5);font-size:13px;cursor:pointer;">'+battles[idx+1].name+' →</button>';
  h+='</div>';

  el.innerHTML=h;
}

window._btGo=function(idx){curIdx=idx;var el=document.getElementById('battlesContent');if(el)renderBattle(el,idx);};

window._btRead=function(id){
  setRead(id);
  // Награда: 100★ + 50XP
  if(window.userData){
    var s=window.userData.stars||{totalStars:0};
    s.totalStars=(parseInt(s.totalStars)||0)+100;
    window.userData.stars=s;
    if(typeof window.awardXP==='function')window.awardXP(50,'Прочитал битву');
    if(typeof window.updateStarsDisplay==='function')window.updateStarsDisplay();
    if(typeof window.saveData==='function')window.saveData();
  }
  // Показать награду
  var popup=document.createElement('div');
  popup.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:rgba(93,202,165,0.15);border:1px solid rgba(93,202,165,0.3);border-radius:14px;padding:12px 20px;z-index:999999;color:#5dcaa5;font-size:14px;font-weight:500;text-align:center;';
  popup.textContent='+100 ★ · +50 XP';
  document.body.appendChild(popup);
  setTimeout(function(){popup.remove();},3000);
  // Перерисовка
  var el=document.getElementById('battlesContent');if(el)renderBattle(el,curIdx);
};

setTimeout(injectBattles,2000);
setTimeout(injectBattles,5000);
console.log('⚔️ Битвы v2');
})();
