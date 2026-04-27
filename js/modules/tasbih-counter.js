// ========== ТАСБИХ — СЧЁТЧИК + ЧЁТКИ ==========

window.openTasbihCounter = function() {
  var existing = document.getElementById('tasbihCounterOverlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'tasbihCounterOverlay';
  overlay.className = 'tasbih-overlay';

  var count = parseInt(localStorage.getItem('tasbih_count') || '0');
  var mode = localStorage.getItem('tasbih_mode') || 'counter'; // counter | beads
  var soundOn = localStorage.getItem('tasbih_sound') !== 'off';

  overlay.innerHTML =
    '<div class="tasbih-bg"></div>' +
    '<div class="tasbih-content">' +
      '<button class="tasbih-close" onclick="closeTasbihCounter()">✕</button>' +
      '<div class="tasbih-header">' +
        '<div class="tasbih-title">تسبيح</div>' +
        '<div class="tasbih-subtitle">Тасбих</div>' +
      '</div>' +
      '<div class="tasbih-mode-toggle">' +
        '<button class="tasbih-mode-btn ' + (mode === 'counter' ? 'active' : '') + '" onclick="switchTasbihMode(\'counter\')">Счётчик</button>' +
        '<button class="tasbih-mode-btn ' + (mode === 'beads' ? 'active' : '') + '" onclick="switchTasbihMode(\'beads\')">Чётки</button>' +
        '<button class="tasbih-sound-btn" onclick="toggleTasbihSound()" id="tasbihSoundBtn">' +
          (soundOn ? '🔊' : '🔇') +
        '</button>' +
      '</div>' +
      '<div id="tasbihView">' +
        (mode === 'counter' ? renderCounterView(count) : renderBeadsView(count)) +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('active'); });
};

window.closeTasbihCounter = function() {
  var overlay = document.getElementById('tasbihCounterOverlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(function() { overlay.remove(); }, 300);
  }
};

