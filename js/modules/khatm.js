function populateSuraSelect() {
    const s = document.getElementById('suraSelect'); if (!s) return;
    s.innerHTML = '<option value="">-- Выберите суру --</option>';
    SURA_NAMES_RU.forEach((n, i) => { const o = document.createElement('option'); o.value = i + 1; o.textContent = `${i + 1}. ${n}`; s.appendChild(o); });
}
function unlockSurahAchievement(num) {
    if (!userData.unlockedSurahs) userData.unlockedSurahs = [];
    if (!userData.unlockedCards) userData.unlockedCards = [];
    if (!userData.unlockedSurahs.includes(num)) {
        userData.unlockedSurahs.push(num);
        const surahCardId = `su${num}`;
        if (!userData.unlockedCards.includes(surahCardId)) userData.unlockedCards.push(surahCardId);
        const surahName = SURA_NAMES_RU[num-1];
        if (surahName === "Юнус") unlockProphet(20);
        if (surahName === "Худ") unlockProphet(4);
        if (surahName === "Юсуф") unlockProphet(11);
        if (surahName === "Ибрахим") unlockProphet(6);
        if (surahName === "Мухаммад") unlockProphet(24);
        if (surahName === "Нух") unlockProphet(3);
        if (surahName === "Лукман") unlockProphet(25);
        if (surahName === "Марьям") unlockProphet(23);
        if (surahName === "Аль-Анбия") { unlockProphet(6); unlockProphet(3); unlockProphet(7); unlockProphet(5); unlockProphet(12); }
        if (surahName === "Ас-Саффат") { unlockProphet(3); unlockProphet(6); unlockProphet(8); unlockProphet(14); unlockProphet(15); unlockProphet(7); unlockProphet(20); }
        addXP(100);
        showNotification(`📖 Сура «${SURA_NAMES_RU[num-1]}» открыта! +100 XP`);
        saveUserData();
        if (typeof renderCollection === 'function') renderCollection();
    }
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
    document.getElementById('completedKhatmsDisplay').textContent = k.completedKhatms || 0;
    document.getElementById('readPages').textContent = k.readPages || 0;
    document.getElementById('khatmPeriod').value = k.period || 30;
    const sura = k.currentSura || 1, page = k.currentPage || 1;
    document.getElementById('currentPositionDisplay').textContent = `Сура: ${sura}. ${SURA_NAMES_RU[sura-1] || '—'} | Страница: ${page}`;
    document.getElementById('suraSelect').value = sura;
    document.getElementById('pageInput').value = page;
    const prog = ((k.readPages || 0) / 604) * 100;
    document.getElementById('khatmProgressFill').style.width = prog + '%';
    document.getElementById('khatmProgressText').textContent = prog.toFixed(1) + '%';
    // Обновляем круговое кольцо
    var ring = document.getElementById('khatmRingProgress');
    if (ring) ring.setAttribute('stroke-dashoffset', String(490 - (prog / 100) * 490));
    const ppd = 604 / (k.period || 30);
    document.getElementById('pagesPerDay').textContent = ppd.toFixed(1);
    document.getElementById('dailyGoalText').innerHTML = `Читать ${ppd.toFixed(1)} страниц в день`;
    document.getElementById('remainingText').innerHTML = `Осталось: ${604 - (k.readPages || 0)} стр.`;
    const cooldown = checkKhatmCooldown();
    const btns = ['addPageBtn', 'removePageBtn', 'addJuzBtn', 'resetKhatmBtn', 'completeSurahBtn'];
    btns.forEach(id => { const btn = document.getElementById(id); if (btn) btn.disabled = cooldown; });
    const msg = document.getElementById('khatmCooldownMsg');
    if (cooldown) {
        const daysLeft = Math.ceil(7 - (Date.now() - new Date(k.lastCompletion).getTime()) / 86400000);
        msg.textContent = `⏳ Перерыв после хатма: ${daysLeft} дн. осталось`;
    } else { msg.textContent = ''; }
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
    if (!userData.stars) userData.stars = { totalStars: 0, lastClaimDate: '', unlockedRanks: [] };
    userData.stars.totalStars = (userData.stars.totalStars || 0) + 1;
    checkSahabiCards();
    saveUserData();
    if (typeof updateStarsUI === 'function') updateStarsUI();
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
    let r = userData.khatm?.readPages || 0; 
    if (r < 604) { r++; userData.khatm.readPages = r; addXP(5); userData.totalZikrOverall = (userData.totalZikrOverall || 0) + 1; checkZikrAchievements(); addStarForPage(); } 
    else { showNotification('📖 Вы уже прочитали весь Коран!'); }
    updateKhatmUI(); saveUserData(); 
});
document.getElementById('removePageBtn')?.addEventListener('click', () => { 
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    let current = userData.khatm?.readPages || 0;
    if (current >= 604) { showNotification('📖 Хатм завершён! Нельзя отменять страницы.'); return; }
    if (current > 0) { userData.khatm.readPages--; updateKhatmUI(); saveUserData(); } 
});
document.getElementById('addJuzBtn')?.addEventListener('click', () => { 
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    let current = userData.khatm?.readPages || 0;
    if (current >= 604) { showNotification('📖 Вы уже прочитали весь Коран!'); return; }
    let canAdd = Math.min(20, 604 - current);
    if (canAdd > 0) {
        userData.khatm.readPages = current + canAdd;
        addXP(canAdd * 5);
        userData.totalZikrOverall = (userData.totalZikrOverall || 0) + canAdd;
        checkZikrAchievements();
        for (let i = 0; i < canAdd; i++) addStarForPage();
        if (canAdd < 20) showNotification(`📖 Добавлено ${canAdd} стр. (до конца Корана)`);
    }
    updateKhatmUI(); saveUserData(); 
});
document.getElementById('resetKhatmBtn')?.addEventListener('click', () => { 
    if (checkKhatmCooldown()) { showNotification('⏳ Сейчас перерыв после хатма!'); return; }
    if (confirm('Сбросить прогресс?')) { userData.khatm.readPages = 0; updateKhatmUI(); saveUserData(); } 
});
document.getElementById('khatmPeriod')?.addEventListener('change', e => { userData.khatm.period = parseInt(e.target.value); updateKhatmUI(); saveUserData(); });
document.getElementById('setPageBtn')?.addEventListener('click', () => { 
    const p = parseInt(pageInput.value); 
    if (p >= 1 && p <= 604) { 
        const s = parseInt(suraSelect.value); 
        if (s) userData.khatm.currentSura = s; 
        userData.khatm.currentPage = p; 
        updateKhatmUI(); saveUserData(); 
        showNotification('📌 Позиция установлена'); 
    } 
});
document.getElementById('savePositionBtn')?.addEventListener('click', () => { saveUserData(); showNotification('💾 Позиция сохранена'); });

