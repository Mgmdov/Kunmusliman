// ========== КОРАН v4 — ридер по страницам мусхафа (в стиле Sajda) ==========
(function(){
'use strict';
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
// Стартовые страницы сур (мусхаф Медины, 604 стр.). Это только запасной вариант: в первую очередь
// страница суры запрашивается у API и кэшируется, а ридер сам исправляет сдвиг на соседнюю страницу.
var SP=[1,2,50,77,106,128,151,177,187,208,221,235,249,255,262,267,282,293,305,312,322,332,342,350,359,367,377,385,396,404,411,415,418,428,434,440,446,453,458,467,477,483,489,496,499,502,507,511,515,518,520,523,526,528,531,534,537,542,545,549,551,553,554,556,558,560,562,564,566,568,570,572,574,575,577,578,580,582,583,585,586,587,587,589,590,591,591,592,593,594,595,595,596,596,597,597,598,598,599,599,600,600,601,601,601,602,602,602,603,603,603,604,604,604];
var FONTS=[
  {id:'quran',n:'Amiri Quran',c:"'Amiri Quran','Amiri',serif"},
  {id:'amiri',n:'Amiri',c:"'Amiri',serif"},
  {id:'scheherazade',n:'Scheherazade',c:"'Scheherazade','Scheherazade New',serif"}
];
var RECS=[
  {id:'ar.alafasy',n:'Мишари Альфасы',bit:128,ea:'Alafasy_128kbps'},
  {id:'ar.husary',n:'Махмуд аль-Хусари',bit:128,ea:'Husary_128kbps'},
  {id:'ar.abdurrahmaansudais',n:'Абдуррахман ас-Судайс',bit:192,ea:'Abdurrahmaan_As-Sudais_192kbps'},
  {id:'ar.minshawi',n:'Мухаммад аль-Миншави',bit:128,ea:'Minshawy_Murattal_128kbps'},
  {id:'ar.abdulbasitmurattal',n:'Абдуль-Басит (мурраттал)',bit:192,ea:'Abdul_Basit_Murattal_192kbps'}
];
var BASES=['https://api.alquran.cloud/v1','https://alquran.api.alislam.ru/v1'];
var MAX_CACHED_PAGES=60;

// ---------- хранилище ----------
function lsGet(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
function gs(){return lsGet('qr_s')||{};}
function ss(o){lsSet('qr_s',o);}
function setting(k,d){var s=gs();return s[k]===undefined?d:s[k];}
function putSetting(k,v){var s=gs();s[k]=v;ss(s);}
function getBM(){var b=lsGet('qr_bm');return Array.isArray(b)?b:[];}
function isBM(s,a){return getBM().some(function(b){return b.s===s&&b.a===a;});}
function toggleBM(s,a,p){
  var b=getBM(),i=b.findIndex(function(x){return x.s===s&&x.a===a;});
  if(i>=0){b.splice(i,1);lsSet('qr_bm',b);return false;}
  b.push({s:s,a:a,p:p||0,n:(S[s-1]||{}).r||'',t:Date.now()});lsSet('qr_bm',b);return true;
}

// ---------- утилиты ----------
function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function an(n){var d=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];return String(n).replace(/\d/g,function(c){return d[+c];});}
function p3(n){return ('00'+n).slice(-3);}
function fontCss(){var id=setting('fi','quran');var f=FONTS.filter(function(x){return x.id===id;})[0]||FONTS[0];return f.c;}
function rec(){var id=setting('rec','ar.alafasy');return RECS.filter(function(r){return r.id===id;})[0]||RECS[0];}
var DIAC=/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]/g;
function norm(w){return w.replace(DIAC,'').replace(/[\u0671\u0622\u0623\u0625]/g,'\u0627');}
// В тексте аята 1 издания quran-uthmani уже есть басмала: показываем её отдельной строкой, поэтому убираем из аята.
function stripBismillah(text){
  var w=text.split(' ');
  if(w.length>4&&norm(w.slice(0,4).join(' '))==='بسم الله الرحمن الرحيم')return w.slice(4).join(' ');
  return text;
}
var BISMILLAH='بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
function surahName(n){return (S[n-1]||{}).r||('Сура '+n);}
function juzStart(j){return j===1?1:2+20*(j-1);}

// ---------- API и кэш страниц ----------
function apiGet(path){
  var i=0;
  function next(){
    if(i>=BASES.length)return Promise.reject(new Error('network'));
    var base=BASES[i++];
    var ctrl=window.AbortController?new AbortController():null;
    var t=setTimeout(function(){if(ctrl)ctrl.abort();},12000);
    return fetch(base+path,ctrl?{signal:ctrl.signal}:undefined)
      .then(function(r){clearTimeout(t);if(!r.ok){var e=new Error('http '+r.status);e.status=r.status;throw e;}return r.json();})
      .then(function(j){if(j.code!==200||j.data==null){var e=new Error('api '+j.code);e.status=j.code;throw e;}return j.data;})
      .catch(function(e){clearTimeout(t);if(e&&e.status===404)throw e;return next();});
  }
  return next();
}
var mem={};
function cacheSave(m){
  mem[m.page]=m;
  var ok=lsSet('qrp_'+m.page,m);
  var idx=lsGet('qr_pidx')||[];
  idx=idx.filter(function(x){return x!==m.page;});idx.push(m.page);
  while(idx.length>MAX_CACHED_PAGES){try{localStorage.removeItem('qrp_'+idx.shift());}catch(e){}}
  if(!ok){while(idx.length>5&&!lsSet('qrp_'+m.page,m)){try{localStorage.removeItem('qrp_'+idx.shift());}catch(e){}}}
  lsSet('qr_pidx',idx);
}
function fetchTranslation(page){
  var ed=setting('tr','ru.kuliev');
  return apiGet('/page/'+page+'/'+ed).catch(function(e){
    if(!(e&&e.status===404))throw e;
    // редакция с таким кодом не найдена — берём первый русский перевод из списка API
    return apiGet('/edition/language/ru').then(function(list){
      var pick=(list||[]).filter(function(x){return x.type==='translation'&&x.format==='text';})[0];
      if(!pick)throw new Error('no ru edition');
      putSetting('tr',pick.identifier);
      return apiGet('/page/'+page+'/'+pick.identifier);
    });
  });
}
function buildModel(page,ar,tr){
  var ru={};
  if(tr&&tr.ayahs)tr.ayahs.forEach(function(a){ru[a.number]=a.text;});
  var ays=(ar.ayahs||[]).map(function(a){return {s:a.surah.number,a:a.numberInSurah,n:a.number,t:a.text,j:a.juz,sj:!!a.sajda,ru:ru[a.number]||''};});
  return {page:page,ayahs:ays,hasTr:!!(tr&&tr.ayahs&&tr.ayahs.length)};
}
function getPage(page){
  if(mem[page])return Promise.resolve(mem[page]);
  var c=lsGet('qrp_'+page);
  if(c&&c.ayahs&&c.ayahs.length){mem[page]=c;return Promise.resolve(c);}
  return Promise.all([
    apiGet('/page/'+page+'/quran-uthmani'),
    fetchTranslation(page).catch(function(){return null;})
  ]).then(function(r){
    var m=buildModel(page,r[0],r[1]);
    if(!m.ayahs.length)throw new Error('empty page');
    cacheSave(m);return m;
  });
}
function ensureTranslation(m){
  if(m.hasTr)return Promise.resolve(m);
  return fetchTranslation(m.page).then(function(tr){
    var ru={};tr.ayahs.forEach(function(a){ru[a.number]=a.text;});
    m.ayahs.forEach(function(a){a.ru=ru[a.n]||a.ru;});
    m.hasTr=true;cacheSave(m);return m;
  });
}
function resolveSurahPage(n){
  var c=lsGet('qr_sp')||{};
  if(c[n])return Promise.resolve(c[n]);
  return apiGet('/ayah/'+n+':1').then(function(d){c[n]=d.page;lsSet('qr_sp',c);return d.page;}).catch(function(){return SP[n-1]||1;});
}

// ---------- состояние ----------
var st={view:'home',tab:'surahs',page:1,data:null,navTok:0,sheet:null,query:''};
var P={q:[],i:-1,urlIdx:0,page:1};
var au=null;
var histPushed=false,skipPop=false;

function $(id){return document.getElementById(id);}
function overlay(){return $('qrOverlay');}
function body(){return $('qrBody');}
function toast(t){
  var o=overlay();if(!o){try{if(typeof window.showNotification==='function')window.showNotification(t);}catch(e){}return;}
  var el=document.createElement('div');el.className='qr-toast';el.textContent=t;o.appendChild(el);
  setTimeout(function(){el.classList.add('out');},1800);setTimeout(function(){if(el.parentNode)el.remove();},2200);
}

// ---------- оболочка ----------
function buildShell(){
  var old=overlay();if(old)old.remove();
  document.body.classList.add('qr-open');
  var o=document.createElement('div');o.id='qrOverlay';o.className='qr-overlay';
  o.innerHTML=
    '<div class="qr-bg"></div>'+
    '<div class="qr-app">'+
      '<div class="qr-top" id="qrTop"></div>'+
      '<div class="qr-body" id="qrBody"></div>'+
      '<div class="qr-player" id="qrPlayer" hidden></div>'+
      '<div class="qr-bottom" id="qrBottom"></div>'+
    '</div>'+
    '<div class="qr-sheet-wrap" id="qrSheetWrap" hidden><div class="qr-sheet-dim" data-act="sheet-close"></div><div class="qr-sheet" id="qrSheet"></div></div>';
  document.body.appendChild(o);
  o.addEventListener('click',onClick);
  o.addEventListener('input',onInput);
  o.addEventListener('change',onChange);
  var b=body(),sx=0,sy=0,t0=0;
  b.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;t0=Date.now();},{passive:true});
  b.addEventListener('touchend',function(e){
    if(st.view!=='page'||st.sheet)return;
    var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Date.now()-t0<700&&Math.abs(dx)>70&&Math.abs(dy)<45){go(st.page+(dx<0?1:-1));}
  },{passive:true});
  requestAnimationFrame(function(){o.classList.add('active');});
  if(!histPushed){try{history.pushState({qr:1},'');histPushed=true;}catch(e){}}
  return o;
}
function closeQR(fromPop){
  if(!(au&&P.i>=0&&!au.paused))stopAudio();
  document.body.classList.remove('qr-open');
  var o=overlay();
  if(o){o.classList.add('closing');setTimeout(function(){if(o.parentNode)o.remove();renderMini();},250);}
  if(histPushed&&!fromPop){histPushed=false;skipPop=true;try{history.back();}catch(e){skipPop=false;}}
  else histPushed=false;
}
window._qClose=function(){closeQR(false);};
window.addEventListener('popstate',function(){
  if(skipPop){skipPop=false;return;}
  if(!overlay())return;
  histPushed=false;
  if(st.sheet){closeSheet();try{history.pushState({qr:1},'');histPushed=true;}catch(e){}return;}
  if(st.view==='page'){showHome();try{history.pushState({qr:1},'');histPushed=true;}catch(e){}return;}
  closeQR(true);
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&overlay()){if(st.sheet)closeSheet();else if(st.view==='page')showHome();else closeQR(false);}
});

