// ========== КОЛЕСО ФАТХ — UI И ЛОГИКА (ИСПРАВЛЕНО) ==========

window.openFathWheel = function() {
  document.body.style.overflow = 'hidden';
  const existing = document.getElementById('fathWheelOverlay');
  if (existing) existing.remove();
  if (typeof window.fathClaimPending === 'function') window.fathClaimPending();

  const overlay = document.createElement('div');
  overlay.id = 'fathWheelOverlay';
  overlay.className = 'fath-overlay neon-wheel';

  overlay.innerHTML = `
    <div class="fath-bg"></div>
    <div class="nw-grid"></div>
    <div class="fath-content">
      <div class="overlay-header" style="position:sticky;top:0;z-index:100;"><button class="overlay-back-btn" onclick="closeFathWheel()">← Назад</button><span class="overlay-title">Колесо наград</span><span style="width:60px;"></span></div>
      <div class="nw-stars">★ <span id="fathStars">0</span></div>
      <div class="nw-stage">
        <div class="nw-pointer"></div>
        <div class="nw-rotator" id="fathWheelRotator">${renderFathWheel()}</div>
        <div class="nw-center"><span>فتح</span></div>
      </div>
      <div class="fath-message" id="fathMessage"></div>
      <div class="fath-actions" id="fathActions"></div>
      <div class="fath-history-section">
        <div class="fath-history-title">Последние выигрыши</div>
        <div class="fath-history-list" id="fathHistoryList">${window.renderRewardsHistoryHTML('wheel')}</div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  refreshFathUI();
  requestAnimationFrame(() => overlay.classList.add('active'));
};

// Состояние кнопки: бесплатный → бонусный → платный (с дневным лимитом)
function fathMode() {
  const stars = parseInt(((window.userData && window.userData.stars) || {}).totalStars || 0);
  if (window.canSpinFathFree()) return { mode: 'free', stars };
  if (window.fathBonusSpins() > 0) return { mode: 'bonus', stars };
  if (window.fathPaidToday() >= window.FATH_PAID_PER_DAY) return { mode: 'limit', stars };
  if (stars >= window.FATH_WHEEL_COST) return { mode: 'paid', stars };
  return { mode: 'poor', stars };
}
function refreshFathUI() {
  const m = fathMode();
  const st = document.getElementById('fathStars'); if (st) st.textContent = m.stars;
  const msg = document.getElementById('fathMessage');
  const act = document.getElementById('fathActions');
  if (!act) return;
  let btn = '';
  let hint = '';
  const bonus = window.fathBonusSpins();
  if (m.mode === 'free') { hint = '🎁 Бесплатный прокрут на сегодня'; btn = '<button class="fath-btn-primary" id="fathSpinBtn" onclick="spinFathWheel()">Крутить · бесплатно</button>'; }
  else if (m.mode === 'bonus') { hint = '🎟 Бонусных прокрутов: ' + bonus; btn = '<button class="fath-btn-primary" id="fathSpinBtn" onclick="spinFathWheel()">Крутить · бонусный</button>'; }
  else if (m.mode === 'paid') { hint = 'Платных сегодня: ' + window.fathPaidToday() + ' / ' + window.FATH_PAID_PER_DAY; btn = `<button class="fath-btn-primary" id="fathSpinBtn" onclick="spinFathWheel()">Крутить · ${window.FATH_WHEEL_COST} ★</button>`; }
  else if (m.mode === 'limit') { hint = 'Лимит платных прокрутов на сегодня исчерпан. Бесплатный — завтра после 00:00.'; btn = '<button class="fath-btn-disabled" disabled>Завтра снова</button>'; }
  else { hint = 'Бесплатный прокрут — завтра'; btn = `<button class="fath-btn-disabled" disabled>Нужно ${window.FATH_WHEEL_COST} ★ (у вас ${m.stars})</button>`; }
  act.innerHTML = btn;
  if (msg && !isSpinning && !msg.dataset.lock) { msg.textContent = hint; msg.style.color = ''; }
}
window.refreshFathUI = refreshFathUI;

window.closeFathWheel = function() {
  document.body.style.overflow = '';
  const overlay = document.getElementById('fathWheelOverlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 300);
  }
};

// Неоновое колесо: сектор i центрирован на угле i*45° от верха по часовой стрелке (как на эскизе).
function renderFathWheel() {
  const prizes = window.FATH_WHEEL_PRIZES;
  const n = prizes.length, A = 360 / n;
  const R = 150, r0 = 62;
  const pt = (ang, rad) => { const t = (ang - 90) * Math.PI / 180; return [(Math.cos(t) * rad), (Math.sin(t) * rad)]; };
  let svg = `<svg viewBox="-170 -170 340 340" width="100%" height="100%" aria-hidden="true">
  <defs>
    <filter id="nwGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="nwGlowSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <radialGradient id="nwBg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#0a1230"/><stop offset="100%" stop-color="#03040d"/></radialGradient>
  </defs>
  <circle r="166" fill="none" stroke="#7a3cff" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="2 5"/>
  <circle r="160" fill="url(#nwBg)" stroke="#2fe6ff" stroke-width="2.4" filter="url(#nwGlow)"/>
  <circle r="155" fill="none" stroke="#c04bff" stroke-opacity=".7" stroke-width="1" stroke-dasharray="14 6"/>`;
  for (let i = 0; i < n; i++) {
    const p = prizes[i], c = p.neon;
    const a0 = i * A - A / 2 + 1.2, a1 = i * A + A / 2 - 1.2;
    const [x1, y1] = pt(a0, R), [x2, y2] = pt(a1, R), [x3, y3] = pt(a1, r0), [x4, y4] = pt(a0, r0);
    const d = `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)} L${x3.toFixed(2)},${y3.toFixed(2)} A${r0},${r0} 0 0,0 ${x4.toFixed(2)},${y4.toFixed(2)} Z`;
    svg += `<path d="${d}" fill="${c}" fill-opacity=".10"/>`;
    svg += `<path d="${d}" fill="none" stroke="${c}" stroke-width="2" filter="url(#nwGlow)"/>`;
    // «схемные» линии внутри сектора
    const [m1x, m1y] = pt(i * A, R - 10), [m2x, m2y] = pt(i * A, r0 + 8);
    svg += `<line x1="${m1x.toFixed(1)}" y1="${m1y.toFixed(1)}" x2="${m2x.toFixed(1)}" y2="${m2y.toFixed(1)}" stroke="${c}" stroke-opacity=".16" stroke-width="1" stroke-dasharray="1 5"/>`;
    // подпись
    const [tx, ty] = pt(i * A, 108);
    const isStar = p.type === 'stars';
    const label = isStar ? `${p.amount} <tspan font-size="15">★</tspan>` : p.label;
    svg += `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${((i * A > 90 && i * A < 270) ? i * A + 180 : i * A).toFixed(2)})">
      <text text-anchor="middle" dominant-baseline="middle" font-family="Rubik,Montserrat,system-ui,sans-serif" font-weight="700" font-size="${isStar ? 22 : 18}" fill="${c}" filter="url(#nwGlow)">${label}</text>
      <text text-anchor="middle" dominant-baseline="middle" font-family="Rubik,Montserrat,system-ui,sans-serif" font-weight="700" font-size="${isStar ? 22 : 18}" fill="#fff" fill-opacity=".55">${label}</text>
    </g>`;
  }
  // деления обода
  for (let k = 0; k < 48; k++) {
    const [ax, ay] = pt(k * 7.5, 158), [bx, by] = pt(k * 7.5, k % 2 ? 154 : 151);
    svg += `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#2fe6ff" stroke-opacity=".5" stroke-width="1"/>`;
  }
  svg += `<circle r="${r0}" fill="#02030a" stroke="#2fe6ff" stroke-width="2" filter="url(#nwGlow)"/><circle r="${r0 - 6}" fill="none" stroke="#7a3cff" stroke-opacity=".6" stroke-dasharray="3 4"/>`;
  svg += `</svg>`;
  return svg;
}

