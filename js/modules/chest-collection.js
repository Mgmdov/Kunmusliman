// ========== КОЛЛЕКЦИЯ СУНДУКА — отдельная вкладка ==========
// Интегрируется в существующую коллекцию через кнопку "📦 Сундук"

window.chestCollectionFilter = window.chestCollectionFilter || 'all';
window.chestCollectionSort = window.chestCollectionSort || 'rarity';
window.renderChestCollection = function() {
  const container = document.getElementById('collectionGrid');
  if (!container) return;
  const userChest = window.getUserChestCards();
  let cards = [...(window.CHEST_CARDS || [])];
  const filter = window.chestCollectionFilter || 'all';
  if (filter === 'opened') cards = cards.filter(c => !!userChest[c.id]);
  if (filter === 'closed') cards = cards.filter(c => !userChest[c.id]);
  const rank = {mythic:5,legendary:4,epic:3,rare:2,common:1};
  const sort = window.chestCollectionSort || 'rarity';
  cards.sort((a,b) => {
    if (sort === 'opened') return Number(!!userChest[b.id])-Number(!!userChest[a.id]) || (rank[b.rarity]||0)-(rank[a.rarity]||0);
    if (sort === 'name') return String(a.name||'').localeCompare(String(b.name||''),'ru');
    if (sort === 'rarity') return (rank[b.rarity]||0)-(rank[a.rarity]||0) || String(a.name||'').localeCompare(String(b.name||''),'ru');
    return 0;
  });
  const total = (window.CHEST_CARDS || []).length;
  const filterLabel = {all:'Все карточки',opened:'Открытые',closed:'Закрытые'};
  let html = `<div class="chest-collection-toolbar">
    <div class="chest-collection-filter" role="group" aria-label="Фильтр карточек сундука">
      <button type="button" data-chest-filter="all" class="${filter==='all'?'active':''}" onclick="window.setChestCollectionFilter('all')">Все</button>
      <button type="button" data-chest-filter="opened" class="${filter==='opened'?'active':''}" onclick="window.setChestCollectionFilter('opened')">Открытые</button>
      <button type="button" data-chest-filter="closed" class="${filter==='closed'?'active':''}" onclick="window.setChestCollectionFilter('closed')">Закрытые</button>
    </div>
    <label class="chest-collection-sort">Сортировка
      <select onchange="window.setChestCollectionSort(this.value)">
        <option value="rarity" ${sort==='rarity'?'selected':''}>По редкости</option>
        <option value="opened" ${sort==='opened'?'selected':''}>Сначала открытые</option>
        <option value="name" ${sort==='name'?'selected':''}>По названию</option>
      </select>
    </label>
    <div class="chest-collection-stats"><div class="chest-stat-block"><div class="chest-stat-num">${Object.keys(userChest).length}/${total}</div><div class="chest-stat-label">собрано</div></div><div class="chest-stat-block"><div class="chest-stat-num">${total?Math.round(Object.keys(userChest).length*100/total):0}%</div><div class="chest-stat-label">прогресс</div></div></div>
    <div class="chest-collection-current-filter">${filterLabel[filter]} · ${cards.length}</div>
  </div>`;
  if (!cards.length) html += `<div class="collection-empty-state">${filter==='opened'?'Пока нет открытых карт сундука.':'Нет карточек для выбранного фильтра.'}</div>`;
  else {
    if (sort === 'opened') {
      html += `<div class="chest-group"><div class="chest-group-header" style="color:#d4b75c;"><span>Сначала ваши открытые карты</span><span class="chest-group-count">${cards.filter(c => userChest[c.id]).length}/${cards.length}</span></div><div class="chest-collection-grid">${cards.map(c => window.renderChestCardSmall(c, !!userChest[c.id])).join('')}</div></div>`;
    } else {
      const groupTitles = {mythic:'Мифические',legendary:'Легендарные',epic:'Эпические',rare:'Редкие',common:'Обычные'};
      const groupColors = {mythic:'#c060ff',legendary:'#88dcff',epic:'#a878d8',rare:'#5a8acf',common:'#8a8a8e'};
      const order = ['mythic','legendary','epic','rare','common'];
      const groups = Object.fromEntries(order.map(r => [r, cards.filter(c => c.rarity === r)]));
      for (const rarity of order) {
        const group = groups[rarity]; if (!group.length) continue;
        const openedInGroup = group.filter(c => userChest[c.id]).length;
        html += `<div class="chest-group"><div class="chest-group-header" style="color:${groupColors[rarity]};"><span>${groupTitles[rarity]}</span><span class="chest-group-count">${openedInGroup}/${group.length} открыто</span></div><div class="chest-collection-grid">${group.map(c => window.renderChestCardSmall(c, !!userChest[c.id])).join('')}</div></div>`;
      }
    }
  }
  container.style.gridTemplateColumns = '1fr';
  container.innerHTML = html;
};
window.setChestCollectionFilter = function(value) { window.chestCollectionFilter = value; window.renderChestCollection(); };
window.setChestCollectionSort = function(value) { window.chestCollectionSort = value; window.renderChestCollection(); };

