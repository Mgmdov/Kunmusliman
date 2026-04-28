// ========== БАЗОВЫЕ ДОСТИЖЕНИЯ (ВСЕ ТВОИ + НОВЫЕ) ==========
const BASE_ACHIEVEMENTS = [
    // ===== ТВОИ СУЩЕСТВУЮЩИЕ =====
    { id: 'firstPage', category: 'khatm', title: '📖 Первая страница', desc: 'Прочитать 1 страницу', icon: '📖', xp: 50, check: () => (userData.khatm?.readPages || 0) >= 1, current: () => Math.min(userData.khatm?.readPages || 0, 1), target: 1 },
    { id: 'juz1', category: 'khatm', title: '📚 Первый джуз', desc: 'Прочитать 20 страниц', icon: '📚', xp: 100, check: () => (userData.khatm?.readPages || 0) >= 20, current: () => Math.min(userData.khatm?.readPages || 0, 20), target: 20 },
    { id: 'halfQuran', category: 'khatm', title: '🌓 Половина Корана', desc: 'Прочитать 302 страницы', icon: '🌓', xp: 300, check: () => (userData.khatm?.readPages || 0) >= 302, current: () => Math.min(userData.khatm?.readPages || 0, 302), target: 302 },
    { id: 'khatm1', category: 'khatm', title: '🕋 Первый Хатм', desc: 'Завершить Коран 1 раз', icon: '🕋', xp: 500, check: () => (userData.khatm?.completedKhatms || 0) >= 1, current: () => Math.min(userData.khatm?.completedKhatms || 0, 1), target: 1 },
    { id: 'khatm5', category: 'khatm', title: '📖 5 Хатмов', desc: 'Завершить 5 раз', icon: '📖', xp: 1000, check: () => (userData.khatm?.completedKhatms || 0) >= 5, current: () => Math.min(userData.khatm?.completedKhatms || 0, 5), target: 5 },
    { id: 'khatm10', category: 'khatm', title: '🌟 10 Хатмов', desc: 'Завершить 10 раз', icon: '🌟', xp: 2000, check: () => (userData.khatm?.completedKhatms || 0) >= 10, current: () => Math.min(userData.khatm?.completedKhatms || 0, 10), target: 10 },
    { id: 'zikr100', category: 'zikr', title: '📿 100 зикров', desc: 'Совершить 100 зикров', icon: '📿', xp: 50, check: () => (userData.totalZikrOverall || 0) >= 100, current: () => Math.min(userData.totalZikrOverall || 0, 100), target: 100 },
    { id: 'zikr1000', category: 'zikr', title: '🌟 1 000 зикров', desc: 'Совершить 1 000 зикров', icon: '🌟', xp: 150, check: () => (userData.totalZikrOverall || 0) >= 1000, current: () => Math.min(userData.totalZikrOverall || 0, 1000), target: 1000 },
    { id: 'zikr10000', category: 'zikr', title: '⚡ 10 000 зикров', desc: 'Совершить 10 000 зикров', icon: '⚡', xp: 500, check: () => (userData.totalZikrOverall || 0) >= 10000, current: () => Math.min(userData.totalZikrOverall || 0, 10000), target: 10000 },
    { id: 'zikr50000', category: 'zikr', title: '💫 50 000 зикров', desc: 'Совершить 50 000 зикров', icon: '💫', xp: 1000, check: () => (userData.totalZikrOverall || 0) >= 50000, current: () => Math.min(userData.totalZikrOverall || 0, 50000), target: 50000 },
    { id: 'zikr100000', category: 'zikr', title: '👑 100 000 зикров', desc: 'Совершить 100 000 зикров', icon: '👑', xp: 2500, check: () => (userData.totalZikrOverall || 0) >= 100000, current: () => Math.min(userData.totalZikrOverall || 0, 100000), target: 100000 },
    { id: 'salawat100', category: 'salawat', title: '🌹 100 салаватов', desc: 'Прочитать 100 салаватов', icon: '🌹', xp: 150, check: () => (userData.totalSalawat || 0) >= 100, current: () => Math.min(userData.totalSalawat || 0, 100), target: 100 },
    { id: 'salawat1000', category: 'salawat', title: '💐 1 000 салаватов', desc: 'Прочитать 1 000 салаватов', icon: '💐', xp: 500, check: () => (userData.totalSalawat || 0) >= 1000, current: () => Math.min(userData.totalSalawat || 0, 1000), target: 1000 },
    { id: 'names10', category: 'names', title: '📜 10 Имён', desc: 'Выучить 10 Имён', icon: '📜', xp: 100, check: () => (userData.namesLearned?.length || 0) >= 10, current: () => Math.min(userData.namesLearned?.length || 0, 10), target: 10 },
    { id: 'names50', category: 'names', title: '🏅 50 Имён', desc: 'Выучить 50 Имён', icon: '🏅', xp: 500, check: () => (userData.namesLearned?.length || 0) >= 50, current: () => Math.min(userData.namesLearned?.length || 0, 50), target: 50 },
    { id: 'names99', category: 'names', title: '👑 99 Имён', desc: 'Выучить все 99 Имён', icon: '👑', xp: 1000, check: () => (userData.namesLearned?.length || 0) >= 99, current: () => Math.min(userData.namesLearned?.length || 0, 99), target: 99 },
    { id: 'streak7', category: 'tauba', title: '🔥 7 дней', desc: 'Вести дневник 7 дней', icon: '🔥', xp: 150, check: () => getStreak() >= 7, current: () => Math.min(getStreak(), 7), target: 7 },
    { id: 'streak30', category: 'tauba', title: '🌙 30 дней', desc: 'Вести дневник 30 дней', icon: '🌙', xp: 500, check: () => getStreak() >= 30, current: () => Math.min(getStreak(), 30), target: 30 },
    { id: 'stars50', category: 'stars', title: '🌟 50 звёзд', desc: 'Накопить 50 звёзд', icon: '🌟', xp: 300, check: () => (userData.stars?.totalStars || 0) >= 50, current: () => Math.min(userData.stars?.totalStars || 0, 50), target: 50 },
    { id: 'stars100', category: 'stars', title: '💫 100 звёзд', desc: 'Накопить 100 звёзд', icon: '💫', xp: 500, check: () => (userData.stars?.totalStars || 0) >= 100, current: () => Math.min(userData.stars?.totalStars || 0, 100), target: 100 },
    { id: 'stars500', category: 'stars', title: '👑 500 звёзд', desc: 'Накопить 500 звёзд', icon: '👑', xp: 2000, check: () => (userData.stars?.totalStars || 0) >= 500, current: () => Math.min(userData.stars?.totalStars || 0, 500), target: 500 },
    { id: 'battle1', category: 'battles', title: '⚔️ Первая битва', desc: 'Прочитать 1 битву', icon: '⚔️', xp: 100, check: () => (userData.battlesRead?.length || 0) >= 1, current: () => Math.min(userData.battlesRead?.length || 0, 1), target: 1 },
    { id: 'battle3', category: 'battles', title: '🛡️ Историк', desc: 'Прочитать 3 битвы', icon: '🛡️', xp: 300, check: () => (userData.battlesRead?.length || 0) >= 3, current: () => Math.min(userData.battlesRead?.length || 0, 3), target: 3 },
    { id: 'battleAll', category: 'battles', title: '🏆 Полководец', desc: 'Прочитать все битвы', icon: '🏆', xp: 1000, check: () => (userData.battlesRead?.length || 0) >= BATTLE_DATA.length, current: () => Math.min(userData.battlesRead?.length || 0, BATTLE_DATA.length), target: BATTLE_DATA.length },

    // ===== НОВЫЕ ДОСТИЖЕНИЯ =====
    { id: 'zikr20000', category: 'zikr', title: '💫 20 000 зикров', desc: 'Совершить 20 000 зикров', icon: '💫', xp: 750, check: () => (userData.totalZikrOverall || 0) >= 20000, current: () => Math.min(userData.totalZikrOverall || 0, 20000), target: 20000 },
    { id: 'zikr500000', category: 'zikr', title: '🏆 500 000 зикров', desc: 'Совершить 500 000 зикров', icon: '🏆', xp: 5000, check: () => (userData.totalZikrOverall || 0) >= 500000, current: () => Math.min(userData.totalZikrOverall || 0, 500000), target: 500000 },
    { id: 'zikr1000000', category: 'zikr', title: '💎 1 000 000 зикров', desc: 'Совершить 1 000 000 зикров', icon: '💎', xp: 10000, check: () => (userData.totalZikrOverall || 0) >= 1000000, current: () => Math.min(userData.totalZikrOverall || 0, 1000000), target: 1000000 },
    { id: 'salawat10000', category: 'salawat', title: '🌹🌹 10 000 салаватов', desc: 'Прочитать 10 000 салаватов', icon: '🌹🌹', xp: 1000, check: () => (userData.totalSalawat || 0) >= 10000, current: () => Math.min(userData.totalSalawat || 0, 10000), target: 10000 },
    { id: 'salawat50000', category: 'salawat', title: '🌹🌹🌹 50 000 салаватов', desc: 'Прочитать 50 000 салаватов', icon: '🌹🌹🌹', xp: 2500, check: () => (userData.totalSalawat || 0) >= 50000, current: () => Math.min(userData.totalSalawat || 0, 50000), target: 50000 },
    { id: 'salawat100000', category: 'salawat', title: '🏆 100 000 салаватов', desc: 'Прочитать 100 000 салаватов', icon: '🏆', xp: 5000, check: () => (userData.totalSalawat || 0) >= 100000, current: () => Math.min(userData.totalSalawat || 0, 100000), target: 100000 },
    { id: 'khatm20', category: 'khatm', title: '📖📖 20 Хатмов', desc: 'Завершить 20 раз', icon: '📖📖', xp: 3000, check: () => (userData.khatm?.completedKhatms || 0) >= 20, current: () => Math.min(userData.khatm?.completedKhatms || 0, 20), target: 20 },
    { id: 'khatm50', category: 'khatm', title: '👑 50 Хатмов', desc: 'Завершить 50 раз', icon: '👑', xp: 5000, check: () => (userData.khatm?.completedKhatms || 0) >= 50, current: () => Math.min(userData.khatm?.completedKhatms || 0, 50), target: 50 },
    { id: 'khatm100', category: 'khatm', title: '🏆 100 Хатмов', desc: 'Завершить 100 раз', icon: '🏆', xp: 10000, check: () => (userData.khatm?.completedKhatms || 0) >= 100, current: () => Math.min(userData.khatm?.completedKhatms || 0, 100), target: 100 },
    { id: 'stars1000', category: 'stars', title: '⭐ 1000 звёзд', desc: 'Накопить 1000 звёзд', icon: '⭐', xp: 3000, check: () => (userData.stars?.totalStars || 0) >= 1000, current: () => Math.min(userData.stars?.totalStars || 0, 1000), target: 1000 },
    { id: 'stars2500', category: 'stars', title: '💫 2500 звёзд', desc: 'Накопить 2500 звёзд', icon: '💫', xp: 5000, check: () => (userData.stars?.totalStars || 0) >= 2500, current: () => Math.min(userData.stars?.totalStars || 0, 2500), target: 2500 },
    { id: 'stars5000', category: 'stars', title: '👑 5000 звёзд', desc: 'Накопить 5000 звёзд', icon: '👑', xp: 10000, check: () => (userData.stars?.totalStars || 0) >= 5000, current: () => Math.min(userData.stars?.totalStars || 0, 5000), target: 5000 },
    { id: 'streak100', category: 'tauba', title: '🔥 100 дней', desc: 'Вести дневник 100 дней', icon: '🔥', xp: 2000, check: () => getStreak() >= 100, current: () => Math.min(getStreak(), 100), target: 100 },
    { id: 'streak365', category: 'tauba', title: '🌙 365 дней', desc: 'Вести дневник 365 дней', icon: '🌙', xp: 10000, check: () => getStreak() >= 365, current: () => Math.min(getStreak(), 365), target: 365 },
    { id: 'morningAzkar100', category: 'azkar', title: '🌅 Жаворонок', desc: 'Прочитать утренние азкары 100 раз', icon: '🌅', xp: 1500, check: () => (userData.azkarChecks?.morningCount || 0) >= 100, current: () => Math.min(userData.azkarChecks?.morningCount || 0, 100), target: 100 },
    { id: 'eveningAzkar100', category: 'azkar', title: '🌙 Сова', desc: 'Прочитать вечерние азкары 100 раз', icon: '🦉', xp: 1500, check: () => (userData.azkarChecks?.eveningCount || 0) >= 100, current: () => Math.min(userData.azkarChecks?.eveningCount || 0, 100), target: 100 },
    { id: 'tasbih10000', category: 'tasbih', title: '📿 Чётки', desc: 'Нажать 10 000 раз в Тасбихе', icon: '📿', xp: 1000, check: () => (userData.tasbihTotal || 0) >= 10000, current: () => Math.min(userData.tasbihTotal || 0, 10000), target: 10000 },
    { id: 'tasbih50000', category: 'tasbih', title: '💯 Сотник', desc: 'Нажать 50 000 раз в Тасбихе', icon: '💯', xp: 2500, check: () => (userData.tasbihTotal || 0) >= 50000, current: () => Math.min(userData.tasbihTotal || 0, 50000), target: 50000 },
    { id: 'tasbih100000', category: 'tasbih', title: '🏆 Мастер тасбиха', desc: 'Нажать 100 000 раз в Тасбихе', icon: '🏆', xp: 5000, check: () => (userData.tasbihTotal || 0) >= 100000, current: () => Math.min(userData.tasbihTotal || 0, 100000), target: 100000 },
    { id: 'fasting30', category: 'fasting', title: '🤲 Постящийся', desc: 'Держать пост 30 дней', icon: '🤲', xp: 500, check: () => (userData.fasting?.total || 0) >= 30, current: () => Math.min(userData.fasting?.total || 0, 30), target: 30 },
    { id: 'ramadanComplete', category: 'fasting', title: '🌙 Рамадан', desc: 'Завершить Рамадан (30 дней)', icon: '🌙', xp: 2000, check: () => (Object.values(userData.ramadan?.days || {}).filter(v => v).length) >= 30, current: () => Math.min(Object.values(userData.ramadan?.days || {}).filter(v => v).length, 30), target: 30 },
    { id: 'juma10', category: 'juma', title: '🕌 Пятничный', desc: 'Получить 10 карт Джума', icon: '🕌', xp: 1000, check: () => (userData.jumaCards?.length || 0) >= 10, current: () => Math.min(userData.jumaCards?.length || 0, 10), target: 10 },
    { id: 'juma25', category: 'juma', title: '🕌🕌 25 карт Джума', desc: 'Получить 25 карт Джума', icon: '🕌🕌', xp: 2500, check: () => (userData.jumaCards?.length || 0) >= 25, current: () => Math.min(userData.jumaCards?.length || 0, 25), target: 25 },
    { id: 'pages1000', category: 'khatm', title: '📖 Чтец', desc: 'Прочитать 1000 страниц', icon: '📖', xp: 1500, check: () => (userData.khatm?.totalPagesRead || userData.khatm?.readPages || 0) >= 1000, current: () => Math.min(userData.khatm?.totalPagesRead || userData.khatm?.readPages || 0, 1000), target: 1000 },
    { id: 'pages5000', category: 'khatm', title: '📚 Библиотека', desc: 'Прочитать 5000 страниц', icon: '📚', xp: 3000, check: () => (userData.khatm?.totalPagesRead || userData.khatm?.readPages || 0) >= 5000, current: () => Math.min(userData.khatm?.totalPagesRead || userData.khatm?.readPages || 0, 5000), target: 5000 },
    { id: 'pages10000', category: 'khatm', title: '🎓 Учёный', desc: 'Прочитать 10000 страниц', icon: '🎓', xp: 5000, check: () => (userData.khatm?.totalPagesRead || userData.khatm?.readPages || 0) >= 10000, current: () => Math.min(userData.khatm?.totalPagesRead || userData.khatm?.readPages || 0, 10000), target: 10000 },
    { id: 'collection50', category: 'collection', title: '📜 Свиток', desc: 'Собрать 50 карточек', icon: '📜', xp: 1000, check: () => (userData.unlockedCards?.length || 0) >= 50, current: () => Math.min(userData.unlockedCards?.length || 0, 50), target: 50 },
    { id: 'collection100', category: 'collection', title: '🏛️ Музей', desc: 'Собрать 100 карточек', icon: '🏛️', xp: 2500, check: () => (userData.unlockedCards?.length || 0) >= 100, current: () => Math.min(userData.unlockedCards?.length || 0, 100), target: 100 },
    { id: 'collection200', category: 'collection', title: '🎴 Коллекционер', desc: 'Собрать 200 карточек', icon: '🎴', xp: 5000, check: () => (userData.unlockedCards?.length || 0) >= 200, current: () => Math.min(userData.unlockedCards?.length || 0, 200), target: 200 },
    { id: 'quiz10streak', category: 'quiz', title: '⚡ Молниеносный', desc: '10 правильных ответов подряд', icon: '⚡', xp: 1000, check: () => (userData.quizStreak || 0) >= 10, current: () => Math.min(userData.quizStreak || 0, 10), target: 10 },
    { id: 'quiz50streak', category: 'quiz', title: '🧠 Эрудит', desc: '50 правильных ответов подряд', icon: '🧠', xp: 3000, check: () => (userData.quizStreak || 0) >= 50, current: () => Math.min(userData.quizStreak || 0, 50), target: 50 },
    { id: 'quiz100streak', category: 'quiz', title: '🏆 Чемпион', desc: '100 правильных ответов подряд', icon: '🏆', xp: 5000, check: () => (userData.quizStreak || 0) >= 100, current: () => Math.min(userData.quizStreak || 0, 100), target: 100 },
    { id: 'level7', category: 'level', title: '🔥 Огненный', desc: 'Достичь 7-го уровня', icon: '🔥', xp: 500, check: () => (userData.level || 1) >= 7, current: () => Math.min(userData.level || 1, 7), target: 7 },
    { id: 'level15', category: 'level', title: '💫 Продвинутый', desc: 'Достичь 15-го уровня', icon: '💫', xp: 1500, check: () => (userData.level || 1) >= 15, current: () => Math.min(userData.level || 1, 15), target: 15 },
    { id: 'level25', category: 'level', title: '👑 Элита', desc: 'Достичь 25-го уровня', icon: '👑', xp: 3000, check: () => (userData.level || 1) >= 25, current: () => Math.min(userData.level || 1, 25), target: 25 },
    { id: 'level30', category: 'level', title: '💎 Легенда', desc: 'Достичь 30-го уровня', icon: '💎', xp: 5000, check: () => (userData.level || 1) >= 30, current: () => Math.min(userData.level || 1, 30), target: 30 },
    { id: 'perfectDay', category: 'tauba', title: '💯 Идеальный день', desc: 'Отметить все 9 целей за день', icon: '💯', xp: 500, check: () => (userData.tauba?.days || []).some(d => Object.values(d.goals || {}).filter(v => v).length >= 9), current: () => (userData.tauba?.days || []).some(d => Object.values(d.goals || {}).filter(v => v).length >= 9) ? 1 : 0, target: 1 },
    { id: 'perfectDays50', category: 'tauba', title: '🌟🌟 50 идеальных дней', desc: '50 дней со всеми целями', icon: '🌟🌟', xp: 5000, check: () => (userData.tauba?.days || []).filter(d => Object.values(d.goals || {}).filter(v => v).length >= 9).length >= 50, current: () => Math.min((userData.tauba?.days || []).filter(d => Object.values(d.goals || {}).filter(v => v).length >= 9).length, 50), target: 50 }
];

