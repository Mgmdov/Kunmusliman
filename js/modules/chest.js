// ========== СУНДУК — ОКНО ВЫБОРА + ОТКРЫТИЕ + ИСТОРИЯ ==========

window.getUserChestCards = function() {
  if (!window.userData) return {};
  if (!window.userData.chestCards) window.userData.chestCards = {};
  return window.userData.chestCards;
};

// ========== ГЛАВНОЕ ОКНО — ВЫБОР СУНДУКА ==========
window.openChestRoll = function() {
  // Гарантия что данные доступны
  if (!window.userData) {
    setTimeout(window.openChestRoll, 600);
    return;
  }
  showChestSelector();
};

function showChestSelector() {
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  // удалим старый если был
  const existing = document.getElementById('chestSelectorOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'chestSelectorOverlay';
  overlay.className = 'chest-selector-overlay';

  const stars = parseInt(((window.userData||{}).stars||{}).totalStars || 0);

  let chestsHtml = '';
  for (const key of ['wooden', 'silver', 'gold', 'emerald']) {
    const t = window.CHEST_TYPES[key];
    const canAfford = stars >= t.cost;
    chestsHtml += `
      <div class="chest-card-select chest-${t.id} ${canAfford ? '' : 'chest-locked-cost'}"
           ${canAfford ? `onclick="window.openChestOfType('${t.id}')"` : ''}>
        <div class="chest-svg-wrapper">
          ${renderChestSVG(t.id)}
        </div>
        <div class="chest-name-line">${t.name}</div>
        <div class="chest-arabic-line">${t.nameArabic}</div>
        <div class="chest-desc-line">${t.description}</div>
        <div class="chest-cost-line">${canAfford ? '★ ' + t.cost : '🔒 ' + t.cost + ' ★'}</div>
      </div>
    `;
  }

  overlay.innerHTML = `
    <div class="chest-selector-bg"></div>
    <div class="chest-selector-content">
      <div class="overlay-header" style="position:sticky;top:0;z-index:100;"><button class="overlay-back-btn" onclick="closeChestSelector()">← Назад</button><span class="overlay-title" style="color:#f4d03f;">Сундуки</span><span style="width:60px;"></span></div>

      <div class="chest-selector-header">
        <div class="chest-selector-title">Сундуки</div>
        <div class="chest-selector-stars">★ <span id="chestSelectorStars">${stars}</span></div>
      </div>

      <div class="chest-selector-grid">
        ${chestsHtml}
      </div>

      <div class="chest-history-section">
        <div class="chest-history-title">История открытий</div>
        <div class="chest-history-tabs">
          <button class="chest-history-tab active" data-filter="all" onclick="window.switchHistoryFilter('all', this)">Все</button>
          <button class="chest-history-tab" data-filter="chest" onclick="window.switchHistoryFilter('chest', this)">📦 Сундуки</button>
          <button class="chest-history-tab" data-filter="wheel" onclick="window.switchHistoryFilter('wheel', this)">🎡 Колесо</button>
        </div>
        <div class="chest-history-list" id="chestHistoryList">
          ${window.renderRewardsHistoryHTML('all')}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
}

window.switchHistoryFilter = function(filter, btn) {
  document.querySelectorAll('.chest-history-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const list = document.getElementById('chestHistoryList');
  if (list) list.innerHTML = window.renderRewardsHistoryHTML(filter);
};

window.closeChestSelector = function() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  const overlay = document.getElementById('chestSelectorOverlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 300);
  }
};

// ========== РЕНДЕР SVG СУНДУКА ==========
function renderChestSVGOld(type) {
  const colors = {
    wooden:  { body: '#8B5A2B', bodyDark: '#4A2E14', lid: '#A0703F', lidDark: '#6B4423', metal: '#f4d03f', metalDark: '#8b6914' },
    silver:  { body: '#9aa8b8', bodyDark: '#5a6878', lid: '#b8c4d4', lidDark: '#7a8898', metal: '#dde8f4', metalDark: '#8a9aae' },
    gold:    { body: '#d4a937', bodyDark: '#7a5e10', lid: '#e6c25a', lidDark: '#9a7a1c', metal: '#fff4ad', metalDark: '#c09020' },
    emerald: { body: '#1d9e75', bodyDark: '#0a4a35', lid: '#3ec299', lidDark: '#1a7058', metal: '#7df0c0', metalDark: '#0a8060' }
  };
  const c = colors[type] || colors.wooden;
  return `
    <svg viewBox="0 0 100 80" width="100" height="80" class="chest-svg">
      <defs>
        <linearGradient id="cb-${type}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${c.body}"/>
          <stop offset="100%" stop-color="${c.bodyDark}"/>
        </linearGradient>
        <linearGradient id="cl-${type}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${c.lid}"/>
          <stop offset="100%" stop-color="${c.lidDark}"/>
        </linearGradient>
        <linearGradient id="cm-${type}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${c.metal}"/>
          <stop offset="100%" stop-color="${c.metalDark}"/>
        </linearGradient>
      </defs>
      <rect x="12" y="40" width="76" height="36" rx="2" fill="url(#cb-${type})" stroke="${c.bodyDark}" stroke-width="0.6"/>
      <path class="chest-lid" d="M 12 40 Q 12 18 50 18 Q 88 18 88 40 Z" fill="url(#cl-${type})" stroke="${c.bodyDark}" stroke-width="0.6"/>
      <rect class="chest-lid-band" x="12" y="36" width="76" height="6" fill="url(#cm-${type})"/>
      <rect x="12" y="60" width="76" height="3" fill="url(#cm-${type})"/>
      <rect x="44" y="42" width="12" height="14" fill="url(#cm-${type})" stroke="${c.metalDark}" stroke-width="0.4"/>
      <circle cx="50" cy="49" r="1.5" fill="${c.bodyDark}"/>
      <ellipse cx="50" cy="26" rx="28" ry="2" fill="#fff" opacity="0.18"/>
    </svg>
  `;
}

// ========== ОТКРЫТИЕ СУНДУКА КОНКРЕТНОГО ТИПА ==========
window.openChestOfType = function(typeId) {
  const type = window.CHEST_TYPES[typeId];
  if (!type) return;

  const starsObj = window.userData.stars || { totalStars: 0 };
  const stars = parseInt(starsObj.totalStars || 0);

  if (stars < type.cost) {
    showSimpleMessage(`Нужно ${type.cost} ★. У вас ${stars} ★`);
    return;
  }

  // Списание
  starsObj.totalStars = stars - type.cost;
  window.userData.stars = starsObj;
  if (typeof window.saveData === 'function') window.saveData();

  // обновим звёзды в UI
  if (typeof window.updateStarsUI === 'function') window.updateStarsUI();
  if (typeof window.refreshStarBalances === 'function') window.refreshStarBalances();
  const ssEl = document.getElementById('chestSelectorStars');
  if (ssEl) ssEl.textContent = starsObj.totalStars;

  // Розыгрыш
  const card = window.rollChestCard(typeId);

  // Сохранить в коллекцию
  const userChest = window.getUserChestCards();
  const isDuplicate = !!userChest[card.id];
  if (!userChest[card.id]) {
    userChest[card.id] = { firstOpened: Date.now(), count: 1 };
  } else {
    userChest[card.id].count++;
  }
  if (typeof window.saveData === 'function') window.saveData();

  // Записать в историю
  window.addRewardToHistory({
    source: 'chest',
    type: 'card',
    label: card.name + ' · ' + (card.title || ''),
    rarity: card.rarity,
    chestType: type.name
  });

  // Показать анимацию открытия
  showChestOpening(card, type, isDuplicate, userChest[card.id].count);
};

// ========== АНИМАЦИЯ ОТКРЫТИЯ ==========
function showChestOpening(card, chestType, isDuplicate = false, ownedCount = 1) {
  const rarity = card.rarity;

  const overlay = document.createElement('div');
  overlay.id = 'chestOpeningOverlay';
  overlay.className = `chest-opening rarity-${rarity}`;

  const cfg = (card.id === 'p24' || card.id === 'prophet_story') ? {bg:'radial-gradient(ellipse at center,#6b4b12 0%,#211505 60%,#000 100%)',accent:'#f5d878',label:'ОСОБАЯ ЗОЛОТАЯ'} : ({
    common:    { bg: 'linear-gradient(180deg, #2a2a2e 0%, #0a0a0e 100%)', accent: '#b0b0b4', label: 'ОБЫЧНАЯ' },
    rare:      { bg: 'linear-gradient(180deg, #1a2030 0%, #050810 100%)', accent: '#5a8acf', label: 'РЕДКАЯ' },
    epic:      { bg: 'linear-gradient(180deg, #1f1530 0%, #080410 100%)', accent: '#a878d8', label: 'ЭПИЧЕСКАЯ' },
    legendary: { bg: 'radial-gradient(ellipse at center, #043860 0%, #021830 60%, #000 100%)', accent: '#88dcff', label: 'ЛЕГЕНДАРНАЯ' },
    mythic:    { bg: 'radial-gradient(ellipse at center, #2a1048 0%, #0a0218 70%, #000 100%)', accent: '#c060ff', label: 'МИФИЧЕСКАЯ' }
  })[rarity];

  // Этап 1: показать сундук, потом крышка открывается, потом карта
  overlay.innerHTML = `
    <div class="chest-opening-bg" style="background:${cfg.bg};"></div>
    ${rarity === 'legendary' ? generateWaterParticles() : ''}
    ${rarity === 'mythic' ? generateMythicStars() : ''}

    <div class="chest-opening-content">
      <div class="chest-opening-stage chest-stage-shaking" id="chestOpeningStage">
        <div class="chest-shake-wrapper">
          <div class="chest-svg-large">${renderChestSVG(chestType.id)}</div>
        </div>
        <div class="chest-opening-hint">Открываем…</div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  // Сначала крышка сундука открывается, затем появляется выпавшая карта.
  setTimeout(() => {
    const stage = document.getElementById('chestOpeningStage');
    if (!stage) return;
    stage.classList.remove('chest-stage-shaking');
    stage.classList.add('chest-stage-opening');
    const chest = stage.querySelector('.chest-shake-wrapper');
    if (chest) chest.classList.add('chest-opening-lid');
  }, 1050);

  setTimeout(() => {
    const stage = document.getElementById('chestOpeningStage');
    if (!stage) return;
    stage.classList.remove('chest-stage-opening');
    stage.classList.add('chest-stage-revealed');
    stage.innerHTML = `
      <div class="chest-rarity-label" style="color:${cfg.accent};">${cfg.label}</div>
      <div class="chest-rarity-chance" style="color:${cfg.accent};">${chestOddsLabel(chestType, rarity)}</div>

      <div class="chest-card-wrapper">
        ${renderChestCardLarge(card)}
      </div>

      <div class="chest-card-name" style="color:${cfg.accent};">${card.name}</div>
      <div class="chest-card-title">${card.title || ''}</div>
      <div class="chest-card-story">${card.story || ''}</div>
      ${isDuplicate ? `<div class="chest-duplicate-note">Дубликат · теперь у вас ${ownedCount} коп. этой карточки</div>` : '<div class="chest-new-note">Новая карточка добавлена в коллекцию</div>'}

      <div class="chest-card-actions">
        <button class="chest-btn-secondary" onclick="closeChestOpening()">Закрыть</button>
        <button class="chest-btn-primary" onclick="closeChestOpening();setTimeout(()=>window.openChestRoll(),300);">К сундукам</button>
      </div>
    `;
  }, 1900);
}

function chestOddsLabel(chestType, rarity) {
  const chance = Number((chestType.chances || {})[rarity] || 0);
  return `Шанс этой редкости в сундуке: ${chance}%`;
}

window.closeChestOpening = function() {
  const overlay = document.getElementById('chestOpeningOverlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 300);
  }
  // Обновим коллекцию если открыта
  // Только если сейчас открыта вкладка «Сундук»: иначе перерисовка подменяет сетку другой вкладки
  // (Сподвижники, Суры и т.д.) списком карточек сундука.
  if (typeof window.renderChestCollection === 'function') {
    setTimeout(() => {
      const chestTab = document.querySelector('#module-collection .collection-tab[data-collection="chest"]');
      if (chestTab && chestTab.classList.contains('active')) window.renderChestCollection();
    }, 100);
  }
  // Обновим историю на странице сундуков
  const list = document.getElementById('chestHistoryList');
  if (list) {
    const activeFilter = (document.querySelector('.chest-history-tab.active')||{}).dataset?.filter || 'all';
    list.innerHTML = window.renderRewardsHistoryHTML(activeFilter);
  }
};

function showSimpleMessage(msg) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = `
    <div style="background:#1a1410;border:2px solid #c0a040;border-radius:16px;padding:24px;max-width:300px;text-align:center;">
      <p style="color:#f4d03f;font-size:18px;margin:0 0 16px;">${msg}</p>
      <button onclick="this.parentElement.parentElement.remove()" style="background:#c0a040;color:#1a1004;border:none;padding:10px 28px;border-radius:24px;font-size:14px;font-weight:600;cursor:pointer;">Закрыть</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

function generateWaterParticles() {
  let html = '<div class="water-particles">';
  for (let i = 0; i < 12; i++) {
    const left = Math.floor(Math.random() * 100);
    const delay = (Math.random() * 3).toFixed(1);
    const dur = (2.5 + Math.random() * 2).toFixed(1);
    const size = 4 + Math.floor(Math.random() * 6);
    html += `<span class="water-drop" style="left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s;width:${size}px;height:${size}px;"></span>`;
  }
  html += '</div>';
  return html;
}

function generateMythicStars() {
  let html = '<div class="mythic-stars">';
  for (let i = 0; i < 24; i++) {
    const left = Math.floor(Math.random() * 100);
    const top = Math.floor(Math.random() * 100);
    const delay = (Math.random() * 3).toFixed(1);
    const size = 4 + Math.floor(Math.random() * 6);
    const isPurple = Math.random() > 0.5;
    html += `<span class="mythic-star" style="left:${left}%;top:${top}%;animation-delay:${delay}s;font-size:${size}px;color:${isPurple?'#c060ff':'#fff'};">✦</span>`;
  }
  html += '</div>';
  return html;
}

// ========== 65 ИНДИВИДУАЛЬНЫХ ВЕКТОРНЫХ СЦЕН ========== 
// Только архитектура, природные мотивы и исторические предметы; священные личности не изображаются.
function renderChestCardArtwork(card, compact = false) {
  const id = String(card.id || 'card');
  const seed = id.split('').reduce((n, ch) => n + ch.charCodeAt(0), 0);
  const text = `${card.name || ''} ${card.title || ''} ${card.story || ''}`.toLowerCase();
  const has = (...words) => words.some(w => text.includes(w));
  let motif = 'desert';
  if (has('слон','абраха','птиц')) motif='elephant';
  else if (has('кааба','зам-зам','чёрный камень','камень')) motif='kaaba';
  else if (has('пещер','хира','саур','гора нур')) motif='cave';
  else if (has('караван','шам','верблюд','торгов')) motif='caravan';
  else if (has('свиток','письм','книг','читай','откровен','аят')) motif='scroll';
  else if (has('мечет','куба','медина','минбар')) motif='mosque';
  else if (has('битв','бадр','ухуд','ров','хайбар','осад','знамя','погон')) motif='fortress';
  else if (has('луна','ночн','мирадж','небес','сидрат','звёзд','звезд')) motif='celestial';
  else if (has('вода','рек','каусар','хавд','жажд','затмен')) motif='water';
  else if (has('пальм','ствол','дерев','сад')) motif='palm';
  else if (has('кольц','печать','перстень','золот','браслет')) motif='seal';
  else if (has('союз','братств','присяг','мир','худайбий')) motif='oasis';
  else if (has('пустын','песк','таиф','абва','могил')) motif='desert';
  else if (card.type === 'juma') motif='mosque';
  else if (card.type === 'sahabi') motif='oasis';
  else if (card.type === 'prophet') motif='celestial';
  else if (card.type === 'surah' || card.type === 'names') motif='scroll';
  else if (card.type === 'achievement') motif='seal';
  const palettes = {
    common:['#c69b62','#6f4c32','#f0d4a0'], rare:['#83a9bd','#294d68','#d8edf5'],
    epic:['#d5a64d','#65451f','#f7df9b'], legendary:['#b89af0','#40336f','#e7d8ff'],
    mythic:['#71d8c1','#164d4c','#d7fff3']
  };
  const [a,b,c] = (card.id === 'p24' || card.id === 'prophet_story') ? ['#f2cf68','#6b4510','#fff0ad'] : (palettes[card.rarity] || palettes.common);
  if (card.id === 'p24' || card.id === 'prophet_story') motif = 'kaaba';
  const variants = seed % 7;
  const motifs = {
    desert:`<path d="M0 112 Q45 ${75+variants} 92 112T220 105V150H0Z" fill="${a}" opacity=".42"/><path d="M0 128 Q70 100 130 128T220 122V150H0Z" fill="${b}" opacity=".7"/><circle cx="${155+variants*3}" cy="${30+variants}" r="13" fill="${c}"/><path d="M30 106q12-28 24 0m-12-1v15M178 105q10-23 20 0m-10 0v12" stroke="${c}" stroke-width="2" fill="none"/>`,
    elephant:`<path d="M0 118Q70 80 130 118T220 110V150H0Z" fill="${a}"/><path d="M80 98q-5-25 18-30 27-5 31 20l-3 17h-45z" fill="${b}"/><path d="M120 87q23-8 23 14t-13 23" stroke="${c}" stroke-width="5" fill="none"/><path d="M90 106v24m24-24v24" stroke="${c}" stroke-width="5"/><g fill="${c}"><path d="M30 32l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z"/></g>`,
    kaaba:`<path d="M0 120Q110 95 220 120V150H0Z" fill="${a}"/><path d="M72 62l38-18 38 18v63H72Z" fill="${b}"/><path d="M72 62l38 17 38-17" stroke="${c}" stroke-width="5" fill="none"/><path d="M72 83h76" stroke="${c}" stroke-width="4"/><rect x="102" y="91" width="17" height="34" fill="${c}" opacity=".65"/><circle cx="110" cy="31" r="12" fill="${c}" opacity=".8"/>`,
    cave:`<path d="M0 150V112Q28 100 48 75Q75 18 110 20Q154 18 175 78Q196 105 220 112V150Z" fill="${a}" opacity=".55"/><path d="M63 150V108Q72 65 110 62Q150 65 158 108V150Z" fill="${b}"/><path d="M81 150V111Q88 83 110 82Q134 83 140 111V150Z" fill="#070b13"/><path d="M28 42l5 10 11 1-8 7 3 11-11-6-9 6 3-11-9-7 11-1z" fill="${c}"/>`,
    caravan:`<path d="M0 116Q65 88 120 116T220 112V150H0Z" fill="${a}"/><g fill="${b}"><path d="M45 100q-8-25 6-27 12-2 12 12 10-8 17 2l9 15h-44zM112 106q-8-26 6-28 12-2 12 13 10-8 17 2l9 13z"/></g><path d="M55 100v18m25-18v18m48-13v13m24-13v13M0 124h220" stroke="${c}" stroke-width="2"/><circle cx="175" cy="35" r="12" fill="${c}"/>`,
    scroll:`<path d="M0 130H220" stroke="${a}" stroke-width="2"/><rect x="73" y="36" width="74" height="82" rx="8" fill="${b}" stroke="${c}" stroke-width="3"/><path d="M85 55h50m-50 12h42m-42 12h47m-47 12h33" stroke="${c}" stroke-width="2" opacity=".8"/><circle cx="73" cy="77" r="8" fill="${a}"/><circle cx="147" cy="77" r="8" fill="${a}"/><path d="M25 110q25-18 42 0m86 0q20-18 42 0" stroke="${c}" fill="none"/>`,
    mosque:`<path d="M0 135H220" stroke="${c}" stroke-width="2"/><path d="M48 135V88Q48 51 110 51Q172 51 172 88V135Z" fill="${b}" stroke="${c}" stroke-width="2"/><path d="M87 135V96Q87 72 110 72Q133 72 133 96V135" fill="#080d18" stroke="${a}" stroke-width="2"/><path d="M35 135V67h12V135m126 0V67h12V135" fill="${a}"/><path d="M31 67q10-20 20 0m118 0q10-20 20 0" fill="none" stroke="${c}" stroke-width="3"/>`,
    fortress:`<path d="M0 130H220" stroke="${c}" stroke-width="2"/><path d="M45 130V76h25V58h18v18h44V58h18v18h25v54Z" fill="${b}" stroke="${c}" stroke-width="2"/><path d="M92 130V99q18-25 36 0v31" fill="#070b13"/><path d="M30 48l8 8-8 8-8-8zM190 40l7 7-7 7-7-7z" fill="${c}"/>`,
    celestial:`<circle cx="110" cy="68" r="42" fill="${b}" opacity=".6"/><path d="M126 25a25 25 0 1 0 25 40 28 28 0 1 1-25-40" fill="${c}"/><g fill="${c}"><path d="M48 28l4 10 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1zM181 81l3 7 8 1-6 5 2 8-7-5-7 5 2-8-6-5 8-1z"/></g><path d="M0 132Q110 110 220 132V150H0Z" fill="${a}" opacity=".45"/>`,
    water:`<path d="M0 88Q28 72 55 88T110 88T165 88T220 88V150H0Z" fill="${b}"/><path d="M0 105Q28 89 55 105T110 105T165 105T220 105M0 125Q28 109 55 125T110 125T165 125T220 125" stroke="${c}" stroke-width="2" fill="none"/><circle cx="160" cy="35" r="13" fill="${a}"/><path d="M48 80q10-20 20 0" stroke="${c}" stroke-width="2" fill="none"/>`,
    palm:`<path d="M0 130Q110 105 220 130V150H0Z" fill="${a}"/><path d="M105 132Q112 84 108 42" stroke="${b}" stroke-width="7" fill="none"/><path d="M108 48q-38-28-58-5 35-4 58 15m0-10q35-35 66-14-40 0-65 25m-1-12q-5-38-28-43 18 25 22 50m7-5q22-40 43-36-25 18-36 48" fill="${c}"/><circle cx="110" cy="28" r="3" fill="${a}"/>`,
    seal:`<circle cx="110" cy="78" r="46" fill="${b}" stroke="${c}" stroke-width="4"/><circle cx="110" cy="78" r="34" fill="none" stroke="${a}" stroke-width="2"/><path d="M110 47l9 22 24 2-18 15 6 23-21-13-21 13 6-23-18-15 24-2z" fill="${c}" opacity=".8"/><path d="M30 130H190" stroke="${a}" stroke-width="2"/>`,
    oasis:`<path d="M0 110Q55 80 110 110T220 110V150H0Z" fill="${a}"/><path d="M0 130Q55 100 110 130T220 130" fill="${b}"/><path d="M95 95q15-20 30 0m-15-1v30" stroke="${c}" stroke-width="3" fill="none"/><circle cx="110" cy="55" r="16" fill="${c}" opacity=".7"/>`
  };
  const scene = motifs[motif] || motifs.desert;
  const ornaments = Array.from({length: 3 + variants}, (_,i) => `<circle cx="${18+i*31}" cy="${18+(i*17+variants*3)%42}" r="${1.5+(i%2)}" fill="${c}" opacity=".65"/>`).join('');
  const safe = id.replace(/[^a-zA-Z0-9_-]/g,'');
  return `<div class="chest-card-art ${compact ? 'chest-card-art-compact' : ''}" aria-hidden="true" data-art="${motif}" data-card="${safe}"><svg viewBox="0 0 220 150" preserveAspectRatio="xMidYMid slice" focusable="false"><defs><linearGradient id="artSky-${safe}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="#05070d"/></linearGradient></defs><rect width="220" height="150" fill="url(#artSky-${safe})"/>${scene}${ornaments}<g opacity=".22" fill="none" stroke="${c}" stroke-width="1"><circle cx="110" cy="75" r="58"/><path d="M110 7l9 9-9 9-9-9zM110 125l9 9-9 9-9-9z"/></g></svg></div>`;
}

