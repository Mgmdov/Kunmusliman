// ========== КОЛЕСО ФАТХ — UI И ЛОГИКА (ИСПРАВЛЕНО) ==========

window.openFathWheel = function() {
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  const existing = document.getElementById('fathWheelOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'fathWheelOverlay';
  overlay.className = 'fath-overlay';

  const isFree = window.canSpinFathFree();
  const starsObj = (window.userData && window.userData.stars) || { totalStars: 0 };
  const stars = parseInt(starsObj.totalStars || 0);
  const canPaySpin = stars >= window.FATH_WHEEL_COST;

  overlay.innerHTML = `
    <div class="fath-bg"></div>
    <div class="fath-content">
      <button class="fath-close" onclick="closeFathWheel()">✕</button>

      <div class="fath-header">
        <div class="fath-title-arabic">فتح</div>
        <div class="fath-title-russian">Фатх · Колесо Фортуны</div>
        <div class="fath-stars">★ <span id="fathStars">${stars}</span></div>
      </div>

      <div class="fath-wheel-stage">
        <div class="fath-wheel-pointer"></div>
        <div class="fath-wheel-rotator-wrapper">
          <div class="fath-wheel-rotator" id="fathWheelRotator">
            ${renderFathWheel()}
          </div>
        </div>
        <div class="fath-wheel-center">
          <div class="fath-wheel-center-arabic">فتح</div>
        </div>
      </div>

      <div class="fath-message" id="fathMessage">
        ${isFree ? '🎁 Бесплатный прокрут доступен сегодня' : `Бесплатный прокрут: завтра`}
      </div>

      <div class="fath-actions">
        ${isFree
          ? '<button class="fath-btn-primary" id="fathSpinBtn" onclick="spinFathWheel(true)">Крутить · бесплатно</button>'
          : canPaySpin
            ? `<button class="fath-btn-primary" id="fathSpinBtn" onclick="spinFathWheel(false)">Крутить · ${window.FATH_WHEEL_COST} ★</button>`
            : `<button class="fath-btn-disabled" disabled>Нужно ${window.FATH_WHEEL_COST} ★ (у вас ${stars})</button>`}
      </div>

      <div class="fath-history-section">
        <div class="fath-history-title">Последние выигрыши</div>
        <div class="fath-history-list" id="fathHistoryList">
          ${window.renderRewardsHistoryHTML('wheel')}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
};

window.closeFathWheel = function() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  const overlay = document.getElementById('fathWheelOverlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 300);
  }
};

// ВНИМАНИЕ: SVG отрисовываем БЕЗ внутреннего <g transform>.
// Вращение делаем через CSS на внешнем DIV-обёртке (.fath-wheel-rotator).
// Это изолирует от любых тем-стилей, которые могли ломать transform-origin.
function renderFathWheel() {
  const prizes = window.FATH_WHEEL_PRIZES;
  const sectorAngle = 360 / prizes.length;

  let svg = `<svg viewBox="-150 -150 300 300" width="280" height="280">`;

  // обод (тонкий золотой)
  svg += `<circle cx="0" cy="0" r="142" fill="none" stroke="#f4d03f" stroke-width="3"/>`;
  svg += `<circle cx="0" cy="0" r="138" fill="none" stroke="#8b6914" stroke-width="1"/>`;

  // Сектора
  for (let i = 0; i < prizes.length; i++) {
    // Секторы рисуем относительно того что 0 градусов = вверх
    // i-й сектор начинается с угла -90 + i*sectorAngle (CSS-стиль) → SVG: i*sectorAngle - 90
    const startAngle = -90 + i * sectorAngle;
    const endAngle = startAngle + sectorAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = (Math.cos(startRad) * 138).toFixed(2);
    const y1 = (Math.sin(startRad) * 138).toFixed(2);
    const x2 = (Math.cos(endRad) * 138).toFixed(2);
    const y2 = (Math.sin(endRad) * 138).toFixed(2);
    svg += `<path d="M0,0 L${x1},${y1} A138,138 0 0,1 ${x2},${y2} Z" fill="${prizes[i].color}" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>`;

    // Текст внутри сектора — на радиусе 88 (центр сектора)
    const midAngle = startAngle + sectorAngle / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const tx = (Math.cos(midRad) * 88).toFixed(2);
    const ty = (Math.sin(midRad) * 88).toFixed(2);
    // Поворачиваем текст так, чтобы он "смотрел наружу"
    const textRotate = (midAngle + 90).toFixed(2);
    svg += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="14" font-weight="700" transform="rotate(${textRotate} ${tx} ${ty})" style="text-shadow:0 1px 2px rgba(0,0,0,0.7);">${prizes[i].label}</text>`;
  }

  svg += `</svg>`;
  return svg;
}

