// Каталог коллекции: показывает все карточки, закрытые остаются силуэтами.
function renderCollectionInner() {
    const grid = document.getElementById('collectionGrid');
    if (!grid) return;
    const tab = document.querySelector('.collection-tab.active')?.dataset.collection || 'all';
    const ownership = document.querySelector('.collection-ownership-tab.active')?.dataset.ownership || 'open';
    let all = typeof initializeAllCollectionCards === 'function' ? initializeAllCollectionCards() : (typeof getAllCollectionCards === 'function' ? [...getAllCollectionCards()] : [...(window.ALL_COLLECTION_CARDS || [])]);
    (window.NAMES_CARDS || []).forEach(card => { if (!all.some(item => item.id === card.id)) all.push(card); });
    if (Array.isArray(window.CHEST_CARDS)) window.CHEST_CARDS.forEach(card => { if (!all.some(item => item.id === card.id)) all.push({ ...card, type: card.type || 'chest' }); });
    window.ALL_COLLECTION_CARDS = [...new Map(all.filter(c => c && c.id).map(c => [c.id, c])).values()];
    all = window.ALL_COLLECTION_CARDS;
    const arr = v => Array.isArray(v) ? v : [];
    const unlocked = new Set([...arr(userData.unlockedCards), ...arr(userData.jumaCards).map(c => c && typeof c === 'object' ? c.id : c), ...Object.keys(userData.chestCards && typeof userData.chestCards === 'object' ? userData.chestCards : {})].filter(Boolean));
    // Секретные карты (пасхалки, пятничная печать) не показываются, пока не открыты.
    const isSecretCard = card => /^ee_/.test(card.id) || card.id === 'p24' || card.id === 'prophet_story' || card.secret === true;
    Object.keys(userData.easterEggs || {}).forEach(id => { if (userData.easterEggs[id]) unlocked.add(id); });
    all = all.filter(card => !isSecretCard(card) || unlocked.has(card.id));
    const secretOwned = all.filter(card => isSecretCard(card)).length;
    const secretTab = document.getElementById('secretTabCount'); if (secretTab) secretTab.textContent = secretOwned;
    const rarityNames = {mythic:'Мифическая',legendary:'Легендарная',epic:'Эпическая',rare:'Редкая',common:'Обычная'};
    const ownedCount = all.filter(card => unlocked.has(card.id)).length;
    const percent = all.length ? Math.round(ownedCount / all.length * 100) : 0;
    const total = document.getElementById('collectionProgressCount'), pct = document.getElementById('collectionProgressPercent'), ring = document.getElementById('collectionProgressRing');
    if (total) total.textContent = `${ownedCount} из ${all.length}`;
    const hint = document.getElementById('collectionProgressHint'); if (hint) hint.textContent = `Открыто ${ownedCount} · осталось ${Math.max(0,all.length-ownedCount)} карточек`;
    const openCount = document.getElementById('collectionOpenCount'), closedCount = document.getElementById('collectionClosedCount');
    if (openCount) openCount.textContent = ownedCount; if (closedCount) closedCount.textContent = Math.max(0,all.length-ownedCount);
    if (pct) pct.textContent = `${percent}%`; if (ring) ring.style.setProperty('--collection-progress', `${percent}%`);
    if (tab === 'dupes' && typeof window.renderDuplicatesInto === 'function') { window.renderDuplicatesInto(grid); updateCollectionBadge(); return; }
    let cards = all;
    if (tab === 'rare') cards = all.filter(c => ['legendary','epic'].includes(c.rarity));
    else if (tab === 'mythic') cards = all.filter(c => c.rarity === 'mythic');
    else if (tab === 'secret') cards = all.filter(isSecretCard);
    else if (tab === 'recent') {
      // «Новые»: последние полученные карточки — сверху
      const times = userData.cardTimes = userData.cardTimes || {}, order = arr(userData.unlockedCards), base = Date.now() - 1e9;
      const when = id => times[id] || (((userData.chestCards || {})[id]) || {}).firstOpened || (order.indexOf(id) >= 0 ? base + order.indexOf(id) * 1000 : 0);
      cards = all.filter(card => unlocked.has(card.id)).sort((a, b) => when(b.id) - when(a.id)).slice(0, 30);
    }
    else if (tab === 'juma') cards = all.filter(c => c.type === 'juma');
    else if (tab !== 'all') cards = all.filter(c => c.type === tab || (tab === 'battle' && c.type === 'chest' && /битв|бадр|ухуд|ров/i.test(c.name || '')));
    if (ownership === 'open') cards = cards.filter(card => unlocked.has(card.id));
    else if (ownership === 'closed') cards = cards.filter(card => !unlocked.has(card.id));
    const sortMode = document.getElementById('premiumCollectionSort')?.value || 'default';
    const rank = {mythic:5,legendary:4,epic:3,rare:2,common:1};
    if (tab !== 'recent') cards = [...cards].sort((a,b) => {
      if (sortMode === 'rarity') return (rank[b.rarity]||0)-(rank[a.rarity]||0) || String(a.name||'').localeCompare(String(b.name||''),'ru');
      if (sortMode === 'name') return String(a.name||'').localeCompare(String(b.name||''),'ru');
      if (sortMode === 'opened') return Number(unlocked.has(b.id))-Number(unlocked.has(a.id)) || (rank[b.rarity]||0)-(rank[a.rarity]||0);
      if (sortMode === 'closed') return Number(unlocked.has(a.id))-Number(unlocked.has(b.id)) || (rank[b.rarity]||0)-(rank[a.rarity]||0);
      return 0;
    });
    if (!cards.length) {
      const emptyText = tab === 'recent' ? 'Пока нет полученных карточек. Откройте сундук или изучите историю!' : tab === 'secret' ? 'Секретные карты скрыты, пока вы их не откроете. Продолжайте — кто знает, что найдёте…' : ownership === 'open' ? 'Пока нет открытых карточек в этой категории.' : ownership === 'closed' ? 'Все карточки этой категории уже открыты.' : 'В этой категории пока нет карточек.';
      grid.innerHTML = `<div class="collection-empty-state">${emptyText}</div>`; updateCollectionBadge(); return;
    }
    const LIMIT = window._collectionLimit = window._collectionLimit || 48;
    const totalCards = cards.length;
    cards = cards.slice(0, LIMIT);
    grid.innerHTML = cards.map(card => {
      const owned = unlocked.has(card.id), rarity = rarityNames[card.rarity] || 'Карточка';
      if (!owned) return `<button type="button" class="chest-card-mini chest-card-hidden collection-chest-card-locked" aria-label="Закрытая карточка" onclick="window.showChestCardLocked()"><span class="collection-locked-symbol">✦</span><span class="chest-card-bottom"><span class="chest-card-card-name">???</span><span class="chest-card-card-title">${escapeCardText(rarity)}</span></span></button>`;
      const visual = { ...card, arabic: typeof window.collectionCardArabic === 'function' ? window.collectionCardArabic(card) : (card.arabic || card.arabicTitle || card.emoji || '۞'), title: card.title || card.titleMeaning || rarity };
      if (typeof window.renderChestCardSmall === 'function') return window.renderChestCardSmall(visual, true);
      return `<button type="button" class="collection-flip-card rarity-${escapeCardText(card.rarity||'common')}" onclick="window.showChestCardDetail('${escapeCardText(card.id)}')"><strong>${escapeCardText(card.name||'Карточка')}</strong><small>${escapeCardText(card.title||'')}</small></button>`;
    }).join('') + (totalCards > LIMIT ? `<button type="button" class="collection-more" onclick="window._collectionLimit=(window._collectionLimit||48)+48;renderCollection()">Показать ещё · ${totalCards - LIMIT}</button>` : '');
    updateCollectionBadge();
}
function renderCollection() {
    try { return renderCollectionInner(); }
    catch (e) {
        console.error('renderCollection', e);
        const grid = document.getElementById('collectionGrid');
        if (grid) grid.innerHTML = '<div class="collection-empty-state">Не удалось показать коллекцию. Потяните вниз и попробуйте ещё раз.</div>';
    }
}
function escapeCardText(value) { return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
window.flipCollectionCard = function(el) { if (el) el.classList.toggle('is-flipped'); };
window.openCollectionCardStory = function(id) {
    const card = (typeof getAllCollectionCards === 'function' ? getAllCollectionCards() : []).find(c => c.id === id);
    if (!card || typeof window.showCardStory !== 'function') return;
    let name = card.name || 'Карточка', story = card.story || 'Описание отсутствует';
    if (card.type === 'prophet') {
        name = /мухаммад/i.test(name) ? name.replace(/ ﷺ?$/,'') + ' ﷺ' : name.replace(/ عليه السلام$/,'') + ' عليه السلام';
        const prophetNames = ['Адам','Идрис','Нух','Худ','Салих','Ибрахим','Лут','Исмаил','Исхак','Якуб','Юсуф','Айюб','Шуайб','Муса','Харун','Давуд','Сулейман','Ильяс','Альяса','Юнус','Закария','Яхья','Иса','Зуль-Кифль'];
        prophetNames.forEach(n => { story = story.replace(new RegExp('([^А-Яа-яЁё]|^)'+n+'(?![А-Яа-яЁё])','g'), (m0,pre)=>pre+n+' عليه السلام'); });
        story = story.replace(/Мухаммад(?! ﷺ)/g, 'Мухаммад ﷺ');
    }
    window.showCardStory(id, name, card.emoji || '🃏', story);
};
function updateCollectionBadge() { const badge = document.getElementById('collectionBadge'); if (badge) { const ids = new Set([...(userData.unlockedCards || []), ...(userData.jumaCards || []).map(c => typeof c === 'string' ? c : c.id), ...Object.keys(userData.chestCards || {})]); badge.textContent = ids.size; } }
document.getElementById('module-collection')?.addEventListener('click', function(e) {
    const ownershipTab = e.target.closest('.collection-ownership-tab');
    const collectionTab = e.target.closest('.collection-tab');
    if (ownershipTab) { e.preventDefault(); e.stopPropagation(); document.querySelectorAll('.collection-ownership-tab').forEach(el => el.classList.toggle('active', el === ownershipTab)); window._collectionLimit=48; renderCollection(); return; }
    if (collectionTab && collectionTab.dataset.collection !== 'chest') { e.preventDefault(); e.stopPropagation(); document.querySelectorAll('.collection-tab').forEach(el => el.classList.toggle('active', el === collectionTab)); window._collectionLimit=48; renderCollection(); }
});
document.getElementById('premiumCollectionSort')?.addEventListener('change', renderCollection);
document.getElementById('refreshCollectionBtn')?.addEventListener('click', function() {
    window.ALL_COLLECTION_CARDS = initializeAllCollectionCards();
    localStorage.setItem('all_collection_cards', JSON.stringify(window.ALL_COLLECTION_CARDS));
    renderCollection(); if (typeof showNotification === 'function') showNotification('Коллекция обновлена');
});
setTimeout(() => {
    const ownershipTabs = [...document.querySelectorAll('.collection-ownership-tab')];
    if (ownershipTabs.length && !ownershipTabs.some(t => t.classList.contains('active') && t.dataset.ownership === 'open')) {
        ownershipTabs.forEach(t => t.classList.toggle('active', t.dataset.ownership === 'open'));
    }
    // Восстанавливаем карточки имён по уже сохранённому прогрессу, не выдавая новые суровые карты автоматически.
    if (typeof checkNamesCards === 'function') checkNamesCards();
    renderCollection();
}, 900);
console.log('Коллекция карточек: каталог и закрытые карточки инициализированы');