function generateSurahAchievements() {
    const arr = [];
    for (let i = 1; i <= 114; i++) arr.push({ id: `surah_${i}`, category: 'surah', title: SURA_NAMES_RU[i-1], desc: 'Прочитать суру', icon: i === 1 ? '🌟' : (i === 36 ? '💚' : '📖'), xp: 100, check: () => (userData.unlockedSurahs || []).includes(i), current: () => (userData.unlockedSurahs || []).includes(i) ? 1 : 0, target: 1 });
    return arr;
}

function generateProphetAchievements() {
    return PROPHETS_DATA.map(p => ({ id: `prophet_${p.id}`, category: 'prophet', title: p.name, desc: p.title, icon: '🕋', xp: 200, check: () => (userData.unlockedProphets || []).includes(p.id), current: () => (userData.unlockedProphets || []).includes(p.id) ? 1 : 0, target: 1 }));
}

const ALL_ACHIEVEMENTS_FULL = [...BASE_ACHIEVEMENTS, ...generateSurahAchievements(), ...generateProphetAchievements()];

// ========== ВЫДАЧА КАРТОЧЕК ЗА ДОСТИЖЕНИЯ ==========
const ACHIEVEMENT_CARDS = {
    // Зикры
    zikr20000: { id: 'ach_zikr20k', name: 'Зикр 20K', title: '20 000 зикров', emoji: '💫', type: 'achievement', rarity: 'epic', story: 'Вы совершили 20 000 зикров! Пусть Аллах примет ваше поклонение.' },
    zikr500000: { id: 'ach_zikr500k', name: 'Зикр 500K', title: '500 000 зикров', emoji: '🏆', type: 'achievement', rarity: 'legendary', story: 'Полмиллиона зикров! Вы на пути великих праведников.' },
    zikr1000000: { id: 'ach_zikr1m', name: 'Зикр 1M', title: '1 000 000 зикров', emoji: '💎', type: 'achievement', rarity: 'mythic', story: 'МИЛЛИОН ЗИКРОВ! Ваше сердце всегда поминает Аллаха. Вы достигли уровня избранных.' },
    // Салаваты
    salawat10000: { id: 'ach_sal10k', name: 'Салават 10K', title: '10 000 салаватов', emoji: '🌹', type: 'achievement', rarity: 'epic', story: 'Десять тысяч благословений Пророку ﷺ. Да будет он вашим заступником!' },
    salawat50000: { id: 'ach_sal50k', name: 'Салават 50K', title: '50 000 салаватов', emoji: '🌹🌹', type: 'achievement', rarity: 'legendary', story: 'Пятьдесят тысяч салаватов! Ваша любовь к Пророку ﷺ безгранична.' },
    salawat100000: { id: 'ach_sal100k', name: 'Салават 100K', title: '100 000 салаватов', emoji: '🏆', type: 'achievement', rarity: 'mythic', story: 'СТО ТЫСЯЧ САЛАВАТОВ! В Судный день вы будете рядом с Пророком ﷺ.' },
    // Хатмы
    khatm20: { id: 'ach_khatm20', name: 'Хатм 20', title: '20 хатмов', emoji: '📖', type: 'achievement', rarity: 'epic', story: 'Двадцать полных прочтений Корана! Ваше сердце наполнено Словом Аллаха.' },
    khatm50: { id: 'ach_khatm50', name: 'Хатм 50', title: '50 хатмов', emoji: '👑', type: 'achievement', rarity: 'legendary', story: 'Пятьдесят хатмов! Коран стал вашим постоянным спутником.' },
    khatm100: { id: 'ach_khatm100', name: 'Хатм 100', title: '100 хатмов', emoji: '🏆', type: 'achievement', rarity: 'mythic', story: 'СТО ХАТМОВ! Вы из числа тех, о ком говорят: «Они прочитали Коран и он возвысил их».' },
    // Звёзды
    stars1000: { id: 'ach_stars1k', name: 'Звёзды 1K', title: '1000 звёзд', emoji: '⭐', type: 'achievement', rarity: 'legendary', story: 'Тысяча звёзд! Ваше усердие сияет на небесах.' },
    stars2500: { id: 'ach_stars2_5k', name: 'Звёзды 2.5K', title: '2500 звёзд', emoji: '💫', type: 'achievement', rarity: 'legendary', story: 'Две с половиной тысячи звёзд! Вы — светоч для окружающих.' },
    stars5000: { id: 'ach_stars5k', name: 'Звёзды 5K', title: '5000 звёзд', emoji: '👑', type: 'achievement', rarity: 'mythic', story: 'ПЯТЬ ТЫСЯЧ ЗВЁЗД! Ваше имя записано среди усердных.' },
    // Серии
    streak100: { id: 'ach_streak100', name: 'Серия 100', title: '100 дней', emoji: '🔥', type: 'achievement', rarity: 'legendary', story: 'Сто дней непрерывного поклонения! Привычка стала поклонением.' },
    streak365: { id: 'ach_streak365', name: 'Серия 365', title: '365 дней', emoji: '🌙', type: 'achievement', rarity: 'mythic', story: 'ГОД НЕПРЕРЫВНОГО ПОКЛОНЕНИЯ! Вы достигли уровня постоянства (истикама).' },
    // Азкары
    morningAzkar100: { id: 'ach_morning100', name: 'Жаворонок', title: '100 утренних азкаров', emoji: '🌅', type: 'achievement', rarity: 'rare', story: 'Сто раз вы встретили рассвет с поминанием Аллаха. Ваш день всегда под защитой.' },
    eveningAzkar100: { id: 'ach_evening100', name: 'Сова', title: '100 вечерних азкаров', emoji: '🦉', type: 'achievement', rarity: 'rare', story: 'Сто раз вы проводили закат с поминанием Аллаха. Ваша ночь под Его охраной.' },
    // Тасбих
    tasbih10000: { id: 'ach_tasbih10k', name: 'Чётки', title: '10 000 нажатий', emoji: '📿', type: 'achievement', rarity: 'epic', story: 'Десять тысяч нажатий тасбиха! Ваши пальцы привыкли поминать Аллаха.' },
    tasbih50000: { id: 'ach_tasbih50k', name: 'Сотник', title: '50 000 нажатий', emoji: '💯', type: 'achievement', rarity: 'legendary', story: 'Пятьдесят тысяч тасбихов! Вы — настоящий подвижник.' },
    tasbih100000: { id: 'ach_tasbih100k', name: 'Мастер тасбиха', title: '100 000 нажатий', emoji: '🏆', type: 'achievement', rarity: 'mythic', story: 'СТО ТЫСЯЧ ТАСБИХОВ! Ваши чётки — свидетели вашего усердия.' },
    // Пост
    fasting30: { id: 'ach_fast30', name: 'Постящийся', title: '30 дней поста', emoji: '🤲', type: 'achievement', rarity: 'rare', story: 'Месяц поста! Да примет Аллах ваше поклонение.' },
    ramadanComplete: { id: 'ach_ramadan', name: 'Рамадан', title: 'Завершённый Рамадан', emoji: '🌙', type: 'achievement', rarity: 'legendary', story: 'Вы завершили Рамадан! Да будет он искуплением ваших грехов.' },
    // Джума
    juma10: { id: 'ach_juma10', name: 'Пятничный', title: '10 карт Джума', emoji: '🕌', type: 'achievement', rarity: 'epic', story: 'Десять благословенных пятниц! Каждая — как праздник.' },
    juma25: { id: 'ach_juma25', name: '25 карт Джума', title: '25 карт Джума', emoji: '🕌🕌', type: 'achievement', rarity: 'legendary', story: 'Двадцать пять пятничных карт! Вы не пропускаете лучший день недели.' },
    // Страницы
    pages1000: { id: 'ach_pages1k', name: 'Чтец', title: '1000 страниц', emoji: '📖', type: 'achievement', rarity: 'epic', story: 'Тысяча страниц Корана! Ваши глаза привыкли к Слову Аллаха.' },
    pages5000: { id: 'ach_pages5k', name: 'Библиотека', title: '5000 страниц', emoji: '📚', type: 'achievement', rarity: 'legendary', story: 'Пять тысяч страниц! Вы прочитали Коран несколько раз.' },
    pages10000: { id: 'ach_pages10k', name: 'Учёный', title: '10000 страниц', emoji: '🎓', type: 'achievement', rarity: 'mythic', story: 'ДЕСЯТЬ ТЫСЯЧ СТРАНИЦ! Вы — хранитель Корана в своём сердце.' },
    // Коллекция
    collection50: { id: 'ach_coll50', name: 'Свиток', title: '50 карточек', emoji: '📜', type: 'achievement', rarity: 'epic', story: 'Пятьдесят карточек в коллекции! Вы начали собирать наследие.' },
    collection100: { id: 'ach_coll100', name: 'Музей', title: '100 карточек', emoji: '🏛️', type: 'achievement', rarity: 'legendary', story: 'Сто карточек! Ваша коллекция достойна музея.' },
    collection200: { id: 'ach_coll200', name: 'Коллекционер', title: '200 карточек', emoji: '🎴', type: 'achievement', rarity: 'mythic', story: 'ДВЕСТИ КАРТОЧЕК! Вы — легендарный коллекционер исламского наследия.' },
    // Викторина
    quiz10streak: { id: 'ach_quiz10', name: 'Молниеносный', title: '10 побед подряд', emoji: '⚡', type: 'achievement', rarity: 'epic', story: 'Десять правильных ответов подряд! Ваш ум быстр как молния.' },
    quiz50streak: { id: 'ach_quiz50', name: 'Эрудит', title: '50 побед подряд', emoji: '🧠', type: 'achievement', rarity: 'legendary', story: 'Пятьдесят побед подряд! Ваши знания впечатляют.' },
    quiz100streak: { id: 'ach_quiz100', name: 'Чемпион', title: '100 побед подряд', emoji: '🏆', type: 'achievement', rarity: 'mythic', story: 'СТО ПОБЕД ПОДРЯД! Вы — непревзойдённый чемпион викторины.' },
    // Уровни
    level7: { id: 'ach_level7', name: 'Огненный', title: '7-й уровень', emoji: '🔥', type: 'achievement', rarity: 'rare', story: 'Вы достигли 7-го уровня! Ваше усердие заметно.' },
    level15: { id: 'ach_level15', name: 'Продвинутый', title: '15-й уровень', emoji: '💫', type: 'achievement', rarity: 'epic', story: 'Пятнадцатый уровень! Вы уже многое умеете.' },
    level25: { id: 'ach_level25', name: 'Элита', title: '25-й уровень', emoji: '👑', type: 'achievement', rarity: 'legendary', story: 'Двадцать пятый уровень! Вы в элите.' },
    level30: { id: 'ach_level30', name: 'Легенда', title: '30-й уровень', emoji: '💎', type: 'achievement', rarity: 'mythic', story: 'ТРИДЦАТЫЙ УРОВЕНЬ! Вы — живая легенда.' },
    // Идеальные дни
    perfectDay: { id: 'ach_perfect1', name: 'Идеальный день', title: 'Все 9 целей', emoji: '💯', type: 'achievement', rarity: 'rare', story: 'Вы выполнили все цели за день! Это образцовый день мусульманина.' },
    perfectDays50: { id: 'ach_perfect50', name: '50 идеальных дней', title: '50 дней со всеми целями', emoji: '🌟🌟', type: 'achievement', rarity: 'legendary', story: 'Пятьдесят идеальных дней! Вы — пример для подражания.' }
};

