/* Время намаза v57: расчёт по координатам (работает для любого города и села), автоопределение геопозиции,
   поиск населённых пунктов по всему миру (OpenStreetMap Nominatim), корректное «следующий намаз» в часовом поясе выбранного места. */
let latestPrayerTimings = null;
let prayerCountdownTimer = null;
let prayerTz = null;          // часовой пояс выбранного места (например "Europe/Moscow")
let prayerPlace = null;       // {lat,lng,name,country}

const PL = {
  $: id => document.getElementById(id),
  lang() { try { return (localStorage.getItem('kun_lang_v1') || 'ru').slice(0, 2); } catch (e) { return 'ru'; } },
  setText(t) { const el = PL.$('locationText'); if (el) el.textContent = t; },
  pad: n => String(n).padStart(2, '0')
};

function nowInTz(tz) {
  try {
    if (tz) {
      const p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const o = {}; p.forEach(x => o[x.type] = x.value);
      return (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10);
    }
  } catch (e) {}
  const d = new Date(); return d.getHours() * 60 + d.getMinutes();
}
const toMin = s => { const m = String(s).slice(0, 5).split(':'); return parseInt(m[0], 10) * 60 + parseInt(m[1], 10); };

function applyTimings(t, meta, label) {
  latestPrayerTimings = t;
  prayerTz = meta && meta.timezone || null;
  const set = (id, v) => { const el = PL.$(id); if (el) el.textContent = String(v).slice(0, 5); };
  set('fajrTime', t.Fajr); set('sunriseTime', t.Sunrise); set('dhuhrTime', t.Dhuhr); set('asrTime', t.Asr); set('maghribTime', t.Maghrib); set('ishaTime', t.Isha);
  if (label) PL.setText(label);
  updateNextPrayer(t); updateHomePrayerTimes(t);
  try { document.dispatchEvent(new CustomEvent('kunmusliman:prayer-times', { detail: { timings: t, tz: prayerTz } })); } catch (e) {}
}

function currentSettings() {
  return { method: PL.$('mazhabSelect')?.value || '16', school: PL.$('asrSchoolSelect')?.value || '0' };
}

