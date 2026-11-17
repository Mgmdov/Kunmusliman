/* Kunmusliman v47: Liquid Glass, виджеты главного экрана, уведомления о намазе */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ================= Liquid Glass ================= */
  var GLASS_KEY = 'kun_glass_v1';
  function glass() {
    var g = Object.assign({ on: true, blur: 18, t: 55 }, lsGet(GLASS_KEY, {}));
    if (lsGet(GLASS_KEY, {}).t == null && lsGet(GLASS_KEY, {}).alpha != null) g.t = Math.max(0, Math.min(100, 100 - lsGet(GLASS_KEY, {}).alpha));
    return g;
  }
  function applyGlass() {
    var g = glass(), r = document.documentElement;
    document.body.classList.toggle('glass-on', !!g.on);
    r.style.setProperty('--g-blur', g.blur + 'px');
    // t — прозрачность 0..100 (100 = полностью прозрачное стекло, виден только фон)
    var k = 1 - g.t / 100;
    r.style.setProperty('--g-alpha', (0.88 * k).toFixed(3));
    r.style.setProperty('--g-k', k.toFixed(3));
    r.style.setProperty('--g-edge', (0.06 + 0.2 * k).toFixed(3));
    r.style.setProperty('--g-shadow', (0.04 + 0.2 * k).toFixed(3));
    document.body.classList.toggle('glass-clear', g.t >= 85);
  }
  window.applyGlass = applyGlass;

  /* ================= Виджеты ================= */
  var W_KEY = 'kun_widgets_v1', H_KEY = 'kun_home_hide_v1';
  function hcfg() { return Object.assign({ all: false, prayer: false, day: false, xp: false, next: false, coll: false }, lsGet(H_KEY, {})); }
  /* v60: «Следующий намаз» и «Моя коллекция» скрываются по отдельности. Переносим старые настройки (общий v47 и переключатели wNext/wColl). */
  function migrateWidgetHide() {
    var raw = lsGet(H_KEY, {}); if (raw.mig === 2) return;
    var w = lsGet(W_KEY, {});
    if (raw.v47) { raw.next = true; raw.coll = true; }
    if (w.next === false) raw.next = true;
    if (w.coll === false) raw.coll = true;
    delete raw.v47; raw.mig = 2; lsSet(H_KEY, raw);
    if (w.next === false || w.coll === false) lsSet(W_KEY, Object.assign(w, { next: true, coll: true }));
  }
  function applyHide() {
    var h = hcfg(), b = document.body; if (!b) return;
    b.classList.toggle('hw-prayer', h.all || h.prayer); b.classList.toggle('hw-day', h.all || h.day);
    b.classList.toggle('hw-next', h.all || h.next); b.classList.toggle('hw-coll', h.all || h.coll); b.classList.toggle('hw-xp', h.all || h.xp);
  }
  window.applyHomeWidgetsHide = applyHide;
  migrateWidgetHide(); document.addEventListener('DOMContentLoaded', applyHide); applyHide();
  function wcfg() { return Object.assign({ next: true, coll: true, cards: [] }, lsGet(W_KEY, {})); }
  var PRAYERS = [['Фаджр', 'homeFajr'], ['Зухр', 'homeDhuhr'], ['Аср', 'homeAsr'], ['Магриб', 'homeMaghrib'], ['Иша', 'homeIsha']];
  function prayerTimes() {
    var out = [], now = new Date();
    PRAYERS.forEach(function (p) {
      var el = $(p[1]), m = el && /(\d{1,2}):(\d{2})/.exec(el.textContent || '');
      if (!m) return;
      var d = new Date(now); d.setHours(+m[1], +m[2], 0, 0);
      out.push({ name: p[0], date: d });
    });
    return out;
  }
  function nextPrayer() {
    var list = prayerTimes(), now = Date.now();
    if (!list.length) return null;
    for (var i = 0; i < list.length; i++) if (list[i].date.getTime() > now) return list[i];
    var f = list[0]; return { name: f.name, date: new Date(f.date.getTime() + 864e5) };
  }
  function ownedCards() {
    var ud = window.userData || {};
    var all = [].concat(typeof getAllCollectionCards === 'function' ? getAllCollectionCards() : [], window.ALL_COLLECTION_CARDS || [], window.CHEST_CARDS || [], window.EASTER_EGG_CARDS || []);
    var own = new Set([].concat(ud.unlockedCards || [], (ud.jumaCards || []).map(function (c) { return typeof c === 'string' ? c : c.id; }), Object.keys(ud.chestCards || {}), Object.keys(ud.easterEggs || {}).filter(function (k) { return ud.easterEggs[k]; })));
    var seen = {}, res = [];
    all.forEach(function (c) { if (c && c.id && own.has(c.id) && !seen[c.id]) { seen[c.id] = 1; res.push(c); } });
    return res;
  }
  var RC = { mythic: '#c084fc', legendary: '#f4c542', epic: '#a78bfa', rare: '#60a5fa', common: '#9ca3af' };
  function cardMini(c) {
    var col = RC[c.rarity] || '#d8b66a';
    return '<div class="w-card" style="--rc:' + col + '"><div class="w-card-art">' + esc(c.arabic || c.emoji || '✦') + '</div><b>' + esc(c.name || '') + '</b></div>';
  }
  function ensureHost() {
    var anchor = $('prayerWidget'); if (!anchor) return null;
    var host = $('v47Widgets');
    if (!host) { host = document.createElement('div'); host.id = 'v47Widgets'; anchor.insertAdjacentElement('afterend', host); }
    return host;
  }
  function renderWidgets() {
    var host = ensureHost(); if (!host) return;
    var c = wcfg(), html = '';
    if (c.next) {
      var n = nextPrayer();
      if (n) {
        var diff = Math.max(0, n.date.getTime() - Date.now()), h = Math.floor(diff / 36e5), m = Math.floor(diff % 36e5 / 6e4);
        var hh = ('0' + n.date.getHours()).slice(-2) + ':' + ('0' + n.date.getMinutes()).slice(-2);
        html += '<div class="widget v47-w v47-next" onclick="openModule(\'prayer\')"><div class="v47-next-l"><small>СЛЕДУЮЩИЙ НАМАЗ</small><b>' + n.name + '</b><span>' + hh + '</span></div><div class="v47-next-r"><strong>' + (h ? h + ' ч ' : '') + m + ' мин</strong><small>осталось</small></div></div>';
      }
    }
    if (c.coll) {
      var own = ownedCards(), pick = (c.cards || []).map(function (id) { return own.find(function (x) { return x.id === id; }); }).filter(Boolean);
      if (pick.length < 3) {
        var rank = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
        own.slice().sort(function (a, b) { return (rank[b.rarity] || 0) - (rank[a.rarity] || 0); }).forEach(function (x) { if (pick.length < 3 && pick.indexOf(x) < 0 && !(c.cards || []).length) pick.push(x); });
      }
      html += '<div class="widget v47-w v47-coll"><div class="v47-coll-h" onclick="openModule(\'collection\')"><small>МОЯ КОЛЛЕКЦИЯ</small><span>' + own.length + ' карт ›</span></div><div class="v47-coll-row">' +
        (pick.length ? pick.map(cardMini).join('') : '<p class="v47-empty">Откройте первую карточку в сундуке</p>') +
        '</div><button type="button" class="v47-pick" onclick="openCardWidgetPicker()">Выбрать карточки</button></div>';
    }
    host.innerHTML = html;
  }
  window.renderV47Widgets = renderWidgets;

  /* ---------- листы настроек ---------- */
  function sheet(id, title, body) {
    var old = $(id); if (old) old.remove();
    var el = document.createElement('section');
    el.id = id; el.className = 'premium-tools-overlay v47-sheet-wrap'; el.setAttribute('role', 'dialog');
    el.innerHTML = '<div class="premium-tools-sheet v47-sheet"><header><button type="button" class="premium-tools-back" data-close>‹ Назад</button><h2>' + esc(title) + '</h2><span></span></header>' + body + '</div>';
    el.addEventListener('click', function (e) { if (e.target === el || e.target.closest('[data-close]')) el.remove(); });
    document.body.appendChild(el); return el;
  }
  window.openGlassSettings = function () {
    var g = glass(), c = wcfg();
    var el = sheet('v47GlassSheet', 'Оформление и виджеты',
      '<div class="v47-group"><label class="v47-row"><span>Liquid Glass<small>Стеклянный эффект как в iOS</small></span><input type="checkbox" id="gOn" ' + (g.on ? 'checked' : '') + '></label>' +
      '<div class="v47-row v47-slider"><span>Размытие <b id="gBlurV">' + g.blur + '</b></span><input type="range" id="gBlur" min="4" max="36" value="' + g.blur + '"></div>' +
      '<div class="v47-row v47-slider"><span>Прозрачность <b id="gAlphaV">' + g.t + '%</b></span><input type="range" id="gAlpha" min="0" max="100" value="' + g.t + '"></div></div>' +
      '<h3 class="v47-h">Виджеты на главном экране</h3><div class="v47-group">' +
      '<label class="v47-row"><span>Скрыть все виджеты<small>Главный экран станет чистым</small></span><input type="checkbox" id="hAll" ' + (hcfg().all ? 'checked' : '') + '></label>' +
      '<label class="v47-row"><span>Скрыть «Время намаза»</span><input type="checkbox" id="hPrayer" ' + (hcfg().prayer ? 'checked' : '') + '></label>' +
      '<label class="v47-row"><span>Скрыть «Мой день»</span><input type="checkbox" id="hDay" ' + (hcfg().day ? 'checked' : '') + '></label>' +
      '<label class="v47-row"><span>Скрыть уровень и опыт</span><input type="checkbox" id="hXp" ' + (hcfg().xp ? 'checked' : '') + '></label>' +
      '<label class="v47-row"><span>Скрыть «Следующий намаз»<small>Название и время до начала</small></span><input type="checkbox" id="hNext" ' + (hcfg().next ? 'checked' : '') + '></label>' +
      '<label class="v47-row"><span>Скрыть «Мою коллекцию»<small>Виджет с тремя карточками</small></span><input type="checkbox" id="hColl" ' + (hcfg().coll ? 'checked' : '') + '></label>' +
      '<button type="button" class="v47-btn" onclick="openCardWidgetPicker()">Выбрать 3 карточки для виджета</button></div>');
    var upd = function () {
      lsSet(GLASS_KEY, { on: $('gOn').checked, blur: +$('gBlur').value, t: +$('gAlpha').value });
      $('gBlurV').textContent = $('gBlur').value; $('gAlphaV').textContent = $('gAlpha').value + '%'; applyGlass();
    };
    ['gOn', 'gBlur', 'gAlpha'].forEach(function (i) { $(i).addEventListener('input', upd); });
        var hu = function () { lsSet(H_KEY, Object.assign(lsGet(H_KEY, {}), { all: $('hAll').checked, prayer: $('hPrayer').checked, day: $('hDay').checked, xp: $('hXp').checked, next: $('hNext').checked, coll: $('hColl').checked })); applyHide(); };
    ['hAll', 'hPrayer', 'hDay', 'hXp', 'hNext', 'hColl'].forEach(function (i) { $(i).addEventListener('change', hu); });
  };
  window.openCardWidgetPicker = function () {
    var own = ownedCards(), sel = (wcfg().cards || []).slice(0, 3);
    var el = sheet('v47PickSheet', 'Карточки для виджета',
      '<p class="v47-note">Выберите до 3 карточек (открытых).</p><div class="v47-pick-grid" id="v47PickGrid"></div>');
    var draw = function () {
      $('v47PickGrid').innerHTML = own.length ? own.map(function (c) { return '<button type="button" class="v47-pick-item' + (sel.indexOf(c.id) >= 0 ? ' on' : '') + '" data-id="' + esc(c.id) + '">' + cardMini(c) + '</button>'; }).join('') : '<p class="v47-empty">У вас пока нет открытых карточек.</p>';
    };
    draw();
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.v47-pick-item'); if (!b) return;
      var id = b.dataset.id, i = sel.indexOf(id);
      if (i >= 0) sel.splice(i, 1); else if (sel.length < 3) sel.push(id); else sel.shift(), sel.push(id);
      lsSet(W_KEY, Object.assign(wcfg(), { cards: sel })); draw(); renderWidgets();
    });
  };

  /* ================= Уведомления о намазе ================= */
  var N_KEY = 'kun_notif_v1';
  function ncfg() { return Object.assign({ on: false, lead: 10 }, lsGet(N_KEY, {})); }
  function notify(title, body) {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') return false;
      var opts = { body: body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'kun-prayer' };
      if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(function (r) { r.showNotification(title, opts); }).catch(function () { new Notification(title, opts); });
      else new Notification(title, opts);
      return true;
    } catch (e) { return false; }
  }
  function tick() {
    var c = ncfg(); if (!c.on) return;
    var now = Date.now(), fired = lsGet('kun_notif_fired', {}), day = new Date().toDateString();
    if (fired.day !== day) fired = { day: day };
    prayerTimes().forEach(function (p) {
      var t = p.date.getTime() - c.lead * 6e4;
      if (now >= t && now < t + 90e3 && !fired[p.name]) {
        fired[p.name] = 1;
        notify(c.lead ? 'Скоро намаз ' + p.name : 'Время намаза: ' + p.name, c.lead ? 'Через ' + c.lead + ' мин. Да примет Аллах!' : 'Пора вставать на намаз.');
      }
    });
    lsSet('kun_notif_fired', fired);
  }
  window.openNotifSettings = function () {
    var c = ncfg(), perm = ('Notification' in window) ? Notification.permission : 'unsupported';
    var el = sheet('v47NotifSheet', 'Уведомления',
      '<div class="v47-group"><label class="v47-row"><span>Напоминания о намазе<small id="nStat"></small></span><input type="checkbox" id="nOn" ' + (c.on ? 'checked' : '') + '></label>' +
      '<div class="v47-row"><span>За сколько напомнить</span><select id="nLead">' + [0, 5, 10, 15, 30].map(function (m) { return '<option value="' + m + '"' + (m === c.lead ? ' selected' : '') + '>' + (m ? 'за ' + m + ' мин' : 'в момент намаза') + '</option>'; }).join('') + '</select></div>' +
      '<button type="button" class="v47-btn" id="nTest">Отправить пробное уведомление</button></div>' +
      '<p class="v47-note">Уведомления приходят, пока приложение установлено на экран «Домой» и открыто или свёрнуто в фоне. Полностью закрытое приложение браузер на iPhone будит не всегда — это ограничение iOS.</p>');
    var stat = function () { $('nStat').textContent = perm === 'unsupported' ? 'Не поддерживается этим браузером' : perm === 'denied' ? 'Запрещено в настройках iOS' : perm === 'granted' ? 'Разрешено' : 'Нужно разрешение'; };
    stat();
    $('nOn').addEventListener('change', function () {
      var on = this.checked, self = this;
      var save = function () { lsSet(N_KEY, Object.assign(ncfg(), { on: on })); };
      if (on && 'Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then(function (p) { perm = p; stat(); if (p !== 'granted') { self.checked = false; on = false; } save(); });
      } else save();
    });
    $('nLead').addEventListener('change', function () { lsSet(N_KEY, Object.assign(ncfg(), { lead: +this.value })); });
    $('nTest').addEventListener('click', function () {
      var go = function () { if (!notify('Kunmusliman', 'Уведомления работают ✓') && typeof showNotification === 'function') showNotification('Сначала разрешите уведомления'); };
      if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission().then(function (p) { perm = p; stat(); go(); }); else go();
    });
  };

  function init() {
    applyGlass(); renderWidgets();
    setInterval(function () { renderWidgets(); tick(); }, 20000);
    setTimeout(renderWidgets, 1500); setTimeout(renderWidgets, 5000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { renderWidgets(); tick(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