// Добавляем карточки в общий список
Object.values(ACHIEVEMENT_CARDS).forEach(card => {
    if (!ALL_CARDS.find(c => c.id === card.id)) {
        ALL_CARDS.push(card);
    }
});

function renderAchievements() {
    const c = document.getElementById('achievementsList'); if (!c) return;
    const filter = document.getElementById('achievementFilter')?.value || 'all';
    const unlocked = userData.achievements || [];
    const filtered = ALL_ACHIEVEMENTS_FULL.filter(a => filter === 'all' || a.category === filter);
    let h = '';
    filtered.forEach(ach => {
        const isUnlocked = unlocked.includes(ach.id);
        const current = ach.current(), target = ach.target, progress = Math.min(100, (current / target) * 100);
        h += `<div style="background: ${isUnlocked ? '#FFF9E6' : '#F2F2F7'}; border-radius: 16px; padding: 14px; text-align: center; cursor: pointer; border: 1px solid ${isUnlocked ? '#FFD700' : '#E5E5EA'};" onclick="showAchievementStory('${ach.id}')">
            <div style="font-size: 2rem;">${ach.icon}</div><div style="font-weight: 600; margin: 8px 0;">${ach.title}</div><div style="font-size: 0.65rem; color: #8E8E93;">${ach.desc}</div>
            ${!isUnlocked ? `<div style="margin-top: 8px;"><div style="background: #E5E5EA; border-radius: 100px; height: 4px;"><div style="background: #007AFF; width: ${progress}%; height: 100%; border-radius: 100px;"></div></div><div style="font-size: 0.6rem; margin-top: 4px;">${current}/${target}</div></div>` : `<div style="margin-top: 8px; color: #FFD700;">✅ +${ach.xp} XP</div>`}
        </div>`;
    });
    c.innerHTML = h || '<div style="text-align:center;padding:40px;color:#8E8E93;grid-column:1/-1;">Нет достижений</div>';
    updateAchievementsBadge();
}

