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
    document.getElementById('tasbihTotalZikr').textContent = userData.totalZikrOverall || 0;
    document.getElementById('tasbihTotalSalawat').textContent = userData.totalSalawat || 0;
}

document.getElementById('tasbihSoundToggleBtn')?.addEventListener('click', toggleTasbihSound);

document.getElementById('tasbihBtn')?.addEventListener('click', () => {
    const select = document.getElementById('tasbihSelect');
    const selectedId = select.value;
    
    tasbihFeedback(selectedId);
    tasbihCount++;
    document.getElementById('tasbihCount').textContent = tasbihCount;
    
    if (selectedId === 'salawat') {
        const today = new Date().toISOString().split('T')[0];
        const saved = parseInt(localStorage.getItem(`salawat_${today}`)) || 0;
        localStorage.setItem(`salawat_${today}`, saved + 1);
        userData.totalSalawat = (userData.totalSalawat || 0) + 1;
        addXP(10); 
        checkMuhammadCardCondition();
    } else {
        if (!userData.zikrCounters) userData.zikrCounters = {};
        userData.zikrCounters[selectedId] = (userData.zikrCounters[selectedId] || 0) + 1;
        userData.totalZikrOverall = (userData.totalZikrOverall || 0) + 1;
        addXP(1); 
        checkZikrAchievements();
    }
    saveUserData(); 
    if (typeof renderZikr === 'function') renderZikr();
    updateTasbihStats(); 
    updateHomeWidgets();
});

document.getElementById('tasbihResetBtn')?.addEventListener('click', () => { 
    tasbihCount = 0; 
    document.getElementById('tasbihCount').textContent = 0; 
});

document.getElementById('tasbihSaveBtn')?.addEventListener('click', () => { 
    saveUserData(); 
    showNotification('✅ Прогресс сохранён!'); 
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