// ---------- шапка и нижняя панель ----------
function renderTop(){
  var t=$('qrTop');if(!t)return;
  if(st.view==='home'){
    t.innerHTML='<button class="qr-ic" data-act="close" aria-label="Закрыть">✕</button><div class="qr-top-title"><b>القرآن الكريم</b><small>Священный Коран</small></div><button class="qr-ic" data-act="settings" aria-label="Настройки">⚙</button>';
    return;
  }
  var m=st.data,names=[],seen={};
  if(m)m.ayahs.forEach(function(a){if(!seen[a.s]){seen[a.s]=1;names.push(surahName(a.s));}});
  var juz=m&&m.ayahs[0]?m.ayahs[0].j:'';
  var mode=setting('mode','mushaf');
  t.innerHTML=
    '<button class="qr-ic" data-act="close" aria-label="Закрыть">✕</button>'+
    '<button class="qr-ic" data-act="home" aria-label="Оглавление">☰</button>'+
    '<div class="qr-top-title"><b>'+esc(names.join(' · '))+'</b><small>Джуз '+esc(juz)+' · стр. '+st.page+'</small></div>'+
    '<div class="qr-seg"><button data-act="mode-mushaf" class="'+(mode==='mushaf'?'on':'')+'">Мусхаф</button><button data-act="mode-tr" class="'+(mode==='tr'?'on':'')+'">Перевод</button></div>'+
    '<button class="qr-ic" data-act="settings" aria-label="Настройки">⚙</button>';
}
function khatmPage(){var k=window.userData&&window.userData.khatm;return k?Math.max(1,Math.min(604,Math.trunc(Number(k.currentPage)||1))):0;}
function renderBottom(){
  var b=$('qrBottom');if(!b)return;
  if(st.view!=='page'){b.innerHTML='';b.hidden=true;return;}
  b.hidden=false;
  var rp=lsGet('qr_readpages')||[],done=rp.indexOf(st.page)>=0,kp=khatmPage();
  var label=done?'✓ Страница прочитана':(kp===st.page?'✓ Прочитал страницу · хатм +1':'✓ Прочитал страницу');
  b.innerHTML=
    '<div class="qr-nav3"><button data-act="prev" '+(st.page<=1?'disabled':'')+'>‹ Назад</button><button data-act="jump" class="qr-pg">стр. '+st.page+' / 604</button><button data-act="next" '+(st.page>=604?'disabled':'')+'>Далее ›</button></div>'+
    '<div class="qr-acts"><button data-act="play" class="qr-play">▶ Слушать</button><button data-act="read" class="qr-read '+(done?'done':'')+'">'+label+'</button></div>'+
    (kp&&kp!==st.page?'<button class="qr-khatm" data-act="goto-khatm">Позиция хатма: стр. '+kp+' — перейти</button>':'');
}

