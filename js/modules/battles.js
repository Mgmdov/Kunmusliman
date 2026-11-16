// Переключение разделов сиры: активной остаётся только одна вкладка.
const prophetStoryTabs = [...document.querySelectorAll('[data-prophet-tab]')];
const prophetStorySections = {
    early: 'prophetEarly',
    revelation: 'prophetRevelation',
    mecca: 'prophetMecca',
    medina: 'prophetMedina',
    farewell: 'prophetFarewell'
};
function setProphetStoryTab(tabName) {
    prophetStoryTabs.forEach(t => {
        const active = t.dataset.prophetTab === tabName;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    Object.entries(prophetStorySections).forEach(([key, id]) => {
        const section = document.getElementById(id);
        if (section) section.style.display = key === tabName ? 'block' : 'none';
    });
}
prophetStoryTabs.forEach(tab => tab.addEventListener('click', () => setProphetStoryTab(tab.dataset.prophetTab)));

function updateProphetStoryReadButton() {
    const button = document.getElementById('markProphetStoryRead');
    if (!button) return;
    const isRead = (userData.readEducationalStories || []).includes('prophet_story');
    button.classList.toggle('prophet-story-read', isRead);
    button.classList.toggle('secondary', !isRead);
    button.classList.toggle('success', isRead);
    button.disabled = isRead;
    button.innerHTML = isRead
        ? '<i class="fas fa-check-circle"></i> Прочитано'
        : '<i class="fas fa-check-circle"></i> Отметить как прочитанное';
}

// Первый клик открывает полную историю. Отметка о прочтении ставится только после
// отдельного подтверждения внизу прочитанного материала.
function openProphetStoryReadModal() {
    const old = document.getElementById('prophetStoryReadOverlay');
    if (old) old.remove();
    const sections = Object.values(prophetStorySections).map(id => document.getElementById(id)).filter(Boolean);
    const storyHtml = sections.map(section => `<section class="prophet-read-section">${section.innerHTML}</section>`).join('');
    const overlay = document.createElement('div');
    overlay.id = 'prophetStoryReadOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000000;background:rgba(3,8,12,.98);overflow-y:auto;padding:22px 16px 34px;box-sizing:border-box;color:#eee8d8;';
    overlay.innerHTML = `<div style="max-width:720px;margin:0 auto;"><button type="button" class="ios-button secondary" onclick="document.getElementById('prophetStoryReadOverlay')?.remove()">← Назад</button><div style="text-align:center;margin:22px 0 18px;color:#e5c56b;letter-spacing:2px;font-size:12px;">السِّيرَة النَّبَوِيَّة</div><h2 style="text-align:center;color:#f4d77b;margin:0 0 24px;">Полная история Пророка Мухаммада ﷺ</h2><div class="prophet-read-story">${storyHtml}</div><div style="position:sticky;bottom:0;padding:16px 0 4px;background:linear-gradient(180deg,transparent,#07100d 24%);"><button type="button" id="confirmProphetStoryRead" class="ios-button" style="width:100%;background:linear-gradient(135deg,#b88a25,#f5d878);color:#171006;font-weight:700;">Я прочитал историю — получить особую карточку</button></div></div>`;
    document.body.appendChild(overlay);
    document.getElementById('confirmProphetStoryRead').addEventListener('click', completeProphetStoryRead);
}
function completeProphetStoryRead() {
    userData.readEducationalStories ||= [];
    if (userData.readEducationalStories.includes('prophet_story')) {
        document.getElementById('prophetStoryReadOverlay')?.remove();
        updateProphetStoryReadButton();
        return;
    }
    userData.readEducationalStories.push('prophet_story');
    if (typeof window.awardStars === 'function') window.awardStars(5, 'Изучение истории Пророка ﷺ', 'story:prophet:complete');
    if (typeof addXP === 'function') addXP(200);
    if (typeof showNotification === 'function') showNotification('История изучена. Да вознаградит вас Аллах!');
    if (typeof showFirework === 'function') showFirework('ﷺ');
    document.getElementById('prophetStoryReadOverlay')?.remove();
    updateProphetStoryReadButton();
    if (typeof saveUserData === 'function') saveUserData();
    if (typeof renderCollection === 'function') renderCollection();
    if (typeof checkAllAchievements === 'function') checkAllAchievements();
}
document.getElementById('markProphetStoryRead')?.addEventListener('click', openProphetStoryReadModal);

// Восстановление выбранной вкладки и статуса прочтения после открытия приложения.
setProphetStoryTab('early');
setTimeout(updateProphetStoryReadButton, 350);

// ========== ЛОГИКА БИТВ ==========
let currentBattle = 'badr';

const BATTLE_CONTENT = {
    badr: { name: 'Битва при Бадре', year: '2 г.х.', emoji: '⚔️', story: '<strong>Первое крупное сражение мусульман.</strong> 313 мусульман (2 коня и 70 верблюдов) против 1000 хорошо вооружённых курайшитов. Пророк ﷺ усердно молился о победе. Аллах ниспослал ангелов в помощь, и мусульмане одержали решительную победу. 70 курайшитов убиты, 70 взяты в плен. Погибло 14 мусульман.', result: 'Победа мусульман', ayah: '«Аллах помог вам при Бадре, когда вы были слабы» (3:123)' },
    uhud: { name: 'Битва при Ухуде', year: '3 г.х.', emoji: '🏹', story: '<strong>Курайшиты жаждали мести за Бадр.</strong> 3000 воинов против 700 мусульман. Пророк ﷺ поставил 50 лучников на горе с приказом не покидать позицию. Мусульмане начали побеждать, но лучники, увидев добычу, покинули пост. Халид ибн Валид (тогда ещё не мусульманин) ударил с тыла. Пророк ﷺ был ранен, его дядя Хамза убит.', result: 'Поражение (урок)', ayah: '«Аллах сдержал Своё обещание, когда вы уничтожали их с Его дозволения» (3:152)' },
    khandaq: { name: 'Битва у Рва (Хандак)', year: '5 г.х.', emoji: '🕳️', story: '<strong>Союз 10 000 врагов осадил Медину.</strong> По совету Салмана аль-Фариси мусульмане вырыли ров вокруг города. Враг не мог его преодолеть. Осада длилась около месяца. Аллах послал сильный ветер и холод, который разрушил лагерь союзников и заставил их отступить.', result: 'Победа без боя', ayah: '«О те, которые уверовали! Вспомните милость Аллаха, когда к вам пришли войска, и Мы послали на них ветер и воинов, которых вы не видели» (33:9)' },
    khaybar: { name: 'Битва при Хайбаре', year: '7 г.х.', emoji: '🏰', story: '<strong>Поход против иудейских крепостей Хайбара.</strong> Крепости были хорошо укреплены. Пророк ﷺ сказал: «Завтра я вручу знамя человеку, который любит Аллаха и Его Посланника». Знамя было вручено Али ибн Абу Талибу. Он проявил невиданную храбрость, выбил ворота крепости и мусульмане одержали победу.', result: 'Победа', ayah: '«Он — Тот, Кто удалил их и вложил в ваши сердца гнев» (59:2)' },
    mutah: { name: 'Битва при Муте', year: '8 г.х.', emoji: '🛡️', story: '<strong>Первое столкновение с Византией.</strong> 3000 мусульман против 200 000 византийцев и арабов-христиан. Пророк ﷺ назначил командирами Зайда ибн Харису, затем Джафара, затем Абдуллаха ибн Раваху. Все трое пали смертью храбрых. Знамя подхватил Халид ибн Валид, который мастерски отвёл войско с минимальными потерями.', result: 'Тактическое отступление', ayah: '«Сражайтесь с теми, кто не верует в Аллаха и в Последний день» (9:29)' },
    hunain: { name: 'Битва при Хунайне', year: '8 г.х.', emoji: '🏔️', story: '<strong>После завоевания Мекки племена Хавазин устроили засаду в долине.</strong> 12 000 мусульман попали под град стрел. Многие обратились в бегство. Пророк ﷺ остался на месте, призывая: «Я — Пророк, это правда! Я — сын Абдуль-Мутталиба!» Ансары сплотились вокруг него, и враг был разбит. Захвачены огромные трофеи.', result: 'Победа', ayah: '«Аллах даровал вам победу во многих местах и в день Хунайна» (9:25)' },
    tabuk: { name: 'Поход на Табук', year: '9 г.х.', emoji: '🔥', story: '<strong>Самый тяжёлый поход в сильную жару.</strong> 30 000 мусульман выступили против Византии. Многие лицемеры уклонились под разными предлогами. Верующие жертвовали много имущества (Усман снарядил целую армию). Когда мусульмане дошли до Табука, византийцы отступили, испугавшись. Это укрепило авторитет Ислама на севере Аравии.', result: 'Без боя', ayah: '«О те, которые уверовали! Сражайтесь с неверными, которые находятся вблизи вас» (9:123)' }
};

// Связываем исторический раздел с прохождением соответствующего этапа армии.
const CAMPAIGN_TO_BATTLE = { badr:'badr', uhud:'uhud', khandaq:'khandaq', khaybar:'khaybar', mutah:'mutah', fath:'fath', hunain:'hunain', tabuk:'tabuk', yarmouk:'yarmouk', qadisiyyah:'qadisiyyah', hattin:'hattin', aynjalut:'aynjalut' };
function getArmyCampaignState(){try{return JSON.parse(localStorage.getItem('kun_army_v3')||'{}');}catch(_){return {};}}
function isCampaignBattleUnlocked(battleId){const state=getArmyCampaignState();const campaignId=Object.keys(CAMPAIGN_TO_BATTLE).find(k=>CAMPAIGN_TO_BATTLE[k]===battleId);return !!campaignId && Array.isArray(state.completed) && state.completed.includes(campaignId);}
function refreshBattleTabs(){
  const tabs=document.querySelector('.battle-tabs');if(!tabs)return;
  if(Array.isArray(window.ISLAMIC_BATTLES)&&window.ISLAMIC_BATTLES.length){
    tabs.innerHTML=window.ISLAMIC_BATTLES.map(b=>{const id=b.id.replace(/^battle_/,'');const unlocked=isCampaignBattleUnlocked(id);return `<button class="battle-tab ${id===currentBattle?'active':''} ${unlocked?'':'is-locked'}" data-battle="${id}" type="button" ${unlocked?'':'disabled'} title="${unlocked?'Открыто после прохождения этапа армии':'Сначала пройдите этот этап в разделе Армия'}"><span>⚔️</span><b>${b.name.replace(/^Битва при |^Битва у |^Битва при |^Поход на |^Завоевание /,'')}</b><small>${b.year||''}</small></button>`;}).join('');
    window.ISLAMIC_BATTLES.forEach(b=>{const id=b.id.replace(/^battle_/,'');if(!BATTLE_CONTENT[id])BATTLE_CONTENT[id]={name:b.name,year:b.year||'',emoji:'⚔️',story:b.story||'',result:'Историческое событие',ayah:b.details||''};});
    tabs.querySelectorAll('.battle-tab').forEach(tab=>tab.addEventListener('click',()=>{if(tab.disabled)return;currentBattle=tab.dataset.battle;tabs.querySelectorAll('.battle-tab').forEach(t=>t.classList.toggle('active',t===tab));renderBattleContent(currentBattle);}));
  }
}
window.openBattleHistoryFromArmy=function(campaignId){const battleId=CAMPAIGN_TO_BATTLE[campaignId];if(!battleId||!isCampaignBattleUnlocked(battleId))return;openModule('battles');currentBattle=battleId;refreshBattleTabs();const tabs=document.querySelectorAll('.battle-tab');tabs.forEach(t=>t.classList.toggle('active',t.dataset.battle===battleId));renderBattleContent(battleId);};
document.addEventListener('army:battle-unlocked',refreshBattleTabs);

function renderBattleContent(battleId) {
    const battle = BATTLE_CONTENT[battleId];
    if (!battle) return;
    
    const container = document.getElementById('battleContentContainer');
    const unlocked = isCampaignBattleUnlocked(battleId);
    const isRead = (userData.battlesRead || []).includes(battleId);
    const markButton = document.getElementById('markBattleReadBtn');
    if (!unlocked) {
        container.innerHTML = '<div class="battle-locked-notice">🔒 Сначала пройдите соответствующий этап в разделе «Армия». После прохождения здесь откроются история битвы и карточка.</div>';
        document.getElementById('battleReadStatus').innerHTML = '<span>Событие пока закрыто в исторической кампании.</span>';
        markButton.disabled = true;
        document.getElementById('markBattleReadText').textContent = 'Сначала пройдите битву в Армии';
        updateBattlesProgress();
        return;
    }
    
    const battleImages = { badr: 'images/cards/badr-battle.png', uhud: 'images/cards/uhud.png', khandaq: 'images/cards/khandaq.jpg', khaybar: 'images/cards/khaybar.png' };
    const image = battleImages[battleId];
    container.innerHTML = `
        ${image ? `<div class="battle-art" style="background-image:linear-gradient(0deg,rgba(7,12,10,.88),rgba(7,12,10,.08)),url('${image}')"></div>` : `<div class="battle-art battle-art-fallback has-scene">${window.armySceneFor ? window.armySceneFor(battleId) : battle.emoji}</div>`}
        <div class="battle-detail-heading"><span class="battle-detail-emoji">${battle.emoji}</span><div><h3>${battle.name}</h3><p>${battle.year}</p></div></div>
        <div class="battle-story">${battle.story}</div>
        <div class="battle-result"><small>ИТОГ СОБЫТИЯ</small><strong>${battle.result}</strong></div>
        <blockquote class="battle-ayah"><span>📖</span><div>${battle.ayah}</div></blockquote>
    `;
    
    const statusEl = document.getElementById('battleReadStatus');
    if (isRead) {
        statusEl.innerHTML = '<span class="battle-status-done"><i class="fas fa-check-circle"></i> Вы уже изучили это событие</span>';
        statusEl.className = 'battle-read-status is-done';
        document.getElementById('markBattleReadText').textContent = 'Уже прочитано';
        document.getElementById('markBattleReadBtn').disabled = true;
    } else {
        statusEl.innerHTML = '<span><i class="fas fa-book-open"></i> Изучите материал, чтобы получить карточку</span>';
        statusEl.className = 'battle-read-status';
        document.getElementById('markBattleReadText').textContent = 'Отметить как прочитанное';
        document.getElementById('markBattleReadBtn').disabled = false;
    }
    
    updateBattlesProgress();
}

function updateBattlesProgress() {
    const read = userData.battlesRead || [];
    const count = read.length;
    const total = Object.keys(BATTLE_CONTENT).length;
    document.getElementById('battlesReadCount').textContent = count;
    document.getElementById('battlesProgressFill').style.width = (count / total * 100) + '%';
}

document.querySelectorAll('.battle-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.battle-tab').forEach(t => {
            t.style.background = '#F2F2F7';
            t.style.color = '#1C1C1E';
        });
        tab.classList.add('active');
        
        currentBattle = tab.dataset.battle;
        renderBattleContent(currentBattle);
    });
});

