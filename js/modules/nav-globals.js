let navigationHistory = [], navigationForward = [], currentScreen = 'home';

const GITHUB_RAW = 'https://raw.githubusercontent.com/Mgmdov/Kunmusliman/main/data/';
const APP_VERSION = '6.0.0';

// ========== ЗАГРУЗКА СОХРАНЁННЫХ КАРТОЧЕК ПРИ СТАРТЕ ==========
(function() {
    try {
        const savedCards = localStorage.getItem('all_collection_cards');
        if (savedCards) {
            const parsed = JSON.parse(savedCards);
            if (Array.isArray(parsed)) {
                window.ALL_COLLECTION_CARDS = parsed;
                console.log('📦 Загружено сохранённых карточек:', parsed.length);
                return;
            }
        }
    } catch (e) {
        console.warn('Ошибка загрузки карточек:', e);
    }
    window.ALL_COLLECTION_CARDS = [];
    console.log('📦 Создан пустой массив карточек');
})();

async function loadJSONFromGitHub(filename) {
    try {
        const response = await fetch(GITHUB_RAW + filename);
        if (!response.ok) throw new Error('Файл не найден');
        const data = await response.json();
        console.log(`✅ Загружен ${filename}`);
        return data;
    } catch (e) {
        console.warn(`⚠️ Ошибка загрузки ${filename}:`, e);
        return null;
    }
}

function saveDataToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadDataFromLocal(key) {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
}

async function syncAllDataFromGitHub() {
    showNotification('🔄 Синхронизация данных...');
    
    const config = await loadJSONFromGitHub('config.json');
    if (config) {
        saveDataToLocal('app_config', config);
        console.log('📋 Конфиг загружен, версия:', config.version);
    }
    
    const questions = await loadJSONFromGitHub('questions.json');
    if (questions) {
        saveDataToLocal('quiz_questions', questions);
        if (typeof QUIZ_QUESTIONS_RAW !== 'undefined') Object.assign(QUIZ_QUESTIONS_RAW, questions);
        console.log('📝 Вопросы викторины обновлены');
    }
    
    const azkar = await loadJSONFromGitHub('azkar.json');
    if (azkar) {
        saveDataToLocal('azkar_data', azkar);
        if (azkar.morning && azkar.morning.length > 0) {
            window.MORNING_AZKAR_FULL = azkar.morning;
            console.log('🌅 Утренние азкары обновлены:', azkar.morning.length);
        }
        if (azkar.evening && azkar.evening.length > 0) {
            window.EVENING_AZKAR_FULL = azkar.evening;
            console.log('🌙 Вечерние азкары обновлены:', azkar.evening.length);
        }
    }
    
    const names = await loadJSONFromGitHub('names.json');
    if (names && names.names) {
        saveDataToLocal('names_data', names);
        if (typeof NAMES_OF_ALLAH !== 'undefined') {
            names.names.forEach(n => {
                if (!NAMES_OF_ALLAH.find(ex => ex.num === n.num)) NAMES_OF_ALLAH.push(n);
            });
        }
        console.log('📜 Имена Аллаха обновлены:', names.names.length);
    }
    
    const achievements = await loadJSONFromGitHub('achievements.json');
    if (achievements) {
        saveDataToLocal('achievements_data', achievements);
        console.log('🏆 Достижения обновлены');
    }
    
    const battles = await loadJSONFromGitHub('battles.json');
    if (battles) {
        saveDataToLocal('battles_data', battles);
        if (typeof BATTLE_DATA !== 'undefined' && battles.battles) {
            battles.battles.forEach(b => {
                if (!BATTLE_DATA.find(ex => ex.id === b.id)) BATTLE_DATA.push(b);
            });
        }
        console.log('⚔️ Битвы обновлены');
    }
    
    const levels = await loadJSONFromGitHub('levels.json');
    if (levels) {
        saveDataToLocal('levels_data', levels);
        if (levels.xp_levels && typeof XP_LEVELS !== 'undefined') {
            window.XP_LEVELS = levels.xp_levels;
            console.log('📊 Уровни XP обновлены');
        }
    }
    
    const cards = await loadJSONFromGitHub('cards.json');
    if (cards && cards.cards) {
        saveDataToLocal('cards_data', cards);
        
        if (typeof ALL_COLLECTION_CARDS === 'undefined') window.ALL_COLLECTION_CARDS = [];
        
        cards.cards.forEach(jsonCard => {
            let card = ALL_COLLECTION_CARDS.find(c => c.id === jsonCard.id);
            
            if (!card) {
                card = { ...jsonCard };
                ALL_COLLECTION_CARDS.push(card);
            }
            
            if (jsonCard.image) {
                card.image = jsonCard.image;
            }
        });
        
        // СОХРАНЯЕМ карточки в localStorage
        localStorage.setItem('all_collection_cards', JSON.stringify(ALL_COLLECTION_CARDS));
        console.log('🎴 Карточки сохранены, всего:', ALL_COLLECTION_CARDS.length);
    }
    
    const settings = await loadJSONFromGitHub('settings.json');
    if (settings) {
        saveDataToLocal('default_settings', settings);
        console.log('⚙️ Настройки обновлены');
    }
    
    localStorage.setItem('last_sync', new Date().toISOString());
    saveUserData();
    showNotification('✅ Данные обновлены!');
    console.log('🎉 Синхронизация завершена');
}

