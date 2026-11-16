/* Истории сподвижников: чтение с отдельным подтверждением и одноразовой выдачей карточки. */
(function(){
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function getRead(){ return new Set((userData && userData.readCompanionStories) || []); }
  window.openCompanionStories = function(){
    const people = (typeof SAHABI_DATA !== 'undefined' ? SAHABI_DATA : []);
    const read = getRead();
    const overlay = document.getElementById('companionStoriesOverlay'); if(overlay) overlay.remove();
    const root = document.createElement('div'); root.id='companionStoriesOverlay';
    root.style.cssText='position:fixed;inset:0;z-index:9999998;background:#070d12;color:#eee8d8;overflow-y:auto;padding:18px 14px 30px;box-sizing:border-box;';
    root.innerHTML=`<div style="max-width:760px;margin:0 auto;"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><button class="ios-button secondary" onclick="document.getElementById('companionStoriesOverlay')?.remove()">← Назад</button><span style="color:#e4c36a;font-size:12px;letter-spacing:1px;">سِيَرُ الصَّحَابَة</span></div><h2 style="text-align:center;color:#f1d47b;margin:22px 0 6px;">Истории сподвижников</h2><p style="text-align:center;color:#9aa3a8;font-size:13px;margin:0 0 20px;">Читайте биографии и отмечайте изученные истории, чтобы получить карточку в коллекцию.</p><div id="companionStoriesList" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;">${people.map(p=>{const done=read.has(String(p.id));return `<button type="button" data-companion="${p.id}" style="text-align:left;border:1px solid ${done?'#b8943e':'#33413d'};background:linear-gradient(145deg,#14251f,#0b1214);border-radius:16px;padding:16px;color:#eee8d8;"><span style="color:#e5c56b;font-size:11px;letter-spacing:1px;">${esc(p.arabicTitle||'الصَّحَابَة')}</span><strong style="display:block;margin:8px 0 4px;font-size:16px;">${esc(p.fullName||p.name)}</strong><small style="color:#aeb8b0;">${esc(p.titleMeaning||p.title||'Сподвижник')}</small><span style="display:block;margin-top:12px;color:${done?'#75d5a6':'#d6bd79'};font-size:12px;">${done?'✓ История изучена · карточка получена':'Открыть историю →'}</span></button>`;}).join('')}</div></div>`;
    document.body.appendChild(root);
    root.querySelectorAll('[data-companion]').forEach(btn=>btn.addEventListener('click',()=>openCompanionDetail(Number(btn.dataset.companion))));
  };
  function openCompanionDetail(id){
    const p=(typeof SAHABI_DATA!=='undefined'?SAHABI_DATA:[]).find(x=>x.id===id); if(!p)return;
    const read=getRead(), already=read.has(String(id));
    const old=document.getElementById('companionStoryDetail'); if(old)old.remove();
    const modal=document.createElement('div'); modal.id='companionStoryDetail';
    modal.style.cssText='position:fixed;inset:0;z-index:10000001;background:rgba(2,7,8,.97);overflow-y:auto;padding:22px 16px 32px;box-sizing:border-box;color:#eee8d8;';
    modal.innerHTML=`<div style="max-width:620px;margin:0 auto;"><button class="ios-button secondary" onclick="document.getElementById('companionStoryDetail')?.remove()">← К списку</button><div style="text-align:center;margin:26px 0 8px;color:#e3c16b;font-size:26px;">${esc(p.arabicTitle||'الصَّحَابَة')}</div><h2 style="text-align:center;color:#f0d27a;margin:0 0 6px;">${esc(p.fullName||p.name)}</h2><div style="text-align:center;color:#a9b5ad;margin-bottom:22px;">${esc(p.titleMeaning||p.title||'')}</div><article style="font-size:16px;line-height:1.85;background:#101b18;border:1px solid #34483d;border-radius:18px;padding:20px;">${esc(p.story||'История пока не добавлена.')}</article><p style="font-size:12px;color:#87938d;text-align:center;margin:16px 0;">Карточка выдаётся один раз после подтверждения прочтения.</p><button type="button" id="markCompanionRead" class="ios-button" style="width:100%;background:linear-gradient(135deg,#a77b24,#f0d47a);color:#1b1405;font-weight:700;" ${already?'disabled':''}>${already?'✓ История уже изучена · карточка получена':'Я прочитал историю — получить карточку'}</button></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#markCompanionRead')?.addEventListener('click',()=>{
      if(already)return;
      userData.readCompanionStories ||= [];
      if(!userData.readCompanionStories.includes(String(id))) userData.readCompanionStories.push(String(id));
      if(typeof unlockCardIfNotHave==='function') unlockCardIfNotHave('s'+id);
      if(typeof window.awardStars==='function') window.awardStars(2,'Изучение истории сподвижника: '+(p.fullName||p.name),'story:sahabi:'+id);
      if(typeof window.addXP==='function') window.addXP(100);
      if(typeof window.saveUserData==='function') window.saveUserData();
      if(typeof window.renderCollection==='function') window.renderCollection();
      if(typeof window.updateCollectionBadge==='function') window.updateCollectionBadge();
      if(typeof window.showNotification==='function') window.showNotification('Карточка сподвижника добавлена в коллекцию.');
      modal.remove(); window.openCompanionStories();
    });
  }
})();