function updateAchievementsBadge() { const unlocked = userData.achievements?.length || 0; const badge = document.getElementById('achievementsBadge'); if (badge) badge.textContent = unlocked; }

function showAchievementStory(id) {
    const ach = ALL_ACHIEVEMENTS_FULL.find(a => a.id === id); if (!ach) return;
    const isUnlocked = (userData.achievements || []).includes(id);
    document.getElementById('storyIcon').innerHTML = ach.icon; document.getElementById('storyTitle').textContent = ach.title;
    document.getElementById('storyText').innerHTML = isUnlocked ? `<p><strong>${ach.desc}</strong></p><p style="margin-top:15px;">✅ Открыто! +${ach.xp} XP</p>` : `<p>${ach.desc}</p><p style="margin-top:15px;color:#8E8E93;">Прогресс: ${ach.current()} / ${ach.target}</p>`;
    document.getElementById('storyModal').style.display = 'flex';
}

function checkAllAchievements() {
    const unlocked = userData.achievements || []; let changed = false;
    ALL_ACHIEVEMENTS_FULL.forEach(a => { 
        if (!unlocked.includes(a.id) && a.check()) { 
            userData.achievements.push(a.id); 
            if (a.xp > 0) addXP(a.xp); 
            showFirework(`🏆 ${a.title}!`); 
            showNotification(`🏆 ${a.title}! +${a.xp} XP`);
            
            // Выдача карточки за достижение
            if (ACHIEVEMENT_CARDS[a.id]) {
                unlockCardIfNotHave(ACHIEVEMENT_CARDS[a.id].id);
                showNotification(`🎴 Карточка «${ACHIEVEMENT_CARDS[a.id].name}» добавлена в коллекцию!`);
            }
            
            changed = true; 
        } 
    });
    if (changed) { 
        saveUserData(); 
        renderAchievements(); 
        updateAchievementsBadge(); 
        if (typeof renderCollection === 'function') renderCollection();
    }
}