window.renderChestCardArtwork = renderChestCardArtwork;

function escapeChestText(value) { return String(value == null ? '' : value).replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch])); }
function collectionCardArabic(card) { return card.arabic || card.arabicTitle || ({sahabi:'الصَّحَابَة',juma:'الْجُمُعَة',prophet:'الْأَنْبِيَاء',surah:'الْقُرْآن',names:'أَسْمَاءُ اللّٰهِ',achievement:'إِنْجَاز'}[card.type]) || card.emoji || '۞'; }
window.collectionCardArabic = collectionCardArabic;

// ========== РЕНДЕР КАРТОЧКИ ==========
window.renderChestCardLarge = function(card) {
  const rarity = ['common','rare','epic','legendary','mythic'].includes(card.rarity) ? card.rarity : 'common';
  const isAnimated = rarity === 'legendary' || rarity === 'mythic';
  const visual = {...card, rarity, arabic:collectionCardArabic(card)};
  return `
    <div class="chest-card chest-card-${rarity} ${(card.id === 'p24' || card.id === 'prophet_story') ? 'chest-card-prophet-seal' : ''} ${isAnimated ? 'chest-card-animated' : ''}" onclick="event.stopPropagation();">
      <div class="chest-card-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="chest-card-topline"><span class="chest-card-series">КОЛЛЕКЦИЯ · ${escapeChestText(card.id || '') .toUpperCase()}</span><div class="chest-card-rarity-badge">${(card.id === 'p24' || card.id === 'prophet_story') ? 'УНИКАЛЬНАЯ' : rarityLabel(rarity)}</div></div>
      ${renderChestCardArtwork(visual)}
      <div class="chest-card-medallion" aria-hidden="true"><span>۞</span></div>
      <div class="chest-card-arabic">${escapeChestText(visual.arabic)}</div>
      <div class="chest-card-bottom"><div class="chest-card-card-name">${escapeChestText(card.name || 'Карточка')}</div><div class="chest-card-card-title">${escapeChestText(card.title || card.titleMeaning || '')}</div></div>
      ${rarity === 'legendary' ? '<div class="chest-card-orbit"><span>✦</span><span>✦</span><span>✦</span></div>' : ''}
      ${rarity === 'mythic' ? '<div class="chest-card-orbit chest-card-orbit-mythic"><span>✦</span><span>✦</span><span>✦</span><span>✦</span></div><div class="chest-card-shimmer"></div>' : ''}
    </div>`;
};

