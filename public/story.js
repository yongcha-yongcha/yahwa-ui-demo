/* 자기소개 · 메인(노트 한 장 · 테이프 라벨) → 질문 카드 덱 시트 → 쓰기(줄 노트 · 연필 게이지 · 글자 수 거점) */
(()=>{
const root=document.getElementById('story');
if(!root||typeof renderQuestions!=='function')return;
const MIN=20,END=200,MAX_PICKS=5;
/* 거점 이름은 숫자만. 최소는 빨간 점, 권장은 하늘 점으로 구분 */
const MARKS=[{n:20,l:'20',cls:'is-min',sr:'20자 최소'},{n:80,l:'80',cls:'is-rec',sr:'80자 권장'},{n:150,l:'150'},{n:200,l:'200'}];
const REACHED={20:'이제 담을 수 있어요',80:'권장 길이를 채웠어요',150:'대화가 더 잘 이어질 거예요',200:'가득 채웠어요'};
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const DRAWER='cubic-bezier(.32,.72,0,1)',EASE_OUT='cubic-bezier(.23,1,.32,1)';
const back=root.querySelector('.ob-top button');
const bottom=root.querySelector('.ob-bottom');
const next=document.getElementById('story-next');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const len=s=>[...(s||'').trim()].length;
const ok=id=>len(answers[id])>=MIN;
const picks=()=>[...chosen].filter(id=>id!==0);
const filled=()=>(ok(0)?1:0)+picks().slice(0,2).filter(ok).length;
const passed=()=>ok(0)&&completedQuestions().length>=3;
const catName=id=>questionGroups[questionCategories[id]]||'';
let view='main',editing=0,justFilled=-1,toastT,enterOk=false;

/* 아래 영역: 힌트 · 바꾸기 · 버튼 */
const hint=document.createElement('p');hint.className='st-hint';hint.setAttribute('aria-live','polite');
const swapBtn=document.createElement('button');swapBtn.type='button';swapBtn.className='st-textbtn';swapBtn.innerHTML='<span class="ic ic-repeat" aria-hidden="true"></span>다른 질문으로 바꾸기';
bottom.prepend(hint);next.before(swapBtn);

/* 아래 영역 높이가 화면마다 달라서 스크롤 영역이 그 위에서 끝나게 맞춤 */
function fitScroll(){const b=getComputedStyle(bottom),gap=parseFloat(b.bottom)||0;storyBody.style.bottom=Math.ceil(gap+bottom.offsetHeight+8)+'px';}
function say(text){document.querySelector('.fx-toast')?.remove();const el=document.createElement('div');el.className='fx-toast';el.setAttribute('role','status');el.textContent=text;document.querySelector('.phone').append(el);clearTimeout(toastT);toastT=setTimeout(()=>el.remove(),2000);}
function settle(){if(reduce.matches)return;[...storyBody.children].forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:320,delay:Math.min(i,3)*40,easing:EASE_OUT,fill:'backwards'}));}

