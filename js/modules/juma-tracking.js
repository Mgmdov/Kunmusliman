// ========== ФИКСАЦИЯ ДЖУМА — ССЫЛКИ КАХФ + ХУТБА ==========
// Кнопки активируются через 30 мин после того как человек прошёл по ссылке

(function setupJumaTracking() {
  var WAIT_MS = 30 * 60 * 1000; // 30 минут

  function trySetup() {
    // Ищем кнопки Кахф и Хутба в модуле Джума
    var jumaModule = document.getElementById('module-juma');
    if (!jumaModule) return;

    var links = jumaModule.querySelectorAll('a[href], button[onclick*="http"], button[onclick*="surah"], button[onclick*="khutba"], button[onclick*="кахф"], button[onclick*="Кахф"], button[onclick*="хутб"]');
    
    links.forEach(function(link) {
      if (link._jumaTracked) return;
      link._jumaTracked = true;

      var linkText = (link.textContent || '').toLowerCase();
      var isKahf = linkText.includes('кахф') || linkText.includes('kahf') || linkText.includes('суру');
      var isKhutba = linkText.includes('хутб') || linkText.includes('khutba') || linkText.includes('видео');

      var trackKey = isKahf ? 'juma_kahf_clicked' : isKhutba ? 'juma_khutba_clicked' : null;
      if (!trackKey) return;

      // Проверяем статус
      var clickedAt = parseInt(localStorage.getItem(trackKey) || '0');
      var today = new Date().toISOString().slice(0, 10);
      var clickedToday = clickedAt > 0 && new Date(clickedAt).toISOString().slice(0, 10) === today;

      if (clickedToday) {
        var elapsed = Date.now() - clickedAt;
        if (elapsed < WAIT_MS) {
          // Ещё не прошло 30 минут — блокируем
          disableButton(link, WAIT_MS - elapsed, trackKey);
        } else {
          // 30 минут прошло — кнопка активна, начислить если не начислено
          enableButton(link, trackKey);
        }
      }

      // Перехватываем клик
      link.addEventListener('click', function() {
        if (!localStorage.getItem(trackKey) || 
            new Date(parseInt(localStorage.getItem(trackKey))).toISOString().slice(0, 10) !== today) {
          localStorage.setItem(trackKey, String(Date.now()));
          // Блокируем на 30 мин
          setTimeout(function() {
            disableButton(link, WAIT_MS, trackKey);
          }, 100);
        }
      });
    });
  }

  function disableButton(btn, remainingMs, trackKey) {
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    
    // Добавляем таймер
    var timer = btn.querySelector('.juma-timer');
    if (!timer) {
      timer = document.createElement('span');
      timer.className = 'juma-timer';
      timer.style.cssText = 'display:block;font-size:10px;color:#888;margin-top:4px;';
      btn.appendChild(timer);
    }

    var endTime = Date.now() + remainingMs;
    
    function updateTimer() {
      var left = endTime - Date.now();
      if (left <= 0) {
        enableButton(btn, trackKey);
        return;
      }
      var mins = Math.floor(left / 60000);
      var secs = Math.floor((left % 60000) / 1000);
      timer.textContent = 'Доступно через ' + mins + ':' + (secs < 10 ? '0' : '') + secs;
      requestAnimationFrame(updateTimer);
    }
    updateTimer();
  }

  function enableButton(btn, trackKey) {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    var timer = btn.querySelector('.juma-timer');
    if (timer) timer.textContent = '✓ Выполнено';

    // Начислить звёзды если ещё не начислено
    var claimedKey = trackKey + '_claimed_' + new Date().toISOString().slice(0, 10);
    if (!localStorage.getItem(claimedKey)) {
      localStorage.setItem(claimedKey, '1');
      if (window.userData) {
        var starsObj = window.userData.stars || { totalStars: 0 };
        starsObj.totalStars = parseInt(starsObj.totalStars || 0) + 10;
        window.userData.stars = starsObj;
        if (typeof window.updateStarsDisplay === 'function') window.updateStarsDisplay();
        if (typeof window.saveData === 'function') window.saveData();
      }
    }
  }

  setTimeout(trySetup, 3000);
  setTimeout(trySetup, 6000);

  console.log('🕌 Фиксация Джума загружена');
})();