let isSpinning = false;
let currentRotation = 0;

window.spinFathWheel = function() {
  if (isSpinning) return;
  const m = fathMode();
  if (m.mode === 'limit' || m.mode === 'poor') return;
  isSpinning = true;
  const msg0 = document.getElementById('fathMessage');
  if (msg0) { msg0.dataset.lock = '1'; msg0.textContent = '…'; }
  const act = document.getElementById('fathActions'); if (act) act.innerHTML = '<button class="fath-btn-disabled" disabled>Крутится…</button>';

  // Оплата
  if (m.mode === 'free') window.markFathFreeSpinUsed();
  else if (m.mode === 'bonus') window.fathUseBonusSpin();
  else {
    const so = window.userData.stars || { totalStars: 0 };
    so.totalStars = Math.max(0, parseInt(so.totalStars || 0) - window.FATH_WHEEL_COST);
    window.userData.stars = so;
    window.fathMarkPaid();
    if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
    if (typeof window.refreshStarBalances === 'function') window.refreshStarBalances();
  }
  const st = document.getElementById('fathStars'); if (st) st.textContent = parseInt((window.userData.stars || {}).totalStars || 0);

  const result = window.rollFathWheel();
  const prize = result.prize;
  // сохраняем приз ДО анимации: если закрыть приложение посреди прокрута — он не пропадёт
  try { localStorage.setItem('fath_pending_v1', JSON.stringify({ idx: result.index, ts: Date.now() })); } catch (e) {}
  if (typeof window.saveData === 'function') window.saveData();

  const prizes = window.FATH_WHEEL_PRIZES;
  const sectorAngle = 360 / prizes.length;
  // сектор i центрирован на i*sectorAngle от верха; чтобы он оказался под указателем, крутим на -(i*A)
  const targetAngle = (360 - result.index * sectorAngle) % 360;
  const jitter = (Math.random() - 0.5) * (sectorAngle * 0.6);
  currentRotation = currentRotation + 6 * 360 + (targetAngle - (currentRotation % 360) + 360) % 360 + jitter;
  const stageEl = document.querySelector('#fathWheelOverlay .nw-stage');
  if (stageEl) stageEl.classList.add('spinning');
  const rotator = document.getElementById('fathWheelRotator');
  if (rotator) {
    rotator.style.transition = 'transform 5.6s cubic-bezier(0.12, 0.62, 0.12, 1)';
    rotator.style.transform = `rotate(${currentRotation}deg)`;
  }
  setTimeout(() => {
    try { localStorage.removeItem('fath_pending_v1'); } catch (e) {}
    if (stageEl) stageEl.classList.remove('spinning');
    // после остановки докручиваем к центру сектора (jitter убираем плавно)
    currentRotation -= jitter;
    if (rotator) { rotator.style.transition = 'transform .35s ease-out'; rotator.style.transform = `rotate(${currentRotation}deg)`; }
    const w = document.querySelector('#fathWheelOverlay .nw-stage'); if (w) { w.classList.add('win'); setTimeout(() => w.classList.remove('win'), 1600); }
    handleFathPrize(prize);
    if (typeof window.saveData === 'function') window.saveData();
    isSpinning = false;
    const msg = document.getElementById('fathMessage'); if (msg) delete msg.dataset.lock;
    setTimeout(() => { const mm = document.getElementById('fathMessage'); if (mm) { const keep = mm.textContent; mm.dataset.lock = '1'; setTimeout(() => { delete mm.dataset.lock; }, 2500); } refreshFathUI(); }, 50);
  }, 5700);
};

