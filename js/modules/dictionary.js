const DICTIONARY = [
    { term: 'Аллах', arabic: 'اللَّهُ', definition: 'Единый Бог, Творец всего сущего.' }, { term: 'Ислам', arabic: 'الإِسْلَامُ', definition: 'Покорность воле Аллаха, религия всех пророков.' },
    { term: 'Иман', arabic: 'الإِيمَانُ', definition: 'Вера в Аллаха, Его ангелов, писания, пророков, Судный день и предопределение.' }, { term: 'Сунна', arabic: 'السُّنَّةُ', definition: 'Путь, пример и учение Пророка Мухаммада ﷺ.' },
    { term: 'Фард', arabic: 'الفَرْضُ', definition: 'Обязательное действие, за выполнение — награда, за оставление — грех.' }, { term: 'Ваджиб', arabic: 'الوَاجِبُ', definition: 'Необходимое действие, близкое к обязательному.' },
    { term: 'Мустахабб', arabic: 'المُسْتَحَبُّ', definition: 'Рекомендуемое, одобряемое действие.' }, { term: 'Мубах', arabic: 'المُبَاحُ', definition: 'Дозволенное действие, без награды и греха.' },
    { term: 'Макрух', arabic: 'المَكْرُوهُ', definition: 'Нежелательное действие, лучше избегать.' }, { term: 'Харам', arabic: 'الحَرَامُ', definition: 'Запретное действие, за совершение — грех.' },
    { term: 'Зикр', arabic: 'الذِّكْرُ', definition: 'Поминание Аллаха сердцем и языком.' }, { term: 'Дуа', arabic: 'الدُّعَاءُ', definition: 'Мольба, обращение к Аллаху с просьбой.' },
    { term: 'Тауба', arabic: 'التَّوْبَةُ', definition: 'Покаяние перед Аллахом за совершённые грехи.' }, { term: 'Таква', arabic: 'التَّقْوَى', definition: 'Богобоязненность, осознание присутствия Аллаха.' }
];
function renderDictionary(searchTerm = '') {
    const container = document.getElementById('dictionaryList'); if (!container) return;
    const filtered = DICTIONARY.filter(d => d.term.toLowerCase().includes(searchTerm.toLowerCase()) || d.definition.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filtered.length === 0) { container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E8E93;">Ничего не найдено</div>'; return; }
    container.innerHTML = filtered.map(d => `<div style="background:#F2F2F7;border-radius:16px;padding:16px;"><div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;"><span style="font-weight:700;font-size:1.2rem;">${d.term}</span><span style="font-family:'Amiri',serif;color:#007AFF;">${d.arabic}</span></div><p style="line-height:1.5;">${d.definition}</p></div>`).join('');
}
document.getElementById('dictSearchInput')?.addEventListener('input', e => renderDictionary(e.target.value));
setTimeout(() => renderDictionary(), 300);
