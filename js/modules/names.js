// ========== КАРТОЧКИ ИМЁН АЛЛАХА ==========
const NAMES_CARDS = [
    { id: 'name1', name: 'Ар-Рахман', title: 'Милостивый', emoji: '🌟', type: 'names', rarity: 'rare', story: 'Ар-Рохма́н — Милостивый ко всем на этом свете.', condition: 'names_1', conditionText: 'Выучить 1 имя' },
    { id: 'name2', name: 'Ар-Рахим', title: 'Милосердный', emoji: '💚', type: 'names', rarity: 'rare', story: 'Ар-Рохи́м — Милостивый на том свете только к верующим.', condition: 'names_2', conditionText: 'Выучить 2 имени' },
    { id: 'name3', name: 'Аль-Малик', title: 'Владыка', emoji: '👑', type: 'names', rarity: 'rare', story: 'Аль-Малик — Владыка всего.', condition: 'names_3', conditionText: 'Выучить 3 имени' },
    { id: 'name4', name: 'Аль-Куддус', title: 'Святой', emoji: '✨', type: 'names', rarity: 'rare', story: 'Аль-Къудду́с — Свободный от недостатков.', condition: 'names_4', conditionText: 'Выучить 4 имени' },
    { id: 'name5', name: 'Ас-Салям', title: 'Миротворящий', emoji: '🕊️', type: 'names', rarity: 'rare', story: 'Ас-Саля́м — Дающий безопасность.', condition: 'names_5', conditionText: 'Выучить 5 имён' },
    { id: 'name6', name: 'Аль-Мумин', title: 'Верный', emoji: '🛡️', type: 'names', rarity: 'rare', story: 'Аль-Муъмин — Дающий надёжность и безопасность.', condition: 'names_6', conditionText: 'Выучить 6 имён' },
    { id: 'name7', name: 'Аль-Мухаймин', title: 'Хранитель', emoji: '👁️', type: 'names', rarity: 'rare', story: 'Аль-Мухаймин — Оберегающий и Свидетельствующий.', condition: 'names_7', conditionText: 'Выучить 7 имён' },
    { id: 'name8', name: 'Аль-Азиз', title: 'Могущественный', emoji: '💪', type: 'names', rarity: 'rare', story: 'Аль-1ази́з — Великий, Непобедимый.', condition: 'names_8', conditionText: 'Выучить 8 имён' },
    { id: 'name9', name: 'Аль-Джаббар', title: 'Могучий', emoji: '🌋', type: 'names', rarity: 'rare', story: 'Аль-Джабба́р — Обладающий силой.', condition: 'names_9', conditionText: 'Выучить 9 имён' },
    { id: 'name10', name: '10 Имён', title: 'Первые 10', emoji: '📜', type: 'names', rarity: 'epic', story: 'Вы выучили 10 Прекрасных Имён Аллаха!', condition: 'names_10', conditionText: 'Выучить 10 имён' },
    { id: 'name20', name: '20 Имён', title: 'Знающий', emoji: '📚', type: 'names', rarity: 'epic', story: '20 Имён Аллаха выучено!', condition: 'names_20', conditionText: 'Выучить 20 имён' },
    { id: 'name30', name: '30 Имён', title: 'Углублённый', emoji: '🔮', type: 'names', rarity: 'epic', story: '30 Имён Аллаха! Вы углубляетесь в познание.', condition: 'names_30', conditionText: 'Выучить 30 имён' },
    { id: 'name40', name: '40 Имён', title: 'Постоянный', emoji: '🌙', type: 'names', rarity: 'epic', story: '40 Имён Аллаха! Ваше постоянство впечатляет.', condition: 'names_40', conditionText: 'Выучить 40 имён' },
    { id: 'name50', name: '50 Имён', title: 'Усердный', emoji: '🏅', type: 'names', rarity: 'legendary', story: 'Половина Имён Аллаха!', condition: 'names_50', conditionText: 'Выучить 50 имён' },
    { id: 'name60', name: '60 Имён', title: 'Посвящённый', emoji: '🎯', type: 'names', rarity: 'legendary', story: '60 Имён Аллаха! Вы посвящены в тайны.', condition: 'names_60', conditionText: 'Выучить 60 имён' },
    { id: 'name70', name: '70 Имён', title: 'Просветлённый', emoji: '💡', type: 'names', rarity: 'legendary', story: '70 Имён Аллаха! Свет знания наполняет вас.', condition: 'names_70', conditionText: 'Выучить 70 имён' },
    { id: 'name75', name: '75 Имён', title: 'Преданный', emoji: '💫', type: 'names', rarity: 'legendary', story: '75 Имён Аллаха!', condition: 'names_75', conditionText: 'Выучить 75 имён' },
    { id: 'name80', name: '80 Имён', title: 'Возвышенный', emoji: '⬆️', type: 'names', rarity: 'legendary', story: '80 Имён Аллаха! Вы возвышаетесь в знании.', condition: 'names_80', conditionText: 'Выучить 80 имён' },
    { id: 'name90', name: '90 Имён', title: 'Приближенный', emoji: '🤲', type: 'names', rarity: 'legendary', story: '90 Имён Аллаха! Вы приближаетесь к завершению.', condition: 'names_90', conditionText: 'Выучить 90 имён' },
    { id: 'name99', name: '99 Имён', title: 'Хранитель', emoji: '👑', type: 'names', rarity: 'mythic', story: 'Все 99 Прекрасных Имён Аллаха! Вы — хранитель знаний.', condition: 'names_99', conditionText: 'Выучить все 99 имён' }
];

