/* Kunmusliman v50: Групповой хатм — группа до 30 человек, страницы распределяются автоматически */
(function () {
  'use strict';
  var CANDS = ['khatm_rooms', 'khatm_groups'], COL = (function () { try { var c = localStorage.getItem('kun_gk_col'); return CANDS.indexOf(c) >= 0 ? c : CANDS[0]; } catch (e) { return CANDS[0]; } })(), TP = 604, MAXM = 30, MY_KEY = 'kun_my_groups_v1', CACHE_KEY = 'kun_group_cache_v1';
  var COLORS = ['#5dcaa5', '#d4a937', '#5a8acf', '#a878d8', '#e8825a', '#7F77DD', '#e24b4a', '#EF9F27'];
  var unsub = null;
  function T(s) { return window.kunT ? window.kunT(s) : s; }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function jget(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function db() { return window._db; }
  function me() { return window._currentUser; }
  function loggedIn() { var u = me(); return !!(db() && u && !u.isAnonymous); }
  function FV() { return firebase.firestore.FieldValue; }

  function setCol(c) { COL = c; try { localStorage.setItem('kun_gk_col', c); } catch (e) {} }
  function perm(e) { return !!e && (e.code === 'permission-denied' || /permission|insufficient/i.test(e.message || '')); }
  function friendly(e) { return perm(e) ? 'Нет доступа к базе. Администратору нужно опубликовать правила Firestore (файл firestore.rules в проекте).' : ((e && e.message) || 'Ошибка сети'); }
  function findCol(code) {
    var order = [COL].concat(CANDS.filter(function (c) { return c !== COL; })), i = 0;
    return (function next() {
      if (i >= order.length) return Promise.resolve(null);
      var c = order[i++];
      return db().collection(c).doc(code).get().then(function (d) { if (d.exists) { setCol(c); return c; } return next(); }, function () { return next(); });
    })();
  }
  function toast(m) { if (typeof showNotification === 'function') showNotification(m); else alert(m); }

  /* ---------- распределение страниц ---------- */
  function distribute(order) {
    var n = Math.max(1, order.length), base = Math.floor(TP / n), extra = TP % n, p = 1, out = {};
    order.forEach(function (uid, i) { var size = base + (i < extra ? 1 : 0); out[uid] = [[p, p + size - 1]]; p += size; });
    return out;
  }
  function toRanges(pages) {
    pages = pages.slice().sort(function (a, b) { return a - b; });
    var r = [], s = null, prev = null;
    pages.forEach(function (x) { if (s === null) { s = prev = x; } else if (x === prev + 1) prev = x; else { r.push([s, prev]); s = prev = x; } });
    if (s !== null) r.push([s, prev]); return r;
  }
  function expand(ranges) { var o = []; (ranges || []).forEach(function (r) { for (var p = r[0]; p <= r[1]; p++) o.push(p); }); return o; }
  function myPages(g, uid) { return expand((g.assign || {})[uid]); }
  function doneOf(g, uid) { return ((g.members || {})[uid] || {}).done || []; }
  function totalDone(g) { var s = 0; Object.keys(g.members || {}).forEach(function (u) { s += doneOf(g, u).length; }); return s; }
  function nextPage(g, uid) { var d = doneOf(g, uid); return myPages(g, uid).find(function (p) { return d.indexOf(p) < 0; }); }
  function rangeText(rs) { return (rs || []).map(function (r) { return r[0] === r[1] ? r[0] : r[0] + '–' + r[1]; }).join(', '); }
  window.GroupKhatmMath = { distribute: distribute, toRanges: toRanges, expand: expand };

  /* ---------- оболочка ---------- */
  function overlay() {
    var o = $('groupKhatmOverlay'); if (o) o.remove();
    o = document.createElement('div'); o.id = 'groupKhatmOverlay'; o.className = 'fullscreen-overlay gk-wrap';
    o.innerHTML = '<div class="overlay-header"><button class="overlay-back-btn" id="gkBack">‹ Назад</button><span class="overlay-title">Групповой хатм</span><span style="width:60px"></span></div><div class="gk-body" id="gkBody"></div>';
    document.body.appendChild(o);
    $('gkBack').onclick = function () { if (unsub) { unsub(); unsub = null; } if (o.dataset.view === 'detail') showList(); else o.remove(); };
    return o;
  }
  function body() { return $('gkBody'); }
  function setView(v) { var o = $('groupKhatmOverlay'); if (o) o.dataset.view = v; }

  function needLogin() {
    body().innerHTML = '<div class="gk-empty"><div style="font-size:44px">🤝</div><h3>Нужен аккаунт</h3><p>Чтобы читать вместе, войдите по email — так друзья увидят ваш ник.</p><button class="gk-btn" onclick="document.getElementById(\'groupKhatmOverlay\').remove();openAuthModal&&openAuthModal()">Войти</button></div>';
  }

  /* ---------- список групп ---------- */
  function showList() {
    setView('list'); if (unsub) { unsub(); unsub = null; }
    if (!loggedIn()) return needLogin();
    var el = body();
    el.innerHTML = '<div class="gk-actions"><button class="gk-btn" id="gkNew">＋ Создать группу</button><button class="gk-btn gk-ghost" id="gkJoin">Войти по коду</button></div><div id="gkList"><div class="gk-empty">Загрузка…</div></div>' +
      '<p class="gk-note">Создайте группу до 30 человек: приложение само разделит 604 страницы Корана между участниками. Каждая прочитанная в приложении страница засчитывается автоматически.</p>';
    $('gkNew').onclick = showCreate; $('gkJoin').onclick = function () { var c = prompt(T('Код группы:')); if (c) joinGroup(c.trim()); };
    var uid = me().uid;
    var errs = [];
    Promise.all(CANDS.map(function (c) { return db().collection(c).where('memberOrder', 'array-contains', uid).get().then(function (sn) { var a = []; sn.forEach(function (d) { a.push(Object.assign({ code: d.id, _col: c }, d.data())); }); return a; }, function (e) { errs.push(e); return []; }); })).then(function (parts) {
      var gs = [].concat.apply([], parts).filter(function (g) { return g && g.members; });
      if (!gs.length && errs.length === CANDS.length) throw errs[0];
      cacheGroups(gs);
      var list = $('gkList'); if (!list) return;
      if (!gs.length) { list.innerHTML = '<div class="gk-empty"><div style="font-size:44px">📖</div><p>У вас пока нет групп.<br>Создайте свою или введите код друга.</p></div>'; return; }
      list.innerHTML = gs.map(function (g) {
        var pct = Math.round(totalDone(g) * 100 / TP), n = (g.memberOrder || []).length;
        var st = g.status === 'done' ? '✅ Завершён' : g.status === 'open' ? '⏳ Набор · ' + n + '/' + (g.maxMembers || MAXM) : '📖 Идёт · ' + pct + '%';
        return '<button class="gk-card" data-c="' + esc(g.code) + '"><div><b>' + esc(g.name || 'Хатм') + '</b><small>' + st + '</small></div><span>›</span></button>';
      }).join('');
      list.querySelectorAll('.gk-card').forEach(function (b) { b.onclick = function () { var g0 = gs.filter(function (x) { return x.code === b.dataset.c; })[0]; if (g0 && g0._col) setCol(g0._col); showGroup(b.dataset.c); }; });
    }).catch(function (e) { var l = $('gkList'); if (l) l.innerHTML = '<div class="gk-empty">' + esc(friendly(e)) + '</div>'; });
  }
  function cacheGroups(gs) {
    var c = {}; gs.forEach(function (g) { if (g.status === 'active') c[g.code] = { assign: (g.assign || {})[me().uid] || [], done: doneOf(g, me().uid) }; });
    jset(CACHE_KEY, c);
  }

  /* ---------- создание ---------- */
  function showCreate() {
    setView('create');
    body().innerHTML = '<div class="gk-form"><h3>Новая группа</h3>' +
      '<label>Название<input id="gkName" maxlength="40" placeholder="Например: Хатм друзей"></label>' +
      '<label>Участников (до ' + MAXM + '): <b id="gkNV">20</b><input id="gkN" type="range" min="2" max="' + MAXM + '" value="20"></label>' +
      '<label>Срок<select id="gkDays"><option value="7">7 дней</option><option value="10">10 дней</option><option value="30" selected>30 дней</option><option value="60">60 дней</option></select></label>' +
      '<p class="gk-note" id="gkHint"></p><button class="gk-btn" id="gkCreate">Создать группу</button></div>';
    var hint = function () { var n = +$('gkN').value; $('gkNV').textContent = n; $('gkHint').textContent = 'Каждому участнику достанется примерно ' + Math.ceil(TP / n) + ' страниц.'; };
    $('gkN').oninput = hint; hint();
    $('gkCreate').onclick = function () {
      var name = ($('gkName').value || '').trim() || 'Хатм', n = +$('gkN').value, days = +$('gkDays').value, u = me(), ud = window.userData || {};
      var code = String(Math.floor(100000 + Math.random() * 900000)), members = {};
      members[u.uid] = { name: ud.nickname || u.displayName || 'Мусульманин', avatar: ud.avatar || '👤', done: [] };
      var g = { name: name, creator: u.uid, maxMembers: n, days: days, status: 'open', memberOrder: [u.uid], members: members, assign: {}, created: Date.now(), deadline: new Date(Date.now() + days * 864e5).toISOString() };
      var btn = $('gkCreate'); if (btn) { btn.disabled = true; btn.textContent = 'Создаю…'; }
      var order = [COL].concat(CANDS.filter(function (c) { return c !== COL; })), i = 0, lastErr = null;
      (function attempt() {
        if (i >= order.length) { toast(friendly(lastErr)); if (btn) { btn.disabled = false; btn.textContent = 'Создать группу'; } return; }
        var c = order[i++];
        db().collection(c).doc(code).set(g).then(function () { setCol(c); toast('Группа создана · код ' + code); showGroup(code); }).catch(function (e) { lastErr = e; if (perm(e) || i < order.length) attempt(); else { toast(friendly(e)); if (btn) { btn.disabled = false; btn.textContent = 'Создать группу'; } } });
      })();
    };
  }

  /* ---------- вход ---------- */
  function joinGroup(code) {
    if (!loggedIn()) { toast('Сначала войдите в аккаунт'); return; }
    var u = me(), ud = window.userData || {}, ref;
    findCol(code).then(function (c) { if (!c) { toast('Группа не найдена'); return null; } ref = db().collection(c).doc(code); return ref.get(); }).then(function (d) {
      if (!d) return;
      if (!d.exists) return toast('Группа не найдена');
      var g = d.data(), order = g.memberOrder || [];
      if (order.indexOf(u.uid) >= 0) return showGroup(code);
      if (g.status !== 'open') return toast('Хатм уже начался — набор закрыт');
      if (order.length >= (g.maxMembers || MAXM)) return toast('Группа заполнена');
      var upd = { memberOrder: FV().arrayUnion(u.uid) };
      upd['members.' + u.uid] = { name: ud.nickname || u.displayName || 'Мусульманин', avatar: ud.avatar || '👤', done: [] };
      return ref.update(upd).then(function () {
        if (order.length + 1 >= (g.maxMembers || MAXM)) return startGroup(code, true);
      }).then(function () { toast('Вы в группе «' + (g.name || 'Хатм') + '»'); if (!$('groupKhatmOverlay')) openGroupKhatm(); showGroup(code); });
    }).catch(function (e) { toast(friendly(e)); });
  }
  window.joinGroupKhatm = joinGroup;

  function startGroup(code, silent) {
    var ref = db().collection(COL).doc(code);
    return ref.get().then(function (d) {
      var g = d.data(); if (!g || g.status !== 'open') return;
      return ref.update({ status: 'active', assign: distribute(g.memberOrder || []), startedAt: Date.now(), deadline: new Date(Date.now() + (g.days || 30) * 864e5).toISOString() })
        .then(function () { if (!silent) toast('Хатм начался! Страницы распределены'); });
    });
  }

  /* ---------- экран группы ---------- */
  function showGroup(code) {
    setView('detail'); if (unsub) { unsub(); unsub = null; }
    body().innerHTML = '<div class="gk-empty">Загрузка…</div>';
    findCol(code).then(function () { unsub = db().collection(COL).doc(code).onSnapshot(function (d) {
      if (!d.exists) { toast('Группа удалена'); return showList(); }
      renderGroup(Object.assign({ code: code }, d.data()));
    }, function (e) { var b = body(); if (b) b.innerHTML = '<div class="gk-empty">' + esc(friendly(e)) + '</div>'; }); });
  }
  function ring(pct) { var c = 264, off = Math.round(c - pct / 100 * c); return '<svg viewBox="0 0 100 100" class="gk-ring"><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(128,128,128,.18)" stroke-width="8"/><circle cx="50" cy="50" r="42" fill="none" stroke="url(#gkg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 50 50)"/><defs><linearGradient id="gkg"><stop offset="0" stop-color="#f4dc93"/><stop offset="1" stop-color="#5dcaa5"/></linearGradient></defs><text x="50" y="55" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">' + pct + '%</text></svg>'; }

  function renderGroup(g) {
    var b = body(); if (!b) return;
    var uid = me().uid, order = g.memberOrder || [], isAdmin = g.creator === uid, n = order.length;
    var done = totalDone(g), pct = Math.min(100, Math.round(done * 100 / TP));
    var left = Math.max(0, Math.ceil((new Date(g.deadline) - Date.now()) / 864e5));
    var h = '<div class="gk-hero"><div class="gk-hero-t"><b>' + esc(g.name) + '</b><small>Код: <span class="gk-code">' + esc(g.code) + '</span></small><small>' + n + '/' + (g.maxMembers || MAXM) + ' участников' + (g.status === 'active' ? ' · осталось ' + left + ' дн' : '') + '</small></div>' + ring(pct) + '</div>';
    if (g.status === 'done') h += '<div class="gk-banner">🎉 Хатм завершён всей группой! Да примет Аллах.</div>';
    if (g.status === 'open') {
      h += '<div class="gk-banner">⏳ Идёт набор. Когда все соберутся, нажмите «Начать» — страницы разделятся поровну. Сейчас на каждого пришлось бы ~' + Math.ceil(TP / Math.max(1, n)) + ' стр.</div>';
    }
    if (g.status === 'active' || g.status === 'done') {
      var mine = myPages(g, uid), md = doneOf(g, uid), np = nextPage(g, uid);
      h += '<div class="gk-mine"><div><small>МОИ СТРАНИЦЫ</small><b>' + (rangeText((g.assign || {})[uid]) || '—') + '</b></div><div class="gk-mine-r"><b>' + md.length + '/' + mine.length + '</b><small>прочитано</small></div></div>';
      if (np) h += '<div class="gk-actions"><button class="gk-btn" id="gkRead">📖 Читать стр. ' + np + '</button><button class="gk-btn gk-ghost" id="gkMark">✓ Отметить стр. ' + np + '</button></div>';
      else if (mine.length) h += '<div class="gk-banner">✅ Вы прочитали все свои страницы. Ма ша Аллах!</div>';
    }
    h += '<h4 class="gk-h">Участники</h4>';
    var rows = order.map(function (u, i) { var m = (g.members || {})[u] || {}; var tot = myPages(g, u).length, dn = doneOf(g, u).length; return { u: u, i: i, m: m, tot: tot, dn: dn }; });
    rows.sort(function (a, b2) { return b2.dn - a.dn; });
    rows.forEach(function (r, k) {
      var me2 = r.u === uid, col = COLORS[r.i % COLORS.length], p = r.tot ? Math.round(r.dn * 100 / r.tot) : 0;
      h += '<div class="gk-row' + (me2 ? ' me' : '') + '"><span class="gk-rank">' + (r.dn ? (k < 3 ? ['🥇', '🥈', '🥉'][k] : k + 1) : '·') + '</span><span class="gk-av">' + esc(r.m.avatar || '👤') + '</span><div class="gk-rm"><b>' + esc(r.m.name || '—') + (me2 ? ' (вы)' : '') + (r.u === g.creator ? ' ★' : '') + '</b><small>' + (r.tot ? 'стр. ' + rangeText(g.assign[r.u]) : 'ждёт начала') + '</small><i><u style="width:' + p + '%;background:' + col + '"></u></i></div><span class="gk-rc" style="color:' + col + '">' + r.dn + (r.tot ? '/' + r.tot : '') + '</span></div>';
    });
    h += '<div class="gk-actions" style="margin-top:16px"><button class="gk-btn gk-ghost" id="gkInv">📨 Пригласить</button>';
    if (isAdmin && g.status === 'open') h += '<button class="gk-btn" id="gkStart"' + (n < 2 ? ' disabled' : '') + '>▶ Начать хатм</button>';
    h += '</div><div class="gk-actions">' + (isAdmin ? '<button class="gk-btn gk-danger" id="gkDel">Удалить группу</button>' : '<button class="gk-btn gk-danger" id="gkLeave">Выйти</button>') + '</div>';
    b.innerHTML = h;
    var q = function (id, f) { var e = $(id); if (e) e.onclick = f; };
    q('gkRead', function () { var np2 = nextPage(g, uid); var o = $('groupKhatmOverlay'); if (o) o.style.display = 'none'; window.__gkReturn = true; if (typeof openQuranPage === 'function') openQuranPage(np2); });
    q('gkMark', function () { markPage(g.code, nextPage(g, uid)); });
    q('gkStart', function () { startGroup(g.code); });
    q('gkInv', function () { invite(g); });
    q('gkDel', function () { if (confirm('Удалить группу для всех?')) db().collection(COL).doc(g.code).delete().then(function () { toast('Группа удалена'); showList(); }); });
    q('gkLeave', function () { leave(g); });
    afterChange(g);
  }
  function afterChange(g) {
    if (g.status === 'active' && totalDone(g) >= TP && g.creator === me().uid) db().collection(COL).doc(g.code).update({ status: 'done', completedAt: Date.now() });
    if (g.status === 'done' && doneOf(g, me().uid).length && typeof window.awardStars === 'function') window.awardStars(20, 'Групповой хатм завершён', 'group:done:' + g.code);
  }
  function invite(g) {
    var url = location.origin + location.pathname + '?room=' + g.code, t = 'Присоединяйся к групповому хатму «' + g.name + '»! Код: ' + g.code + '\n' + url;
    if (navigator.share) navigator.share({ title: 'Групповой хатм', text: t }).catch(function () {});
    else { try { navigator.clipboard.writeText(t); toast('Приглашение скопировано'); } catch (e) { prompt('Скопируйте:', t); } }
  }
  function leave(g) {
    if (!confirm('Выйти из группы?')) return;
    var u = me().uid, ref = db().collection(COL).doc(g.code), upd = { memberOrder: FV().arrayRemove(u) };
    upd['members.' + u] = FV().delete();
    if (g.status === 'active') {
      // непрочитанные страницы вышедшего делятся между остальными
      var rest = (g.memberOrder || []).filter(function (x) { return x !== u; }), d = doneOf(g, u), free = myPages(g, u).filter(function (p) { return d.indexOf(p) < 0; });
      var asg = {}; Object.keys(g.assign || {}).forEach(function (k) { if (k !== u) asg[k] = (g.assign[k] || []).slice(); });
      var size = Math.ceil(free.length / Math.max(1, rest.length));
      rest.forEach(function (r, i) { var part = free.slice(i * size, (i + 1) * size); asg[r] = toRanges(expand(asg[r]).concat(part)); });
      upd.assign = asg;
    }
    ref.update(upd).then(function () { toast('Вы вышли из группы'); showList(); }).catch(function (e) { toast(e.message); });
  }

  /* ---------- отметка страниц ---------- */
  function markPage(code, p) {
    if (!p) return Promise.resolve(false);
    var upd = {}; upd['members.' + me().uid + '.done'] = FV().arrayUnion(p);
    return db().collection(COL).doc(code).update(upd).then(function () { toast('Страница ' + p + ' засчитана в группе'); return true; }).catch(function (e) { toast(e.message); return false; });
  }
  // Вызывается из Корана, когда страница отмечена прочитанной
  window.groupKhatmOnPage = function (p) {
    if (!loggedIn()) return;
    var c = jget(CACHE_KEY, {});
    Object.keys(c).forEach(function (code) {
      var a = c[code]; if (!a || expand(a.assign).indexOf(p) < 0 || (a.done || []).indexOf(p) >= 0) return;
      markPage(code, p).then(function (ok) { if (ok) { a.done = (a.done || []).concat([p]); c[code] = a; jset(CACHE_KEY, c); } });
    });
  };
  // Загружаем назначения при старте, чтобы автоотметка работала без открытия экрана
  function warm() { if (!loggedIn()) return; db().collection(COL).where('memberOrder', 'array-contains', me().uid).get().then(function (s) { var gs = []; s.forEach(function (d) { gs.push(Object.assign({ code: d.id }, d.data())); }); cacheGroups(gs); }).catch(function () {}); }

  function openGroupKhatm() { overlay(); showList(); }
  window.openGroupKhatm = openGroupKhatm;
  window.openCoopKhatm = openGroupKhatm;

  // возврат в группу после чтения
  document.addEventListener('click', function (e) { var c = e.target.closest && e.target.closest('[data-act="close"]'); if (c && window.__gkReturn) { window.__gkReturn = false; var o = $('groupKhatmOverlay'); if (o) { o.style.display = ''; var code = ((o.querySelector('.gk-code') || {}).textContent) || ''; if (code) showGroup(code); } } }, true);

  function init() {
    setTimeout(warm, 4000);
    var room = new URLSearchParams(location.search).get('room');
    if (room) window.addEventListener('kun:entry-ready', function () { setTimeout(function () { joinGroup(room); }, 1500); }, { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
