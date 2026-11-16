const ZIKR_LIST_FULL = [
    { id: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', translit: 'СубхьанаЛлох1', translation: 'Пречист Аллах' },
    { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', translit: 'АльхьамдулиЛлах1', translation: 'Хвала Аллаху' },
    { id: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', translit: 'Аллох1у Акбар', translation: 'Аллах Велик' },
    { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', translit: 'Астаг1фируЛлох1', translation: 'Прошу прощения у Аллаха' },
    { id: 'lailahaillallah', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', translit: 'Льа ильах1а иллаЛлох1', translation: 'Нет бога, кроме Аллаха' },
    { id: 'subhanallah_wabihamdihi', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translit: 'СубхьаанаЛлох1и ва бих1амдих1', translation: 'Пречист Аллах и хвала Ему' },
    { id: 'subhanallah_alazim', arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ', translit: 'СубхьаанаЛлох1иль-1азыым', translation: 'Пречист Аллах Великий' }
];
let salawatCount = 0, totalSalawatLifetime = 0;
function getTotalZikr() { return Object.values(userData.zikrCounters || {}).reduce((a,b) => a+b, 0); }
function checkMuhammadCardCondition() {
    // Секретное испытание доступно только в пятницу по локальному календарю устройства.
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    let ritual = userData.muhammadSecretRitual || null;

    // Награду за испытание можно получить только один раз.
    if (userData.muhammadSecretRitualClaimed === true) return;

    // Понедельник–четверг и суббота–воскресенье не подходят.
    // Любой незавершённый таймер, оставшийся с другого дня, аннулируется.
    if (today.getDay() !== 5) {
        if (ritual) {
            delete userData.muhammadSecretRitual;
            saveUserData();
        }
        return;
    }

    const todaySalawat = parseInt(localStorage.getItem(`salawat_${todayStr}`), 10) || 0;

    // Требуется ровно 1 000 салаватов за эту пятницу. Если счётчик изменился,
    // пятиминутное ожидание сбрасывается; превышение 1 000 не засчитывается.
    if (todaySalawat !== 1000) {
        if (ritual && ritual.date === todayStr) {
            delete userData.muhammadSecretRitual;
            saveUserData();
        }
        return;
    }

    if (!ritual || ritual.date !== todayStr || Number(ritual.count) !== 1000) {
        userData.muhammadSecretRitual = { date: todayStr, startedAt: Date.now(), count: 1000 };
        saveUserData();
        showNotification('🌙 Ровно 1 000 салаватов в пятницу. Теперь сделайте паузу 5 минут, не добавляя новых салаватов.');
        return;
    }

    if (Date.now() - Number(ritual.startedAt) >= 5 * 60 * 1000) {
        if (!userData.unlockedCards) userData.unlockedCards = [];
        // Если карточка уже была открыта другим способом, испытание всё равно
        // выдаёт свою уникальную награду, но не создаёт дубликат карточки.
        if (!userData.unlockedCards.includes('p24')) {
            if (typeof unlockCardIfNotHave === 'function') unlockCardIfNotHave('p24');
            else userData.unlockedCards.push('p24');
        }
        userData.muhammadSecretRitualClaimed = true;
        delete userData.muhammadSecretRitual;
        if (typeof window.awardStars === 'function') {
            window.awardStars(10000, 'Секретное пятничное испытание: ровно 1 000 салаватов и пауза 5 минут', 'secret:muhammad-seal-1000-friday-pause');
        }
        saveUserData();
        showFirework('✨ ПЕЧАТЬ ПРОРОКОВ ﷺ');
        showNotification('👑 Секретная золотая карточка Мухаммада ﷺ открыта · +10 000 ★');
        if (typeof renderCollection === 'function') renderCollection();
        if (typeof updateCollectionBadge === 'function') updateCollectionBadge();
    }
}

function renderZikr() {
    const g = document.getElementById('zikrGrid'); if (!g) return;
    const counters = userData.zikrCounters || {};
    totalSalawatLifetime = Number(userData.totalSalawat || 0);
    const d = new Date(); const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const saved = localStorage.getItem(`salawat_${today}`);
    salawatCount = saved ? parseInt(saved) : 0;
    let h = '';
    ZIKR_LIST_FULL.forEach(z => {
        const count = counters[z.id] || 0;
        h += `<div class="zikr-counter-card" style="border-radius: 20px; padding: 16px; text-align: center; border: 2px solid #FFD700;">
            <div style="font-family: 'Amiri', serif; font-size: 2rem; direction: rtl; margin-bottom: 8px;">${z.arabic}</div>
            <div style="color: #8E8E93; font-size: 0.9rem; margin-bottom: 12px;">${z.translit}</div>
            <div class="zikr-live-count" data-zikr-count="${z.id}" style="font-size: 2.5rem; font-weight: 700; margin: 16px 0;">${count}</div>
            <div class="button-group">
                <button class="zikr-btn ios-button secondary" data-id="${z.id}" data-inc="1">+1</button>
                <button class="zikr-btn ios-button secondary" data-id="${z.id}" data-inc="10">+10</button>
                <button class="zikr-btn ios-button secondary" data-id="${z.id}" data-inc="50">+50</button>
                <button class="zikr-btn ios-button secondary" data-id="${z.id}" data-inc="100">+100</button>
                <button class="zikr-reset ios-button danger" data-id="${z.id}"><i class="fas fa-undo"></i></button>
            </div>
        </div>`;
    });
    h += `<div class="salawat-counter-card" style="border-radius: 20px; padding: 16px; text-align: center; border: 2px solid #FFD700;">
        <div style="font-family: 'Amiri', serif; font-size: 1.5rem; direction: rtl; margin-bottom: 8px;">ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ‎</div>
        <div style="color: #8E8E93; font-size: 0.85rem; margin-bottom: 12px;">Аллох1умма солли 1ала Мухьаммадив-ва 1ала али Мухьаммад</div>
        <div id="salawatLiveCount" style="font-size: 2.5rem; font-weight: 700; margin: 16px 0;">${salawatCount}</div>
        <div class="button-group">
            <button class="ios-button" id="addSalawatBtn" data-inc="1" style="background: #FFD700; color: #1C1C1E;"><i class="fas fa-heart"></i> +1</button>
            <button class="ios-button secondary salawat-add-btn" data-inc="10">+10</button>
            <button class="ios-button secondary salawat-add-btn" data-inc="50">+50</button>
            <button class="ios-button secondary salawat-add-btn" data-inc="100">+100</button>
            <button class="ios-button secondary" id="resetSalawatBtn"><i class="fas fa-undo"></i> Сброс</button>
        </div>
        <div style="margin-top: 12px; font-size: 0.8rem; color: #FFD700;">🏆 Всего: ${totalSalawatLifetime}</div>
    </div>`;
    g.innerHTML = h;
    document.querySelectorAll('.zikr-btn').forEach(b => b.addEventListener('click', () => {
        const id = b.dataset.id, inc = parseInt(b.dataset.inc);
        if (!userData.zikrCounters) userData.zikrCounters = {};
        userData.zikrCounters[id] = (userData.zikrCounters[id] || 0) + inc;
        if (typeof window.addArmyMerit === 'function') window.addArmyMerit('zikr');
        userData.totalZikrOverall = (userData.totalZikrOverall || 0) + inc;
        if (typeof window.recordTreasureZikr === 'function') window.recordTreasureZikr(inc);
        if (typeof window.awardMilestoneStars === 'function') window.awardMilestoneStars('zikr', userData.totalZikrOverall, 100, 1);
        addXP(typeof window.kunXPBudget==='function'?window.kunXPBudget('zikr',inc):inc); saveUserData(); renderZikr(); checkZikrAchievements(); if (typeof window.refreshZikrLiveCounters === 'function') window.refreshZikrLiveCounters();
        updateHomeWidgets(); if (typeof updateTasbihStats === 'function') updateTasbihStats();
    }));
    document.querySelectorAll('.zikr-reset').forEach(b => b.addEventListener('click', () => { 
        userData.zikrCounters[b.dataset.id] = 0; saveUserData(); renderZikr(); if (typeof updateTasbihStats === 'function') updateTasbihStats();
    }));
    const addSalawat = (amount) => {
        const inc = Math.max(1, Math.min(1000, parseInt(amount, 10) || 1));
        salawatCount += inc; totalSalawatLifetime += inc;
        if (typeof window.addArmyMerit === 'function') window.addArmyMerit('salawat');
        localStorage.setItem(`salawat_${today}`, salawatCount);
        if (typeof window.recordTreasureSalawat === 'function') window.recordTreasureSalawat();
        userData.totalSalawat = totalSalawatLifetime;
        if (typeof window.awardMilestoneStars === 'function') window.awardMilestoneStars('salawat', userData.totalSalawat, 100, 1);
        var _sx=(typeof window.kunXPBudget==='function'?window.kunXPBudget('salawat',10*inc):10*inc); if(_sx>0) addXP(_sx); saveUserData(); renderZikr(); checkZikrAchievements(); if (typeof window.refreshZikrLiveCounters === 'function') window.refreshZikrLiveCounters();
        checkMuhammadCardCondition();
        if (typeof updateTasbihStats === 'function') updateTasbihStats();
        if (typeof updateHomeWidgets === 'function') updateHomeWidgets();
        showNotification(`🌹 Засчитано салаватов: +${inc}` + (_sx>0 ? ` · +${_sx} XP` : ' · лимит XP на сегодня'));
    };
    document.getElementById('addSalawatBtn')?.addEventListener('click', (e) => addSalawat(e.currentTarget.dataset.inc));
    document.querySelectorAll('.salawat-add-btn').forEach(btn => btn.addEventListener('click', () => addSalawat(btn.dataset.inc)));
    document.getElementById('resetSalawatBtn')?.addEventListener('click', () => { 
        salawatCount = 0; localStorage.setItem(`salawat_${today}`, 0); renderZikr(); if (typeof updateTasbihStats === 'function') updateTasbihStats();
    });
}
window.renderZikr = renderZikr;
window.checkZikrAchievements = checkZikrAchievements;
window.refreshZikrLiveCounters = function(){
  const counters = (typeof userData !== 'undefined' && userData.zikrCounters) || {};
  document.querySelectorAll('[data-zikr-count]').forEach(el => { el.textContent = Number(counters[el.dataset.zikrCount]) || 0; });
  const salEl = document.getElementById('salawatLiveCount'); if (salEl) salEl.textContent = Number(window.salawatCount || salawatCount) || 0;
  if (typeof window.updateTasbihStats === 'function') window.updateTasbihStats();
};
setTimeout(() => renderZikr(), 300);

// Проверяем завершение пятиминутной паузы даже если пользователь не нажимает кнопки.
setInterval(checkMuhammadCardCondition, 1000);
