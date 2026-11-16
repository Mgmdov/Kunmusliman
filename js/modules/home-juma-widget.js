/* Пятничное напоминание: показывается за день до Джума, без постоянного виджета на главной. */
(function(){
 function checkJumaReminder(){
  const now=new Date(); if(now.getDay()!==4) return;
  const key='kun_juma_reminder_'+now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
  if(localStorage.getItem(key)) return;
  localStorage.setItem(key,'1');
  const msg='Завтра пятница — день Джума. Подготовьтесь: прочитайте суру Аль-Кахф, чаще произносите салават и вспомните о пятничных суннах.';
  if(typeof window.showNotification==='function') window.showNotification('🕌 '+msg);
  else setTimeout(()=>{if(typeof window.showNotification==='function')window.showNotification('🕌 '+msg);},1800);
 }
 document.addEventListener('DOMContentLoaded',checkJumaReminder); checkJumaReminder();
})();
