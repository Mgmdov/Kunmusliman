// ========== АНТИФРОД v3 — БЕЗ ЗАДЕРЖКИ ==========
// Нет debounce. Блокировка ТОЛЬКО после 1000 кликов за 1 минуту.
(function(){
var BLOCK_LIMIT=1000;
var CHECK_MS=60000;
var BLOCK_MS=86400000;
var BK='zikr_blocked_until';
var log=[];

function blocked(){var u=parseInt(localStorage.getItem(BK)||'0');if(u>Date.now())return true;if(u>0)localStorage.removeItem(BK);return false;}

document.addEventListener('click',function(e){
  if(!blocked())return;
  var el=e.target,is=false;
  for(var i=0;i<5&&el;i++){
    var id=el.id||'',cl=el.className||'',pid=(el.parentElement||{}).id||'';
    if(id.includes('zikr')||id.includes('tasbih')||pid.includes('module-zikr')||pid.includes('module-tasbih')||cl.includes('zikr')||cl.includes('tasbih')){is=true;break;}
    el=el.parentElement;
  }
  if(!is)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(!document.querySelector('.zb-toast')){
    var m=document.createElement('div');m.className='zb-toast';
    m.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#2a0808;border:1px solid #e05050;border-radius:14px;padding:10px 20px;z-index:9999999;color:#f0a0a0;font-size:13px;';
    var h=Math.ceil((parseInt(localStorage.getItem(BK))-Date.now())/3600000);
    m.textContent='Зикр заблокирован ('+h+' ч)';
    document.body.appendChild(m);setTimeout(function(){m.remove();},3000);
  }
},true);

// Счётчик — только для логирования, без блокировки кликов
document.addEventListener('click',function(e){
  if(blocked())return;
  var el=e.target,is=false;
  for(var i=0;i<5&&el;i++){
    var id=el.id||'',cl=el.className||'',pid=(el.parentElement||{}).id||'';
    if(id.includes('zikr')||id.includes('tasbih')||pid.includes('module-zikr')||pid.includes('module-tasbih')||cl.includes('zikr')||cl.includes('tasbih')){is=true;break;}
    el=el.parentElement;
  }
  if(!is)return;
  var now=Date.now();
  log.push(now);
  log=log.filter(function(t){return t>now-CHECK_MS;});
  if(log.length>=BLOCK_LIMIT){
    localStorage.setItem(BK,String(now+BLOCK_MS));
    log=[];
    var d=document.createElement('div');
    d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';
    d.innerHTML='<div style="background:#2a0808;border:2px solid #e05050;border-radius:20px;padding:28px;max-width:320px;text-align:center;"><div style="font-size:48px;margin-bottom:12px;">&#128683;</div><div style="color:#e05050;font-size:20px;font-weight:700;margin-bottom:8px;">Зикр заблокирован</div><div style="color:#f0a0a0;font-size:14px;line-height:1.6;margin-bottom:20px;">Кнопки зикра заблокированы на 24 часа за накрутку.</div><button onclick="this.parentElement.parentElement.remove();" style="background:#e05050;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:15px;font-weight:600;cursor:pointer;">Закрыть</button></div>';
    document.body.appendChild(d);
  }
});
console.log('🛡️ Антифрод v3 (без задержки)');
})();
