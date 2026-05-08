let notificationInterval = null;

function updateLastSyncTime() {
    const lastSync = localStorage.getItem('last_sync');
    const span = document.getElementById('lastSyncTime');
    if (span) {
        if (lastSync) {
            const date = new Date(lastSync);
            span.textContent = `Последняя синхронизация: ${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0,5)}`;
        } else {
            span.textContent = 'Синхронизация не выполнялась';
        }
    }
}

function updateAccountInfo() {
    const statusEl = document.getElementById('settingsStatus'), emailEl = document.getElementById('settingsEmail'), signOutBtn = document.getElementById('signOutBtnSettings'), loginBtn = document.getElementById('loginBtnSettings');
    if (currentUser && !currentUser.isAnonymous) { 
        if (statusEl) statusEl.textContent = 'Авторизован'; 
        if (emailEl) emailEl.textContent = currentUser.email || '—'; 
        if (signOutBtn) signOutBtn.style.display = 'block'; 
        if (loginBtn) loginBtn.style.display = 'none'; 
    } else { 
        if (statusEl) statusEl.textContent = 'Гость'; 
        if (emailEl) emailEl.textContent = '—'; 
        if (signOutBtn) signOutBtn.style.display = 'none'; 
        if (loginBtn) loginBtn.style.display = 'block'; 
    }
}

function loadSettingsUI() { 
    const sel = document.getElementById('notificationInterval'); 
    if (sel && userData.settings) sel.value = userData.settings.zikrNotificationInterval || 0; 
    const hideAyahCheck = document.getElementById('hideAyahWidgetCheck');
    if (hideAyahCheck) hideAyahCheck.checked = userData.settings?.hideAyahWidget || false;
    updateAccountInfo(); 
    loadSavedTheme(); 
    updateLastSyncTime();
}

function loadSavedTheme() { 
    const savedTheme = localStorage.getItem('muslim_tracker_theme') || 'light'; 
    document.body.className = `theme-${savedTheme}`; 
    document.querySelectorAll('.theme-option').forEach(opt => opt.style.borderColor = opt.dataset.theme === savedTheme ? '#007AFF' : 'transparent'); 
}

function restoreNotificationInterval() { 
    const int = userData.settings?.zikrNotificationInterval || 0; 
    if (int > 0 && Notification.permission === 'granted') { 
        if (notificationInterval) clearInterval(notificationInterval); 
        notificationInterval = setInterval(() => { 
            new Notification('📿 Время для зикра!', { body: 'Не забывай поминать Аллаха — Субханаллах!' }); 
        }, int * 60 * 60 * 1000); 
    } 
}

function saveAllSettings() {
    if (!userData.settings) userData.settings = {};
    userData.settings.zikrNotificationInterval = parseInt(document.getElementById('notificationInterval').value);
    userData.settings.hideAyahWidget = document.getElementById('hideAyahWidgetCheck').checked;
    saveUserData();
    const ayahWidget = document.getElementById('ayahWidget');
    if (ayahWidget) ayahWidget.style.display = userData.settings.hideAyahWidget ? 'none' : 'block';
    restoreNotificationInterval();
    showNotification('✅ Настройки сохранены!');
}

// ========== НОВАЯ ФУНКЦИЯ: ВОССТАНОВЛЕНИЕ ИЗ FIREBASE ==========
async function restoreFromFirebase() {
    if (!currentUser || currentUser.isAnonymous) {
        showNotification('❌ Войдите в аккаунт для восстановления');
        openAuthModal();
        return;
    }
    
    if (!confirm('⚠️ ВОССТАНОВИТЬ ДАННЫЕ ИЗ ОБЛАКА?\n\nВсе текущие изменения будут ЗАМЕНЕНЫ данными из Firebase.\n\nПродолжить?')) {
        return;
    }
    
    showNotification('☁️ Загрузка из Firebase...');
    
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        
        if (!doc.exists) {
            showNotification('❌ В облаке нет сохраненных данных');
            return;
        }
        
        const cloudData = doc.data();
        
        // ПОЛНАЯ ЗАМЕНА локальных данных облачными
        Object.keys(userData).forEach(key => delete userData[key]);
        Object.assign(userData, cloudData);
        
        // Восстанавливаем структуру если чего-то не хватает
        ensureFullDataStructure();
        
        // Сохраняем в localStorage как бекап
        saveLocalBackup();
        
        // Обновляем ВСЁ
        updateAllUI();
        if (typeof renderCollection === 'function') renderCollection();
        if (typeof renderAchievements === 'function') renderAchievements();
        if (typeof updateKhatmUI === 'function') updateKhatmUI();
        if (typeof renderNamesOfAllah === 'function') renderNamesOfAllah();
        if (typeof renderZikr === 'function') renderZikr();
        
        showNotification('✅ Данные успешно восстановлены из облака!');
        showXPPopup();
        
        console.log('✅ Восстановлено из Firebase:', cloudData);
        
    } catch (e) {
        console.error('Ошибка восстановления:', e);
        showNotification('❌ Ошибка загрузки: ' + e.message);
    }
}