// ---------- главный экран ----------
function showHome(){
  st.view='home';st.sheet=null;
  var w=$('qrSheetWrap');if(w)w.hidden=true;
  renderTop();renderBottom();renderHome();
}
function renderHome(){
  var b=body();if(!b)return;
  var last=lsGet('qr_last'),h='';
  if(last&&last.p){
    h+='<button class="qr-continue" data-act="open-page" data-p="'+last.p+'"><span>Продолжить чтение</span><b>'+esc(surahName(last.s))+' · аят '+last.a+'</b><small>страница '+last.p+'</small></button>';
  }
  var kp=khatmPage();
  if(kp)h+='<button class="qr-khatm-card" data-act="open-page" data-p="'+kp+'">📖 Мой хатм: страница '+kp+' из 604 <i>Открыть</i></button>';
  h+='<div class="qr-tabs"><button data-act="tab-surahs" class="'+(st.tab==='surahs'?'on':'')+'">Суры</button><button data-act="tab-juz" class="'+(st.tab==='juz'?'on':'')+'">Джузы</button><button data-act="tab-bm" class="'+(st.tab==='bm'?'on':'')+'">Закладки</button></div>';
  if(st.tab==='surahs')h+='<input id="qrSearch" class="qr-search" type="search" placeholder="Название, номер суры или 2:255" value="'+esc(st.query)+'" autocomplete="off"><div id="qrList">'+surahListHtml(st.query)+'</div>';
  else if(st.tab==='juz')h+=juzListHtml();
  else h+=bookmarksHtml();
  b.innerHTML=h;b.scrollTop=0;
}
function unlockedSurahs(){var u=window.userData&&window.userData.unlockedSurahs;return Array.isArray(u)?u:[];}
function surahListHtml(q){
  q=(q||'').trim().toLowerCase();
  var m=q.match(/^(\d{1,3})\s*[:.\s]\s*(\d{1,3})$/),h='',un=unlockedSurahs(),cache=lsGet('qr_sp')||{};
  if(m){
    var s=+m[1],a=+m[2];
    if(s>=1&&s<=114&&a>=1&&a<=S[s-1].c)h+='<button class="qr-item qr-item-go" data-act="goto-ayah" data-s="'+s+'" data-a="'+a+'"><span class="qr-num">'+s+':'+a+'</span><span class="qr-item-main"><b>Перейти к аяту</b><small>'+esc(surahName(s))+', аят '+a+'</small></span></button>';
    else h+='<div class="qr-empty">Такого аята нет</div>';
    return h;
  }
  S.forEach(function(x){
    if(q&&!(x.r.toLowerCase().indexOf(q)>=0||x.a.indexOf(q)>=0||String(x.n)===q))return;
    h+='<button class="qr-item" data-act="open-surah" data-n="'+x.n+'"><span class="qr-num">'+x.n+'</span><span class="qr-item-main"><b>'+esc(x.r)+'</b><small>'+x.t+' · '+x.c+' аятов · стр. '+(cache[x.n]||SP[x.n-1])+'</small></span><span class="qr-item-ar">'+(un.indexOf(x.n)>=0?'<i class="qr-chk" title="Карточка получена">✓</i>':'')+esc(x.a)+'</span></button>';
  });
  return h||'<div class="qr-empty">Ничего не найдено</div>';
}
function juzListHtml(){
  var h='<div class="qr-grid">';
  for(var j=1;j<=30;j++)h+='<button class="qr-juz" data-act="open-page" data-p="'+juzStart(j)+'"><b>'+j+'</b><small>Джуз · стр. '+juzStart(j)+'</small></button>';
  return h+'</div>';
}
function bookmarksHtml(){
  var b=getBM().slice().sort(function(x,y){return y.t-x.t;});
  if(!b.length)return '<div class="qr-empty">Закладок пока нет<br><small>Нажмите на аят и выберите «Закладка»</small></div>';
  return b.map(function(x){
    return '<div class="qr-item qr-bm"><button class="qr-bm-main" data-act="goto-ayah" data-s="'+x.s+'" data-a="'+x.a+'"'+(x.p?' data-p="'+x.p+'"':'')+'><span class="qr-num">'+x.s+':'+x.a+'</span><span class="qr-item-main"><b>'+esc(x.n||surahName(x.s))+'</b><small>аят '+x.a+(x.p?' · стр. '+x.p:'')+'</small></span></button><button class="qr-bm-del" data-act="bm-del" data-s="'+x.s+'" data-a="'+x.a+'" aria-label="Удалить">✕</button></div>';
  }).join('');
}

