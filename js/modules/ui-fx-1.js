setTimeout(function(){enhanceCards();},1500);

function enhanceCards(){
    var g=document.getElementById('collectionGrid');
    if(!g)return;
    var c=g.querySelectorAll('div[onclick]');
    c.forEach(function(d,i){
        var t=d.textContent||'';
        if(t.includes('Мифическая')||t.includes('mythic')){
            d.classList.add('card-holographic','card-float');
            d.style.border='3px solid gold';
        }
        else if(t.includes('Легендарная')||t.includes('legendary')){
            d.classList.add('card-holographic','card-float');
        }
        else if(t.includes('Эпическая')||t.includes('epic')){
            d.classList.add('card-rare');
        }
        d.style.opacity='0';
        d.style.transform='scale(0.5)';
        d.style.transition='all 0.5s ease';
        setTimeout(function(){
            d.style.opacity='1';
            d.style.transform='scale(1)';
        },i*50);
        var old=d.onclick;
        d.onclick=function(e){
            spawnP(e.clientX,e.clientY);
            d.style.transform='scale(0.9)';
            setTimeout(function(){
                d.style.transform='scale(1)';
                if(old)old.call(d,e);
            },150);
        };
    });
}

function spawnP(x,y){
    var e=['✨','💫','⭐','🌟','💎'];
    for(var i=0;i<8;i++){
        var p=document.createElement('div');
        p.className='card-particle';
        p.textContent=e[Math.floor(Math.random()*e.length)];
        p.style.left=x+'px';
        p.style.top=y+'px';
        p.style.setProperty('--px',(Math.random()-0.5)*100+'px');
        p.style.setProperty('--py',-(50+Math.random()*50)+'px');
        p.style.animationDelay=(i*0.05)+'s';
        document.body.appendChild(p);
        setTimeout(function(){p.remove();},1000);
    }
}

document.querySelectorAll('.collection-tab').forEach(function(t){
    t.addEventListener('click',function(){setTimeout(enhanceCards,300);});
});

document.getElementById('refreshCollectionBtn')?.addEventListener('click',function(){
    setTimeout(enhanceCards,500);
});