document.querySelectorAll('.theme-option').forEach(function(opt) { 
    opt.addEventListener('click', function() { 
        var theme = this.dataset.theme; 
        
        // Удаляем ВСЕ темы
        document.body.classList.remove('theme-dark', 'theme-ramadan', 'theme-mosque', 'theme-ocean', 'theme-gold', 'theme-sakura', 'theme-sunset');
        
        // Добавляем нужную (если не светлая)
        if (theme !== 'light') {
            document.body.classList.add('theme-' + theme);
        }
        
        // Сохраняем
        localStorage.setItem('muslim_tracker_theme', theme); 
        
        // Обводка
        document.querySelectorAll('.theme-option').forEach(function(o) {
            o.style.borderColor = 'transparent'; 
        });
        this.style.borderColor = '#007AFF'; 
        
        showNotification('🎨 Тема «' + theme + '» применена!'); 
    }); 
});

// Загрузка сохранённой темы при старте
(function() {
    var saved = localStorage.getItem('muslim_tracker_theme') || 'light';
    if (saved !== 'light') {
        document.body.classList.add('theme-' + saved);
    }
    document.querySelectorAll('.theme-option').forEach(function(opt) {
        if (opt.dataset.theme === saved) {
            opt.style.borderColor = '#007AFF';
        }
    });
})();

document.getElementById('notificationInterval')?.addEventListener('change', e => { 
    if (!userData.settings) userData.settings = {}; 
    userData.settings.zikrNotificationInterval = parseInt(e.target.value); 
});

document.getElementById('requestNotificationPermission')?.addEventListener('click', async () => { 
    if ('Notification' in window) { 
        const p = await Notification.requestPermission(); 
        if (p === 'granted') showNotification('✅ Уведомления включены!'); 
        else alert('Разрешение не получено'); 
    } else alert('Браузер не поддерживает'); 
});

document.getElementById('saveSettingsBtn')?.addEventListener('click', saveAllSettings);
document.getElementById('loginBtnSettings')?.addEventListener('click', () => openAuthModal());

document.getElementById('signOutBtnSettings')?.addEventListener('click', async () => { 
    if (!currentUser || currentUser.isAnonymous) { showNotification('👤 Вы не вошли'); return; } 
    if (confirm('Выйти?')) { 
        await saveUserData(); 
        await auth.signOut(); 
        currentUser = null; 
        updateAccountInfo(); 
        await signInAnonymously(); 
        showNotification('👋 Вы вышли'); 
        updateAllUI(); 
    } 
});

document.getElementById('exportDataBtn')?.addEventListener('click', () => { 
    const exp = { userData, specialDaysCounters, exportDate: new Date().toISOString(), version: '6.0' }; 
    const b = new Blob([JSON.stringify(exp, null, 2)], { type: 'application/json' }); 
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(b); 
    a.download = `muslim-tracker-${new Date().toISOString().split('T')[0]}.json`; 
    a.click(); 
    showNotification('📤 Экспортировано!'); 
});

document.getElementById('importDataBtn')?.addEventListener('click', () => document.getElementById('importFileInput').click());

document.getElementById('importFileInput')?.addEventListener('change', e => { 
    const f = e.target.files[0]; if (!f) return; 
    const r = new FileReader(); 
    r.onload = ev => { 
        try { 
            const imp = JSON.parse(ev.target.result); 
            if (imp.userData) { 
                Object.assign(userData, imp.userData); 
                if (imp.specialDaysCounters) Object.assign(specialDaysCounters, imp.specialDaysCounters); 
            } else Object.assign(userData, imp); 
            ensureFullDataStructure(); 
            saveUserData(); 
            showNotification('✅ Импортировано!'); 
            setTimeout(() => updateAllUI(), 300); 
        } catch (err) { alert('Ошибка формата'); } 
    }; 
    r.readAsText(f); 
    e.target.value = ''; 
});