// Добавляем карточки в общий массив, если они ещё не добавлены
setTimeout(() => {
    if (typeof ALL_COLLECTION_CARDS !== 'undefined') {
        NAMES_CARDS.forEach(card => {
            if (!ALL_COLLECTION_CARDS.find(c => c.id === card.id)) {
                ALL_COLLECTION_CARDS.push(card);
            }
        });
        console.log('✅ Карточки имён добавлены в ALL_COLLECTION_CARDS');
    }
    
    // Также добавляем в ALL_CARDS, если он есть
    if (typeof ALL_CARDS !== 'undefined') {
        NAMES_CARDS.forEach(card => {
            if (!ALL_CARDS.find(c => c.id === card.id)) {
                ALL_CARDS.push(card);
            }
        });
    }
}, 100);

// ========== СПИСОК 99 ИМЁН ==========
const NAMES_OF_ALLAH = [
    {num:1,arabic:"الرَّحْمَنُ",translit:"Ар-Рохма́н",translation:"Милостивый ко всем на этом свете",chechen:"Дуьненчохь бусулбанах,керстанах а цхьатерра къинхетам беш Верг"},
    {num:2,arabic:"الرَّحِيمُ",translit:"Ар-Рохи́м",translation:"Милостивый на том свете только к верующим",chechen:"Къинхетам дукха болуш, эхартахь къаьсттина бусулба нахах къинхетам бийр болуш Верг"},
    {num:3,arabic:"الْمَلِكُ",translit:"Аль-Малик",translation:"Владыка всего",chechen:"Паччахь. Стигланийн а, лаьттанийн а Паччахь"},
    {num:4,arabic:"الْقُدُّوسُ",translit:"Аль-Къудду́с",translation:"Свободный от недостатков",chechen:"Кхачамбацарех ц1ена Верг"},
    {num:5,arabic:"السَّلَامُ",translit:"Ас-Саля́м",translation:"Дающий безопасность",chechen:"Массо а вочух ц1ена Верг, Шен халкъашна ма́шар луш верг"},
    {num:6,arabic:"الْمُؤْمِنُ",translit:"Аль-Муъмин",translation:"Дающий надёжность",chechen:"Те́шаме верг, Шен лайш тешаме беш верг"},
    {num:7,arabic:"الْمُهَيْمِنُ",translit:"Аль-Мухаймин",translation:"Подчиняющий себе",chechen:"Массо хlума лардеш верг"},
    {num:8,arabic:"الْعَزِيزُ",translit:"Аль-1ази́з",translation:"Великий, Непобедимый",chechen:"Веза верг, уггаре а чlо́гlа ницlкъ берг"},
    {num:9,arabic:"الْجَبَّارُ",translit:"Аль-Джабба́р",translation:"Обладающий силой",chechen:"Нуьцкъалла верг, Уггаре онда"},
    {num:10,arabic:"الْمُتَكَبِّرُ",translit:"Аль-Мутакаббир",translation:"Обладатель истинного величия",chechen:"Хила хьакъ долуш Кура верг"},
    {num:11,arabic:"الْخَالِقُ",translit:"Аль-Хо́лик",translation:"Создатель",chechen:"Кхоллархо, масо а хlума кхоллар"},
    {num:12,arabic:"الْبَارِئُ",translit:"Аль-Ба́риъ",translation:"Творец",chechen:"Йо́цучуьра хlуманаш хуьлуьйтуш Верг"},
    {num:13,arabic:"الْمُصَوِّرُ",translit:"Аль-Мусоввир",translation:"Придающий всему форму",chechen:"Сурт хуьлуьйтург Ву массо а хlуманна"},
    {num:14,arabic:"الْغَفَّارُ",translit:"Аль-Гоффа́р",translation:"Прощающий и Скрывающий грехи",chechen:"Дукха гечдеш волу Дела"},
    {num:15,arabic:"الْقَهَّارُ",translit:"Аль-Къохха́р",translation:"Уничтожающий непослушных",chechen:"Массо а хӀума Шен Паччахьаллийна НуьцӀкъана кӀела далийнарг"},
    {num:16,arabic:"الْوَهَّابُ",translit:"Аль-Вахха́б",translation:"Дарующий безвозмездно",chechen:"Шен лайшна совгlаташ а, ниlматаш а ца кхоош луш верг"},
    {num:17,arabic:"الرَّزَّاقُ",translit:"Ар-Розза́къ",translation:"Дающий блага и пропитание",chechen:"Рицкъ луш верг"},
    {num:18,arabic:"الْفَتَّاحُ",translit:"Аль-Фатта́хь",translation:"Открывающий врата добра и блага",chechen:"Схьадоьллуш Верг"},
    {num:19,arabic:"الْعَلِيمُ",translit:"Аль-1али́м",translation:"Всезнающий",chechen:"Массо а хlума хууш Верг"},
    {num:20,arabic:"الْقَابِضُ",translit:"Аль-Къо́бид",translation:"Сжимающий блага",chechen:"Шен лайшха рицкъа гатдеш Верг"},
    {num:21,arabic:"الْبَاسِطُ",translit:"Аль-Ба́сит",translation:"Расширяющий блага",chechen:"Шен лайшха рицкъана шорто еш Верг"},
    {num:22,arabic:"الْخَافِضُ",translit:"Аль-Хо́фид",translation:"Унижающий неверующих",chechen:"Керстаналла динарг охьатаlош верг"},
    {num:23,arabic:"الرَّافِعُ",translit:"Ар-Ро́фи1",translation:"Возвышающий верующих",chechen:"Иман диллинарг лакха воккхуш Верг"},
    {num:24,arabic:"الْمُعِزُّ",translit:"Аль-Му1изз",translation:"Возвеличивающий",chechen:"Сийлалла Шен лайшха луш верг"},
    {num:25,arabic:"الْمُذِلُّ",translit:"Аль-Музилль",translation:"Принижающий",chechen:"Сийсазалла Шен луучунна хуьлуьйтуш верг"},
    {num:26,arabic:"السَّمِيعُ",translit:"Ас-Сами́1",translation:"Всеслышащий",chechen:"Массо х1ума хезаш Верг"},
    {num:27,arabic:"الْبَصِيرُ",translit:"Аль-Басы́р",translation:"Всевидящий",chechen:"Массо х1ума гуш Верг"},
    {num:28,arabic:"الْحَكَمُ",translit:"Аль-Хьакам",translation:"Высший судья",chechen:"Шен лайшна юкъахь нийса хьукм деш верг"},
    {num:29,arabic:"الْعَدْلُ",translit:"Аль-1Адль",translation:"Справедливый",chechen:"Нийсо еш верг"},
    {num:30,arabic:"اللَّطِيفُ",translit:"Аль-Лат1ы́ф",translation:"Оказывающий милость",chechen:"Дика хуьлуш верг Шен лаьшца"},
    {num:31,arabic:"الْخَبِيرُ",translit:"Аль-Хоби́р",translation:"Всеведущий",chechen:"Шех цхьа а хlума къайла ца долуш верг"},
    {num:32,arabic:"الْحَلِيمُ",translit:"Аль-Хьали́м",translation:"Снисходительный",chechen:"Таlзар дан сихлуш воцург"},
    {num:33,arabic:"الْعَظِيمُ",translit:"Аль-1азы́м",translation:"Величайший",chechen:"Сийлахь-Воккха хиларан уггаре а лакхара куц долуш"},
    {num:34,arabic:"الْغَفُورُ",translit:"Аль-Гофу́р",translation:"Много Прощающий",chechen:"Даккхийчу къиношна дукха Гечдийриг"},
    {num:35,arabic:"الشَّكُورُ",translit:"Аш-Шаку́р",translation:"Вознаграждающий больше заслуженного",chechen:"Дика lамалш совйохург"},
    {num:36,arabic:"الْعَلِيُّ",translit:"Аль-1алий",translation:"Возвышенный",chechen:"Массо хlуманна тlехь лаккхалла Шена ерг"},
    {num:37,arabic:"الْكَبِيرُ",translit:"Аль-Каби́р",translation:"Великий",chechen:"Массо хlуманал воккха верг"},
    {num:38,arabic:"الْحَفِيظُ",translit:"Аль-Хьафи́з",translation:"Оберегающий",chechen:"Стигланаш а, латта а лардийриг"},
    {num:39,arabic:"الْمُقِيتُ",translit:"Аль-Мукъи́т",translation:"Создатель благ",chechen:"Массо хIуманна тIехь ницкъ кхочуш верг"},
    {num:40,arabic:"الْحَسِيبُ",translit:"Аль-Хьаси́б",translation:"Берущий отчёт",chechen:"Шен лайшна хьесап дийриг"},
    {num:41,arabic:"الْجَلِيلُ",translit:"Аль-Джали́ль",translation:"Обладатель величайших атрибутов",chechen:"Сийлахь-Воккха верг"},
    {num:42,arabic:"الْكَرِيمُ",translit:"Аль-Кари́м",translation:"Щедрейший",chechen:"Шен лайшна дуккха диканаш дарехь Комаьрша Верг"},
    {num:43,arabic:"الرَّقِيبُ",translit:"Ар-Рокъи́б",translation:"Наблюдающий",chechen:"Шех цхьа х1ума къайла цадолуш Верг"},
    {num:44,arabic:"الْمُجِيبُ",translit:"Аль-Муджи́б",translation:"Принимающий молитвы",chechen:"Шега до1а динчунна жоп луш Верг"},
    {num:45,arabic:"الْوَاسِعُ",translit:"Аль-Ва́си1",translation:"Обладатель милости и знаний",chechen:"Шен комаьршо, ни1маташ шорта долуш Верг"},
    {num:46,arabic:"الْحَكِيمُ",translit:"Аль-Хьаки́м",translation:"Обладатель мудрости",chechen:"Массо х1ума нийса, говза а деш Верг"},
    {num:47,arabic:"الْوَدُودُ",translit:"Аль-Ваду́д",translation:"Любящий верующих",chechen:"Шен лайшна дика дан лууш Верг"},
    {num:48,arabic:"الْمَجِيدُ",translit:"Аль-Маджи́д",translation:"Самый почётный",chechen:"Дерриге сийлаллийн куьцаш Шегахь долуш Верг"},
    {num:49,arabic:"الْبَاعِثُ",translit:"Аль-Ба́1ис",translation:"Воскрешающий после смерти",chechen:"Халкъ деллачул т1аьхьа дендийр долуш Верг"},
    {num:50,arabic:"الشَّهِيدُ",translit:"Аш-Шахи́д",translation:"Свидетель всему",chechen:"Шена хаарха цхьа а х1ума къайлах доцуш Верг"},
    {num:51,arabic:"الْحَقُّ",translit:"Аль-Хьаккъ",translation:"Истинный",chechen:"Ц1енна бакъо Шегахь ерг"},
    {num:52,arabic:"الْوَكِيلُ",translit:"Аль-Ваки́ль",translation:"Покровитель",chechen:"1алашдешверг, лардешверг"},
    {num:53,arabic:"الْقَوِيُّ",translit:"Аль-Къавий",translation:"Сильнейший",chechen:"Ондаверг, ницкъберг"},
    {num:54,arabic:"الْمَتِينُ",translit:"Аль-Мати́н",translation:"Прочный и Сильный",chechen:"Г1о оьшушвоцург, ч1ог1аверг"},
    {num:55,arabic:"الْوَلِيُّ",translit:"Аль-Валий",translation:"Поручитель",chechen:"Гергарниг, тешамлург"},
    {num:56,arabic:"الْحَمِيدُ",translit:"Аль-Хьами́д",translation:"Славный, Достойный похвал",chechen:"Массо а хастамашна хьакъверг"},
    {num:57,arabic:"الْمُحْصِي",translit:"Аль-Мухсый",translation:"Считающий",chechen:"Дерригенна а хьесапдешверг"},
    {num:58,arabic:"الْمُبْدِئُ",translit:"Аль-Мубдиъ",translation:"Начинающий",chechen:"Х1ума д1адолошверг"},
    {num:59,arabic:"الْمُعِيدُ",translit:"Аль-Му1и́д",translation:"Возвращающий",chechen:"Духадерзошверг"},
    {num:60,arabic:"الْمُحْيِي",translit:"Аль-Мухьи́",translation:"Оживляющий",chechen:"Х1ума денъешверг"},
    {num:61,arabic:"الْمُمِيتُ",translit:"Аль-Муми́т",translation:"Умерщвляющий",chechen:"Садолуьйтушверг, х1ума дуьйшверг"},
    {num:62,arabic:"الْحَيُّ",translit:"Аль-Хьайй",translation:"Вечно живой",chechen:"Даима а дийнаверг"},
    {num:63,arabic:"الْقَيُّومُ",translit:"Аль-Къайю́м",translation:"Сущий, Самостоятельный",chechen:"Шен халкъан хьашт кхочушдарехь лаьтташверг"},
    {num:64,arabic:"الْوَاجِدُ",translit:"Аль-Ва́джид",translation:"Богатый",chechen:"Хьалдолушверг"},
    {num:65,arabic:"الْمَاجِدُ",translit:"Аль-Ма́джид",translation:"Славный",chechen:"Шен хиларехь кхачамеверг"},
    {num:66,arabic:"الْوَاحِدُ الْأَحَدُ",translit:"Аль-Ва́хид Аль-Ахад",translation:"Единственный",chechen:"Шен хиларехь цхьаъ бен воцург"},
    {num:67,arabic:"الصَّمَدُ",translit:"Ас-Сомад",translation:"Вечный",chechen:"Даима верг"},
    {num:68,arabic:"الْقَادِرُ",translit:"Аль-Къо́дир",translation:"Всемогущий",chechen:"Массо а х1уманна т1ехь никъкхочург"},
    {num:69,arabic:"الْمُقْتَدِرُ",translit:"Аль-Мукътадир",translation:"Могущественный",chechen:"Ницкъ лушверг"},
    {num:70,arabic:"الْمُقَدِّمُ",translit:"Аль-Мукъаддим",translation:"Выдвигающий вперёд",chechen:"Х1ума хьалхатоттушверг"},
    {num:71,arabic:"الْمُؤَخِّرُ",translit:"Аль-Муаххир",translation:"Отодвигающий назад",chechen:"Т1аьхьа татта хьакъ верг т1аьхьавуьтуш Верг"},
    {num:72,arabic:"الْأَوَّلُ",translit:"Аль-Авваль",translation:"Безначальный",chechen:"Шел хьалха цхьа х1ума доцуш хьалхара Верг"},
    {num:73,arabic:"الْآخِرُ",translit:"Аль-А́хир",translation:"Бесконечный",chechen:"Шел т1аьхьа цхьа х1ума доцуш т1аьхьа вуьсур Верг"},
    {num:74,arabic:"الظَّاهِرُ",translit:"Аз-Зо́хир",translation:"Явный",chechen:"Массо х1уманал лакхахь Верг"},
    {num:75,arabic:"الْبَاطِنُ",translit:"Аль-Ба́тын",translation:"Скрытый",chechen:"Цхьанне хьекъал т1екхуьур доцуш къайлаха Верг"},
    {num:76,arabic:"الْوَالِي",translit:"Аль-Ва́ли",translation:"Правящий",chechen:"1аламийн доладеш Верг"},
    {num:77,arabic:"الْمُتَعَالِي",translit:"Аль-Мута1а́ли",translation:"Свободный от недостатков",chechen:"Массо эшамах ц1ена Верг"},
    {num:78,arabic:"الْبَرُّ",translit:"Аль-Барр",translation:"Благостный",chechen:"Дика дар дукха долуш Верг"},
    {num:79,arabic:"التَّوَّابُ",translit:"Ат-Тавва́б",translation:"Принимающий покаяние",chechen:"Шен лешкара тоба къобалдеш Верг"},
    {num:80,arabic:"الْمُنْتَقِمُ",translit:"Аль-Мунтакъим",translation:"Воздающий непокорным",chechen:"Зуламхошкара ч1ир оьцуш Верг"},
    {num:81,arabic:"الْعَفُوُّ",translit:"Аль-1афувв",translation:"Прощающий",chechen:"Къиношна гечдеш Верг"},
    {num:82,arabic:"الرَّؤُوفُ",translit:"Ар-Рау́ф",translation:"Сострадательный",chechen:"Шен лайшца ч1ог1а къинхетаме Верг"},
    {num:83,arabic:"مَالِكُ الْمُلْكِ",translit:"Ма́ликуль-Мульк",translation:"Владыка всего сущего",chechen:"Массо х1уманна т1ехь куьйгалла дан ницкъ кхочуш Верг"},
    {num:84,arabic:"ذُو الْجَلَالِ وَالْإِكْرَامِ",translit:"Зуль-Джаля́ли валь-Икра́м",translation:"Обладатель Величия и Щедрости",chechen:"Сийлахь-воккха Верг"},
    {num:85,arabic:"الْمُقْسِطُ",translit:"Аль-Мукъсит",translation:"Справедливый",chechen:"Шен лайшна юккъехь нийсо еш Верг"},
    {num:86,arabic:"الْجَامِعُ",translit:"Аль-Джа́ми1",translation:"Собирающий",chechen:"Дерриге халкъ цхьана меттехь гулдийр Верг"},
    {num:87,arabic:"الْغَنِيُّ",translit:"Аль-Гоний",translation:"Богатый, ни в чём не Нуждающийся",chechen:"Шен халкъера х1умма ца оьшуш Верг"},
    {num:88,arabic:"الْمُغْنِي",translit:"Аль-Мугни́",translation:"Обогащающий",chechen:"Шен лешха хьал долуш веш Верг"},
    {num:89,arabic:"الْمَانِعُ",translit:"Аль-Ма́ни1",translation:"Удерживающий",chechen:"Дог1маш х1аллакхиларан бахьанаш духатухуш Верг"},
    {num:90,arabic:"الضَّارُّ",translit:"Ад-До́рр",translation:"Лишающий благ",chechen:"Шен мостаг1ашна та1зар деш Верг"},
    {num:91,arabic:"النَّافِعُ",translit:"Ан-На́фи1",translation:"Приносящий пользу",chechen:"Шена муьт1ахь болчарна дика деш Верг"},
    {num:92,arabic:"النُّورُ",translit:"Ан-Ну́р",translation:"Дарующий свет веры",chechen:"Стигланан, лаьттан а ох1ланаш нисбеш Верг"},
    {num:93,arabic:"الْهَادِي",translit:"Аль-Ха́ди",translation:"Направляющий на путь истины",chechen:"Массо х1ума дика долчунна т1е нисдеш Верг"},
    {num:94,arabic:"الْبَدِيعُ",translit:"Аль-Бади́1",translation:"Создающий наилучшим образом",chechen:"Кхоллар долийнарг"},
    {num:95,arabic:"الْبَاقِي",translit:"Аль-Ба́къи",translation:"Бесконечный",chechen:"Даима хин Верг"},
    {num:96,arabic:"الْوَارِثُ",translit:"Аль-Ва́рис",translation:"Истинно Наследующий",chechen:"Массо х1ума д1адаьлча а Ша т1аьхьавуьсур Верг"},
    {num:97,arabic:"الرَّشِيدُ",translit:"Ар-Раши́д",translation:"Направляющий на правильный путь",chechen:"Шен лайш маслахьате долчу х1уманна т1е нисбеш Верг"},
    {num:98,arabic:"الصَّبُورُ",translit:"Ас-Сабу́р",translation:"Терпеливый",chechen:"1есачу нахана та1зар дан сих цалуш Верг"},
    {num:99,arabic:"اللَّهُ",translit:"Алла́х",translation:"Аллах — Единый Бог",chechen:"Цхьаъ бен воцу Дела"}
];