// ---------- страница мусхафа ----------
function showLoading(text){
  var b=body();if(!b)return;
  b.innerHTML='<div class="qr-loading"><div class="qr-spin"></div><div>'+(text||'Загрузка…')+'</div></div>';
}
function showError(p,e){
  var b=body();if(!b)return;
  var cached=(lsGet('qr_pidx')||[]).length;
  b.innerHTML='<div class="qr-error"><div class="qr-error-ico">✦</div><div>Не удалось загрузить страницу '+p+'</div><small>'+(e&&e.message==='network'?'Нет соединения с сервером Корана.':esc(e&&e.message||''))+(cached?' Уже прочитанные страницы ('+cached+') доступны без интернета.':'')+'</small><button class="qr-btn" data-act="retry" data-p="'+p+'">Повторить</button><button class="qr-btn ghost" data-act="home">К оглавлению</button></div>';
}
function has(m,f){return m.ayahs.some(function(a){return a.s===f.s&&a.a===f.a;});}
function go(p,opts){
  opts=opts||{};
  p=Math.max(1,Math.min(604,p|0));
  if(!opts.keepAudio)stopAudio();
  st.view='page';st.sheet=null;
  var w=$('qrSheetWrap');if(w)w.hidden=true;
  var tok=++st.navTok;
  if(!opts.hops){renderTop();renderBottom();showLoading();}
  return getPage(p).then(function(m){
    if(tok!==st.navTok)return;
    var f=opts.focus;
    if(f&&!has(m,f)&&(opts.hops||0)<3){
      var first=m.ayahs[0],last=m.ayahs[m.ayahs.length-1];
      var dir=(last.s<f.s||(last.s===f.s&&last.a<f.a))?1:((first.s>f.s||(first.s===f.s&&first.a>f.a))?-1:0);
      if(dir&&p+dir>=1&&p+dir<=604){
        var o2={};for(var k in opts)o2[k]=opts[k];o2.hops=(opts.hops||0)+1;o2.keepAudio=true;
        return go(p+dir,o2);
      }
    }
    st.page=p;st.data=m;
    saveLast(m,f);
    renderTop();renderBottom();renderPage(f);
    if(p<604)getPage(p+1).catch(function(){});
    if(setting('mode','mushaf')==='tr'&&!m.hasTr)ensureTranslation(m).then(function(){if(st.data===m&&setting('mode','mushaf')==='tr')renderPage();}).catch(function(){});
  }).catch(function(e){if(tok===st.navTok)showError(p,e);});
}
function saveLast(m,f){
  var a=f&&has(m,f)?f:m.ayahs[0];
  lsSet('qr_last',{p:m.page,s:a.s,a:a.a,t:Date.now()});
}
function banner(s){
  var x=S[s-1]||{};
  return '<div class="qr-banner"><div class="qr-banner-ar">سورة '+esc(x.a)+'</div><div class="qr-banner-ru">'+esc(x.r)+' · '+esc(x.t)+' · '+x.c+' аятов</div></div>'+(s!==9&&s!==1?'<div class="qr-bism">'+BISMILLAH+'</div>':'');
}
function renderPage(focus){
  var b=body(),m=st.data;if(!b||!m)return;
  var mode=setting('mode','mushaf'),fs=setting('fs',26),h='',open=false,tr=mode==='tr';
  var bm=getBM();
  m.ayahs.forEach(function(a){
    if(a.a===1){if(open){h+='</p>';open=false;}h+=banner(a.s);}
    var text=(a.a===1&&a.s!==1)?stripBismillah(a.t):a.t;
    var cls='qr-ay'+(bm.some(function(x){return x.s===a.s&&x.a===a.a;})?' bm':'');
    var end='<span class="qr-end">'+(a.sj?'۩ ':'')+'﴿'+an(a.a)+'﴾</span>';
    if(tr){
      if(open){h+='</p>';open=false;}
      h+='<div class="'+cls+' qr-blk" data-s="'+a.s+'" data-a="'+a.a+'" data-n="'+a.n+'"><div class="qr-ar">'+esc(text)+' '+end+'</div><div class="qr-ru">'+(a.ru?esc(a.ru):'<span class="qr-muted">Перевод загружается…</span>')+'</div></div>';
    }else{
      if(!open){h+='<p class="qr-flow">';open=true;}
      h+='<span class="'+cls+'" data-s="'+a.s+'" data-a="'+a.a+'" data-n="'+a.n+'">'+esc(text)+' '+end+'</span> ';
    }
  });
  if(open)h+='</p>';
  h+='<div class="qr-pageno">'+an(st.page)+'</div>';
  b.innerHTML='<div class="qr-page" style="font-family:'+fontCss()+';font-size:'+fs+'px">'+h+'</div>';
  b.scrollTop=0;
  if(focus){
    var el=b.querySelector('.qr-ay[data-s="'+focus.s+'"][data-a="'+focus.a+'"]');
    if(el){el.classList.add('focus');setTimeout(function(){try{el.scrollIntoView({block:'center'});}catch(e){}},30);setTimeout(function(){el.classList.remove('focus');},2600);}
  }
  markPlaying();
}

