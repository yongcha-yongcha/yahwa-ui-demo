/* 인연 홈 카드 · 공개 전(몽글 빛) · 열기 전(인연 열어보기) · 열기 모션(흐림이 걷히며 사진이 다가옴)
   값은 tokens.css의 --reveal-*. 기존 문 넘김 모션(window.revealDiscoveryCard)을 대체해요. */
(()=>{
const grid=document.getElementById('daily-grid');
if(!grid)return;
const root=document.documentElement;
const tok=n=>getComputedStyle(root).getPropertyValue(n).trim();
const num=(n,d)=>{const v=parseFloat(tok(n));return Number.isFinite(v)?v:d;};
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const hourOf=card=>parseInt(card.querySelector('.ready-time')?.textContent||'',10);

/* 카드마다 상태를 붙이고 필요한 층을 한 번만 만들어요 */
function decorate(){
  grid.querySelectorAll('.daily-card').forEach(card=>{
    if(card.dataset.opening)return;
    const thumb=card.querySelector('.match-sheet-thumb'),photo=card.querySelector('.fx-batch-image');
    if(!thumb||!photo)return;
    const locked=card.classList.contains('is-locked');
    const ready=locked&&!!card.querySelector('.open-card-label');
    card.classList.toggle('rv-ready',ready);
    card.classList.toggle('rv-locked',locked&&!ready);
    if(!locked){thumb.querySelectorAll('.rv-blobs,.rv-breath').forEach(e=>e.remove());card.querySelectorAll('.rv-open,.rv-arrive').forEach(e=>e.remove());return;}
    if(!thumb.querySelector('.rv-blobs')){
      const b=document.createElement('div');b.className='rv-blobs';b.setAttribute('aria-hidden','true');
      b.innerHTML='<i class="rv-blob b1"></i><i class="rv-blob b2"></i><i class="rv-blob b3"></i><i class="rv-blob b4"></i>';
      photo.after(b);
    }
    if(ready){
      if(!thumb.querySelector('.rv-breath')){const br=photo.cloneNode(false);br.className='rv-breath';br.removeAttribute('role');br.setAttribute('aria-hidden','true');photo.after(br);}
      const h=hourOf(card);
      if(!card.querySelector('.rv-arrive')&&h){const a=document.createElement('span');a.className='rv-arrive';a.textContent=h+':00에 도착한 인연';card.append(a);}
      if(!card.querySelector('.rv-open')){const o=document.createElement('span');o.className='rv-open';o.setAttribute('aria-hidden','true');o.textContent='인연 열어보기';card.append(o);}
      card.setAttribute('aria-label','인연 열어보기');
    }else{
      thumb.querySelector('.rv-breath')?.remove();
      const ov=card.querySelector('.locked-overlay'),h=hourOf(card);
      if(ov&&h&&!ov.querySelector('.rv-left')&&typeof releaseHour==='number'&&h>releaseHour){const l=document.createElement('span');l.className='rv-left';l.textContent=(h-releaseHour)+'시간 뒤에 만나요';ov.append(l);}
    }
  });
}
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate();});}).observe(grid,{childList:true,subtree:true});
decorate();

