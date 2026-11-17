/* Kunmusliman v39: Quran card rewards, companion stories and live worship counters. */
const CACHE_NAME = 'kunmusliman-v60';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './apple-touch-icon.png',
  './icon-512.png',
  './css/achievements-v19.css',
  './css/animations.css',
  './css/army-campaign.css',
  './css/cards.css',
  './css/chest-wheel.css',
  './css/iphone-premium.css',
  './css/juma-cards.css',
  './css/main.css',
  './css/names-cards.css',
  './css/premium-v20.css',
  './css/quran-reader.css',
  './css/app-background.css',
  './css/v46-ui.css',
  './css/neon-wheel.css',
  './css/v26-polish.css',
  './js/modules/rewards-core.js',
  './css/ramadan.css',
  './js/modules/ramadan.js',
  './js/modules/legal-data.js',
  './js/modules/legal.js',
  './js/modules/collection-cats.js',
  './privacy.html',
  './terms.html',
  './delete-account.html',
  './js/modules/anti-farm.js',
  './js/modules/backup.js',
  './js/modules/v47-features.js',
  './js/modules/i18n-data.js',
  './js/modules/i18n.js',
  './images/splash-art.svg',
  './images/splash-mosque.jpg',
  './images/chests/star-wooden.jpg',
  './images/chests/star-silver.jpg',
  './images/chests/star-gold.jpg',
  './images/chests/star-emerald.jpg',
  './images/chests/gold.jpg',
  './images/chests/emerald.jpg',
  './images/chests/sapphire.jpg',
  './js/modules/duplicates.js',
  './images/bg/app-bg.jpg',
  './css/theme-fixes.css',
  './css/themes.css',
  './js/app.js',
  './js/modules/activity.js',
  './js/modules/anti-cheat.js',
  './js/modules/army.js',
  './js/modules/ayah-day.js',
  './js/modules/azkar.js',
  './js/modules/battles-data.js',
  './js/modules/battles.js',
  './js/modules/card-share.js',
  './js/modules/card-story-fullscreen.js',
  './js/modules/chest-cards-data.js',
  './js/modules/chest-collection.js',
  './js/modules/chest.js',
  './js/modules/collection.js',
  './js/modules/group-khatm.js',
  './js/modules/army-scenes.js',
  './js/modules/companion-stories.js',
  './js/modules/daily-tasks.js',
  './js/modules/dictionary.js',
  './js/modules/easter-eggs.js',
  './js/modules/fasting-calendar.js',
  './js/modules/fasting.js',
  './js/modules/fath-wheel-data.js',
  './js/modules/fath-wheel.js',
  './js/modules/friends.js',
  './js/modules/home-juma-widget.js',
  './js/modules/juma-cards.js',
  './js/modules/juma-tracking.js',
  './js/modules/juma.js',
  './js/modules/khatm.js',
  './js/modules/leaderboard.js',
  './js/modules/names-cards.js',
  './js/modules/names.js',
  './js/modules/nav-globals.js',
  './js/modules/nickname.js',
  './js/modules/pillars.js',
  './js/modules/prayer.js',
  './js/modules/azan.js',
  './js/modules/premium-tools.js',
  './js/modules/qa.js',
  './js/modules/quiz.js',
  './js/modules/quran-reader.js',
  './js/modules/quran.js',
  './js/modules/rewards-history.js',
  './js/modules/settings-overlays.js',
  './js/modules/settings.js',
  './js/modules/stars.js',
  './js/modules/swipe-back.js',
  './js/modules/tasbih-counter.js',
  './js/modules/tasbih.js',
  './js/modules/tauba.js',
  './js/modules/treasure-vault.js',
  './js/modules/ui-fx-1.js',
  './js/modules/ui-fx-2.js',
  './js/modules/ui-fx-collection.js',
  './js/modules/ui-sky.js',
  './js/modules/ui-splash.js',
  './js/modules/ui-water-icons.js',
  './js/modules/weekly-tasks.js',
  './js/modules/welcome.js',
  './js/modules/zikr.js',
  './images/cards/badr-battle.png',
  './images/cards/khandaq.jpg',
  './images/cards/khaybar.png',
  './images/cards/muhammad.png',
  './images/cards/uhud.png',
  './alhamdulillah.mp3.m4a',
  './allahuakbar.mp3.m4a',
  './astaghfirullah.mp3.m4a',
  './lailahaillallah.pm3.m4a',
  './subhanallah.mp3.m4a'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache files independently so one optional missing asset cannot block installation.
    await Promise.all(APP_SHELL.map(async path => {
      try { await cache.add(path); } catch (error) { console.warn('Precache skipped:', path, error); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME && key !== 'kunmusliman-cdn-v1').map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    // Шрифты и иконки с CDN: после первого онлайн-запуска работают и без интернета
    if (/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(url.hostname)) {
      event.respondWith((async () => {
        const cache = await caches.open('kunmusliman-cdn-v1');
        const hit = await cache.match(request);
        const net = fetch(request).then(r => { if (r && (r.ok || r.type === 'opaque')) cache.put(request, r.clone()); return r; }).catch(() => null);
        return hit || (await net) || Response.error();
      })());
    }
    return;
  }

  // Navigation: prefer fresh HTML, fall back to cached app shell while offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put('./index.html', response.clone());
        }
        return response;
      } catch (_) {
        return (await (await caches.open(CACHE_NAME)).match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await (await caches.open(CACHE_NAME)).match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});
