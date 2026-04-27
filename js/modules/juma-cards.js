// ========== КАРТОЧКИ ДЖУМА — НОВЫЙ ДИЗАЙН ==========
// Светлая мечеть, 3D анимация, история при нажатии
// Все карточки Джума = легендарные

// Расширенные истории о пятнице для каждой карточки
window.JUMA_STORIES = {
  j1: {
    title: 'Благословение пятницы',
    story: 'Пятница — лучший день, в который взошло солнце. В этот день был создан Адам, в этот день он был введён в Рай и в этот день он был выведен из него. И Судный день наступит в пятницу.',
    ayah: '«И стремитесь к поминанию Аллаха» (62:9)',
    hadith: 'Передал Абу Хурайра, да будет доволен им Аллах'
  },
  j2: {
    title: 'Свет между двумя пятницами',
    story: 'Пророк ﷺ сказал: «Кто совершит омовение в пятницу наилучшим образом, затем придёт на пятничную молитву и будет слушать молча — ему простятся грехи между этой и следующей пятницей и ещё три дня».',
    ayah: '«Аллах — Свет небес и земли» (24:35)',
    hadith: 'Сахих Муслим'
  },
  j3: {
    title: 'Час принятия дуа',
    story: 'В пятницу есть особый час, в который мольба раба не остаётся без ответа. Учёные говорят, что это время между асром и магрибом. Пророк ﷺ указал на его краткость, сжав пальцы.',
    ayah: '«Милость Моя объемлет всякую вещь» (7:156)',
    hadith: 'Аль-Бухари и Муслим'
  },
  j4: {
    title: 'Сура Аль-Кахф',
    story: 'Пророк ﷺ сказал: «Кто прочитает суру Аль-Кахф в пятницу, для того будет свет между двумя пятницами». Эта сура защищает от фитны Даджаля и освещает путь верующего.',
    ayah: '«Просите Аллаха о прощении» (71:10)',
    hadith: 'Аль-Хаким, ан-Насаи'
  },
  j5: {
    title: 'Салават на Пророка ﷺ',
    story: 'Пророк ﷺ сказал: «Увеличивайте салаваты на меня в пятницу и в ночь пятницы, ибо ваш салават доносится до меня». Салават в пятницу имеет особую награду и приближает к заступничеству Пророка ﷺ.',
    ayah: '«Падите ниц перед Аллахом и поклоняйтесь» (53:62)',
    hadith: 'Аль-Байхаки'
  },
  j6: {
    title: 'Баракат пятницы',
    story: 'Пятница — это праздник мусульман, который повторяется каждую неделю. В этот день желательно надеть лучшую одежду, использовать благовония, рано прийти в мечеть и много поминать Аллаха.',
    ayah: '«Это — благословенное Писание» (6:92)',
    hadith: 'Ибн Маджа'
  },
  j7: {
    title: 'Хутба — проповедь',
    story: 'Пятничная проповедь (хутба) — обязательная часть джума-намаза. Имам наставляет общину, напоминает о богобоязненности и единстве уммы. Во время хутбы нельзя разговаривать — только слушать.',
    ayah: '«О те, которые уверовали! Обратитесь за помощью к терпению и намазу» (2:153)',
    hadith: 'Аль-Бухари'
  },
  j8: {
    title: 'Благодарность в пятницу',
    story: 'Пятница — день, когда верующий благодарит Аллаха за прошедшую неделю и просит благословения на следующую. Шукр (благодарность) — один из высших видов поклонения.',
    ayah: '«Если вы будете благодарны, Я одарю вас ещё большим» (14:7)',
    hadith: 'Ат-Тирмизи'
  },
  j9: {
    title: 'Таваккуль — упование',
    story: 'В пятницу верующий обновляет своё упование на Аллаха (таваккуль). Пророк ﷺ сказал: «Если бы вы уповали на Аллаха истинным упованием, Он давал бы вам пропитание, как даёт его птицам».',
    ayah: '«И на Аллаха пусть уповают верующие» (3:122)',
    hadith: 'Ат-Тирмизи, Ибн Маджа'
  },
  j10: {
    title: 'Ихлас — искренность',
    story: 'Ихлас — посвящение всех деяний только Аллаху. Сура Аль-Ихлас, равная трети Корана, особенно рекомендуется к чтению в пятницу. Искренность очищает сердце от показухи и лицемерия.',
    ayah: '«Скажи: Он — Аллах Единый» (112:1)',
    hadith: 'Аль-Бухари'
  }
};

// SVG мечети для карточки Джума (светлый вариант)
window.JUMA_MOSQUE_SVG = `
<svg viewBox="0 0 80 70" width="80" height="70">
  <rect x="14" y="38" width="52" height="26" fill="none" stroke="#8a6818" stroke-width="0.8"/>
  <path d="M14 38 Q40 14 66 38" fill="#f0e8d0" stroke="#8a6818" stroke-width="1.2"/>
  <circle cx="40" cy="26" r="4" fill="#d4a937" opacity="0.5"/>
  <line x1="40" y1="22" x2="40" y2="16" stroke="#8a6818" stroke-width="0.8"/>
  <circle cx="40" cy="15" r="1.5" fill="#d4a937"/>
  <line x1="14" y1="38" x2="14" y2="64" stroke="#d4a937" stroke-width="2"/>
  <line x1="66" y1="38" x2="66" y2="64" stroke="#d4a937" stroke-width="2"/>
  <rect x="34" y="46" width="12" height="18" rx="6" fill="none" stroke="#8a6818" stroke-width="0.8"/>
  <line x1="24" y1="46" x2="24" y2="56" stroke="#8a6818" stroke-width="0.4" opacity="0.5"/>
  <line x1="56" y1="46" x2="56" y2="56" stroke="#8a6818" stroke-width="0.4" opacity="0.5"/>
  <path d="M22 42 Q28 36 34 42" fill="none" stroke="#8a6818" stroke-width="0.5" opacity="0.5"/>
  <path d="M46 42 Q52 36 58 42" fill="none" stroke="#8a6818" stroke-width="0.5" opacity="0.5"/>
</svg>
`;

