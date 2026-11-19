/* 끝낸 순간 모션 · 줌 스루 (호감: 시안 like-motion 2번 · 편지 · 교환: 시안 done-moments, 2026-11-17 확정)
   공통 틀: 뒤 화면이 1.06배로 다가오며 흐려지고 막이 덮임 → 가운데 그림이 스프링으로 맺힘 → 글 →
   머문 뒤 그림 · 글이 먼저 사라지고, 화면이 제자리로 돌아오며 막이 걷혀요.
   - like    호감 보내기: 어두운 막(예전 장미 막) · 흰 하트 + 작은 하트 14개 · "호감을 보냈어요"(서로면 "서로 호감이에요") · 리프 +n
   - letter  편지 보냄: 파랑 막 · 흰 편지가 맺혔다 살짝 내려앉고 위 오른쪽으로 날아감 · "OO님에게 편지를 보냈어요"
   - request 교환 요청 보냄: 진한 회색 막 · 내 사진이 익명 동그라미를 톡 두드리면 고리 두 번 · "교환 요청을 보냈어요"
   - accept  교환 수락: 파랑 막 · 두 동그라미가 겹치며 익명 → 상대 사진, 작은 하트 · "서로의 프로필이 열렸어요"
   during: 막이 다 덮인 뒤 실행할 화면 이동(편지 보낸 화면 · 보낸 요청 탭 · 교환 기록 탭). 막이 걷히면 새 화면이 제자리로 와요.
   막을 누르면 머무는 시간을 건너뛰어요. 동작 줄이기면 막 · 글이 200ms로 나타났다 사라지기만. */