const RANKS_FULL = [
    { stars: 1, title: '🌟 Новичок', starsIcon: '⭐', sahabi: 'Абу Бакр ас-Сиддик' }, { stars: 10, title: '🌟🌟 Усердный', starsIcon: '⭐⭐', sahabi: 'Умар ибн аль-Хаттаб' },
    { stars: 25, title: '🌟🌟🌟 Настойчивый', starsIcon: '⭐⭐⭐', sahabi: 'Усман ибн Аффан' }, { stars: 50, title: '🏅 Преданный', starsIcon: '🏅', sahabi: 'Али ибн Абу Талиб' },
    { stars: 100, title: '🏅🏅 Постоянный', starsIcon: '🏅🏅', sahabi: 'Абдуррахман ибн Ауф' }, { stars: 200, title: '⭐⭐ Платиновый', starsIcon: '⭐⭐', sahabi: 'Абу Убайда' },
    { stars: 300, title: '👑 Бриллиантовый', starsIcon: '👑', sahabi: 'Халид ибн Валид' }, { stars: 500, title: '👑👑 Легендарный', starsIcon: '👑👑', sahabi: 'Билял ибн Рабах' },
    { stars: 1000, title: '🕋 Аль-Фарук', starsIcon: '🕋', sahabi: 'Десять обещанных Рая' }
];