async function checkForUpdatesOnStart() {
    const lastSync = localStorage.getItem('last_sync');
    const config = loadDataFromLocal('app_config');
    
    if (!lastSync || !config) {
        await syncAllDataFromGitHub();
        return;
    }
    
    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const daysSinceSync = (now - lastSyncDate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceSync > 1) {
        console.log('🔄 Прошло больше дня, проверяем обновления...');
        const remoteConfig = await loadJSONFromGitHub('config.json');
        if (remoteConfig && remoteConfig.version !== config.version) {
            console.log('🆕 Найдена новая версия!');
            await syncAllDataFromGitHub();
        } else {
            localStorage.setItem('last_sync', new Date().toISOString());
            console.log('✅ Версия актуальна');
        }
    }
}

async function manualSync() {
    await syncAllDataFromGitHub();
    if (typeof renderCollection === 'function') renderCollection();
    if (typeof renderAchievements === 'function') renderAchievements();
    if (typeof renderAzkar === 'function') renderAzkar();
    if (typeof renderNamesOfAllah === 'function') renderNamesOfAllah();
    updateHomeWidgets();
}

setTimeout(() => { checkForUpdatesOnStart(); }, 2000);

function moduleTitle(moduleId) {
    const titles = {
        'khatm':'Хатм','tauba':'Тауба','names':'99 имён Аллаха','azkar':'Азкары','zikr':'Зикр и Салават','tasbih':'Тасбих','fasting':'Пост',
        'prayer':'Намаз','juma':'Джума','achievements':'Достижения','stars':'Звёзды и задания','collection':'Коллекция','treasure-vault':'Сокровищница',
        'quiz':'Викторина','dictionary':'Словарь','quran':'Аят дня','settings':'Настройки',
        'pillars-iman':'Столпы Имана','pillars-islam':'Столпы Ислама','prophet-story':'Жизнь Пророка ﷺ','battles':'Исторические походы','army':'Армия',
        'hub-quran':'Коран и Хатм','hub-worship':'Ибадат','hub-knowledge':'Знания и история','hub-progress':'Мой прогресс','hub-rewards':'Награды','hub-more':'Ещё'
    };
    return titles[moduleId] || moduleId;
}

