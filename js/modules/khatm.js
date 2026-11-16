function populateSuraSelect() {
    const s = document.getElementById('suraSelect'); if (!s) return;
    s.innerHTML = '<option value="">-- Выберите суру --</option>';
    SURA_NAMES_RU.forEach((n, i) => { const o = document.createElement('option'); o.value = i + 1; o.textContent = `${i + 1}. ${n}`; s.appendChild(o); });
}
// Синхронизация позиции Хатма с реальной страницей Корана.
let khatmSyncRequest = 0;
async function syncKhatmSurahFromPage(page) {
    const k = userData.khatm || (userData.khatm = {});
    const safePage = Math.min(604, Math.max(1, Math.trunc(Number(page) || 1)));
    const requestId = ++khatmSyncRequest;
    k.currentPage = safePage;
    try {
        const res = await fetch(`https://api.alquran.cloud/v1/page/${safePage}/quran-uthmani`);
        if (!res.ok) throw new Error('Quran API unavailable');
        const json = await res.json();
        const first = json?.data?.ayahs?.[0];
        // Не позволяем более старому запросу перезаписать новую позицию.
        if (requestId !== khatmSyncRequest) return;
        if (first?.surah?.number) {
            k.currentSura = first.surah.number;
            k.currentAyah = first.numberInSurah || 1;
        }
    } catch (e) {
        // Офлайн: сохраняем страницу и последнюю достоверно известную суру.
    }
    if (requestId !== khatmSyncRequest) return;
    updateKhatmUI();
    saveUserData();
}
function advanceKhatmPages(count) {
    const k = userData.khatm || (userData.khatm = {readPages:0,currentSura:1,currentPage:1});
    const requested = Math.max(0, Math.trunc(Number(count) || 0));
    const old = Math.min(604, Math.max(0, Math.trunc(Number(k.readPages)||0)));
    const oldCurrentPage = Math.min(604, Math.max(1, Math.trunc(Number(k.currentPage)||1)));
    const added = Math.min(requested, 604-old);
    if (!added) { showNotification('📖 Хатм завершён!'); return; }
    k.readPages = old + added;
    if (added > 0 && typeof window.completeDailyTask === 'function') window.completeDailyTask('read_quran');
    const nextPage = Math.min(604, Math.max(1, Math.trunc(Number(k.currentPage)||1) + added));
    k.currentPage = nextPage;
    updateKhatmUI();
    syncKhatmSurahFromPage(nextPage);
    trackKhatmCompletedSurahs(oldCurrentPage, Math.max(oldCurrentPage, nextPage - 1));
    if (typeof window.addArmyMerit === 'function') window.addArmyMerit('quran');
    addXP(typeof window.kunXPBudget==='function'?window.kunXPBudget('quran',added*5):added*5);
    for(let i=0;i<added;i++) addStarForPage();
    if (added < requested) showNotification(`Добавлено ${added} страниц — конец Корана`);
    saveUserData();
}


// При продвижении по страницам Хатма автоматически фиксируем именно те суры,
// последним аятом которых завершилась прочитанная страница, и сразу выдаём
// карточку суры: нажимать «Завершить суру» не нужно. Данные страниц берутся из
// Quran API и кэшируются локально. Каждая страница обрабатывается отдельно:
// если часть запросов не удалась (нет сети, сбой API), удачные страницы всё равно
// засчитываются, а остальные остаются в очереди и повторяются при открытии
// хатма, при возвращении сети и при следующем нажатии. Карточки не выдаются «на глаз».
const KHATM_CACHE_KEY = 'khatm_surah_page_cache_v1';
const KHATM_PENDING_KEY = 'khatm_pending_pages_v1';
let khatmTrackBusy = false, khatmTrackAgain = false, khatmOfflineNoticeShown = false;

function readKhatmJSON(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key) || ''); return v ?? fallback; } catch (e) { return fallback; }
}
function writeKhatmJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }

