document.addEventListener('click', function(e) {
    var iconCircle = e.target.closest('.icon-circle');
    if (!iconCircle) return;
    
    var ripple = document.createElement('div');
    ripple.className = 'water-ripple';
    iconCircle.appendChild(ripple);
    
    setTimeout(function() {
        ripple.remove();
    }, 600);
    
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
});

setTimeout(function() {
    var icons = document.querySelectorAll('.icon-circle');
    icons.forEach(function(icon, index) {
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.3) translateY(20px)';
        icon.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        
        setTimeout(function() {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1) translateY(0)';
        }, index * 60);
    });
}, 500);

console.log('💧 Водные иконки активированы!');