let showChechen = true;

function renderNamesOfAllah() {
    const c = document.getElementById('namesListContainer'); if (!c) return;
    const learned = userData.namesLearned || [];
    document.getElementById('namesLearnedCount').textContent = `${learned.length} / 99`;
    document.getElementById('namesProgressFill').style.width = `${(learned.length/99)*100}%`;
    let h = '';
    NAMES_OF_ALLAH.forEach(n => {
        const isL = learned.includes(n.num);
        h += `<div style="background: ${isL ? '#FFF9E6' : '#FFFFFF'}; border-radius: 16px; padding: 16px; margin-bottom: 12px; border-left: 4px solid ${isL ? '#FFD700' : '#007AFF'};">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;"><span style="background: ${isL ? '#FFD700' : '#007AFF'}; color: ${isL ? '#1C1C1E' : 'white'}; padding: 4px 12px; border-radius: 30px; font-weight: 600;">${n.num}</span><span style="font-family: 'Amiri', serif; font-size: 1.8rem; direction: rtl; flex: 1; text-align: right;">${n.arabic}</span></div>
            <div style="font-weight: 600; color: #1C1C1E; margin-bottom: 4px;">${n.translit}</div>
            <div style="color: #3A3A3C; margin-bottom: 8px;">${n.translation}</div>
            ${showChechen ? `<div style="color: #8E8E93; font-style: italic; padding: 8px; background: #F2F2F7; border-radius: 12px; font-size: 0.85rem;"><i class="fas fa-globe"></i> ${n.chechen}</div>` : ''}
            <div style="margin-top: 12px;"><label style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" class="name-learned-check" data-num="${n.num}" ${isL ? 'checked' : ''} style="width: 22px; height: 22px; accent-color: #34C759;"><span><i class="fas fa-check-circle" style="color: #34C759;"></i> Выучил(а)</span></label></div>
        </div>`;
    });
    c.innerHTML = h;
    document.querySelectorAll('.name-learned-check').forEach(cb => cb.addEventListener('change', e => {
        const num = parseInt(cb.dataset.num);
        if (cb.checked) { 
            if (!userData.namesLearned.includes(num)) { 
                userData.namesLearned.push(num); 
                addXP(20); 
            } 
        } else { 
            userData.namesLearned = userData.namesLearned.filter(n => n !== num); 
        }
        saveUserData(); 
        renderNamesOfAllah(); 
        checkNamesCards(); 
        updateHomeWidgets();
    }));
}

