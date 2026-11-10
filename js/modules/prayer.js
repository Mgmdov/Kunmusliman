const DEFAULT_PRAYER_METHOD = '16'; // ДУМ РФ
const PRAYER_LOCATION_KEY = 'prayerLocation';
let prayerRequestId = 0;

function setPrayerLocationText(text) {
    const element = document.getElementById('locationText');
    if (element) element.textContent = text;
}

function getPrayerMethod() {
    return document.getElementById('mazhabSelect')?.value || DEFAULT_PRAYER_METHOD;
}

function savePrayerLocation(location) {
    try {
        localStorage.setItem(PRAYER_LOCATION_KEY, JSON.stringify({
            ...location,
            method: getPrayerMethod()
        }));
    } catch (error) {
        console.warn('Не удалось сохранить местоположение для времени намаза:', error);
    }
}

function readSavedPrayerLocation() {
    try {
        const saved = localStorage.getItem(PRAYER_LOCATION_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        return null;
    }
}

function displayPrayerTimes(timings, dateLabel) {
    const ids = {
        Fajr: 'fajrTime',
        Sunrise: 'sunriseTime',
        Dhuhr: 'dhuhrTime',
        Asr: 'asrTime',
        Maghrib: 'maghribTime',
        Isha: 'ishaTime'
    };

    for (const [name, id] of Object.entries(ids)) {
        const element = document.getElementById(id);
        if (element && timings[name]) element.textContent = timings[name].slice(0, 5);
    }

    updateHomePrayerTimes(timings);
    updateNextPrayer(timings);
    if (dateLabel) setPrayerLocationText(dateLabel);
}

async function requestPrayerTimes(url, label, location) {
    const requestId = ++prayerRequestId;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (result?.code !== 200 || !result?.data?.timings) {
            throw new Error('Сервис не вернул расписание намаза');
        }
        // Не позволяем более старому запросу перезаписать результат нового.
        if (requestId !== prayerRequestId) return;

        const dateLabel = `${label} | ${result.data.date.readable}`;
        displayPrayerTimes(result.data.timings, dateLabel);
        savePrayerLocation(location);
    } catch (error) {
        if (requestId === prayerRequestId) {
            console.error('Ошибка загрузки времени намаза:', error);
            setPrayerLocationText('⚠️ Не удалось загрузить время намаза. Проверьте интернет или местоположение.');
        }
    }
}

// Загрузка по координатам — точнее, чем поиск только по названию города.
function fetchPrayerTimesByCoordinates(latitude, longitude, placeLabel = 'Моё местоположение') {
    const method = getPrayerMethod();
    const url = `https://api.aladhan.com/v1/timings?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&method=${encodeURIComponent(method)}`;
    const savedLocation = {
        mode: 'auto',
        latitude,
        longitude,
        city: placeLabel,
        country: '',
        method
    };
    return requestPrayerTimes(url, placeLabel, savedLocation);
}

