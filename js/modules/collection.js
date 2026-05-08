// ========== ФУНКЦИЯ ОТРИСОВКИ КОЛЛЕКЦИИ ==========
function renderCollection() {
    const c = document.getElementById('collectionGrid'); 
    if (!c) return;
    
    const activeTab = document.querySelector('.collection-tab.active')?.dataset.collection || 'all';
    const unlockedIds = userData.unlockedCards || [];
    
    // Используем централизованный источник (определён в другом месте)
    const allCards = (typeof getAllCollectionCards === 'function') ? getAllCollectionCards() : (window.ALL_COLLECTION_CARDS || []);
    
    console.log('🃏 Коллекция: всего карточек в системе =', allCards.length);
    console.log('🃏 Разблокировано:', unlockedIds.length);
    
    let cards = [];
    
    if (activeTab === 'rare') {
        cards = allCards.filter(function(card) { 
            return unlockedIds.includes(card.id) && 
                   ['legendary', 'epic', 'mythic'].includes(card.rarity); 
        });
    } else if (activeTab === 'all') {
        cards = allCards.filter(function(c) { 
            return unlockedIds.includes(c.id); 
        });
    } else if (activeTab === 'juma') {
        cards = allCards.filter(function(c) { 
            return c.type === 'juma' && unlockedIds.includes(c.id); 
        });
    } else {
        cards = allCards.filter(function(c) { 
            return c.type === activeTab && unlockedIds.includes(c.id); 
        });
    }
    
    // Удаляем дубликаты
    const uniqueCards = [...new Map(cards.map(function(item) { return [item.id, item]; })).values()];
    
    console.log('🃏 Вкладка "' + activeTab + '": найдено =', uniqueCards.length);
    
    if (uniqueCards.length === 0) { 
        c.innerHTML = '<div style="text-align:center;padding:40px;color:#8E8E93;grid-column:1/-1;">' +
            '<i class="fas fa-box-open" style="font-size:3rem;display:block;margin-bottom:16px;"></i>' +
            '<p style="font-size:1.1rem;margin-bottom:8px;">Пока нет открытых карт</p>' +
            '<p style="font-size:0.85rem;">Продолжайте пользоваться трекером, чтобы открывать новые карточки!</p>' +
            '</div>'; 
        updateCollectionBadge();
        return; 
    }
    
    c.innerHTML = uniqueCards.map(function(card) {
        var isUnlocked = unlockedIds.includes(card.id);
        var isRainbow = card.id === 'zamzam' || card.id === 'muhammad' || card.rarity === 'mythic';
        
        var onclickAction = '';
        if (isUnlocked) {
            // Используем onclick напрямую, без экранирования в строке
            onclickAction = 'showCardStory("' + card.id + '", "' + (card.name || '').replace(/"/g, '\\"') + '", "' + (card.emoji || '🖼️') + '", "' + (card.story || '').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '")';
        } else {
            onclickAction = 'alert("🔒 ' + (card.conditionText || 'Ещё не открыто') + '")';
        }
        
        // Картинка или эмодзи
        var imageHtml = '';
        var emojiHtml = '';
        
        if (card.image) {
            imageHtml = '<img src="' + card.image + '" alt="' + (card.name || '') + '" style="width:100%;height:120px;object-fit:contain;border-radius:12px;margin-bottom:8px;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';">';
            emojiHtml = '<div style="font-size:2.5rem;display:none;">' + (card.emoji || '🖼️') + '</div>';
        } else {
            imageHtml = '';
            emojiHtml = '<div style="font-size:2.5rem;">' + (card.emoji || '🖼️') + '</div>';
        }
        
        // Стили для радужных карточек
        var rainbowDiv = '';
        var bgStyle = 'background:#FFFFFF;';
        var textColor = '#1C1C1E';
        
        if (isRainbow && isUnlocked) {
            rainbowDiv = '<div style="position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,#ff0000,#ff9900,#ffff00,#33cc33,#3399ff,#6633cc,#ff33cc,#ff0000);background-size:300% 300%;border-radius:18px;z-index:-1;animation:rainbowFlow 4s ease infinite;"></div>';
            bgStyle = 'background:transparent;position:relative;overflow:hidden;';
            textColor = '#FFD700';
        } else if (isUnlocked) {
            bgStyle = 'background:#FFF9E6;';
        }
        
        var rarityHtml = '';
        if (card.rarity) {
            var rarityColors = { 'mythic': '#FFD700', 'legendary': '#FF9500', 'epic': '#AF52DE', 'rare': '#007AFF' };
            var rarityLabels = { 'mythic': '💫 Мифическая', 'legendary': '✨ Легендарная', 'epic': '💫 Эпическая', 'rare': '🔷 Редкая' };
            rarityHtml = '<div style="font-size:0.6rem;padding:4px 8px;border-radius:20px;display:inline-block;margin-top:8px;background:' + (rarityColors[card.rarity] || '#007AFF') + ';color:white;">' + (rarityLabels[card.rarity] || card.rarity) + '</div>';
        }
        
        var jannaHtml = card.isJanna ? '<div style="font-size:0.6rem;margin-top:5px;color:#FFD700;"><i class="fas fa-crown"></i> Обрадован Раем</div>' : '';
        
        return '<div onclick="' + onclickAction + '" style="' + bgStyle + 'border-radius:16px;padding:16px;text-align:center;cursor:pointer;border:1px solid ' + (isUnlocked ? '#FFD700' : '#E5E5EA') + ';">' +
            rainbowDiv +
            imageHtml +
            emojiHtml +
            '<div style="font-weight:600;color:' + textColor + ';margin:8px 0;">' + (card.name || '') + '</div>' +
            '<div style="font-size:0.75rem;color:#8E8E93;">' + (card.title || '') + '</div>' +
            rarityHtml +
            jannaHtml +
        '</div>';
    }).join('');
    
    updateCollectionBadge();
}

// Обновление значка коллекции
function updateCollectionBadge() {
    const total = (userData.unlockedCards || []).length;
    const badge = document.getElementById('collectionBadge');
    if (badge) badge.textContent = total;
}

// Глобальная функция показа истории карточки
window.showCardStory = function(id, name, emoji, story) {
    var modal = document.getElementById('storyModal');
    var iconEl = document.getElementById('storyIcon');
    var titleEl = document.getElementById('storyTitle');
    var textEl = document.getElementById('storyText');
    
    if (!modal || !iconEl || !titleEl || !textEl) return;
    
    iconEl.innerHTML = emoji || '🖼️';
    titleEl.textContent = name || 'Карточка';
    textEl.innerHTML = (story || 'Описание отсутствует');
    modal.style.display = 'flex';
};

// Переключение вкладок
document.querySelectorAll('.collection-tab').forEach(function(t) { 
    t.addEventListener('click', function(e) {
        e.preventDefault(); 
        e.stopPropagation();
        document.querySelectorAll('.collection-tab').forEach(function(x) { 
            x.style.background = '#F2F2F7'; 
            x.style.color = '#1C1C1E'; 
            x.classList.remove('active'); 
        });
        this.style.background = '#007AFF'; 
        this.style.color = 'white'; 
        this.classList.add('active');
        renderCollection();
    });
});

// Кнопка обновления
document.getElementById('refreshCollectionBtn')?.addEventListener('click', function() {
    // Принудительно пересобираем коллекцию
    if (typeof initializeAllCollectionCards === 'function') {
        window.ALL_COLLECTION_CARDS = initializeAllCollectionCards();
        localStorage.setItem('all_collection_cards', JSON.stringify(window.ALL_COLLECTION_CARDS));
    }
    renderCollection();
    showNotification('🔄 Коллекция обновлена!');
});

// Авторазблокировка сур
function autoUnlockSurahsUpTo(currentSura) {
    if (!userData.unlockedSurahs) userData.unlockedSurahs = []; 
    if (!userData.unlockedCards) userData.unlockedCards = [];
    for (let i = 1; i <= currentSura; i++) { 
        if (!userData.unlockedSurahs.includes(i)) userData.unlockedSurahs.push(i); 
        const cardId = 'su' + i; 
        if (!userData.unlockedCards.includes(cardId)) userData.unlockedCards.push(cardId); 
    }
    saveUserData();
}

// Запуск при загрузке
setTimeout(function() { 
    const currentSura = userData.khatm?.currentSura || 1; 
    autoUnlockSurahsUpTo(currentSura); 
    renderCollection(); 
}, 500);

console.log('✅ Модуль коллекции инициализирован');