function showModuleScreen(moduleId, direction) {
    const screens = document.querySelectorAll('.module-screen');
    screens.forEach(screen => screen.classList.remove('active', 'screen-enter-left', 'screen-enter-right'));
    const target = document.getElementById(`module-${moduleId}`);
    if (target) {
        target.classList.add('active', direction === 'back' ? 'screen-enter-right' : 'screen-enter-left');
        requestAnimationFrame(() => target.classList.remove('screen-enter-left', 'screen-enter-right'));
    }
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('navBar').classList.remove('hidden');
    document.getElementById('screenTitle').textContent = moduleTitle(moduleId);
    currentScreen = moduleId;
    updateTabBarActive(moduleId);
    // Каждый новый раздел открывается с начала, независимо от позиции в предыдущем.
    requestAnimationFrame(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); });
}

function openModule(moduleId) {
    if (!document.getElementById(`module-${moduleId}`)) {
        console.warn('Не найден экран модуля:', moduleId);
        return;
    }
    if (currentScreen !== 'home' && currentScreen !== moduleId) navigationHistory.push(currentScreen);
    else if (currentScreen === 'home') navigationHistory = [];
    navigationForward = [];
    if (navigationHistory[navigationHistory.length - 1] === moduleId) navigationHistory.pop();
    showModuleScreen(moduleId, 'forward');


    if (moduleId === 'khatm' && typeof updateKhatmUI === 'function') { updateKhatmUI(); if (typeof trackKhatmCompletedSurahs === 'function') trackKhatmCompletedSurahs(); }
    if (moduleId === 'tauba' && typeof updateTaubaUI === 'function') updateTaubaUI();
    if (moduleId === 'names' && typeof renderNamesOfAllah === 'function') renderNamesOfAllah();
    if (moduleId === 'azkar') { checkAndResetAzkarDate(); renderAzkar(); }
    if (moduleId === 'zikr' && typeof renderZikr === 'function') renderZikr();
    if (moduleId === 'tasbih' && typeof updateTasbihStats === 'function') updateTasbihStats();
    if (moduleId === 'fasting') { updateFastingUI(); renderRamadanCalendar(); }
    if (moduleId === 'prayer') loadSavedLocation();
    if (moduleId === 'juma') { updateKhutbaForFriday(); updateJumaCheckboxesState(); }
    if (moduleId === 'achievements' && typeof renderAchievements === 'function') renderAchievements();
    if (moduleId === 'stars') { updateStarsUI(); checkDailyTasks(); }
    if (moduleId === 'collection' && typeof renderCollection === 'function') renderCollection();
    if (moduleId === 'settings' && typeof loadSettingsUI === 'function') loadSettingsUI();
    if (moduleId === 'quran' && typeof displayAyah === 'function') displayAyah(getDailyAyah());
    if (moduleId === 'battles') { renderBattleContent('badr'); updateBattlesProgress(); }
}

function goBack() {
    if (navigationHistory.length) {
        navigationForward.push(currentScreen);
        const prev = navigationHistory.pop();
        showModuleScreen(prev, 'back');
    } else {
        goHome();
    }
}
function goForward() {
    if (!navigationForward.length) return;
    navigationHistory.push(currentScreen);
    const next = navigationForward.pop();
    showModuleScreen(next, 'forward');
}

function goHome() {
    document.querySelectorAll('.module-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('navBar').classList.add('hidden');
    navigationHistory = []; navigationForward = [];
    currentScreen = 'home';
    updateTabBarActive('home');
    updateHomeWidgets();
}

document.getElementById('backButton')?.addEventListener('click', goBack);

document.querySelectorAll('.tab-item').forEach(tab => tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    if (!target) return;
    if (target === 'home') goHome();
    else openModule(target);
}));

function getPrimaryTabForScreen(id) {
    if (!id || id === 'home') return 'home';
    if (['hub-quran','quran','khatm','coop-khatm'].includes(id)) return 'hub-quran';
    if (id === 'azkar') return 'azkar';
    if (id === 'collection') return 'collection';
    if (id === 'settings') return 'settings';
    return '';
}

function updateTabBarActive(id) {
    const activeTab = getPrimaryTabForScreen(id);
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === activeTab);
    });
}

