// ========== FULLSCREEN ИСТОРИЯ ДЛЯ ВСЕХ КАРТ ==========
// Переопределяем showCardStory — теперь все карты открываются красиво

(function overrideCardStory() {
  var typeColors = {
    companion:   { bg: 'linear-gradient(180deg, #0a2618 0%, #042a18 100%)', accent: '#5dcaa5', label: 'СПОДВИЖНИК' },
    surah:       { bg: 'linear-gradient(180deg, #0a0e24 0%, #050818 100%)', accent: '#6a8ae0', label: 'СУРА' },
    prophet:     { bg: 'linear-gradient(180deg, #1a1208 0%, #2a1808 100%)', accent: '#d4a937', label: 'ПРОРОК' },
    battle:      { bg: 'linear-gradient(180deg, #200808 0%, #1a0404 100%)', accent: '#e05050', label: 'БИТВА' },
    miracle:     { bg: 'linear-gradient(180deg, #14082a 0%, #0a0418 100%)', accent: '#a080e0', label: 'ЧУДО' },
    juma:        { bg: 'linear-gradient(180deg, #faf6ee 0%, #f0e8d0 100%)', accent: '#8a6818', label: 'ДЖУМА' },
    rare:        { bg: 'linear-gradient(180deg, #101520 0%, #080c18 100%)', accent: '#b0c0e0', label: 'РЕДКАЯ' },
    achievement: { bg: 'linear-gradient(180deg, #180a28 0%, #0a0418 100%)', accent: '#b080e0', label: 'ДОСТИЖЕНИЕ' },
    name:        { bg: 'radial-gradient(ellipse at center, #4a3812 0%, #1a1004 60%, #000 100%)', accent: '#f4d03f', label: 'ИМЯ АЛЛАХА' },
    default:     { bg: 'linear-gradient(180deg, #1C1C1E 0%, #000 100%)', accent: '#007AFF', label: 'КАРТА' }
  };

  window.showCardStory = function(id, name, emoji, story) {
    // Пытаемся найти полные данные карты
    var allCards = typeof getAllCollectionCards === 'function' ? getAllCollectionCards() : [];
    var card = allCards.find(function(c) { return c.id === id; });
    
    var type = (card && card.type) || 'default';
    var rarity = (card && card.rarity) || 'common';
    var title = (card && card.title) || '';
    var ayah = (card && card.ayah) || '';
    var cardStory = story || (card && card.story) || '';
    var cardName = name || (card && card.name) || '';
    var cardEmoji = emoji || (card && card.emoji) || '';

    // Если это Джума — используем специальный обработчик
    if (type === 'juma' && typeof window.showJumaCardDetail === 'function') {
      window.showJumaCardDetail(id);
      return;
    }

    // Если это 99 Имён — используем золотой обработчик
    if (type === 'name' && typeof window.showNamesCardDetail === 'function') {
      window.showNamesCardDetail(id);
      return;
    }

    var cfg = typeColors[type] || typeColors.default;
    var isDarkBg = type !== 'juma';

    var overlay = document.createElement('div');
    overlay.id = 'cardStoryOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;opacity:0;transition:opacity 0.3s;overflow-y:auto;-webkit-overflow-scrolling:touch;';

    overlay.innerHTML = 
      '<div style="position:fixed;inset:0;background:' + cfg.bg + ';z-index:0;"></div>' +
      '<div style="position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;text-align:center;box-sizing:border-box;">' +
        '<div style="font-size:12px;letter-spacing:3px;color:' + cfg.accent + ';font-weight:600;margin-bottom:16px;animation:fadeSlideDown 0.6s ease-out;">' + cfg.label + '</div>' +
        (cardEmoji ? '<div style="font-size:64px;margin-bottom:12px;animation:cardPopIn 1s cubic-bezier(0.34,1.56,0.64,1);">' + cardEmoji + '</div>' : '') +
        '<div style="font-size:24px;font-weight:700;color:' + (isDarkBg ? '#fff' : '#333') + ';margin-bottom:4px;animation:fadeSlideDown 0.6s ease-out 0.8s backwards;">' + cardName + '</div>' +
        (title ? '<div style="font-size:14px;color:' + cfg.accent + ';margin-bottom:20px;animation:fadeSlideDown 0.6s ease-out 0.9s backwards;">' + title + '</div>' : '<div style="margin-bottom:20px;"></div>') +
        '<div style="font-size:14px;color:' + (isDarkBg ? 'rgba(255,255,255,0.85)' : '#555') + ';max-width:320px;line-height:1.7;margin-bottom:16px;animation:fadeSlideDown 0.6s ease-out 1.1s backwards;">' + cardStory + '</div>' +
        (ayah ? '<div style="font-family:Amiri,serif;font-size:14px;color:' + cfg.accent + ';font-style:italic;max-width:300px;margin-bottom:24px;animation:fadeSlideDown 0.6s ease-out 1.3s backwards;">' + ayah + '</div>' : '') +
        '<button onclick="var o=document.getElementById(\'cardStoryOverlay\');if(o){o.style.opacity=0;setTimeout(function(){o.remove();},300);}" style="background:' + cfg.accent + ';color:' + (isDarkBg ? '#fff' : '#000') + ';border:none;padding:14px 40px;border-radius:28px;font-size:15px;font-weight:600;cursor:pointer;animation:fadeSlideDown 0.6s ease-out 1.5s backwards;">Закрыть</button>' +
      '</div>';

    document.body.appendChild(overlay);
    requestAnimationFrame(function() { overlay.style.opacity = '1'; });
  };

  // CSS для анимаций
  var style = document.createElement('style');
  style.textContent = 
    '@keyframes fadeSlideDown { 0% { opacity:0; transform:translateY(-15px); } 100% { opacity:1; transform:translateY(0); } }' +
    '@keyframes cardPopIn { 0% { opacity:0; transform:scale(0.3) rotateY(180deg); } 50% { opacity:1; transform:scale(1.15) rotateY(0); } 100% { transform:scale(1); } }';
  document.head.appendChild(style);

  console.log('🎴 Fullscreen история для всех карт загружена');
})();
