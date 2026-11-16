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
        if (signOutBtn) signOutBtn.style.display = 'block'; { const d = document.getElementById('deleteAccountBtn'); if (d) d.style.display = 'block'; } 
        if (loginBtn) loginBtn.style.display = 'none'; 
    } else { 
        { const d = document.getElementById('deleteAccountBtn'); if (d) d.style.display = 'none'; }
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
    // Переносим старое значение из localStorage в основной профиль настроек.
    const legacyAyahSetting = localStorage.getItem('hide_ayah_widget');
    if (legacyAyahSetting !== null) {
        if (!userData.settings) userData.settings = {};
        userData.settings.hideAyahWidget = legacyAyahSetting === 'true';
        localStorage.removeItem('hide_ayah_widget');
        if (typeof saveUserData === 'function') saveUserData();
    }
    if (hideAyahCheck) hideAyahCheck.checked = !!userData.settings?.hideAyahWidget;
    const ayahWidget = document.getElementById('ayahWidget');
    if (ayahWidget) ayahWidget.hidden = !!userData.settings?.hideAyahWidget;
    updateAccountInfo(); 
    loadSavedTheme(); 
    updateLastSyncTime();
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('muslim_tracker_theme') || 'dark';
    if (typeof window.applyTheme === 'function') window.applyTheme(savedTheme);
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

// Мгновенное управление виджетом «Аят дня» с сохранением в основной профиль.
window.toggleAyahWidget = function(shouldHide) {
    if (!userData.settings) userData.settings = {};
    userData.settings.hideAyahWidget = !!shouldHide;
    localStorage.removeItem('hide_ayah_widget');
    const ayahWidget = document.getElementById('ayahWidget');
    if (ayahWidget) ayahWidget.hidden = !!shouldHide;
    if (typeof saveUserData === 'function') saveUserData();
    if (typeof showNotification === 'function') {
        showNotification(shouldHide ? 'Аят дня скрыт с главного экрана' : 'Аят дня снова отображается');
    }
};

function saveAllSettings() {
    if (!userData.settings) userData.settings = {};
    userData.settings.zikrNotificationInterval = parseInt(document.getElementById('notificationInterval').value);
    userData.settings.hideAyahWidget = document.getElementById('hideAyahWidgetCheck').checked;
    saveUserData();
    const ayahWidget = document.getElementById('ayahWidget');
    if (ayahWidget) ayahWidget.hidden = !!userData.settings.hideAyahWidget;
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

// Переключение тем выполняется через settings-overlays.js (только light/dark).

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
        localStorage.setItem('kunmusliman_entry_choice_v1', 'guest');
        await auth.signOut(); 
        currentUser = null; 
        updateAccountInfo(); 
        showNotification('👋 Вы вышли'); 
        updateAllUI(); 
    } 
});

// Резервная копия v22: сохраняем данные пользователя и безопасные ключи приложения.
const BACKUP_FORMAT = 'kunmusliman-backup';
const BACKUP_VERSION = 2;
const BACKUP_STORAGE_EXCLUDE = /^(firebase|firebase:|__|google\.|g_state|amp_)/i;

function collectAppStorage() {
    const values = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || BACKUP_STORAGE_EXCLUDE.test(key)) continue;
        try { values[key] = localStorage.getItem(key); } catch (_) {}
    }
    return values;
}

function downloadJsonFile(payload, filename) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
}

document.getElementById('exportDataBtn')?.addEventListener('click', () => {
    try {
        const payload = {
            format: BACKUP_FORMAT,
            backupVersion: BACKUP_VERSION,
            appVersion: '22.0',
            exportDate: new Date().toISOString(),
            userData: JSON.parse(JSON.stringify(userData)),
            specialDaysCounters: typeof specialDaysCounters !== 'undefined' ? JSON.parse(JSON.stringify(specialDaysCounters)) : {},
            appStorage: collectAppStorage()
        };
        downloadJsonFile(payload, `kunmusliman-backup-${new Date().toISOString().slice(0,10)}.json`);
        localStorage.setItem('kunmusliman_last_local_backup', new Date().toISOString());
        showNotification('Резервная копия создана');
    } catch (err) {
        console.error('Backup export failed:', err);
        showNotification('Не удалось создать копию: ' + err.message);
    }
});

document.getElementById('importDataBtn')?.addEventListener('click', () => document.getElementById('importFileInput')?.click());