document.querySelectorAll('.icon-item[data-module]').forEach(i => i.addEventListener('click', () => openModule(i.dataset.module)));

// Полноценная история переходов: свайп вправо — назад, влево — вперёд.
let touchStartX = 0, touchStartY = 0, touchTarget = null;
document.addEventListener('touchstart', e => {
    if (!e.touches || !e.touches[0]) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchTarget = e.target;
}, { passive: true });
document.addEventListener('touchend', e => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    if (document.getElementById('homeScreen').classList.contains('hidden') === false) return;
    if (document.querySelector('.modal[style*="display: flex"], .fullscreen-overlay, #qrOverlay, #fathWheelOverlay, #chestSelectorOverlay, #chestOpeningOverlay')) return;
    if (touchTarget && touchTarget.closest('input, textarea, select, button, a, [data-no-swipe], .module-tabs, .collection-tabs, .horizontal-scroll')) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (Math.abs(dx) < 75 || Math.abs(dx) < dy * 1.25) return;
    if (dx > 0) goBack();
    else goForward();
}, { passive: true });

window.closeStoryModal = () => document.getElementById('storyModal').style.display = 'none';
window.closeAuthModal = () => { document.getElementById('authModal').style.display = 'none'; document.getElementById('authError').textContent = ''; document.getElementById('loginForm').style.display='block'; document.getElementById('registerForm').style.display='none'; document.getElementById('forgotPasswordForm').style.display='none'; if (!localStorage.getItem('kunmusliman_entry_choice_v1')) { const g=document.getElementById('kunEntryGate'); if(g)g.style.display='flex'; document.body.style.overflow='hidden'; } else { if(document.getElementById('kunOnboarding')?.style.display!=='flex') document.body.style.overflow=''; if(window.__kunEntryReady && document.getElementById('kunOnboarding')?.style.display!=='flex')window.dispatchEvent(new Event('kun:entry-ready')); } };
window.openAuthModal = () => { const g=document.getElementById('kunEntryGate'); if(g)g.style.display='none'; document.getElementById('authModal').style.display = 'flex'; };
window.showCardStory = function(id, name, emoji, story) { 
    document.getElementById('storyIcon').innerHTML = emoji; 
    document.getElementById('storyTitle').textContent = name; 
    document.getElementById('storyText').innerHTML = story; 
    document.getElementById('storyModal').style.display = 'flex'; 
};
window.showAchievementStory = function(id) { 
    const ach = ALL_ACHIEVEMENTS_FULL.find(a => a.id === id); 
    if (!ach) return; 
    const isUnlocked = (userData.achievements || []).includes(id); 
    document.getElementById('storyIcon').innerHTML = ach.icon; 
    document.getElementById('storyTitle').textContent = ach.title; 
    document.getElementById('storyText').innerHTML = isUnlocked ? `<p><strong>${ach.desc}</strong></p><p style="margin-top:15px;">✅ Открыто! +${ach.xp} XP</p>` : `<p>${ach.desc}</p><p style="margin-top:15px;color:#8E8E93;">Прогресс: ${ach.current()} / ${ach.target}</p>`; 
    document.getElementById('storyModal').style.display = 'flex'; 
};

function showNotification(t) { 
    const n = document.createElement('div'); 
    n.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#1C1C1E;color:white;padding:12px 20px;border-radius:30px;z-index:10000;text-align:center;max-width:280px;'; 
    n.innerHTML = t; 
    document.body.appendChild(n); 
    setTimeout(() => n.remove(), 3000); 
}

window.syncAllDataFromGitHub = syncAllDataFromGitHub;
window.manualSync = manualSync;
window.checkForUpdatesOnStart = checkForUpdatesOnStart;

window.openModule = openModule; 
window.goHome = goHome; window.goBack = goBack; window.goForward = goForward; 
window.updateHomeWidgets = updateHomeWidgets;
