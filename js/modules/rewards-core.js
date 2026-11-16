/* Единая система наград Kunmusliman v27. Все звёзды начисляются через awardStars. */
(function(){
  const DAY=86400000;
  function ensure(){
    if(!window.userData) return null;
    const u=window.userData;
    if(!u.stars || typeof u.stars!=='object') u.stars={totalStars:0};
    if(!Array.isArray(u.starRewardClaims)) u.starRewardClaims=[];
    if(!u.starMilestones || typeof u.starMilestones!=='object') u.starMilestones={};
    return u;
  }
  window.awardStars=function(amount, source, claimKey){
    const u=ensure(); if(!u) return false;
    const n=Math.max(0,Math.floor(Number(amount)||0)); if(!n) return false;
    if(claimKey){
      if(u.starRewardClaims.includes(String(claimKey))) return false;
      u.starRewardClaims.push(String(claimKey));
      if(u.starRewardClaims.length>5000) u.starRewardClaims=u.starRewardClaims.slice(-4000);
    }
    u.stars.totalStars=Math.max(0,Number(u.stars.totalStars)||0)+n;
    u.stars.lastEarnSource=String(source||'activity');
    try{ if(typeof window.checkSahabiCards==='function') window.checkSahabiCards(); }catch(e){}
    try{ if(typeof window.updateStarsUI==='function') window.updateStarsUI(); }catch(e){}
    try{ if(typeof window.renderStars==='function') window.renderStars(); }catch(e){}
    try{ if(typeof window.updateStarsDisplay==='function') window.updateStarsDisplay(); }catch(e){}
    try{ if(typeof window.saveUserData==='function') window.saveUserData(); else if(typeof window.saveData==='function') window.saveData(); }catch(e){}
    try{ if(typeof window.refreshStarBalances==='function') window.refreshStarBalances(); }catch(e){}
    if(typeof window.showNotification==='function') window.showNotification('⭐ +'+n+' '+(n===1?'звезда':'звёзд')+' · '+(source||'награда'));
    return true;
  };
  window.awardMilestoneStars=function(source,total,step,starsPerStep){
    const u=ensure(); if(!u)return 0;
    const key=String(source||'activity'); const safeTotal=Math.max(0,Math.floor(Number(total)||0));
    const unit=Math.max(1,Math.floor(Number(step)||100)); const reward=Math.max(1,Math.floor(Number(starsPerStep)||1));
    const reached=Math.floor(safeTotal/unit); const claimed=Math.max(0,Math.floor(Number(u.starMilestones[key])||0));
    if(reached<=claimed)return 0;
    const count=(reached-claimed)*reward; u.starMilestones[key]=reached;
    window.awardStars(count, key+' · '+(reached*unit)+' выполнено', key+':milestone:'+reached);
    return count;
  };
  window.refreshStarBalances=function(){
    const total=(window.userData&&window.userData.stars&&window.userData.stars.totalStars)||0;
    ['starCountDisplay','chestSelectorStars','fathWheelStars','starsBalance','homeStarsCount','starsTotal','totalStarsDisplay'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=String(total);});
  };
})();
