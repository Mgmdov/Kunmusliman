function updateJumaCheckboxesState() {
    const today = new Date(); const isFriday = (today.getDay() === 5);
    const kahfCheck = document.getElementById('jumaKahfCheck'), khutbaCheck = document.getElementById('jumaKhutbaCheck'), lockedMsg = document.getElementById('jumaLockedMessage'), hint = document.getElementById('jumaFridayOnlyHint'), claimBtn = document.getElementById('claimJumaCardBtn');
    if (isFriday) {
        if (kahfCheck) kahfCheck.disabled = false; if (khutbaCheck) khutbaCheck.disabled = false;
        if (lockedMsg) lockedMsg.style.display = 'none'; if (hint) { hint.textContent = '✅ Сегодня пятница! Отметьте выполненные дела.'; hint.style.color = '#34C759'; }
        updateJumaButton(); { const jb = document.getElementById('jumaBadge'); if (jb) jb.style.display = 'inline-block'; }
    } else {
        if (kahfCheck) { kahfCheck.disabled = true; kahfCheck.checked = false; } if (khutbaCheck) { khutbaCheck.disabled = true; khutbaCheck.checked = false; }
        if (lockedMsg) lockedMsg.style.display = 'block';
        const daysUntilFriday = (5 - today.getDay() + 7) % 7;
        const daysText = daysUntilFriday === 0 ? 'сегодня' : daysUntilFriday === 1 ? 'завтра' : `через ${daysUntilFriday} ${getDayWord(daysUntilFriday)}`;
        if (hint) { hint.textContent = `⏳ До пятницы осталось: ${daysText}`; hint.style.color = '#8E8E93'; }
        if (claimBtn) claimBtn.disabled = true; { const jb = document.getElementById('jumaBadge'); if (jb) jb.style.display = 'none'; }
    }
}
function getDayWord(n) { if (n % 10 === 1 && n % 100 !== 11) return 'день'; if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'дня'; return 'дней'; }
function getCurrentKhutbaIndex() { const saved = localStorage.getItem('juma_khutba_index'); if (saved) return parseInt(saved); return 0; }
function updateKhutbaForFriday() {
    const today = new Date(); const dayOfWeek = today.getDay(); const lastFriday = localStorage.getItem('last_friday_update'); const todayStr = today.toISOString().split('T')[0];
    if (dayOfWeek === 5 && lastFriday !== todayStr) { let index = getCurrentKhutbaIndex(); index = (index + 1) % JUMA_LINKS.length; localStorage.setItem('juma_khutba_index', index); localStorage.setItem('last_friday_update', todayStr); }
    const index = getCurrentKhutbaIndex(); const khutba = JUMA_LINKS[index];
    document.getElementById('khutbaTitle').textContent = khutba.title; document.getElementById('khutbaLink').href = khutba.url;
}
function checkFridayAndNotify() {
    const today = new Date();
    // Напоминание за день до пятницы, один раз за неделю и без навязчивого повторения при каждом запуске.
    if (today.getDay() === 4) {
        const key = `juma_reminder_shown_${getWeekNumber()}`;
        if (localStorage.getItem(key) !== 'true') {
            localStorage.setItem(key, 'true');
            const banner = document.createElement('div');
            banner.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top) + 14px);left:12px;right:12px;max-width:520px;margin:auto;background:#1c1c1e;border:1px solid #d6b875;border-radius:18px;padding:14px 18px;color:#f2dfad;font-weight:700;z-index:99999;cursor:pointer;box-shadow:0 12px 32px rgba(0,0,0,.3);text-align:center;';
            banner.innerHTML = '🌙 Завтра пятница — подготовьтесь к Джума';
            banner.onclick = () => { banner.remove(); openModule('juma'); };
            document.body.appendChild(banner); setTimeout(() => banner.remove(), 9000);
        }
    }
}
function getWeekNumber() { const now = new Date(); const start = new Date(now.getFullYear(), 0, 1); return Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7); }
function updateJumaButton() { const kahf = document.getElementById('jumaKahfCheck')?.checked || false; const khutba = document.getElementById('jumaKhutbaCheck')?.checked || false; const btn = document.getElementById('claimJumaCardBtn'); const today = new Date(); if (btn) btn.disabled = !(today.getDay() === 5 && kahf && khutba); }
function showMysteryCards() {
    const available = ALL_CARDS.filter(c => c.type === 'juma' && !userData.jumaCards?.find(jc => jc.id === c.id));
    let cardsToShow = [];
    if (available.length >= 3) { const shuffled = [...available].sort(() => Math.random() - 0.5); cardsToShow = shuffled.slice(0, 3); }
    else { const other = ALL_CARDS.filter(c => !userData.jumaCards?.find(jc => jc.id === c.id)); const shuffled = [...other].sort(() => Math.random() - 0.5); cardsToShow = shuffled.slice(0, 3); }
    currentMysteryCards = cardsToShow;
    const container = document.getElementById('mysteryCards');
    container.style.cssText = window.innerWidth <= 600 ? 'display:flex;flex-direction:column;align-items:center;gap:15px;' : 'display:flex;justify-content:center;gap:20px;';
    container.innerHTML = cardsToShow.map((c, i) => `<div class="mystery-card" data-index="${i}" style="${window.innerWidth <= 600 ? 'width:180px;' : ''}"><div class="mystery-ayah">${c.ayah || '«Поистине, Аллах любит творящих добро» (2:195)'}</div></div>`).join('');
    document.getElementById('mysteryOverlay').classList.add('active');
}
document.getElementById('mysteryCards')?.addEventListener('click', (e) => {
    const card = e.target.closest('.mystery-card'); if (!card) return;
    const index = parseInt(card.dataset.index); const selected = currentMysteryCards[index];
    if (!userData.jumaCards) userData.jumaCards = []; if (!userData.unlockedCards) userData.unlockedCards = [];
    if (!userData.jumaCards.find(c => c.id === selected.id)) userData.jumaCards.push(selected);
    if (!userData.unlockedCards.includes(selected.id)) userData.unlockedCards.push(selected);
    localStorage.setItem(`juma_claimed_${getWeekNumber()}`, 'true'); hasClaimedThisWeek = true;
    saveUserData(); document.getElementById('mysteryOverlay').classList.remove('active');
    showFirework(`🎉 ${selected.name} ${selected.title}!`); if (typeof renderCollection === 'function') renderCollection();
    setTimeout(() => alert(`📜 ${selected.story}`), 500); updateCollectionBadge();
});
document.getElementById('mysteryOverlay')?.addEventListener('click', (e) => { if (e.target === document.getElementById('mysteryOverlay')) document.getElementById('mysteryOverlay').classList.remove('active'); });
document.getElementById('jumaKahfCheck')?.addEventListener('change', function(e) { if (this.checked && !confirm('Ты точно прочитал(а) суру Аль-Кахф? Обманывать — харам.')) { this.checked = false; e.preventDefault(); } updateJumaButton(); });
document.getElementById('jumaKhutbaCheck')?.addEventListener('change', function(e) { if (this.checked && !confirm('Ты точно посмотрел(а) пятничную хутбу? Обманывать — харам.')) { this.checked = false; e.preventDefault(); } updateJumaButton(); });
document.getElementById('claimJumaCardBtn')?.addEventListener('click', () => {
    const today = new Date(); if (today.getDay() !== 5) { alert('🔒 Карту можно получить только в пятницу!'); return; }
    if (!document.getElementById('jumaKahfCheck')?.checked || !document.getElementById('jumaKhutbaCheck')?.checked) { alert('⚠️ Сначала прочитай суру Аль-Кахф и посмотри хутбу!'); return; }
    const weekKey = `juma_claimed_${getWeekNumber()}`; if (localStorage.getItem(weekKey) === 'true') { alert('🎴 Вы уже забрали карту на этой неделе!'); return; }
    showMysteryCards();
});
setInterval(() => { if (new Date().getDay() === 5) updateKhutbaForFriday(); }, 3600000);
updateKhutbaForFriday(); checkFridayAndNotify(); updateJumaCheckboxesState();
