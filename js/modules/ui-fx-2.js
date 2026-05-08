// ========== 📖 ХАТМ: СТРАНИЦЫ ==========
function animatePageFlip() {
    var khatmCard = document.querySelector('#module-khatm .ios-card');
    if (!khatmCard) return;
    
    // Эффект перелистывания
    khatmCard.classList.add('page-flip');
    setTimeout(function() { khatmCard.classList.remove('page-flip'); }, 600);
    
    // Свечение книги
    var bookIcon = document.querySelector('#module-khatm .fa-book-open');
    if (bookIcon) {
        bookIcon.style.animation = 'quranGlow 2s ease-in-out infinite';
    }
}

// Перехватываем кнопку "+1 страница"
setTimeout(function() {
    var addPageBtn = document.getElementById('addPageBtn');
    if (addPageBtn) {
        var origClick = addPageBtn.onclick;
        addPageBtn.onclick = function(e) {
            animatePageFlip();
            if (origClick) origClick.call(this, e);
        };
    }
}, 2000);

// ========== 🕌 НАМАЗ: КОВРИК ==========
function animatePrayerRug() {
    var prayerCard = document.querySelector('#module-prayer .ios-card');
    if (!prayerCard) return;
    
    // Добавляем эффект коврика
    prayerCard.classList.add('rug-unroll');
    
    // Минареты пульсируют
    var mosqueIcon = document.querySelector('#module-prayer .fa-mosque');
    if (mosqueIcon) {
        mosqueIcon.classList.add('minaret-pulse');
    }
}

// Анимации при открытии модулей (БЕЗ СМЕЩЕНИЯ ЭКРАНА)
var origOpenModule = openModule;
openModule = function(moduleId) {
    // Сохраняем позицию ДО открытия
    var scrollY = window.scrollY;
    
    // Открываем модуль (основная функция с исправлением скролла)
    origOpenModule(moduleId);
    
    // Восстанавливаем позицию после открытия
    window.scrollTo(0, scrollY);
    
    // Анимация для намаза
    if (moduleId === 'prayer') {
        setTimeout(animatePrayerRug, 300);
    }
    
    // Анимация для хатма
    if (moduleId === 'khatm') {
        var bookIcon = document.querySelector('#module-khatm .fa-book-open');
        if (bookIcon) bookIcon.style.animation = 'quranGlow 2s ease-in-out infinite';
    }
};

// ========== 🏆 ДОСТИЖЕНИЯ: КУБОК ==========
function showTrophyAnimation() {
    // Создаём модальное окно с кубком
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:100000;display:flex;align-items:center;justify-content:center;flex-direction:column;';
    
    overlay.innerHTML = `
        <div style="font-size:8rem;" class="trophy-3d">🏆</div>
        <div style="color:gold;font-size:1.5rem;font-weight:bold;margin:20px 0;">Поздравляем!</div>
        <button style="padding:12px 30px;border-radius:30px;background:gold;border:none;font-weight:bold;cursor:pointer;" onclick="this.parentElement.remove()">Закрыть</button>
    `;
    
    document.body.appendChild(overlay);
    
    // Конфетти
    for (var i = 0; i < 50; i++) {
        var confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.background = ['#FFD700','#FF6B6B','#4ECDC4','#FFE66D','#FF8C42'][Math.floor(Math.random()*5)];
        confetti.style.setProperty('--cx', (Math.random()-0.5)*300 + 'px');
        confetti.style.setProperty('--cy', (Math.random()-0.5)*300 + 'px');
        confetti.style.animationDelay = (Math.random()*0.5) + 's';
        overlay.appendChild(confetti);
    }
    
    setTimeout(function() { overlay.remove(); }, 3000);
}

// При получении достижения
var origShowFirework3 = showFirework;
showFirework = function(text) {
    origShowFirework3(text);
    
    // Показываем кубок для больших достижений
    if (text.includes('🎉') || text.includes('ХАТМ') || text.includes('ЛЕГЕНДА')) {
        setTimeout(showTrophyAnimation, 1000);
    }
};

// ========== 👤 ПРОФИЛЬ: УРОВЕНЬ ==========
function animateLevelUp() {
    var xpBar = document.querySelector('.xp-bar');
    if (!xpBar) return;
    
    // Пузырьки XP
    for (var i = 0; i < 10; i++) {
        var bubble = document.createElement('div');
        bubble.className = 'xp-bubble';
        bubble.textContent = '+XP';
        bubble.style.left = (30 + Math.random() * 40) + '%';
        bubble.style.top = '50%';
        bubble.style.animationDelay = (i * 0.1) + 's';
        xpBar.appendChild(bubble);
        setTimeout(function() { bubble.remove(); }, 1000);
    }
    
    // Корона на аватар
    var avatar = document.querySelector('.rainbow-header');
    if (avatar) {
        var crown = document.createElement('div');
        crown.textContent = '👑';
        crown.style.cssText = 'position:absolute;top:-30px;left:50%;transform:translateX(-50%);font-size:2rem;z-index:10;';
        crown.classList.add('crown-drop');
        avatar.style.position = 'relative';
        avatar.appendChild(crown);
        setTimeout(function() { crown.remove(); }, 2000);
    }
}

// При повышении уровня
var prevLevel = userData.level || 1;
setInterval(function() {
    var currentLevel = userData.level || 1;
    if (currentLevel > prevLevel) {
        animateLevelUp();
        prevLevel = currentLevel;
    }
}, 2000);

// Звёзды вокруг аватара
function addOrbitStars() {
    var avatar = document.querySelector('.rainbow-header');
    if (!avatar || avatar.querySelector('.star-orbit')) return;
    avatar.style.position = 'relative';
    
    for (var i = 0; i < 3; i++) {
        var star = document.createElement('div');
        star.className = 'star-orbit';
        star.textContent = '⭐';
        star.style.cssText = 'position:absolute;top:50%;left:50%;font-size:1rem;pointer-events:none;';
        star.style.animationDelay = (i * 0.5) + 's';
        star.style.animationDuration = (2 + i * 0.5) + 's';
        avatar.appendChild(star);
    }
}
setTimeout(addOrbitStars, 3000);