(()=>{
/* 호감 시안 값 · 2번 · 막 100% · 하트 100 · 튕김 0.40 · 반응 0.50s · 머묾 1.2s · 작은 하트 14 */
const V={dim:100,size:100,bounce:.40,resp:.50,hold:1200,count:14,zoom:1.06,blur:6};
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Apple 스프링: 감쇠(1 − 튕김) · 반응(초) → CSS linear() */
function spring(damping,response){
  const w=2*Math.PI/response,z=Math.min(1,Math.max(.2,damping));
  const f=t=>{if(z>=1)return 1-Math.exp(-w*t)*(1+w*t);const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t));};
  let T=0;for(let t=0;t<4;t+=.004)if(Math.abs(1-f(t))>.0015)T=t;
  T+=.02;const N=Math.min(100,Math.max(32,Math.round(T*70))),pts=[];
  for(let i=0;i<=N;i++)pts.push(+f(T*i/N).toFixed(4));pts[N]=1;
  return {easing:'linear('+pts.join(',')+')',ms:T*1000};
}
const SP=spring(1-V.bounce,V.resp),SOFT=spring(.85,.45);
const OUT='cubic-bezier(0.22, 1, 0.36, 1)',EIN='cubic-bezier(0.55, 0, 0.75, 0.2)';
const HEART='M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z';
const LETTER='M3 6Q12 5 21 6V19H3Z M3 7L12 14L21 7 M3 19L9 13 M21 19L15 13';
const PERSON='M12 12a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z M5 19.5c1.2-3.3 3.9-5 7-5s5.8 1.7 7 5';
const svgH=(s,fill)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" aria-hidden="true" style="display:block;overflow:visible"><path d="'+HEART+'" fill="'+fill+'"/></svg>';
const anim=(el,kf,o={})=>el.animate(kf,Object.assign({fill:'forwards'},o)).finished.catch(()=>{});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
/* 막 색: 장미(호감) · 파랑(편지 · 교환 수락, 주요 버튼 sky 500~700) · 진한 회색(교환 요청, cool-neutral 900) */
const TONE={
  /* 호감 · 서로 호감: 어두운 막(cool-neutral 900 58%), 흐린 뒤 화면이 비치고 흰 하트만 떠요 (피드백 · 시안 mutual-dim A, 2026-11-19) */
  dim:a=>'rgba(26,33,38,'+(a*.58)+')',
  rose:a=>'radial-gradient(120% 80% at 50% 42%, rgba(199,122,140,'+a+') 0%, rgba(178,96,115,'+a+') 48%, rgba(150,74,93,'+a+') 100%)',
  blue:a=>'radial-gradient(120% 80% at 50% 42%, rgba(78,138,176,'+a+') 0%, rgba(55,115,152,'+a+') 48%, rgba(36,93,126,'+a+') 100%)',
  ink:a=>'rgba(39,48,55,'+(a*.94)+')'
};
const KIND={like:'dim',letter:'blue',request:'ink',accept:'blue'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const myPhoto=()=>document.getElementById('my-page-photo')?.getAttribute('src')||'/profile-sample-1.png';

let busy=null;
function play(o={}){
  const phone=o.phone||document.querySelector('.phone');if(!phone){o.during?.();return Promise.resolve();}
  if(busy&&busy.phone===phone)busy.skip();
  const kind=o.kind||'like',W=phone.clientWidth,H=phone.clientHeight,CX=W/2,CY=Math.round(H*.44),a=V.dim/100;
  const fx=document.createElement('div');fx.className='lb-fx';fx.setAttribute('role','status');
  const veil=document.createElement('div');veil.className='lb-veil';veil.style.background=o.veil||TONE[KIND[kind]](a);
  fx.append(veil);phone.append(fx);
  const el=(html,css,cls)=>{const d=document.createElement('div');d.innerHTML=html||'';if(cls)d.className=cls;Object.assign(d.style,css||{});fx.append(d);return d;};
  const text={like:o.mutual?'서로 호감이에요':'호감을 보냈어요',letter:o.name?o.name+'님에게 편지를 보냈어요':'편지를 보냈어요',request:'교환 요청을 보냈어요',accept:'서로의 프로필이 열렸어요'}[kind];
  const visible=()=>[...phone.children].filter(n=>n!==fx&&!n.classList.contains('lb-fx')&&!n.hidden&&n.offsetParent!==null&&getComputedStyle(n).display!=='none');
  const scene=visible(),sceneAnims=[];
  let skip,skipped=new Promise(r=>skip=r),ran=false;
  const runDuring=()=>{if(ran)return;ran=true;try{o.during?.();}catch(e){console.error(e);}};
  const hold=ms=>Promise.race([wait(ms),skipped]);
  veil.addEventListener('click',()=>skip());
  const ctx={el,CX,CY,fx};
  const done=(async()=>{
    const m=el('<b>'+esc(text)+'</b>'+(kind==='like'&&o.leaf?'<small>리프 +'+o.leaf+'</small>':''),{},'lb-msg');
    if(reduce()){
      m.style.top=(CY-10)+'px';
      await Promise.all([anim(veil,[{opacity:0},{opacity:1}],{duration:200}),anim(m,[{opacity:0},{opacity:1}],{duration:200})]);
      runDuring();await hold(V.hold);await anim(fx,[{opacity:1},{opacity:0}],{duration:200});fx.remove();return;}
    scene.forEach(n=>{n.style.transformOrigin='50% 45%';sceneAnims.push(n.animate([{transform:'scale(1)',filter:'blur(0px)'},{transform:'scale('+V.zoom+')',filter:'blur('+V.blur+'px)'}],{duration:420,easing:OUT,fill:'forwards'}));});
    const covered=anim(veil,[{opacity:0},{opacity:1}],{duration:300,easing:'ease-out'});
    window.yhHaptic?.('success');try{navigator.vibrate&&navigator.vibrate(14);}catch(e){}
    covered.then(runDuring);
    const parts=await RUN[kind](ctx,m,hold);
    runDuring();
    /* 퇴장: 글 · 그림 먼저, 뒤 화면(이동했으면 새 화면)이 제자리로 오며 막이 걷힘 */
    anim(m,[{opacity:1},{opacity:0}],{duration:160});
    parts.forEach(p=>anim(p,[{transform:getComputedStyle(p).transform==='none'?'none':getComputedStyle(p).transform,opacity:1},{transform:'scale(.86)',opacity:0}],{duration:240,easing:EIN}));
    sceneAnims.forEach(x=>x.cancel());
    visible().forEach(n=>{n.style.transformOrigin='50% 45%';n.animate([{transform:'scale('+V.zoom+')',filter:'blur('+V.blur+'px)'},{transform:'scale(1)',filter:'blur(0px)'}],{duration:420,easing:OUT});});
    await anim(veil,[{opacity:1},{opacity:0}],{duration:340,easing:'ease-out'});
    fx.remove();
  })().finally(()=>{runDuring();sceneAnims.forEach(x=>x.cancel());scene.forEach(n=>n.style.transformOrigin='');if(busy&&busy.fx===fx)busy=null;if(fx.isConnected)fx.remove();});
  busy={fx,phone,skip:()=>skip()};
  return done;
}
const showMsg=(m,y,d)=>{m.style.top=y+'px';anim(m,[{transform:'translateY(8px)',opacity:0},{transform:'none',opacity:1}],{duration:420,easing:OUT,delay:d});};
const avatar=(c,x,s,html,cls,css)=>c.el(html||'',Object.assign({left:(x-s/2)+'px',top:(c.CY-s/2)+'px',width:s+'px',height:s+'px',opacity:0},css||{}),'lb-av '+(cls||''));
const anonInner=s=>'<svg width="'+s*.5+'" height="'+s*.5+'" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+PERSON+'"/></svg>';

const RUN={
  async like(c,m,hold){const s=V.size,h=c.el(svgH(s,'#fff'),{left:(c.CX-s/2)+'px',top:(c.CY-s/2)+'px',opacity:0},'lb-heart');
    anim(h,[{transform:'scale(1.9)',opacity:0,filter:'blur(10px)'},{transform:'scale(1)',opacity:1,filter:'blur(0px)'}],{duration:SP.ms,easing:SP.easing,delay:80});
    burst(c.fx,c.CX,c.CY,V.count,'heart');showMsg(m,c.CY+s/2+22,200);
    await hold(V.hold+200);return [h];},
  async letter(c,m,hold){const s=92,ic=c.el('<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="rgba(255,255,255,.14)" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;overflow:visible"><path d="'+LETTER+'"/></svg>',{left:(c.CX-s/2)+'px',top:(c.CY-s/2)+'px',opacity:0},'lb-heart');
    anim(ic,[{transform:'scale(1.9)',opacity:0,filter:'blur(10px)'},{transform:'scale(1)',opacity:1,filter:'blur(0px)'}],{duration:SP.ms,easing:SP.easing,delay:80});
    showMsg(m,c.CY+s/2+22,200);
    await hold(720);
    anim(ic,[{transform:'none',opacity:1},{transform:'translate(0,6px) scale(.96)',opacity:1,offset:.22},{transform:'translate(120px,-190px) rotate(-16deg) scale(.42)',opacity:0}],{duration:560,easing:'cubic-bezier(0.5, 0, 0.7, 0.4)'});
    await wait(300);burst(c.fx,c.CX+48,c.CY-76,9,'dot',Math.PI*.72);
    await hold(550);return [];},
  async request(c,m,hold){const s=68,them=avatar(c,c.CX+40,s,anonInner(s),'is-anon'),me=avatar(c,c.CX-40,s,'','',{backgroundImage:'url("'+myPhoto()+'")'});
    anim(me,[{transform:'translateX(-46px) scale(.8)',opacity:0},{transform:'none',opacity:1}],{duration:SP.ms,easing:SP.easing,delay:80});
    anim(them,[{transform:'translateX(46px) scale(.8)',opacity:0},{transform:'none',opacity:1}],{duration:SP.ms,easing:SP.easing,delay:120});
    showMsg(m,c.CY+s/2+26,220);
    await hold(560);
    anim(me,[{transform:'none'},{transform:'translateX(14px)',offset:.35},{transform:'none'}],{duration:420,easing:OUT});
    await wait(130);
    anim(them,[{transform:'none'},{transform:'translateX(5px) scale(.97)',offset:.3},{transform:'none'}],{duration:480,easing:SOFT.easing});
    for(let i=0;i<2;i++){const r=c.el('',{left:(c.CX+40-s/2)+'px',top:(c.CY-s/2)+'px',width:s+'px',height:s+'px',borderRadius:'50%',boxShadow:'0 0 0 2px rgba(255,255,255,.85)'});
      anim(r,[{transform:'scale(1)',opacity:.9},{transform:'scale(1.9)',opacity:0}],{duration:760,easing:OUT,delay:i*180});}
    await hold(1000);return [me,them];},
  async accept(c,m,hold){const s=76,photo=RUN.accept.photo,them=avatar(c,c.CX+24,s,'','',{backgroundImage:photo?'url("'+photo+'")':'none'}),anon=avatar(c,c.CX+24,s,anonInner(s),'is-anon',{boxShadow:'none'}),me=avatar(c,c.CX-24,s,'','',{backgroundImage:'url("'+myPhoto()+'")'});
    anim(me,[{transform:'translateX(-56px) scale(.8)',opacity:0},{transform:'none',opacity:1}],{duration:SP.ms,easing:SP.easing,delay:80});
    anim(them,[{transform:'translateX(56px) scale(.8)',opacity:0,filter:'blur(12px)'},{transform:'none',opacity:1,filter:'blur(12px)'}],{duration:SP.ms,easing:SP.easing,delay:80});
    anim(anon,[{transform:'translateX(56px) scale(.8)',opacity:0},{transform:'none',opacity:1}],{duration:SP.ms,easing:SP.easing,delay:80});
    await hold(560);
    anim(anon,[{opacity:1},{opacity:0}],{duration:260});
    anim(them,[{filter:'blur(12px)',transform:'scale(1)'},{filter:'blur(0px)',transform:'scale(1.06)',offset:.55},{filter:'blur(0px)',transform:'scale(1)'}],{duration:620,easing:OUT});
    await wait(180);burst(c.fx,c.CX,c.CY-8,12,'heart');showMsg(m,c.CY+s/2+26,0);
    await hold(1150);return [me,them];}
};

/* 작은 입자(하트 · 점): 처음 속도 → 공기 저항 · 살짝 위로 뜸. dir이 있으면 그쪽으로만 느리게 */
function burst(fx,CX,CY,n,kind,dir){
  const ps=[];
  for(let i=0;i<n;i++){let a=(i/n)*Math.PI*2+(Math.random()-.5)*.5,sp=280+Math.random()*280;
    if(dir!=null){a=dir+(Math.random()-.5)*1.1;sp=120+Math.random()*160;}
    const s=kind==='dot'?4+Math.random()*4:8+Math.random()*10;
    const d=document.createElement('div');d.className='lb-spark';
    d.innerHTML=kind==='dot'?'<i style="display:block;width:'+s+'px;height:'+s+'px;border-radius:50%;background:rgba(255,255,255,.9)"></i>':svgH(s,'rgba(255,255,255,.92)');
    Object.assign(d.style,{left:(CX-s/2)+'px',top:(CY-s/2)+'px'});fx.append(d);
    ps.push({d,x:0,y:0,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:0,vr:(Math.random()-.5)*360,life:0,max:(dir!=null?.8:.9)+Math.random()*.4});}
  let last=performance.now();
  const step=now=>{if(!fx.isConnected)return;const dt=Math.min(.033,(now-last)/1000);last=now;let alive=false;
    for(const p of ps){p.life+=dt;if(p.life>p.max){p.d.style.opacity=0;continue;}alive=true;
      const drag=Math.pow(.04,dt);p.vx*=drag;p.vy=p.vy*drag-90*dt;
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;const k=p.life/p.max,sc=k<.12?.4+k/.12*.6:1-(k-.12)*.4;
      p.d.style.transform='translate('+p.x+'px,'+p.y+'px) rotate('+p.r+'deg) scale('+sc+')';p.d.style.opacity=k<.65?1:1-(k-.65)/.35;}
    if(alive)requestAnimationFrame(step);};
  requestAnimationFrame(step);
}

const css=document.createElement('style');
css.textContent='.lb-fx{position:absolute;inset:0;z-index:90;overflow:hidden;pointer-events:none}'
 +'.lb-fx>*{position:absolute}'
 +'.lb-veil{inset:0;opacity:0;pointer-events:auto;cursor:pointer}'
 +'.lb-heart,.lb-spark,.lb-av{pointer-events:none;will-change:transform,opacity}'
 +'.lb-av{border-radius:50%;background-size:cover;background-position:50% 30%;box-shadow:0 0 0 3px rgba(255,255,255,.95)}'
 +'.lb-av.is-anon{display:grid;place-items:center;background:rgba(255,255,255,.22)}'
 +'.lb-msg{left:0;right:0;display:grid;justify-items:center;gap:4px;padding:0 var(--layout-gutter,20px);text-align:center;color:#fff;opacity:0;pointer-events:none;word-break:keep-all}'
 +'.lb-msg b{font:600 17px/1.4 var(--font-sans);letter-spacing:-.2px}'
 +'.lb-msg small{font:500 13px/1.4 var(--font-sans);color:rgba(255,255,255,.8);font-variant-numeric:tabular-nums}';
document.head.append(css);

/* 예전 말풍선은 이 모션이 대신해요 */
if(typeof playInterestBloom==='function')window.playInterestBloom=function(){document.querySelector('.interest-bloom')?.remove();};
window.yhLikeBurst={play:o=>play(Object.assign({kind:'like'},o)),values:V};
window.yhDone={play:(kind,o={})=>{if(kind==='accept')RUN.accept.photo=o.photo||'';return play(Object.assign({},o,{kind}));}};
})();