window.switchTasbihMode = function(mode) {
  localStorage.setItem('tasbih_mode', mode);
  document.querySelectorAll('.tasbih-mode-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelector('.tasbih-mode-btn:' + (mode === 'counter' ? 'first-child' : 'nth-child(2)')).classList.add('active');
  var count = parseInt(localStorage.getItem('tasbih_count') || '0');
  var view = document.getElementById('tasbihView');
  if (view) view.innerHTML = mode === 'counter' ? renderCounterView(count) : renderBeadsView(count);
};

window.toggleTasbihSound = function() {
  var current = localStorage.getItem('tasbih_sound') !== 'off';
  localStorage.setItem('tasbih_sound', current ? 'off' : 'on');
  var btn = document.getElementById('tasbihSoundBtn');
  if (btn) btn.textContent = current ? '🔇' : '🔊';
};

function renderCounterView(count) {
  return '<div class="tasbih-counter-view">' +
    '<div class="tasbih-count-display" id="tasbihCountDisplay">' + count + '</div>' +
    '<div class="tasbih-count-target">/ 33</div>' +
    '<button class="tasbih-big-btn" onclick="tasbihIncrement()" id="tasbihBigBtn">' +
      '<div class="tasbih-btn-inner">تسبيح</div>' +
    '</button>' +
    '<div class="tasbih-actions">' +
      '<button class="tasbih-small-btn" onclick="tasbihReset()">Сбросить</button>' +
      '<button class="tasbih-small-btn" onclick="tasbihSet(33)">33</button>' +
      '<button class="tasbih-small-btn" onclick="tasbihSet(99)">99</button>' +
      '<button class="tasbih-small-btn" onclick="tasbihSet(100)">100</button>' +
    '</div>' +
  '</div>';
}

function renderBeadsView(count) {
  var total = 33;
  var active = count % total;
  var beads = '';
  for (var i = 0; i < total; i++) {
    var isActive = i < active;
    var isCurrent = i === active;
    beads += '<div class="tasbih-bead ' +
      (isActive ? 'bead-active' : '') +
      (isCurrent ? ' bead-current' : '') +
      '" data-index="' + i + '"></div>';
  }

  return '<div class="tasbih-beads-view">' +
    '<div class="tasbih-count-small" id="tasbihCountDisplay">' + count + '</div>' +
    '<div class="tasbih-beads-circle">' +
      '<div class="tasbih-beads-ring" id="tasbihBeadsRing">' + beads + '</div>' +
      '<button class="tasbih-center-btn" onclick="tasbihIncrement()">' +
        '<span>تسبيح</span>' +
      '</button>' +
    '</div>' +
    '<div class="tasbih-actions">' +
      '<button class="tasbih-small-btn" onclick="tasbihReset()">Сбросить</button>' +
    '</div>' +
  '</div>';
}

window.tasbihIncrement = function() {
  var count = parseInt(localStorage.getItem('tasbih_count') || '0');
  count++;
  localStorage.setItem('tasbih_count', String(count));

  // Обновляем счётчик
  var display = document.getElementById('tasbihCountDisplay');
  if (display) {
    display.textContent = count;
    display.classList.add('tasbih-bump');
    setTimeout(function() { display.classList.remove('tasbih-bump'); }, 200);
  }

  // Звук
  if (localStorage.getItem('tasbih_sound') !== 'off') {
    playBeadSound();
  }

  // Анимация кнопки
  var btn = document.getElementById('tasbihBigBtn');
  if (btn) {
    btn.classList.add('tasbih-pressed');
    setTimeout(function() { btn.classList.remove('tasbih-pressed'); }, 150);
  }

  // Обновляем чётки
  updateBeadsDisplay(count);

  // Проверяем ежедневное задание (33+)
  if (count >= 33 && typeof window.completeDailyTask === 'function') {
    window.completeDailyTask('do_zikr');
  }

  // Вибрация на мильстоунах
  if (count % 33 === 0 && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
};

window.tasbihReset = function() {
  localStorage.setItem('tasbih_count', '0');
  var display = document.getElementById('tasbihCountDisplay');
  if (display) display.textContent = '0';
  updateBeadsDisplay(0);
};

window.tasbihSet = function(target) {
  // Сбрасываем но меняем target. Для простоты — просто сбрасываем
  tasbihReset();
  var targetEl = document.querySelector('.tasbih-count-target');
  if (targetEl) targetEl.textContent = '/ ' + target;
};

function updateBeadsDisplay(count) {
  var ring = document.getElementById('tasbihBeadsRing');
  if (!ring) return;
  var total = 33;
  var active = count % total;
  var beads = ring.querySelectorAll('.tasbih-bead');
  beads.forEach(function(b, i) {
    b.classList.toggle('bead-active', i < active);
    b.classList.toggle('bead-current', i === active);
    if (i === active - 1) {
      b.classList.add('bead-just-clicked');
      setTimeout(function() { b.classList.remove('bead-just-clicked'); }, 300);
    }
  });
}

function playBeadSound() {
  try {
    var ctx = window._tasbihAudioCtx || (window._tasbihAudioCtx = new (window.AudioContext || window.webkitAudioContext)());
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}

// Внедряем CSS
(function addTasbihCSS() {
  var s = document.createElement('style');
  s.textContent = [
    '.tasbih-overlay{position:fixed;inset:0;z-index:999998;opacity:0;transition:opacity .3s;overflow-y:auto;-webkit-overflow-scrolling:touch;}',
    '.tasbih-overlay.active{opacity:1;}.tasbih-overlay.closing{opacity:0;}',
    '.tasbih-bg{position:fixed;inset:0;background:radial-gradient(ellipse at center,#0a1a10 0%,#040a08 70%,#000 100%);z-index:0;}',
    '.tasbih-content{position:relative;z-index:10;min-height:100vh;padding:24px 16px 40px;box-sizing:border-box;color:#fff;display:flex;flex-direction:column;align-items:center;}',
    '.tasbih-close{position:absolute;top:16px;right:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:18px;width:36px;height:36px;border-radius:50%;cursor:pointer;z-index:100;}',
    '.tasbih-header{text-align:center;margin:8px 0 20px;}',
    '.tasbih-title{font-family:"Amiri",serif;font-size:36px;color:#5dcaa5;text-shadow:0 0 12px rgba(93,202,165,.5);}',
    '.tasbih-subtitle{font-size:13px;color:#88dcaa;letter-spacing:2px;}',
    '.tasbih-mode-toggle{display:flex;gap:6px;margin-bottom:24px;padding:4px;background:rgba(0,0,0,.3);border-radius:12px;}',
    '.tasbih-mode-btn{padding:8px 16px;background:transparent;border:none;border-radius:9px;color:rgba(255,255,255,.5);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;}',
    '.tasbih-mode-btn.active{background:rgba(93,202,165,.2);color:#5dcaa5;}',
    '.tasbih-sound-btn{padding:8px 12px;background:transparent;border:none;font-size:16px;cursor:pointer;}',

    '.tasbih-counter-view{display:flex;flex-direction:column;align-items:center;gap:16px;}',
    '.tasbih-count-display{font-size:72px;font-weight:700;color:#5dcaa5;text-shadow:0 0 20px rgba(93,202,165,.5);transition:transform .15s;}',
    '.tasbih-count-display.tasbih-bump{transform:scale(1.15);}',
    '.tasbih-count-target{font-size:16px;color:#446;margin-top:-12px;}',
    '.tasbih-big-btn{width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,#1a4a30 0%,#0a2a18 100%);border:3px solid #5dcaa5;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 28px rgba(93,202,165,.3);transition:transform .1s,box-shadow .1s;margin:12px 0;}',
    '.tasbih-big-btn:active,.tasbih-big-btn.tasbih-pressed{transform:scale(.95);box-shadow:0 0 40px rgba(93,202,165,.6);}',
    '.tasbih-btn-inner{font-family:"Amiri",serif;font-size:28px;color:#5dcaa5;pointer-events:none;}',
    '.tasbih-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}',
    '.tasbih-small-btn{padding:8px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:20px;color:#aaa;font-size:12px;cursor:pointer;}',

    '.tasbih-beads-view{display:flex;flex-direction:column;align-items:center;gap:16px;}',
    '.tasbih-count-small{font-size:36px;font-weight:700;color:#5dcaa5;transition:transform .15s;}',
    '.tasbih-count-small.tasbih-bump{transform:scale(1.15);}',
    '.tasbih-beads-circle{position:relative;width:260px;height:260px;}',
    '.tasbih-beads-ring{position:absolute;inset:0;}',
    '.tasbih-bead{position:absolute;width:18px;height:18px;border-radius:50%;background:#1a2a20;border:1.5px solid #2a4a38;transition:all .2s;}',
    '.tasbih-bead.bead-active{background:#1a6a45;border-color:#5dcaa5;box-shadow:0 0 6px rgba(93,202,165,.4);}',
    '.tasbih-bead.bead-current{border-color:#7df0c0;box-shadow:0 0 10px rgba(125,240,192,.6);transform:scale(1.2);}',
    '.tasbih-bead.bead-just-clicked{animation:beadPop .3s ease-out;}',
    '@keyframes beadPop{0%{transform:scale(1.5);}100%{transform:scale(1);}}',
    '.tasbih-center-btn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,#1a4a30,#0a2a18);border:2px solid #5dcaa5;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(93,202,165,.3);}',
    '.tasbih-center-btn:active{transform:translate(-50%,-50%) scale(.95);}',
    '.tasbih-center-btn span{font-family:"Amiri",serif;font-size:18px;color:#5dcaa5;pointer-events:none;}'
  ].join('\n');
  document.head.appendChild(s);

  // Позиционируем бусины по кругу после рендера
  setTimeout(positionBeads, 100);
})();

function positionBeads() {
  var ring = document.getElementById('tasbihBeadsRing');
  if (!ring) return;
  var beads = ring.querySelectorAll('.tasbih-bead');
  var total = beads.length;
  var radius = 110;
  var cx = 130, cy = 130;
  beads.forEach(function(b, i) {
    var angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    var x = cx + Math.cos(angle) * radius - 9;
    var y = cy + Math.sin(angle) * radius - 9;
    b.style.left = x + 'px';
    b.style.top = y + 'px';
  });
}

// Наблюдаем за пересозданием вида чёток
var beadsObserver = new MutationObserver(function() {
  setTimeout(positionBeads, 50);
});
setTimeout(function() {
  var view = document.getElementById('tasbihView');
  if (view) beadsObserver.observe(view, { childList: true });
}, 500);

console.log('📿 Тасбих (счётчик + чётки) загружен');