function updateStarsUI() {
    const stars = userData.stars || { totalStars: 0 }; const total = stars.totalStars || 0;
    document.getElementById('starCountDisplay').innerHTML = `⭐ ${total}`;
    let cur = RANKS_FULL[0], next = null;
    for (let i = 0; i < RANKS_FULL.length; i++) { if (total >= RANKS_FULL[i].stars) { cur = RANKS_FULL[i]; next = RANKS_FULL[i+1] || null; } }
    document.getElementById('rankTitle').textContent = cur.title; document.getElementById('rankStars').textContent = cur.starsIcon; document.getElementById('rankDesc').innerHTML = `📖 ${cur.sahabi}`;
    const pc = document.getElementById('rankProgressContainer');
    if (next) pc.innerHTML = `<div style="background:#3A3A3C;border-radius:100px;height:6px;margin-bottom:8px;"><div style="width:${Math.min(100,(total/next.stars)*100)}%;background:#FFD700;height:100%;border-radius:100px;"></div></div><div style="display:flex;justify-content:space-between;font-size:0.7rem;"><span>⭐ ${total}</span><span>До «${next.title}»: ${next.stars-total} ⭐</span></div>`;
    else pc.innerHTML = '<div style="text-align:center;color:#FFD700;padding:10px;"><i class="fas fa-crown"></i> Максимальный ранг!</div>';
}

