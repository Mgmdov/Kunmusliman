async function fetchPrayerTimes(city, country = 'Россия') {
    try {
        const method = document.getElementById('mazhabSelect')?.value || '16';
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
        const r = await fetch(url), d = await r.json();
        if (d.code === 200) {
            const t = d.data.timings;
            document.getElementById('fajrTime').textContent = t.Fajr.slice(0,5);
            document.getElementById('sunriseTime').textContent = t.Sunrise.slice(0,5);
            document.getElementById('dhuhrTime').textContent = t.Dhuhr.slice(0,5);
            document.getElementById('asrTime').textContent = t.Asr.slice(0,5);
            document.getElementById('maghribTime').textContent = t.Maghrib.slice(0,5);
            document.getElementById('ishaTime').textContent = t.Isha.slice(0,5);
            document.getElementById('locationText').textContent = `${city}, ${country} | ${d.data.date.readable}`;
            updateNextPrayer(t); updateHomePrayerTimes(t);
            localStorage.setItem('prayerLocation', JSON.stringify({city, country, method}));
        }
    } catch(e) { document.getElementById('locationText').textContent = '⚠️ Ошибка загрузки'; }
}
function updateHomePrayerTimes(t) {
    document.getElementById('homeFajr').textContent = t.Fajr.slice(0,5);
    document.getElementById('homeDhuhr').textContent = t.Dhuhr.slice(0,5);
    document.getElementById('homeAsr').textContent = t.Asr.slice(0,5);
    document.getElementById('homeMaghrib').textContent = t.Maghrib.slice(0,5);
    document.getElementById('homeIsha').textContent = t.Isha.slice(0,5);
}
function updateNextPrayer(timings) {
    const now = new Date();
    const cur = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const prayers = [{name:'Фаджр',time:timings.Fajr},{name:'Шурук',time:timings.Sunrise},{name:'Зухр',time:timings.Dhuhr},{name:'Аср',time:timings.Asr},{name:'Магриб',time:timings.Maghrib},{name:'Иша',time:timings.Isha}];
    let next = prayers.find(p => p.time > cur);
    if (!next) { document.getElementById('nextPrayerName').textContent = 'Фаджр'; document.getElementById('nextPrayerTime').textContent = timings.Fajr.slice(0,5); document.getElementById('nextPrayerInfo').innerHTML = `<i class="fas fa-moon"></i> Следующий намаз: Фаджр (${timings.Fajr.slice(0,5)}) — завтра`; return; }
    const [h,m] = next.time.split(':'); const nd = new Date(); nd.setHours(parseInt(h),parseInt(m),0);
    const diff = Math.floor((nd - now) / 60000);
    document.getElementById('nextPrayerName').textContent = next.name;
    document.getElementById('nextPrayerTime').textContent = next.time.slice(0,5);
    document.getElementById('nextPrayerInfo').innerHTML = `<i class="fas fa-clock"></i> Следующий намаз: ${next.name} (${next.time.slice(0,5)}) — через ${Math.floor(diff/60)} ч ${diff%60} мин`;
}
function autoLocate() {
    if (!navigator.geolocation) return;
    document.getElementById('locationText').textContent = '📍 Определение...';
    navigator.geolocation.getCurrentPosition(async pos => {
        try {
            const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=ru`);
            const d = await geo.json();
            const city = d.address?.city || d.address?.town || 'Москва';
            const country = d.address?.country || 'Россия';
            document.getElementById('cityInput').value = city;
            document.getElementById('countryInput').value = country;
            fetchPrayerTimes(city, country);
        } catch(e) { fetchPrayerTimes('Москва', 'Россия'); }
    });
}
function loadSavedLocation() {
    const s = localStorage.getItem('prayerLocation');
    if (s) { const {city, country, method} = JSON.parse(s); if (method) document.getElementById('mazhabSelect').value = method; document.getElementById('cityInput').value = city || ''; document.getElementById('countryInput').value = country || 'Россия'; fetchPrayerTimes(city, country); }
    else { autoLocate(); }
}
document.getElementById('searchCityBtn')?.addEventListener('click', () => { const city = document.getElementById('cityInput').value.trim(); const country = document.getElementById('countryInput').value.trim() || 'Россия'; if (city) fetchPrayerTimes(city, country); });
document.getElementById('autoLocateBtn')?.addEventListener('click', autoLocate);
document.getElementById('mazhabSelect')?.addEventListener('change', () => { const city = document.getElementById('cityInput').value.trim(); if (city) fetchPrayerTimes(city, document.getElementById('countryInput').value.trim() || 'Россия'); else autoLocate(); });
setTimeout(loadSavedLocation, 500);
setInterval(() => { const s = localStorage.getItem('prayerLocation'); if (s) { const {city, country} = JSON.parse(s); fetchPrayerTimes(city, country); } }, 600000);
