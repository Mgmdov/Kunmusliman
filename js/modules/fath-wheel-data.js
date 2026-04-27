// ========== КОЛЕСО ФАТХ (فتح) — ПРИЗЫ И ЛОГИКА ==========

window.FATH_WHEEL_PRIZES = [
  { id: 'stars_10',   label: '10 ★',     type: 'stars',   amount: 10,  weight: 22, color: '#3a8aff' },
  { id: 'stars_25_a', label: '25 ★',     type: 'stars',   amount: 25,  weight: 18, color: '#a060e8' },
  { id: 'stars_50',   label: '50 ★',     type: 'stars',   amount: 50,  weight: 13, color: '#ff8830' },
  { id: 'chest',      label: 'Сундук',   type: 'chest',   amount: 1,   weight: 8,  color: '#30c060' },
  { id: 'stars_25_b', label: '25 ★',     type: 'stars',   amount: 25,  weight: 18, color: '#3a8aff' },
  { id: 'card',       label: 'Карта',    type: 'card',    amount: 1,   weight: 6,  color: '#e0408a' },
  { id: 'stars_100',  label: '100 ★',    type: 'stars',   amount: 100, weight: 5,  color: '#ff8830' },
  { id: 'nothing',    label: 'Пусто',    type: 'nothing', amount: 0,   weight: 10, color: '#a060e8' }
];

window.FATH_WHEEL_COST = 50; // ★ за прокрут после бесплатного

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
  const lastDate = new Date(parseInt(lastSpin)).toDateString();
  const today = new Date().toDateString();
  return lastDate !== today;
};

window.markFathFreeSpinUsed = function() {
  localStorage.setItem('fath_last_free_spin', String(Date.now()));
};

console.log('🎡 Колесо Фатх загружено:', window.FATH_WHEEL_PRIZES.length, 'призов');