document.getElementById('importFileInput')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
        alert('Файл слишком большой (максимум 15 МБ).'); e.target.value = ''; return;
    }
    try {
        const parsed = JSON.parse(await file.text());
        const incoming = parsed?.format === BACKUP_FORMAT ? parsed.userData : (parsed?.userData || parsed);
        if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) throw new Error('В файле нет корректного объекта userData.');
        if (parsed?.format && parsed.format !== BACKUP_FORMAT) throw new Error('Неизвестный формат резервной копии.');
        if (!confirm('Восстановить данные из файла? Текущий прогресс будет заменён. Перед восстановлением будет создана локальная страховочная копия.')) return;

        // Страховочная копия текущего состояния перед любым изменением.
        const safetyCopy = {
            format: BACKUP_FORMAT, backupVersion: BACKUP_VERSION,
            exportDate: new Date().toISOString(), userData: JSON.parse(JSON.stringify(userData)),
            specialDaysCounters: typeof specialDaysCounters !== 'undefined' ? JSON.parse(JSON.stringify(specialDaysCounters)) : {},
            appStorage: collectAppStorage()
        };
        downloadJsonFile(safetyCopy, `kunmusliman-before-restore-${new Date().toISOString().slice(0,10)}.json`);

        Object.keys(userData).forEach(key => delete userData[key]);
        Object.assign(userData, incoming);
        if (parsed.specialDaysCounters && typeof specialDaysCounters !== 'undefined') {
            Object.assign(specialDaysCounters, parsed.specialDaysCounters);
        }
        if (parsed.appStorage && typeof parsed.appStorage === 'object') {
            Object.entries(parsed.appStorage).forEach(([key, value]) => {
                if (!BACKUP_STORAGE_EXCLUDE.test(key) && typeof value === 'string') {
                    try { localStorage.setItem(key, value); } catch (storageError) { console.warn('Skipped storage key:', key, storageError); }
                }
            });
        }
        ensureFullDataStructure();
        await saveUserData();
        if (typeof updateAllUI === 'function') updateAllUI();
        if (typeof renderCollection === 'function') renderCollection();
        if (typeof renderAchievements === 'function') renderAchievements();
        if (typeof updateKhatmUI === 'function') updateKhatmUI();
        showNotification('Данные восстановлены. Проверьте коллекцию и прогресс.');
    } catch (err) {
        console.error('Backup import failed:', err);
        alert('Не удалось восстановить копию: ' + err.message);
    } finally {
        e.target.value = '';
    }
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

// ===== Сообщить о баге → сразу открывает WhatsApp =====
window.BUG_REPORT_WA = '79635890090';
window.reportBug = function () {
  var ver = 'v58';
  var ud = window.userData || {};
  var txt = 'Салам! Нашёл баг в Kunmusliman (' + ver + ').\n\nГде: \nЧто произошло: \nЧто ожидал: \n\n' +
    'Устройство: ' + (navigator.userAgent || '').slice(0, 90) + (ud.nickname ? '\nНик: ' + ud.nickname : '');
  var url = 'https://wa.me/' + window.BUG_REPORT_WA + '?text=' + encodeURIComponent(txt);
  var w = null;
  try { w = window.open(url, '_blank'); } catch (e) {}
  if (!w) location.href = url;
};


// Удаление аккаунта (требование App Store 5.1.1(v)): данные в облаке + учётная запись + локальные данные
window.deleteMyAccount = async function () {
  const u = window._currentUser, db = window._db;
  if (!u || u.isAnonymous) { alert('Вы не вошли в аккаунт.'); return; }
  if (!confirm('Удалить аккаунт и все данные безвозвратно? Прогресс, рейтинг и карточки будут потеряны.')) return;
  if (!confirm('Точно удалить? Это нельзя отменить.')) return;
  try {
    if (db) {
      await Promise.all(['users', 'leaderboard'].map(c => db.collection(c).doc(u.uid).delete().catch(() => {})));
    }
    await u.delete();
  } catch (e) {
    if (e && e.code === 'auth/requires-recent-login') { alert('Для удаления нужно заново войти. Выйдите, войдите снова и повторите.'); return; }
    alert('Не удалось удалить аккаунт: ' + ((e && e.message) || e)); return;
  }
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  alert('Аккаунт удалён.');
  location.reload();
};
