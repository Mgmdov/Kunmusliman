/* Kunmusliman — первое знакомство и повторное обучение из раздела «Ещё». */
(function(){
  const KEY = 'kunmusliman_onboarding_v1';
  const slides = [
    {icon:'☪',title:'Добро пожаловать в Kunmusliman',text:'Это личный помощник для поклонения и изучения исламских знаний. Основные разделы находятся в нижней панели: Главная, Коран, Ибадат, Прогресс и Ещё. Начните с нужного вам дела — игровые механики не обязательны.'},
    {icon:'📖',title:'Основные разделы',text:'В разделе «Коран» можно читать Коран и вести Хатм. В «Ибадат» находятся инструменты для намаза, азкаров, зикра и салавата. Отмечайте только то, что действительно выполнили: приложение помогает вести личный учёт.'},
    {icon:'⭐',title:'Как начисляются звёзды и XP',text:'Звёзды профиля начисляются за выполненные ежедневные и недельные задания, достижения, серии входа, отдельные этапы армии и открытие наградных сундуков. Размер награды зависит от конкретного задания; часть наград выдаётся только один раз. В викторине за правильные ответы начисляется XP. Звёзды и XP — игровые показатели приложения: они не измеряют веру, искренность или ценность поклонения.'},
    {icon:'⚔️',title:'Как работает армия',text:'Отряд пополняется за подключённые действия: чтение Корана — +5 воинов; азкары, зикр или салават — +3. Защита от накрутки ограничивает начисления: не чаще одного раза в 5 секунд и не более 10 начислений в сутки. Исторические события открываются по порядку и при достижении нужной численности отряда. После прохождения события открываются его история и коллекционная карточка.'},
    {icon:'🎁',title:'Задания и сокровищница',text:'Ежедневные и недельные задания показывают, что можно выполнить и какой игровой приз предусмотрен. В «Ещё» и разделе прогресса доступны дополнительные награды и сокровищница. У сокровищницы есть собственный ежедневный счётчик — он не заменяет общий баланс звёзд профиля.'},
    {icon:'🎴',title:'Карточки, коллекция и достижения',text:'За предусмотренные действия и этапы можно открывать карточки, достижения и новые истории. Редкость карточки обозначает её место в коллекционной системе, а не религиозную значимость человека или события. Уже открытые карточки можно просматривать в коллекции.'},
    {icon:'🧭',title:'Где найти это обучение снова',text:'Если забудете, как устроены звёзды, армия или награды, откройте нижнюю вкладку «Ещё» → «Обучение по приложению». Обучение можно запускать повторно в любое время. Теперь можно переходить к использованию приложения.'}
  ];
  let index = 0;
  const el = id => document.getElementById(id);
  function close(markSeen=true){
    const modal=el('kunOnboarding'); if(!modal)return;
    modal.style.display='none'; document.body.style.overflow='';
    if(markSeen) localStorage.setItem(KEY,'1');
  }
  function render(){
    const slide=slides[index];
    el('kunOnboardingVisual').textContent=slide.icon;
    el('kunOnboardingTitle').textContent=slide.title;
    el('kunOnboardingText').textContent=slide.text;
    el('kunOnboardingCount').textContent=(index+1)+' / '+slides.length;
    el('kunOnboardingProgress').style.width=((index+1)/slides.length*100)+'%';
    el('kunOnboardingBack').disabled=index===0;
    el('kunOnboardingNext').textContent=index===slides.length-1?'Начать пользоваться':'Далее';
    el('kunOnboardingDots').innerHTML=slides.map((_,i)=>'<i class="'+(i===index?'active':'')+'"></i>').join('');
  }
  window.openKunmuslimanTutorial=function(){
    const modal=el('kunOnboarding'); if(!modal)return;
    index=0; render(); modal.style.display='flex'; document.body.style.overflow='hidden';
  };
  function maybeStart(){
    if(document.getElementById('authModal')?.style.display==='flex')return;
    if(document.getElementById('kunOnboarding')?.style.display==='flex')return;
    if(localStorage.getItem(KEY)==='1')return;
    window.openKunmuslimanTutorial();
  }
  el('kunOnboardingBack')?.addEventListener('click',()=>{if(index>0){index--;render();}});
  el('kunOnboardingNext')?.addEventListener('click',()=>{if(index<slides.length-1){index++;render();}else close(true);});
  el('kunOnboardingSkip')?.addEventListener('click',()=>close(true));
  window.addEventListener('kun:entry-ready',maybeStart);
  if(window.__kunEntryReady) maybeStart();
})();