const COUNT=['기본 소개부터 천천히 적어 봐요','두 장 더 담으면 돼요','한 장만 더 담으면 돼요','세 장을 다 담았어요'];
function entry(id,label,tone){
  const a=answers[id]||'',n=len(a),isNew=justFilled===id;
  const tail=n>=MIN?`<span class="st-ea">${esc(a)}</span>`:n>0?`<span class="st-ea">${esc(a)}</span><span class="st-draft">쓰는 중 · ${n}자</span>`:'<span class="st-ea">눌러서 첫 줄을 적어 보세요.</span>';
  return `<button type="button" class="st-entry${n?'':' is-empty'}${isNew?' is-new':''}" data-act="write" data-id="${id}"><span class="st-tape t${tone}">${label}</span><span class="st-eq">${esc(questions[id])}</span>${tail}</button>`;
}
const lock=(label,why)=>`<button type="button" class="st-blank is-lock" data-act="locked" data-why="${why}">${label} · ${why.replace(/\.$/,'')}</button>`;
function renderMain(){
  const p=picks(),basic=ok(0),n=filled();
  const slots=[0,1].map(k=>{const id=p[k],label='이야기 '+(k+1);
    if(id!=null)return entry(id,`${label} · ${catName(id)}`,2+k);
    if(!basic)return lock(label,'기본 소개를 먼저 써 주세요.');
    if(p.length===k)return `<button type="button" class="st-blank" data-act="sheet"><span class="ic ic-plus" aria-hidden="true"></span>${label} · 질문 붙이기</button>`;
    return lock(label,'앞 이야기를 먼저 담아 주세요.');}).join('');
  const extra=p.slice(2).map((id,i)=>entry(id,`더 담은 이야기 · ${catName(id)}`,[4,1,2][i%3])).join('');
  const more=n>=3&&p.length<MAX_PICKS?'<button type="button" class="st-textbtn st-more" data-act="sheet"><span class="ic ic-plus" aria-hidden="true"></span>질문 하나 더 붙이기 · 선택</button>':'';
  storyBody.innerHTML=`<h1>당신을 알아가는<br>작은 이야기</h1><p class="st-count">이야기 <b>${n}</b> / 3장 · ${COUNT[n]}</p><div class="st-note" role="group" aria-label="내 이야기 노트">${entry(0,'기본 소개 · 필수',1)}${slots}${extra}</div>${more}`;
  justFilled=-1;
  root.classList.remove('is-writing');
  hint.hidden=!passed();hint.textContent='이야기는 나중에 내 프로필에서도 고칠 수 있어요.';
  swapBtn.hidden=true;
  next.textContent=passed()?'다음':`이야기 ${3-n}장을 더 담아 주세요`;next.disabled=!passed();next.onclick=()=>{if(passed())show('preview');};/* 2026-11-19 팀 링크처럼 해시태그 단계 뺌 */
  fitScroll();
}

