// ========== КОЛЛЕКЦИЯ КАРТ — ПРЕМИУМ ==========
(function(){
var RARITY_ORDER=['common','rare','epic','legendary','mythic'];
var RARITY_NAMES={common:'Обычные',rare:'Редкие',epic:'Эпические',legendary:'Легендарные',mythic:'Мифические'};
var RARITY_COLORS={common:'#888',rare:'#5a8acf',epic:'#a878d8',legendary:'#88dcff',mythic:'#c060ff'};
var curFilter='all';

function getUserCards(){return(window.userData||{}).chestCards||{};}

window.renderChestCollection=function(){
  var el=document.getElementById('collectionGrid');if(!el)return;
  var all=window.CHEST_CARDS||[];
  var owned=getUserCards();
  var ownedCount=Object.keys(owned).length;
  var total=all.length;
  var pct=Math.round(ownedCount*100/total);

  var h='';
  // Статистика
  h+='<div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">';
  h+='<div style="position:relative;width:64px;height:64px;flex-shrink:0;"><svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="5"/><circle cx="32" cy="32" r="28" fill="none" stroke="#a878d8" stroke-width="5" stroke-linecap="round" stroke-dasharray="176" stroke-dashoffset="'+Math.round(176-(pct/100)*176)+'" transform="rotate(-90 32 32)"/><text x="32" y="36" text-anchor="middle" fill="#a878d8" font-size="14" font-weight="500">'+pct+'%</text></svg></div>';
  h+='<div><div style="font-size:18px;font-weight:500;color:inherit;">'+ownedCount+' / '+total+'</div><div style="font-size:12px;color:rgba(128,128,128,0.5);">карт собрано</div></div>';
  h+='</div>';

  // Фильтры по редкости
  h+='<div style="display:flex;gap:4px;overflow-x:auto;margin-bottom:16px;scrollbar-width:none;">';
  h+='<button onclick="window._colFilter(\'all\')" style="padding:7px 14px;border-radius:8px;border:1px solid '+(curFilter==='all'?'rgba(168,120,216,0.3)':'rgba(255,255,255,0.06)')+';background:'+(curFilter==='all'?'rgba(168,120,216,0.12)':'rgba(255,255,255,0.03)')+';color:'+(curFilter==='all'?'#a878d8':'rgba(128,128,128,0.4)')+';font-size:11px;cursor:pointer;white-space:nowrap;flex-shrink:0;">Все</button>';
  RARITY_ORDER.forEach(function(r){
    var cnt=all.filter(function(c){return c.rarity===r;}).length;
    var ownCnt=all.filter(function(c){return c.rarity===r&&owned[c.id];}).length;
    var col=RARITY_COLORS[r];
    var active=curFilter===r;
    h+='<button onclick="window._colFilter(\''+r+'\')" style="padding:7px 12px;border-radius:8px;border:1px solid '+(active?col+'50':'rgba(255,255,255,0.06)')+';background:'+(active?col+'20':'rgba(255,255,255,0.03)')+';color:'+(active?col:'rgba(128,128,128,0.4)')+';font-size:11px;cursor:pointer;white-space:nowrap;flex-shrink:0;">'+RARITY_NAMES[r]+' '+ownCnt+'/'+cnt+'</button>';
  });
  h+='</div>';

  // Сетка карт
  var filtered=curFilter==='all'?all:all.filter(function(c){return c.rarity===curFilter;});
  h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
  filtered.forEach(function(card){
    var isOwned=!!owned[card.id];
    h+=window.renderChestCardSmall(card,isOwned);
  });
  h+='</div>';

  el.innerHTML=h;
};

window._colFilter=function(f){curFilter=f;window.renderChestCollection();};

// Табы коллекции (Пророк / Джума / 99 Имён / Битвы)
function setupTabs(){
  var tabs=document.querySelectorAll('[data-collection-tab]');
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      tabs.forEach(function(t){t.classList.remove('active');});
      tab.classList.add('active');
    });
  });
}
setTimeout(function(){window.renderChestCollection();setupTabs();},2500);
setTimeout(function(){window.renderChestCollection();},6000);
console.log('🃏 Коллекция v2');
})();
