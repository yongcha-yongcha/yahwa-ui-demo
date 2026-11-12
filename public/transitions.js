/* 화면 전환 · GNB 고정 레이어 · 화면별 시연 도구 */
(()=>{
const $=id=>document.getElementById(id);
const phone=document.querySelector('.phone');
const nav=document.querySelector('.home-nav');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');

/* GNB: 화면이 바뀌어도 그대로 남도록 화면 밖 레이어로 분리 */
const layer=document.createElement('div');
layer.id='gnb-layer';layer.className='screen gnb-layer';
phone.append(layer);layer.append(nav);
const capsule=document.createElement('span');
capsule.className='gnb-capsule no-anim';capsule.setAttribute('aria-hidden','true');
nav.prepend(capsule);
/* 선택된 메뉴에서 보이는 채운 아이콘. 선 아이콘과 같은 모양을 안까지 채움 */
const FILL_ICONS={
  discovery:['0 0 24 24','<rect x="2.25" y="2.25" width="8.5" height="9.5" rx="2.5"/><rect x="13.25" y="2.25" width="8.5" height="9.5" rx="2.5"/><rect x="2.25" y="14.25" width="8.5" height="7.5" rx="2.5"/><rect x="13.25" y="14.25" width="8.5" height="7.5" rx="2.5"/>'],
  heartbox:['0 0 32 32','<path d="M16 27C12 24 3.6 18 4 11.2C4.4 4.5 12.1 4.3 15.6 10.2C18.3 3.9 26.8 3.8 28 10.6C29.1 16.5 22 24 16 27Z"/>'],
  chats:['0 0 24 24','<path d="M2.25 5.4Q12 4.2 21.75 5.4V19.75H2.25Z"/><path class="nav-fill-line" d="M3 7L12 14L21 7 M3 19L9 13 M21 19L15 13"/>'],
  community:['0 0 24 24','<path d="M3.25 4.25h17.5v13.5H9.3l-6.05 4.8Z"/><path class="nav-fill-line" d="M8 9h8M8 13h5"/>']
};
nav.querySelectorAll('button').forEach(b=>{
  const icon=FILL_ICONS[b.dataset.go||b.dataset.featureTab],symbol=b.querySelector('.nav-symbol'),line=symbol&&symbol.querySelector('svg');
  if(!icon||!line)return;
  line.classList.add('nav-line');
  line.insertAdjacentHTML('afterend',`<svg class="nav-fill" viewBox="${icon[0]}" aria-hidden="true">${icon[1]}</svg>`);
});
function placeCapsule(){
  const btn=nav.querySelector('button[aria-current="page"]');
  capsule.style.opacity=btn?1:0;
  if(!btn)return;
  capsule.style.width=btn.offsetWidth+'px';
  capsule.style.transform=`translateX(${btn.offsetLeft}px)`;
}
new MutationObserver(placeCapsule).observe(nav,{subtree:true,attributes:true,attributeFilter:['aria-current']});
const prevSync=syncAppNav;
syncAppNav=function(name){
  prevSync(name);
  layer.classList.toggle('is-off',!document.querySelector('.screen.has-app-nav'));
};

/* 화면 전환: 탭은 페이드, 깊어지면 밀려 들어오고 돌아오면 밀려 나감 */
const DEPTH={discovery:0,heartbox:0,chats:0,mypage:0,features:0,'match-profile':1,'letter-chat':2};
const FLOW=['welcome','auth','verify','verify-code','terms','profile','photos','details','story','hashtags','preview','submission','complete'];
const DRAWER='cubic-bezier(.32,.72,0,1)',EASE_OUT='cubic-bezier(.23,1,.32,1)';
/* 휴대폰 인증 · 약관 동의 · 기본 프로필은 한 페이지처럼 내용만 떠오르며 바뀜 */
const STEP_SCREENS=['verify','verify-code','terms','profile'];
/* 사진 등록 ~ 소개 미리보기도 같은 방식. 항목이 많아서 앞 4개까지만 차례로 떠오름 */
const INTRO_SCREENS=['photos','details','story','hashtags','preview'];
const STEP_MOTION={rise:30,duration:800,stagger:50,exit:100,maxStagger:3};
const STEP_FIXED='.ob-top,.ob-progress,.intro-step-gauge,.ob-bottom,.auth-back';
/* 튕김 없는 스프링 곡선 */
const STEP_EASE='linear('+Array.from({length:41},(_,i)=>{const t=i/40;return i===40?1:+(1-Math.exp(-9*t)*(1+9*t)).toFixed(4)}).join(',')+')';
function kind(a,b,hint){
  if(b==='splash'||(b==='welcome'&&a!=='auth'))return 'none';
  if(hint)return hint==='tab'?'fade':hint;
  if(STEP_SCREENS.includes(a)&&STEP_SCREENS.includes(b))return 'rise';
  if(INTRO_SCREENS.includes(a)&&INTRO_SCREENS.includes(b))return 'rise';
  /* 웰컴 ↔ 가입 · 로그인: 사진이 천천히 옅어지고 가입 내용이 떠오름 (시안 A) */
  if(a==='welcome'&&b==='auth')return 'wrise';
  if(a==='auth'&&b==='welcome')return 'wback';
  /* 가입 · 로그인 ↔ 휴대폰 인증: 떠오르기, 진행바는 새로 채움 */
  if((a==='auth'&&b==='verify')||(a==='verify'&&b==='auth'))return 'rise';
  /* 기본 프로필 ↔ 사진 등록: 앞뒤 화면과 같은 떠오르기로 잇고, 진행바만 새 장처럼 다시 채움 */
  if((a==='profile'&&b==='photos')||(a==='photos'&&b==='profile'))return 'rise';
  const ia=FLOW.indexOf(a),ib=FLOW.indexOf(b);
  if(ia>-1&&ib>-1)return ib>ia?'push':'pop';
  if(a in DEPTH&&b in DEPTH)return DEPTH[a]<DEPTH[b]?'push':DEPTH[a]>DEPTH[b]?'pop':'fade';
  return 'fade';
}
let pending=null;
function finish(){
  if(!pending)return;
  const p=pending;pending=null;
  p.anims.forEach(a=>a.cancel());
  p.clean();
}
const hideExcept=name=>document.querySelectorAll('.screen:not(.gnb-layer)').forEach(s=>{s.hidden=s.id!==name});
function animateBody(hint){
  const x=hint==='push'?24:hint==='pop'?-24:0;
  $('fx-body').animate([{opacity:0,transform:`translateX(${x}px)`},{opacity:1,transform:'translateX(0)'}],{duration:220,easing:EASE_OUT});
}
/* 웰컴 전환: 사진은 0.26초 동안 천천히 옅어지며 4% 커지고, 다음 화면 내용은 다른 단계처럼 떠오름 */
const WELCOME_MOTION={fade:260,grow:1.04,startAt:200,back:320,settle:700};
function riseItems(list,base,anims,cap=Infinity){
  list.forEach((c,i)=>{const delay=base+Math.min(i,cap)*STEP_MOTION.stagger;
    anims.push(c.animate([{transform:`translateY(${STEP_MOTION.rise}px)`},{transform:'translateY(0)'}],{duration:STEP_MOTION.duration,delay,easing:STEP_EASE,fill:'backwards'}));
    anims.push(c.animate([{opacity:0},{opacity:1}],{duration:STEP_MOTION.duration/2,delay,easing:EASE_OUT,fill:'backwards'}));});
}
const shownKids=el=>[...el.children].filter(c=>c.getClientRects().length);
function welcomeOut(old,next){
  const anims=[],W=WELCOME_MOTION;
  old.hidden=false;old.style.zIndex=2;old.style.pointerEvents='none';
  const visual=old.querySelector('.welcome-visual'),acts=old.querySelector('.welcome-actions');
  anims.push(old.animate([{opacity:1},{opacity:1,offset:.6},{opacity:0}],{duration:W.fade,fill:'forwards'}));
  if(visual)anims.push(visual.animate([{transform:'scale(1)'},{transform:`scale(${W.grow})`}],{duration:W.fade,easing:'ease-out',fill:'forwards'}));
  if(acts)shownKids(acts).forEach(c=>anims.push(c.animate([{opacity:1},{opacity:0}],{duration:140,easing:'ease-out',fill:'forwards'})));
  riseItems(shownKids(next).filter(c=>!c.matches(STEP_FIXED)),W.startAt,anims);
  const clean=()=>{old.hidden=true;old.style.zIndex='';old.style.pointerEvents='';};
  const token={anims,clean};pending=token;
  setTimeout(()=>{if(pending===token){clean();}},W.fade);
  Promise.all(anims.map(a=>a.finished)).then(()=>{if(pending===token)finish();}).catch(()=>{});
}
function welcomeIn(old,next){
  const anims=[],W=WELCOME_MOTION;
  old.hidden=false;old.style.zIndex=2;old.style.pointerEvents='none';old.style.setProperty('background','none','important');
  const exits=shownKids(old).map(c=>c.animate([{opacity:1},{opacity:0}],{duration:STEP_MOTION.exit,easing:'ease-out',fill:'forwards'}));
  anims.push(...exits);
  const visual=next.querySelector('.welcome-visual'),acts=next.querySelector('.welcome-actions');
  anims.push(next.animate([{opacity:0},{opacity:1}],{duration:W.back,delay:STEP_MOTION.exit,easing:EASE_OUT,fill:'backwards'}));
  if(visual)anims.push(visual.animate([{transform:`scale(${W.grow})`},{transform:'scale(1)'}],{duration:W.settle,delay:STEP_MOTION.exit,easing:EASE_OUT,fill:'backwards'}));
  const words=visual?[...visual.querySelectorAll('h1,.film-logo,.welcome-tilt-heart')]:[];
  riseItems([...words,...(acts?shownKids(acts):[])],STEP_MOTION.exit+120,anims);
  const clean=()=>{old.hidden=true;old.style.zIndex='';old.style.pointerEvents='';old.style.removeProperty('background');exits.forEach(a=>a.cancel());};
  const token={anims,clean};pending=token;
  Promise.all(exits.map(a=>a.finished)).then(()=>{if(pending===token)clean();}).catch(()=>{});
  Promise.all(anims.map(a=>a.finished)).then(()=>{if(pending===token)finish();}).catch(()=>{});
}
function riseSwap(old,next){
  const shown=c=>!c.matches(STEP_FIXED)&&c.getClientRects().length;
  const body=el=>[...el.children].filter(shown);
  /* 스크롤 영역이 있는 화면은 그 안의 항목을 띄움 */
  const items=el=>body(el).flatMap(c=>c.classList.contains('detail-scroll')?[...c.children].filter(x=>x.getClientRects().length):[c]);
  const anims=[];
  old.hidden=false;
  old.style.zIndex=2;old.style.pointerEvents='none';old.style.setProperty('background','none','important');
  const fixed=[...old.children].filter(c=>c.matches(STEP_FIXED));
  fixed.forEach(c=>{c.style.visibility='hidden'});
  const exits=body(old).map(c=>c.animate([{opacity:1},{opacity:0}],{duration:STEP_MOTION.exit,easing:'ease-out',fill:'forwards'}));
  anims.push(...exits);
  const cleanOld=()=>{old.hidden=true;old.style.zIndex='';old.style.pointerEvents='';old.style.removeProperty('background');fixed.forEach(c=>{c.style.visibility=''});exits.forEach(a=>a.cancel());};
  /* 화면 코드가 show() 안에서 내용을 다시 그리는 경우가 있어서(자기소개), 다 그린 뒤 항목을 잡음 */
  queueMicrotask(()=>{if(pending!==token)return;
  const scroll=next.querySelector('.detail-scroll');if(scroll)scroll.scrollTop=0;
  const cap=INTRO_SCREENS.includes(next.id)?STEP_MOTION.maxStagger:Infinity;
  items(next).forEach((c,i)=>{
    const delay=STEP_MOTION.exit+Math.min(i,cap)*STEP_MOTION.stagger;
    anims.push(c.animate([{transform:`translateY(${STEP_MOTION.rise}px)`},{transform:'translateY(0)'}],{duration:STEP_MOTION.duration,delay,easing:STEP_EASE,fill:'backwards'}));
    anims.push(c.animate([{opacity:0},{opacity:1}],{duration:STEP_MOTION.duration/2,delay,easing:EASE_OUT,fill:'backwards'}));
  });
  });
  const from=old.querySelector('.ob-progress i,.intro-step-gauge i'),to=next.querySelector('.ob-progress i,.intro-step-gauge i');
  /* 가입 3단계와 소개 5단계는 다른 장: 진행바가 줄어들지 않고 빈 막대에서 새로 채워짐 */
  const chapter=STEP_SCREENS.includes(old.id)!==STEP_SCREENS.includes(next.id);
  if(chapter&&to&&to.style.width){
    const bar=to.parentElement,label=next.querySelector('.intro-step-label');
    anims.push(bar.animate([{opacity:0},{opacity:1}],{duration:200,delay:STEP_MOTION.exit,easing:EASE_OUT,fill:'backwards'}));
    anims.push(to.animate([{width:'0%'},{width:to.style.width}],{duration:520,delay:STEP_MOTION.exit+180,easing:DRAWER,fill:'backwards'}));
    if(label)anims.push(label.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:280,delay:STEP_MOTION.exit+120,easing:EASE_OUT,fill:'backwards'}));
  }else if(from&&to&&from.style.width&&to.style.width)anims.push(to.animate([{width:from.style.width},{width:to.style.width}],{duration:360,easing:DRAWER}));
  const token={anims,clean:cleanOld};
  pending=token;
  if(exits.length)Promise.all(exits.map(a=>a.finished)).then(()=>{if(pending===token)cleanOld();}).catch(()=>{});else cleanOld();
  queueMicrotask(()=>Promise.all(anims.map(a=>a.finished)).then(()=>{if(pending===token)finish();}).catch(()=>{}));
}
window.swapScreens=(prev,name)=>{
  finish();
  const hint=window.__navHint;window.__navHint=null;
  const next=$(name),old=$(prev);
  hideExcept(name);
  if(prev===name){if(name==='features'&&hint&&hint!=='tab'&&!reduce.matches)animateBody(hint);return;}
  const k=reduce.matches||!old?'none':kind(prev,name,hint);
  if(k==='none')return;
  /* 하단 메뉴 탭끼리(같은 깊이 0)는 애니메이션 없이 바로 바꿔요(시안 “탭 전환 잔상” T2).
     예전에는 옛 화면 위에서 새 화면이 170ms 동안 서서히 나타나 두 화면이 겹쳐 보였어요. 하단 메뉴 캡슐 움직임은 그대로 */
  if(k==='fade'&&(hint==='tab'||(DEPTH[prev]===0&&DEPTH[name]===0)))return;
  if(k==='rise'){riseSwap(old,next);return;}
  if(k==='wrise'){welcomeOut(old,next);return;}
  if(k==='wback'){welcomeIn(old,next);return;}
  old.hidden=false;
  old.style.pointerEvents='none';
  const anims=[];
  const add=(el,kf,o)=>anims.push(el.animate(kf,o));
  if(k==='fade'){
    next.style.zIndex=1;
    add(next,[{opacity:0},{opacity:1}],{duration:170,easing:EASE_OUT});
  }else if(k==='push'){
    next.style.zIndex=2;old.style.zIndex=1;
    add(next,[{transform:'translateX(100%)'},{transform:'translateX(0)'}],{duration:300,easing:DRAWER});
    add(old,[{transform:'translateX(0)',opacity:1},{transform:'translateX(-24%)',opacity:.72}],{duration:300,easing:DRAWER});
  }else{
    old.style.zIndex=2;next.style.zIndex=1;
    add(old,[{transform:'translateX(0)'},{transform:'translateX(100%)'}],{duration:280,easing:DRAWER});
    add(next,[{transform:'translateX(-24%)',opacity:.72},{transform:'translateX(0)',opacity:1}],{duration:280,easing:DRAWER});
  }
  const token={anims,clean(){old.hidden=true;old.style.pointerEvents='';old.style.zIndex='';next.style.zIndex='';}};
  pending=token;
  Promise.all(anims.map(a=>a.finished)).then(()=>{if(pending===token)finish();}).catch(()=>{});
};

