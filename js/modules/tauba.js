// Исправление: галочки сохраняются в localStorage и не сбрасываются до 00:00
function loadTaubaCheckboxes() {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`tauba_goals_${today}`);
    if (saved) {
        const goals = JSON.parse(saved);
        document.querySelectorAll('.goal-check').forEach(cb => {
            if (goals[cb.dataset.goal] !== undefined) cb.checked = goals[cb.dataset.goal];
        });
        const imanSlider = document.getElementById('imanSlider');
        const savedIman = localStorage.getItem(`tauba_iman_${today}`);
        if (savedIman && imanSlider) {
            imanSlider.value = savedIman;
            document.getElementById('imanValue').textContent = savedIman + '%';
        }
    }
}

function saveTaubaCheckboxes() {
    const today = new Date().toISOString().split('T')[0];
    const goals = {};
    document.querySelectorAll('.goal-check').forEach(cb => goals[cb.dataset.goal] = cb.checked);
    localStorage.setItem(`tauba_goals_${today}`, JSON.stringify(goals));
    const iman = calculateImanFromGoals();
    localStorage.setItem(`tauba_iman_${today}`, iman);
}

// Очистка старых данных при загрузке
function cleanupOldTaubaData() {
    const today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tauba_goals_') && !key.includes(today)) {
            localStorage.removeItem(key);
        }
        if (key && key.startsWith('tauba_iman_') && !key.includes(today)) {
            localStorage.removeItem(key);
        }
    }
}

function calculateImanFromGoals(){
    const c = document.querySelectorAll('.goal-check');
    const ch = Array.from(c).filter(cb => cb.checked).length;
    const v = c.length > 0 ? Math.round((ch/c.length)*100) : 0;
    document.getElementById('imanSlider').value = v;
    document.getElementById('imanValue').textContent = v+'%';
    return v;
}

function updateTaubaUI(){
    const t = new Date().toISOString().split('T')[0];
    const tauba = userData.tauba || {days: []};
    const today = tauba.days.find(d => d.date === t);
    
    // Загружаем сохранённые галочки из localStorage
    loadTaubaCheckboxes();
    
    if (today) {
        document.getElementById('imanSlider').value = today.iman || 0;
        document.getElementById('imanValue').textContent = (today.iman || 0) + '%';
    }
    
    if(userData.specialDays) specialDaysCounters = userData.specialDays;
    document.querySelectorAll('.special-check').forEach(c => c.checked = false);
    
    const total = tauba.days.reduce((s,d) => s + Object.values(d.goals || {}).filter(v => v).length, 0);
    document.getElementById('totalGoalsCompleted').textContent = total;
    document.getElementById('totalDaysTracked').textContent = tauba.days.length;
    
    let streak = 0;
    const sorted = [...tauba.days].sort((a,b) => new Date(b.date) - new Date(a.date));
    const todayDate = new Date(); todayDate.setHours(0,0,0,0);
    for(let i = 0; i < sorted.length; i++){
        const d = new Date(sorted[i].date); d.setHours(0,0,0,0);
        if(Math.floor((todayDate - d) / 86400000) === streak) streak++;
        else break;
    }
    document.getElementById('streakDays').textContent = streak;
    
    const avg = tauba.days.length ? (tauba.days.reduce((s,d) => s + (d.iman || 0), 0) / tauba.days.length).toFixed(0) : 0;
    document.getElementById('avgIman').textContent = avg + '%';
}

function getStreak(){
    const d = userData.tauba?.days || [];
    if(!d.length) return 0;
    let s = 0;
    const sorted = [...d].sort((a,b) => new Date(b.date) - new Date(a.date));
    const td = new Date(); td.setHours(0,0,0,0);
    for(let i = 0; i < sorted.length; i++){
        const dd = new Date(sorted[i].date); dd.setHours(0,0,0,0);
        if(Math.floor((td - dd) / 86400000) === s) s++;
        else break;
    }
    return s;
}

// Сохраняем галочки при любом изменении
document.querySelectorAll('.goal-check').forEach(c => {
    c.addEventListener('change', function() {
        calculateImanFromGoals();
        saveTaubaCheckboxes();
    });
});

document.querySelectorAll('.special-check').forEach(cb => {
    cb.addEventListener('click', e => {
        e.preventDefault();
        const n = cb.dataset.special;
        let msg = '';
        if(n === 'arafa') msg = 'Пост в день Арафа искупает грехи прошлого и будущего года. Отметить?';
        else if(n === 'ashura') msg = 'Пост в день Ашура искупает грехи прошлого года. Отметить?';
        else if(n === 'baraat') msg = 'В ночь Бараат Аллах прощает грехи. Отметить?';
        else if(n === 'laylatulqadr') msg = 'Ночь Предопределения лучше тысячи месяцев. Отметить?';
        else if(n === 'shawwal') msg = '6 дней Шавваля — как пост всего года. Отметить?';
        if(confirm('🌙 ' + msg)){
            cb.checked = true;
            specialDaysCounters[n] = (specialDaysCounters[n] || 0) + 1;
            userData.specialDays = specialDaysCounters;
            addXP(100);
            showNotification(`🌙 Особый день отмечен! +100 XP`);
            saveUserData();
        }
    });
});

document.getElementById('saveTaubaDayBtn')?.addEventListener('click', () => {
    const t = new Date().toISOString().split('T')[0];
    const im = calculateImanFromGoals();
    const g = {};
    document.querySelectorAll('.goal-check').forEach(c => g[c.dataset.goal] = c.checked);
    
    let tauba = userData.tauba || {days: []};
    const idx = tauba.days.findIndex(d => d.date === t);
    if(idx !== -1) tauba.days[idx] = {date: t, goals: g, iman: im};
    else tauba.days.push({date: t, goals: g, iman: im});
    
    userData.tauba = tauba;
    userData.specialDays = specialDaysCounters;
    addXP(Object.values(g).filter(v => v).length * 5);
    
    if(!userData.stars) userData.stars = {totalStars: 0, lastClaimDate: '', unlockedRanks: []};
    userData.stars.totalStars = (userData.stars.totalStars || 0) + 1;
    checkSahabiCards();
    
    saveUserData();
    saveTaubaCheckboxes(); // Сохраняем галочки
    updateTaubaUI();
    showNotification('✅ День сохранён! +1 ⭐');
});

// Очистка старых данных и загрузка при открытии
cleanupOldTaubaData();
updateTaubaUI();