/* 쓰기 */
function stage(n){
  if(n===0)return ['idle','첫 줄을 편하게 적어 보세요',`${MIN}자부터 한 장으로 담을 수 있어요`];
  if(n<MIN)return ['warn',`${MIN}자까지 ${MIN-n}자 남았어요`,'짧은 소개는 담을 수 없어요'];
  if(n<80)return ['','이제 담을 수 있어요',`80자까지 쓰면 대화 거리가 생겨요 · ${80-n}자 남음`];
  if(n<150)return ['','권장 길이를 채웠어요',`150자면 대화가 더 잘 이어져요 · ${150-n}자 남음`];
  if(n<END)return ['','길게 쓴 소개일수록 대화가 더 잘 이어져요',`${END}자까지 ${END-n}자 남았어요`];
  return ['','꾹꾹 담은 이야기, 이제 만나러 가볼까요','300자까지 더 쓸 수 있어요'];
}
const xPct=n=>(10+Math.min(n,END)/END*296)/320*100;
function renderWrite(){
  const id=editing,k=picks().indexOf(id),help=questionHelp[id]||[];
  const eye=id===0?'기본 소개 · 필수':`${k>=2?'더 담은 이야기':'이야기 '+(k+1)} · ${catName(id)}`;
  const swapIc=id===0?'':'<button type="button" class="st-swap" data-act="swapq" aria-label="다른 질문으로 바꾸기"><span class="ic ic-repeat" aria-hidden="true"></span></button>';
  storyBody.innerHTML=`<p class="st-w-eye">${eye}</p><div class="st-w-head"><h1 class="st-w-q">“${esc(questions[id])}”</h1>${swapIc}</div>
  <div class="st-paper"><textarea id="st-text" maxlength="300" aria-label="${esc(questions[id])}" aria-describedby="st-help st-fb" placeholder="${esc(help[0]||'여기에 편하게 적어 주세요.')}">${esc(answers[id]||'')}</textarea><span class="st-sr" id="st-help">${esc(help[0]||'')}</span></div>
  <div class="st-meter" role="progressbar" aria-label="이야기 작성량" aria-valuemin="0" aria-valuemax="${END}"><svg viewBox="0 0 320 64" aria-hidden="true"><defs><clipPath id="st-reveal"><rect x="10" y="26" width="0" height="26"/></clipPath></defs><path class="st-meter-frame" d="M10 30Q152 28 308 30L307 48Q155 50 10 48Z"/><path class="st-meter-hatch" clip-path="url(#st-reveal)" d="${Array.from({length:37},(_,i)=>'M'+(10+i*8)+' 48l8-18').join(' ')}"/><g class="st-meter-pencil" transform="translate(10 48)"><path d="M0 0l3-11 24-24 8 8L11-3Z M3-11l8 8M6-8l24-24 M0 0l4-1-3-3Z"/></g></svg></div>
  <div class="st-marks" aria-hidden="true">${MARKS.map(m=>`<span class="st-mark${m.cls?' '+m.cls:''}" data-n="${m.n}" style="left:${xPct(m.n)}%"><i></i><small>${m.l}</small></span>`).join('')}</div>
  <div class="st-fb" id="st-fb" aria-live="polite"><p class="st-fb-main"><span></span><span></span></p></div>
  ${help[1]?`<div class="st-ex"><button type="button" class="st-ex-chip" data-act="ex" aria-expanded="false" aria-controls="st-ex-box"><span class="ic ic-pencil" aria-hidden="true"></span><span>예시 보기</span></button><div class="st-ex-box" id="st-ex-box" role="button" tabindex="0" data-act="copy" aria-label="예시 복사" hidden><p id="st-ex-text">${esc(help[1])}</p><p class="st-ex-hint" aria-hidden="true"><span class="ic ic-copy"></span><span>눌러서 복사</span></p></div></div>`:''}`;
  root.classList.add('is-writing');
  hint.hidden=true;swapBtn.hidden=true;
  next.textContent='이 이야기 담기';next.onclick=save;
  fitScroll();
  const ta=document.getElementById('st-text');let prev=len(ta.value),t;
  paint(prev,null);
  ta.addEventListener('input',()=>{answers[id]=ta.value;const n=len(ta.value);const crossed=paint(n,prev);prev=n;
    const m=root.querySelector('.st-meter');m.classList.add('is-scribble');clearTimeout(t);t=setTimeout(()=>m.classList.remove('is-scribble'),180);
    if(crossed){window.yhHaptic?.('selection');say(REACHED[crossed]);}});
  ta.addEventListener('change',()=>{window.yhPersist?.()});
}
function paint(n,prev){
  const [cls,main,sub]=stage(n),px=Math.min(n/END,1)*296;
  root.classList.toggle('is-warn',cls==='warn');root.classList.toggle('is-idle',cls==='idle');
  root.querySelector('#st-reveal rect').setAttribute('width',px);
  root.querySelector('.st-meter-pencil').setAttribute('transform',`translate(${10+px} ${48-(px%8)/8*18})`);
  root.querySelector('.st-meter').setAttribute('aria-valuenow',Math.min(n,END));
  root.querySelector('.st-fb-main span:first-child').textContent=main;
  root.querySelector('.st-fb-main span:last-child').textContent=n+'자';
  let crossed=null;
  root.querySelectorAll('.st-mark').forEach(m=>{const k=+m.dataset.n,on=n>=k;m.classList.toggle('is-on',on);if(prev!=null&&on&&prev<k){crossed=k;if(!reduce.matches)m.querySelector('i').animate([{transform:'scale(1)'},{transform:'scale(1.6)'},{transform:'scale(1)'}],{duration:260,easing:EASE_OUT});}});
  next.disabled=n<MIN;
  return crossed;
}
function save(){
  const id=editing;
  const ta=document.getElementById('st-text');if(ta)answers[id]=ta.value;
  if(len(answers[id])<MIN)return;
  window.yhPersist?.();
  const slotIdx=id===0?0:picks().indexOf(id)+1,counts=slotIdx<=2;
  const after=filled(),before=after-(!enterOk&&counts?1:0);
  if(after>before)justFilled=id;
  view='main';renderMain();settle();root.querySelector('.detail-scroll').scrollTop=0;
  window.yhHaptic?.('success');
  say(after>=3&&before<3?'세 장을 다 담았어요':`이야기 한 장을 담았어요 · ${Math.min(after,3)} / 3`);
}
function openWrite(id){editing=id;enterOk=ok(id);view='write';renderWrite();settle();root.querySelector('.detail-scroll').scrollTop=0;document.getElementById('st-text')?.focus({preventScroll:true});}

