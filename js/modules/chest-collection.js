// ========== КОЛЛЕКЦИЯ СУНДУКА — отдельная вкладка ==========
// Интегрируется в существующую коллекцию через кнопку "📦 Сундук"

window.renderChestCollection = function() {
  const container = document.getElementById('collectionGrid');
  if (!container) return;

  const userChest = window.getUserChestCards();
  const all = window.CHEST_CARDS;

  const order = ['mythic', 'legendary', 'epic', 'rare', 'common'];
  const groups = { mythic: [], legendary: [], epic: [], rare: [], common: [] };
  all.forEach(c => groups[c.rarity].push(c));

  const owned = Object.keys(userChest).length;
  const total = all.length;

  let html = `
    <div style="grid-column:1/-1;">
      <div class="chest-collection-stats">
        <div class="chest-stat-block">
          <div class="chest-stat-num">${owned}/${total}</div>
          <div class="chest-stat-label">собрано</div>
        </div>
        <div class="chest-stat-block">
          <div class="chest-stat-num">${Math.round(owned*100/total)}%</div>
          <div class="chest-stat-label">прогресс</div>
        </div>
      </div>
  `;

  const groupTitles = {
    mythic: 'Мифические', legendary: 'Легендарные', epic: 'Эпические', rare: 'Редкие', common: 'Обычные'
  };
  const groupColors = {
    mythic: '#c060ff', legendary: '#88dcff', epic: '#a878d8', rare: '#5a8acf', common: '#8a8a8e'
  };

  for (const rarity of order) {
    const cards = groups[rarity];
    if (!cards.length) continue;
    const ownedInGroup = cards.filter(c => userChest[c.id]).length;
    html += `
      <div class="chest-group">
        <div class="chest-group-header" style="color:${groupColors[rarity]};">
          <span>${groupTitles[rarity]}</span>
          <span class="chest-group-count">${ownedInGroup}/${cards.length}</span>
        </div>
        <div class="chest-collection-grid">
          ${cards.map(c => window.renderChestCardSmall(c, !!userChest[c.id])).join('')}
        </div>
      </div>`;
  }
  html += '</div>';

  container.style.gridTemplateColumns = '1fr';
  container.innerHTML = html;
};

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
