/* 상대 프로필 좌우 동그라미 버튼 + 관심 하트 모션 (시안 "하트가 뿅 튀었다 내려오며 채워지기" A 색 채움)
   - 왼쪽 관심 하트 · 오른쪽 편지를 아이콘만 있는 56px 동그라미로 보여 주고, 원래 문구는 aria-label로 남겨요.
   - 관심을 보내면: 버튼이 살짝 눌림 → 하트가 기울며 커지면서 뿅 튀어 오름(꼭대기에서 작은 하트 6개) →
     스프링처럼 튕기며 내려오는 동안 아래부터 채워짐 → 260ms 뒤 회색 비활성 버튼으로 바뀌어요.
   - 원래 하트 효과("마음이 한 걸음 가까이")와 리프 토스트는 그대로예요.
   서로 호감 표시 (시안 "글자 없는 하트 버튼에서 서로 호감을 어떻게 알려 줄까" B)
   - 누르기 전: 상대가 먼저 관심을 보냈으면 하트 버튼 오른쪽 위 작은 하트 뱃지 + 이름 아래 "나에게 호감을 보냈어요" 칩.
   - 누르는 순간: 하트 효과 문구가 "서로 호감이 있어요". (편지 버튼 툴팁은 onboard-tips.js)
   - 보낸 뒤 · 다시 열었을 때: 서로면 로즈 바탕 그대로 흰 하트 채움 + 칩 "서로 호감이 있어요",
     혼자면 회색 하트 + 회색 칩 "OO 님에게 호감을 보냈어요" (시안 "내가 보낸 호감도 칩으로" 회색).
   - 하트를 누른 때는 칩을 바로 바꾸지 않고, 하트가 내려앉은 뒤 살짝 떠오르며 바뀌어요.
   - 칩이 처음 생길 때는 자리가 260ms로 먼저 벌어지고 그 60% 지점부터 칩이 200ms 동안 떠올라요 (growChip). */
(()=>{
const like=document.getElementById('send-interest'),letter=document.getElementById('write-letter');
if(!like||!letter||typeof syncInterestAction!=='function')return;
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 시안에서 맞춘 값 */
const POP={press:.85,rise:20,peak:1.45,tilt:14,up:220,down:560,bounce:.38,fillAt:15,fillMs:420,offDelay:260,sparkN:6};

const HEART='M16 26C12 23 4.5 17.5 5 11.3C5.4 5.5 12.2 5.5 15.6 12.2C18.1 5.2 25.8 4.9 27 10.8C28.1 16.1 21.6 23.1 16 26Z';
const HEART_FILL='M16 27C12 24 3.6 18 4 11.2C4.4 4.5 12.1 4.3 15.6 10.2C18.3 3.9 26.8 3.8 28 10.6C29.1 16.5 22 24 16 27Z';
const tpl=html=>{const t=document.createElement('template');t.innerHTML=html;return t.content.firstElementChild;};
const heartIco=tpl(`<span class="ico" aria-hidden="true"><svg viewBox="0 0 32 32"><defs><clipPath id="act-heart-clip"><rect class="clip" x="0" y="0" width="32" height="32"/></clipPath></defs><path class="fill" d="${HEART_FILL}" clip-path="url(#act-heart-clip)"/><path class="line" d="${HEART}"/></svg></span>`);
const smallHeart=`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="${HEART_FILL}"/></svg>`;
const badge=tpl(`<span class="act-badge" aria-hidden="true" hidden>${smallHeart}</span>`);
const mailIco=tpl('<span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path class="line" d="M3 6Q12 5 21 6V19H3Z M3 7L12 14L21 7 M3 19L9 13 M21 19L15 13"/></svg></span>');
like.classList.add('act','heart');letter.classList.add('act','mail');

/* 원래 함수가 문구를 넣으면 문구는 aria-label로 옮기고 같은 아이콘 노드를 다시 끼워요 (모션 중이어도 끊기지 않게) */
let popFor=null,offTimer=0;
function stop(){clearTimeout(offTimer);popFor=null;like.classList.remove('is-popping');
  heartIco.getAnimations({subtree:true}).forEach(a=>a.cancel());like.getAnimations().forEach(a=>a.cancel());
  like.parentElement?.querySelectorAll('.act-spark').forEach(s=>s.remove());}
const incoming=()=>typeof incomingInterestIds!=='undefined'&&incomingInterestIds.has(matchIndex);
const sentNow=()=>typeof sentInterests!=='undefined'&&sentInterests.has(matchIndex);
/* 이름 아래 칩: 받은 관심 · 서로 호감 */
let deferChip=false;
function chip(animate){const box=document.getElementById('pv-them');if(!box||deferChip)return;
  const sent=sentNow(),inc=incoming(),name=(typeof demoMatches!=='undefined'&&demoMatches[matchIndex]?.name)||'';
  let c=box.querySelector('.pv-love');const text=inc?(sent?'서로 호감이 있어요':'나에게 호감을 보냈어요'):(sent&&name?name+' 님에게 호감을 보냈어요':'');
  if(!text){c?.remove();return;}
  const fresh=!c;
  if(!c){c=document.createElement('p');c.className='pv-love';c.innerHTML=smallHeart+'<span></span>';}
  const at=box.querySelector('.pv-meta')||box.querySelector('.pv-name-row');if(at&&c.previousElementSibling!==at)at.after(c);
  const changed=c.querySelector('span').textContent!==text;
  c.classList.toggle('is-neutral',sent&&!inc);c.querySelector('span').textContent=text;
  if(animate&&fresh)growChip(c);
  else if(animate&&changed&&!reduce())c.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});}
