// ========== 15 ПАСХАЛОК — СЕКРЕТНЫЕ КАРТОЧКИ ==========
// Получаются за скрытые достижения, не за сундук

window.EASTER_EGG_CARDS = [
  { id: 'ee_midnight',    arabic: 'مُنَاجَاة',      name: 'Мунаджат',        title: 'Ночное обращение',       rarity: 'legendary', story: 'Ты зашёл в полночь — время, когда Аллах нисходит к ближнему небу. «Кто встанет ночью?» — спрашивает Он.', condition: 'login_midnight' },
  { id: 'ee_fajr',        arabic: 'فَجْر',          name: 'Фаджр',           title: 'Рассвет',                rarity: 'legendary', story: 'Ты зашёл на рассвете — между 4:00 и 5:30. Именно в это время ангелы свидетельствуют.', condition: 'login_fajr' },
  { id: 'ee_friday13',    arabic: 'يَوْم مُبَارَك', name: 'День благодати',  title: 'Пятница 13-го',          rarity: 'epic', story: 'Пятница 13-го в Исламе — не суеверие, а благословенный день. Ты зашёл в этот уникальный день.', condition: 'friday_13' },
  { id: 'ee_ramadan',     arabic: 'رَمَضَان',       name: 'Рамадан',         title: 'Священный месяц',        rarity: 'mythic', story: 'Ты открыл приложение в месяц Рамадан — месяц милости, прощения и освобождения от Огня.', condition: 'ramadan_login' },
  { id: 'ee_streak7',     arabic: 'مُوَاظَبَة',     name: 'Мувазаба',        title: 'Постоянство',            rarity: 'rare', story: 'Неделя без перерыва! Постоянство — любимое деяние перед Аллахом, пусть даже малое.', condition: 'streak_7' },
  { id: 'ee_streak30',    arabic: 'اِسْتِقَامَة',   name: 'Истикама',        title: 'Стойкость',              rarity: 'legendary', story: '30 дней подряд! «Скажи: Господь мой — Аллах, а затем будь стоек» (41:30).', condition: 'streak_30' },
  { id: 'ee_1000zikr',    arabic: 'ذَاكِر',         name: 'Закир',           title: 'Поминающий',             rarity: 'epic', story: '1000 зикров! Ты из тех, «кто поминает Аллаха часто» (33:35).', condition: 'zikr_1000' },
  { id: 'ee_quiz20',      arabic: 'عَالِم',          name: 'Алим',            title: 'Знающий',                rarity: 'epic', story: '20 правильных ответов подряд! Знание — свет, освещающий путь.', condition: 'quiz_streak_20' },
  { id: 'ee_allnames',    arabic: 'حَافِظ',          name: 'Хафиз',           title: 'Хранитель имён',         rarity: 'mythic', story: 'Все 99 Прекрасных Имён Аллаха выучены! «Кто выучит их — войдёт в Рай» (хадис).', condition: 'all_99_names' },
  { id: 'ee_quran114',    arabic: 'خَاتِم',          name: 'Хатим',           title: 'Завершивший',            rarity: 'mythic', story: 'Хатм Корана завершён! 114 сур, от Аль-Фатихи до Ан-Нас.', condition: 'khatm_complete' },
  { id: 'ee_100days',     arabic: 'مُجَاهِد',       name: 'Муджахид',        title: '100 дней',               rarity: 'legendary', story: '100 дней с приложением. Усердие на пути Аллаха — величайший джихад.', condition: 'streak_100' },
  { id: 'ee_newyear',     arabic: 'هِجْرَة',        name: 'Хиджра',          title: 'Исламский новый год',    rarity: 'epic', story: 'Ты зашёл в 1-й Мухаррам — начало нового исламского года. Хиджра Пророка ﷺ — начало эры.', condition: 'muharram_1' },
  { id: 'ee_collector',   arabic: 'جَامِع',          name: 'Джами',           title: 'Собиратель',             rarity: 'legendary', story: 'Все 50 карт из сундука собраны! Ты — истинный коллекционер.', condition: 'all_chest_cards' },
  { id: 'ee_firstday',    arabic: 'بِدَايَة',       name: 'Бидая',           title: 'Начало пути',            rarity: 'rare', story: 'Первый день в приложении. Каждое путешествие начинается с первого шага. Пусть Аллах благословит твой путь.', condition: 'first_day' },
  { id: 'ee_tasbih1000',  arabic: 'سَبِّح',          name: 'Саббих',          title: 'Славь!',                 rarity: 'epic', story: '1000 тасбихов! «Субхана Ллах» — 1000 раз. Деревья Рая растут от твоих слов.', condition: 'tasbih_1000' }
];

