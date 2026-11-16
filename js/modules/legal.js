/* v55 — Правовая информация: окно документов + удаление аккаунта/данных (для гостя и вошедшего) */
(function () {
  'use strict';
  function lang() { var l = ''; try { l = localStorage.getItem('kun_lang_v1') || ''; } catch (e) {} if (!l) l = (navigator.language || 'ru'); return l.slice(0, 2) === 'ru' ? 'ru' : 'en'; }
  window.openLegal = function (kind) {
    var L = window.KUN_LEGAL; if (!L) return;
    var d = (L[lang()] || L.ru)[kind]; if (!d) return;
    var old = document.getElementById('kunLegal'); if (old) old.remove();
    var el = document.createElement('section'); el.id = 'kunLegal'; el.className = 'legal-overlay'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    var web = 'https://mgmdov.github.io/Kunmusliman/' + (kind === 'delete' ? 'delete-account' : kind) + '.html';
    el.innerHTML = '<div class="legal-sheet"><header><button type="button" class="legal-back" data-close>‹ ' + (lang() === 'ru' ? 'Назад' : 'Back') + '</button><h2>' + d.title + '</h2><span></span></header>' +
      '<article class="legal-body" data-no-i18n>' + d.html + '</article>' +
      (kind === 'delete' ? '<div class="legal-actions"><button type="button" class="legal-danger" onclick="window.deleteMyAccount()">' + (lang() === 'ru' ? 'Удалить аккаунт и данные' : 'Delete account and data') + '</button></div>' : '') +
      '<div class="legal-foot"><a href="' + web + '" target="_blank" rel="noopener">' + (lang() === 'ru' ? 'Открыть на сайте' : 'Open on website') + '</a></div></div>';
    el.addEventListener('click', function (e) { if (e.target === el || e.target.closest('[data-close]')) el.remove(); });
    document.body.appendChild(el);
  };
  // Удаление: вошедший — облако + аккаунт + локально; гость — анонимный профиль + локально
  window.deleteMyAccount = async function () {
    var u = window._currentUser, db = window._db, ru = lang() === 'ru';
    var guest = !u || u.isAnonymous;
    if (!confirm(ru ? (guest ? 'Удалить все данные гостя на этом устройстве безвозвратно? Прогресс и карточки будут потеряны.' : 'Удалить аккаунт и все данные безвозвратно? Прогресс, рейтинг и карточки будут потеряны.') : (guest ? 'Delete all guest data on this device permanently?' : 'Delete your account and all data permanently? Progress, ranking and cards will be lost.'))) return;
    if (!confirm(ru ? 'Точно удалить? Это нельзя отменить.' : 'Are you sure? This cannot be undone.')) return;
    try {
      if (u && db) { await Promise.all(['users', 'leaderboard'].map(function (c) { return db.collection(c).doc(u.uid).delete().catch(function () {}); })); }
      if (u && typeof u.delete === 'function') await u.delete();
    } catch (e) {
      if (e && e.code === 'auth/requires-recent-login') { alert(ru ? 'Для удаления нужно заново войти. Выйдите, войдите снова и повторите.' : 'Please sign in again and retry the deletion.'); return; }
      alert((ru ? 'Не удалось удалить аккаунт: ' : 'Could not delete account: ') + ((e && e.message) || e)); return;
    }
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
    try { if (window.indexedDB && indexedDB.databases) { (await indexedDB.databases()).forEach(function (d) { try { indexedDB.deleteDatabase(d.name); } catch (e) {} }); } } catch (e) {}
    alert(ru ? 'Аккаунт и данные удалены.' : 'Account and data deleted.');
    location.reload();
  };
})();