window.renderChestCardSmall = function(card, isOwned) {
  const rarity = ['common','rare','epic','legendary','mythic'].includes(card.rarity) ? card.rarity : 'common';
  if (!isOwned) return `<button type="button" class="chest-card-mini chest-card-hidden" onclick="window.showChestCardLocked()" aria-label="Закрытая карточка"><span style="flex:1;display:flex;align-items:center;justify-content:center;font-size:30px;color:rgba(255,255,255,.18)">?</span><span class="chest-card-bottom"><span class="chest-card-card-name">Неизвестная</span></span></button>`;
  const isAnimated = rarity === 'legendary' || rarity === 'mythic';
  const visual = {...card, rarity, arabic:collectionCardArabic(card)};
  return `
    <button type="button" class="chest-card-mini chest-card-${rarity} ${(card.id === 'p24' || card.id === 'prophet_story') ? 'chest-card-prophet-seal' : ''} ${isAnimated ? 'chest-card-animated' : ''}" onclick="window.showChestCardDetail('${String(card.id || '').replace(/[^a-zA-Z0-9_-]/g,'')}')" aria-label="Открыть историю: ${escapeChestText(card.name || 'карточка')}">
      <span class="chest-card-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="chest-card-topline"><span class="chest-card-series">${escapeChestText(card.id || '').toUpperCase()}</span><span class="chest-card-rarity-badge">${(card.id === 'p24' || card.id === 'prophet_story') ? 'УНИКАЛЬНАЯ' : rarityLabel(rarity)}</span></span>
      ${renderChestCardArtwork(visual, true)}
      <span class="chest-card-medallion" aria-hidden="true"><span>۞</span></span>
      <span class="chest-card-arabic">${escapeChestText(visual.arabic)}</span>
      <span class="chest-card-bottom"><span class="chest-card-card-name">${escapeChestText(card.name || 'Карточка')}</span></span>
      ${rarity === 'legendary' ? '<span class="chest-card-orbit"><span>✦</span><span>✦</span><span>✦</span></span>' : ''}
      ${rarity === 'mythic' ? '<span class="chest-card-orbit chest-card-orbit-mythic"><span>✦</span><span>✦</span><span>✦</span><span>✦</span></span><span class="chest-card-shimmer"></span>' : ''}
    </button>`;
};