/* 질문 고르기 시트 */
let cat=1,swapFor=null;
function openSheet(replacing){
  swapFor=replacing??null;
  if(swapFor!=null)cat=questionCategories[swapFor];
  const phone=document.querySelector('.phone');phone.querySelector('.st-sheet-layer')?.remove();
  const opener=document.activeElement;
  const L=document.createElement('div');L.className='st-sheet-layer';
  L.innerHTML=`<div class="st-sheet-dim" data-act="close"></div><div class="st-sheet" role="dialog" aria-modal="true" aria-labelledby="st-sheet-title"><span class="st-sheet-handle" aria-hidden="true"></span><div class="st-sheet-head"><div><h2 id="st-sheet-title">어떤 이야기를 들려줄까요?</h2><p>마음이 가는 질문 카드를 골라요.</p></div><button type="button" class="choice-close" data-act="close" aria-label="질문 고르기 닫기"><span class="ic ic-close" aria-hidden="true"></span></button></div><div class="st-tabs" role="group" aria-label="질문 주제">${questionGroups.map((g,i)=>`<button type="button" data-act="cat" data-i="${i}" aria-pressed="${i===cat}">${g}</button>`).join('')}</div><div class="st-deck" aria-label="질문 카드"></div><div class="st-dots" aria-hidden="true"></div></div>`;
  const dim=L.querySelector('.st-sheet-dim'),sheet=L.querySelector('.st-sheet'),list=L.querySelector('.st-deck'),dots=L.querySelector('.st-dots');
  const syncDots=()=>{const c=list.firstElementChild;if(!c)return;const step=c.offsetWidth+parseFloat(getComputedStyle(list).columnGap||12);const i=Math.round(list.scrollLeft/step);dots.querySelectorAll('i').forEach((d,k)=>d.classList.toggle('is-on',k===Math.min(i,dots.children.length-1)));};
  const rows=()=>{const used=new Set(chosen);const items=questions.map((q,id)=>({q,id})).filter(x=>x.id!==0&&questionCategories[x.id]===cat);
    list.innerHTML=items.map(({q,id})=>{const u=used.has(id),ex=(questionHelp[id]||[])[1];return `<button type="button" class="st-qcard" data-act="pick" data-id="${id}" ${u?'disabled':''}><b>${esc(q)}</b><span>${ex?`<small>예) ${esc(ex)}</small>`:''}${u?'<em>고른 질문</em>':'<span class="go"><span class="ic ic-pencil" aria-hidden="true"></span>이 질문으로 쓰기</span>'}</span></button>`;}).join('');
    dots.innerHTML=items.map(()=>'<i></i>').join('');list.scrollLeft=0;syncDots();};
  list.addEventListener('scroll',()=>requestAnimationFrame(syncDots),{passive:true});
  rows();
  let closing=false;
  const key=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}if(e.key!=='Tab')return;const b=[...sheet.querySelectorAll('button:not(:disabled)')];const i=b.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();b[b.length-1].focus();}else if(!e.shiftKey&&i===b.length-1){e.preventDefault();b[0].focus();}};
  const close=(after)=>{if(closing)return;closing=true;document.removeEventListener('keydown',key,true);let ended=false;const end=()=>{if(ended)return;ended=true;L.remove();if(after)after();else opener?.isConnected&&opener.focus({preventScroll:true});};
    if(reduce.matches){L.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'}).onfinish=end;setTimeout(end,240);return;}
    dim.animate([{opacity:1},{opacity:0}],{duration:200,easing:'ease-out',fill:'forwards'});sheet.animate([{transform:'translateY(0)'},{transform:'translateY(100%)'}],{duration:240,easing:DRAWER,fill:'forwards'}).onfinish=end;setTimeout(end,320);};
  L.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const a=b.dataset.act;
    if(a==='close')return close();
    if(a==='cat'){cat=+b.dataset.i;L.querySelectorAll('.st-tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));rows();return;}
    if(a==='pick'){const id=+b.dataset.id;
      if(swapFor!=null){const order=[...chosen].map(x=>x===swapFor?id:x);chosen.clear();order.forEach(x=>chosen.add(x));}else chosen.add(id);
      window.yhPersist?.();
      close(()=>openWrite(id));}
  });
  phone.append(L);document.addEventListener('keydown',key,true);
  if(reduce.matches)L.animate([{opacity:0},{opacity:1}],{duration:160});else{dim.animate([{opacity:0},{opacity:1}],{duration:200,easing:'ease-out'});sheet.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:300,easing:DRAWER});}
  window.yhHaptic?.('selection');
  sheet.querySelector('.st-tabs [aria-pressed=true]')?.focus({preventScroll:true});
}