// ---------- действия с аятом ----------
function openSheet(html){
  var w=$('qrSheetWrap'),s=$('qrSheet');if(!w||!s)return;
  s.innerHTML=html;w.hidden=false;st.sheet=true;
  requestAnimationFrame(function(){w.classList.add('show');});
}
function closeSheet(){
  var w=$('qrSheetWrap');if(!w)return;
  w.classList.remove('show');st.sheet=null;
  setTimeout(function(){if(!st.sheet)w.hidden=true;},200);
}
function findAyah(s,a){return st.data&&st.data.ayahs.filter(function(x){return x.s===s&&x.a===a;})[0];}
function ayahSheet(s,a){
  var ay=findAyah(s,a);if(!ay)return;
  var bm=isBM(s,a);
  openSheet(
    '<div class="qr-sheet-h"><b>'+esc(surahName(s))+'</b><span>аят '+a+' · стр. '+st.page+'</span></div>'+
    '<div class="qr-sheet-ar" style="font-family:'+fontCss()+'">'+esc((a===1&&s!==1)?stripBismillah(ay.t):ay.t)+'</div>'+
    '<div class="qr-sheet-ru" id="qrSheetRu">'+(ay.ru?esc(ay.ru):'Загрузка перевода…')+'</div>'+
    '<div class="qr-sheet-btns">'+
      '<button data-act="play-from" data-s="'+s+'" data-a="'+a+'">▶ Слушать отсюда</button>'+
      '<button data-act="bm" data-s="'+s+'" data-a="'+a+'">'+(bm?'★ Убрать закладку':'☆ Закладка')+'</button>'+
      '<button data-act="copy" data-s="'+s+'" data-a="'+a+'">⧉ Копировать</button>'+
      '<button data-act="share" data-s="'+s+'" data-a="'+a+'">⇪ Поделиться</button>'+
    '</div>'
  );
  if(!ay.ru&&st.data)ensureTranslation(st.data).then(function(){var t=$('qrSheetRu'),y=findAyah(s,a);if(t&&y)t.textContent=y.ru||'Перевод недоступен';}).catch(function(){var t=$('qrSheetRu');if(t)t.textContent='Перевод недоступен без интернета';});
}
function ayahText(s,a){
  var ay=findAyah(s,a);if(!ay)return '';
  return ((a===1&&s!==1)?stripBismillah(ay.t):ay.t)+' ﴿'+an(a)+'﴾\n'+(ay.ru?ay.ru+'\n':'')+'— '+surahName(s)+', '+s+':'+a;
}
function copyText(t){
  if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t);
  return new Promise(function(res,rej){try{var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var ok=document.execCommand('copy');ta.remove();ok?res():rej();}catch(e){rej(e);}});
}