/* 시연 도구: 휴대폰 옆에 붙이고, 지금 화면에 필요한 조건만 표시 */
const lab=$('fx-simulations');
const timeDemo=document.querySelector('.time-demo');
const motion=$('motion-preview'),flow=$('flow');
const dock=document.createElement('aside');
dock.className='demo-dock';dock.setAttribute('aria-label','시연 도구');
dock.innerHTML=`<div class="dock-head"><b>시연 도구</b><span id="dock-title"></span></div>
<label class="dock-field"><span>화면 이동</span><select id="dock-screen"></select></label>
<section class="dock-context"><h2>이 화면에서 바꿔보기</h2><div class="dock-motion" id="dock-motion"></div><div id="dock-time"></div><div id="dock-lab"></div><p class="dock-empty" id="dock-empty" hidden>이 화면에서 바꿀 조건은 없어요.</p></section>`;
document.body.append(dock);
$('dock-motion').append(motion,flow);
if(timeDemo)$('dock-time').append(timeDemo);
if(lab){$('dock-lab').append(lab);lab.open=true;}
const sections=lab?[...lab.querySelectorAll('.demo-groups>section')]:[];
sections.forEach(s=>{const h=s.querySelector('h3');if(h)h.textContent=h.textContent.replace(/^\d+\.\s*/,'')});

