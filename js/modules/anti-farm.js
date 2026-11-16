/* Kunmusliman v55 — защита от накрутки звёзд и XP.
   Идея: считать можно сколько угодно (статистика не режется), но НАГРАДЫ за повторяемые действия
   ограничены дневным лимитом, а за страницы Корана — ещё и минимальным временем между наградами.
   День = локальные сутки устройства (сброс в 00:00). Грузится ПОСЛЕ rewards-core.js. */
(function () {
  'use strict';
  function day() { return (window.kunLocalDay ? window.kunLocalDay() : new Date().toISOString().slice(0, 10)); }

  // Дневные лимиты звёзд по категориям (по префиксу claimKey)
  var STAR_CAPS = [
    { re: /^zikr:milestone/,      cat: 'zikr',    cap: 8 },
    { re: /^salawat:milestone/,   cat: 'salawat', cap: 8 },
    { re: /^quran:page-read/,     cat: 'quran',   cap: 12, minGapMs: 25000 },
    { re: /^quiz:/,               cat: 'quiz',    cap: 10 },
    { re: /^azkar:/,              cat: 'azkar',   cap: 10 }
  ];
  // Дневные лимиты XP по источникам
  var XP_CAPS = { zikr: 300, salawat: 400, quran: 400, quiz: 300 };
  window.KUN_FARM_CAPS = { stars: STAR_CAPS, xp: XP_CAPS };

  function bucket() {
    var u = window.userData; if (!u) return null;
    var d = day();
    if (!u.farm || u.farm.day !== d) u.farm = { day: d, stars: {}, xp: {}, last: (u.farm && u.farm.last) || {} };
    if (!u.farm.stars) u.farm.stars = {}; if (!u.farm.xp) u.farm.xp = {}; if (!u.farm.last) u.farm.last = {};
    return u.farm;
  }
  var warned = {};
  function warnOnce(cat) {
    var k = cat + day(); if (warned[k]) return; warned[k] = 1;
    if (typeof window.showNotification === 'function') window.showNotification('⏳ Дневной лимит звёзд за это действие достигнут. Счёт и достижения продолжают расти.');
  }

  var origAward = window.awardStars;
  window.awardStars = function (amount, source, claimKey) {
    var key = String(claimKey || '');
    var rule = null;
    for (var i = 0; i < STAR_CAPS.length; i++) if (STAR_CAPS[i].re.test(key)) { rule = STAR_CAPS[i]; break; }
    var b = rule ? bucket() : null;
    if (rule && b) {
      var used = b.stars[rule.cat] || 0;
      var now = Date.now();
      if (rule.minGapMs && b.last[rule.cat] && now - b.last[rule.cat] < rule.minGapMs) return false;
      if (used >= rule.cap) { warnOnce(rule.cat); return false; }
      amount = Math.min(Math.floor(Number(amount) || 0), rule.cap - used);
      if (amount <= 0) return false;
    }
    var ok = origAward ? origAward.call(this, amount, source, claimKey) : false;
    if (ok && rule && b) { b.stars[rule.cat] = (b.stars[rule.cat] || 0) + amount; b.last[rule.cat] = Date.now(); }
    // любая настоящая награда (кроме самой серии) = признак живой активности для награды серии
    if (ok && key.indexOf('streak:') !== 0 && typeof window.kunMarkActivity === 'function') window.kunMarkActivity();
    return ok;
  };

  // Бюджет XP: сколько из запрошенного XP ещё можно выдать сегодня для данной категории
  window.kunXPBudget = function (cat, amount, cap) {
    amount = Math.max(0, Math.floor(Number(amount) || 0));
    cap = cap || XP_CAPS[cat] || 300;
    var b = bucket(); if (!b) return amount;
    var used = b.xp[cat] || 0;
    var allow = Math.max(0, Math.min(amount, cap - used));
    b.xp[cat] = used + allow;
    return allow;
  };

  // Сброс «Мой день» и счётчиков лимитов в 00:00 даже если приложение открыто
  var lastDay = day();
  setInterval(function () {
    var d = day();
    if (d !== lastDay) {
      lastDay = d; bucket();
      try { document.dispatchEvent(new CustomEvent('kunmusliman:new-day', { detail: { day: d } })); } catch (e) {}
      if (typeof window.checkAndUpdateStreak === 'function') window.checkAndUpdateStreak();
    }
  }, 15000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && day() !== lastDay) { lastDay = day(); bucket(); try { document.dispatchEvent(new CustomEvent('kunmusliman:new-day', { detail: { day: lastDay } })); } catch (e) {} if (window.checkAndUpdateStreak) window.checkAndUpdateStreak(); }
  });
  console.log('🛡️ Anti-farm v55');
})();
