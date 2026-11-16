/* Kunmusliman v48: переключение языка интерфейса (ru, en, ar, ky, tg, uz, tr) */
(function () {
  'use strict';
  var LANGS = [
    { c: 'ru', n: 'Русский', f: '🇷🇺' }, { c: 'en', n: 'English', f: '🇬🇧' }, { c: 'ar', n: 'العربية', f: '🇸🇦' },
    { c: 'ky', n: 'Кыргызча', f: '🇰🇬' }, { c: 'tg', n: 'Тоҷикӣ', f: '🇹🇯' }, { c: 'uz', n: "O'zbekcha", f: '🇺🇿' }, { c: 'tr', n: 'Türkçe', f: '🇹🇷' }
  ];
  var IDX = { ru: 0, en: 1, ar: 2, ky: 3, tg: 4, uz: 5, tr: 6 };
  var KEY = 'kun_lang_v1', DICT = {}, lang = 'ru', obs = null, busy = false, orig = new WeakMap(), done = new WeakMap();
  (window.KUN_I18N_RAW || '').split('\n').forEach(function (l) {
    var p = l.split('|'); if (p.length === 7) DICT[p[0].trim().toLowerCase()] = p;
  });
  function tr(src) {
    var raw = String(src), k = raw.trim(), p = DICT[k.toLowerCase()];
    if (lang === 'ru') return raw;
    if (!p) { var m = mt[k]; return m ? raw.replace(k, m) : raw; }
    var out = p[IDX[lang]];
    if (k.length > 2 && k === k.toUpperCase() && k !== k.toLowerCase()) out = out.toUpperCase();
    return raw.replace(k, out);
  }
  window.kunT = function (s) { return tr(s); };
  window.kunLang = function () { return lang; };

  /* ---- v58: машинный перевод для всего, чего нет в словаре (кэшируется, работает офлайн после первого раза) ---- */
  var CYR = /[А-Яа-яЁё]/, MT_KEY = 'kun_mt_v2_', mt = {}, mtLang = null, mtQ = [], mtBusy = 0, mtPend = {}, mtSave = null, mtFail = 0, mtCount = 0;
  var USER_SEL = '[data-no-i18n],#lbContent,.lb-card,#settingsStatus,#settingsEmail,#settingsNickInput,input,textarea,.lb-ov .lb-nm,[contenteditable]';
  function mtLoad(l) { if (mtLang === l) return; mtLang = l; try { mt = JSON.parse(localStorage.getItem(MT_KEY + l) || '{}'); } catch (e) { mt = {}; } mtCount = Object.keys(mt).length; }
  function mtPersist() {
    clearTimeout(mtSave);
    mtSave = setTimeout(function () {
      try {
        if (mtCount > 4000) { var ks = Object.keys(mt); ks.slice(0, 1000).forEach(function (k) { delete mt[k]; }); mtCount = Object.keys(mt).length; }
        localStorage.setItem(MT_KEY + lang, JSON.stringify(mt));
      } catch (e) {}
    }, 1500);
  }
  function mtSkip(k) {
    if (!CYR.test(k) || k.length > 700) return true;
    if (/[а-яё]1|1[а-яё]/i.test(k)) return true;          // чеченский (палочка «1»): машинный перевод исказит
    return false;
  }
  function mtFetch(text, l, cb) {
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=' + l + '&dt=t&q=' + encodeURIComponent(text);
    fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      var out = (j[0] || []).map(function (x) { return x[0]; }).join('');
      if (!out) throw 0; cb(out);
    }).catch(function () {
      fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=ru|' + l).then(function (r) { return r.json(); }).then(function (j) {
        var o = j && j.responseData && j.responseData.translatedText;
        if (!o || /MYMEMORY|QUERY LENGTH/i.test(o)) throw 0; cb(o);
      }).catch(function () { cb(null); });
    });
  }
  function mtPump() {
    while (mtBusy < 4 && mtQ.length) {
      (function (k, l) {
        mtBusy++;
        mtFetch(k, l, function (out) {
          mtBusy--;
          if (out && l === lang) {
            mt[k] = out; mtCount++; mtPersist(); mtFail = 0;
            var list = mtPend[k] || []; delete mtPend[k];
            list.forEach(function (it) { mtApply(it); });
          } else { delete mtPend[k]; if (!out) { mtFail++; } }
          if (mtFail > 8) { mtQ.length = 0; mtFail = 0; return; }   // нет сети — не долбим
          setTimeout(mtPump, 60);
        });
      })(mtQ.shift(), lang);
    }
  }
  function mtApply(it) {
    var k = it.k, out = mt[k]; if (!out) return;
    if (it.n.nodeType === 3) { if (it.n.isConnected && orig.get(it.n) === it.o) { var nv2 = it.o.replace(k, out); it.n.nodeValue = nv2; done.set(it.n, nv2); } }
    else if (it.n.isConnected && it.n['__o_' + it.a] === it.o) it.n.setAttribute(it.a, it.o.replace(k, out));
  }
  function mtWant(it) {
    var k = it.o.trim();
    if (mtSkip(k)) return false;
    if (mt[k]) { it.k = k; mtApply(it); return true; }
    if (!navigator.onLine) return false;
    it.k = k;
    if (mtPend[k]) { mtPend[k].push(it); return true; }
    mtPend[k] = [it]; mtQ.push(k); return true;
  }

  var ATTRS = ['placeholder', 'aria-label', 'title'];
  function node(n) {
    if (n.nodeType === 3) {
      var t = n.nodeValue; if (!t || !t.trim()) return;
      if (done.get(n) === t) return;
      if (!orig.has(n)) { if (lang === 'ru') return; orig.set(n, t); }
      var o = orig.get(n), nv = lang === 'ru' ? o : tr(o);
      if (nv !== n.nodeValue) { n.nodeValue = nv; done.set(n, nv); }
      if (lang !== 'ru' && nv === o && CYR.test(o) && n.parentElement && n.parentElement.getClientRects().length && !n.parentElement.closest(USER_SEL)) mtWant({ n: n, o: o });
    } else if (n.nodeType === 1) {
      var tag = n.tagName; if (tag === 'SCRIPT' || tag === 'STYLE' || n.closest && n.closest('[data-no-i18n]')) return;
      ATTRS.forEach(function (a) {
        if (!n.hasAttribute(a)) return;
        var key = '__o_' + a; if (!n[key]) { if (lang === 'ru') return; n[key] = n.getAttribute(a); }
        var v = lang === 'ru' ? n[key] : tr(n[key]); if (v !== n.getAttribute(a)) n.setAttribute(a, v);
        if (lang !== 'ru' && v === n[key] && CYR.test(v) && n.getClientRects().length && !n.closest(USER_SEL)) mtWant({ n: n, o: n[key], a: a });
      });
      for (var c = n.firstChild; c; c = c.nextSibling) node(c);
    }
  }
  function run(root) { busy = true; try { node(root || document.body); } finally { busy = false; } }
  function observe() {
    if (obs) obs.disconnect();
    obs = new MutationObserver(function (ms) {
      if (busy) return; busy = true;
      try {
        ms.forEach(function (m) {
          if (m.type === 'characterData') { if (done.get(m.target) === m.target.nodeValue) return; orig.delete(m.target); node(m.target); }
          else m.addedNodes.forEach(function (a) { node(a); });
        });
      } finally { busy = false; }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function setLang(c, silent) {
    if (!(c in IDX)) c = 'ru';
    lang = c; mtQ.length = 0; mtPend = {}; mtLoad(c); try { localStorage.setItem(KEY, c); } catch (e) {}
    var h = document.documentElement; h.lang = c; h.dir = c === 'ar' ? 'rtl' : 'ltr';
    run(document.body); observe(); mtPump();
    var lbl = document.getElementById('kunLangCurrent'); if (lbl) lbl.textContent = LANGS[IDX[c]].n;
    if (typeof window.renderV47Widgets === 'function') window.renderV47Widgets();
  }
  // при открытии модулей/вкладок содержимое показывается без мутаций текста — пересканируем после кликов
  var rescanT = null;
  function rescan() { if (lang === 'ru') return; run(document.body); mtPump(); }
  ['click', 'touchend'].forEach(function (ev) { document.addEventListener(ev, function () { clearTimeout(rescanT); rescanT = setTimeout(rescan, 450); }, true); });
  setInterval(function () { if (lang !== 'ru' && !document.hidden) rescan(); }, 4000);
  window.setKunLang = setLang;
  window.openKunLang = function (first) {
    var old = document.getElementById('kunLangPicker'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'kunLangPicker'; el.className = 'kun-lang'; el.setAttribute('data-no-i18n', '1');
    el.innerHTML = '<div style="font-size:44px">🌙</div><h2>Kunmusliman</h2><p>Выберите язык · Choose language · اختر اللغة</p><div class="kun-lang-grid">' +
      LANGS.map(function (l) { return '<button type="button" class="kun-lang-btn' + (l.c === lang ? ' on' : '') + '" data-c="' + l.c + '"><span class="fl">' + l.f + '</span><span>' + l.n + '</span></button>'; }).join('') + '</div>' +
      '<p style="margin-top:18px;font-size:11px;max-width:320px">' + (lang === 'ru' ? 'Содержимое азкаров, историй и викторин пока на русском' : tr('Содержимое азкаров, историй и викторин пока на русском')) + '</p>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.kun-lang-btn'); if (!b) return;
      setLang(b.dataset.c); try { localStorage.setItem(KEY + '_chosen', '1'); } catch (x) {}
      el.remove(); if (first) window.dispatchEvent(new Event('kun:lang-chosen'));
    });
    document.body.appendChild(el);
  };
  function init() {
    var saved = null, chosen = false;
    try { saved = localStorage.getItem(KEY); chosen = localStorage.getItem(KEY + '_chosen') === '1'; } catch (e) {}
    if (saved && saved !== 'ru') setLang(saved); else { document.documentElement.lang = 'ru'; }
    if (!chosen) setTimeout(function () { window.openKunLang(true); }, 2900);
    var sl = document.getElementById('kunLangCurrent'); if (sl && saved) sl.textContent = LANGS[IDX[saved] || 0].n;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