const select=$('dock-screen');
const flowOptions=[...document.querySelectorAll('nav.categories [data-screen]')].filter(b=>b.dataset.screen!=='discovery').map(b=>[b.dataset.screen,b.textContent.trim()]);
const appOptions=[['discovery','인연 홈'],['match-profile','상대 프로필'],['heartbox','마음함'],['chats','편지함'],['letter-chat','편지'],['community','커뮤니티'],['mypage','마이페이지']];
const group=(l,o)=>`<optgroup label="${l}">${o.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</optgroup>`;
select.innerHTML='<option value="" hidden>세부 화면</option>'+group('앱 화면',appOptions)+group('가입 흐름',flowOptions);
select.onchange=()=>{
  const v=select.value;
  if(v==='community'){nav.querySelector('[data-feature-tab="community"]').click();return;}
  window.__navHint='fade';show(v);
};
const COMMUNITY=['community','post','compose-post','exchange','exchange-release-confirm','activity','notifications','community-guide'];
const LETTER=['letter','compose-letter','letter-decline'];
const PLACE=['places','shop','coupons','coupon-detail','coupon-confirm','place-help','point-ledger','wallet','ledger'];
const BY_SCREEN={discovery:[0],'match-profile':[0],mypage:[0,3],heartbox:[1,3],chats:[1,3],'letter-chat':[1,3]};
function contextFor(name){
  if(name!=='features')return BY_SCREEN[name]||[];
  const v=window.__fxView;
  if(COMMUNITY.includes(v))return [2];
  if(LETTER.includes(v))return [1,3];
  if(PLACE.includes(v))return [3];
  if(v==='credentials')return [0];
  return [];
}
function updateDock(name){
  const fxView=window.__fxView;
  select.value=name==='features'?(COMMUNITY.includes(fxView)?'community':''):name;
  const opt=select.selectedOptions[0];
  $('dock-title').textContent=opt?opt.textContent:'';
  const ctx=contextFor(name);
  sections.forEach((s,i)=>{s.hidden=!ctx.includes(i)});
  if(lab){
    lab.classList.toggle('is-empty',!ctx.length);
    lab.querySelectorAll('.demo-link').forEach(l=>{
      const here=l.dataset.demoGo===name||(l.dataset.featureDemo==='community'&&name==='features'&&COMMUNITY.includes(fxView))||(l.dataset.fx==='credentials'&&name==='features'&&fxView==='credentials');
      l.hidden=here;
    });
  }
  const timeOn=timeDemo&&!timeDemo.hidden;
  const motionOn=!motion.hidden||!flow.hidden;
  $('dock-motion').hidden=!motionOn;
  $('dock-empty').textContent=name==='verify-code'?'시연용 인증번호는 123456이에요.':'이 화면에서 바꿀 조건은 없어요.';
  $('dock-empty').hidden=!!(ctx.length||timeOn||motionOn);
}
/* 웰컴의 모션 확인은 진입 모션 전체를 다시 재생 */
motion.addEventListener('click',e=>{
  if(active!=='welcome')return;
  e.stopImmediatePropagation();
  show('welcome');
},true);
const prevShow=show;
/* GNB로 오가는 화면은 뒤로가기 없이 제목을 위로 올림 */
function syncTabRoot(name){
  const root=name==='features'&&window.__fxView==='community';
  $('features').classList.toggle('is-tab-root',root);
}
show=function(name){prevShow(name);syncTabRoot(name);updateDock(name);};