// Ручной поиск по городу остаётся доступен.
function fetchPrayerTimes(city, country = 'Россия') {
    const method = getPrayerMethod();
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${encodeURIComponent(method)}`;
    return requestPrayerTimes(url, `${city}, ${country}`, {
        mode: 'manual',
        city,
        country,
        method
    });
}

function updateHomePrayerTimes(timings) {
    const ids = {
        Fajr: 'homeFajr',
        Dhuhr: 'homeDhuhr',
        Asr: 'homeAsr',
        Maghrib: 'homeMaghrib',
        Isha: 'homeIsha'
    };
    for (const [name, id] of Object.entries(ids)) {
        const element = document.getElementById(id);
        if (element && timings[name]) element.textContent = timings[name].slice(0, 5);
    }
}

function updateNextPrayer(timings) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = [
        { name: 'Фаджр', key: 'Fajr' },
        { name: 'Шурук', key: 'Sunrise' },
        { name: 'Зухр', key: 'Dhuhr' },
        { name: 'Аср', key: 'Asr' },
        { name: 'Магриб', key: 'Maghrib' },
        { name: 'Иша', key: 'Isha' }
    ].map(prayer => ({
        ...prayer,
        time: timings[prayer.key]?.slice(0, 5) || '',
        minutes: Number((timings[prayer.key] || '00:00').slice(0, 2)) * 60 + Number((timings[prayer.key] || '00:00').slice(3, 5))
    }));

    const next = prayers.find(prayer => prayer.minutes > currentMinutes);
    const nameElement = document.getElementById('nextPrayerName');
    const timeElement = document.getElementById('nextPrayerTime');
    const infoElement = document.getElementById('nextPrayerInfo');
    if (!nameElement || !timeElement || !infoElement) return;

    if (!next) {
        nameElement.textContent = 'Фаджр';
        timeElement.textContent = prayers[0].time;
        infoElement.innerHTML = `<i class="fas fa-moon"></i> Следующий намаз: Фаджр (${prayers[0].time}) — завтра`;
        return;
    }

    const minutesUntil = next.minutes - currentMinutes;
    nameElement.textContent = next.name;
    timeElement.textContent = next.time;
    infoElement.innerHTML = `<i class="fas fa-clock"></i> Следующий намаз: ${next.name} (${next.time}) — через ${Math.floor(minutesUntil / 60)} ч ${minutesUntil % 60} мин`;
}

function fetchSavedLocation(saved) {
    if (!saved) return false;
    if (saved.method && document.getElementById('mazhabSelect')) {
        document.getElementById('mazhabSelect').value = saved.method;
    }

    if (saved.mode === 'auto' && Number.isFinite(Number(saved.latitude)) && Number.isFinite(Number(saved.longitude))) {
        fetchPrayerTimesByCoordinates(saved.latitude, saved.longitude, saved.city || 'Моё местоположение');
        return true;
    }
    if (saved.city) {
        const cityInput = document.getElementById('cityInput');
        const countryInput = document.getElementById('countryInput');
        if (cityInput) cityInput.value = saved.city;
        if (countryInput) countryInput.value = saved.country || 'Россия';
        fetchPrayerTimes(saved.city, saved.country || 'Россия');
        return true;
    }
    return false;
}

function useSavedLocationOrDefault(saved) {
    if (!fetchSavedLocation(saved)) fetchPrayerTimes('Москва', 'Россия');
}

function autoLocate() {
    if (!navigator.geolocation) {
        setPrayerLocationText('Геолокация недоступна — использую сохранённое местоположение');
        useSavedLocationOrDefault(readSavedPrayerLocation());
        return;
    }

    setPrayerLocationText('📍 Определение местоположения…');
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const cityInput = document.getElementById('cityInput');
            const countryInput = document.getElementById('countryInput');
            const saved = readSavedPrayerLocation();
            const placeLabel = saved?.mode === 'auto' && saved.city ? saved.city : 'Моё местоположение';
            if (cityInput && saved?.mode === 'auto') cityInput.value = saved.city || '';
            if (countryInput && saved?.mode === 'auto') countryInput.value = saved.country || '';
            fetchPrayerTimesByCoordinates(latitude, longitude, placeLabel);
        },
        error => {
            console.warn('Не удалось определить местоположение:', error.message);
            setPrayerLocationText('Геолокация не разрешена — использую сохранённое местоположение');
            useSavedLocationOrDefault(readSavedPrayerLocation());
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 15 * 60 * 1000 }
    );
}

function loadSavedLocation() {
    const saved = readSavedPrayerLocation();
    if (saved?.method && document.getElementById('mazhabSelect')) {
        document.getElementById('mazhabSelect').value = saved.method;
    }

    // Явно выбранный вручную город сохраняем между запусками; иначе пробуем геолокацию.
    if (saved?.mode === 'manual' && saved.city) {
        fetchSavedLocation(saved);
    } else {
        autoLocate();
    }
}

document.getElementById('searchCityBtn')?.addEventListener('click', () => {
    const city = document.getElementById('cityInput')?.value.trim();
    const country = document.getElementById('countryInput')?.value.trim() || 'Россия';
    if (city) fetchPrayerTimes(city, country);
    else setPrayerLocationText('Введите город для поиска');
});

document.getElementById('autoLocateBtn')?.addEventListener('click', () => {
    // Повторное нажатие возвращает режим автоматического определения.
    try { localStorage.removeItem(PRAYER_LOCATION_KEY); } catch (error) { /* storage может быть недоступен */ }
    autoLocate();
});

document.getElementById('mazhabSelect')?.addEventListener('change', () => {
    const saved = readSavedPrayerLocation();
    if (saved?.mode === 'auto' && Number.isFinite(Number(saved.latitude)) && Number.isFinite(Number(saved.longitude))) {
        fetchPrayerTimesByCoordinates(saved.latitude, saved.longitude, saved.city || 'Моё местоположение');
    } else {
        const city = document.getElementById('cityInput')?.value.trim();
        const country = document.getElementById('countryInput')?.value.trim() || 'Россия';
        if (city) fetchPrayerTimes(city, country);
        else autoLocate();
    }
});

setTimeout(loadSavedLocation, 500);

// Обновляем расписание раз в 10 минут; при смене дня значения также загрузятся заново.
setInterval(() => {
    const saved = readSavedPrayerLocation();
    if (saved?.mode === 'auto' && Number.isFinite(Number(saved.latitude)) && Number.isFinite(Number(saved.longitude))) {
        fetchPrayerTimesByCoordinates(saved.latitude, saved.longitude, saved.city || 'Моё местоположение');
    } else if (saved?.city) {
        fetchPrayerTimes(saved.city, saved.country || 'Россия');
    }
}, 10 * 60 * 1000);