/* 이벤트 */
/* 노트 항목 눌림: 손가락이 닿자마자 작아지고(nov08.css .is-pressed), 끌어서 10px 넘게 움직이면 풀려요 */
let pressEl=null,pressX=0,pressY=0;
const unpress=()=>{pressEl?.classList.remove('is-pressed');pressEl=null;};
storyBody.addEventListener('pointerdown',e=>{if(e.button)return;const el=e.target.closest('.st-entry');if(!el)return;unpress();pressEl=el;pressX=e.clientX;pressY=e.clientY;el.classList.add('is-pressed');});
storyBody.addEventListener('pointermove',e=>{if(pressEl&&Math.hypot(e.clientX-pressX,e.clientY-pressY)>10)unpress();});
['pointerup','pointercancel','pointerleave'].forEach(t=>storyBody.addEventListener(t,unpress));
storyBody.addEventListener('keydown',e=>{const el=e.target.closest?.('.st-entry');if(el&&e.key===' '&&!e.repeat)el.classList.add('is-pressed');});
storyBody.addEventListener('keyup',e=>{if(e.key===' ')e.target.closest?.('.st-entry')?.classList.remove('is-pressed');});
storyBody.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||!root.contains(b))return;const a=b.dataset.act;
  if(a==='write')return openWrite(+b.dataset.id);
  if(a==='sheet')return openSheet();
  if(a==='locked'){say(b.dataset.why.replace(/\.$/,''));return;}
  if(a==='ex'){const p=document.getElementById('st-ex-box');const open=p.hidden;p.hidden=!open;b.setAttribute('aria-expanded',open);b.lastElementChild.textContent=open?'예시 접기':'예시 보기';}
  if(a==='swapq')return openSheet(editing);
  if(a==='copy'){const text=document.getElementById('st-ex-text').textContent,hintIc=b.querySelector('.st-ex-hint .ic'),hintTx=b.querySelector('.st-ex-hint span:last-child');
    const done=()=>{b.classList.add('is-done');hintIc.className='ic ic-copy-check';hintTx.textContent='복사됨';b.setAttribute('aria-label','예시 복사됨');say('예시를 복사했어요');clearTimeout(b._t);b._t=setTimeout(()=>{b.classList.remove('is-done');hintIc.className='ic ic-copy';hintTx.textContent='눌러서 복사';b.setAttribute('aria-label','예시 복사');},1600);};
    const fallback=()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('st-ex-text'));const s=getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy');s.removeAllRanges();done();}catch(e){say('예시를 길게 눌러 복사해 주세요');}};
    if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(done,fallback);else fallback();}
});
storyBody.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.st-ex-box')){e.preventDefault();e.target.click();}});
swapBtn.onclick=()=>openSheet(editing);
back.onclick=()=>{if(view==='write'){window.yhPersist?.();view='main';renderMain();settle();}else show('details');};

