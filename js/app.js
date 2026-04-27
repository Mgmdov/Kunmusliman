    const firebaseConfig = {
        apiKey: "AIzaSyCUiXHBbxlSn1DladBWj5ODfEs-FXJXyTI",
        authDomain: "muslim-tracker-2d567.firebaseapp.com",
        projectId: "muslim-tracker-2d567",
        storageBucket: "muslim-tracker-2d567.firebasestorage.app",
        messagingSenderId: "527056085452",
        appId: "1:527056085452:web:47bf5ce838508ae2bf7d69",
        measurementId: "G-Y7TNSQYRCY"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    let currentUser = null;
    let userData = {
        xp: 0, level: 1,
        khatm: { readPages: 0, completedKhatms: 0, period: 30, currentSura: 1, currentPage: 1, lastCompletion: null },
        tauba: { days: [] }, zikrCounters: {},
        azkarChecks: { morning: {}, evening: {}, morningDate: null, eveningDate: null },
        stars: { totalStars: 0, lastClaimDate: "", unlockedRanks: [] },
        namesLearned: [], achievements: [],
        settings: { zikrNotificationInterval: 0, showChechen: true, hideAyahWidget: false },
        unlockedSurahs: [], unlockedProphets: [],
        totalSalawat: 0, totalZikrOverall: 0,
        jumaCards: [], unlockedCards: [], jumaChecked: { kahf: false, khutba: false },
        dailySalawat: 0, lastSalawatDate: null,
        showInLeaderboard: false, showStats: false, showCollection: false,
        fasting: { days: [], total: 0 },
        ramadan: { year: null, days: {} },
        battlesRead: [],
        quizStats: { correct: 0, wrong: 0, totalXP: 0 }
    };

    // УВЕЛИЧЕННЫЕ ПОРОГИ XP ДЛЯ УРОВНЕЙ
    const XP_LEVELS = [0, 200, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000, 20000, 26000, 33000, 41000, 50000, 60000, 75000, 90000, 110000, 130000, 155000, 185000, 220000, 260000, 300000, 350000, 400000, 460000, 530000, 600000];
    const LEVEL_NAMES = ["Новичок", "Ученик", "Практик", "Усердный", "Знающий", "Мудрец", "Просветлённый", "Благословенный", "Наместник", "Наследник", "Сиддик", "Вали", "Муджахид", "Мухсин", "Ариф", "Садик", "Шахид", "Рашидун", "Мухлис", "Салих", "Авлия", "Кутб", "Гавс", "Фарук", "Сиддик Акбар", "Халилуллах", "Калимуллах", "Рухуллах", "Хабибуллах", "Саййидуль-Мурсалин"];

    const STAR_RANKS = [
        { stars: 0, title: '🌱 Новичок', icon: '🌱', color: '#8E8E93' },
        { stars: 50, title: '⭐ Усердный', icon: '⭐', color: '#34C759' },
        { stars: 150, title: '🌟🌟 Продвинутый', icon: '🌟🌟', color: '#007AFF' },
        { stars: 300, title: '💫 Знающий', icon: '💫', color: '#AF52DE' },
        { stars: 500, title: '🌟 Мастер', icon: '🌟', color: '#FF9500' },
        { stars: 1000, title: '👑 Элитный', icon: '👑', color: '#FFD700' },
        { stars: 2000, title: '🏆 Легенда', icon: '🏆', color: '#FF3B30' },
        { stars: 5000, title: '💎 Мифический', icon: '💎', color: '#d4af37' }
    ];

    let xpPopupTimer = null, currentModule = 'khatm';
    let specialDaysCounters = { arafa: 0, ashura: 0, baraat: 0, laylatulqadr: 0, shawwal: 0 };
    let hasClaimedThisWeek = false;
    let lastZikrStarMilestone = 0;

    const SURA_NAMES_RU = ["Аль-Фатиха","Аль-Бакара","Аль Имран","Ан-Ниса","Аль-Маида","Аль-Анам","Аль-Араф","Аль-Анфаль","Ат-Тавба","Юнус","Худ","Юсуф","Ар-Рад","Ибрахим","Аль-Хиджр","Ан-Нахль","Аль-Исра","Аль-Кахф","Марьям","Та Ха","Аль-Анбия","Аль-Хадж","Аль-Муминун","Ан-Нур","Аль-Фуркан","Аш-Шуара","Ан-Намль","Аль-Касас","Аль-Анкабут","Ар-Рум","Лукман","Ас-Саджда","Аль-Ахзаб","Саба","Фатир","Йа Син","Ас-Саффат","Сад","Аз-Зумар","Гафир","Фуссилят","Аш-Шура","Аз-Зухруф","Ад-Духан","Аль-Джасия","Аль-Ахкаф","Мухаммад","Аль-Фатх","Аль-Худжурат","Каф","Аз-Зарият","Ат-Тур","Ан-Наджм","Аль-Камар","Ар-Рахман","Аль-Вакиа","Аль-Хадид","Аль-Муджадиля","Аль-Хашр","Аль-Мумтахана","Ас-Сафф","Аль-Джумуа","Аль-Мунафикун","Ат-Тагабун","Ат-Таляк","Ат-Тахрим","Аль-Мульк","Аль-Калям","Аль-Хакка","Аль-Мааридж","Нух","Аль-Джинн","Аль-Муззаммиль","Аль-Муддассир","Аль-Кияма","Аль-Инсан","Аль-Мурсалят","Ан-Наба","Ан-Назиат","Абаса","Ат-Таквир","Аль-Инфитар","Аль-Мутаффифин","Аль-Иншикак","Аль-Бурудж","Ат-Тарик","Аль-Аля","Аль-Гашия","Аль-Фаджр","Аль-Баляд","Аш-Шамс","Аль-Ляйль","Ад-Духа","Аш-Шарх","Ат-Тин","Аль-Аляк","Аль-Кадр","Аль-Баййина","Аз-Зальзаля","Аль-Адият","Аль-Кариа","Ат-Такасур","Аль-Аср","Аль-Хумаза","Аль-Филь","Курайш","Аль-Маун","Аль-Кавсар","Аль-Кафирун","Ан-Наср","Аль-Масад","Аль-Ихляс","Аль-Фаляк","Ан-Нас"];

    const SURAH_STORIES = {
        1: "«Открывающая Книгу» — самая великая сура. Читается в каждом намазе. Пророк ﷺ сказал: «Клянусь Тем, в Чьей Длани моя душа, не ниспосылалось ни в Торе, ни в Евангелии, ни в Псалтыре, ни в Коране ничего подобного ей».",
        2: "«Корова» — самая длинная сура. Содержит аят «Аль-Курси» — величайший аят Корана. Шайтан покидает дом, где читают эту суру.",
        3: "«Семейство Имрана» — повествует о Марьям, рождении Исы и пророке Закарии. Ниспослана после битвы при Ухуде.",
        4: "«Женщины» — содержит законы о браке, наследстве, правах женщин и сирот.",
        5: "«Трапеза» — последняя ниспосланная сура. Содержит аят: «Сегодня Я завершил для вас вашу религию».",
        6: "«Скот» — сура о единобожии. Ибрахим спорит со своим народом о звёздах, луне и солнце.",
        7: "«Ограды» — описывает диалог между обитателями Рая и Ада.",
        8: "«Трофеи» — ниспослана после битвы при Бадре. Учит справедливому разделу добычи.",
        9: "«Покаяние» — единственная сура без «Бисмиллях». Говорит о лицемерах и джихаде.",
        10: "«Юнус» — пророк Юнус, проглоченный китом, покаялся во мраке и был спасён.",
        11: "«Худ» — история пророка Худа и наказание народа Ад.",
        12: "«Юсуф» — «лучшее из повествований» о пророке Юсуфе и его братьях.",
        18: "«Пещера» — история юношей, уснувших в пещере на 309 лет. Читается по пятницам.",
        19: "«Марьям» — чудесное рождение пророка Исы и история Закарии.",
        36: "«Йа Син» — «сердце Корана». Читается над умершими.",
        47: "«Мухаммад» — названа в честь Пророка ﷺ. Следуйте за Мухаммадом.",
        71: "«Нух» — история пророка Нуха, который 950 лет призывал свой народ.",
        112: "«Очищение веры» — «Скажи: Он — Аллах Единый»."
    };

    const PROPHETS_DATA = [
        { id: 1, name: "Адам", arabic: "آدَم", title: "Первый человек и пророк", story: "Адам — первый человек, созданный Аллахом из глины. Ему были обучены все имена. Ангелы поклонились ему, кроме Иблиса.", unlockLevel: 1 },
        { id: 2, name: "Идрис", arabic: "إِدْرِيس", title: "Пророк и мудрец", story: "Идрис (Енох) — правнук Адама. Ему были ниспосланы 30 свитков. Аллах вознёс его на высокое место живым.", unlockLevel: 3 },
        { id: 3, name: "Нух", arabic: "نُوح", title: "Первый посланник к людям", story: "Нух (Ной) призывал свой народ 950 лет. Великий потоп уничтожил всех неверующих.", unlockLevel: 5 },
        { id: 4, name: "Худ", arabic: "هُود", title: "Пророк народа Ад", story: "Худ был послан к народу Ад — могучим людям. Они отвергли его и были уничтожены ураганным ветром.", unlockLevel: 7 },
        { id: 5, name: "Салих", arabic: "صَالِح", title: "Пророк народа Самуд", story: "Салих был послан к народу Самуд. В знамение Аллах вывел из скалы верблюдицу. Они убили её и были наказаны.", unlockLevel: 8 },
        { id: 6, name: "Ибрахим", arabic: "إِبْرَاهِيم", title: "Друг Аллаха (Халилуллах)", story: "Ибрахим (Авраам) — «отец пророков». Он разбил идолов, был брошен в огонь, но Аллах сделал огонь прохладным. Построил Каабу.", unlockLevel: 10 },
        { id: 7, name: "Лут", arabic: "لُوط", title: "Племянник Ибрахима", story: "Лут (Лот) был послан к народу, погрязшему в мужеложстве. Его народ был уничтожен — города перевёрнуты.", unlockLevel: 8 },
        { id: 8, name: "Исмаил", arabic: "إِسْمَاعِيل", title: "Сын Ибрахима, отец арабов", story: "Исмаил (Измаил) — первенец Ибрахима. Помог отцу построить Каабу. Прадед Пророка Мухаммада ﷺ.", unlockLevel: 10 },
        { id: 9, name: "Исхак", arabic: "إِسْحَاق", title: "Сын Ибрахима, отец Исраила", story: "Исхак (Исаак) — сын Ибрахима и Сары, рождённый в старости. Отец пророка Якуба.", unlockLevel: 12 },
        { id: 10, name: "Якуб", arabic: "يَعْقُوب", title: "Исраил — отец 12 колен", story: "Якуб (Иаков) — сын Исхака. У него было 12 сыновей, от которых произошли 12 колен Израилевых.", unlockLevel: 12 },
        { id: 11, name: "Юсуф", arabic: "يُوسُف", title: "Самый красивый человек", story: "Юсуф (Иосиф) — сын Якуба. Братья бросили его в колодец. Стал управляющим казны Египта. Простил братьев.", unlockLevel: 15 },
        { id: 12, name: "Айюб", arabic: "أَيُّوب", title: "Пророк терпения", story: "Айюб (Иов) — образец терпения. Аллах испытал его потерей богатства, детей и болезнью. Он терпел и был вознаграждён.", unlockLevel: 13 },
        { id: 13, name: "Шуайб", arabic: "شُعَيْب", title: "Проповедник мадьянитов", story: "Шуайб (Иофор) — пророк народа Мадьян. Они обманывали в торговле. Были наказаны землетрясением.", unlockLevel: 9 },
        { id: 14, name: "Муса", arabic: "مُوسَى", title: "Тот, с кем говорил Аллах", story: "Муса (Моисей) — величайший пророк. Ему ниспослана Тора. Вывел сынов Исраила из Египта, море расступилось.", unlockLevel: 20 },
        { id: 15, name: "Харун", arabic: "هَارُون", title: "Брат и помощник Мусы", story: "Харун (Аарон) — старший брат Мусы, его помощник. Был красноречив.", unlockLevel: 15 },
        { id: 16, name: "Давуд", arabic: "دَاوُد", title: "Пророк и царь", story: "Давуд (Давид) — царь Израиля. Ему ниспослана Псалтырь. Горы и птицы восхваляли Аллаха вместе с ним.", unlockLevel: 18 },
        { id: 17, name: "Сулейман", arabic: "سُلَيْمَان", title: "Величайший царь", story: "Сулейман (Соломон) — сын Давуда. Власть над ветрами и джиннами. Понимал язык птиц и муравьёв.", unlockLevel: 22 },
        { id: 18, name: "Ильяс", arabic: "إِلْيَاس", title: "Пророк, вознесённый на небо", story: "Ильяс (Илия) — призывал народ к единобожию. Аллах вознёс его на небо живым.", unlockLevel: 14 },
        { id: 19, name: "Альяса", arabic: "اليَسَع", title: "Ученик Ильяса", story: "Альяса (Елисей) — ученик и преемник Ильяса. Продолжил его дело.", unlockLevel: 14 },
        { id: 20, name: "Юнус", arabic: "يُونُس", title: "Человек кита (Зун-Нун)", story: "Юнус (Иона) — проглочен китом. Во мраке воззвал: «Нет бога, кроме Тебя!» Аллах спас его.", unlockLevel: 16 },
        { id: 21, name: "Закария", arabic: "زَكَرِيَّا", title: "Опекун Марьям", story: "Закария (Захария) — пророк, опекун Марьям. В старости Аллах даровал ему сына Яхью.", unlockLevel: 17 },
        { id: 22, name: "Яхья", arabic: "يَحْيَى", title: "Сын Закарии, предтеча Исы", story: "Яхья (Иоанн Креститель) — сын Закарии, рождённый чудесным образом. Подтвердил истинность Исы.", unlockLevel: 17 },
        { id: 23, name: "Иса", arabic: "عِيسَى", title: "Мессия, Слово Аллаха", story: "Иса (Иисус) — сын Марьям, рождённый без отца. Исцелял слепых, оживлял мёртвых. Не был распят — вознесён к Аллаху.", unlockLevel: 25 },
        { id: 24, name: "Мухаммад", arabic: "مُحَمَّد", title: "Печать пророков", story: "Мухаммад ﷺ — последний пророк. Ему ниспослан Коран. Лучший пример для верующих.", unlockLevel: 30 },
        { id: 25, name: "Зуль-Кифль", arabic: "ذُو الْكِفْل", title: "Обладатель удела", story: "Зуль-Кифль — праведник и пророк. Взял на себя обязательство судить народ справедливо.", unlockLevel: 11 }
    ];const SAHABI_DATA = [
        { id: 1, name: "Абу Бакр", fullName: "Абу Бакр ас-Сиддик", arabicTitle: "الصِّدِّيق", titleMeaning: "Правдивейший", story: "Первый халиф. Ближайший друг Пророка ﷺ. Собрал Коран в единую книгу. Один из десяти обрадованных Раем.", starsRequired: 1000, isJanna: true },
        { id: 2, name: "Умар", fullName: "Умар ибн аль-Хаттаб", arabicTitle: "الفَارُوق", titleMeaning: "Различающий истину", story: "Второй халиф. Известен справедливостью. Пророк ﷺ сказал: «Если бы после меня был пророк, им был бы Умар». Один из десяти обрадованных Раем.", starsRequired: 500, isJanna: true },
        { id: 3, name: "Усман", fullName: "Усман ибн Аффан", arabicTitle: "ذُو النُّورَيْن", titleMeaning: "Обладатель двух светочей", story: "Третий халиф. Женат на двух дочерях Пророка ﷺ. Собрал Коран. Один из десяти обрадованных Раем.", starsRequired: 300, isJanna: true },
        { id: 4, name: "Али", fullName: "Али ибн Абу Талиб", arabicTitle: "أَبُو تُرَاب", titleMeaning: "Отец земли", story: "Четвёртый халиф, двоюродный брат и зять Пророка ﷺ. Первый из детей, принявший Ислам. Один из десяти обрадованных Раем.", starsRequired: 750, isJanna: true },
        { id: 5, name: "Тальха", fullName: "Тальха ибн Убайдуллах", arabicTitle: "طَلْحَةُ الْخَيْر", titleMeaning: "Тальха добра", story: "Один из десяти обещанных Рая. Защищал Пророка ﷺ в битве при Ухуде.", starsRequired: 400, isJanna: true },
        { id: 6, name: "Зубайр", fullName: "Зубайр ибн аль-Аввам", arabicTitle: "حَوَارِيُّ النَّبِيّ", titleMeaning: "Апостол Пророка", story: "Один из десяти обещанных Рая. Пророк ﷺ назвал его своим апостолом.", starsRequired: 400, isJanna: true },
        { id: 7, name: "Абдуррахман", fullName: "Абдуррахман ибн Ауф", arabicTitle: "أَمِينُ الأُمَّة", titleMeaning: "Честный уммы", story: "Один из десяти обещанных Рая. Очень богатый и щедрый.", starsRequired: 350, isJanna: true },
        { id: 8, name: "Саад", fullName: "Саад ибн Аби Ваккас", arabicTitle: "فَارِسُ الإِسْلَام", titleMeaning: "Всадник Ислама", story: "Один из десяти обещанных Рая. Первый, кто выпустил стрелу на пути Аллаха.", starsRequired: 350, isJanna: true },
        { id: 9, name: "Саид", fullName: "Саид ибн Зайд", arabicTitle: "أَبُو الأَعْوَر", titleMeaning: "Отец одноглазого", story: "Один из десяти обещанных Рая. Его молитва принималась.", starsRequired: 300, isJanna: true },
        { id: 10, name: "Абу Убайда", fullName: "Абу Убайда ибн аль-Джаррах", arabicTitle: "أَمِينُ الأُمَّة", titleMeaning: "Честный уммы", story: "Один из десяти обещанных Рая. Пророк ﷺ назвал его «честным уммы».", starsRequired: 300, isJanna: true },
        { id: 11, name: "Халид", fullName: "Халид ибн аль-Валид", arabicTitle: "سَيْفُ اللَّهِ", titleMeaning: "Меч Аллаха", story: "Великий полководец. Не проиграл ни одной битвы. Пророк ﷺ назвал его «Мечом Аллаха».", starsRequired: 600, isJanna: false },
        { id: 12, name: "Билял", fullName: "Билял ибн Рабах", arabicTitle: "مُؤَذِّنُ الرَّسُول", titleMeaning: "Муэдзин Посланника", story: "Первый муэдзин в Исламе. Эфиопский раб, подвергшийся пыткам.", starsRequired: 500, isJanna: false }
    ];

    // РАСШИРЕННЫЙ СПИСОК КАРТОЧЕК ДЛЯ ДЖУМА (ДОБАВЛЕНО МНОГО НОВЫХ)
    const JUMA_LINKS = [
        { title: "Пятничная хутба 1", url: "https://youtu.be/mrFKaKfkbcs?si=v9kQBVogp_xvVcl6" },
        { title: "Говорите о Коране уверенно и просто | Нуман Али Хан", url: "https://youtu.be/C5RtLVPRyW0?si=mOCC2dNGRZj2-xb_" },
        { title: "Пятничная хутба 3", url: "https://youtu.be/twXi4BaJ79A?si=NAwhQafh-v-c6_lv" },
        { title: "Пятничная хутба 4", url: "https://youtu.be/Jjdpo7U09_8?si=Ims8_j-ZJNXm3Nb8" },
        { title: "Пятничная хутба 5", url: "https://youtu.be/hvPmTbXPGYk?si=dg1XENi_0H08FFyn" },
        { title: "Пятничная хутба 6", url: "https://youtu.be/VjX2r6i2P_4?si=WO3OsHXasFaCROeq" },
        { title: "Пятничная хутба 7", url: "https://youtu.be/-ZoyVvfDv60?si=fXyYu4eV_yczOsh7" },
        { title: "Пятничная хутба 8", url: "https://youtu.be/R5X4kxW3pJQ?si=dZuwvrQH63zxcvBl" },
        { title: "Пятничная хутба 9", url: "https://youtu.be/cLOU89dkhL0?si=2u1v-xgEiAi3gjal" },
        { title: "Стойкость с силой | Нуман Али Хан", url: "https://youtu.be/qbnTK48cE5o?si=wT3VbTPoh1SNVTWC" }
    ];

    // ДАННЫЕ О БИТВАХ
    const BATTLE_DATA = [
        { id: 'badr', name: 'Битва при Бадре', year: '2 г.х.', emoji: '⚔️', story: 'Первое крупное сражение мусульман против курайшитов. 313 мусульман против 1000 язычников. Аллах ниспослал ангелов в помощь, и мусульмане одержали решительную победу.', result: 'Победа мусульман', cardRarity: 'legendary' },
        { id: 'uhud', name: 'Битва при Ухуде', year: '3 г.х.', emoji: '🏹', story: 'Курайшиты жаждали мести за Бадр. Мусульмане сначала побеждали, но лучники покинули позицию, и враг ударил с тыла. Пророк ﷺ был ранен, Хамза убит.', result: 'Поражение (урок)', cardRarity: 'epic' },
        { id: 'khandaq', name: 'Битва у Рва', title: 'Хандак', year: '5 г.х.', emoji: '🕳️', image: 'https://raw.githubusercontent.com/Mgmdov/Kunmusliman/main/images/cards/khandaq.jpg', story: 'Союз 10 000 врагов осадил Медину. По совету Салмана аль-Фариси мусульмане вырыли ров вокруг города. Враг не мог его преодолеть. Осада длилась около месяца. Аллах послал сильный ветер и холод, который разрушил лагерь союзников и заставил их отступить.', result: 'Победа без боя', cardRarity: 'epic' },
        { id: 'khaybar', name: 'Битва при Хайбаре', title: 'Хайбар', year: '7 г.х.', emoji: '🏰', image: 'https://raw.githubusercontent.com/Mgmdov/Kunmusliman/main/images/cards/khaybar.png', story: 'Поход против иудейских крепостей Хайбара. Пророк ﷺ сказал: «Завтра я вручу знамя человеку, который любит Аллаха и Его Посланника». Знамя было вручено Али ибн Абу Талибу, который проявил невиданную храбрость и открыл ворота крепости.', result: 'Победа', cardRarity: 'epic' },
        { id: 'mutah', name: 'Битва при Муте', year: '8 г.х.', emoji: '🛡️', story: 'Первое столкновение с Византией. Три командира (Зайд, Джафар, Абдуллах ибн Раваха) пали смертью храбрых. Знамя подхватил Халид ибн Валид, который мастерски отвёл войско.', result: 'Тактическое отступление', cardRarity: 'legendary' },
        { id: 'hunain', name: 'Битва при Хунайне', year: '8 г.х.', emoji: '🏔️', story: 'После завоевания Мекки племена Хавазин устроили засаду. Мусульмане дрогнули, но Пророк ﷺ устоял и призвал ансаров, после чего враг был разбит.', result: 'Победа', cardRarity: 'rare' },
        { id: 'tabuk', name: 'Поход на Табук', year: '9 г.х.', emoji: '🔥', story: 'Самый тяжёлый поход в сильную жару против Византии. Лицемеры уклонились, а верующие пожертвовали много имущества. Сражения не было — враг отступил.', result: 'Без боя', cardRarity: 'epic' }
    ];

    const ALL_CARDS = [
    { id: 's1', name: 'Абу Бакр', title: 'ас-Сиддик', emoji: '👑', type: 'sahabi', rarity: 'legendary', story: 'Первый халиф, ближайший друг Пророка ﷺ. Один из десяти обрадованных Раем.', condition: 'stars_1000', conditionText: '1000 звёзд', isJanna: true },
    { id: 's2', name: 'Умар', title: 'аль-Фарук', emoji: '⚔️', type: 'sahabi', rarity: 'legendary', story: 'Второй халиф, различающий истину. Один из десяти обрадованных Раем.', condition: 'stars_500', conditionText: '500 звёзд', isJanna: true },
    { id: 's3', name: 'Усман', title: 'Зун-Нурайн', emoji: '📖', type: 'sahabi', rarity: 'epic', story: 'Третий халиф, обладатель двух светочей. Один из десяти обрадованных Раем.', condition: 'stars_300', conditionText: '300 звёзд', isJanna: true },
    { id: 's4', name: 'Али', title: 'Абу Тураб', emoji: '🦁', type: 'sahabi', rarity: 'legendary', story: 'Четвёртый халиф, лев Аллаха. Один из десяти обрадованных Раем.', condition: 'stars_750', conditionText: '750 звёзд', isJanna: true },
    { id: 's5', name: 'Тальха', title: 'Тальха добра', emoji: '🌴', type: 'sahabi', rarity: 'epic', story: 'Один из десяти обещанных Рая. Защищал Пророка ﷺ в битве при Ухуде.', condition: 'stars_400', conditionText: '400 звёзд', isJanna: true },
    { id: 's6', name: 'Зубайр', title: 'Апостол Пророка', emoji: '⭐', type: 'sahabi', rarity: 'epic', story: 'Один из десяти обещанных Рая. Пророк ﷺ назвал его своим апостолом.', condition: 'stars_400', conditionText: '400 звёзд', isJanna: true },
    { id: 's7', name: 'Абдуррахман', title: 'Честный уммы', emoji: '💼', type: 'sahabi', rarity: 'epic', story: 'Один из десяти обещанных Рая. Очень богатый и щедрый.', condition: 'stars_350', conditionText: '350 звёзд', isJanna: true },
    { id: 's8', name: 'Саад', title: 'Всадник Ислама', emoji: '🏹', type: 'sahabi', rarity: 'epic', story: 'Один из десяти обещанных Рая. Первый, кто выпустил стрелу на пути Аллаха.', condition: 'stars_350', conditionText: '350 звёзд', isJanna: true },
    { id: 's9', name: 'Саид', title: 'Отец одноглазого', emoji: '🌙', type: 'sahabi', rarity: 'epic', story: 'Один из десяти обещанных Рая. Его молитва принималась.', condition: 'stars_300', conditionText: '300 звёзд', isJanna: true },
    { id: 's10', name: 'Абу Убайда', title: 'Честный уммы', emoji: '🛡️', type: 'sahabi', rarity: 'epic', story: 'Один из десяти обещанных Рая. Пророк ﷺ назвал его «честным уммы».', condition: 'stars_300', conditionText: '300 звёзд', isJanna: true },
    { id: 's11', name: 'Халид', title: 'Сайфуллах', emoji: '⚔️', type: 'sahabi', rarity: 'legendary', story: 'Меч Аллаха, непобеждённый полководец.', condition: 'stars_600', conditionText: '600 звёзд', isJanna: false },
    { id: 's12', name: 'Билял', title: 'Муэдзин', emoji: '🎙️', type: 'sahabi', rarity: 'legendary', story: 'Первый муэдзин в Исламе. Эфиопский раб, подвергшийся пыткам.', condition: 'stars_500', conditionText: '500 звёзд', isJanna: false },
    { id: 'muhammad', name: 'Мухаммад', title: 'ﷺ Печать пророков', emoji: '🕌', type: 'prophet', rarity: 'mythic', story: 'Мухаммад ﷺ — последний пророк, печать пророков. Ему ниспослан Коран. Лучший пример для верующих.', condition: 'secret', conditionText: '???' },
    // КАРТОЧКИ ДЖУМА
    { id: 'j1', name: 'Пятничная', title: 'Благословение', emoji: '🌟', type: 'juma', rarity: 'legendary', story: 'Особая пятничная карта', ayah: '«И стремитесь к поминанию Аллаха» (62:9)' },
    { id: 'j2', name: 'Пятничная', title: 'Свет', emoji: '💡', type: 'juma', rarity: 'legendary', story: 'Свет между двумя пятницами', ayah: '«Аллах — Свет небес и земли» (24:35)' },
    { id: 'j3', name: 'Пятничная', title: 'Милость', emoji: '🌙', type: 'juma', rarity: 'legendary', story: 'Милость Аллаха безгранична', ayah: '«Милость Моя объемлет всякую вещь» (7:156)' },
    { id: 'j4', name: 'Пятничная', title: 'Прощение', emoji: '🤲', type: 'juma', rarity: 'legendary', story: 'В пятницу есть час, когда дуа принимается', ayah: '«Просите Аллаха о прощении» (71:10)' },
    { id: 'j5', name: 'Пятничная', title: 'Саджда', emoji: '🕌', type: 'juma', rarity: 'legendary', story: 'Земной поклон — высшее проявление покорности', ayah: '«Падите ниц перед Аллахом и поклоняйтесь» (53:62)' },
    { id: 'j6', name: 'Пятничная', title: 'Барака', emoji: '✨', type: 'juma', rarity: 'legendary', story: 'Благословение пятницы', ayah: '«Это — благословенное Писание» (6:92)' },
    { id: 'j7', name: 'Пятничная', title: 'Сабр', emoji: '🌴', type: 'juma', rarity: 'legendary', story: 'Терпение — ключ к успеху', ayah: '«О те, которые уверовали! Обратитесь за помощью к терпению и намазу» (2:153)' },
    { id: 'j8', name: 'Пятничная', title: 'Шукр', emoji: '🙏', type: 'juma', rarity: 'legendary', story: 'Благодарность Аллаху', ayah: '«Если вы будете благодарны, Я одарю вас ещё большим» (14:7)' },
    { id: 'j9', name: 'Пятничная', title: 'Таваккуль', emoji: '🤲', type: 'juma', rarity: 'legendary', story: 'Упование на Аллаха', ayah: '«И на Аллаха пусть уповают верующие» (3:122)' },
    { id: 'j10', name: 'Пятничная', title: 'Ихлас', emoji: '💚', type: 'juma', rarity: 'legendary', story: 'Искренность в вере', ayah: '«Скажи: Он — Аллах Единый» (112:1)' },
    // КАРТОЧКИ БИТВ
    ...BATTLE_DATA.map(b => ({ id: `battle_${b.id}`, name: b.name, title: b.year, emoji: b.emoji, image: b.image || null, type: 'battle', rarity: b.cardRarity, story: `${b.story} Результат: ${b.result}`, condition: `battle_${b.id}`, conditionText: `Прочитать о битве` })),
    { id: 'z1', name: 'Зикр', title: '50 тысяч', emoji: '📿', type: 'achievement', rarity: 'epic', story: '50 000 зикров', condition: 'zikr_50000', conditionText: '50 000 зикров' },
    { id: 'z2', name: 'Зикр', title: '100 тысяч', emoji: '📿', type: 'achievement', rarity: 'legendary', story: '100 000 зикров', condition: 'zikr_100000', conditionText: '100 000 зикров' },
    { id: 'z3', name: 'Зикр', title: '500 тысяч', emoji: '🔥', type: 'achievement', rarity: 'legendary', story: '500 000 зикров', condition: 'zikr_500000', conditionText: '500 000 зикров' },
    { id: 'z4', name: 'Зикр', title: '1 миллион', emoji: '🏆', type: 'achievement', rarity: 'mythic', story: '1 000 000 зикров', condition: 'zikr_1000000', conditionText: '1 000 000 зикров' },
    { id: 'sal1', name: 'Салават', title: '50 тысяч', emoji: '🌹', type: 'achievement', rarity: 'epic', story: '50 000 салаватов', condition: 'salawat_50000', conditionText: '50 000 салаватов' },
    { id: 'sal2', name: 'Салават', title: '100 тысяч', emoji: '🌹', type: 'achievement', rarity: 'legendary', story: '100 000 салаватов', condition: 'salawat_100000', conditionText: '100 000 салаватов' },
    { id: 'sal3', name: 'Салават', title: '500 тысяч', emoji: '🔥', type: 'achievement', rarity: 'legendary', story: '500 000 салаватов', condition: 'salawat_500000', conditionText: '500 000 салаватов' },
    { id: 'sal4', name: 'Салават', title: '1 миллион', emoji: '🏆', type: 'achievement', rarity: 'mythic', story: '1 000 000 салаватов', condition: 'salawat_1000000', conditionText: '1 000 000 салаватов' },
    { id: 'k10', name: 'Хатм', title: '10 хатмов', emoji: '📖', type: 'achievement', rarity: 'epic', story: '10 завершённых хатмов', condition: 'khatm_10', conditionText: '10 хатмов' },
    { id: 'k25', name: 'Хатм', title: '25 хатмов', emoji: '💫', type: 'achievement', rarity: 'legendary', story: '25 завершённых хатмов', condition: 'khatm_25', conditionText: '25 хатмов' },
    { id: 'k50', name: 'Хатм', title: '50 хатмов', emoji: '👑', type: 'achievement', rarity: 'legendary', story: '50 завершённых хатмов', condition: 'khatm_50', conditionText: '50 хатмов' },
    { id: 'k100', name: 'Хатм', title: '100 хатмов', emoji: '🕋', type: 'achievement', rarity: 'mythic', story: '100 завершённых хатмов', condition: 'khatm_100', conditionText: '100 хатмов' },
    { id: 'name1', name: 'Ар-Рахман', title: 'Милостивый', emoji: '🌟', type: 'names', rarity: 'rare', story: 'Ар-Рохма́н — Милостивый ко всем на этом свете.', condition: 'names_1', conditionText: 'Выучить 1 имя' },
    { id: 'name99', name: '99 Имён', title: 'Хранитель', emoji: '👑', type: 'names', rarity: 'mythic', story: 'Все 99 Прекрасных Имён Аллаха!', condition: 'names_99', conditionText: 'Выучить все 99 имён' },
    { id: 'mira_isra', name: 'Исра и Мирадж', title: 'Ночное перенесение', emoji: '🚀', type: 'miracle', rarity: 'legendary', story: 'Пророк ﷺ был перенесён из Мекки в Иерусалим и вознесён на небеса, где ему были показаны знамения Аллаха и предписан пятикратный намаз.', condition: 'khatm_1', conditionText: 'Завершить 1 хатм' },
    { id: 'mira_moon', name: 'Раскол луны', title: 'Знамение', emoji: '🌙', type: 'miracle', rarity: 'legendary', story: 'По просьбе курайшитов Пророк ﷺ указал на луну, и она раскололась на две половины.', condition: 'zikr_50000', conditionText: '50 000 зикров' },
    { id: 'zamzam', name: 'Зам-Зам', title: 'Благословенный источник', emoji: '💧', type: 'miracle', rarity: 'mythic', story: 'Когда Хаджар искала воду для маленького Исмаила, по воле Аллаха забил источник Зам-Зам. «Вода Зам-Зама для того, для чего её пьют».', condition: 'secret', conditionText: '???' }
];

// ========== ИНИЦИАЛИЗАЦИЯ ALL_COLLECTION_CARDS (ТОЛЬКО ОДИН РАЗ) ==========
function initializeAllCollectionCards() {
    // 1. Пробуем загрузить из localStorage
    const savedCards = localStorage.getItem('all_collection_cards');
    if (savedCards) {
        try {
            const parsed = JSON.parse(savedCards);
            if (Array.isArray(parsed) && parsed.length > 0) {
                console.log('📦 Загружено из localStorage:', parsed.length, 'карточек');
                return parsed;
            }
        } catch (e) {
            console.warn('Ошибка загрузки из localStorage:', e);
        }
    }
    
    // 2. Собираем все карточки из разных источников
    const allCards = [...ALL_CARDS];
    
    // Добавляем карточки сур
    for (let i = 1; i <= 114; i++) {
        const story = SURAH_STORIES[i] || `Сура «${SURA_NAMES_RU[i-1]}» — ${i}-я сура Корана.`;
        allCards.push({ 
            id: `su${i}`, 
            name: SURA_NAMES_RU[i-1], 
            title: `${i}-я сура`, 
            emoji: i === 1 ? '🌟' : (i === 36 ? '💚' : '📖'), 
            type: 'surah', 
            rarity: i === 1 ? 'legendary' : (i === 36 ? 'legendary' : 'rare'), 
            story: story,
            image: `https://raw.githubusercontent.com/Mgmdov/Kunmusliman/main/images/surah/${i}.png`,
            condition: `surah_${i}`, 
            conditionText: `Прочитать суру «${SURA_NAMES_RU[i-1]}»` 
        });
    }
    
    // Добавляем карточки пророков
    PROPHETS_DATA.forEach(p => {
        allCards.push({ 
            id: `p${p.id}`, 
            name: p.name, 
            title: p.title, 
            emoji: '🕋', 
            type: 'prophet', 
            rarity: p.id === 24 ? 'mythic' : (p.id <= 6 ? 'legendary' : 'rare'), 
            story: p.story,
            image: `https://raw.githubusercontent.com/Mgmdov/Kunmusliman/main/images/prophets/${p.id}.png`,
            condition: `prophet_${p.id}`, 
            conditionText: `Открыть пророка ${p.name}` 
        });
    });
    
    // Добавляем карточки достижений если есть ACHIEVEMENT_CARDS
    if (typeof ACHIEVEMENT_CARDS !== 'undefined') {
        Object.values(ACHIEVEMENT_CARDS).forEach(card => {
            if (!allCards.find(c => c.id === card.id)) {
                allCards.push(card);
            }
        });
    }
    
    // Удаляем дубликаты по id
    const uniqueCards = [...new Map(allCards.map(c => [c.id, c])).values()];
    
    console.log('📦 Собрано всего карточек:', uniqueCards.length);
    return uniqueCards;
}

// Инициализируем ОДИН раз
window.ALL_COLLECTION_CARDS = initializeAllCollectionCards();

// Сохраняем в localStorage
localStorage.setItem('all_collection_cards', JSON.stringify(window.ALL_COLLECTION_CARDS));

console.log('✅ ALL_COLLECTION_CARDS готов, всего:', window.ALL_COLLECTION_CARDS.length);

// ========== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ КАРТОЧЕК ==========
function getAllCollectionCards() {
    if (!window.ALL_COLLECTION_CARDS || window.ALL_COLLECTION_CARDS.length === 0) {
        window.ALL_COLLECTION_CARDS = initializeAllCollectionCards();
        localStorage.setItem('all_collection_cards', JSON.stringify(window.ALL_COLLECTION_CARDS));
    }
    return window.ALL_COLLECTION_CARDS;
}

const TOTAL_PAGES = 604;
let currentMysteryCards = [];

// ========== ПОЛНОЕ ИСПРАВЛЕНИЕ ВЫДАЧИ КАРТОЧЕК ДЖУМА ==========
// Удаляем старые обработчики с mysteryCards
var mysteryEl = document.getElementById('mysteryCards');
var newMysteryEl = mysteryEl.cloneNode(true);
mysteryEl.parentNode.replaceChild(newMysteryEl, mysteryEl);

// Новый обработчик клика по мистери-картам
newMysteryEl.addEventListener('click', function(e) {
    var card = e.target.closest('.mystery-card');
    if (!card) return;
    
    var index = parseInt(card.dataset.index);
    var selected = currentMysteryCards[index];
    if (!selected) return;
    
    console.log('🎴 ВЫБРАНА КАРТОЧКА:', selected.name, selected.title, selected.id);
    
    // Инициализируем массивы
    if (!userData.jumaCards) userData.jumaCards = [];
    if (!userData.unlockedCards) userData.unlockedCards = [];
    
    // Добавляем карточку
    if (!userData.jumaCards.find(function(c) { return c.id === selected.id; })) {
        userData.jumaCards.push(selected);
        console.log('✅ Добавлена в jumaCards');
    }
    if (!userData.unlockedCards.includes(selected.id)) {
        userData.unlockedCards.push(selected.id);
        console.log('✅ ID добавлен в unlockedCards');
    }
    
    // Сохраняем
    saveUserData();
    saveLocalBackup();
    
    // Отмечаем получение на этой неделе
    localStorage.setItem('juma_claimed_' + getWeekNumber(), 'true');
    hasClaimedThisWeek = true;
    
    // Закрываем оверлей
    document.getElementById('mysteryOverlay').classList.remove('active');
    
    // Показываем уведомления
    showFirework('🎉 ' + selected.name + ' ' + selected.title + '!');
    showNotification('🎴 Карточка «' + selected.name + ' — ' + selected.title + '» в коллекции!');
    
    // Обновляем коллекцию
    if (typeof renderCollection === 'function') {
        setTimeout(function() { renderCollection(); }, 300);
    }
    updateCollectionBadge();
    
    // Показываем историю
    setTimeout(function() {
        alert('📜 ' + (selected.story || selected.ayah || 'Благословенная пятничная карта'));
    }, 600);
    
    console.log('📊 Статистика: jumaCards=' + userData.jumaCards.length + ', unlockedCards=' + userData.unlockedCards.length);
});

// Переопределяем showMysteryCards
window.showMysteryCards = function() {
    console.log('🎲 showMysteryCards вызвана');
    
    var allCards = getAllCollectionCards();
    
    // Ищем доступные карточки Джума
    var jumaAvail = allCards.filter(function(c) {
        return c.type === 'juma' && !(userData.jumaCards || []).find(function(jc) { return jc.id === c.id; });
    });
    
    console.log('🎴 Доступно карточек Джума:', jumaAvail.length);
    
    var cardsToShow = [];
    
    if (jumaAvail.length >= 3) {
        cardsToShow = jumaAvail.sort(function() { return Math.random() - 0.5; }).slice(0, 3);
    } else if (jumaAvail.length > 0) {
        var other = allCards.filter(function(c) {
            return !(userData.jumaCards || []).find(function(jc) { return jc.id === c.id; }) && c.type !== 'juma';
        });
        cardsToShow = jumaAvail.concat(other.sort(function() { return Math.random() - 0.5; }).slice(0, 3 - jumaAvail.length));
    } else {
        var allOther = allCards.filter(function(c) {
            return !(userData.jumaCards || []).find(function(jc) { return jc.id === c.id; });
        });
        cardsToShow = allOther.sort(function() { return Math.random() - 0.5; }).slice(0, 3);
    }
    
    currentMysteryCards = cardsToShow;
    console.log('🃏 Показываем:', cardsToShow.map(function(c) { return c.name + ' ' + c.title + ' (' + c.type + ')'; }));
    
    var container = document.getElementById('mysteryCards');
    container.innerHTML = cardsToShow.map(function(c, i) {
        return '<div class="mystery-card" data-index="' + i + '">' +
               '<div class="mystery-ayah">' + (c.ayah || '«Поистине, Аллах любит творящих добро» (2:195)') + '</div>' +
               '</div>';
    }).join('');
    
    document.getElementById('mysteryOverlay').classList.add('active');
};

// Функция для ручного добавления карточек (вызовите в консоли: addMissingJumaCards())
window.addMissingJumaCards = function() {
    if (!userData.jumaCards) userData.jumaCards = [];
    if (!userData.unlockedCards) userData.unlockedCards = [];
    
    var allCards = getAllCollectionCards();
    var jumaCards = allCards.filter(function(c) { return c.type === 'juma'; });
    console.log('📊 Всего карточек Джума в системе:', jumaCards.length);
    
    var added = 0;
    jumaCards.slice(0, 3).forEach(function(card) {
        if (!userData.unlockedCards.includes(card.id)) {
            userData.unlockedCards.push(card.id);
            if (!userData.jumaCards.find(function(c) { return c.id === card.id; })) {
                userData.jumaCards.push(card);
            }
            added++;
            console.log('✅ Добавлена:', card.name, card.title, '(' + card.rarity + ')');
        }
    });
    
    if (added > 0) {
        saveUserData();
        saveLocalBackup();
        
        localStorage.removeItem('juma_claimed_' + getWeekNumber());
        
        if (typeof renderCollection === 'function') renderCollection();
        updateCollectionBadge();
        
        alert('✅ Добавлено ' + added + ' карточек Джума!\n\nПроверьте: Коллекция → вкладка "🎴 Джума"');
        showNotification('🎴 ' + added + ' карточек Джума добавлены!');
    } else {
        alert('⚠️ Все карточки Джума уже есть в коллекции.\n\nПроверьте вкладку "🎴 Джума"');
    }
};

console.log('✅ СИСТЕМА КАРТОЧЕК ИСПРАВЛЕНА!');
console.log('💡 Всего карточек в коллекции:', window.ALL_COLLECTION_CARDS.length);
console.log('💡 Для добавления карточек Джума выполните: addMissingJumaCards()');

// ========== ФУНКЦИИ ЗАГРУЗКИ И СОХРАНЕНИЯ (С ИСПРАВЛЕННОЙ СИНХРОНИЗАЦИЕЙ) ==========
    function loadLocalBackup() {
        try {
            const backup = localStorage.getItem('muslim_tracker_backup');
            if (backup) { 
                Object.assign(userData, JSON.parse(backup)); 
                ensureFullDataStructure();
                console.log('📦 Локальный бекап загружен'); 
                return true; 
            }
        } catch (e) { console.warn('Ошибка загрузки бекапа:', e); }
        return false;
    }
    
    function saveLocalBackup() { 
        try { 
            localStorage.setItem('muslim_tracker_backup', JSON.stringify(userData)); 
        } catch (e) {} 
    }
    
    function ensureFullDataStructure() {
        if (!userData.khatm) userData.khatm = { readPages: 0, completedKhatms: 0, period: 30, currentSura: 1, currentPage: 1, lastCompletion: null };
        if (!userData.tauba) userData.tauba = { days: [] };
        if (!userData.zikrCounters) userData.zikrCounters = {};
        if (!userData.azkarChecks) userData.azkarChecks = { morning: {}, evening: {}, morningDate: null, eveningDate: null };
        if (!userData.stars) userData.stars = { totalStars: 0, lastClaimDate: "", unlockedRanks: [] };
        if (!userData.namesLearned) userData.namesLearned = [];
        if (!userData.achievements) userData.achievements = [];
        if (!userData.settings) userData.settings = { zikrNotificationInterval: 0, showChechen: true, hideAyahWidget: false };
        if (!userData.unlockedSurahs) userData.unlockedSurahs = [];
        if (!userData.unlockedProphets) userData.unlockedProphets = [];
        if (userData.totalSalawat === undefined) userData.totalSalawat = 0;
        if (userData.totalZikrOverall === undefined) userData.totalZikrOverall = 0;
        if (!userData.jumaCards) userData.jumaCards = [];
        if (!userData.unlockedCards) userData.unlockedCards = [];
        if (!userData.jumaChecked) userData.jumaChecked = { kahf: false, khutba: false };
        if (userData.dailySalawat === undefined) userData.dailySalawat = 0;
        if (!userData.lastSalawatDate) userData.lastSalawatDate = null;
        if (!userData.fasting) userData.fasting = { days: [], total: 0 };
        if (!userData.ramadan) userData.ramadan = { year: null, days: {} };
        if (!userData.battlesRead) userData.battlesRead = [];
        if (!userData.quizStats) userData.quizStats = { correct: 0, wrong: 0, totalXP: 0 };
    }

    // ========== ФУНКЦИИ XP И УРОВНЕЙ ==========
    function addXP(amount) {
        userData.xp = (userData.xp || 0) + amount;
        let newLevel = 1;
        for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
            if (userData.xp >= XP_LEVELS[i]) { newLevel = i + 1; break; }
        }
        if (newLevel > (userData.level || 1)) {
            userData.level = newLevel;
            showNotification(`🎉 Уровень ${newLevel} — ${LEVEL_NAMES[newLevel-1] || 'Мастер'}!`);
            PROPHETS_DATA.forEach(p => { if (newLevel >= p.unlockLevel && !(userData.unlockedProphets || []).includes(p.id)) unlockProphet(p.id); });
        }
        showXPPopup(); saveUserData(); updateHomeWidgets();
    }

    function showXPPopup() {
    const popup = document.getElementById('xpPopup'); 
    if (!popup) return;
    
    const level = userData.level || 1;
    const xp = userData.xp || 0;
    const currentXP = XP_LEVELS[level - 1] || 0;
    const nextXP = XP_LEVELS[level] || XP_LEVELS[XP_LEVELS.length - 1];
    const percent = Math.min(100, Math.max(0, ((xp - currentXP) / (nextXP - currentXP)) * 100));
    
    // Обновляем текст и прогресс
    document.getElementById('popupLevel').textContent = '⭐ Ур. ' + level;
    document.getElementById('popupXpText').textContent = xp + ' / ' + nextXP + ' XP';
    document.getElementById('popupXpFill').style.width = percent + '%';
    
    // Убираем класс hiding если есть
    popup.classList.remove('hiding');
    
    // Показываем с анимацией
    popup.classList.add('show');
    
    // Авто-скрытие через 3.5 секунды
    if (xpPopupTimer) clearTimeout(xpPopupTimer);
    xpPopupTimer = setTimeout(function() {
        popup.classList.add('hiding');
        popup.classList.remove('show');
    }, 3500);
}

    function showNotification(text) {
        const n = document.createElement('div');
        n.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#1C1C1E;color:white;padding:12px 20px;border-radius:30px;z-index:10000;max-width:280px;font-size:0.9rem;box-shadow:0 5px 20px rgba(0,0,0,0.3);text-align:center;`;
        n.innerHTML = text; document.body.appendChild(n); setTimeout(() => n.remove(), 3000);
    }

    function unlockProphet(id) {
        if (!userData.unlockedProphets) userData.unlockedProphets = [];
        if (!userData.unlockedProphets.includes(id)) {
            userData.unlockedProphets.push(id);
            const prophet = PROPHETS_DATA.find(p => p.id === id);
            if (prophet) {
                const cardId = `p${id}`;
                if (!userData.unlockedCards) userData.unlockedCards = [];
                if (!userData.unlockedCards.includes(cardId)) userData.unlockedCards.push(cardId);
            }
            saveUserData();
        }
    }

    function showFirework(text) {
    const container = document.getElementById('fireworkContainer');
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Золотые кольца вокруг текста
    for (let ring = 0; ring < 3; ring++) {
        setTimeout(() => {
            const ringEl = document.createElement('div');
            ringEl.className = 'achievement-ring';
            document.body.appendChild(ringEl);
            setTimeout(() => ringEl.remove(), 2000);
        }, ring * 200);
    }
    
    // Текст достижения
    const centerText = document.createElement('div');
    centerText.className = 'achievement-center-text';
    centerText.innerHTML = text;
    document.body.appendChild(centerText);
    setTimeout(() => centerText.remove(), 3500);
    
    // Частицы салюта
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#00CED1', '#ADFF2F', '#FF1493', '#FFE66D'];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 3;
    
    for (let burst = 0; burst < 5; burst++) {
        setTimeout(() => {
            for (let i = 0; i < 40; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.left = cx + 'px';
                particle.style.top = cy + 'px';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
                particle.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
                particle.style.width = (4 + Math.random() * 6) + 'px';
                particle.style.height = particle.style.width;
                container.appendChild(particle);
                setTimeout(() => particle.remove(), 1500);
            }
        }, burst * 250);
    }
}
// ========== ФУНКЦИИ АВТОРИЗАЦИИ И СИНХРОНИЗАЦИИ ==========
    function openAuthModal() { document.getElementById('authModal').style.display = 'flex'; }
    function closeAuthModal() {
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('authError').textContent = '';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('forgotPasswordForm').style.display = 'none';
    }
    
    async function signInAnonymously() {
        try {
            loadLocalBackup();
            const result = await auth.signInAnonymously();
            currentUser = result.user;
            closeAuthModal(); await loadUserData();
        } catch (error) { 
            console.error('Ошибка входа:', error); 
            loadLocalBackup(); 
            updateAllUI(); 
        }
    }
    
    async function loadUserData() {
        if (!currentUser) { if (loadLocalBackup()) updateAllUI(); return; }
        try {
            const doc = await db.collection('users').doc(currentUser.uid).get();
            if (doc.exists) { 
                const cloudData = doc.data();
                
                // ✅ СОХРАНЯЕМ ВСЕ КРИТИЧЕСКИЕ ЛОКАЛЬНЫЕ ЗНАЧЕНИЯ ПЕРЕД СЛИЯНИЕМ
                const criticalLocal = {
                    xp: userData.xp || 0,
                    totalZikrOverall: userData.totalZikrOverall || 0,
                    totalSalawat: userData.totalSalawat || 0,
                    readPages: userData.khatm?.readPages || 0,
                    completedKhatms: userData.khatm?.completedKhatms || 0,
                    totalStars: userData.stars?.totalStars || 0,
                    namesLearned: userData.namesLearned?.length || 0,
                    unlockedCards: userData.unlockedCards?.length || 0,
                    achievements: userData.achievements?.length || 0
                };
                
                // Сливаем облачные данные поверх локальных
                Object.assign(userData, cloudData); 
                
                // ✅ ВОССТАНАВЛИВАЕМ МАКСИМАЛЬНЫЕ ЗНАЧЕНИЯ (НЕ ДАЁМ ОБЛАКУ ЗАТЕРЕТЬ ПРОГРЕСС)
                userData.xp = Math.max(criticalLocal.xp, cloudData.xp || 0);
                userData.totalZikrOverall = Math.max(criticalLocal.totalZikrOverall, cloudData.totalZikrOverall || 0);
                userData.totalSalawat = Math.max(criticalLocal.totalSalawat, cloudData.totalSalawat || 0);
                
                if (!userData.khatm) userData.khatm = {};
                userData.khatm.readPages = Math.max(criticalLocal.readPages, cloudData.khatm?.readPages || 0);
                userData.khatm.completedKhatms = Math.max(criticalLocal.completedKhatms, cloudData.khatm?.completedKhatms || 0);
                
                if (!userData.stars) userData.stars = { totalStars: 0 };
                userData.stars.totalStars = Math.max(criticalLocal.totalStars, cloudData.stars?.totalStars || 0);
                
                // Для массивов — объединяем (не теряем разблокированные карточки и достижения)
                if (!userData.unlockedCards) userData.unlockedCards = [];
                if (!userData.achievements) userData.achievements = [];
                if (!userData.namesLearned) userData.namesLearned = [];

                


                
                saveLocalBackup(); 
                showXPPopup(); 
                updateAllUI();
                // Сохраняем в облако актуальные данные
                await saveUserData();
            }
            else { 
                loadLocalBackup(); 
                ensureFullDataStructure(); 
                await createNewUserInFirestore(); 
                saveLocalBackup(); 
            }
        } catch (e) { console.error(e); if (loadLocalBackup()) updateAllUI(); }
    }
    
    async function createNewUserInFirestore() {
        if (!currentUser) return;
        await db.collection('users').doc(currentUser.uid).set({ 
            ...userData, 
            email: currentUser.email || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp() 
        });
    }
    
    async function saveUserData() { 
        saveLocalBackup(); 
        if (!currentUser) return; 
        try { 
            ensureFullDataStructure();
            
            // ✅ ПРОВЕРЯЕМ, ЧТО МЫ НЕ СОХРАНЯЕМ МЕНЬШЕ ДАННЫХ, ЧЕМ ЕСТЬ В ОБЛАКЕ
            const cloudDoc = await db.collection('users').doc(currentUser.uid).get();
            if (cloudDoc.exists) {
                const cloudData = cloudDoc.data();
                
                // Если облачный XP значительно больше локального — данные в облаке новее
                if ((cloudData.xp || 0) > (userData.xp || 0) + 100) {
                    console.warn('⚠️ Облачные данные содержат больше XP! Отмена сохранения.');
                    return;
                }
                
                // Если облачные страницы Корана значительно больше
                if ((cloudData.khatm?.readPages || 0) > (userData.khatm?.readPages || 0) + 20) {
                    console.warn('⚠️ Облачные данные содержат больше страниц! Отмена сохранения.');
                    return;
                }
            }
            
            // Добавляем метку времени последнего сохранения
            userData.lastModified = firebase.firestore.FieldValue.serverTimestamp();
            
            await db.collection('users').doc(currentUser.uid).set(userData, { merge: true }); 
        } catch (e) {} 
    }

    function unlockCardIfNotHave(cardId) {
        if (!userData.unlockedCards) userData.unlockedCards = [];
        if (!userData.unlockedCards.includes(cardId)) {
            userData.unlockedCards.push(cardId);
            saveUserData();
            if (typeof renderCollection === 'function') renderCollection();
            updateCollectionBadge();
        }
    }

    function updateCollectionBadge() {
        const total = (userData.unlockedCards || []).length;
        const badge = document.getElementById('collectionBadge');
        if (badge) badge.textContent = total;
    }

    function updateHomeWidgets() {
        const level = userData.level || 1;
        const xp = userData.xp || 0;
        const currentXP = XP_LEVELS[level - 1] || 0;
        const nextXP = XP_LEVELS[level] || XP_LEVELS[XP_LEVELS.length - 1];
        const progress = Math.min(100, Math.max(0, ((xp - currentXP) / (nextXP - currentXP)) * 100));
        
        document.getElementById('homeLevel').textContent = `Ур. ${level}`;
        document.getElementById('homeXpText').textContent = `${xp} / ${nextXP} XP`;
        document.getElementById('homeXpFill').style.width = progress + '%';
        document.getElementById('homeTodayPages').textContent = (userData.khatm?.readPages || 0) + ' стр.';
        document.getElementById('homeTodayZikr').textContent = userData.totalZikrOverall || 0;
        document.getElementById('homeTodayStars').textContent = userData.stars?.totalStars || 0;
        
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        document.getElementById('homeDayName').textContent = days[new Date().getDay()];
        
        const learned = userData.namesLearned?.length || 0;
        const namesBadge = document.getElementById('namesBadge');
        if (namesBadge) namesBadge.textContent = 99 - learned;
        
        const achievements = userData.achievements?.length || 0;
        const achBadge = document.getElementById('achievementsBadge');
        if (achBadge) achBadge.textContent = achievements;
        
        updateCollectionBadge();
        
        const today = new Date();
        const jumaBadge = document.getElementById('jumaBadge');
        if (jumaBadge) jumaBadge.style.display = today.getDay() === 5 ? 'inline-block' : 'none';
        
        // Скрытие/показ виджета Аят дня
        const ayahWidget = document.getElementById('ayahWidget');
        if (ayahWidget) {
            ayahWidget.style.display = userData.settings?.hideAyahWidget ? 'none' : 'block';
        }
    }

    function updateAllUI() {
        showXPPopup();
        updateHomeWidgets();
        if (typeof updateKhatmUI === 'function') updateKhatmUI();
        if (typeof updateTaubaUI === 'function') updateTaubaUI();
        if (typeof updateStarsUI === 'function') updateStarsUI();
        if (typeof checkDailyTasks === 'function') checkDailyTasks();
        if (typeof renderCollection === 'function') renderCollection();
        if (typeof updateAccountInfo === 'function') updateAccountInfo();
    }

    // ========== ОБРАБОТЧИКИ АВТОРИЗАЦИИ ==========
    document.getElementById('loginBtn')?.addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('authError');
        if (!email || !password) { errorEl.textContent = 'Введите email и пароль'; return; }
        try { 
            const r = await auth.signInWithEmailAndPassword(email, password); 
            currentUser = r.user; 
            closeAuthModal(); 
            await loadUserData(); 
        } catch (e) { 
            errorEl.textContent = 'Ошибка: ' + (e.message.includes('invalid-credential') ? 'Неверный email или пароль' : e.message);
        }
    });
    
    document.getElementById('registerBtn')?.addEventListener('click', async () => {
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        const errorEl = document.getElementById('authError');
        if (!email || !password) { errorEl.textContent = 'Введите email и пароль'; return; }
        if (password !== confirm) { errorEl.textContent = 'Пароли не совпадают'; return; }
        if (password.length < 6) { errorEl.textContent = 'Пароль должен быть не менее 6 символов'; return; }
        try { 
            const r = await auth.createUserWithEmailAndPassword(email, password); 
            currentUser = r.user;
            closeAuthModal(); 
            await createNewUserInFirestore(); 
        } catch (e) { 
            errorEl.textContent = 'Ошибка: ' + (e.message.includes('email-already-in-use') ? 'Email уже используется' : e.message);
        }
    });
    
    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        document.getElementById('loginForm').style.display = 'none'; 
        document.getElementById('registerForm').style.display = 'none'; 
        document.getElementById('forgotPasswordForm').style.display = 'block'; 
    });
    
    document.getElementById('backToLoginLink')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        document.getElementById('loginForm').style.display = 'block'; 
        document.getElementById('registerForm').style.display = 'none'; 
        document.getElementById('forgotPasswordForm').style.display = 'none'; 
    });
    
    document.getElementById('sendResetBtn')?.addEventListener('click', async () => { 
        const email = document.getElementById('resetEmail').value;
        const errorEl = document.getElementById('authError');
        if (!email) { errorEl.textContent = 'Введите email'; return; } 
        try { 
            await auth.sendPasswordResetEmail(email); 
            alert('Письмо отправлено на ' + email); 
            document.getElementById('loginForm').style.display = 'block'; 
            document.getElementById('forgotPasswordForm').style.display = 'none'; 
        } catch (e) { errorEl.textContent = 'Ошибка: ' + e.message; } 
    });
    
    document.getElementById('loginTabBtn')?.addEventListener('click', () => { 
        document.getElementById('loginForm').style.display = 'block'; 
        document.getElementById('registerForm').style.display = 'none'; 
        document.getElementById('forgotPasswordForm').style.display = 'none'; 
        document.getElementById('loginTabBtn').style.background = '#007AFF'; 
        document.getElementById('registerTabBtn').style.background = '#F2F2F7'; 
    });
    
    document.getElementById('registerTabBtn')?.addEventListener('click', () => { 
        document.getElementById('loginForm').style.display = 'none'; 
        document.getElementById('registerForm').style.display = 'block'; 
        document.getElementById('forgotPasswordForm').style.display = 'none'; 
        document.getElementById('registerTabBtn').style.background = '#007AFF'; 
        document.getElementById('loginTabBtn').style.background = '#F2F2F7'; 
    });
    
    document.getElementById('continueAsGuest')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        closeAuthModal(); 
    });
    
    window.onclick = (e) => { if (e.target === authModal) closeAuthModal(); };
    
    auth.onAuthStateChanged(async (u) => { 
        currentUser = u; 
        if (!u) await signInAnonymously(); 
        else await loadUserData(); 
    });

    setInterval(() => saveLocalBackup(), 30000);
    window.addEventListener('beforeunload', () => saveLocalBackup());

    // ===== ЭКСПОРТ ДЛЯ МОДУЛЕЙ ЭТАПА 2 (СУНДУК, КОЛЕСО ФАТХ) =====
    // Прокси на userData чтобы внешние модули могли читать/менять stars и chestCards
    Object.defineProperty(window, 'userData', {
        get: () => userData,
        set: (v) => { userData = v; },
        configurable: true
    });
    window.saveData = function() {
        if (typeof saveUserData === 'function') saveUserData();
        saveLocalBackup();
    };
    // Экспорт Firebase для мультиплеер-модулей
    window._db = db;
    window._auth = auth;
    Object.defineProperty(window, '_currentUser', { get: () => currentUser, configurable: true });
    window.updateStarsDisplay = function() {
        // Обновить счётчик звёзд везде где он показывается
        const total = (userData.stars && userData.stars.totalStars) || 0;
        const el1 = document.getElementById('homeTodayStars');
        if (el1) el1.textContent = total;
        const el2 = document.getElementById('chestStarsBadge');
        if (el2) el2.textContent = total;
        // Если есть другие элементы с классом stars-display — тоже обновим
        document.querySelectorAll('[data-stars-display]').forEach(el => { el.textContent = total; });
    };