// ---------- настройки / переход ----------
function settingsSheet(){
  var fi=setting('fi','quran'),fs=setting('fs',26),rc=rec().id,auto=setting('auto',true);
  openSheet(
    '<div class="qr-sheet-h"><b>Настройки чтения</b></div>'+
    '<div class="qr-set"><label>Шрифт</label><div class="qr-chips">'+FONTS.map(function(f){return '<button data-act="set-font" data-id="'+f.id+'" class="'+(fi===f.id?'on':'')+'">'+f.n+'</button>';}).join('')+'</div></div>'+
    '<div class="qr-set"><label>Размер текста: <span id="qrFsv">'+fs+'</span></label><input type="range" min="20" max="46" value="'+fs+'" data-act="set-size"></div>'+
    '<div class="qr-set"><label>Чтец</label><select data-act="set-rec">'+RECS.map(function(r){return '<option value="'+r.id+'"'+(rc===r.id?' selected':'')+'>'+esc(r.n)+'</option>';}).join('')+'</select></div>'+
    '<div class="qr-set row"><label>Автопереход на следующую страницу при прослушивании</label><button data-act="set-auto" class="qr-switch '+(auto?'on':'')+'" aria-label="Автопереход"><i></i></button></div>'+
    '<div class="qr-set row"><label>Отмечать страницу прочитанной, когда её дослушали (хатм, достижения)</label><button data-act="set-automark" class="qr-switch '+(setting('automark',true)?'on':'')+'" aria-label="Автоотметка"></button></div>'+
    '<div class="qr-set"><button class="qr-btn ghost" data-act="clear-cache">Очистить сохранённые страницы</button></div>'
  );
}
function jumpSheet(){
  openSheet(
    '<div class="qr-sheet-h"><b>Перейти к странице</b><span>1–604</span></div>'+
    '<div class="qr-set row"><input id="qrJump" class="qr-search" type="number" inputmode="numeric" min="1" max="604" value="'+st.page+'"><button class="qr-btn" data-act="jump-go">Перейти</button></div>'
  );
  setTimeout(function(){var i=$('qrJump');if(i){i.focus();i.select();}},60);
}

// ---------- аудио ----------
function audioUrls(a){
  var r=rec();
  return ['https://cdn.islamic.network/quran/audio/'+r.bit+'/'+r.id+'/'+a.n+'.mp3','https://everyayah.com/data/'+r.ea+'/'+p3(a.s)+p3(a.a)+'.mp3'];
}
function ensureAudio(){
  if(au)return au;
  au=new Audio();au.preload='auto';
  au.addEventListener('ended',nextAyah);
  au.addEventListener('error',function(){
    if(P.i<0)return;
    var urls=audioUrls(P.q[P.i]);
    if(P.urlIdx+1<urls.length)playIndex(P.i,P.urlIdx+1);
    else{toast('Не удалось загрузить аудио');stopAudio();}
  });
  au.addEventListener('play',renderPlayer);au.addEventListener('pause',renderPlayer);
  return au;
}
function startPlayback(from){
  if(!st.data)return;
  P.q=st.data.ayahs.slice();P.page=st.page;playIndex(Math.max(0,Math.min(from||0,P.q.length-1)),0);
}
function playIndex(i,urlIdx){
  if(i<0||i>=P.q.length)return;
  var a=ensureAudio();
  P.i=i;P.urlIdx=urlIdx||0;
  a.src=audioUrls(P.q[i])[P.urlIdx];
  a.playbackRate=setting('sp',1);
  var pr=a.play();if(pr&&pr.catch)pr.catch(function(){});
  markPlaying();renderPlayer();mediaMeta();
}
function nextAyah(){
  if(P.i+1<P.q.length){playIndex(P.i+1,0);return;}
  // страница дослушана до конца: отмечаем её (хатм, карточки сур) и идём дальше
  var done=P.page;
  try{if(setting('automark',true))markRead(true,done);}catch(e){}
  if(setting('auto',true)&&done<604){
    var np=done+1,o=overlay();
    if(o&&st.page===done){
      go(np,{keepAudio:true}).then(function(){if(st.data&&st.data.page===np)startPlayback(0);});
    }else{
      getPage(np).then(function(m){
        P.q=m.ayahs.slice();P.page=np;
        if(!o){st.page=np;st.data=m;saveLast(m);}
        playIndex(0,0);
        if(np<604)getPage(np+1).catch(function(){});
      }).catch(function(){stopAudio();});
    }
  }else stopAudio();
}
function prevAyah(){if(P.i>0)playIndex(P.i-1,0);else if(P.i===0)playIndex(0,0);}
function stopAudio(){
  if(au){au.pause();au.removeAttribute('src');try{au.load();}catch(e){}}
  P.q=[];P.i=-1;
  markPlaying();renderPlayer();
}
function markPlaying(){
  var b=body();if(!b)return;
  [].forEach.call(b.querySelectorAll('.qr-ay.playing'),function(e){e.classList.remove('playing');});
  if(P.i<0||!P.q[P.i])return;
  var el=b.querySelector('.qr-ay[data-n="'+P.q[P.i].n+'"]');
  if(el){el.classList.add('playing');try{el.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}}
}
function renderPlayer(){renderMini();renderPlayerInner();}
function renderPlayerInner(){
  var p=$('qrPlayer');if(!p)return;
  if(P.i<0||!P.q[P.i]){p.hidden=true;p.innerHTML='';var pb=document.querySelector('.qr-play');if(pb)pb.textContent='▶ Слушать';return;}
  var a=P.q[P.i],playing=au&&!au.paused;
  p.hidden=false;
  p.innerHTML='<div class="qr-pl-info"><b>'+esc(surahName(a.s))+' · '+a.a+'</b><small>'+esc(rec().n)+'</small></div><button data-act="pl-prev" aria-label="Предыдущий аят">⏮</button><button data-act="pl-toggle" class="big" aria-label="Пауза">'+(playing?'⏸':'▶')+'</button><button data-act="pl-next" aria-label="Следующий аят">⏭</button><button data-act="pl-speed" class="sp">'+setting('sp',1)+'×</button><button data-act="pl-stop" aria-label="Остановить">✕</button>';
  var pb2=document.querySelector('.qr-play');if(pb2)pb2.textContent=playing?'⏸ Пауза':'▶ Слушать';
}
function mediaMeta(){
  if(!('mediaSession' in navigator)||!window.MediaMetadata||P.i<0)return;
  var a=P.q[P.i];
  try{
    navigator.mediaSession.metadata=new MediaMetadata({title:surahName(a.s)+' · аят '+a.a,artist:rec().n,album:'Священный Коран'});
    navigator.mediaSession.setActionHandler('play',function(){if(au)au.play();});
    navigator.mediaSession.setActionHandler('pause',function(){if(au)au.pause();});
    navigator.mediaSession.setActionHandler('previoustrack',prevAyah);
    navigator.mediaSession.setActionHandler('nexttrack',nextAyah);
  }catch(e){}
}


