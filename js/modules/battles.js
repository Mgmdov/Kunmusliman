// Переключение вкладок истории Пророка
document.querySelectorAll('[data-prophet-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('[data-prophet-tab]').forEach(t => {
            t.style.background = '#F2F2F7';
            t.style.color = '#1C1C1E';
        });
        tab.style.background = '#007AFF';
        tab.style.color = 'white';
        
        const tabName = tab.dataset.prophetTab;
        document.querySelectorAll('.prophet-story-section').forEach(section => section.style.display = 'none');
        if (tabName === 'early') document.getElementById('prophetEarly').style.display = 'block';
        else if (tabName === 'revelation') document.getElementById('prophetRevelation').style.display = 'block';
        else if (tabName === 'mecca') document.getElementById('prophetMecca').style.display = 'block';
        else if (tabName === 'medina') document.getElementById('prophetMedina').style.display = 'block';
        else if (tabName === 'farewell') document.getElementById('prophetFarewell').style.display = 'block';
    });
});

// Отметка о прочтении истории Пророка
document.getElementById('markProphetStoryRead')?.addEventListener('click', () => {
    unlockCardIfNotHave('prophet_story');
    addXP(200);
    showNotification('📖 История Пророка ﷺ прочитана! +200 XP');
    showFirework('ﷺ МУХАММАД ﷺ');
    document.getElementById('markProphetStoryRead').disabled = true;
    document.getElementById('markProphetStoryRead').innerHTML = '<i class="fas fa-check"></i> Прочитано';
    saveUserData();
});

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

function renderBattleContent(battleId) {
    const battle = BATTLE_CONTENT[battleId];
    if (!battle) return;
    
    const container = document.getElementById('battleContentContainer');
    const isRead = (userData.battlesRead || []).includes(battleId);
    
    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <span style="font-size: 2.5rem;">${battle.emoji}</span>
            <div>
                <h3 style="color: #1C1C1E;">${battle.name}</h3>
                <p style="color: #8E8E93;">${battle.year}</p>
            </div>
        </div>
        <p style="line-height: 1.8; margin-bottom: 16px;">${battle.story}</p>
        <div style="background: #FFFFFF; border-radius: 12px; padding: 12px; margin-bottom: 8px;">
            <strong>Результат:</strong> ${battle.result}
        </div>
        <div style="background: #FFF9E6; border-radius: 12px; padding: 12px; font-style: italic; border-left: 4px solid #FFD700;">
            📖 ${battle.ayah}
        </div>
    `;
    
    const statusEl = document.getElementById('battleReadStatus');
    if (isRead) {
        statusEl.innerHTML = '<span style="color: #34C759;"><i class="fas fa-check-circle"></i> Вы уже прочитали эту битву</span>';
        statusEl.style.background = '#E8F5E9';
        document.getElementById('markBattleReadText').textContent = 'Уже прочитано';
        document.getElementById('markBattleReadBtn').disabled = true;
    } else {
        statusEl.innerHTML = '<span style="color: #8E8E93;"><i class="fas fa-book"></i> Прочитайте, чтобы получить карточку</span>';
        statusEl.style.background = '#F2F2F7';
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
        tab.style.background = '#007AFF';
        tab.style.color = 'white';
        
        currentBattle = tab.dataset.battle;
        renderBattleContent(currentBattle);
    });
});

document.getElementById('markBattleReadBtn')?.addEventListener('click', () => {
    if (!userData.battlesRead) userData.battlesRead = [];
    if (!userData.battlesRead.includes(currentBattle)) {
        userData.battlesRead.push(currentBattle);
        
        // Выдача карточки
        unlockCardIfNotHave(`battle_${currentBattle}`);
        
        addXP(150);
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
    renderBattleContent('badr');
    updateBattlesProgress();
}, 300);