/* 칩이 처음 생길 때 (시안 "자리부터 부드럽게, 칩은 그다음에" 1번): 아래 내용이 한 번에 밀리지 않게
   칩 자리(위 여백 + 높이)가 먼저 벌어지고, 거의 다 벌어질 즈음 칩이 살짝 떠오르며 나타나요. 값은 tokens.css --love-chip-* */
function growChip(c){const css=getComputedStyle(c),tok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim(),ms=n=>parseFloat(tok(n))||0;
  const grow=ms('--love-chip-grow')||260,fade=ms('--love-chip-in')||200,at=parseFloat(tok('--love-chip-in-at'))||.6,rise=tok('--love-chip-rise')||'4px',ease=tok('--love-chip-ease')||'cubic-bezier(0.23, 1, 0.32, 1)';
  if(reduce()){c.animate([{opacity:0},{opacity:1}],{duration:fade});return;}
  const h=c.offsetHeight,mt=css.marginTop;
  c.animate([{height:'0px',marginTop:'0px',overflow:'hidden'},{height:h+'px',marginTop:mt,overflow:'hidden'}],{duration:grow,easing:ease});
  c.animate([{opacity:0,transform:'translateY('+rise+')'},{opacity:1,transform:'none'}],{duration:fade,delay:grow*at,easing:'cubic-bezier(0.23, 1, 0.32, 1)',fill:'backwards'});}
function paint(){
  const lt=like.textContent.trim(),mt=letter.textContent.trim();
  if(lt)like.setAttribute('aria-label',lt);if(mt)letter.setAttribute('aria-label',mt);
  const sent=sentNow(),inc=incoming();
  badge.hidden=!(inc&&!sent);like.classList.toggle('is-mutual',sent&&inc);
  like.replaceChildren(heartIco,badge);letter.replaceChildren(mailIco);
  if(popFor!==null&&popFor!==matchIndex){stop();deferChip=false;}
  chip();
}
const base=syncInterestAction;
window.syncInterestAction=function(...a){const r=base.apply(this,a);paint();return r;};
/* 프로필 본문(preview.js)이 다시 그려지면 칩도 다시 */
if(typeof renderMatch==='function'){const prev=renderMatch;window.renderMatch=function(...a){const r=prev.apply(this,a);chip();return r;};}
/* 서로가 되는 순간 하트 효과 문구 */
if(typeof playInterestBloom==='function'){const prevBloom=playInterestBloom;window.playInterestBloom=function(...a){const r=prevBloom.apply(this,a);
  if(incoming()){const t=document.querySelector('.interest-bloom span:last-child');if(t)t.textContent='서로 호감이 있어요';}return r;};}
paint();

/* 스프링 곡선 (내려오며 바닥에서 튕김): 감쇠 진동을 linear()로 */
function springEase(b){const n=40,pts=[];const z=Math.max(.05,1-b),w=2*Math.PI*1.1;
  for(let i=0;i<=n;i++){const t=i/n;let v;if(z>=1)v=1-Math.exp(-6*t)*(1+6*t);else{const wd=w*Math.sqrt(1-z*z);v=1-Math.exp(-z*w*t*4)*(Math.cos(wd*t*4)+z*w/wd*Math.sin(wd*t*4));}pts.push(i===n?1:+v.toFixed(4));}
  return 'linear('+pts.join(',')+')';}
