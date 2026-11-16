/* Kunmusliman v55 — Рамадан по хиджре: даты, вопросы про пост (утром «будете?» / вечером «держали?»),
   метка в календаре только после сверки двух ответов, награды, карточки и достижения. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function U() { return window.userData || (typeof userData !== 'undefined' ? userData : null); }
  function save() { try { if (typeof saveUserData === 'function') saveUserData(); else if (window.saveData) window.saveData(); } catch (e) {} }
  function pad(n) { return String(n).padStart(2, '0'); }
  function dkey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseKey(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return x; }
  function nowD() { return new Date(); }
  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  function fmtDate(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }

  // ---------- Хиджра ----------
  var fmt = null;
  try { fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }); } catch (e) {}
  function hijri(d) {
    if (fmt) {
      try { var o = {}; fmt.formatToParts(d).forEach(function (p) { o[p.type] = p.value; }); var r = { d: +o.day, m: +o.month, y: +o.year }; if (r.d && r.m && r.y) return r; } catch (e) {}
    }
    // запасной табличный расчёт
    var jd = Math.floor(d.getTime() / 86400000 + 2440587.5 + 0.5);
    var l = jd - 1948440 + 10632, n = Math.floor((l - 1) / 10631); l = l - 10631 * n + 354;
    var j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    var m = Math.floor((24 * l) / 709), dd = l - Math.floor((709 * m) / 24), y = 30 * n + j - 30;
    return { d: dd, m: m, y: y };
  }
  // Ближайший или текущий Рамадан
  function info(now) {
    now = now || nowD();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var h = hijri(today), start = null;
    if (h.m === 9) start = addDays(today, -(h.d - 1));
    else {
      for (var i = 1; i <= 400; i++) { var t = addDays(today, i); var ht = hijri(t); if (ht.m === 9 && ht.d === 1) { start = t; break; } }
    }
    if (!start) return null;
    var hy = hijri(start).y, len = 29;
    var d30 = addDays(start, 29); if (hijri(d30).m === 9) len = 30;
    var end = addDays(start, len - 1);
    var inR = today >= start && today <= end;
    return { start: start, end: end, len: len, year: hy, inRamadan: inR, dayNo: inR ? Math.round((today - start) / 86400000) + 1 : 0,
      daysUntil: today < start ? Math.round((start - today) / 86400000) : 0, today: today };
  }
  window.kunRamadanInfo = info;

  // ---------- Данные ----------
  function R() {
    var u = U(); if (!u) return null;
    var inf = info(); if (!inf) return null;
    if (!u.ramadan || typeof u.ramadan !== 'object') u.ramadan = { year: null, days: {} };
    var r = u.ramadan;
    if (r.year !== inf.year) {
      // архивируем прошлые данные (в т.ч. старый формат, где year был григорианским)
      if (r.year && Object.keys(r.days || {}).length) { r.history = r.history || {}; r.history[r.year] = { days: r.days, log: r.log || {} }; }
      r.year = inf.year; r.days = {}; r.log = {};
    }
    if (!r.days) r.days = {}; if (!r.log) r.log = {};
    return r;
  }
  function dayNoOf(key, inf) { return Math.round((parseKey(key) - inf.start) / 86400000) + 1; }
  function evaluate(m, e) {
    if (e === 'yes' && m === 'yes') return 'fasted';
    if (e === 'yes' && (m === undefined || m === null)) return 'fasted';
    if (e === 'yes' && m === 'no') return 'mismatch';
    if (e === 'no' && m === 'yes') return 'broken';
    return 'skipped';
  }
  function fastedCount(r) { return Object.keys(r.days || {}).filter(function (k) { return r.days[k]; }).length; }
  function totalFastedEver() {
    var r = R(); if (!r) return 0; var n = fastedCount(r);
    Object.keys(r.history || {}).forEach(function (y) { n += Object.keys(r.history[y].days || {}).filter(function (k) { return r.history[y].days[k]; }).length; });
    return n;
  }
  function streakFrom(r, uptoNo) { var best = 0, cur = 0; for (var i = 1; i <= uptoNo; i++) { if (r.days[i]) { cur++; best = Math.max(best, cur); } else cur = 0; } return best; }

  // отметить день в календаре (общий календарь поста тоже)
  function setFasted(inf, r, key, on, manual) {
    var no = dayNoOf(key, inf);
    var u = U(); if (!u.fasting) u.fasting = { days: [], total: 0 };
    var arr = u.fasting.days; var idx = arr.findIndex(function (d) { return d.date === key; });
    if (on) {
      r.days[no] = true;
      if (idx < 0) arr.push({ date: key, type: 'ramadan' });
      reward(inf, r, no);
    } else {
      delete r.days[no];
      if (idx >= 0 && arr[idx].type === 'ramadan') arr.splice(idx, 1);
    }
    u.fasting.total = arr.length;
  }

  // ---------- Награды ----------
  function card(id) { try { if (typeof unlockCardIfNotHave === 'function') unlockCardIfNotHave(id); } catch (e) {} }
  function note(t) { try { if (typeof showNotification === 'function') showNotification(t); } catch (e) {} }
  function reward(inf, r, no) {
    var y = inf.year;
    if (typeof window.awardStars === 'function') window.awardStars(3, 'День поста Рамадана', 'ramadan:day:' + y + ':' + no);
    try { if (typeof addXP === 'function' && !(r.xpPaid = r.xpPaid || {})[no]) { r.xpPaid[no] = 1; addXP(30); } } catch (e) {}
    var cnt = fastedCount(r);
    if (no === 1 || cnt >= 1) card('ram_first');
    var dec = function (a, b) { var c = 0; for (var i = a; i <= b; i++) if (r.days[i]) c++; return c; };
    if (dec(1, 10) >= 8) { card('ram_mercy'); stars(10, 'Десять милости', 'ramadan:dec1:' + y); }
    if (dec(11, 20) >= 8) { card('ram_forgive'); stars(15, 'Десять прощения', 'ramadan:dec2:' + y); }
    if (dec(21, inf.len) >= 7) { card('ram_fire'); stars(20, 'Освобождение от Огня', 'ramadan:dec3:' + y); }
    if (streakFrom(r, inf.len) >= 7) { card('ram_week'); stars(10, 'Неделя поста подряд', 'ramadan:streak7:' + y); }
    if (streakFrom(r, inf.len) >= 15) stars(20, '15 дней подряд', 'ramadan:streak15:' + y);
    if (r.days[27]) card('ram_qadr');
    if (cnt >= inf.len - 1) { card('ram_complete'); stars(100, 'Рамадан завершён', 'ramadan:complete:' + y); }
    if (typeof window.checkAllAchievements === 'function') try { window.checkAllAchievements(); } catch (e) {}
  }
  function stars(n, label, key) { if (typeof window.awardStars === 'function') window.awardStars(n, label, key); }

  // ---------- Карточки ----------
  var CARDS = [
    { id: 'ram_first', name: 'Первый пост Рамадана', title: 'Ас-Саум', arabic: 'الصَّوْم', emoji: '🌙', rarity: 'common', story: 'Первый день священного месяца. Пророк ﷺ сказал: «Пост — это щит». Тот, кто постится ради Аллаха, получает награду, о размере которой знает лишь Он.' },
    { id: 'ram_week', name: 'Неделя поста', title: '7 дней подряд', arabic: 'سَبْعَة أَيَّام', emoji: '🕯️', rarity: 'rare', story: 'Семь дней подряд без пропуска. Самое трудное в начале пути — удержать ритм; вы его нашли.' },
    { id: 'ram_mercy', name: 'Десять милости', title: 'Первая декада', arabic: 'الرَّحْمَة', emoji: '🤍', rarity: 'rare', story: 'Первая треть Рамадана — десять дней милости. Аллах осыпает постящихся Своей милостью.' },
    { id: 'ram_forgive', name: 'Десять прощения', title: 'Вторая декада', arabic: 'الْمَغْفِرَة', emoji: '🌿', rarity: 'epic', story: 'Вторая треть — десять дней прощения. «Кто постился в Рамадан с верой и надеждой на награду, тому простятся прошлые грехи».' },
    { id: 'ram_fire', name: 'Освобождение от Огня', title: 'Третья декада', arabic: 'الْعِتْق مِنَ النَّار', emoji: '🔥', rarity: 'epic', story: 'Последние десять дней — освобождение от Огня. Пророк ﷺ в эти дни усердствовал в поклонении больше, чем когда-либо.' },
    { id: 'ram_qadr', name: 'Ночь Предопределения', title: 'Лайлят аль-Кадр', arabic: 'لَيْلَة الْقَدْر', emoji: '✨', rarity: 'legendary', story: '«Ночь Предопределения лучше тысячи месяцев». Вы встретили её, держа пост — да примет Аллах ваши дуа.' },
    { id: 'ram_complete', name: 'Завершённый Рамадан', title: 'Ид аль-Фитр', arabic: 'عِيد الْفِطْر', emoji: '🌟', rarity: 'mythic', story: 'Вы провели весь месяц в посте. «Для постящегося две радости: при разговении и при встрече с Господом».' }
  ];
  function installCards() {
    CARDS.forEach(function (c) {
      var card = Object.assign({ type: 'ramadan' }, c);
      try { if (typeof ALL_CARDS !== 'undefined' && !ALL_CARDS.some(function (x) { return x.id === c.id; })) ALL_CARDS.push(card); } catch (e) {}
      try { if (window.ALL_COLLECTION_CARDS && !window.ALL_COLLECTION_CARDS.some(function (x) { return x.id === c.id; })) window.ALL_COLLECTION_CARDS.push(card); } catch (e) {}
    });
  }
  installCards();

  // ---------- Достижения ----------
  function installAchievements() {
    try {
      if (typeof ALL_ACHIEVEMENTS_FULL === 'undefined') return;
      var defs = [
        { id: 'ramFirst', title: '🌙 Первый пост Рамадана', desc: 'Отметить 1 день Рамадана (после вечерней сверки)', icon: '🌙', xp: 100, t: 1, star: 30, rarity: 'common' },
        { id: 'ramWeek', title: '🕯️ Неделя Рамадана', desc: 'Держать 7 дней Рамадана', icon: '🕯️', xp: 250, t: 7, star: 70, rarity: 'rare' },
        { id: 'ramHalf', title: '🌓 Половина месяца', desc: 'Держать 15 дней Рамадана', icon: '🌓', xp: 600, t: 15, star: 150, rarity: 'epic' },
        { id: 'ramStreak', title: '🔗 Без пропусков', desc: '10 дней Рамадана подряд', icon: '🔗', xp: 500, t: 10, star: 120, rarity: 'epic', cur: function () { var r = R(), i = info(); return r && i ? streakFrom(r, i.len) : 0; } },
        { id: 'ramQadr', title: '✨ Ночь Предопределения', desc: 'Держать пост 27-го дня Рамадана', icon: '✨', xp: 400, t: 1, star: 100, rarity: 'legendary', cur: function () { var r = R(); return r && r.days[27] ? 1 : 0; } },
        { id: 'ramYears', title: '🏅 Верный месяцу', desc: 'Держать 60 дней Рамадана за всё время', icon: '🏅', xp: 1500, t: 60, star: 400, rarity: 'legendary', cur: totalFastedEver }
      ];
      defs.forEach(function (d) {
        if (ALL_ACHIEVEMENTS_FULL.some(function (a) { return a.id === d.id; })) return;
        var cur = d.cur || function () { var r = R(); return r ? fastedCount(r) : 0; };
        ALL_ACHIEVEMENTS_FULL.push({ id: d.id, category: 'fasting', title: d.title, desc: d.desc, icon: d.icon, xp: d.xp,
          check: function () { return cur() >= d.t; }, current: function () { return Math.min(cur(), d.t); }, target: d.t });
        try { ACHIEVEMENT_STAR_REWARDS[d.id] = d.star; } catch (e) {}
        try { ACHIEVEMENT_CARDS[d.id] = { id: 'ach_' + d.id, name: d.title.replace(/^[^\p{L}\p{N}]+/u, ''), title: d.desc, emoji: d.icon, type: 'achievement', rarity: d.rarity, story: 'Достижение месяца Рамадан. ' + d.desc + '. Да примет Аллах ваш пост и ночные молитвы.' };
          if (!ALL_CARDS.some(function (x) { return x.id === 'ach_' + d.id; })) ALL_CARDS.push(ACHIEVEMENT_CARDS[d.id]); } catch (e) {}
      });
      // «Рамадан завершён»: 29 или 30 дней, а не строго 30 (месяц бывает из 29)
      var rc = ALL_ACHIEVEMENTS_FULL.find(function (a) { return a.id === 'ramadanComplete'; });
      if (rc) { rc.desc = 'Завершить Рамадан (весь месяц)'; var cur2 = function () { var r = R(); return r ? fastedCount(r) : 0; };
        rc.check = function () { var i = info(); return !!i && cur2() >= 29; };
        rc.current = function () { return Math.min(cur2(), 29); }; rc.target = 29; }
    } catch (e) { console.warn('ramadan achievements', e); }
  }
  installAchievements();

  // ---------- Вопросы ----------
  function maghribMinutes() {
    try { if (typeof latestPrayerTimings !== 'undefined' && latestPrayerTimings && latestPrayerTimings.Maghrib) { var p = latestPrayerTimings.Maghrib.split(':'); return (+p[0]) * 60 + (+p[1]); } } catch (e) {}
    return 18 * 60;
  }
  function overlayBusy() { return !!document.querySelector('#ramFastPrompt') || !!document.querySelector('div[style*="999990"]') || !!document.getElementById('kunLangPicker') || (function(){var g=document.getElementById('kunEntryGate');return !!g&&g.style.display!=='none'&&getComputedStyle(g).display!=='none';})(); }
  function snoozed(kind, key) { try { return +(localStorage.getItem('kun_ram_snooze_' + kind + key) || 0) > Date.now(); } catch (e) { return false; } }
  function promptsOn() { try { return localStorage.getItem('kun_ramadan_prompts') !== 'off'; } catch (e) { return true; } }

  function promptUI(o) {
    var old = $('ramFastPrompt'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'ramFastPrompt'; el.className = 'ram-prompt';
    el.innerHTML = '<div class="ram-card" role="dialog" aria-modal="true"><div class="ram-moon">' + o.icon + '</div><div class="ram-sub">' + o.sub + '</div><h3>' + o.title + '</h3>' +
      (o.text ? '<p>' + o.text + '</p>' : '') + '<div class="ram-btns">' + o.buttons.map(function (b, i) { return '<button data-i="' + i + '" class="' + (b.cls || '') + '">' + b.label + '</button>'; }).join('') + '</div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (!b) return; var f = o.buttons[+b.dataset.i]; el.remove(); if (f.fn) f.fn(); });
  }
  function dateLabel(key) { return fmtDate(parseKey(key)); }

  function askMorning(inf, r, key) {
    promptUI({ icon: '🌙', sub: 'Рамадан · день ' + inf.dayNo + ' · ' + dateLabel(key), title: 'Вы будете держать пост сегодня?', text: 'Отметка в календаре появится вечером, когда вы ответите, держали ли пост.',
      buttons: [
        { label: 'Да, буду держать пост', cls: 'ram-yes', fn: function () { answer('m', key, 'yes'); note('🌙 Да примет Аллах ваше намерение. Вечером спросим, как прошёл день.'); } },
        { label: 'Нет, сегодня не пощусь', cls: 'ram-no', fn: function () { answer('m', key, 'no'); } },
        { label: 'Спросить позже', cls: 'ram-later', fn: function () { try { localStorage.setItem('kun_ram_snooze_m' + key, String(Date.now() + 3600000)); } catch (e) {} } }
      ] });
  }
  function askEvening(inf, r, key, isPast) {
    var m = (r.log[key] || {}).m;
    var no = dayNoOf(key, inf);
    promptUI({ icon: '🌆', sub: 'Рамадан · день ' + no + ' · ' + dateLabel(key), title: isPast ? 'Вы держали пост вчера?' : 'Вы держали пост сегодня?',
      text: m === 'yes' ? 'Утром вы сказали, что будете держать пост.' : m === 'no' ? 'Утром вы ответили «нет».' : 'Утром ответа не было.',
      buttons: [
        { label: 'Да, держал(а) пост', cls: 'ram-yes', fn: function () { answer('e', key, 'yes'); } },
        { label: 'Нет, не держал(а)', cls: 'ram-no', fn: function () { answer('e', key, 'no'); } },
        { label: 'Спросить позже', cls: 'ram-later', fn: function () { try { localStorage.setItem('kun_ram_snooze_e' + key, String(Date.now() + 3600000)); } catch (e) {} } }
      ] });
  }
  function answer(kind, key, val) {
    var inf = info(); var r = R(); if (!inf || !r) return;
    var l = r.log[key] = r.log[key] || {};
    l[kind] = val;
    if (kind === 'e') {
      var st = evaluate(l.m, l.e);
      if (st === 'mismatch') {
        promptUI({ icon: '❓', sub: 'Сверка ответов', title: 'Утром «нет», вечером «да». Засчитать этот день как пост?', text: 'Отметьте честно — это ваш личный учёт.',
          buttons: [ { label: 'Да, засчитать', cls: 'ram-yes', fn: function () { l.state = 'fasted'; finalize(inf, r, key); } }, { label: 'Нет', cls: 'ram-no', fn: function () { l.state = 'skipped'; finalize(inf, r, key); } } ] });
        save(); return;
      }
      l.state = st; finalize(inf, r, key);
    } else save();
    refreshUI();
  }
  function finalize(inf, r, key) {
    var l = r.log[key]; var on = l.state === 'fasted';
    setFasted(inf, r, key, on);
    if (on) note('✅ День ' + dayNoOf(key, inf) + ' Рамадана отмечен · ответы совпали. Да примет Аллах!');
    else if (l.state === 'broken') note('Отметка не поставлена: утром было намерение, но пост не завершён. День можно восполнить позже.');
    else note('День отмечен как «без поста».');
    save(); refreshUI();
    try { if (typeof updateHomeWidgets === 'function') updateHomeWidgets(); if (typeof updateFastingUI === 'function') updateFastingUI(); } catch (e) {}
  }

  var shown = {};
  function tick() {
    if (!promptsOn()) return;
    var inf = info(); if (!inf || !inf.inRamadan) return;
    var r = R(); if (!r) return;
    if (overlayBusy()) return;
    var now = nowD(), mins = now.getHours() * 60 + now.getMinutes();
    var today = dkey(now), yest = dkey(addDays(now, -1));
    // 1) вчерашний вечерний вопрос, если не ответили
    if (inf.dayNo > 1) { var ly = r.log[yest]; if (ly && ly.m === 'yes' && !ly.e && !snoozed('e', yest) && !shown['e' + yest]) { shown['e' + yest] = 1; return askEvening(inf, r, yest, true); } }
    var lt = r.log[today] || {};
    // 2) вечером — «держали ли пост»
    if (mins >= maghribMinutes() && !lt.e && !snoozed('e', today) && !shown['e' + today]) { shown['e' + today] = 1; return askEvening(inf, r, today, false); }
    // 3) утром/днём — «будете ли держать»
    if (mins < maghribMinutes() && !lt.m && !lt.e && !snoozed('m', today) && !shown['m' + today]) { shown['m' + today] = 1; return askMorning(inf, r, today); }
  }
  window.kunRamadanTick = tick;
  window.kunRamadanReset = function () { shown = {}; };
  setTimeout(tick, 4500);
  setInterval(function () { if (!document.hidden) tick(); }, 20000);
  window.addEventListener('kun:entry-ready', function () { setTimeout(tick, 3500); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { shown = {}; setTimeout(tick, 800); } });
  document.addEventListener('kunmusliman:new-day', function () { shown = {}; setTimeout(tick, 800); });

  // ---------- Экран «Рамадан» ----------
  function stateOf(r, key) { var l = r.log[key]; return l && l.state; }
  window.renderRamadanCalendar = function () {
    var box = $('ramadanCalendar'); if (!box) return;
    var inf = info(), r = R(); if (!inf || !r) { box.innerHTML = ''; return; }
    var head = $('ramadanInfoBox');
    if (!head) { head = document.createElement('div'); head.id = 'ramadanInfoBox'; box.parentNode.parentNode.insertBefore(head, box.parentNode); }
    var on = promptsOn();
    var msg = inf.inRamadan ? ('Идёт Рамадан · день <b>' + inf.dayNo + '</b> из ' + inf.len + '<br><small>' + fmtDate(inf.start) + ' — ' + fmtDate(inf.end) + ' · ' + inf.year + ' г. х.</small>')
      : ('До Рамадана <b>' + inf.daysUntil + '</b> дн.<br><small>Начало ≈ ' + fmtDate(inf.start) + ' · ' + inf.year + ' г. х. (по календарю Умм аль-Кура; точная дата зависит от виденья луны)</small>');
    head.innerHTML = '<div class="ram-info"><div>' + msg + '</div>' +
      '<label class="ram-toggle"><input type="checkbox" id="ramPromptsChk" ' + (on ? 'checked' : '') + '> Напоминать о посте: утром «будете ли держать?», вечером «держали ли?»</label>' +
      (inf.inRamadan ? '<div class="ram-today" id="ramTodayBox"></div>' : '') + '</div>';
    var chk = $('ramPromptsChk'); if (chk) chk.onchange = function () { try { localStorage.setItem('kun_ramadan_prompts', chk.checked ? 'on' : 'off'); } catch (e) {} };
    var tb = $('ramTodayBox');
    if (tb) {
      var tk = dkey(inf.today), l = r.log[tk] || {};
      tb.innerHTML = 'Сегодня: утро — <b>' + (l.m === 'yes' ? 'буду держать' : l.m === 'no' ? 'нет' : '—') + '</b> · вечер — <b>' + (l.e === 'yes' ? 'держал(а)' : l.e === 'no' ? 'не держал(а)' : '—') + '</b>' +
        '<div class="ram-today-btns"><button id="ramAskM">Утренний вопрос</button><button id="ramAskE">Вечерний вопрос</button></div>';
      $('ramAskM').onclick = function () { askMorning(inf, r, tk); };
      $('ramAskE').onclick = function () { askEvening(inf, r, tk, false); };
    }
    var html = '';
    for (var i = 1; i <= inf.len; i++) {
      var dt = addDays(inf.start, i - 1), key = dkey(dt), st = stateOf(r, key), fut = dt > inf.today, isT = key === dkey(inf.today);
      var cls = 'ramadan-day' + (r.days[i] ? ' fasted' : '') + (st === 'broken' ? ' broken' : '') + (st === 'skipped' ? ' skipped' : '') + (isT && inf.inRamadan ? ' today' : '') + (fut ? ' future' : '');
      var mark = r.days[i] ? '✓' : st === 'broken' ? '✕' : st === 'skipped' ? '–' : '';
      html += '<div class="' + cls + '" data-day="' + i + '" data-key="' + key + '"><b>' + i + '</b><i>' + dt.getDate() + '.' + pad(dt.getMonth() + 1) + '</i><em>' + mark + '</em></div>';
    }
    box.innerHTML = html;
    box.onclick = function (e) { var c = e.target.closest('.ramadan-day'); if (c) dayTap(c.dataset.key); };
    var prog = $('ramadanProgress'); if (prog) prog.textContent = fastedCount(r) + '/' + inf.len;
    var leg = $('ramLegend'); if (!leg) { leg = document.createElement('div'); leg.id = 'ramLegend'; leg.className = 'ram-legend'; box.parentNode.appendChild(leg); }
    leg.innerHTML = '<span><i class="g"></i>постился</span><span><i class="o"></i>не завершил(а)</span><span><i class="x"></i>без поста</span>';
  };
  window.toggleRamadanDay = function (n) { var i = info(); if (i) dayTap(dkey(addDays(i.start, n - 1))); };
  function dayTap(key) {
    var inf = info(), r = R(); if (!inf || !r) return;
    var d = parseKey(key), no = dayNoOf(key, inf);
    if (d > inf.today) { note('📅 Этот день Рамадана ещё не наступил'); return; }
    var tk = dkey(inf.today);
    if (key === tk) {
      var l = r.log[key] || {};
      if (!l.e) { note('🌙 Сегодняшний день отметится вечером — после ответов на оба вопроса'); return; }
    }
    var cur = r.days[no];
    promptUI({ icon: '📅', sub: 'День ' + no + ' · ' + dateLabel(key), title: cur ? 'Этот день отмечен как пост' : 'Отметить этот день?', text: 'Для пропущенных дней: если забыли ответить на вопросы — отметьте вручную.',
      buttons: [
        cur ? { label: 'Снять отметку', cls: 'ram-no', fn: function () { (r.log[key] = r.log[key] || {}).state = 'skipped'; setFasted(inf, r, key, false); save(); refreshUI(); } }
            : { label: 'Я держал(а) пост', cls: 'ram-yes', fn: function () { (r.log[key] = r.log[key] || {}).state = 'fasted'; setFasted(inf, r, key, true, true); save(); refreshUI(); } },
        { label: 'Закрыть', cls: 'ram-later' }
      ] });
  }
  function refreshUI() { try { window.renderRamadanCalendar(); if (typeof updateFastingUI === 'function') updateFastingUI(); } catch (e) {} }

  // Завершить Рамадан (кнопка): без двойных наград
  function bindComplete() {
    var b = $('completeRamadanBtn'); if (!b) return;
    var nb = b.cloneNode(true); b.parentNode.replaceChild(nb, b);
    nb.addEventListener('click', function () {
      var inf = info(), r = R(); if (!inf || !r) return;
      var c = fastedCount(r);
      if (!inf.inRamadan && inf.start > inf.today) { note('Рамадан ещё не начался'); return; }
      if (c < inf.len - 1) { note('Отмечено ' + c + ' из ' + inf.len + ' дней. Награда за весь месяц выдаётся при ' + (inf.len - 1) + '+ днях.'); return; }
      reward(inf, r, inf.len); save(); try { showFirework('🎉 РАМАДАН ЗАВЕРШЁН!'); } catch (e) {}
    });
  }
  bindComplete();
  setTimeout(function () { refreshUI(); bindComplete(); }, 600);
  console.log('🌙 Рамадан v55 готов');
})();
