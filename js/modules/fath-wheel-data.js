// ========== КОЛЕСО ФАТХ (فتح) — ПРИЗЫ И ЛОГИКА ==========

window.FATH_WHEEL_PRIZES = [
  // порядок по часовой стрелке от верхнего сектора — как на неоновом колесе
  { id: 'stars_10',   label: '10 ★',     type: 'stars',   amount: 10,  weight: 24, neon: '#c04bff' },
  { id: 'stars_25_a', label: '25 ★',     type: 'stars',   amount: 25,  weight: 17, neon: '#43ff6a' },
  { id: 'stars_50',   label: '50 ★',     type: 'stars',   amount: 50,  weight: 10, neon: '#ff8a2a' },
  { id: 'chest',      label: 'Сундук',   type: 'chest',   amount: 1,   weight: 6,  neon: '#c04bff' },
  { id: 'stars_25_b', label: '25 ★',     type: 'stars',   amount: 25,  weight: 17, neon: '#43ff6a' },
  { id: 'card',       label: 'Карта',    type: 'card',    amount: 1,   weight: 6,  neon: '#2fe6ff' },
  { id: 'stars_100',  label: '100 ★',    type: 'stars',   amount: 100, weight: 2,  neon: '#ff8a2a' },
  { id: 'nothing',    label: 'Пусто',    type: 'nothing', amount: 0,   weight: 18, neon: '#2fe6ff' }
];

window.FATH_WHEEL_COST = 60;
window.FATH_PAID_PER_DAY = 3; // платных прокрутов в сутки // ★ за прокрут после бесплатного

window.rollFathWheel = function() {
  const total = window.FATH_WHEEL_PRIZES.reduce((s, p) => s + p.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < window.FATH_WHEEL_PRIZES.length; i++) {
    roll -= window.FATH_WHEEL_PRIZES[i].weight;
    if (roll <= 0) return { prize: window.FATH_WHEEL_PRIZES[i], index: i };
  }
  return { prize: window.FATH_WHEEL_PRIZES[0], index: 0 };
};

// Проверка можно ли крутить бесплатно сегодня
window.canSpinFathFree = function() {
  const lastSpin = localStorage.getItem('fath_last_free_spin');
  if (!lastSpin) return true;
  const lastDate = window.kunLocalDay ? window.kunLocalDay(parseInt(lastSpin)) : new Date(parseInt(lastSpin)).toDateString();
  const today = window.kunLocalDay ? window.kunLocalDay() : new Date().toDateString();
  return lastDate !== today;
};

window.markFathFreeSpinUsed = function() {
  localStorage.setItem('fath_last_free_spin', String(Date.now()));
};

// бонусные прокруты (за серию / сундуки) и дневной лимит платных
window.fathBonusSpins = function () { try { return Math.max(0, parseInt(localStorage.getItem('fath_bonus_spins') || '0', 10) || 0); } catch (e) { return 0; } };
window.fathUseBonusSpin = function () { try { var n = window.fathBonusSpins(); if (n > 0) { localStorage.setItem('fath_bonus_spins', String(n - 1)); return true; } } catch (e) {} return false; };
window.fathPaidToday = function () { try { var o = JSON.parse(localStorage.getItem('fath_paid_v1') || '{}'); var d = window.kunLocalDay ? window.kunLocalDay() : ''; return o.day === d ? (o.n || 0) : 0; } catch (e) { return 0; } };
window.fathMarkPaid = function () { try { var d = window.kunLocalDay ? window.kunLocalDay() : ''; localStorage.setItem('fath_paid_v1', JSON.stringify({ day: d, n: window.fathPaidToday() + 1 })); } catch (e) {} };

console.log('🎡 Колесо Фатх загружено:', window.FATH_WHEEL_PRIZES.length, 'призов');