document.getElementById('syncNowBtn')?.addEventListener('click', async () => { 
    if (!currentUser || currentUser.isAnonymous) { showNotification('⚠️ Войдите в аккаунт'); return; } 
    try { 
        // Сначала получаем облачные данные для безопасного слияния
        const doc = await db.collection('users').doc(currentUser.uid).get();
        
        if (doc.exists) {
            const cloudData = doc.data();
            
            // СОХРАНЯЕМ локальные значения критических метрик
            const localMetrics = {
                xp: userData.xp || 0,
                totalZikrOverall: userData.totalZikrOverall || 0,
                totalSalawat: userData.totalSalawat || 0,
                readPages: userData.khatm?.readPages || 0,
                completedKhatms: userData.khatm?.completedKhatms || 0,
                totalStars: userData.stars?.totalStars || 0
            };
            
            // Объединяем данные
            Object.assign(userData, cloudData);
            
            // ВОССТАНАВЛИВАЕМ МАКСИМАЛЬНЫЕ ЗНАЧЕНИЯ
            userData.xp = Math.max(localMetrics.xp, cloudData.xp || 0);
            userData.totalZikrOverall = Math.max(localMetrics.totalZikrOverall, cloudData.totalZikrOverall || 0);
            userData.totalSalawat = Math.max(localMetrics.totalSalawat, cloudData.totalSalawat || 0);
            
            if (!userData.khatm) userData.khatm = {};
            userData.khatm.readPages = Math.max(localMetrics.readPages, cloudData.khatm?.readPages || 0);
            userData.khatm.completedKhatms = Math.max(localMetrics.completedKhatms, cloudData.khatm?.completedKhatms || 0);
            
            if (!userData.stars) userData.stars = { totalStars: 0 };
            userData.stars.totalStars = Math.max(localMetrics.totalStars, cloudData.stars?.totalStars || 0);
        }
        
        ensureFullDataStructure();
        await saveUserData();
        
        showNotification('🔄 Синхронизировано с Firebase (с защитой прогресса)!'); 
        updateAllUI(); 
    } catch (e) { 
        showNotification('❌ Ошибка синхронизации'); 
        console.error(e);
    } 
});

document.getElementById('syncFromGitHubBtn')?.addEventListener('click', async () => {
    if (confirm('Загрузить свежие данные с GitHub?')) {
        showNotification('🔄 Загрузка данных с GitHub...');
        if (typeof manualSync === 'function') await manualSync();
        else if (typeof syncAllDataFromGitHub === 'function') await syncAllDataFromGitHub();
        updateLastSyncTime();
        if (typeof renderCollection === 'function') renderCollection();
        if (typeof renderAzkar === 'function') { checkAndResetAzkarDate(); renderAzkar(); }
        if (typeof renderNamesOfAllah === 'function') renderNamesOfAllah();
        showNotification('✅ Данные с GitHub обновлены!');
    }
});

// ========== ОБРАБОТЧИК НОВОЙ КНОПКИ ==========
document.getElementById('restoreFromCloudBtn')?.addEventListener('click', restoreFromFirebase);

// ========== ИСПРАВИТЬ КАРТИНКИ ==========
document.getElementById('fixAllImagesBtn')?.addEventListener('click', async () => {
    if (!confirm('Загрузить картинки для всех карточек из GitHub?')) return;
    
    showNotification('🔄 Загрузка карточек...');
    
    try {
        const response = await fetch('https://raw.githubusercontent.com/Mgmdov/Kunmusliman/main/data/cards.json');
        const cardsData = await response.json();
        
        if (!cardsData || !cardsData.cards) {
            showNotification('❌ Не удалось загрузить cards.json');
            return;
        }
        
        if (typeof ALL_COLLECTION_CARDS === 'undefined') window.ALL_COLLECTION_CARDS = [];
        
        let fixedCount = 0;
        
        cardsData.cards.forEach(jsonCard => {
            if (jsonCard.image) {
                let card = ALL_COLLECTION_CARDS.find(c => c.id === jsonCard.id);
                
                if (!card) {
                    card = { ...jsonCard };
                    ALL_COLLECTION_CARDS.push(card);
                }
                
                card.image = jsonCard.image.split('?')[0] + '?t=' + Date.now();
                fixedCount++;
            }
        });
        
        // СОХРАНЯЕМ карточки в localStorage
        localStorage.setItem('all_collection_cards', JSON.stringify(ALL_COLLECTION_CARDS));
        saveUserData();
        if (typeof renderCollection === 'function') renderCollection();
        updateCollectionBadge();
        
        showNotification(`✅ Обновлено ${fixedCount} карточек!`);
    } catch (e) {
        showNotification('❌ Ошибка загрузки');
        console.error(e);
    }
});

setTimeout(() => { 
    loadSettingsUI(); 
    restoreNotificationInterval(); 
    updateLastSyncTime();
}, 300);
