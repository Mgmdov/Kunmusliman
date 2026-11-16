/* v55 — Категории коллекции плитками (вместо ряда маленьких вкладок). Совместимо со старой логикой: класс .collection-tab + data-collection. */
(function () {
  'use strict';
  var G = 'url(#catGold)', S = 'stroke="url(#catGold)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  var ICONS = {
    all: '<rect x="14" y="14" width="26" height="34" rx="4" fill="none" ' + S.replace('fill="none"', '') + '/><rect x="24" y="20" width="26" height="34" rx="4" fill="' + G + '" fill-opacity=".25" ' + S.replace('fill="none"', '') + '/><path d="M32 33l3 3 6-7" ' + S + '/>',
    sahabi: '<path d="M32 8l18 7v14c0 13-8 22-18 27C22 51 14 42 14 29V15z" fill="' + G + '" fill-opacity=".22" ' + S.replace('fill="none"', '') + '/><path d="M32 18v28M22 28h20" ' + S + '/>',
    surah: '<path d="M10 16c8-3 16-2 22 3 6-5 14-6 22-3v32c-8-3-16-2-22 3-6-5-14-6-22-3z" fill="' + G + '" fill-opacity=".22" ' + S.replace('fill="none"', '') + '/><path d="M32 19v32" ' + S + '/>',
    prophet: '<path d="M10 52h44M14 52V34m36 18V34M20 34c0-8 5-12 12-12s12 4 12 12M32 14v8M29 11l3-4 3 4M10 34h8m28 0h8M12 34c0-4 2-6 4-9 2 3 4 5 4 9M44 34c0-4 2-6 4-9 2 3 4 5 4 9" ' + S + '/><path d="M24 52V40a8 8 0 0116 0v12" fill="' + G + '" fill-opacity=".3" ' + S.replace('fill="none"', '') + '/>',
    names: '<path d="M18 10h30a4 4 0 014 4v36a4 4 0 01-4 4H22a4 4 0 01-4-4z" fill="' + G + '" fill-opacity=".2" ' + S.replace('fill="none"', '') + '/><circle cx="35" cy="27" r="9" ' + S + '/><text x="35" y="31" text-anchor="middle" font-size="11" font-weight="700" fill="' + G + '" font-family="serif">99</text><path d="M25 43h20M28 48h14" ' + S + '/>',
    battle: '<path d="M12 12l30 30M52 12L22 42" ' + S + ' stroke-width="3"/><path d="M38 38l8 8M26 38l-8 8M44 48l4-4M20 48l-4-4" ' + S + ' stroke-width="3"/>',
    miracle: '<path d="M32 6l7 10 12-2-2 12 10 7-10 7 2 12-12-2-7 10-7-10-12 2 2-12-10-7 10-7-2-12 12 2z" fill="none" ' + S.replace('fill="none"', '') + ' opacity=".7"/><path d="M36 20a13 13 0 100 24 10 10 0 010-24z" fill="' + G + '" fill-opacity=".9"/><path d="M41 26l1.4 3 3 .4-2.2 2.200.5 3-2.700-1.500-2.700 1.500.5-3-2.200-2.200 3-.4z" fill="' + G + '"/>',
    juma: '<path d="M8 52h48M14 52V40M50 52V30M50 30c0-5 4-7 4-12M50 14v-2" ' + S + '/><path d="M18 40c0-12 6-18 14-18s14 6 14 18z" fill="' + G + '" fill-opacity=".3" ' + S.replace('fill="none"', '') + '/><path d="M32 16v6M29 14a3 3 0 106 0" ' + S + '/>',
    rare: '<path d="M18 18h28l8 10-22 24L10 28z" fill="' + G + '" fill-opacity=".28" ' + S.replace('fill="none"', '') + '/><path d="M10 28h44M24 18l-4 10 12 24 12-24-4-10M32 8v4M20 10l2 3M44 10l-2 3" ' + S + '/>',
    mythic: '<path d="M10 46l4-24 12 12 6-18 6 18 12-12 4 24z" fill="' + G + '" fill-opacity=".28" ' + S.replace('fill="none"', '') + '/><path d="M10 52h44" ' + S + '/><circle cx="32" cy="42" r="2.500" fill="' + G + '"/>',
    ramadan: '<path d="M38 10a20 20 0 100 40 16 16 0 010-40z" fill="' + G + '" fill-opacity=".3" ' + S.replace('fill="none"', '') + '/><path d="M46 16l2 4 4 .6-3 3 .8 4-3.800-2-3.800 2 .8-4-3-3 4-.6z" fill="' + G + '"/>',
    achievement: '<path d="M20 10h24v14a12 12 0 01-24 0z" fill="' + G + '" fill-opacity=".28" ' + S.replace('fill="none"', '') + '/><path d="M20 14h-8c0 8 3 12 8 13M44 14h8c0 8-3 12-8 13M32 36v10M22 52h20M26 46h12" ' + S + '/><path d="M32 17l2 4 4 .5-3 3 .8 4-3.800-2-3.800 2 .8-4-3-3 4-.5z" fill="' + G + '"/>',
    recent: '<path d="M32 6l5 19 19 7-19 7-5 19-5-19-19-7 19-7z" fill="' + G + '" fill-opacity=".35" ' + S.replace('fill="none"', '') + '/><path d="M50 8v8M46 12h8M14 44v8M10 48h8" ' + S + '/>',
    dupes: '<rect x="10" y="16" width="28" height="36" rx="4" ' + S + '/><rect x="26" y="12" width="28" height="36" rx="4" fill="' + G + '" fill-opacity=".22" ' + S.replace('fill="none"', '') + '/><path d="M34 30h12M40 24v12" ' + S + '/>',
    secret: '<rect x="14" y="28" width="36" height="26" rx="5" fill="' + G + '" fill-opacity=".22" ' + S.replace('fill="none"', '') + '/><path d="M22 28v-6a10 10 0 0120 0v6" ' + S + '/><circle cx="32" cy="41" r="3.500" fill="' + G + '"/><path d="M32 44v5" ' + S + '/>'
  };
  var CATS = [
    ['all', 'Все'], ['prophet', 'Пророки'], ['names', '99 Имён'],
    ['battle', 'Битвы'], ['miracle', 'Чудеса'], ['juma', 'Джума'],
    ['sahabi', 'Сподвижники'], ['surah', 'Суры'], ['ramadan', 'Рамадан'],
    ['rare', 'Редкие'], ['mythic', 'Мифические'], ['achievement', 'Достижения'],
    ['recent', 'Новые'], ['dupes', 'Дубли'], ['secret', 'Секретные']
  ];
  var teal = { juma: 1, ramadan: 1 };

  function build() {
    var mod = document.getElementById('module-collection'); if (!mod) return;
    var old = mod.querySelector('.collection-tab'); if (!old) return;
    var row = old.parentElement; if (!row || row.id === 'collectionCats') return;
    var wrap = document.createElement('div'); wrap.id = 'collectionCats'; wrap.className = 'cc-wrap';
    var activeTab = (mod.querySelector('.collection-tab.active') || {}).dataset; var cur = (activeTab && activeTab.collection) || 'all';
    wrap.innerHTML =
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="catGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7e3a0"/><stop offset="1" stop-color="#c9a04a"/></linearGradient>' +
      '<linearGradient id="catTeal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ff0dc"/><stop offset="1" stop-color="#1fa593"/></linearGradient></defs></svg>' +
      '<button type="button" class="cc-head" id="ccHead" aria-expanded="true"><span class="cc-head-ic">◈</span><span class="cc-head-t">Категория: <b id="ccCur">Все</b></span><span class="cc-head-arr">▾</span></button>' +
      '<div class="cc-grid" id="ccGrid">' + CATS.map(function (c) {
        return '<button type="button" class="collection-tab cc-tile' + (teal[c[0]] ? ' cc-teal' : '') + (c[0] === cur ? ' active' : '') + '" data-collection="' + c[0] + '">' +
          '<span class="cc-ic"><svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">' + (teal[c[0]] ? ICONS[c[0]].replace(/url\(#catGold\)/g, 'url(#catTeal)') : ICONS[c[0]]) + '</svg></span>' +
          '<b class="cc-name">' + c[1] + '</b><i class="cc-div"></i><small class="cc-cnt" data-cnt="' + c[0] + '"></small></button>';
      }).join('') + '</div>';
    row.parentNode.replaceChild(wrap, row);
    var head = wrap.querySelector('#ccHead');
    head.addEventListener('click', function () { var c = wrap.classList.toggle('cc-closed'); head.setAttribute('aria-expanded', String(!c)); });
    wrap.addEventListener('click', function (e) {
      var t = e.target.closest('.cc-tile'); if (!t) return;
      setTimeout(function () { wrap.classList.add('cc-closed'); head.setAttribute('aria-expanded', 'false'); if (wrap.scrollIntoView) { try { wrap.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (x) {} } }, 60);
    });
    refresh();
  }

  function secret(c) { return /^ee_/.test(c.id) || c.id === 'p24' || c.id === 'prophet_story' || c.secret === true; }
  function refresh() {
    try {
      var all = (window.ALL_COLLECTION_CARDS || []); var u = window.userData || {};
      var arr = function (v) { return Array.isArray(v) ? v : []; };
      var own = new Set([].concat(arr(u.unlockedCards), arr(u.jumaCards).map(function (c) { return c && typeof c === 'object' ? c.id : c; }), Object.keys(u.chestCards && typeof u.chestCards === 'object' ? u.chestCards : {})).filter(Boolean));
      Object.keys(u.easterEggs || {}).forEach(function (id) { if (u.easterEggs[id]) own.add(id); });
      var vis = all.filter(function (c) { return !secret(c) || own.has(c.id); });
      var pred = {
        all: function () { return true; }, rare: function (c) { return c.rarity === 'legendary' || c.rarity === 'epic'; }, mythic: function (c) { return c.rarity === 'mythic'; },
        secret: secret, recent: function () { return false; }, dupes: function () { return false; },
        battle: function (c) { return c.type === 'battle' || (c.type === 'chest' && /битв|бадр|ухуд|ров/i.test(c.name || '')); }
      };
      document.querySelectorAll('#collectionCats .cc-cnt').forEach(function (el) {
        var k = el.dataset.cnt, p = pred[k] || function (c) { return c.type === k; };
        if (k === 'recent') { el.textContent = Math.min(30, vis.filter(function (c) { return own.has(c.id); }).length); return; }
        if (k === 'dupes') { var d = 0; try { var cc = u.cardCounts || u.cardCopies || {}; Object.keys(cc).forEach(function (id) { if ((cc[id] || 0) > 1) d++; }); } catch (e) {} el.textContent = d || ''; return; }
        var list = vis.filter(p); var o = list.filter(function (c) { return own.has(c.id); }).length;
        el.textContent = k === 'secret' ? String(list.length) : (o + ' / ' + list.length);
      });
      var a = document.querySelector('#collectionCats .cc-tile.active .cc-name'), cur = document.getElementById('ccCur'); if (a && cur) cur.textContent = a.textContent;
    } catch (e) {}
  }
  var orig = window.renderCollection;
  if (typeof orig === 'function') window.renderCollection = function () { var r = orig.apply(this, arguments); refresh(); return r; };
  window.refreshCollectionCats = refresh;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
