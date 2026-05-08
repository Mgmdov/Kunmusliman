// ========== АЗКАРЫ v2 — ПРЕМИУМ ==========
(function(){
var AZKAR=[
  {id:'morning',name:'Утренние',arabic:'أَذْكَار الصَّبَاح',icon:'🌅',color:'#EF9F27',items:[
    {ar:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',tr:'Асбахна ва асбахаль-мульку лиллях',meaning:'Мы вступили в утро и вся власть принадлежит Аллаху',count:1},
    {ar:'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',tr:'Аллахумма бика асбахна ва бика амсайна',meaning:'О Аллах, с Тобой мы встретили утро и с Тобой встретим вечер',count:1},
    {ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',tr:'Субханаллахи ва бихамдих',meaning:'Пречист Аллах и хвала Ему',count:100},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',tr:'Ля иляха илля Ллаху вахдаху ля шарика лях',meaning:'Нет бога кроме Аллаха, Единого, нет у Него сотоварища',count:10},
    {ar:'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',tr:'Астагфируллаха ва атубу иляйх',meaning:'Прошу прощения у Аллаха и каюсь перед Ним',count:100}
  ]},
  {id:'evening',name:'Вечерние',arabic:'أَذْكَار الْمَسَاء',icon:'🌙',color:'#7F77DD',items:[
    {ar:'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',tr:'Амсайна ва амсаль-мульку лиллях',meaning:'Мы вступили в вечер и вся власть принадлежит Аллаху',count:1},
    {ar:'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا',tr:'Аллахумма бика амсайна ва бика асбахна',meaning:'О Аллах, с Тобой мы встретили вечер и с Тобой встретим утро',count:1},
    {ar:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',tr:'Аузу бикалиматилляхит-таммати мин шарри ма халак',meaning:'Прибегаю к совершенным словам Аллаха от зла того, что Он сотворил',count:3},
    {ar:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',tr:'Бисмилляхиллязи ля ядурру маасмихи шайун',meaning:'С именем Аллаха, с именем Которого ничто не навредит',count:3},
    {ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',tr:'Субханаллахи ва бихамдих',meaning:'Пречист Аллах и хвала Ему',count:100}
  ]},
  {id:'sleep',name:'Перед сном',arabic:'أَذْكَار النَّوْم',icon:'💤',color:'#5a8acf',items:[
    {ar:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',tr:'Бисмикаллахумма амуту ва ахья',meaning:'С Твоим именем, о Аллах, я умираю и оживаю',count:1},
    {ar:'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',tr:'Аллахумма кини азабака явма табасу ибадак',meaning:'О Аллах, защити меня от наказания в День, когда Ты воскресишь Своих рабов',count:3},
    {ar:'سُبْحَانَ اللَّهِ',tr:'Субханаллах',meaning:'Пречист Аллах',count:33},
    {ar:'الْحَمْدُ لِلَّهِ',tr:'Альхамдулиллях',meaning:'Хвала Аллаху',count:33},
    {ar:'اللَّهُ أَكْبَرُ',tr:'Аллаху Акбар',meaning:'Аллах Велик',count:34}
  ]}
];

function getAzkarProgress(){try{return JSON.parse(localStorage.getItem('azkar_progress')||'{}');}catch(e){return {};}}
function setAzkarProgress(data){localStorage.setItem('azkar_progress',JSON.stringify(data));}

function injectAzkar(){
  var el=document.getElementById('azkarContent');if(!el)return;
  var prog=getAzkarProgress();
  var today=new Date().toISOString().slice(0,10);
  if(prog._date!==today){prog={_date:today};setAzkarProgress(prog);}

  var h='';
  AZKAR.forEach(function(cat){
    var totalItems=cat.items.length;
    var doneItems=cat.items.filter(function(item){return(prog[cat.id+'_'+item.ar]||0)>=item.count;}).length;
    var catDone=doneItems===totalItems;

    h+='<div style="margin-bottom:16px;"><div onclick="window._azToggle(\''+cat.id+'\')" style="display:flex;align-items:center;gap:12px;padding:16px;background:'+(catDone?'rgba(93,202,165,0.06)':'rgba(255,255,255,0.03)')+';border:1px solid '+(catDone?'rgba(93,202,165,0.15)':'rgba(255,255,255,0.06)')+';border-radius:14px;cursor:pointer;">';
    h+='<div style="font-size:24px;">'+cat.icon+'</div>';
    h+='<div style="flex:1;"><div style="font-size:15px;font-weight:500;color:'+(catDone?'#5dcaa5':'inherit')+';">'+cat.name+'</div><div style="font-size:11px;color:rgba(128,128,128,0.5);">'+doneItems+' / '+totalItems+' выполнено</div></div>';
    h+='<div style="font-family:Amiri,serif;font-size:16px;color:'+cat.color+';">'+cat.arabic+'</div>';
    h+='</div>';

    // Список зикров (скрытый/показанный)
    h+='<div id="azkar_'+cat.id+'" style="display:none;margin-top:6px;">';
    cat.items.forEach(function(item,i){
      var key=cat.id+'_'+item.ar;
      var current=prog[key]||0;
      var done=current>=item.count;
      h+='<div style="padding:14px;background:rgba(255,255,255,0.02);border-radius:12px;margin-bottom:4px;border-left:3px solid '+(done?'#5dcaa5':cat.color)+';">';
      h+='<div style="font-family:Amiri,serif;font-size:20px;color:#e8dcc8;direction:rtl;text-align:right;line-height:1.8;margin-bottom:8px;">'+item.ar+'</div>';
      h+='<div style="font-size:12px;color:rgba(128,128,128,0.6);font-style:italic;margin-bottom:4px;">'+item.tr+'</div>';
      h+='<div style="font-size:13px;color:rgba(128,128,128,0.5);margin-bottom:8px;">'+item.meaning+'</div>';
      h+='<div style="display:flex;align-items:center;justify-content:space-between;">';
      h+='<div style="font-size:12px;color:'+(done?'#5dcaa5':cat.color)+';">'+(done?'✓ Выполнено':current+' / '+item.count)+'</div>';
      if(!done)h+='<button onclick="window._azInc(\''+cat.id+'\','+i+')" style="padding:8px 18px;background:rgba('+cat.color.replace('#','')+',0.1);border:1px solid '+cat.color+'30;border-radius:10px;color:'+cat.color+';font-size:13px;cursor:pointer;">+1</button>';
      h+='</div></div>';
    });
    h+='</div></div>';
  });

  el.innerHTML=h;
}

window._azToggle=function(id){
  var el=document.getElementById('azkar_'+id);
  if(!el)return;
  el.style.display=el.style.display==='none'?'block':'none';
};

window._azInc=function(catId,itemIdx){
  var cat=AZKAR.find(function(c){return c.id===catId;});
  if(!cat||!cat.items[itemIdx])return;
  var item=cat.items[itemIdx];
  var prog=getAzkarProgress();
  var key=catId+'_'+item.ar;
  prog[key]=(prog[key]||0)+1;
  setAzkarProgress(prog);
  if(prog[key]>=item.count&&typeof window.completeDailyTask==='function')window.completeDailyTask('read_azkar');
  injectAzkar();
  // Открываем обратно эту категорию
  var el=document.getElementById('azkar_'+catId);if(el)el.style.display='block';
};

setTimeout(injectAzkar,2000);
setTimeout(injectAzkar,5000);
console.log('📿 Азкары v2');
})();
