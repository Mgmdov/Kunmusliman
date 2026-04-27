// ========== ИСТОРИЯ ВЫИГРЫШЕЙ (СУНДУК + КОЛЕСО) ==========
// Хранится в localStorage, последние 30 записей

const HISTORY_KEY = 'mt_rewards_history';
const HISTORY_MAX = 30;

window.getRewardsHistory = function() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch(e) { return []; }
};

window.addRewardToHistory = function(entry) {
  // entry: { source: 'chest'|'wheel', type, label, rarity?, time, chestType? }
  const history = window.getRewardsHistory();
  history.unshift({ ...entry, time: Date.now() });
  if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch(e) {}
};

window.formatRewardTime = function(timestamp) {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'только что';
  if (diff < 3600000) return Math.floor(diff/60000) + ' мин назад';
  if (diff < 86400000) return Math.floor(diff/3600000) + ' ч назад';
  return Math.floor(diff/86400000) + ' дн назад';
};

window.renderRewardsHistoryHTML = function(filter) {
  // filter: 'all' | 'chest' | 'wheel'
  const history = window.getRewardsHistory();
  const filtered = filter && filter !== 'all'
    ? history.filter(h => h.source === filter)
    : history;

  if (filtered.length === 0) {
    return '<div style="text-align:center;padding:24px 12px;color:#888;font-size:13px;">История пуста</div>';
  }

  const rarityColor = {
    common: '#8a8a8e',
    rare: '#5a8acf',
    epic: '#a878d8',
    legendary: '#88dcff',
    mythic: '#c060ff'
  };

  return filtered.map(h => {
    const sourceIcon = h.source === 'chest' ? '📦' : '🎡';
    const color = h.rarity ? rarityColor[h.rarity] : '#f4d03f';
    const timeStr = window.formatRewardTime(h.time);
    return `
      <div class="history-item">
        <div class="history-icon" style="color:${color};">${sourceIcon}</div>
        <div class="history-text">
          <div class="history-label" style="color:${color};">${h.label}</div>
          <div class="history-meta">${h.source === 'chest' ? (h.chestType || 'Сундук') : 'Колесо Фатх'}</div>
        </div>
        <div class="history-time">${timeStr}</div>
      </div>
    `;
  }).join('');
};

console.log('📜 История выигрышей готова:', window.getRewardsHistory().length, 'записей');
