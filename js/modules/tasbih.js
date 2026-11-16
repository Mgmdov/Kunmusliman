// ========== КОНФИГУРАЦИЯ АУДИО ==========
const AUDIO_BASE_URL = 'https://raw.githubusercontent.com/Mgmdov/Kunmusliman/refs/heads/main/';
const TASBIH_AUDIO = {
    subhanallah: AUDIO_BASE_URL + 'subhanallah.mp3.m4a',
    alhamdulillah: AUDIO_BASE_URL + 'alhamdulillah.mp3.m4a',
    allahuakbar: AUDIO_BASE_URL + 'allahuakbar.mp3.m4a',
    astaghfirullah: AUDIO_BASE_URL + 'astaghfirullah.mp3.m4a',
    lailahaillallah: AUDIO_BASE_URL + 'lailahaillallah.pm3.m4a',  // ← исправлено!
   salawat: AUDIO_BASE_URL + 'salawat.mp3.m4a'
};

let tasbihSoundEnabled = true;
let currentAudio = null;

// Функция воспроизведения аудио
function playTasbihAudio(type) {
    if (!tasbihSoundEnabled) return;
    
    const audioUrl = TASBIH_AUDIO[type];
    if (!audioUrl) return;
    
    // Останавливаем предыдущее аудио, если играет
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    try {
        currentAudio = new Audio(audioUrl);
        currentAudio.play().catch(e => console.log('Ошибка воспроизведения:', e));
    } catch (e) {
        console.log('Аудио не поддерживается');
    }
}

function initTasbihSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        window.playTasbihSound = function() {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
        };
        return true;
    } catch (e) {
        return false;
    }
}

function tasbihFeedback(type) {
    if (navigator.vibrate) navigator.vibrate(10);
    
    // Воспроизводим голосовое аудио
    playTasbihAudio(type);
    
    // Если голос не загрузился — играем системный звук
    if (tasbihSoundEnabled && typeof window.playTasbihSound === 'function') {
        setTimeout(() => {
            if (!currentAudio || currentAudio.readyState === 0) {
                window.playTasbihSound();
            }
        }, 100);
    }
}

function toggleTasbihSound() {
    tasbihSoundEnabled = !tasbihSoundEnabled;
    localStorage.setItem('tasbih_sound', tasbihSoundEnabled);
    updateSoundButtonText();
    showNotification(tasbihSoundEnabled ? '🔊 Звук тасбиха включен' : '🔇 Звук тасбиха выключен');
}

function loadTasbihSoundSetting() {
    const saved = localStorage.getItem('tasbih_sound');
    if (saved !== null) {
        tasbihSoundEnabled = saved === 'true';
    }
}

function updateSoundButtonText() {
    const span = document.getElementById('tasbihSoundText');
    const icon = document.querySelector('#tasbihSoundToggleBtn i');
    if (span) {
        span.textContent = tasbihSoundEnabled ? 'Звук включен' : 'Звук выключен';
    }
    if (icon) {
        icon.className = tasbihSoundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
}

let tasbihCount = 0;

function updateTasbihStats() {
    const data = (typeof userData !== 'undefined' && userData) ? userData : {};
    const zikrEl = document.getElementById('tasbihTotalZikr');
    const salawatEl = document.getElementById('tasbihTotalSalawat');
    if (zikrEl) zikrEl.textContent = Number(data.totalZikrOverall) || 0;
    if (salawatEl) salawatEl.textContent = Number(data.totalSalawat) || 0;
}
window.updateTasbihStats = updateTasbihStats;

document.getElementById('tasbihSoundToggleBtn')?.addEventListener('click', toggleTasbihSound);

// Делегированный обработчик: работает даже если экран тасбиха был
// перерисован или открыт после первоначальной загрузки приложения.
document.addEventListener('click', (event) => {
    const button = event.target.closest('#tasbihBtn');
    if (!button) return;

    const select = document.getElementById('tasbihSelect');
    const selectedId = select ? select.value : 'subhanallah';
    if (typeof userData === 'undefined' || !userData) return;

    tasbihFeedback(selectedId);
    tasbihCount++;
    const countEl = document.getElementById('tasbihCount');
    if (countEl) countEl.textContent = String(tasbihCount);

    if (selectedId === 'salawat') {
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        const saved = parseInt(localStorage.getItem(`salawat_${todayKey}`), 10) || 0;
        localStorage.setItem(`salawat_${todayKey}`, String(saved + 1));
        userData.totalSalawat = (Number(userData.totalSalawat) || 0) + 1;
        if (typeof window.addArmyMerit === 'function') window.addArmyMerit('salawat');
        if (typeof window.recordTreasureSalawat === 'function') window.recordTreasureSalawat();
        if (typeof window.awardMilestoneStars === 'function') window.awardMilestoneStars('salawat', userData.totalSalawat, 100, 1);
        if (typeof window.addXP === 'function') { var _x=window.kunXPBudget?window.kunXPBudget('salawat',10):10; if(_x>0) window.addXP(_x); }
        if (typeof window.checkMuhammadCardCondition === 'function') window.checkMuhammadCardCondition();
    } else {
        if (!userData.zikrCounters) userData.zikrCounters = {};
        userData.zikrCounters[selectedId] = (Number(userData.zikrCounters[selectedId]) || 0) + 1;
        userData.totalZikrOverall = (Number(userData.totalZikrOverall) || 0) + 1;
        if (typeof window.addArmyMerit === 'function') window.addArmyMerit('zikr');
        if (typeof window.recordTreasureZikr === 'function') window.recordTreasureZikr(1);
        if (typeof window.awardMilestoneStars === 'function') window.awardMilestoneStars('zikr', userData.totalZikrOverall, 100, 1);
        if (typeof window.addXP === 'function') { var _y=window.kunXPBudget?window.kunXPBudget('zikr',1):1; if(_y>0) window.addXP(_y); }
        if (typeof window.checkZikrAchievements === 'function') window.checkZikrAchievements();
    }

    if (typeof window.saveUserData === 'function') window.saveUserData();
    if (typeof window.saveLocalBackup === 'function') window.saveLocalBackup();
    if (typeof window.renderZikr === 'function') window.renderZikr();
    if (typeof window.refreshZikrLiveCounters === 'function') window.refreshZikrLiveCounters();
    if (typeof window.checkZikrAchievements === 'function') window.checkZikrAchievements();
    updateTasbihStats();
    if (typeof window.updateHomeWidgets === 'function') window.updateHomeWidgets();
});

document.addEventListener('click', (event) => {
    if (event.target.closest('#tasbihResetBtn')) {
        tasbihCount = 0;
        const countEl = document.getElementById('tasbihCount');
        if (countEl) countEl.textContent = '0';
    }
    if (event.target.closest('#tasbihSaveBtn')) {
        if (typeof window.saveUserData === 'function') window.saveUserData();
        if (typeof window.showNotification === 'function') window.showNotification('✅ Прогресс сохранён!');
    }
});

setTimeout(() => {
    loadTasbihSoundSetting();
    updateSoundButtonText();
    updateTasbihStats();
    
    document.body.addEventListener('click', function initSound() {
        initTasbihSound();
        document.body.removeEventListener('click', initSound);
    }, { once: true });
}, 300);
