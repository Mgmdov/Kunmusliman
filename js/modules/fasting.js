if (!userData.fasting) userData.fasting = { days: [], total: 0 };
if (!userData.ramadan) userData.ramadan = { year: null, days: {} };

function updateFastingUI() {
    const today = new Date().toISOString().split('T')[0];
    const fastingDays = userData.fasting?.days || [];
    const todayFast = fastingDays.find(d => d.date === today);
    const todayEmoji = document.getElementById('fastingTodayEmoji');
    const todayText = document.getElementById('fastingTodayText');
    const toggleBtn = document.getElementById('toggleFastBtnText');
    if (todayFast) { todayEmoji.textContent = '✅'; todayText.textContent = 'Сегодня вы постились'; toggleBtn.textContent = 'Отменить отметку'; }
    else { todayEmoji.textContent = '🌙'; todayText.textContent = 'Сегодня не пост'; toggleBtn.textContent = 'Отметить пост'; }
    document.getElementById('fastingTotalDays').textContent = fastingDays.length;
    let streak = 0; const sorted = [...fastingDays].sort((a, b) => new Date(b.date) - new Date(a.date));
    const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < sorted.length; i++) { const d = new Date(sorted[i].date); d.setHours(0, 0, 0, 0); if (Math.floor((todayDate - d) / 86400000) === streak) streak++; else break; }
    document.getElementById('fastingStreak').textContent = streak;
    const thisMonth = new Date().getMonth(); const thisYear = new Date().getFullYear();
    const monthDays = fastingDays.filter(d => { const date = new Date(d.date); return date.getMonth() === thisMonth && date.getFullYear() === thisYear; }).length;
    document.getElementById('fastingThisMonth').textContent = monthDays;
    
    // Обновление чекбоксов дней недели
    const day = new Date().getDay();
    document.getElementById('fastingMonday').checked = (day === 1 && todayFast);
    document.getElementById('fastingThursday').checked = (day === 4 && todayFast);
    // Белые дни (упрощённо)
    const date = new Date().getDate();
    document.getElementById('fastingWhiteDays').checked = ([13,14,15].includes(date) && todayFast);
}

function renderRamadanCalendar() {
    const container = document.getElementById('ramadanCalendar');
    if (!container) return;
    
    const currentYear = new Date().getFullYear();
    if (userData.ramadan.year !== currentYear) {
        userData.ramadan = { year: currentYear, days: {} };
        saveUserData();
    }
    
    const days = userData.ramadan.days || {};
    const fastedCount = Object.values(days).filter(v => v).length;
    document.getElementById('ramadanProgress').textContent = `${fastedCount}/30`;
    
    let html = '';
    for (let i = 1; i <= 30; i++) {
        const isFasted = days[i] || false;
        const isToday = (i === new Date().getDate() && currentYear === new Date().getFullYear());
        html += `<div class="ramadan-day ${isFasted ? 'fasted' : ''} ${isToday ? 'today' : ''}" data-day="${i}" onclick="toggleRamadanDay(${i})">${i}</div>`;
    }
    container.innerHTML = html;
}

window.toggleRamadanDay = function(day) {
    if (!userData.ramadan) userData.ramadan = { year: new Date().getFullYear(), days: {} };
    if (!userData.ramadan.days) userData.ramadan.days = {};
    
    userData.ramadan.days[day] = !userData.ramadan.days[day];
    
    if (userData.ramadan.days[day]) {
        addXP(50);
        if (!userData.stars) userData.stars = { totalStars: 0 };
        userData.stars.totalStars = (userData.stars.totalStars || 0) + 2;
        showNotification(`🌙 День ${day} Рамадана отмечен! +50 XP, +2 ⭐`);
    }
    
    saveUserData();
    renderRamadanCalendar();
    checkSahabiCards();
};

document.getElementById('completeRamadanBtn')?.addEventListener('click', () => {
    const fastedCount = Object.values(userData.ramadan.days || {}).filter(v => v).length;
    if (fastedCount < 30) {
        if (!confirm(`Вы отметили только ${fastedCount} дней из 30. Всё равно завершить Рамадан?`)) return;
    }
    
    showFirework('🎉 РАМАДАН ЗАВЕРШЁН!');
    showNotification('🌙 Рамадан завершён! Да примет Аллах ваш пост!');
    
    // Награда за завершение Рамадана
    addXP(1000);
    userData.stars.totalStars = (userData.stars.totalStars || 0) + 50;
    
    // Разблокировка карточки Рамадана
    unlockCardIfNotHave('ramadan_complete');
    
    saveUserData();
    updateHomeWidgets();
});

document.getElementById('toggleFastTodayBtn')?.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    if (!userData.fasting) userData.fasting = { days: [] };
    const fastingDays = userData.fasting.days || [];
    const idx = fastingDays.findIndex(d => d.date === today);
    if (idx !== -1) { fastingDays.splice(idx, 1); showNotification('Пост отменён'); }
    else { fastingDays.push({ date: today, type: 'sunnah' }); addXP(50); if (!userData.stars) userData.stars = { totalStars: 0 }; userData.stars.totalStars = (userData.stars.totalStars || 0) + 2; showNotification('🌙 Пост отмечен! +50 XP, +2 ⭐'); }
    userData.fasting.days = fastingDays; userData.fasting.total = fastingDays.length;
    saveUserData(); updateFastingUI(); checkSahabiCards(); updateHomeWidgets();
});

// Переключение вкладок
document.querySelectorAll('.fasting-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.fasting-tab').forEach(t => { t.style.background = '#F2F2F7'; t.style.color = '#007AFF'; });
        tab.style.background = '#007AFF'; tab.style.color = 'white';
        const tabName = tab.dataset.tab;
        document.getElementById('fastingRegularContent').style.display = tabName === 'regular' ? 'block' : 'none';
        document.getElementById('fastingRamadanContent').style.display = tabName === 'ramadan' ? 'block' : 'none';
        if (tabName === 'ramadan') renderRamadanCalendar();
    });
});

setTimeout(() => { updateFastingUI(); renderRamadanCalendar(); }, 300);