/* 시연 도구: 이야기를 채운 정도를 바꿔 보기 */
/* 가득 = 처음 시연 상태. 새로고침 뒤에도 같도록 고정값으로 둠 */
const DEMO={chosen:[0,10,15,4,11],answers:{0:'서비스를 기획하는 지우예요. 쉬는 날에는 필름카메라를 들고 익숙한 골목의 새로운 장면을 찾아요.',10:'작은 이야기도 귀 기울여 듣고 서로의 하루를 다정하게 응원해 주는 사람에게 마음이 가요.',15:'바다가 보이는 동네를 함께 걷고, 찍어 둔 사진을 보며 그날의 이야기를 오래 나누고 싶어요.',4:'필름 한 롤에 담은 동네의 장면들로 작은 사진 기록을 남기고 싶어요.',11:'좋아하는 동네 이야기를 들려주세요. 정답을 찾기보다 서로의 취향을 궁금해하며 편하게 웃는 대화가 좋아요.'}};
const sample=id=>DEMO.answers[id]&&len(DEMO.answers[id])>=MIN?DEMO.answers[id]:(questionHelp[id]||[])[1]||'';
const demoPicks=()=>{const p=DEMO.chosen.filter(id=>id!==0);return [p[0]??10,p[1]??15];};
const PRESETS=[['empty','비우기'],['draft','쓰는 중'],['one','1장'],['two','2장'],['three','3장'],['full','가득']];
function applyPreset(k){
  Object.keys(answers).forEach(id=>delete answers[id]);chosen.clear();
  if(k==='full'){Object.assign(answers,DEMO.answers);DEMO.chosen.forEach(id=>chosen.add(id));}
  else{chosen.add(0);const [a,b]=demoPicks();
    if(k==='draft')answers[0]=[...sample(0)].slice(0,12).join('');
    if(['one','two','three'].includes(k))answers[0]=sample(0);
    if(['two','three'].includes(k)){chosen.add(a);answers[a]=sample(a);}
    if(k==='three'){chosen.add(b);answers[b]=sample(b);}}
  chosen.add(0);window.yhPersist?.();
  document.querySelector('.phone .st-sheet-layer')?.remove();
  view='main';renderMain();settle();storyBody.scrollTop=0;
  dockBox.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.preset===k));
}
const dockBox=document.createElement('div');dockBox.className='dock-story';dockBox.id='dock-story';dockBox.hidden=true;
dockBox.innerHTML=`<p class="dock-sub">이야기 채운 정도</p><div class="dock-motion" role="group" aria-label="이야기 채운 정도">${PRESETS.map(([k,l])=>`<button type="button" data-preset="${k}" aria-pressed="false">${l}</button>`).join('')}</div><p class="dock-note">가득은 처음 시연 상태로 돌아가요.</p>`;
dockBox.addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b)applyPreset(b.dataset.preset);});
const dockEmpty=document.getElementById('dock-empty');
if(dockEmpty)dockEmpty.before(dockBox);
function syncDock(name){if(!dockEmpty)return;dockBox.hidden=name!=='story';if(name==='story')dockEmpty.hidden=true;}

/* 기존 렌더러 대체 */
renderQuestions=function(){chosen.add(0);if(view==='write')renderWrite();else renderMain();};
if(typeof questionCount==='function')questionCount=function(){if(view==='main')next.disabled=!passed();};
const prevShow=show;
show=function(name){if(name==='story'){view='main';}const r=prevShow.apply(this,arguments);if(name==='story')renderQuestions();syncDock(name);return r;};
renderQuestions();
syncDock(typeof active==='string'?active:'');
})();
