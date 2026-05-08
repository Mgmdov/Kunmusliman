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
function renderChestSVG(type) {
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
      <path d="M 12 40 Q 12 18 50 18 Q 88 18 88 40 Z" fill="url(#cl-${type})" stroke="${c.bodyDark}" stroke-width="0.6"/>
      <rect x="12" y="36" width="76" height="6" fill="url(#cm-${type})"/>
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
  if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
  const ssEl = document.getElementById('chestSelectorStars');
  if (ssEl) ssEl.textContent = starsObj.totalStars;

  // Розыгрыш
  const card = window.rollChestCard(typeId);

  // Сохранить в коллекцию
  const userChest = window.getUserChestCards();
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
  showChestOpening(card, type);
};

// ========== АНИМАЦИЯ ОТКРЫТИЯ ==========
function showChestOpening(card, chestType) {
  const rarity = card.rarity;

  const overlay = document.createElement('div');
  overlay.id = 'chestOpeningOverlay';
  overlay.className = `chest-opening rarity-${rarity}`;

  const cfg = {
    common:    { bg: 'linear-gradient(180deg, #2a2a2e 0%, #0a0a0e 100%)',                                              accent: '#b0b0b4', label: 'ОБЫЧНАЯ',     chance: '70%' },
    rare:      { bg: 'linear-gradient(180deg, #1a2030 0%, #050810 100%)',                                              accent: '#5a8acf', label: 'РЕДКАЯ',      chance: '25-50%' },
    epic:      { bg: 'linear-gradient(180deg, #1f1530 0%, #080410 100%)',                                              accent: '#a878d8', label: 'ЭПИЧЕСКАЯ',   chance: '5-60%' },
    legendary: { bg: 'radial-gradient(ellipse at center, #043860 0%, #021830 60%, #000 100%)',                         accent: '#88dcff', label: 'ЛЕГЕНДАРНАЯ', chance: '13-75%' },
    mythic:    { bg: 'radial-gradient(ellipse at center, #2a1048 0%, #0a0218 70%, #000 100%)',                         accent: '#c060ff', label: 'МИФИЧЕСКАЯ',  chance: '2-25%' }
  }[rarity];

  // Этап 1: показать сундук, потом крышка открывается, потом карта
  overlay.innerHTML = `
    <div class="chest-opening-bg" style="background:${cfg.bg};"></div>
    ${rarity === 'legendary' ? generateWaterParticles() : ''}
    ${rarity === 'mythic' ? generateMythicStars() : ''}

    <div class="chest-opening-content">
      <div class="chest-opening-stage" id="chestOpeningStage">
        <div class="chest-shake-wrapper">
          <div class="chest-svg-large">${renderChestSVG(chestType.id)}</div>
        </div>
        <div class="chest-opening-hint">Открываем…</div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  // Через 1.5 сек показываем карту и убираем сундук
  setTimeout(() => {
    const stage = document.getElementById('chestOpeningStage');
    if (!stage) return;
    stage.innerHTML = `
      <div class="chest-rarity-label" style="color:${cfg.accent};">${cfg.label}</div>
      <div class="chest-rarity-chance" style="color:${cfg.accent};">Шанс выпадения · ${cfg.chance}</div>

      <div class="chest-card-wrapper">
        ${renderChestCardLarge(card)}
      </div>

      <div class="chest-card-name" style="color:${cfg.accent};">${card.name}</div>
      <div class="chest-card-title">${card.title || ''}</div>
      <div class="chest-card-story">${card.story || ''}</div>

      <div class="chest-card-actions">
        <button class="chest-btn-secondary" onclick="closeChestOpening()">Закрыть</button>
        <button class="chest-btn-primary" onclick="closeChestOpening();setTimeout(()=>window.openChestRoll(),300);">К сундукам</button>
      </div>
    `;
  }, 1500);
}

window.closeChestOpening = function() {
  const overlay = document.getElementById('chestOpeningOverlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 300);
  }
  // Обновим коллекцию если открыта
  if (typeof window.renderChestCollection === 'function') {
    setTimeout(() => window.renderChestCollection(), 100);
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

// ========== РЕНДЕР КАРТОЧКИ ==========
window.renderChestCardLarge = function(card) {
  const rarity = card.rarity;
  const isAnimated = rarity === 'legendary' || rarity === 'mythic';
  return `
    <div class="chest-card chest-card-${rarity} ${isAnimated ? 'chest-card-animated' : ''}" onclick="event.stopPropagation();">
      <div class="chest-card-rarity-badge">${rarityLabel(rarity)}</div>
      <div class="chest-card-arabic">${card.arabic}</div>
      <div class="chest-card-bottom">
        <div class="chest-card-card-name">${card.name}</div>
        <div class="chest-card-card-title">${card.title}</div>
      </div>
      ${rarity === 'legendary' ? '<div class="chest-card-orbit"><span>✦</span><span>✦</span><span>✦</span></div>' : ''}
      ${rarity === 'mythic' ? '<div class="chest-card-orbit chest-card-orbit-mythic"><span>✦</span><span>✦</span><span>✦</span><span>✦</span></div><div class="chest-card-shimmer"></div>' : ''}
    </div>
  `;
};

window.renderChestCardSmall = function(card, isOwned) {
  const rarity = card.rarity;
  if (!isOwned) {
    // Полностью скрытая карта — никакой информации
    return `<div class="chest-card-mini chest-card-hidden" onclick="window.showChestCardLocked()">
      <div style="flex:1;display:flex;align-items:center;justify-content:center;font-size:28px;color:rgba(255,255,255,0.15);">?</div>
      <div class="chest-card-bottom"><div class="chest-card-card-name" style="color:rgba(255,255,255,0.2);">Неизвестная</div></div>
    </div>`;
  }
  const isAnimated = (rarity === 'legendary' || rarity === 'mythic');
  return `
    <div class="chest-card-mini chest-card-${rarity} ${isAnimated ? 'chest-card-animated' : ''}"
         onclick="window.showChestCardDetail('${card.id}')">
      <div class="chest-card-rarity-badge">${rarityLabel(rarity)}</div>
      <div class="chest-card-arabic">${card.arabic}</div>
      <div class="chest-card-bottom">
        <div class="chest-card-card-name">${card.name}</div>
      </div>
      ${rarity === 'legendary' ? '<div class="chest-card-orbit"><span>✦</span><span>✦</span><span>✦</span></div>' : ''}
      ${rarity === 'mythic' ? '<div class="chest-card-orbit chest-card-orbit-mythic"><span>✦</span><span>✦</span><span>✦</span><span>✦</span></div><div class="chest-card-shimmer"></div>' : ''}
    </div>
  `;
};

function rarityLabel(r) {
  return { common:'ОБЫЧНАЯ', rare:'РЕДКАЯ', epic:'ЭПИЧЕСКАЯ', legendary:'ЛЕГЕНДАРНАЯ', mythic:'МИФИЧЕСКАЯ' }[r] || '';
}

// Показать карту в коллекции при нажатии
window.showChestCardDetail = function(cardId) {
  const card = window.CHEST_CARDS.find(c => c.id === cardId);
  if (!card) return;
  // делаем простой fullscreen без сундука (карта уже открыта)
  const cfg = {
    common:    { bg: 'linear-gradient(180deg, #2a2a2e 0%, #0a0a0e 100%)', accent: '#b0b0b4', label: 'ОБЫЧНАЯ' },
    rare:      { bg: 'linear-gradient(180deg, #1a2030 0%, #050810 100%)', accent: '#5a8acf', label: 'РЕДКАЯ' },
    epic:      { bg: 'linear-gradient(180deg, #1f1530 0%, #080410 100%)', accent: '#a878d8', label: 'ЭПИЧЕСКАЯ' },
    legendary: { bg: 'radial-gradient(ellipse at center, #043860 0%, #021830 60%, #000 100%)', accent: '#88dcff', label: 'ЛЕГЕНДАРНАЯ' },
    mythic:    { bg: 'radial-gradient(ellipse at center, #2a1048 0%, #0a0218 70%, #000 100%)', accent: '#c060ff', label: 'МИФИЧЕСКАЯ' }
  }[card.rarity];

  const overlay = document.createElement('div');
  overlay.id = 'chestOpeningOverlay';
  overlay.className = `chest-opening rarity-${card.rarity}`;
  overlay.innerHTML = `
    <div class="chest-opening-bg" style="background:${cfg.bg};"></div>
    ${card.rarity === 'legendary' ? generateWaterParticles() : ''}
    ${card.rarity === 'mythic' ? generateMythicStars() : ''}
    <div class="chest-opening-content">
      <div class="chest-opening-stage">
        <div class="chest-rarity-label" style="color:${cfg.accent};">${cfg.label}</div>
        <div class="chest-card-wrapper">${renderChestCardLarge(card)}</div>
        <div class="chest-card-name" style="color:${cfg.accent};">${card.name}</div>
        <div class="chest-card-title">${card.title || ''}</div>
        <div class="chest-card-story">${card.story || ''}</div>
        <div class="chest-card-actions">
          <button class="chest-btn-secondary" onclick="closeChestOpening()">Закрыть</button>
        </div>
      </div>
    </div>
  `;
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