// Основной запрос: по координатам
async function fetchPrayerByCoords(lat, lng, name, country) {
  const { method, school } = currentSettings();
  const d = new Date();
  const ts = Math.floor(d.getTime() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`;
  PL.setText('⏳ ' + (name || 'Загрузка…'));
  try {
    const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch(url, { cache: 'no-store', signal: ctrl.signal }); clearTimeout(to);
    const j = await r.json();
    if (j.code !== 200) throw new Error('api');
    prayerPlace = { lat, lng, name: name || '', country: country || '' };
    try {
      localStorage.setItem('prayer_last_response', JSON.stringify({ date: new Date().toDateString(), data: j.data }));
      localStorage.setItem('prayerLocation', JSON.stringify({ lat, lng, city: name || '', country: country || '', method, school }));
    } catch (e) {}
    applyTimings(j.data.timings, j.data.meta, `${name || ''}${country ? ', ' + country : ''} | ${j.data.date.readable}`);
    return true;
  } catch (e) {
    return loadCachedTimings(name);
  }
}

function loadCachedTimings(name) {
  try {
    const old = JSON.parse(localStorage.getItem('prayer_last_response') || 'null');
    if (old && old.data && old.data.timings) { applyTimings(old.data.timings, old.data.meta, (name ? name + ' · ' : '') + 'нет сети, показаны последние данные'); return true; }
  } catch (e) {}
  PL.setText('Не удалось получить время намаза. Проверьте интернет.');
  return false;
}

// Старый вызов по названию (оставлен для совместимости) — сначала находим координаты
async function fetchPrayerTimes(city, country) {
  const res = await searchPlaces([city, country].filter(Boolean).join(', '), '', 1);
  if (res && res[0]) return fetchPrayerByCoords(res[0].lat, res[0].lng, res[0].name, res[0].country);
  return loadCachedTimings(city);
}

// ---------- Поиск мест ----------
async function searchPlaces(q, cc, limit) {
  const lang = PL.lang();
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=${limit || 8}&accept-language=${encodeURIComponent(lang)}&q=${encodeURIComponent(q)}${cc ? '&countrycodes=' + cc : ''}`;
  const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
  const arr = await r.json();
  return (arr || []).map(x => {
    const a = x.address || {};
    const name = a.village || a.hamlet || a.town || a.city || a.municipality || a.suburb || a.locality || a.county || a.state || (x.display_name || '').split(',')[0];
    const region = a.state || a.region || a.county || '';
    return { lat: parseFloat(x.lat).toFixed(4), lng: parseFloat(x.lon).toFixed(4), name, region, country: a.country || '', type: x.type, full: x.display_name };
  });
}

let searchSeq = 0, searchTimer = null;
async function runSearch() {
  const q = (PL.$('cityInput')?.value || '').trim();
  const box = PL.$('placeResults'); if (!box) return;
  if (q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
  const my = ++searchSeq;
  box.hidden = false; box.innerHTML = '<div class="pl-empty">Поиск…</div>';
  try {
    const list = await searchPlaces(q, PL.$('countryFilter')?.value || '', 8);
    if (my !== searchSeq) return;
    if (!list.length) { box.innerHTML = '<div class="pl-empty">Ничего не найдено. Попробуйте написать иначе или выберите другую страну.</div>'; return; }
    box.innerHTML = '';
    list.forEach(p => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pl-item';
      b.innerHTML = '<b></b><small></small>';
      b.firstChild.textContent = p.name;
      b.lastChild.textContent = [p.region && p.region !== p.name ? p.region : '', p.country].filter(Boolean).join(', ');
      b.addEventListener('click', async () => {
        box.hidden = true; PL.$('cityInput').value = p.name; PL.$('countryInput').value = p.country;
        await fetchPrayerByCoords(p.lat, p.lng, p.name, p.country);
      });
      box.appendChild(b);
    });
  } catch (e) {
    if (my !== searchSeq) return;
    box.innerHTML = '<div class="pl-empty">Не удалось выполнить поиск. Проверьте интернет.</div>';
  }
}

// ---------- Геопозиция ----------
async function reverseName(lat, lng) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&addressdetails=1&accept-language=${encodeURIComponent(PL.lang())}&lat=${lat}&lon=${lng}`);
    const d = await r.json(); const a = d.address || {};
    return { name: a.village || a.hamlet || a.town || a.city || a.municipality || a.suburb || a.locality || a.county || a.state || '', country: a.country || '' };
  } catch (e) { return { name: '', country: '' }; }
}

function autoLocate() {
  const geo = (typeof navigator !== 'undefined') && navigator.geolocation;
  if (!geo) { PL.setText('Геопозиция недоступна на этом устройстве — найдите город или село в поиске.'); PL.$('cityInput')?.focus(); return; }
  PL.setText('📍 Определение геопозиции…');
  const btn = PL.$('autoLocateBtn'); if (btn) btn.disabled = true;
  geo.getCurrentPosition(async pos => {
    if (btn) btn.disabled = false;
    const lat = pos.coords.latitude.toFixed(4), lng = pos.coords.longitude.toFixed(4);
    const ok = await fetchPrayerByCoords(lat, lng, 'Моё местоположение', '');
    const rn = await reverseName(lat, lng);
    if (rn.name) {
      PL.$('cityInput').value = rn.name; PL.$('countryInput').value = rn.country;
      prayerPlace = { lat, lng, name: rn.name, country: rn.country };
      try { const s = JSON.parse(localStorage.getItem('prayerLocation') || '{}'); s.city = rn.name; s.country = rn.country; s.auto = true; localStorage.setItem('prayerLocation', JSON.stringify(s)); } catch (e) {}
      try { const old = JSON.parse(localStorage.getItem('prayer_last_response') || 'null'); PL.setText(`${rn.name}${rn.country ? ', ' + rn.country : ''} | ${old && old.data && old.data.date ? old.data.date.readable : ''}`); } catch (e) {}
    }
    return ok;
  }, err => {
    if (btn) btn.disabled = false;
    const msg = err && err.code === 1
      ? 'Доступ к геопозиции запрещён. Разрешите его: Настройки телефона → Конфиденциальность → Службы геолокации → Kunmusliman (или значок замка в адресной строке браузера). Либо найдите город / село в поиске выше.'
      : err && err.code === 3 ? 'Не удалось определить геопозицию вовремя. Выйдите на открытое место или найдите город / село в поиске.'
      : 'Не удалось определить геопозицию. Найдите город / село в поиске выше.';
    PL.setText(msg);
    if (!latestPrayerTimings) loadCachedTimings();
  }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
}

// ---------- Табло ----------
function updateHomePrayerTimes(t) {
  const set = (id, v) => { const el = PL.$(id); if (el) el.textContent = String(v).slice(0, 5); };
  set('homeFajr', t.Fajr); set('homeDhuhr', t.Dhuhr); set('homeAsr', t.Asr); set('homeMaghrib', t.Maghrib); set('homeIsha', t.Isha);
}
function updateNextPrayer(timings) {
  const cur = nowInTz(prayerTz);
  const prayers = [{ name: 'Фаджр', time: timings.Fajr }, { name: 'Шурук', time: timings.Sunrise }, { name: 'Зухр', time: timings.Dhuhr }, { name: 'Аср', time: timings.Asr }, { name: 'Магриб', time: timings.Maghrib }, { name: 'Иша', time: timings.Isha }];
  let next = prayers.find(p => toMin(p.time) > cur), diff;
  if (!next) { next = { name: 'Фаджр', time: timings.Fajr }; diff = toMin(next.time) + 1440 - cur; } else diff = toMin(next.time) - cur;
  const n = PL.$('nextPrayerName'), tm = PL.$('nextPrayerTime');
  if (n) n.textContent = next.name; if (tm) tm.textContent = next.time.slice(0, 5);
  const info = PL.$('nextPrayerInfo');
  if (info) info.innerHTML = `<i class="fas fa-clock"></i> Следующий намаз: ${next.name} (${next.time.slice(0, 5)}) — через ${Math.floor(diff / 60)} ч ${diff % 60} мин`;
}

function loadSavedLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem('prayerLocation') || 'null');
    if (saved) {
      if (saved.school !== undefined && PL.$('asrSchoolSelect')) PL.$('asrSchoolSelect').value = String(saved.school);
      if (saved.method && PL.$('mazhabSelect')) PL.$('mazhabSelect').value = saved.method;
      if (PL.$('cityInput') && saved.city && saved.city !== 'Моё местоположение') PL.$('cityInput').value = saved.city;
      if (saved.lat && saved.lng) { fetchPrayerByCoords(saved.lat, saved.lng, saved.city, saved.country); return; }
      if (saved.city) { fetchPrayerTimes(saved.city, saved.country); return; }
    }
  } catch (e) { try { localStorage.removeItem('prayerLocation'); } catch (x) {} }
  autoLocate(); // первый запуск: пробуем определить сами
}

function reload() { if (prayerPlace) fetchPrayerByCoords(prayerPlace.lat, prayerPlace.lng, prayerPlace.name, prayerPlace.country); }
PL.$('searchCityBtn')?.addEventListener('click', () => { clearTimeout(searchTimer); runSearch(); });
PL.$('cityInput')?.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 600); });
PL.$('cityInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(searchTimer); runSearch(); } });
PL.$('countryFilter')?.addEventListener('change', () => { if ((PL.$('cityInput')?.value || '').trim().length >= 2) runSearch(); });
PL.$('autoLocateBtn')?.addEventListener('click', autoLocate);
PL.$('asrSchoolSelect')?.addEventListener('change', reload);
PL.$('mazhabSelect')?.addEventListener('change', reload);
document.addEventListener('visibilitychange', () => { if (!document.hidden && latestPrayerTimings) updateNextPrayer(latestPrayerTimings); });
setTimeout(loadSavedLocation, 500);
if (prayerCountdownTimer) clearInterval(prayerCountdownTimer);
prayerCountdownTimer = setInterval(() => { if (latestPrayerTimings && !document.hidden) updateNextPrayer(latestPrayerTimings); }, 60000);