// ---------- мини-плеер и фоновое прослушивание ----------
function renderMini(){
  var m=$('qrMini'),active=P.i>=0&&P.q[P.i]&&!overlay();
  if(!active){if(m)m.remove();return;}
  if(!m){
    m=document.createElement('div');m.id='qrMini';m.className='qr-mini';document.body.appendChild(m);
    m.addEventListener('click',function(e){
      var b=e.target.closest('[data-m]');
      if(!b){openFromMini();return;}
      var a=b.dataset.m;
      if(a==='t'){if(au){if(au.paused){var pr=au.play();if(pr&&pr.catch)pr.catch(function(){});}else au.pause();}}
      else if(a==='n')nextAyah();else if(a==='p')prevAyah();else if(a==='x')stopAudio();
      e.stopPropagation();
    });
  }
  var a2=P.q[P.i],playing=au&&!au.paused;
  m.innerHTML='<div class="qr-mini-i"><b>🎧 '+esc(surahName(a2.s))+' · '+a2.a+'</b><small>Стр. '+P.page+' · '+esc(rec().n)+'</small></div>'+
    '<button data-m="p" aria-label="Назад">⏮</button><button data-m="t" class="main" aria-label="Пауза">'+(playing?'⏸':'▶')+'</button><button data-m="n" aria-label="Дальше">⏭</button><button data-m="x" aria-label="Стоп">✕</button>';
}
function openFromMini(){
  var pg=P.page;buildShell();
  go(pg,{keepAudio:true}).then(function(){markPlaying();renderPlayer();});
}
window.quranListen=function(page){
  var lp=lsGet('qr_last')||{},p=Math.max(1,Math.min(604,(page|0)||lp.p||1));
  toast('Загружаю страницу '+p+'…');
  getPage(p).then(function(m){
    P.q=m.ayahs.slice();P.page=p;st.page=p;st.data=m;saveLast(m);
    playIndex(0,0);
  }).catch(function(){toast('Не удалось загрузить аудио. Проверьте интернет');});
};
window.quranListenToggle=function(){if(P.i>=0&&au){if(au.paused)au.play();else au.pause();}else window.quranListen();};

// ---------- отметка страницы (хатм и карточки сур) ----------
function markRead(auto,pg){
  var p=pg||st.page,rp=lsGet('qr_readpages')||[];
  if(rp.indexOf(p)>=0){if(!auto)toast('Эта страница уже отмечена');return;}
  rp.push(p);lsSet('qr_readpages',rp);
  try{if(typeof window.groupKhatmOnPage==='function')window.groupKhatmOnPage(p);}catch(e){}
  var atKhatm=khatmPage()===p,cool=(typeof window.checkKhatmCooldown==='function'&&window.checkKhatmCooldown());
  try{
    if(atKhatm&&!cool&&typeof window.advanceKhatmPages==='function'){window.advanceKhatmPages(1);toast('Страница '+p+' прочитана · хатм +1');}
    else if(typeof window.trackKhatmCompletedSurahs==='function'){window.trackKhatmCompletedSurahs(p,p);toast('Страница '+p+' отмечена');}
    else toast('Страница '+p+' отмечена');
  }catch(e){console.warn('Не удалось отметить страницу',e);toast('Страница отмечена');}
  renderBottom();
}