let isSpinning = false;
let currentRotation = 0;

window.spinFathWheel = function(isFree) {
  if (isSpinning) return;
  const btn = document.getElementById('fathSpinBtn');
  if (!btn || btn.disabled) return;

  isSpinning = true;
  btn.disabled = true;
  btn.style.opacity = '0.5';

  // Списание звёзд если платно
  if (!isFree) {
    if (!window.userData) { isSpinning = false; return; }
    const starsObj = window.userData.stars || { totalStars: 0 };
    const stars = parseInt(starsObj.totalStars || 0);
    if (stars < window.FATH_WHEEL_COST) {
      btn.disabled = false;
      btn.style.opacity = '1';
      isSpinning = false;
      return;
    }
    starsObj.totalStars = stars - window.FATH_WHEEL_COST;
    window.userData.stars = starsObj;
    if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
    const fEl = document.getElementById('fathStars');
    if (fEl) fEl.textContent = starsObj.totalStars;
  } else {
    window.markFathFreeSpinUsed();
  }

  // Розыгрыш
  const result = window.rollFathWheel();
  const prize = result.prize;
  const prizeIndex = result.index;
  const prizes = window.FATH_WHEEL_PRIZES;
  const sectorAngle = 360 / prizes.length;

  // Указатель указывает СТРОГО ВВЕРХ (на угол -90 в SVG-координатах)
  // Сектор i имеет середину на угле: -90 + i*sectorAngle + sectorAngle/2 (в SVG)
  // Чтобы выпавший сектор оказался ПОД указателем (вверху), нужно повернуть
  // колесо так, чтобы (-90 - sectorMidOffset) совпал с верхом.
  // sectorMidOffset = i*sectorAngle + sectorAngle/2 (от верха по часовой)
  // Поворот по часовой = -(sectorMidOffset)
  // Плюс несколько полных оборотов для эффектности.
  const sectorMidOffset = prizeIndex * sectorAngle + sectorAngle / 2;
  const fullRotations = 6; // 6 полных оборотов
  // Целевой угол (от 0): нам нужно чтобы текущий сектор "пришёл" под указатель
  // Если крутим по часовой стрелке (положительный угол в CSS rotate),
  // то сектор смещается, и нам нужен поворот (360 - sectorMidOffset) % 360
  const targetAngle = (360 - sectorMidOffset) % 360;
  // Не меньше предыдущего поворота + полные обороты
  currentRotation = currentRotation + fullRotations * 360 + (targetAngle - (currentRotation % 360) + 360) % 360;

  const rotator = document.getElementById('fathWheelRotator');
  if (rotator) {
    // Включаем плавное замедление
    rotator.style.transition = 'transform 6s cubic-bezier(0.17, 0.67, 0.16, 1)';
    rotator.style.transform = `rotate(${currentRotation}deg)`;
  }

  // Через 6.2 сек обработаем приз
  setTimeout(() => {
    handleFathPrize(prize);
    if (typeof window.saveData === 'function') window.saveData();
    isSpinning = false;
  }, 6200);
};

function handleFathPrize(prize) {
  let msg = '';
  let historyLabel = '';
  const starsObj = window.userData.stars || { totalStars: 0 };

  switch (prize.type) {
    case 'stars':
      starsObj.totalStars = parseInt(starsObj.totalStars || 0) + prize.amount;
      window.userData.stars = starsObj;
      msg = `🎉 Получено: ${prize.amount} ★`;
      historyLabel = prize.amount + ' ★';
      if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
      const fEl = document.getElementById('fathStars');
      if (fEl) fEl.textContent = starsObj.totalStars;
      break;
    case 'chest':
      starsObj.totalStars = parseInt(starsObj.totalStars || 0) + window.CHEST_TYPES.wooden.cost;
      window.userData.stars = starsObj;
      msg = '🎁 Сундук! Открываем…';
      historyLabel = 'Деревянный сундук';
      if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
      setTimeout(() => {
        closeFathWheel();
        setTimeout(() => window.openChestRoll(), 400);
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

function updateFathButton() {
  const btn = document.getElementById('fathSpinBtn');
  if (!btn) return;
  const newStars = parseInt((window.userData.stars || {}).totalStars || 0);
  if (newStars >= window.FATH_WHEEL_COST) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = `Крутить · ${window.FATH_WHEEL_COST} ★`;
    btn.onclick = () => window.spinFathWheel(false);
  } else {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.textContent = `Нужно ${window.FATH_WHEEL_COST} ★`;
  }
}

console.log('🎡 Колесо Фатх готово (исправлено)');
