/* v51: продажа дубликатов карточек. Дубль = копия сверх первой (chestCards[id].count - 1).
   Последнюю копию продать нельзя, секретные карты не продаются. */
(function () {
  window.DUPLICATE_PRICES = window.DUPLICATE_PRICES || { common: 5, rare: 15, epic: 40, legendary: 100, mythic: 250 };
  var RN = { common: 'Обычная', rare: 'Редкая', epic: 'Эпическая', legendary: 'Легендарная', mythic: 'Мифическая' };
  var RC = { common: '#9aa3ad', rare: '#4f9cf5', epic: '#b06af0', legendary: '#f0b03c', mythic: '#ff5a6e' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function secret(c) { return /^ee_/.test(c.id) || c.id === 'p24' || c.id === 'prophet_story' || c.secret === true; }
  function price(r) { return window.DUPLICATE_PRICES[r] || window.DUPLICATE_PRICES.common; }
  function cardMap() { var m = {}; (window.ALL_COLLECTION_CARDS || []).concat(window.CHEST_CARDS || []).forEach(function (c) { if (c && c.id && !m[c.id]) m[c.id] = c; }); return m; }
  window.getDuplicateCards = function () {
    var cc = (window.userData && window.userData.chestCards) || {}, m = cardMap(), out = [];
    Object.keys(cc).forEach(function (id) {
      var n = (cc[id] && Number(cc[id].count)) || 0, c = m[id];
      if (!c || secret(c) || n < 2) return;
      out.push({ card: c, id: id, extra: n - 1, price: price(c.rarity || 'common') });
    });
    var rank = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
    return out.sort(function (a, b) { return (rank[b.card.rarity] || 0) - (rank[a.card.rarity] || 0); });
  };
  function sell(id, qty) {
    var cc = window.userData && window.userData.chestCards, e = cc && cc[id]; if (!e) return 0;
    var c = cardMap()[id]; if (!c || secret(c)) return 0;
    var n = Math.min(qty, Math.max(0, (Number(e.count) || 1) - 1)); if (n <= 0) return 0;
    e.count -= n;
    var gain = n * price(c.rarity || 'common');
    if (typeof window.awardStars === 'function') window.awardStars(gain, 'Продажа дубликатов: ' + (c.name || id));
    else { var u = window.userData; u.stars = u.stars || { totalStars: 0 }; u.stars.totalStars = (u.stars.totalStars || 0) + gain; }
    if (typeof window.saveData === 'function') window.saveData();
    return gain;
  }
  window.sellDuplicate = function (id) {
    var g = sell(id, 1); if (!g) return;
    if (typeof showNotification === 'function') showNotification('Дубликат продан · +' + g + ' ★');
    if (typeof renderCollection === 'function') renderCollection();
  };
  window.sellAllDuplicates = function () {
    var list = window.getDuplicateCards(), total = list.reduce(function (s, d) { return s + d.extra * d.price; }, 0), cnt = list.reduce(function (s, d) { return s + d.extra; }, 0);
    if (!cnt) return;
    if (!confirm('Продать все дубликаты (' + cnt + ' шт.) за ' + total + ' ★?\nПо одной копии каждой карточки останется в коллекции.')) return;
    var gained = 0; list.forEach(function (d) { gained += sell(d.id, d.extra); });
    if (typeof showNotification === 'function') showNotification('Продано дубликатов: ' + cnt + ' · +' + gained + ' ★');
    if (typeof renderCollection === 'function') renderCollection();
  };
  window.renderDuplicatesInto = function (grid) {
    var list = window.getDuplicateCards();
    var cnt = list.reduce(function (s, d) { return s + d.extra; }, 0), total = list.reduce(function (s, d) { return s + d.extra * d.price; }, 0);
    var t = document.getElementById('dupesTabCount'); if (t) t.textContent = cnt;
    if (!list.length) { grid.innerHTML = '<div class="dupe-wrap"><div class="dupe-empty">🃏<br>Дубликатов пока нет.<br>Если из сундука выпадет уже имеющаяся карточка, её копию можно будет продать за звёзды.<br><br><small>Обычная ' + price('common') + '★ · Редкая ' + price('rare') + '★ · Эпическая ' + price('epic') + '★ · Легендарная ' + price('legendary') + '★ · Мифическая ' + price('mythic') + '★</small></div></div>'; return; }
    grid.innerHTML = '<div class="dupe-wrap"><div class="dupe-head"><div><b>Дубликатов: ' + cnt + '</b><small>Можно получить ' + total + ' ★</small></div><button type="button" class="dupe-all" onclick="sellAllDuplicates()">Продать все</button></div><div class="dupe-list">' +
      list.map(function (d) {
        var r = d.card.rarity || 'common';
        return '<div class="dupe-row" style="--c:' + RC[r] + '"><div><b>' + esc(d.card.name || d.card.title || 'Карточка') + '</b><small><em>' + RN[r] + '</em> · копий сверх первой: ×' + d.extra + '</small></div><button type="button" class="dupe-sell" onclick="sellDuplicate(\'' + esc(d.id) + '\')">Продать · +' + d.price + ' ★</button></div>';
      }).join('') + '</div></div>';
  };
  // счётчик на вкладке
  function refreshCount() { try { var n = window.getDuplicateCards().reduce(function (s, d) { return s + d.extra; }, 0), t = document.getElementById('dupesTabCount'); if (t) t.textContent = n; } catch (e) {} }
  document.addEventListener('click', function () { setTimeout(refreshCount, 300); });
  setInterval(refreshCount, 5000);
})();