/* 알림(토스트)은 지금 화면의 아래 버튼 영역과 하단 탭 위 12px에 띄움. 아래 영역을 침범하지 않게
   (상대 프로필처럼 버튼 영역이 하단 탭 위에 떠 있어도 .ob-bottom이면 기준에 넣어요) */
const TOAST_GAP=12;
function placeToast(el){
  const pr=phone.getBoundingClientRect(),z=pr.height/phone.offsetHeight||1;
  const cur=typeof active==='string'&&document.getElementById(active);
  const scr=cur&&!cur.hidden?cur:[...phone.querySelectorAll(':scope>.screen:not([hidden]):not(.gnb-layer)')].pop();
  const cands=[...(scr?scr.children:[])];
  if(!layer.classList.contains('is-off'))cands.push(nav);
  let top=pr.bottom;
  cands.forEach(n=>{if(!n.getClientRects().length)return;const cs=getComputedStyle(n);if(!/absolute|fixed|sticky/.test(cs.position))return;if(!n.querySelector('button,a,[role=button]'))return;const r=n.getBoundingClientRect();if((r.bottom<pr.bottom-64*z&&!n.classList.contains('ob-bottom'))||r.top<pr.top+pr.height*.4)return;top=Math.min(top,r.top);});
  el.style.bottom=Math.round((pr.bottom-top)/z+TOAST_GAP)+'px';
}
/* 알림 모션: 아래에서 7px · 90%에서 떠오르며 460ms로 나타나고, 최소 2.8초 머문 뒤 4px 내려가며 380ms로 흐려짐(부드러운 ease-out). 새 알림으로 바뀔 땐 이전 것은 바로 빠짐 */
const TOAST={show:2800,in:460,out:380,rise:7,fall:4,scale:.9,ease:'cubic-bezier(.16,1,.3,1)'};
const toastIn=()=>reduce.matches?[{opacity:0},{opacity:1}]:[{opacity:0,transform:`translateY(${TOAST.rise}px) scale(${TOAST.scale})`},{opacity:1,transform:'none'}];
const toastOut=()=>reduce.matches?[{opacity:1},{opacity:0}]:[{opacity:1,transform:'none'},{opacity:0,transform:`translateY(${TOAST.fall}px)`}];
new MutationObserver(list=>{
  let added=false;
  list.forEach(m=>m.addedNodes.forEach(n=>{if(n.classList?.contains('fx-toast')&&!n.classList.contains('is-leaving')){added=true;n.dataset.shownAt=performance.now();placeToast(n);n.animate(toastIn(),{duration:TOAST.in,easing:TOAST.ease});}}));
  if(added){phone.querySelectorAll('.fx-toast.is-leaving').forEach(x=>x.remove());return;}
  list.forEach(m=>m.removedNodes.forEach(n=>{if(!n.classList?.contains('fx-toast')||n.classList.contains('is-leaving'))return;
    n.classList.add('is-leaving');n.removeAttribute('role');n.setAttribute('aria-hidden','true');phone.append(n);
    const wait=Math.max(0,TOAST.show-(performance.now()-(+n.dataset.shownAt||0)));
    setTimeout(()=>{if(!n.isConnected)return;const done=()=>n.remove();const a=n.animate(toastOut(),{duration:TOAST.out,easing:TOAST.ease,fill:'forwards'});a.onfinish=done;setTimeout(done,TOAST.out+80);},wait);}));
}).observe(phone,{childList:true});

function fit(){phone.style.zoom=innerWidth>=760?Math.min(1,(innerHeight-32)/780):1;placeCapsule();}
addEventListener('resize',fit);
syncAppNav(active);
fit();
updateDock(active);
requestAnimationFrame(()=>requestAnimationFrame(()=>capsule.classList.remove('no-anim')));
})();