async function fetchKhatmPageRows(page, cache) {
    if (Array.isArray(cache[page]) && cache[page].length) return cache[page];
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, 10000);
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`, ctrl ? { signal: ctrl.signal } : undefined);
        if (!response.ok) throw new Error('Не удалось получить данные страницы ' + page);
        const json = await response.json();
        const rows = (json?.data?.ayahs || []).map(a => ({
            surah: Number(a.surah?.number), ayah: Number(a.numberInSurah), total: Number(a.surah?.numberOfAyahs)
        })).filter(a => a.surah && a.ayah && a.total);
        if (!rows.length) throw new Error('Пустой ответ для страницы ' + page);
        cache[page] = rows;
        return rows;
    } finally { clearTimeout(timer); }
}

async function trackKhatmCompletedSurahs(firstPage, lastPage) {
    let pending = readKhatmJSON(KHATM_PENDING_KEY, []);
    if (!Array.isArray(pending)) pending = [];
    // Без аргументов только обрабатываем очередь (возврат сети, открытие хатма).
    if (firstPage != null) {
        const from = Math.max(1, Math.min(604, Number(firstPage) || 1));
        const to = Math.max(from, Math.min(604, Number(lastPage) || from));
        for (let page = from; page <= to; page++) pending.push(page);
    }
    pending = [...new Set(pending.map(Number).filter(n => n >= 1 && n <= 604))].sort((a, b) => a - b);
    writeKhatmJSON(KHATM_PENDING_KEY, pending);
    if (!pending.length) return;
    if (khatmTrackBusy) { khatmTrackAgain = true; return; }
    khatmTrackBusy = true;
    try {
        do {
            khatmTrackAgain = false;
            const cache = readKhatmJSON(KHATM_CACHE_KEY, {});
            let queue = readKhatmJSON(KHATM_PENDING_KEY, []).map(Number).filter(n => n >= 1 && n <= 604);
            const completed = new Set();
            const failed = [];
            for (let i = 0; i < queue.length; i += 4) {
                const batch = queue.slice(i, i + 4);
                const settled = await Promise.allSettled(batch.map(page => fetchKhatmPageRows(page, cache)));
                settled.forEach((res, idx) => {
                    if (res.status === 'fulfilled') res.value.forEach(a => { if (a.ayah === a.total) completed.add(a.surah); });
                    else failed.push(batch[idx]);
                });
                if (failed.length >= 4) break; // сети нет — не долбим API десятки раз
            }
            // В очереди остаются страницы, которые не удалось получить или до которых не дошли:
            // успешно полученные страницы лежат в кэше.
            const finalPending = queue.filter(pg => !(Array.isArray(cache[pg]) && cache[pg].length));
            writeKhatmJSON(KHATM_CACHE_KEY, cache);
            writeKhatmJSON(KHATM_PENDING_KEY, finalPending);

            const unlocked = [];
            [...completed].sort((a, b) => a - b).forEach(num => {
                try { unlockSurahAchievement(num); unlocked.push(num); }
                catch (e) { console.warn('Не удалось выдать карточку суры', num, e); }
            });
            if (unlocked.length && typeof window.showNotification === 'function') {
                window.showNotification(`📖 Завершена сура${unlocked.length > 1 ? 'ы' : ''}: ${unlocked.map(n => SURA_NAMES_RU[n-1]).join(', ')}. Карточки добавлены в коллекцию.`);
            }
            if (finalPending.length && !khatmOfflineNoticeShown && typeof window.showNotification === 'function') {
                khatmOfflineNoticeShown = true;
                window.showNotification('📡 Не удалось проверить завершённые суры. Карточки будут выданы автоматически, когда появится интернет.');
            }
            if (!finalPending.length) khatmOfflineNoticeShown = false;
        } while (khatmTrackAgain);
    } catch (error) {
        console.warn('Автоматическая выдача карточек сур отложена:', error);
    } finally { khatmTrackBusy = false; }
}
window.addEventListener('online', () => trackKhatmCompletedSurahs());
setTimeout(() => trackKhatmCompletedSurahs(), 4000);
window.trackKhatmCompletedSurahs = trackKhatmCompletedSurahs;

function unlockSurahAchievement(num) {
    num = Math.trunc(Number(num));
    if (!Number.isInteger(num) || num < 1 || num > 114) return false;
    userData.unlockedSurahs ||= [];
    userData.unlockedCards ||= [];
    const wasSurahUnlocked = userData.unlockedSurahs.includes(num);
    const cardId = `su${num}`;
    const wasCardUnlocked = userData.unlockedCards.includes(cardId);
    if (!wasSurahUnlocked) userData.unlockedSurahs.push(num);
    if (!wasCardUnlocked) userData.unlockedCards.push(cardId);

    // Пророки, упомянутые в соответствующих сурах. Награда идемпотентна:
    // повторное чтение не выдаёт повторные карточки и не дублирует XP.
    const SURA_PROPHET_IDS = {
      2:[1,6,8,9,10,14,16,23],
      3:[1,3,6,8,9,10,14,15,21,22,23],
      4:[1,3,6,14,16,17,21,22,23],
      5:[14,16,23], 6:[3,6,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23],
      7:[1,3,4,5,7,13,14,15], 9:[6,23,24],
      10:[3,14,20], 11:[3,4,5,6,7,9,11,13,14],
      12:[6,9,10,11], 14:[3,6,14], 15:[1,6,7],
      17:[1,6,8,9,10,14,16,17,21,23], 18:[14],
      19:[1,2,6,8,9,10,11,21,22,23], 20:[1,14,15],
      21:[1,2,3,5,6,7,8,9,10,12,14,16,17,18,19,20,21,22,23,25],
      22:[3,4,5,6,7,13,14], 23:[3,14,15,23],
      25:[3,4,5,6,7,13,14,15], 26:[3,4,5,6,7,13,14],
      27:[5,7,14,16,17], 28:[14,15], 29:[3,6,7,9,10,13,14,15],
      33:[24], 37:[3,6,8,14,15,18,20],
      38:[6,8,9,10,12,16,17,18,19,25], 40:[3,6,11,14,15], 43:[6,14,23],
      44:[14], 46:[4], 47:[24], 48:[24], 49:[24], 51:[3,6,14], 52:[24], 53:[6,14], 54:[3,4,5,7],
      57:[3,6,23], 61:[14,23], 62:[24], 66:[3,7], 68:[24], 69:[3,4,5],
      71:[3], 73:[14,24], 74:[24], 79:[14], 80:[24], 87:[6,14], 91:[5], 93:[24], 96:[24], 108:[24], 110:[24]
    };
    const prophetIds = SURA_PROPHET_IDS[num] || [];
    prophetIds.forEach(id => { if (typeof unlockProphet === 'function') unlockProphet(id); });
    if (!wasSurahUnlocked) {
        const surahName = SURA_NAMES_RU[num-1];
        addXP(100);
        showNotification(`📖 Сура «${surahName}» открыта! Карточка суры${prophetIds.length ? ' и карточки упомянутых пророков' : ''} добавлены в коллекцию · +100 XP`);
    } else if (!wasCardUnlocked) {
        showNotification(`🎴 Карточка суры «${SURA_NAMES_RU[num-1]}» добавлена в коллекцию.`);
    }
    saveUserData();
    if (typeof saveLocalBackup === 'function') saveLocalBackup();
    if (typeof updateCollectionBadge === 'function') updateCollectionBadge();
    if (typeof renderCollection === 'function') renderCollection();
    return !wasCardUnlocked;
}
function completeCurrentSurah() {
    const cur = userData.khatm?.currentSura || 1;
    unlockSurahAchievement(cur);
    if (cur < 114) {
        userData.khatm.currentSura = cur + 1;
        userData.khatm.currentPage = 1;
        addXP(50 * cur);
        showNotification(`🎉 Сура «${SURA_NAMES_RU[cur-1]}» завершена! +${50 * cur} XP`);
    } else {
        userData.khatm.completedKhatms = (userData.khatm.completedKhatms || 0) + 1;
        userData.khatm.currentSura = 1;
        userData.khatm.currentPage = 1;
        userData.khatm.readPages = 0;
        userData.khatm.lastCompletion = new Date().toISOString();
        addXP(1000);
        showFirework(`🎉 ${userData.khatm.completedKhatms}-й ХАТМ ЗАВЕРШЁН!`);
        unlockSurahAchievement(114);
        checkKhatmCards();
    }
    updateKhatmUI();
    saveUserData();
}
function checkKhatmCooldown() {
    const k = userData.khatm || {};
    if (!k.lastCompletion) return false;
    const daysPassed = (Date.now() - new Date(k.lastCompletion).getTime()) / 86400000;
    return daysPassed < 7;
}
function updateKhatmUI() {
    const k = userData.khatm || { readPages: 0, completedKhatms: 0, period: 30, currentSura: 1, currentPage: 1 };
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('completedKhatmsDisplay', k.completedKhatms || 0);
    setText('readPages', k.readPages || 0);
    const periodEl = document.getElementById('khatmPeriod'); if (periodEl) periodEl.value = k.period || 30;
    const sura = k.currentSura || 1, page = k.currentPage || 1;
    setText('currentPositionDisplay', `Сура: ${sura}. ${SURA_NAMES_RU[sura-1] || '—'} | Страница: ${page}${k.currentAyah ? ' | Аят: '+k.currentAyah : ''}`);
    const suraEl = document.getElementById('suraSelect'); if (suraEl) suraEl.value = sura;
    const pageEl = document.getElementById('pageInput'); if (pageEl) pageEl.value = page;
    const prog = ((k.readPages || 0) / 604) * 100;
    const fillEl = document.getElementById('khatmProgressFill'); if (fillEl) fillEl.style.width = prog + '%';
    setText('khatmProgressText', prog.toFixed(1) + '%');
    // Обновляем круговое кольцо
    var ring = document.getElementById('khatmRingProgress');
    if (ring) ring.setAttribute('stroke-dashoffset', String(490 - (prog / 100) * 490));
    const ppd = 604 / (k.period || 30);
    setText('pagesPerDay', ppd.toFixed(1));
    const goalEl = document.getElementById('dailyGoalText'); if (goalEl) goalEl.textContent = `Читать ${ppd.toFixed(1)} страниц в день`;
    const remainingEl = document.getElementById('remainingText'); if (remainingEl) remainingEl.textContent = `Осталось: ${604 - (k.readPages || 0)} стр.`;
    const cooldown = checkKhatmCooldown();
    const btns = ['addPageBtn', 'removePageBtn', 'addJuzBtn', 'resetKhatmBtn', 'completeSurahBtn'];
    btns.forEach(id => { const btn = document.getElementById(id); if (btn) btn.disabled = cooldown; });
    const msg = document.getElementById('khatmCooldownMsg');
    if (msg && cooldown) {
        const daysLeft = Math.ceil(7 - (Date.now() - new Date(k.lastCompletion).getTime()) / 86400000);
        msg.textContent = `⏳ Перерыв после хатма: ${daysLeft} дн. осталось`;
    } else if (msg) { msg.textContent = ''; }
}
function checkKhatmCards() {
    const completed = userData.khatm?.completedKhatms || 0;
    if (completed === 1) { unlockCardIfNotHave('k1'); showFirework('🎉 Первый хатм!'); }
    if (completed === 5) { unlockCardIfNotHave('k5'); showFirework('🎉 5 хатмов!'); }
    if (completed === 10) { unlockCardIfNotHave('k10'); showFirework('🎉 10 хатмов!'); }
    if (completed === 25) { unlockCardIfNotHave('k25'); showFirework('🎉 25 хатмов!'); }
    if (completed === 50) { unlockCardIfNotHave('k50'); showFirework('🎉 50 хатмов!'); }
    if (completed === 100) { unlockCardIfNotHave('k100'); showFirework('🎉 100 хатмов!'); }
}
function addStarForPage() {
    if (typeof window.awardStars === 'function') { const u=window.userData; u.quranPagesRewarded=(u.quranPagesRewarded||0)+1; return window.awardStars(1, 'Чтение страницы Корана', 'quran:page-read:'+u.quranPagesRewarded); }
    if (!userData.stars) userData.stars = { totalStars: 0, lastClaimDate: '', unlockedRanks: [] };
    userData.stars.totalStars = (userData.stars.totalStars || 0) + 1;
    checkSahabiCards(); saveUserData(); if (typeof updateStarsUI === 'function') updateStarsUI();
}
function checkSahabiCards() {
    const totalStars = userData.stars?.totalStars || 0;
    SAHABI_DATA.forEach(s => { if (totalStars >= s.starsRequired) unlockCardIfNotHave(`s${s.id}`); });
}
document.getElementById('completeSurahBtn')?.addEventListener('click', () => { 
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    const cur = userData.khatm?.currentSura || 1;
    if (confirm(`Завершить суру «${SURA_NAMES_RU[cur-1]}»?`)) completeCurrentSurah(); 
});
document.getElementById('addPageBtn')?.addEventListener('click', () => {
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    advanceKhatmPages(1);
});
document.getElementById('addJuzBtn')?.addEventListener('click', () => {
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    advanceKhatmPages(20);
});
document.getElementById('removePageBtn')?.addEventListener('click', () => {
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    const k = userData.khatm || (userData.khatm = {});
    const current = Math.max(0, Math.trunc(Number(k.readPages)||0));
    if (current <= 0) return;
    k.readPages = current - 1;
    k.currentPage = Math.max(1, Math.trunc(Number(k.currentPage)||1) - 1);
    updateKhatmUI(); saveUserData(); syncKhatmSurahFromPage(k.currentPage);
});
document.getElementById('resetKhatmBtn')?.addEventListener('click', () => {
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    if (confirm('Сбросить прогресс чтения и вернуть позицию на первую страницу?')) {
        const k = userData.khatm || (userData.khatm = {});
        k.readPages = 0; k.currentPage = 1; k.currentSura = 1; k.currentAyah = 1;
        updateKhatmUI(); saveUserData(); syncKhatmSurahFromPage(1);
    }
});
document.getElementById('khatmPeriod')?.addEventListener('change', e => { userData.khatm.period = parseInt(e.target.value); updateKhatmUI(); saveUserData(); });
document.getElementById('setPageBtn')?.addEventListener('click', () => {
    const pageEl = document.getElementById('pageInput');
    const p = Math.trunc(Number(pageEl?.value));
    if (p >= 1 && p <= 604) {
        const k = userData.khatm || (userData.khatm = {});
        k.currentPage = p;
        updateKhatmUI(); saveUserData(); syncKhatmSurahFromPage(p);
        showNotification('📌 Позиция установлена');
    } else { showNotification('Введите страницу от 1 до 604'); }
});
document.getElementById('savePositionBtn')?.addEventListener('click', () => { saveUserData(); showNotification('💾 Позиция сохранена'); });

function checkZikrAchievements() {
    const totalZ = Number(userData.totalZikrOverall || 0);
    const totalS = Number(userData.totalSalawat || 0);
    if (totalZ >= 50000) unlockCardIfNotHave('z1');
    if (totalZ >= 100000) unlockCardIfNotHave('z2');
    if (totalZ >= 500000) unlockCardIfNotHave('z3');
    if (totalZ >= 1000000) unlockCardIfNotHave('z4');
    if (totalS >= 50000) unlockCardIfNotHave('sal1');
    if (totalS >= 100000) unlockCardIfNotHave('sal2');
    if (totalS >= 500000) unlockCardIfNotHave('sal3');
    if (totalS >= 1000000) unlockCardIfNotHave('sal4');
    if (typeof window.awardMilestoneStars === 'function') {
        window.awardMilestoneStars('zikr', totalZ, 100, 1);
        window.awardMilestoneStars('salawat', totalS, 100, 1);
    }
}

populateSuraSelect(); 
updateKhatmUI();

window.unlockSurahAchievement = unlockSurahAchievement; window.addStarForPage = addStarForPage;