// ---------- события ----------
function onClick(e){
  var ayEl=e.target.closest&&e.target.closest('.qr-ay');
  var t=e.target.closest&&e.target.closest('[data-act]');
  if(!t&&ayEl&&st.view==='page'){ayahSheet(+ayEl.dataset.s,+ayEl.dataset.a);return;}
  if(!t)return;
  var act=t.dataset.act,d=t.dataset;
  switch(act){
    case 'close':closeQR(false);break;
    case 'home':showHome();break;
    case 'settings':settingsSheet();break;
    case 'set-automark':putSetting('automark',!setting('automark',true));settingsSheet();break;
    case 'sheet-close':closeSheet();break;
    case 'tab-surahs':st.tab='surahs';renderHome();break;
    case 'tab-juz':st.tab='juz';renderHome();break;
    case 'tab-bm':st.tab='bm';renderHome();break;
    case 'open-page':go(+d.p);break;
    case 'open-surah':openSurah(+d.n);break;
    case 'goto-ayah':gotoAyah(+d.s,+d.a,d.p?+d.p:0);break;
    case 'bm-del':toggleBM(+d.s,+d.a);renderHome();break;
    case 'prev':go(st.page-1);break;
    case 'next':if(st.view==='page'&&st.data)markRead(true);go(st.page+1);break;
    case 'jump':jumpSheet();break;
    case 'jump-go':{var v=parseInt(($('qrJump')||{}).value,10);if(v>=1&&v<=604){closeSheet();go(v);}else toast('Введите номер от 1 до 604');break;}
    case 'goto-khatm':go(khatmPage());break;
    case 'retry':go(+d.p);break;
    case 'read':markRead();break;
    case 'mode-mushaf':case 'mode-tr':{
      var nm=act==='mode-tr'?'tr':'mushaf';putSetting('mode',nm);renderTop();
      if(st.data){renderPage();if(nm==='tr'&&!st.data.hasTr){var m0=st.data;ensureTranslation(m0).then(function(){if(st.data===m0&&setting('mode','mushaf')==='tr')renderPage();}).catch(function(){toast('Перевод недоступен без интернета');});}}
      break;}
    case 'play':
      if(P.i>=0&&au){if(au.paused)au.play();else au.pause();}
      else startPlayback(0);
      break;
    case 'play-from':{
      closeSheet();
      var idx=st.data.ayahs.findIndex(function(x){return x.s===+d.s&&x.a===+d.a;});
      startPlayback(Math.max(0,idx));break;}
    case 'pl-toggle':if(au){if(au.paused)au.play();else au.pause();}break;
    case 'pl-prev':prevAyah();break;
    case 'pl-next':nextAyah();break;
    case 'pl-stop':stopAudio();break;
    case 'pl-speed':{var sp=setting('sp',1),sq=[1,1.25,1.5,0.85],ni=(sq.indexOf(sp)+1)%sq.length;putSetting('sp',sq[ni]);if(au)au.playbackRate=sq[ni];renderPlayer();break;}
    case 'bm':{var on=toggleBM(+d.s,+d.a,st.page);closeSheet();toast(on?'Закладка добавлена':'Закладка удалена');if(st.data)renderPage();break;}
    case 'copy':copyText(ayahText(+d.s,+d.a)).then(function(){closeSheet();toast('Скопировано');}).catch(function(){toast('Не удалось скопировать');});break;
    case 'share':{var tx=ayahText(+d.s,+d.a);if(navigator.share){navigator.share({text:tx}).catch(function(){});}else copyText(tx).then(function(){toast('Скопировано');}).catch(function(){});break;}
    case 'set-font':putSetting('fi',d.id);settingsSheet();if(st.data)renderPage();break;
    case 'set-auto':putSetting('auto',!setting('auto',true));settingsSheet();break;
    case 'clear-cache':{(lsGet('qr_pidx')||[]).forEach(function(p){try{localStorage.removeItem('qrp_'+p);}catch(x){}});lsSet('qr_pidx',[]);mem={};toast('Сохранённые страницы удалены');break;}
  }
}
function onInput(e){
  var t=e.target;
  if(t.id==='qrSearch'){st.query=t.value;var l=$('qrList');if(l)l.innerHTML=surahListHtml(st.query);}
  else if(t.dataset&&t.dataset.act==='set-size'){
    var v=parseInt(t.value,10);putSetting('fs',v);var s=$('qrFsv');if(s)s.textContent=v;
    var pg=document.querySelector('.qr-page');if(pg)pg.style.fontSize=v+'px';
  }
}
function onChange(e){
  var t=e.target;
  if(t.dataset&&t.dataset.act==='set-rec'){putSetting('rec',t.value);if(P.i>=0){var i=P.i;playIndex(i,0);}}
}
function openSurah(n){
  st.view='page';renderTop();renderBottom();showLoading();
  resolveSurahPage(n).then(function(p){go(p,{focus:{s:n,a:1}});});
}
function gotoAyah(s,a,p){
  if(p){go(p,{focus:{s:s,a:a}});return;}
  st.view='page';renderTop();renderBottom();showLoading();
  apiGet('/ayah/'+s+':'+a).then(function(d){go(d.page,{focus:{s:s,a:a}});}).catch(function(){go(SP[s-1]||1,{focus:{s:s,a:a}});});
}

// ---------- публичный вход ----------
window.openQuranReader=function(arg){
  buildShell();
  renderMini();
  if(arg===undefined&&P.i>=0&&P.q[P.i]){go(P.page,{keepAudio:true}).then(function(){markPlaying();renderPlayer();});return;}
  if(typeof arg==='number'&&arg>=1&&arg<=114){openSurah(arg);return;}
  showHome();
};
window.openQuranPage=function(p){buildShell();go(+p||1);};
console.log('📖 Коран v4 (страницы мусхафа, перевод, аудио)');
})();
