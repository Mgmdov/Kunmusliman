// ========== ЗОЛОТЫЕ КАРТОЧКИ 99 ИМЁН АЛЛАХА ==========

window.NAMES_ARABIC = {
  name1: 'الرَّحْمٰن', name2: 'الرَّحِيم', name3: 'الْمَلِك', name4: 'الْقُدُّوس',
  name5: 'السَّلَام', name6: 'الْمُؤْمِن', name7: 'الْمُهَيْمِن', name8: 'الْعَزِيز',
  name9: 'الْجَبَّار', name10: '١٠', name20: '٢٠', name30: '٣٠',
  name40: '٤٠', name50: '٥٠', name60: '٦٠', name70: '٧٠',
  name75: '٧٥', name80: '٨٠', name90: '٩٠', name99: '٩٩'
};

// Рендер золотой карточки имени в коллекции
window.renderNamesCard = function(card, isOwned) {
  var arabic = window.NAMES_ARABIC[card.id] || '';
  var isMilestone = card.id.match(/name\d{2,}/);
  var isMythic = card.rarity === 'mythic';
  var lockClass = isOwned ? '' : 'names-card-locked';
  var milestoneClass = (isOwned && isMilestone) ? 'names-card-milestone' : '';
  var mythicClass = (isOwned && isMythic) ? 'names-card-mythic' : '';

  return '<div class="names-card-mini ' + lockClass + ' ' + milestoneClass + ' ' + mythicClass + '"' +
    ' onclick="' + (isOwned ? "window.showNamesCardDetail('" + card.id + "')" : '') + '">' +
    '<div class="names-card-badge">ИМЯ АЛЛАХА</div>' +
    '<div class="names-card-arabic">' + arabic + '</div>' +
    '<div class="names-card-bottom">' +
      '<div class="names-card-name">' + card.name + '</div>' +
      '<div class="names-card-meaning">' + (card.title || '') + '</div>' +
    '</div>' +
  '</div>';
};

// Fullscreen при нажатии
window.showNamesCardDetail = function(cardId) {
  var allCards = typeof getAllCollectionCards === 'function' ? getAllCollectionCards() : [];
  var card = allCards.find(function(c) { return c.id === cardId; });
  if (!card) return;

  var arabic = window.NAMES_ARABIC[cardId] || '';
  var overlay = document.createElement('div');
  overlay.className = 'names-detail-overlay';
  overlay.id = 'namesDetailOverlay';
  overlay.innerHTML =
    '<div class="names-detail-bg"></div>' +
    '<div class="names-detail-content">' +
      '<div class="names-detail-arabic">' + arabic + '</div>' +
      '<div class="names-detail-name">' + card.name + '</div>' +
      '<div class="names-detail-meaning">' + (card.title || '') + '</div>' +
      '<div class="names-detail-story">' + (card.story || '') + '</div>' +
      '<button class="names-detail-btn" onclick="document.getElementById(\'namesDetailOverlay\').classList.add(\'closing\');setTimeout(function(){document.getElementById(\'namesDetailOverlay\').remove();},300);">Закрыть</button>' +
    '</div>';
  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('active'); });
};

// Перехват рендера коллекции для вкладки 99 имён
(function hookNamesRendering() {
  function setup() {
    document.querySelectorAll('.collection-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        setTimeout(function() {
          var active = document.querySelector('.collection-tab.active');
          if (active && (active.textContent.trim().includes('99') || active.textContent.trim().includes('Имён'))) {
            replaceNamesCards();
          }
        }, 250);
      });
    });
  }

  function replaceNamesCards() {
    var grid = document.getElementById('collectionGrid');
    if (!grid) return;
    var cards = grid.querySelectorAll('div[onclick]');
    cards.forEach(function(el) {
      var onclick = el.getAttribute('onclick') || '';
      var match = onclick.match(/showCardDetail\('(name\d+)'\)/);
      if (!match) return;
      var cardId = match[1];
      var allCards = typeof getAllCollectionCards === 'function' ? getAllCollectionCards() : [];
      var card = allCards.find(function(c) { return c.id === cardId; });
      if (!card) return;
      var wrapper = document.createElement('div');
      wrapper.innerHTML = window.renderNamesCard(card, true);
      if (wrapper.firstElementChild) el.replaceWith(wrapper.firstElementChild);
    });
  }

  setTimeout(setup, 2500);
  setTimeout(setup, 5000);
})();

console.log('🌟 Золотые карточки 99 Имён Аллаха загружены');