// Рендер одной карточки Джума (мини — для коллекции)
window.renderJumaCard = function(card, isOwned) {
  const jumaData = window.JUMA_STORIES[card.id] || {};
  const lockClass = isOwned ? '' : 'juma-card-locked';
  const animClass = isOwned ? 'juma-card-animated' : '';

  return `
    <div class="juma-card-mini ${animClass} ${lockClass}"
         onclick="${isOwned ? `window.showJumaCardDetail('${card.id}')` : ''}">
      <div class="juma-card-badge">ДЖУМА</div>
      <div class="juma-card-illustration">
        ${isOwned ? window.JUMA_MOSQUE_SVG : '<div style="font-size:32px;opacity:0.3;">🔒</div>'}
      </div>
      <div class="juma-card-bottom">
        <div class="juma-card-title">${card.title || ''}</div>
      </div>
      ${isOwned ? '<div class="juma-card-orbit"><span>✦</span><span>✦</span><span>✦</span></div>' : ''}
    </div>
  `;
};

// Fullscreen при нажатии на карточку Джума
window.showJumaCardDetail = function(cardId) {
  const jumaData = window.JUMA_STORIES[cardId];
  if (!jumaData) return;

  const overlay = document.createElement('div');
  overlay.className = 'juma-detail-overlay';
  overlay.id = 'jumaDetailOverlay';

  overlay.innerHTML = `
    <div class="juma-detail-bg"></div>
    <div class="juma-detail-content">
      <div class="juma-detail-label">ЛЕГЕНДАРНАЯ · ДЖУМА</div>

      <div class="juma-detail-card">
        <div class="juma-detail-card-inner juma-card-animated">
          <div class="juma-card-badge">ДЖУМА</div>
          <div class="juma-card-illustration">${window.JUMA_MOSQUE_SVG}</div>
          <div class="juma-card-bottom">
            <div class="juma-card-title" style="font-size:16px;">${jumaData.title}</div>
          </div>
          <div class="juma-card-orbit"><span>✦</span><span>✦</span><span>✦</span></div>
        </div>
      </div>

      <div class="juma-detail-name">${jumaData.title}</div>

      <div class="juma-detail-story">${jumaData.story}</div>

      <div class="juma-detail-ayah">${jumaData.ayah}</div>
      <div class="juma-detail-hadith">${jumaData.hadith}</div>

      <div class="juma-detail-actions">
        <button class="juma-detail-btn" onclick="closeJumaDetail()">Закрыть</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
};

window.closeJumaDetail = function() {
  const overlay = document.getElementById('jumaDetailOverlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 300);
  }
};

// Перехватываем рендер коллекции — если вкладка Джума, подменяем карточки
(function hookJumaRendering() {
  function tryHook() {
    // Ищем оригинальную функцию рендера коллекции
    if (typeof window.renderCollectionGrid !== 'function' && typeof window.renderCollectionCards !== 'function') {
      // Альтернативный подход: наблюдаем за DOM и подменяем карточки Джума когда они появляются
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.id === 'collectionGrid') {
              replaceJumaCardsInGrid(node);
            }
          });
        });
      });

      const grid = document.getElementById('collectionGrid');
      if (grid) {
        observer.observe(grid, { childList: true, subtree: false });
      }
    }
  }

  // Также подменяем при клике на вкладку Джума
  function setupTabListener() {
    document.querySelectorAll('.collection-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        // Даём время рендеру обычной коллекции
        setTimeout(function() {
          // Проверяем — если текущая вкладка Джума
          var activeTab = document.querySelector('.collection-tab.active');
          if (activeTab && (activeTab.textContent.trim().toLowerCase().includes('джума') ||
              activeTab.dataset.collection === 'juma')) {
            replaceJumaCardsInDOM();
          }
        }, 200);
      });
    });
  }

  function replaceJumaCardsInDOM() {
    var grid = document.getElementById('collectionGrid');
    if (!grid) return;

    // Ищем все карточки в гриде
    var cards = grid.querySelectorAll('div[onclick]');
    cards.forEach(function(cardEl) {
      var onclick = cardEl.getAttribute('onclick') || '';
      // Ищем карточки Джума по id (j1-j10)
      var match = onclick.match(/showCardDetail\('(j\d+)'\)/);
      if (!match) return;

      var cardId = match[1];
      // Получаем данные о карте
      var allCards = typeof getAllCollectionCards === 'function' ? getAllCollectionCards() : [];
      var card = allCards.find(function(c) { return c.id === cardId; });
      if (!card) {
        card = { id: cardId, title: (window.JUMA_STORIES[cardId] || {}).title || 'Пятница' };
      }

      // Подменяем HTML карточки
      var wrapper = document.createElement('div');
      wrapper.innerHTML = window.renderJumaCard(card, true);
      if (wrapper.firstElementChild) {
        cardEl.replaceWith(wrapper.firstElementChild);
      }
    });
  }

  setTimeout(tryHook, 2000);
  setTimeout(setupTabListener, 2500);
  setTimeout(setupTabListener, 5000);
})();

console.log('🕌 Карточки Джума загружены:', Object.keys(window.JUMA_STORIES).length, 'историй');