function checkZikrAchievements() {
    const totalZ = userData.totalZikrOverall || 0;
    const totalS = userData.totalSalawat || 0;
    if (totalZ >= 50000) unlockCardIfNotHave('z1');
    if (totalZ >= 100000) unlockCardIfNotHave('z2');
    if (totalZ >= 500000) unlockCardIfNotHave('z3');
    if (totalZ >= 1000000) unlockCardIfNotHave('z4');
    if (totalS >= 50000) unlockCardIfNotHave('sal1');
    if (totalS >= 100000) unlockCardIfNotHave('sal2');
    if (totalS >= 500000) unlockCardIfNotHave('sal3');
    if (totalS >= 1000000) unlockCardIfNotHave('sal4');
    if (!userData.stars) userData.stars = { totalStars: 0 };
    const starsFromZikr = Math.floor(totalZ / 500);
    if (starsFromZikr > lastZikrStarMilestone) {
        const starsToAdd = starsFromZikr - lastZikrStarMilestone;
        userData.stars.totalStars = (userData.stars.totalStars || 0) + starsToAdd;
        lastZikrStarMilestone = starsFromZikr;
        checkSahabiCards();
        if (typeof updateStarsUI === 'function') updateStarsUI();
        showNotification(`⭐ +${starsToAdd} звёзд за ${totalZ} зикров!`);
    }
}

populateSuraSelect(); 
updateKhatmUI();