// Выдать приз, который не был получен (приложение закрыли во время прокрута)
window.fathClaimPending = function () {
  let o = null;
  try { o = JSON.parse(localStorage.getItem('fath_pending_v1') || 'null'); } catch (e) {}
  if (!o || isSpinning) return;
  try { localStorage.removeItem('fath_pending_v1'); } catch (e) {}
  const prize = window.FATH_WHEEL_PRIZES[o.idx];
  if (prize && prize.type !== 'chest' && prize.type !== 'card') handleFathPrize(prize);
  else if (prize) handleFathPrize(prize);
};

function handleFathPrize(prize) {
  let msg = '';
  let historyLabel = '';
  const starsObj = window.userData.stars || { totalStars: 0 };

  switch (prize.type) {
    case 'stars':
      if (typeof window.awardStars === 'function') window.awardStars(prize.amount, 'Награда колеса Фатх', 'fath-wheel:'+Date.now()+':'+Math.random().toString(36).slice(2,7)); else { starsObj.totalStars = parseInt(starsObj.totalStars || 0) + prize.amount; window.userData.stars = starsObj; }
      msg = `🎉 Получено: ${prize.amount} ★`;
      historyLabel = prize.amount + ' ★';
      if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
      const fEl = document.getElementById('fathStars');
      if (fEl) fEl.textContent = starsObj.totalStars;
      break;
    case 'chest':
      msg = '🎁 Бесплатный сундук!';
      historyLabel = 'Деревянный сундук';
      // Прямо открываем карту бесплатно
      setTimeout(() => {
        closeFathWheel();
        setTimeout(() => {
          window._freeChestFromWheel = true;
          if (typeof window.openChestOfType === 'function') {
            // Прямой розыгрыш без списания звёзд
            var card = window.rollChestCard('wooden');
            var userChest = window.getUserChestCards ? window.getUserChestCards() : {};
            if (!userChest[card.id]) userChest[card.id] = { firstOpened: Date.now(), count: 1 };
            else userChest[card.id].count++;
            window.addRewardToHistory({ source: 'wheel', type: 'card', label: card.name, rarity: card.rarity, chestType: 'Бесплатный' });
            if (typeof window.saveData === 'function') window.saveData();
            if (typeof window.showChestCardDetail === 'function') window.showChestCardDetail(card.id);
          }
        }, 400);
      }, 1500);
      break;
    case 'card': {
      const pool = window.CHEST_CARDS.filter(c => c.rarity === 'common' || c.rarity === 'rare');
      const card = pool[Math.floor(Math.random() * pool.length)];
      const userChest = window.getUserChestCards();
      if (!userChest[card.id]) {
        userChest[card.id] = { firstOpened: Date.now(), count: 1 };
      } else {
        userChest[card.id].count++;
      }
      msg = `🎴 Карта: ${card.name}`;
      historyLabel = card.name;
      window.addRewardToHistory({
        source: 'wheel', type: 'card', label: card.name, rarity: card.rarity
      });
      setTimeout(() => {
        closeFathWheel();
        setTimeout(() => {
          if (typeof window.showChestCardDetail === 'function') window.showChestCardDetail(card.id);
        }, 400);
      }, 1500);
      // Возвращаемся раньше — не пишем повторно в историю
      const messageEl = document.getElementById('fathMessage');
      if (messageEl) {
        messageEl.textContent = msg;
        messageEl.style.color = '#f4d03f';
        messageEl.style.fontWeight = '600';
      }
      updateFathButton();
      return;
    }
    case 'nothing':
      msg = '🌙 Пусто. Завтра попробуй ещё раз.';
      historyLabel = 'Пусто';
      break;
  }

  // Записать в историю (если ещё не записали)
  if (prize.type !== 'card') {
    window.addRewardToHistory({
      source: 'wheel', type: prize.type, label: historyLabel
    });
  }

  // Обновим отображённую историю в окне колеса
  const list = document.getElementById('fathHistoryList');
  if (list) list.innerHTML = window.renderRewardsHistoryHTML('wheel');

  const messageEl = document.getElementById('fathMessage');
  if (messageEl) {
    messageEl.textContent = msg;
    messageEl.style.color = '#f4d03f';
    messageEl.style.fontWeight = '600';
  }
  updateFathButton();
}

function updateFathButton() { refreshFathUI(); }

console.log('🎡 Колесо Фатх готово (исправлено)');