function checkDailyTasks() {
    const today = new Date().toISOString().split('T')[0];
    const m = Object.values(userData.azkarChecks?.morning || {}).some(v => v), e = Object.values(userData.azkarChecks?.evening || {}).some(v => v);
    const q = (userData.khatm?.readPages || 0) > 0, z = (userData.totalZikrOverall || 0) >= 100, t = (userData.tauba?.days || []).some(d => d.date === today);
    const g = document.getElementById('dailyTasksGrid');
    if (g) g.innerHTML = `<div style="background:${m?'#E8F5E9':'#F2F2F7'};padding:12px;border-radius:12px;display:flex;justify-content:space-between;"><span>🌅 Утренние азкары</span><span>${m?'✅':'⏳'}</span></div><div style="background:${e?'#E8F5E9':'#F2F2F7'};padding:12px;border-radius:12px;display:flex;justify-content:space-between;"><span>🌙 Вечерние азкары</span><span>${e?'✅':'⏳'}</span></div><div style="background:${q?'#E8F5E9':'#F2F2F7'};padding:12px;border-radius:12px;display:flex;justify-content:space-between;"><span>📖 1+ страница</span><span>${q?'✅':'⏳'}</span></div><div style="background:${z?'#E8F5E9':'#F2F2F7'};padding:12px;border-radius:12px;display:flex;justify-content:space-between;"><span>🔢 100+ зикров</span><span>${z?'✅':'⏳'}</span></div><div style="background:${t?'#E8F5E9':'#F2F2F7'};padding:12px;border-radius:12px;display:flex;justify-content:space-between;"><span>📝 Сохранён день</span><span>${t?'✅':'⏳'}</span></div>`;
}

function updateStreakBadges() {
    const streak = getStreak();
    document.getElementById('badge7').style.opacity = streak >= 7 ? 1 : 0.5;
    document.getElementById('badge30').style.opacity = streak >= 30 ? 1 : 0.5;
    document.getElementById('badge100').style.opacity = streak >= 100 ? 1 : 0.5;
    document.getElementById('badge365').style.opacity = streak >= 365 ? 1 : 0.5;
}

document.getElementById('achievementFilter')?.addEventListener('change', renderAchievements);
document.getElementById('showGoldCardsBtn')?.addEventListener('click', () => { openModule('collection'); setTimeout(() => document.querySelector('[data-collection="rare"]')?.click(), 100); });

setInterval(() => { checkAllAchievements(); checkDailyTasks(); updateStreakBadges(); }, 5000);
setTimeout(() => { updateStarsUI(); checkDailyTasks(); renderAchievements(); updateStreakBadges(); }, 500);