function checkNamesCards() {
    const learned = userData.namesLearned?.length || 0;
    if (!userData.unlockedCards) userData.unlockedCards = [];
    
    // Разблокируем карточки по количеству имён
    const milestones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 75, 80, 90, 99];
    milestones.forEach(m => {
        if (learned >= m) {
            const cardId = `name${m}`;
            if (!userData.unlockedCards.includes(cardId)) {
                userData.unlockedCards.push(cardId);
                showNotification(`🎴 Карточка «${m} Имён» добавлена в коллекцию!`);
            }
        }
    });
    
    saveUserData();
    
    if (typeof updateCollectionBadge === 'function') {
        updateCollectionBadge();
    }
    
    if (typeof currentScreen !== 'undefined' && currentScreen === 'collection' && typeof renderCollection === 'function') {
        renderCollection();
    }
}

// Функция разблокировки карточки
if (typeof unlockCardIfNotHave !== 'function') {
    window.unlockCardIfNotHave = function(cardId) {
        if (!userData.unlockedCards) userData.unlockedCards = [];
        if (!userData.unlockedCards.includes(cardId)) {
            userData.unlockedCards.push(cardId);
            saveUserData();
            showNotification(`🎴 Новая карточка в коллекции!`);
            if (typeof updateCollectionBadge === 'function') updateCollectionBadge();
            if (typeof currentScreen !== 'undefined' && currentScreen === 'collection' && typeof renderCollection === 'function') renderCollection();
        }
    };
}

document.getElementById('namesSearchInput')?.addEventListener('input', e => {
    const s = e.target.value.toLowerCase();
    document.querySelectorAll('#namesListContainer > div').forEach(c => c.style.display = c.textContent.toLowerCase().includes(s) ? 'block' : 'none');
});

document.getElementById('toggleChechenBtn')?.addEventListener('click', () => {
    showChechen = !showChechen; 
    userData.settings.showChechen = showChechen;
    document.getElementById('toggleChechenText').textContent = showChechen ? 'Скрыть чеченский перевод' : 'Показать чеченский перевод';
    renderNamesOfAllah(); 
    saveUserData();
});

setTimeout(() => renderNamesOfAllah(), 200);
