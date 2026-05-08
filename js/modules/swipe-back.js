// ========== СВАЙПЫ НАЗАД ВО ВСЕХ ОВЕРЛЕЯХ ==========
(function(){
var THRESHOLD = 80;
var EDGE_ZONE = 30; // только от левого края
var startX = 0, startY = 0, isTracking = false, currentOverlay = null;

document.addEventListener('touchstart', function(e) {
  if (!e.touches || !e.touches[0]) return;
  var t = e.touches[0];
  // Проверяем — только от левого края (0-30px)
  if (t.clientX > EDGE_ZONE) return;
  // Ищем оверлей сверху
  var overlay = e.target.closest('.fullscreen-overlay');
  if (!overlay) return;
  startX = t.clientX;
  startY = t.clientY;
  isTracking = true;
  currentOverlay = overlay;
}, {passive: true});

document.addEventListener('touchmove', function(e) {
  if (!isTracking || !currentOverlay) return;
  if (!e.touches || !e.touches[0]) return;
  var t = e.touches[0];
  var dx = t.clientX - startX;
  var dy = Math.abs(t.clientY - startY);
  if (dx < 0) return;
  // Если вертикальное движение больше — это скролл, отменяем
  if (dy > Math.abs(dx)) {
    isTracking = false;
    currentOverlay.style.transform = '';
    return;
  }
  // Визуально двигаем оверлей
  currentOverlay.style.transform = 'translateX(' + Math.min(dx, 200) + 'px)';
  currentOverlay.style.opacity = String(Math.max(0.3, 1 - dx / 400));
}, {passive: true});

document.addEventListener('touchend', function(e) {
  if (!isTracking || !currentOverlay) return;
  var t = (e.changedTouches && e.changedTouches[0]);
  if (!t) {
    currentOverlay.style.transform = '';
    currentOverlay.style.opacity = '';
    isTracking = false;
    currentOverlay = null;
    return;
  }
  var dx = t.clientX - startX;
  if (dx > THRESHOLD) {
    // Закрываем оверлей
    currentOverlay.style.transition = 'transform 0.2s, opacity 0.2s';
    currentOverlay.style.transform = 'translateX(100%)';
    currentOverlay.style.opacity = '0';
    setTimeout(function() {
      if (currentOverlay && currentOverlay.parentNode) currentOverlay.remove();
    }, 200);
  } else {
    // Возвращаем
    currentOverlay.style.transition = 'transform 0.2s, opacity 0.2s';
    currentOverlay.style.transform = '';
    currentOverlay.style.opacity = '';
    setTimeout(function() {
      if (currentOverlay) {
        currentOverlay.style.transition = '';
      }
    }, 200);
  }
  isTracking = false;
  currentOverlay = null;
}, {passive: true});

console.log('👆 Свайпы назад загружены');
})();