function rarityLabel(r) {
  return { common:'ОБЫЧНАЯ', rare:'РЕДКАЯ', epic:'ЭПИЧЕСКАЯ', legendary:'ЛЕГЕНДАРНАЯ', mythic:'МИФИЧЕСКАЯ' }[r] || '';
}

// Показать карту в коллекции при нажатии
window.showChestCardDetail = function(cardId) {
  const card = (window.CHEST_CARDS || []).find(c => c.id === cardId)
    || (typeof getAllCollectionCards === 'function' ? getAllCollectionCards() : (window.ALL_COLLECTION_CARDS || [])).find(c => c.id === cardId);
  if (!card) return;
  const juma = window.JUMA_STORIES && window.JUMA_STORIES[card.id] ? window.JUMA_STORIES[card.id] : null;
  const story = juma?.story || card.story || 'История для этой карточки пока не добавлена.';
  const detailTitle = juma?.title || card.title || card.titleMeaning || '';
  const ayah = juma?.ayah || card.ayah || '';
  const hadith = juma?.hadith || card.hadith || '';
  const rarity = ['common','rare','epic','legendary','mythic'].includes(card.rarity) ? card.rarity : 'common';
  const cfg = (card.id === 'p24' || card.id === 'prophet_story') ? {bg:'radial-gradient(ellipse at center,#6b4b12 0%,#211505 60%,#000 100%)',accent:'#f5d878',label:'ОСОБАЯ ЗОЛОТАЯ'} : ({
    common:{bg:'linear-gradient(180deg,#2a2a2e 0%,#0a0a0e 100%)',accent:'#b0b0b4',label:'ОБЫЧНАЯ'},
    rare:{bg:'linear-gradient(180deg,#1a2030 0%,#050810 100%)',accent:'#83a9bd',label:'РЕДКАЯ'},
    epic:{bg:'linear-gradient(180deg,#302044 0%,#080410 100%)',accent:'#d5a64d',label:'ЭПИЧЕСКАЯ'},
    legendary:{bg:'radial-gradient(ellipse at center,#043860 0%,#021830 60%,#000 100%)',accent:'#88dcff',label:'ЛЕГЕНДАРНАЯ'},
    mythic:{bg:'radial-gradient(ellipse at center,#2a1048 0%,#0a0218 70%,#000 100%)',accent:'#c060ff',label:'МИФИЧЕСКАЯ'}
  }[rarity]);
  const visual = {...card, rarity, title:detailTitle, arabic:collectionCardArabic(card)};
  const old = document.getElementById('chestOpeningOverlay'); if (old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'chestOpeningOverlay'; overlay.className = `chest-opening rarity-${rarity}`;
  overlay.innerHTML = `
    <div class="chest-opening-bg" style="background:${cfg.bg};"></div>
    ${rarity === 'legendary' ? generateWaterParticles() : ''}
    ${rarity === 'mythic' ? generateMythicStars() : ''}
    <div class="chest-opening-content collection-card-detail-content"><div class="chest-opening-stage">
      <div class="chest-rarity-label" style="color:${cfg.accent};">${cfg.label} · ${escapeChestText(card.type || 'КОЛЛЕКЦИЯ').toUpperCase()}</div>
      <div class="chest-card-wrapper">${window.renderChestCardLarge(visual)}</div>
      <div class="chest-card-name" style="color:${cfg.accent};">${escapeChestText(card.name || 'Карточка')}</div>
      <div class="chest-card-title">${escapeChestText(detailTitle)}</div>
      <div class="chest-card-story">${escapeChestText(story)}</div>
      ${ayah ? `<div class="collection-card-source">${escapeChestText(ayah)}</div>` : ''}
      ${hadith ? `<div class="collection-card-source">${escapeChestText(hadith)}</div>` : ''}
      <div class="chest-card-actions"><button class="chest-btn-secondary" onclick="closeChestOpening()">Закрыть</button></div>
    </div></div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
};

window.showChestCardLocked = function() {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = `
    <div style="background:#1a1410;border:1px solid #444;border-radius:16px;padding:24px;max-width:300px;text-align:center;">
      <div style="font-size:48px;color:rgba(255,255,255,0.15);margin:0 0 12px;">?</div>
      <p style="color:#aaa;font-size:16px;margin:0 0 8px;">Карта не открыта</p>
      <p style="color:#666;font-size:13px;margin:0 0 16px;">Откройте сундук, чтобы узнать что внутри</p>
      <button onclick="this.parentElement.parentElement.remove()" style="background:#444;color:#fff;border:none;padding:10px 28px;border-radius:24px;cursor:pointer;">Закрыть</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
};

console.log('📦 Модуль сундука загружен (4 типа)');

// Периодическое обновление badge на иконке сундука
(function startBadgeUpdater() {
  function tick() {
    if (window.userData && window.userData.stars && typeof window.updateStarsDisplay === 'function') {
      window.updateStarsDisplay();
    }
  }
  setTimeout(tick, 1000);
  setTimeout(tick, 3000);
  setInterval(tick, 5000);
})();


// v53: сундуки на настоящих иллюстрациях + световая анимация открытия
function renderChestSVG(type) {
  const t = ['wooden', 'silver', 'gold', 'emerald'].indexOf(type) >= 0 ? type : 'wooden';
  let sparks = '';
  for (let i = 0; i < 14; i++) sparks += '<i style="--a:' + (i * 26 - 170) + 'deg;--d:' + (70 + (i * 37 % 90)) + 'px;--t:' + ((i % 5) * 0.06).toFixed(2) + 's"></i>';
  return '<div class="chest-photo chest-photo-' + t + '"><img src="images/chests/star-' + t + '.jpg" alt="" draggable="false"><span class="cp-rays"></span><span class="cp-flash"></span><span class="cp-sparks">' + sparks + '</span></div>';
}
