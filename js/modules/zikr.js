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
    const today = new Date();
    if (today.getDay() !== 5) return;
    if ((userData.unlockedCards || []).includes('muhammad')) return;
    const todayStr = today.toISOString().split('T')[0];
    const todaySalawat = parseInt(localStorage.getItem(`salawat_${todayStr}`)) || 0;
    if (todaySalawat >= 1000) {
        if (!userData.unlockedCards) userData.unlockedCards = [];
        if (!userData.unlockedCards.includes('muhammad')) userData.unlockedCards.push('muhammad');
        saveUserData(); saveLocalBackup();
        showFirework('🕌 МУХАММАД ﷺ');
        showNotification('🌟 МИФИЧЕСКАЯ КАРТА! Мухаммад ﷺ Печать пророков!');
        if (typeof renderCollection === 'function') renderCollection();
        updateCollectionBadge();
    }
}
function renderZikr() {
    const g = document.getElementById('zikrGrid'); if (!g) return;
    const counters = userData.zikrCounters || {};
    totalSalawatLifetime = userData.totalSalawat || 0;
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`salawat_${today}`);
    salawatCount = saved ? parseInt(saved) : 0;
    let h = '';
    ZIKR_LIST_FULL.forEach(z => {
        const count = counters[z.id] || 0;
        h += `<div style="background: #FFFFFF; border-radius: 20px; padding: 16px; text-align: center; border: 2px solid #FFD700;">
            <div style="font-family: 'Amiri', serif; font-size: 2rem; direction: rtl; margin-bottom: 8px;">${z.arabic}</div>
            <div style="color: #8E8E93; font-size: 0.9rem; margin-bottom: 12px;">${z.translit}</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 16px 0;">${count}</div>
            <div class="button-group">
                <button class="zikr-btn ios-button secondary" data-id="${z.id}" data-inc="1">+1</button>
                <button class="zikr-btn ios-button secondary" data-id="${z.id}" data-inc="10">+10</button>
                <button class="zikr-btn ios-button secondary" data-id="${z.id}" data-inc="100">+100</button>
                <button class="zikr-reset ios-button danger" data-id="${z.id}"><i class="fas fa-undo"></i></button>
            </div>
        </div>`;
    });
    h += `<div style="background: linear-gradient(135deg, #FFF9E6, #FFF3CD); border-radius: 20px; padding: 16px; text-align: center; border: 2px solid #FFD700;">
        <div style="font-family: 'Amiri', serif; font-size: 1.5rem; direction: rtl; margin-bottom: 8px;">ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ‎</div>
        <div style="color: #8E8E93; font-size: 0.85rem; margin-bottom: 12px;">Аллох1умма солли 1ала Мухьаммадив-ва 1ала али Мухьаммад</div>
        <div style="font-size: 2.5rem; font-weight: 700; margin: 16px 0;">${salawatCount}</div>
        <div class="button-group">
            <button class="ios-button" id="addSalawatBtn" style="background: #FFD700; color: #1C1C1E;"><i class="fas fa-heart"></i> +1 Салават</button>
            <button class="ios-button secondary" id="resetSalawatBtn"><i class="fas fa-undo"></i> Сброс</button>
        </div>
        <div style="margin-top: 12px; font-size: 0.8rem; color: #FFD700;">🏆 Всего: ${totalSalawatLifetime}</div>
    </div>`;
    g.innerHTML = h;
    document.querySelectorAll('.zikr-btn').forEach(b => b.addEventListener('click', () => {
        const id = b.dataset.id, inc = parseInt(b.dataset.inc);
        if (!userData.zikrCounters) userData.zikrCounters = {};
        userData.zikrCounters[id] = (userData.zikrCounters[id] || 0) + inc;
        userData.totalZikrOverall = (userData.totalZikrOverall || 0) + inc;
        addXP(inc); saveUserData(); renderZikr(); checkZikrAchievements();
        updateHomeWidgets(); if (typeof updateTasbihStats === 'function') updateTasbihStats();
    }));
    document.querySelectorAll('.zikr-reset').forEach(b => b.addEventListener('click', () => { 
        userData.zikrCounters[b.dataset.id] = 0; saveUserData(); renderZikr(); if (typeof updateTasbihStats === 'function') updateTasbihStats();
    }));
    document.getElementById('addSalawatBtn')?.addEventListener('click', () => {
        salawatCount++; totalSalawatLifetime++;
        localStorage.setItem(`salawat_${today}`, salawatCount);
        userData.totalSalawat = totalSalawatLifetime;
        addXP(10); saveUserData(); renderZikr(); checkZikrAchievements();
        checkMuhammadCardCondition();
        if (typeof updateTasbihStats === 'function') updateTasbihStats();
        showNotification('🌹 Салават засчитан! +10 XP');
    });
    document.getElementById('resetSalawatBtn')?.addEventListener('click', () => { 
        salawatCount = 0; localStorage.setItem(`salawat_${today}`, 0); renderZikr(); if (typeof updateTasbihStats === 'function') updateTasbihStats();
    });
}
setTimeout(() => renderZikr(), 300);
