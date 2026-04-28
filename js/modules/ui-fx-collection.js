// ========== 🎴 КОЛЛЕКЦИЯ: ВЕЕР КАРТ ==========
function toggleCardFan() {
    var grid = document.getElementById('collectionGrid');
    if (!grid) return;
    
    var cards = grid.querySelectorAll('div[onclick]');
    cards.forEach(function(card, i) {
        card.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        
        if (grid.classList.contains('fan-mode')) {
            card.style.transform = 'rotate(0deg) translateX(0)';
        } else {
            var angle = (i - cards.length/2) * 3;
            var tx = (i - cards.length/2) * 5;
            card.style.transform = 'rotate(' + angle + 'deg) translateX(' + tx + 'px)';
        }
    });
    
    grid.classList.toggle('fan-mode');
}

function addFanButton() {
    var collectionCard = document.querySelector('#module-collection .ios-card');
    if (!collectionCard || document.getElementById('fanBtn')) return;
    
    var fanBtn = document.createElement('button');
    fanBtn.id = 'fanBtn';
    fanBtn.className = 'ios-button secondary';
    fanBtn.textContent = '🃏 Веер';
    fanBtn.style.cssText = 'width:100%;margin-top:10px;';
    fanBtn.onclick = toggleCardFan;
    
    var refreshBtn = document.getElementById('refreshCollectionBtn');
    if (refreshBtn) {
        refreshBtn.parentNode.insertBefore(fanBtn, refreshBtn);
    }
}
setTimeout(addFanButton, 2000);

console.log('📖🕌🏆👤🎴 Анимации добавлены!');
