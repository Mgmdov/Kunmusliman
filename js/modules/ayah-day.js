const AYAT_FALLBACK = [
 {arabic:'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',translation:'Хвала Аллаху, Господу миров',source:'Аль-Фатиха, 1:2'},
 {arabic:'إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ',translation:'Поистине, Аллах — с терпеливыми',source:'Аль-Бакара, 2:153'},
 {arabic:'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',translation:'Поистине, за каждой тягостью наступает облегчение',source:'Аш-Шарх, 94:5'},
 {arabic:'قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ',translation:'Скажи: Он — Аллах Единый, Аллах Самодостаточный',source:'Аль-Ихляс, 112:1–2'}
];
// 100 разных аятов: диапазон 2:1–2:100 (глобальные номера 8–107 в стандартной нумерации).
const AYAH_POOL = Array.from({length:100},(_,i)=>8+i);
let activeAyah=AYAT_FALLBACK[0];
function renderAyah(a){activeAyah=a;const put=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};put('fullAyahArabic',a.arabic);put('fullAyahTranslation',a.translation);put('fullAyahSource',a.source);put('homeAyahArabic',a.arabic);put('homeAyahTranslation',a.translation);const widget=document.getElementById('ayahWidget');if(widget)widget.style.display='';}
async function loadAyahNumber(n){
 const cacheKey='ayah_cache_'+n;try{let data=localStorage.getItem(cacheKey);if(data)return JSON.parse(data);
 const r=await fetch(`https://api.alquran.cloud/v1/ayah/${n}/editions/quran-uthmani,ru.kuliev`);if(!r.ok)throw Error('network');const j=await r.json();if(j.code!==200||!Array.isArray(j.data)||j.data.length<2)throw Error('bad response');
 const ar=j.data.find(x=>x.edition.identifier==='quran-uthmani')||j.data[0],ru=j.data.find(x=>x.edition.identifier==='ru.kuliev')||j.data[1];const a={arabic:ar.text,translation:ru.text,source:`${ru.surah.name}, ${ru.surah.number}:${ru.numberInSurah}`};localStorage.setItem(cacheKey,JSON.stringify(a));return a;
 }catch(_){return AYAT_FALLBACK[n%AYAT_FALLBACK.length];}
}
function getDailyIndex(){const day=new Date().toISOString().slice(0,10);let saved;try{saved=JSON.parse(localStorage.getItem('daily_ayah_v2')||'null')}catch(_){}if(saved&&saved.date===day)return saved.number;const number=AYAH_POOL[Math.floor(Math.random()*AYAH_POOL.length)];localStorage.setItem('daily_ayah_v2',JSON.stringify({date:day,number}));return number;}
async function displayDailyAyah(){const n=getDailyIndex();renderAyah(await loadAyahNumber(n));}
async function refreshAyah(){const current=getDailyIndex();let next;do{next=AYAH_POOL[Math.floor(Math.random()*AYAH_POOL.length)]}while(next===current);localStorage.setItem('daily_ayah_v2',JSON.stringify({date:new Date().toISOString().slice(0,10),number:next}));renderAyah(await loadAyahNumber(next));}
document.getElementById('refreshAyahBtn')?.addEventListener('click',refreshAyah);
setTimeout(displayDailyAyah,350);