// Проверка условий пасхалок
window.checkEasterEggs = function() {
  if (!window.userData) return;
  if (!window.userData.easterEggs) window.userData.easterEggs = {};

  var now = new Date();
  var hour = now.getHours();
  var day = now.getDay(); // 0=вс, 5=пт
  var date = now.getDate();
  var month = now.getMonth(); // 0-based

  window.EASTER_EGG_CARDS.forEach(function(egg) {
    if (window.userData.easterEggs[egg.id]) return; // уже получена

    var unlocked = false;

    switch (egg.condition) {
      case 'login_midnight':
        unlocked = (hour === 0);
        break;
      case 'login_fajr':
        unlocked = (hour >= 4 && hour < 6);
        break;
      case 'friday_13':
        unlocked = (day === 5 && date === 13);
        break;
      case 'ramadan_login':
        // Примерно: Рамадан 2026 — февраль-март (каждый год сдвигается)
        // Упрощённая проверка
        unlocked = false; // Будет активировано вручную или через API
        break;
      case 'streak_7':
        unlocked = (window.userData.streakData && window.userData.streakData.streak >= 7);
        break;
      case 'streak_30':
        unlocked = (window.userData.streakData && window.userData.streakData.streak >= 30);
        break;
      case 'streak_100':
        unlocked = (window.userData.streakData && window.userData.streakData.streak >= 100);
        break;
      case 'zikr_1000': {
        var counters = window.userData.zikrCounters || {};
        var total = 0;
        for (var k in counters) total += parseInt(counters[k] || 0);
        unlocked = (total >= 1000);
        break;
      }
      case 'quiz_streak_20':
        unlocked = (window.userData.quizStreak >= 20);
        break;
      case 'all_99_names':
        unlocked = (window.userData.namesLearned >= 99);
        break;
      case 'khatm_complete':
        unlocked = (window.userData.khatmCompleted > 0);
        break;
      case 'muharram_1':
        // Примерно: 1 Мухаррам 1448 = ~18 июня 2026
        unlocked = (month === 5 && date >= 17 && date <= 19);
        break;
      case 'all_chest_cards':
        var userChest = window.getUserChestCards ? window.getUserChestCards() : {};
        unlocked = (Object.keys(userChest).length >= 50);
        break;
      case 'first_day':
        unlocked = true; // всегда разблокирована с первого дня
        break;
      case 'tasbih_1000':
        unlocked = (parseInt(localStorage.getItem('tasbih_count') || '0') >= 1000);
        break;
    }

    if (unlocked) {
      window.userData.easterEggs[egg.id] = Date.now();
      if (typeof window.saveData === 'function') window.saveData();
      showEasterEggPopup(egg);
    }
  });
};

function showEasterEggPopup(egg) {
  var rarityColor = {
    rare: '#5a8acf', epic: '#a878d8', legendary: '#88dcff', mythic: '#c060ff'
  };
  var color = rarityColor[egg.rarity] || '#f4d03f';

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.3s;';
  overlay.innerHTML =
    '<div style="background:linear-gradient(180deg,#1a1020,#0a0410);border:2px solid ' + color + ';border-radius:20px;padding:28px 24px;max-width:320px;text-align:center;box-shadow:0 0 40px ' + color + '40;">' +
      '<div style="font-size:12px;letter-spacing:3px;color:' + color + ';margin-bottom:12px;">СЕКРЕТНАЯ КАРТА</div>' +
      '<div style="font-family:Amiri,serif;font-size:42px;color:#fff;direction:rtl;text-shadow:0 0 16px ' + color + ';margin-bottom:8px;">' + egg.arabic + '</div>' +
      '<div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:4px;">' + egg.name + '</div>' +
      '<div style="font-size:13px;color:' + color + ';margin-bottom:16px;">' + egg.title + '</div>' +
      '<div style="font-size:13px;color:rgba(255,255,255,.8);line-height:1.6;margin-bottom:24px;">' + egg.story + '</div>' +
      '<button onclick="this.parentElement.parentElement.remove()" style="background:linear-gradient(180deg,' + color + ',' + color + '80);color:#fff;border:none;padding:12px 36px;border-radius:24px;font-size:14px;font-weight:600;cursor:pointer;">Забрать</button>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
}

// Проверяем при загрузке и каждые 30 секунд
setTimeout(function() { window.checkEasterEggs(); }, 4000);
setInterval(function() { window.checkEasterEggs(); }, 30000);

console.log('🥚 Пасхалки загружены:', window.EASTER_EGG_CARDS.length, 'секретных карт');
