(function() {
    var splash = document.getElementById('splashScreen');
    var progressBar = document.getElementById('splashProgressFill');
    var loadingText = document.getElementById('splashLoadingText');
    
    // Частицы вокруг луны
    var emojis = ['✨', '💫', '⭐', '🌟', '🕌', '📖', '📿'];
    
    setInterval(function() {
        var particle = document.createElement('span');
        particle.className = 'splash-particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = Math.random() * 80 + 10 + '%';
        particle.style.top = '50%';
        particle.style.fontSize = (1 + Math.random()) + 'rem';
        particle.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        splash.appendChild(particle);
        
        setTimeout(function() {
            particle.remove();
        }, 2000);
    }, 300);
    
    // Прогресс-бар
    var progress = 0;
    var progressInterval = setInterval(function() {
        progress += Math.random() * 15;
        if (progress >= 90) {
            progress = 90;
            clearInterval(progressInterval);
        }
        
        progressBar.style.width = progress + '%';
        
        if (progress < 30) loadingText.textContent = 'Загрузка Корана...';
        else if (progress < 60) loadingText.textContent = 'Загрузка азкаров...';
        else if (progress < 80) loadingText.textContent = 'Загрузка достижений...';
        else loadingText.textContent = 'Почти готово...';
        
    }, 200);
    
    // Скрываем экран загрузки через 2.5 секунды
    setTimeout(function() {
        progressBar.style.width = '100%';
        loadingText.textContent = 'Готово! БисмиЛлях!';
        
        setTimeout(function() {
            splash.classList.add('hidden');
        }, 400);
        
    }, 2500);
    
})();