/* 열기 모션: 흐린 사진(덮개)을 아래에 깔고, 진짜 사진이 흐림을 걷으며 다가와요 */
window.revealDiscoveryCard=function(card,cover){
  const thumb=card.querySelector('.match-sheet-thumb'),photo=card.querySelector('.fx-batch-image');
  card.dataset.opening='true';card.classList.remove('rv-ready','rv-locked');
  const leaving=[...card.querySelectorAll('.rv-open,.rv-arrive,.card-scene-preview')];
  thumb?.querySelectorAll('.rv-blobs,.rv-breath').forEach(e=>e.remove());
  if(!thumb||!photo){leaving.forEach(e=>e.remove());return;}
  card.dataset.opening='true';
  const E=tok('--reveal-ease')||'cubic-bezier(0.23, 1, 0.32, 1)';
  const B=num('--reveal-ready-blur',14),dev=num('--reveal-develop',.06),clear=num('--reveal-clear-ms',1200),zoom=num('--reveal-zoom-ms',1850);
  const s0=num('--reveal-scale-from',.95),s1=num('--reveal-scale-to',1.07),iDelay=num('--reveal-info-delay',650),iGap=num('--reveal-info-gap',70);
  const iRise=num('--reveal-info-rise',16),iBlur=num('--reveal-info-blur',6),iMs=num('--reveal-info-ms',900);
  /* 덮개: 같은 사진을 흐린 채로 맨 아래에 (작게 시작해도 가장자리가 비지 않게) */
  cover.querySelectorAll('.locked-overlay,.rv-blobs,.rv-breath,.card-blur-layer,.card-tint').forEach(e=>e.remove());
  cover.className='match-sheet-thumb rv-cover';const cp=cover.querySelector('.fx-batch-image');/* 뒤 덮개는 --reveal-cover-scale만큼 키워 흐림이 투명하게 번지는 가장자리를 카드 밖으로 밀어내요 (2026-11-13) */if(cp){cp.style.filter=`blur(${B}px)`;cp.style.transform=`scale(${num('--reveal-cover-scale',1)})`;}cover.setAttribute('aria-hidden','true');
  thumb.prepend(cover);
  const anims=[];
  let ended=false;const done=()=>{if(ended)return;ended=true;anims.forEach(a=>{try{a.cancel()}catch(e){}});cover.remove();leaving.forEach(e=>e.remove());photo.style.transform='';photo.style.filter='none';delete card.dataset.opening;};
  if(reduce()){
    anims.push(photo.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease',fill:'backwards'}));
    leaving.forEach(e=>anims.push(e.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'})));
    Promise.all(anims.map(a=>a.finished.catch(()=>{}))).then(done);
    return;
  }
  /* 사진 크기: 끝(s1)을 지금 화면 그대로(1)로 두고, 시작을 s0/s1로 맞춰요 */
  const from=s0/s1;
  leaving.forEach(e=>anims.push(e.animate([{opacity:1,transform:getComputedStyle(e).transform==='none'?'none':getComputedStyle(e).transform},{opacity:0}],{duration:200,easing:'ease-out',fill:'forwards'})));
  anims.push(photo.animate([{filter:`blur(${B}px) saturate(${1-dev}) brightness(${1+dev})`},{filter:'blur(0px) saturate(1) brightness(1)'}],{duration:clear,delay:120,easing:E,fill:'both'}));
  anims.push(photo.animate([{transform:`scale(${from})`},{transform:'scale(1)'}],{duration:zoom,delay:120,easing:E,fill:'both'}));
  anims.push(cover.animate([{opacity:1},{opacity:0}],{duration:clear,delay:120+clear*.35,easing:E,fill:'forwards'}));
  /* 아래쪽 사진 색 번짐 · 흐림 층은 열리는 순간 한 번에 켜지지 않고 사진 흐림이 걷히는 속도로 스며들어요 (2026-11-13) */
  thumb.querySelectorAll(':scope>.card-tint,:scope>.card-blur-layer').forEach(e=>anims.push(e.animate([{opacity:0},{opacity:1}],{duration:clear,delay:120+clear*.35,easing:E,fill:'backwards'})));
  /* 글자: 사진처럼 흐린 채로 아래에서 떠오르며 선명해져요 (이름 · 지역 · 한 장면 제목 · 한 장면 글) */
  /* 열자마자 앱이 글자를 새로 그려(novDeck 등) 모션이 붙은 글자가 바뀌어요.
     그래서 글자가 바뀔 때마다 지난 시간만큼 앞당겨서 새 글자에 다시 붙여요. */
  const t0=performance.now(),textAnims=[];
  const animateCopy=()=>{
    const cp=card.querySelector('.nov-open-copy');if(!cp)return;
    const lines=[...cp.children].flatMap(c=>c.classList.contains('nov-scene')&&c.children.length?[...c.children]:[c]);
    /* 최근활동 칩(사진 왼쪽 위)도 이름과 같은 때에 같은 모션으로 떠올라요 */
    const chip=card.querySelector('.nov-activity');if(chip&&!chip.dataset.rvText){chip.dataset.rvText='1';const ca=chip.animate([{opacity:0,filter:`blur(${iBlur}px)`,transform:`translateY(${iRise}px)`},{opacity:1,filter:'blur(0px)',transform:'none'}],{duration:iMs,delay:iDelay,easing:E,fill:'backwards'});ca.currentTime=performance.now()-t0;textAnims.push(ca);}
    if(lines.length&&lines.every(l=>l.dataset.rvText))return;
    const spent=performance.now()-t0;
    lines.forEach((c,i)=>{c.dataset.rvText='1';const an=c.animate([{opacity:0,filter:`blur(${iBlur}px)`,transform:`translateY(${iRise}px)`},{opacity:1,filter:'blur(0px)',transform:'none'}],{duration:iMs,delay:iDelay+i*iGap,easing:E,fill:'backwards'});an.currentTime=spent;textAnims.push(an);});
  };
  animateCopy();
  const watch=new MutationObserver(animateCopy);watch.observe(card,{childList:true,subtree:true});
  const textEnd=iDelay+iGap*4+iMs+200;
  setTimeout(()=>{watch.disconnect();textAnims.forEach(a=>{try{a.cancel()}catch(e){}});card.querySelectorAll('[data-rv-text]').forEach(e=>delete e.dataset.rvText);},textEnd);
  Promise.all(anims.map(a=>a.finished.catch(()=>{}))).then(done);
  setTimeout(done,Math.max(clear,zoom)+iDelay+1200);
};
})();