window.activateChestTab = function() {
  document.querySelectorAll('.collection-tab').forEach(t => {
    t.classList.remove('active');
    if (!t.dataset.collection || t.dataset.collection !== 'chest') {
      t.style.background = '#F2F2F7';
      t.style.color = '#1C1C1E';
    }
  });
  const chestTab = document.querySelector('.collection-tab[data-collection="chest"]');
  if (chestTab) {
    chestTab.classList.add('active');
    chestTab.style.background = 'linear-gradient(135deg,#f4d03f,#c0a040)';
    chestTab.style.color = '#1a1004';
  }
  const refreshBtn = document.getElementById('refreshCollectionBtn');
  if (refreshBtn) refreshBtn.style.display = 'none';
  window.renderChestCollection();
};

window.deactivateChestTab = function() {
  const container = document.getElementById('collectionGrid');
  if (container) container.style.gridTemplateColumns = 'repeat(2, 1fr)';
  const refreshBtn = document.getElementById('refreshCollectionBtn');
  if (refreshBtn) refreshBtn.style.display = '';
  // Снимаем подсветку с сундука
  const chestTab = document.querySelector('.collection-tab[data-collection="chest"]');
  if (chestTab) {
    chestTab.classList.remove('active');
    chestTab.style.background = 'linear-gradient(135deg,#f4d03f,#c0a040)';
    chestTab.style.color = '#1a1004';
  }
};

function setupChestTabHandlers() {
  if (document.querySelector('.collection-tab[data-collection="chest"]')) return; // уже добавлено

  // Контейнер с вкладками
  const allTabs = document.querySelectorAll('#module-collection .collection-tab');
  if (allTabs.length === 0) return;

  const tabsContainer = allTabs[0].parentElement;
  if (!tabsContainer) return;

  // Кнопка «Сундук»
  const chestBtn = document.createElement('button');
  chestBtn.className = 'collection-tab';
  chestBtn.dataset.collection = 'chest';
  chestBtn.style.cssText = 'padding: 8px 12px; border-radius: 30px; border: none; background: linear-gradient(135deg,#f4d03f,#c0a040); color: #1a1004; font-weight: 700; font-size: 0.75rem;';
  chestBtn.innerHTML = '📦 Сундук';
  chestBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.activateChestTab();
  };
  tabsContainer.appendChild(chestBtn);

  // На клик по другим вкладкам — деактивация сундука
  document.querySelectorAll('#module-collection .collection-tab:not([data-collection="chest"])').forEach(tab => {
    tab.addEventListener('click', () => {
      window.deactivateChestTab();
    });
  });
}

setTimeout(setupChestTabHandlers, 1500);
setTimeout(setupChestTabHandlers, 4000);

console.log('📦 Коллекция сундука готова');
