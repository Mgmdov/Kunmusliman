// ========== v58: Данные и бэкап — рабочее сохранение прогресса на телефон ==========
(function(){
var FORMAT='kunmusliman-backup',VER=3;
var EXCL=/firebase|auth|token|oauth|google|gapi|^g_state|^__|^amp_/i;
function T(s){return (window.kunT&&window.kunT(s))||s;}
function note(m){try{if(typeof showNotification==='function')showNotification(m);else alert(m);}catch(e){}}
function UD(){try{if(typeof userData!=='undefined'&&userData)return userData;}catch(e){}return window.userData||(window.userData={});}
function store(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(!k||EXCL.test(k))continue;try{o[k]=localStorage.getItem(k);}catch(e){}}return o;}
function pack(){
  var sd={};try{if(typeof specialDaysCounters!=='undefined')sd=JSON.parse(JSON.stringify(specialDaysCounters));}catch(e){}
  return {format:FORMAT,backupVersion:VER,app:'Kunmusliman',exportDate:new Date().toISOString(),userData:JSON.parse(JSON.stringify(UD())),specialDaysCounters:sd,appStorage:store()};
}
function fname(){return 'kunmusliman-backup-'+new Date().toISOString().slice(0,10)+'.json';}
function download(text,name){
  var blob=new Blob([text],{type:'application/json'});
  var url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},4000);
}
function doExport(){
  var text,name=fname();
  try{text=JSON.stringify(pack(),null,2);}catch(e){note(T('Не удалось создать копию')+': '+e.message);return;}
  try{localStorage.setItem('kunmusliman_last_local_backup',new Date().toISOString());}catch(e){}
  var file=null;try{file=new File([text],name,{type:'application/json'});}catch(e){}
  if(file&&navigator.canShare&&navigator.share&&navigator.canShare({files:[file]})){
    // На телефоне открывается системное меню «Сохранить в Файлы / отправить»
    navigator.share({files:[file],title:'Kunmusliman backup'}).then(function(){note(T('Резервная копия создана'));}).catch(function(e){if(e&&e.name==='AbortError')return;download(text,name);note(T('Резервная копия создана'));});
    return;
  }
  download(text,name);note(T('Резервная копия создана'));
}
function copyText(){
  var text=JSON.stringify(pack());
  function ok(){note(T('Скопировано. Вставьте в заметки или отправьте себе'));}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok).catch(fallback);}else fallback();
  function fallback(){var t=document.createElement('textarea');t.value=text;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();try{document.execCommand('copy');ok();}catch(e){note(T('Не удалось скопировать'));}t.remove();}
}
function restore(parsed){
  var incoming=parsed&&(parsed.userData||(parsed.format?null:parsed));
  if(!incoming||typeof incoming!=='object'||Array.isArray(incoming))throw new Error(T('В файле нет данных приложения'));
  if(parsed.format&&parsed.format!==FORMAT)throw new Error(T('Неизвестный формат'));
  if(!confirm(T('Восстановить данные из копии? Текущий прогресс будет заменён.')))return false;
  var ud=UD();
  Object.keys(ud).forEach(function(k){delete ud[k];});
  Object.assign(ud,incoming);
  try{window.userData=ud;}catch(e){}
  if(parsed.specialDaysCounters){try{if(typeof specialDaysCounters!=='undefined')Object.assign(specialDaysCounters,parsed.specialDaysCounters);}catch(e){}}
  var st=parsed.appStorage||parsed.localStorage;
  if(st&&typeof st==='object')Object.keys(st).forEach(function(k){if(!EXCL.test(k)&&typeof st[k]==='string'){try{localStorage.setItem(k,st[k]);}catch(e){}}});
  try{if(typeof ensureFullDataStructure==='function')ensureFullDataStructure();}catch(e){}
  try{if(typeof saveUserData==='function')saveUserData();else if(window.saveData)window.saveData();}catch(e){}
  note(T('Данные восстановлены'));
  setTimeout(function(){location.reload();},900);
  return true;
}
function importText(txt){
  try{restore(JSON.parse(txt));}catch(e){alert(T('Не удалось восстановить копию')+': '+e.message);}
}
// Делегирование: работает и когда меню «Данные» открыто в оверлее
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('#exportDataBtn,#importDataBtn,#copyDataBtn,#pasteDataBtn');if(!b)return;
  e.stopImmediatePropagation();e.preventDefault();
  if(b.id==='exportDataBtn')doExport();
  else if(b.id==='copyDataBtn')copyText();
  else if(b.id==='importDataBtn'){var f=document.querySelector('#settingsDataOverlay #importFileInput')||document.getElementById('importFileInput');if(f){f.value='';f.click();}}
  else if(b.id==='pasteDataBtn'){var t=prompt(T('Вставьте скопированные данные'));if(t)importText(t);}
},true);
document.addEventListener('change',function(e){
  if(!e.target||e.target.id!=='importFileInput')return;
  e.stopImmediatePropagation();
  var f=e.target.files&&e.target.files[0];if(!f)return;
  if(f.size>15*1024*1024){alert(T('Файл слишком большой'));return;}
  var r=new FileReader();r.onload=function(){importText(r.result);};r.onerror=function(){alert(T('Не удалось прочитать файл'));};r.readAsText(f);
},true);
// Добавляем кнопки «Скопировать / Вставить» (запасной путь, если системное меню недоступно)
function addExtra(){
  var imp=document.getElementById('importDataBtn');if(!imp||document.getElementById('copyDataBtn'))return;
  var cs='border-radius:12px;padding:12px;background:var(--set-card,rgba(255,255,255,0.04));border:1px solid rgba(255,255,255,0.1);color:var(--set-mute,rgba(255,255,255,0.6))';
  var c=document.createElement('button');c.className='ios-button';c.id='copyDataBtn';c.style.cssText=cs;c.textContent='Скопировать данные текстом';
  var p=document.createElement('button');p.className='ios-button';p.id='pasteDataBtn';p.style.cssText=cs;p.textContent='Вставить данные из текста';
  imp.parentNode.insertBefore(c,imp.nextSibling);imp.parentNode.insertBefore(p,c.nextSibling);
}
addExtra();document.addEventListener('DOMContentLoaded',addExtra);
window.kunExportBackup=doExport;
})();
