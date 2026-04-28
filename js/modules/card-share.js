// ========== ШЕРИНГ КАРТОЧЕК — CANVAS → PNG ==========
(function(){
var RARITY_COLORS={common:'#888',rare:'#5a8acf',epic:'#a878d8',legendary:'#88dcff',mythic:'#c060ff'};
var RARITY_BG={common:'#1a1a1e',rare:'#0a1428',epic:'#14082a',legendary:'#081a28',mythic:'#1a0828'};
var RARITY_LABELS={common:'ОБЫЧНАЯ',rare:'РЕДКАЯ',epic:'ЭПИЧЕСКАЯ',legendary:'ЛЕГЕНДАРНАЯ',mythic:'МИФИЧЕСКАЯ'};

window.shareCard=function(cardId){
  var allCards=(window.CHEST_CARDS||[]).concat(window.JUMA_CARDS||[]).concat(window.EASTER_EGG_CARDS||[]);
  var card=allCards.find(function(c){return c.id===cardId;});
  if(!card){alert('Карта не найдена');return;}

  var canvas=document.createElement('canvas');
  canvas.width=600;canvas.height=800;
  var ctx=canvas.getContext('2d');
  var rarity=card.rarity||'common';
  var accentColor=RARITY_COLORS[rarity]||'#888';
  var bgColor=RARITY_BG[rarity]||'#1a1a1e';

  // Фон
  var grad=ctx.createLinearGradient(0,0,0,800);
  grad.addColorStop(0,bgColor);
  grad.addColorStop(1,'#000');
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,600,800);

  // Рамка
  ctx.strokeStyle=accentColor;
  ctx.lineWidth=3;
  ctx.roundRect(20,20,560,760,20);
  ctx.stroke();

  // Внутренняя рамка
  ctx.strokeStyle=accentColor+'40';
  ctx.lineWidth=1;
  ctx.roundRect(35,35,530,730,15);
  ctx.stroke();

  // Лейбл редкости
  ctx.fillStyle=accentColor;
  ctx.font='600 14px -apple-system, sans-serif';
  ctx.textAlign='center';
  ctx.fillText(RARITY_LABELS[rarity]||'КАРТА',300,80);

  // Арабский текст
  ctx.fillStyle='#e8dcc8';
  ctx.font='500 64px Amiri, serif';
  ctx.textAlign='center';
  ctx.fillText(card.arabic||'',300,280);

  // Название
  ctx.fillStyle='#fff';
  ctx.font='500 28px -apple-system, sans-serif';
  ctx.fillText(card.name||'',300,380);

  // Подзаголовок
  ctx.fillStyle=accentColor;
  ctx.font='400 16px -apple-system, sans-serif';
  ctx.fillText(card.title||'',300,415);

  // История — перенос строк
  ctx.fillStyle='rgba(232,220,200,0.8)';
  ctx.font='400 15px -apple-system, sans-serif';
  ctx.textAlign='center';
  var story=card.story||'';
  var words=story.split(' ');
  var lines=[];var line='';
  words.forEach(function(w){
    var test=line+(line?' ':'')+w;
    if(ctx.measureText(test).width>460){lines.push(line);line=w;}
    else line=test;
  });
  if(line)lines.push(line);
  var startY=470;
  lines.slice(0,8).forEach(function(l,i){
    ctx.fillText(l,300,startY+i*24);
  });

  // Водяной знак
  ctx.fillStyle='rgba(255,255,255,0.15)';
  ctx.font='400 13px -apple-system, sans-serif';
  ctx.fillText('Muslim Tracker · mgmdov.github.io',300,760);

  // Конвертируем и шарим
  canvas.toBlob(function(blob){
    if(!blob)return;
    var file=new File([blob],card.name+'.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      navigator.share({
        title:card.name+' — Muslim Tracker',
        text:card.name+' ('+RARITY_LABELS[rarity]+') — '+card.title,
        files:[file]
      }).catch(function(){fallbackShare(canvas);});
    } else {
      fallbackShare(canvas);
    }
  },'image/png');
};

function fallbackShare(canvas){
  // Открываем картинку для скачивания
  var link=document.createElement('a');
  link.download='card.png';
  link.href=canvas.toDataURL('image/png');
  link.click();
}

// Добавляем кнопку «Поделиться» ко всем открытым картам
// Перехватываем showChestCardDetail
var origShow=window.showChestCardDetail;
window.showChestCardDetail=function(cardId){
  if(typeof origShow==='function')origShow(cardId);
  // Добавляем кнопку шеринга в popup
  setTimeout(function(){
    var overlays=document.querySelectorAll('[style*="z-index:9999999"]');
    overlays.forEach(function(o){
      if(o.querySelector('.share-card-btn'))return;
      var closeBtn=o.querySelector('button[onclick*="remove"]');
      if(!closeBtn)return;
      var shareBtn=document.createElement('button');
      shareBtn.className='share-card-btn';
      shareBtn.textContent='Поделиться';
      shareBtn.style.cssText='display:block;margin:12px auto 0;padding:10px 24px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.25);border-radius:12px;color:#5a8acf;font-size:14px;cursor:pointer;';
      shareBtn.onclick=function(e){e.stopPropagation();window.shareCard(cardId);};
      closeBtn.parentElement.insertBefore(shareBtn,closeBtn.nextSibling);
    });
  },500);
};

// Также для fullscreen историй
var origStory=window.showCardStory;
if(typeof origStory==='function'){
  window.showCardStory=function(id,name,emoji,story){
    origStory(id,name,emoji,story);
    setTimeout(function(){
      var overlay=document.getElementById('cardStoryOverlay');
      if(!overlay||overlay.querySelector('.share-card-btn'))return;
      var closeBtn=overlay.querySelector('button[onclick*="remove"]');
      if(!closeBtn)return;
      var shareBtn=document.createElement('button');
      shareBtn.className='share-card-btn';
      shareBtn.textContent='Поделиться';
      shareBtn.style.cssText='display:block;margin:12px auto 0;padding:10px 24px;background:rgba(90,138,207,0.15);border:1px solid rgba(90,138,207,0.25);border-radius:12px;color:#5a8acf;font-size:14px;cursor:pointer;';
      shareBtn.onclick=function(e){e.stopPropagation();window.shareCard(id);};
      closeBtn.parentElement.insertBefore(shareBtn,closeBtn.nextSibling);
    },600);
  };
}

console.log('📤 Шеринг карточек загружен');
})();