document.getElementById('markBattleReadBtn')?.addEventListener('click', () => {
    if (!isCampaignBattleUnlocked(currentBattle)) { showNotification('Сначала пройдите этот этап в разделе «Армия».'); return; }
    if (!userData.battlesRead) userData.battlesRead = [];
    if (!userData.battlesRead.includes(currentBattle)) {
        userData.battlesRead.push(currentBattle);
        
        // Выдача карточки
        // Карточка выдаётся при прохождении этапа армии; здесь фиксируется именно прочтение истории.
        if (typeof unlockCardIfNotHave === 'function' && !getArmyCampaignState().completed?.includes(currentBattle)) unlockCardIfNotHave(`battle_${currentBattle}`);
        
        addXP(150);
        if (typeof window.awardStars === 'function') window.awardStars(3, 'Изучение исторического события', 'battle:'+currentBattle);
        showNotification(`⚔️ Битва «${BATTLE_CONTENT[currentBattle].name}» прочитана! +150 XP`);
        showFirework(`⚔️ ${BATTLE_CONTENT[currentBattle].name}!`);
        
        saveUserData();
        renderBattleContent(currentBattle);
        checkAllAchievements();
    }
});

// Инициализация
setTimeout(() => {
    if (!userData.battlesRead) userData.battlesRead = [];
    refreshBattleTabs();
    const firstUnlocked = (window.ISLAMIC_BATTLES||[]).map(b=>b.id.replace(/^battle_/, '')).find(isCampaignBattleUnlocked);
    currentBattle = firstUnlocked || 'badr';
    renderBattleContent(currentBattle);
    updateBattlesProgress();
}, 300);
