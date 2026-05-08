// ========== КОРАН v3 — БЕЗ ТАДЖВИДА, С КНОПКОЙ НАЗАД ==========
(function(){
var S=[
{n:1,a:'الفاتحة',r:'Аль-Фатиха',c:7,t:'Мекканская'},{n:2,a:'البقرة',r:'Аль-Бакара',c:286,t:'Мединская'},
{n:3,a:'آل عمران',r:'Аль Имран',c:200,t:'Мединская'},{n:4,a:'النساء',r:'Ан-Ниса',c:176,t:'Мединская'},
{n:5,a:'المائدة',r:'Аль-Маида',c:120,t:'Мединская'},{n:6,a:'الأنعام',r:'Аль-Анам',c:165,t:'Мекканская'},
{n:7,a:'الأعراف',r:'Аль-Араф',c:206,t:'Мекканская'},{n:8,a:'الأنفال',r:'Аль-Анфаль',c:75,t:'Мединская'},
{n:9,a:'التوبة',r:'Ат-Тауба',c:129,t:'Мединская'},{n:10,a:'يونس',r:'Юнус',c:109,t:'Мекканская'},
{n:11,a:'هود',r:'Худ',c:123,t:'Мекканская'},{n:12,a:'يوسف',r:'Юсуф',c:111,t:'Мекканская'},
{n:13,a:'الرعد',r:'Ар-Раад',c:43,t:'Мединская'},{n:14,a:'ابراهيم',r:'Ибрахим',c:52,t:'Мекканская'},
{n:15,a:'الحجر',r:'Аль-Хиджр',c:99,t:'Мекканская'},{n:16,a:'النحل',r:'Ан-Нахль',c:128,t:'Мекканская'},
{n:17,a:'الإسراء',r:'Аль-Исра',c:111,t:'Мекканская'},{n:18,a:'الكهف',r:'Аль-Кахф',c:110,t:'Мекканская'},
{n:19,a:'مريم',r:'Марьям',c:98,t:'Мекканская'},{n:20,a:'طه',r:'Та Ха',c:135,t:'Мекканская'},
{n:21,a:'الأنبياء',r:'Аль-Анбия',c:112,t:'Мекканская'},{n:22,a:'الحج',r:'Аль-Хадж',c:78,t:'Мединская'},
{n:23,a:'المؤمنون',r:'Аль-Муминун',c:118,t:'Мекканская'},{n:24,a:'النور',r:'Ан-Нур',c:64,t:'Мединская'},
{n:25,a:'الفرقان',r:'Аль-Фуркан',c:77,t:'Мекканская'},{n:26,a:'الشعراء',r:'Аш-Шуара',c:227,t:'Мекканская'},
{n:27,a:'النمل',r:'Ан-Намль',c:93,t:'Мекканская'},{n:28,a:'القصص',r:'Аль-Касас',c:88,t:'Мекканская'},
{n:29,a:'العنكبوت',r:'Аль-Анкабут',c:69,t:'Мекканская'},{n:30,a:'الروم',r:'Ар-Рум',c:60,t:'Мекканская'},
{n:31,a:'لقمان',r:'Лукман',c:34,t:'Мекканская'},{n:32,a:'السجدة',r:'Ас-Саджда',c:30,t:'Мекканская'},
{n:33,a:'الأحزاب',r:'Аль-Ахзаб',c:73,t:'Мединская'},{n:34,a:'سبإ',r:'Саба',c:54,t:'Мекканская'},
{n:35,a:'فاطر',r:'Фатыр',c:45,t:'Мекканская'},{n:36,a:'يس',r:'Йа Син',c:83,t:'Мекканская'},
{n:37,a:'الصافات',r:'Ас-Саффат',c:182,t:'Мекканская'},{n:38,a:'ص',r:'Сад',c:88,t:'Мекканская'},
{n:39,a:'الزمر',r:'Аз-Зумар',c:75,t:'Мекканская'},{n:40,a:'غافر',r:'Гафир',c:85,t:'Мекканская'},
{n:41,a:'فصلت',r:'Фуссилят',c:54,t:'Мекканская'},{n:42,a:'الشورى',r:'Аш-Шура',c:53,t:'Мекканская'},
{n:43,a:'الزخرف',r:'Аз-Зухруф',c:89,t:'Мекканская'},{n:44,a:'الدخان',r:'Ад-Духан',c:59,t:'Мекканская'},
{n:45,a:'الجاثية',r:'Аль-Джасия',c:37,t:'Мекканская'},{n:46,a:'الأحقاف',r:'Аль-Ахкаф',c:35,t:'Мекканская'},
{n:47,a:'محمد',r:'Мухаммад',c:38,t:'Мединская'},{n:48,a:'الفتح',r:'Аль-Фатх',c:29,t:'Мединская'},
{n:49,a:'الحجرات',r:'Аль-Худжурат',c:18,t:'Мединская'},{n:50,a:'ق',r:'Каф',c:45,t:'Мекканская'},
{n:51,a:'الذاريات',r:'Аз-Зарият',c:60,t:'Мекканская'},{n:52,a:'الطور',r:'Ат-Тур',c:49,t:'Мекканская'},
{n:53,a:'النجم',r:'Ан-Наджм',c:62,t:'Мекканская'},{n:54,a:'القمر',r:'Аль-Камар',c:55,t:'Мекканская'},
{n:55,a:'الرحمن',r:'Ар-Рахман',c:78,t:'Мединская'},{n:56,a:'الواقعة',r:'Аль-Вакиа',c:96,t:'Мекканская'},
{n:57,a:'الحديد',r:'Аль-Хадид',c:29,t:'Мединская'},{n:58,a:'المجادلة',r:'Аль-Муджадала',c:22,t:'Мединская'},
{n:59,a:'الحشر',r:'Аль-Хашр',c:24,t:'Мединская'},{n:60,a:'الممتحنة',r:'Аль-Мумтахана',c:13,t:'Мединская'},
{n:61,a:'الصف',r:'Ас-Сафф',c:14,t:'Мединская'},{n:62,a:'الجمعة',r:'Аль-Джумуа',c:11,t:'Мединская'},
{n:63,a:'المنافقون',r:'Аль-Мунафикун',c:11,t:'Мединская'},{n:64,a:'التغابن',r:'Ат-Тагабун',c:18,t:'Мединская'},
{n:65,a:'الطلاق',r:'Ат-Талак',c:12,t:'Мединская'},{n:66,a:'التحريم',r:'Ат-Тахрим',c:12,t:'Мединская'},
{n:67,a:'الملك',r:'Аль-Мульк',c:30,t:'Мекканская'},{n:68,a:'القلم',r:'Аль-Калям',c:52,t:'Мекканская'},
{n:69,a:'الحاقة',r:'Аль-Хакка',c:52,t:'Мекканская'},{n:70,a:'المعارج',r:'Аль-Мааридж',c:44,t:'Мекканская'},
{n:71,a:'نوح',r:'Нух',c:28,t:'Мекканская'},{n:72,a:'الجن',r:'Аль-Джинн',c:28,t:'Мекканская'},
{n:73,a:'المزمل',r:'Аль-Муззаммиль',c:20,t:'Мекканская'},{n:74,a:'المدثر',r:'Аль-Муддассир',c:56,t:'Мекканская'},
{n:75,a:'القيامة',r:'Аль-Кияма',c:40,t:'Мекканская'},{n:76,a:'الانسان',r:'Аль-Инсан',c:31,t:'Мединская'},
{n:77,a:'المرسلات',r:'Аль-Мурсалят',c:50,t:'Мекканская'},{n:78,a:'النبإ',r:'Ан-Наба',c:40,t:'Мекканская'},
{n:79,a:'النازعات',r:'Ан-Назиат',c:46,t:'Мекканская'},{n:80,a:'عبس',r:'Абаса',c:42,t:'Мекканская'},
{n:81,a:'التكوير',r:'Ат-Таквир',c:29,t:'Мекканская'},{n:82,a:'الانفطار',r:'Аль-Инфитар',c:19,t:'Мекканская'},
{n:83,a:'المطففين',r:'Аль-Мутаффифин',c:36,t:'Мекканская'},{n:84,a:'الانشقاق',r:'Аль-Иншикак',c:25,t:'Мекканская'},
{n:85,a:'البروج',r:'Аль-Бурудж',c:22,t:'Мекканская'},{n:86,a:'الطارق',r:'Ат-Тарик',c:17,t:'Мекканская'},
{n:87,a:'الأعلى',r:'Аль-Аъля',c:19,t:'Мекканская'},{n:88,a:'الغاشية',r:'Аль-Гашия',c:26,t:'Мекканская'},
{n:89,a:'الفجر',r:'Аль-Фаджр',c:30,t:'Мекканская'},{n:90,a:'البلد',r:'Аль-Балад',c:20,t:'Мекканская'},
{n:91,a:'الشمس',r:'Аш-Шамс',c:15,t:'Мекканская'},{n:92,a:'الليل',r:'Аль-Лейль',c:21,t:'Мекканская'},
{n:93,a:'الضحى',r:'Ад-Духа',c:11,t:'Мекканская'},{n:94,a:'الشرح',r:'Аш-Шарх',c:8,t:'Мекканская'},
{n:95,a:'التين',r:'Ат-Тин',c:8,t:'Мекканская'},{n:96,a:'العلق',r:'Аль-Алак',c:19,t:'Мекканская'},
{n:97,a:'القدر',r:'Аль-Кадр',c:5,t:'Мекканская'},{n:98,a:'البينة',r:'Аль-Баййина',c:8,t:'Мединская'},
{n:99,a:'الزلزلة',r:'Аз-Зальзаля',c:8,t:'Мединская'},{n:100,a:'العاديات',r:'Аль-Адият',c:11,t:'Мекканская'},
{n:101,a:'القارعة',r:'Аль-Кариа',c:11,t:'Мекканская'},{n:102,a:'التكاثر',r:'Ат-Такасур',c:8,t:'Мекканская'},
{n:103,a:'العصر',r:'Аль-Аср',c:3,t:'Мекканская'},{n:104,a:'الهمزة',r:'Аль-Хумаза',c:9,t:'Мекканская'},
{n:105,a:'الفيل',r:'Аль-Филь',c:5,t:'Мекканская'},{n:106,a:'قريش',r:'Курайш',c:4,t:'Мекканская'},
{n:107,a:'الماعون',r:'Аль-Маун',c:7,t:'Мекканская'},{n:108,a:'الكوثر',r:'Аль-Каусар',c:3,t:'Мекканская'},
{n:109,a:'الكافرون',r:'Аль-Кяфирун',c:6,t:'Мекканская'},{n:110,a:'النصر',r:'Ан-Наср',c:3,t:'Мединская'},
{n:111,a:'المسد',r:'Аль-Масад',c:5,t:'Мекканская'},{n:112,a:'الإخلاص',r:'Аль-Ихлас',c:4,t:'Мекканская'},
{n:113,a:'الفلق',r:'Аль-Фалак',c:5,t:'Мекканская'},{n:114,a:'الناس',r:'Ан-Нас',c:6,t:'Мекканская'}
];
var FONTS=[{id:'amiri',n:'Amiri',c:"'Amiri',serif"},{id:'scheherazade',n:'Scheherazade',c:"'Scheherazade',serif"},{id:'system',n:'Системный',c:"serif"}];
function gs(){try{return JSON.parse(localStorage.getItem('qr_s')||'{}')}catch(e){return{};}}
function ss(o){localStorage.setItem('qr_s',JSON.stringify(o));}
function gb(){try{return JSON.parse(localStorage.getItem('qr_bm')||'[]')}catch(e){return[];}}
function sb(b){localStorage.setItem('qr_bm',JSON.stringify(b));}
function ib(su,ay){return!!gb().find(function(b){return b.s===su&&b.a===ay;});}
function ab(su,ay){var b=gb();if(b.find(function(x){return x.s===su&&x.a===ay;}))return;b.push({s:su,a:ay,n:(S[su-1]||{}).r||'',t:Date.now()});sb(b);}
function rb(su,ay){sb(gb().filter(function(b){return!(b.s===su&&b.a===ay);}));}
function an(n){var d=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];return String(n).split('').map(function(c){return d[parseInt(c)];}).join('');}

var curSurah=0;
function closeQR(){document.body.classList.remove('qr-open');var o=document.getElementById('qrOverlay');if(o){o.classList.add('closing');setTimeout(function(){if(o.parentNode)o.remove();},300);}}
function mk(){var e=document.getElementById('qrOverlay');if(e)e.remove();document.body.classList.add('qr-open');var o=document.createElement('div');o.id='qrOverlay';o.className='qr-overlay';o.innerHTML='<div class="qr-bg"></div><div class="qr-content" id="qrC"></div><button class="qr-close" onclick="window._qClose();">✕</button>';return o;}
window._qClose=closeQR;

// СПИСОК СУР
window.openQuranReader=function(num){if(num){loadS(num);return;}curSurah=0;var o=mk();
var h='<div class="qr-header"><div class="qr-title">القرآن الكريم</div><div class="qr-subtitle">Священный Коран · 114 сур</div><input type="text" class="qr-search" placeholder="Поиск суры..." oninput="window._qF(this.value)"></div><div class="qr-toolbar"><button class="qr-tool-btn" onclick="window._qBM()">Закладки</button><button class="qr-tool-btn" onclick="window._qST()">Настройки</button></div><div id="qrList" class="qr-surah-list">';
S.forEach(function(s){h+='<div class="qr-surah-item" data-n="'+s.n+'" onclick="window._qL('+s.n+')"><div class="qr-surah-num">'+s.n+'</div><div class="qr-surah-info"><div class="qr-surah-name">'+s.r+'</div><div class="qr-surah-meta">'+s.t+' · '+s.c+' аятов</div></div><div class="qr-surah-arabic">'+s.a+'</div></div>';});
h+='</div>';o.querySelector('#qrC').innerHTML=h;document.body.appendChild(o);requestAnimationFrame(function(){o.classList.add('active');});};

window._qF=function(q){q=q.toLowerCase();document.querySelectorAll('.qr-surah-item').forEach(function(el){var n=parseInt(el.dataset.n),s=S[n-1],m=!q||s.r.toLowerCase().includes(q)||s.a.includes(q)||String(n).includes(q);el.style.display=m?'flex':'none';});};
window._qL=function(n){loadS(n);};

function loadS(num){
  curSurah=num;
  var o=document.getElementById('qrOverlay');
  if(!o){o=mk();document.body.appendChild(o);requestAnimationFrame(function(){o.classList.add('active');});}
  var c=document.getElementById('qrC');if(!c)return;
  c.innerHTML='<div class="qr-loading"><div class="qr-loading-spinner"></div><div class="qr-loading-text">Загрузка...</div></div>';
  c.scrollTop=0;
  // ВСЕГДА quran-uthmani (без таджвида)
  fetch('https://api.alquran.cloud/v1/surah/'+num+'/quran-uthmani')
  .then(function(r){return r.json();})
  .then(function(d){if(d.code!==200||!d.data)throw new Error('Ошибка');renderS(c,d.data,S[num-1],num);})
  .catch(function(err){c.innerHTML='<div class="qr-error"><div style="font-size:32px;margin-bottom:12px;color:rgba(255,255,255,.3);">✦</div><div>Не удалось загрузить</div><div style="font-size:12px;color:#888;margin:8px 0;">'+err.message+'</div><button class="qr-tool-btn" onclick="window._qL('+num+')">Повторить</button><button class="qr-tool-btn" style="margin-top:8px;" onclick="window.openQuranReader()">К списку</button></div>';});
}

function renderS(c,data,si,num){
  var ay=data.ayahs||[];var st=gs();var fs=st.fs||24;var fi=st.fi||'amiri';
  var fn=FONTS.find(function(f){return f.id===fi;})||FONTS[0];

  // Кнопка НАЗАД к списку сур (вверху)
  var h='<div style="padding:8px 0;"><button class="qr-tool-btn" onclick="window.openQuranReader()" style="width:100%;">← Список сур</button></div>';

  h+='<div class="qr-surah-header"><div class="qr-surah-header-name">'+si.r+'</div><div class="qr-surah-header-arabic">'+si.a+'</div><div class="qr-surah-header-meta">'+si.t+' · '+si.c+' аятов</div></div>';
  if(num!==9)h+='<div class="qr-bismillah" style="font-family:'+fn.c+';font-size:'+(fs+4)+'px;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>';
  h+='<div class="qr-ayahs" style="font-family:'+fn.c+';font-size:'+fs+'px;">';
  ay.forEach(function(a){var an2=a.numberInSurah,bm=ib(num,an2);
    h+='<div class="qr-ayah"><div class="qr-ayah-num-label">'+num+':'+an2+'</div><div class="qr-ayah-text">'+a.text+' <span class="qr-ayah-circle">'+an(an2)+'</span></div><div class="qr-ayah-actions"><button class="qr-ayah-btn '+(bm?'bookmarked':'')+'" onclick="window._qTB('+num+','+an2+',this);">'+(bm?'Сохранено':'Закладка')+'</button></div></div>';
  });
  h+='</div>';
  h+='<div class="qr-nav">';
  if(num>1)h+='<button class="qr-nav-btn" onclick="window._qL('+(num-1)+')">'+S[num-2].r+'</button>';
  h+='<button class="qr-nav-btn" onclick="window.openQuranReader()">Все суры</button>';
  if(num<114)h+='<button class="qr-nav-btn" onclick="window._qL('+(num+1)+')">'+S[num].r+'</button>';
  h+='</div>';
  h+='<div class="qr-bottom-bar"><button class="qr-bar-btn" onclick="window.openQuranReader()">Суры</button><button class="qr-bar-btn" onclick="window._qBM()">Закладки</button><button class="qr-bar-btn" onclick="window._qST()">Настройки</button></div>';
  c.innerHTML=h;c.scrollTop=0;
  if(typeof window.completeDailyTask==='function')window.completeDailyTask('read_quran');
}

window._qTB=function(su,ay,btn){if(ib(su,ay)){rb(su,ay);if(btn){btn.textContent='Закладка';btn.classList.remove('bookmarked');}}else{ab(su,ay);if(btn){btn.textContent='Сохранено';btn.classList.add('bookmarked');}}};

window._qBM=function(){var c=document.getElementById('qrC');if(!c)return;var bm=gb();
var h='<div style="padding:8px 0;"><button class="qr-tool-btn" onclick="'+(curSurah?'window._qL('+curSurah+')':'window.openQuranReader()')+'" style="width:100%;">← Назад</button></div>';
h+='<div class="qr-header"><div class="qr-title">Закладки</div><div class="qr-subtitle">'+bm.length+' сохранено</div></div>';
if(!bm.length){h+='<div class="qr-error"><div style="font-size:14px;">Закладок пока нет</div><div style="font-size:12px;color:#888;margin:8px 0;">Нажмите «Закладка» рядом с аятом</div></div>';}
else{h+='<div class="qr-surah-list">';bm.forEach(function(b){h+='<div class="qr-surah-item" onclick="window._qL('+b.s+')"><div class="qr-surah-num">'+b.s+':'+b.a+'</div><div class="qr-surah-info"><div class="qr-surah-name">'+(b.n||'Сура '+b.s)+'</div><div class="qr-surah-meta">Аят '+b.a+'</div></div><button onclick="event.stopPropagation();window._qRB('+b.s+','+b.a+');" class="qr-tool-btn" style="padding:6px 12px;font-size:12px;color:#e05050;">Удалить</button></div>';});h+='</div>';}
c.innerHTML=h;c.scrollTop=0;};
window._qRB=function(su,ay){rb(su,ay);window._qBM();};

// НАСТРОЙКИ (без таджвида)
window._qST=function(){var c=document.getElementById('qrC');if(!c)return;var st=gs();var fs=st.fs||24;var fi=st.fi||'amiri';
var h='<div style="padding:8px 0;"><button class="qr-tool-btn" onclick="'+(curSurah?'window._qL('+curSurah+')':'window.openQuranReader()')+'" style="width:100%;">← Назад</button></div>';
h+='<div class="qr-header"><div class="qr-title">Настройки</div></div>';
h+='<div class="qr-settings-section"><div class="qr-settings-label">Шрифт</div><div class="qr-settings-options">';
FONTS.forEach(function(f){h+='<button class="qr-settings-opt '+(fi===f.id?'active':'')+'" onclick="window._qSF(\''+f.id+'\')">'+f.n+'</button>';});
h+='</div></div>';
h+='<div class="qr-settings-section"><div class="qr-settings-label">Размер: <span id="qrFS">'+fs+'</span>px</div><input type="range" min="16" max="40" value="'+fs+'" style="width:100%;accent-color:#e8dcc8;" oninput="window._qSZ(this.value)"></div>';
c.innerHTML=h;c.scrollTop=0;};
window._qSF=function(id){var s=gs();s.fi=id;ss(s);window._qST();};
window._qSZ=function(v){var s=gs();s.fs=parseInt(v);ss(s);var e=document.getElementById('qrFS');if(e)e.textContent=v;};
console.log('📖 Коран v3 (без таджвида)');
})();