const EASE_OUT='cubic-bezier(0.23, 1, 0.32, 1)',DOWN=springEase(POP.bounce);

function sparks(){const box=like.parentElement;if(!box)return;const pr=box.getBoundingClientRect(),br=like.getBoundingClientRect();
  const cx=br.left-pr.left+br.width/2,cy=br.top-pr.top+br.height/2-POP.rise;
  for(let i=0;i<POP.sparkN;i++){const s=document.createElement('span');s.className='act-spark';s.setAttribute('aria-hidden','true');
    s.innerHTML=`<svg viewBox="0 0 32 32"><path d="${HEART_FILL}"/></svg>`;s.style.left=(cx-5)+'px';s.style.top=(cy-5)+'px';box.append(s);
    const a=(-90+(i-(POP.sparkN-1)/2)*(150/Math.max(1,POP.sparkN-1)))*Math.PI/180,d=26+Math.random()*16,sz=.6+Math.random()*.6;
    s.animate([{opacity:0,transform:'translate(0,0) scale(.3)'},{opacity:1,transform:`translate(${Math.cos(a)*d*.6}px,${Math.sin(a)*d*.6}px) scale(${sz})`,offset:.35},{opacity:0,transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+8}px) scale(${sz*.7})`}],{duration:620,easing:EASE_OUT}).onfinish=()=>s.remove();}}

function pop(){
  stop();popFor=matchIndex;like.classList.add('is-popping');
  const ico=heartIco,clip=ico.querySelector('.clip'),me=popFor;
  const off=ms=>{offTimer=setTimeout(()=>{if(popFor===me){stop();deferChip=false;chip(true);}},ms);};
  if(reduce()){ico.animate([{opacity:.4},{opacity:1}],{duration:200});off(POP.offDelay);return;}
  const peak=`translateY(${-POP.rise}px) scale(${POP.peak}) rotate(${-POP.tilt}deg)`,rest='translateY(0) scale(1) rotate(0deg)';
  const rose=getComputedStyle(like).getPropertyValue('--action-love-fly').trim()||'currentColor',white=getComputedStyle(like).getPropertyValue('--white').trim()||'#fff';
  clip.animate([{transform:'translateY(32px)'},{transform:'translateY(32px)'}],{duration:POP.up,fill:'forwards'});
  like.animate([{transform:'scale(1)'},{transform:`scale(${POP.press})`},{transform:'scale(1)'}],{duration:160,easing:EASE_OUT});
  /* 흰 하트가 동그라미 밖으로 나가면 바탕에 묻혀서, 나는 동안만 로즈로 */
  ico.animate([{color:white},{color:rose,offset:.35},{color:rose}],{duration:POP.up,fill:'forwards'});
  ico.animate([{transform:rest},{transform:peak}],{duration:POP.up,easing:'cubic-bezier(0.2, 0.9, 0.3, 1)',fill:'forwards'}).finished.then(()=>{
    if(popFor!==me)return;
    ico.animate([{transform:peak},{transform:rest}],{duration:POP.down,easing:DOWN,fill:'forwards'});
    ico.animate([{color:rose},{color:rose,offset:.45},{color:white}],{duration:POP.down,fill:'forwards'});
    clip.animate([{transform:'translateY(32px)'},{transform:'translateY(0)'}],{duration:POP.fillMs,delay:POP.down*POP.fillAt/100,easing:'cubic-bezier(0.33, 1, 0.68, 1)',fill:'both'});
    sparks();off(POP.down+POP.offDelay);
  }).catch(()=>{});
}

/* 원래 click 처리(관심 저장 · 하트 효과 · 리프 토스트)가 끝난 뒤, 이번에 처음 보냈을 때만 */
let wasSent=true;
like.addEventListener('click',()=>{wasSent=typeof sentInterests==='undefined'||sentInterests.has(matchIndex);if(!wasSent)deferChip=true;},true);
like.addEventListener('click',()=>{if(!wasSent&&sentInterests.has(matchIndex))pop();else if(deferChip){deferChip=false;chip();}});
window.yhLikePop={pop,stop:()=>{stop();deferChip=false;},values:POP};
})();
