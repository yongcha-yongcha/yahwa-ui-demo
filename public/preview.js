/* 소개 본문 (Profile Facts) · 내 소개 미리보기와 상대 프로필이 같은 코드로 그려요
   이름 · 인증 배지 → 나이 · 지역 · 성별 → 해시태그 → 나에 대해(하는 일 · 키 · 성격 세 칸) → 생활(2×2 색연필 타일)
   사진은 위가 둥근 액자 + 넘김 점, 이야기 사이에는 일상 사진. 화면마다 다른 건 위쪽 머리와 아래 버튼뿐이에요. */
(()=>{
const preview=document.getElementById('preview');
if(!preview||typeof renderPreview!=='function')return;
const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 손그림 선 아이콘 (상세 정보 아이콘과 같은 결) */
const ART={
  job:'M4 8h16v11H4ZM9 8V5h6v3M4 13h16',
  height:'M7 3h10v18H7ZM7 7h4M7 11h6M7 15h4',
  mbti:'M4 5h16v12H9l-5 4ZM8 9h8M8 13h5',
  education:'m2 8 10-5 10 5-10 5ZM6 11v6q6 5 12 0v-6',
  religion:'M12 3v18M6 9h12',
  smoking:'M3 13h18v5H3ZM16 13v5M7 3q-3 3 0 5M12 3q-3 3 0 5',
  drinking:'M7 3h10v5a5 5 0 0 1-10 0ZM12 13v8M8 21h8'
};
const icon=k=>`<svg class="pv-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${ART[k]}"/></svg>`;
const KEY=[['job','하는 일'],['height','키'],['mbti','성격']];

const LIFE=[['smoking','담배'],['drinking','술'],['religion','종교'],['education','학력']];
const VLINE='<svg class="pv-vline" viewBox="0 0 6 60" preserveAspectRatio="none" aria-hidden="true"><path d="M3 4q-1.6 13 .2 26t-.4 26"/></svg>';
const clean=v=>{v=String(v??'').trim();return !v||v==='잘 모르겠어요'?'':v;};

/* 연필 결 필터 (한 번만) */
if(!$('pv-pencil'))document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="pv-pencil" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.25" result="g"/><feComposite in="d" in2="g" operator="in"/></filter></svg>');

/* ── 색연필 빗금: 타일 크기를 재서 그림. 같은 칸은 늘 같은 선(시드 고정) */
const rng=seed=>{let s=(seed*2654435761)>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};};
const tok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function segments(w,h,a,gap,r){
  const rad=a*Math.PI/180,dx=Math.cos(rad),dy=-Math.sin(rad),nx=-dy,ny=dx;
  const ts=[[0,0],[w,0],[0,h],[w,h]].map(([x,y])=>x*nx+y*ny),out=[];
  for(let t=Math.min(...ts)+gap*r();t<Math.max(...ts);t+=gap*(.7+.6*r())){
    let s0=-1e9,s1=1e9,ok=true;
    for(const [p,q,hi] of [[nx*t,dx,w],[ny*t,dy,h]]){
      if(Math.abs(q)<1e-9){if(p<0||p>hi)ok=false;continue;}
      let a1=-p/q,a2=(hi-p)/q;if(a1>a2)[a1,a2]=[a2,a1];s0=Math.max(s0,a1);s1=Math.min(s1,a2);
    }
    if(ok&&s1-s0>2)out.push([nx*t+dx*s0,ny*t+dy*s0,nx*t+dx*s1,ny*t+dy*s1]);
  }
  return out;
}
function hatch(tile,i,prefix){
  tile.querySelector('svg.pv-hatch')?.remove();
  const w=tile.offsetWidth,h=tile.offsetHeight;if(!w||!h)return;
  const n=(i%4)+1,col=tok(`--fact-pencil-${n}`),soft=parseFloat(tok('--fact-pencil-soft'))||.68,rad=parseFloat(tok('--fact-tile-radius'))||16,r=rng(i+1);
  const s=document.createElementNS(NS,'svg');s.setAttribute('class','pv-hatch');s.setAttribute('width',w);s.setAttribute('height',h);s.setAttribute('aria-hidden','true');
  const id=prefix+'c'+i;s.innerHTML=`<clipPath id="${id}"><rect width="${w}" height="${h}" rx="${rad}"/></clipPath>`;
  const g=document.createElementNS(NS,'g');g.setAttribute('filter','url(#pv-pencil)');g.setAttribute('clip-path',`url(#${id})`);s.append(g);
  const parts=[];
  segments(w,h,58,3,r).forEach(([ax,ay,bx,by])=>{
    const L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,t0=r()*5,t1=r()*5,j=()=>(r()-.5)*1.2;
    const sx=ax+ux*t0+j(),sy=ay+uy*t0+j(),ex=bx-ux*t1+j(),ey=by-uy*t1+j(),mx=(sx+ex)/2+(r()-.5)*1.6,my=(sy+ey)/2+(r()-.5)*1.6;
    parts.push(`<path d="M${sx.toFixed(1)} ${sy.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke-width="${(1.8*(.8+.4*r())).toFixed(2)}" stroke-opacity="${((.5+.4*r())*soft).toFixed(2)}"/>`);
  });
  g.setAttribute('stroke',col);g.setAttribute('fill','none');g.setAttribute('stroke-linecap','round');g.innerHTML=parts.join('');
  tile.prepend(s);
}
function drawAll(){document.querySelectorAll('.pv-me').forEach(box=>box.querySelectorAll('.pv-life>li').forEach((t,i)=>{const sv=t.querySelector('svg.pv-hatch');if(!sv||+sv.getAttribute('width')!==t.offsetWidth||+sv.getAttribute('height')!==t.offsetHeight)hatch(t,i,box.id);}));}
let rz;const ro=new ResizeObserver(()=>{clearTimeout(rz);rz=setTimeout(drawAll,40);});

/* ── 공통 소개 본문: 두 화면이 이 함수 하나를 써요 */
function factsHTML(d){
  /* F11 새 안 (2026-11-16, 시안 design-mockups/job-first-v2/): 이름 ・나이 + 인증 → 직업 → 사는 곳 → 해시태그 → 정보 목록.
     정보(키 · MBTI · 담배 · 술 · 종교 · 학력)는 상자 · 빗금 타일 없이 우리 손그림 아이콘 + 글자 두 줄. 성별은 보여 주지 않아요(소개 상대 성별이 이미 정해져 있어서).
     색은 쿨 뉴트럴: 값 900 · 직업 · 사는 곳 700 · 아이콘 500, 강조색 없음. */
  const facts=(d.facts||[]).filter(x=>x[1]);
  const Name=d.heading||'h2';
  return `<div class="pv-name-row"><${Name} class="pv-name">${esc(d.name)}</${Name}>${d.age?`<span class="pv-age"><span class="pv-age-dot" aria-hidden="true">・</span>${esc(d.age)}</span>`:''}</div>`
   +(d.job?`<p class="pv-line pv-job">${icon('job')}<span>${esc(d.job)}</span></p>`:'')
   +(d.region?`<p class="pv-line pv-region"><span class="ic ic-map-pin-fill" aria-hidden="true"></span><span>${esc(d.region)}</span></p>`:'')
   +(SHOW_TAGS&&d.tags?.length?`<ul class="pv-tags" aria-label="해시태그">${d.tags.map(t=>`<li>#${esc(t)}</li>`).join('')}</ul>`:'')
   +(facts.length?`<ul class="pv-mini" aria-label="정보">${facts.map(([id,v,l])=>`<li>${icon(id)}<span>${esc(v)}</span><span class="sr-only">${esc(l)}</span></li>`).join('')}</ul>`:'')
   +(!d.job&&!facts.length&&d.empty?`<p class="pv-empty">${esc(d.empty)}</p>`:'');
}
/* 정보 목록 순서: 키 · MBTI · 담배 · 술 · 종교 · 학력. 술은 값만으로 뜻이 약해 "술 가끔"처럼 앞에 붙여요 */
/* 2026-11-16 F12: 해시태그는 소개 본문에서 숨겨요(팀 링크에도 없음). 다시 보이려면 true로 */
const SHOW_TAGS=false;
const drinkText=v=>v&&!/술|마시|음주/.test(v)?'술 '+v:v;
const miniFacts=(h,mbti,smoke,drink,rel,edu)=>[['height',h,'키'],['mbti',mbti,'성격'],['smoking',smoke,'흡연'],['drinking',drinkText(drink),'음주'],['religion',rel,'종교'],['education',edu,'학력']];
function mount(box,d,badges){
  box.innerHTML=factsHTML(d);
  if(badges?.length)box.querySelector('.pv-name-row').append(...badges);
  const list=box.querySelector('.pv-life');if(list){ro.observe(list);requestAnimationFrame(drawAll);}
}

/* ── 사진 넘김 점: 화살표 대신 지금 몇 번째 사진인지 보여 줌 */
function dots(strip,wrap){
  if(!strip||!wrap)return;
  const n=strip.children.length;let box=wrap.querySelector('.pv-dots');
  if(n<2){box?.remove();return;}
  if(!box){box=document.createElement('div');box.className='pv-dots';box.setAttribute('aria-hidden','true');wrap.append(box);}
  box.innerHTML='<i></i>'.repeat(n);
  const sync=()=>{const i=Math.min(Math.round(strip.scrollLeft/Math.max(strip.clientWidth,1)),n-1);[...box.children].forEach((d,k)=>d.classList.toggle('is-on',k===i));strip.setAttribute('aria-label',`프로필 사진 ${i+1} / ${n}`);};
  if(!strip.dataset.pvDots){strip.dataset.pvDots='1';let t;strip.addEventListener('scroll',()=>{cancelAnimationFrame(t);t=requestAnimationFrame(()=>strip.__pvSync?.());},{passive:true});}
  strip.__pvSync=sync;sync();
}

/* ── 내 소개 미리보기 */
const val=id=>{const v=clean($(id)?.value);return v&&id==='height'?v+'cm':v;};
function buildMine(){
  const name=$('nickname')?.value.trim()||'나의 이름';
  /* 나이는 가입 흐름에서 아직 받지 않아요. 값이 생기면(window.yhMyAge) 상대 프로필처럼 위치 줄 앞에 붙여요 */
  const age=clean(window.yhMyAge);
  const meta=[age&&age+'세',$('region')?.value,document.querySelector('[name=gender]:checked')?.value].filter(Boolean);
  if(typeof syncGenderTags==='function')syncGenderTags();
  const tags=typeof selectedTags!=='undefined'?[...selectedTags]:[];
  let box=$('pv-me');
  if(!box){box=document.createElement('section');box.id='pv-me';box.className='pv-me';box.setAttribute('aria-label','나의 정보');preview.querySelector('.photo-carousel').after(box);}
  const cred=$('preview-credentials');
  mount(box,{name,age:age?age+'세':'',job:val('job'),region:$('region')?.value||'',tags,facts:miniFacts(val('height'),val('mbti'),val('smoking'),val('drinking'),val('religion'),val('education')),empty:'상세 정보를 아직 입력하지 않았어요.'},cred?[cred]:[]);
  mineRepOnly();
  dots($('preview-photo'),preview.querySelector('.photo-carousel'));
}
/* 내 소개도 상대 프로필과 같게 (2026-11-20): 맨 위는 대표 사진 한 장, 넘기지 않아요.
   이야기 사이 사진(.story-photo-frame, index.html이 넣음)은 대표를 빼고 두 번째 사진부터 한 장씩, 남으면 마지막 이야기 뒤에 */
function mineRepOnly(){
  const strip=$('preview-photo');if(strip){[...strip.children].slice(1).forEach(e=>e.remove());strip.scrollLeft=0;strip.setAttribute('aria-label','대표 사진');}
  const list=$('preview-answers');if(!list)return;
  list.querySelectorAll('.story-photo-frame').forEach(e=>e.remove());
  const rest=(typeof photoUrls!=='undefined'?photoUrls.filter(Boolean):[]).slice(1),cards=[...list.querySelectorAll('.q-card')];
  rest.forEach((src,k)=>{const f=document.createElement('figure');f.className='story-photo-frame';const img=document.createElement('img');img.src=src;img.alt='나의 사진 '+(k+2);img.loading='lazy';f.append(img);const card=cards[k];if(card&&k<cards.length-1)card.after(f);else list.append(f);});
}

/* ── 상대 프로필 */
const match=$('match-profile');
function buildTheirs(){
  if(!match||typeof demoMatches==='undefined')return;
  const m=demoMatches[matchIndex];if(!m)return;
  const f=m.facts||{},parts=String(m.meta||'').split('·').map(s=>s.trim()).filter(Boolean);
  const age=/^\d+$/.test(parts[0]||'')?parts.shift()+'세':'';
  let box=$('pv-them');
  const gallery=match.querySelector('.match-gallery-wrap');
  if(!box){box=document.createElement('section');box.id='pv-them';box.className='pv-me pv-them';gallery.after(box);}
  box.setAttribute('aria-label',m.name+'의 정보');
  const head=$('match-full-name');
  /* 인증 배지는 이름 줄로, 최근활동은 사진 아래 왼쪽으로 */
  const badges=head?[...head.querySelectorAll('.person-cert')]:[];
  const recent=head?.querySelector('.recent-activity');
  gallery.querySelectorAll('.recent-activity').forEach(e=>{if(e!==recent)e.remove();});
  if(recent){recent.classList.add('pv-recent');gallery.append(recent);}
  const hv=clean(f['키']);
  mount(box,{name:m.name,heading:'h1',age,job:clean(f['하는 일']),region:parts.join(' · '),tags:m.tags||[],
    facts:miniFacts(hv&&!/cm$/.test(hv)?hv+'cm':hv,clean(f['나의 성격']),clean(f['흡연']),clean(f['음주']),clean(f['종교']),clean(f['학력']))},badges);
  /* 이야기 연결점(맞춤 인연)은 소개 본문 뒤에 */
  const reason=match.querySelector('.story-match-reason');if(reason)box.after(reason);
  repOnly(m,gallery);
  dots($('match-gallery'),gallery);
  topBar(m);
}
/* 맨 위는 대표 사진 한 장만 — 넘기지 않아요 (2026-11-20). 사진만 넘겨 보고 소개는 안 읽는 걸 막으려고,
   나머지 사진은 이야기 사이 · 마지막 이야기 뒤에 한 장씩, 대표와 겹치지 않게 */
function repOnly(m,gallery){
  const strip=$('match-gallery');if(!strip)return;
  [...strip.children].slice(1).forEach(e=>e.remove());
  strip.scrollLeft=0;strip.setAttribute('aria-label',m.name+'의 대표 사진');
  gallery.querySelectorAll('.match-photo-back,.match-photo-forward').forEach(e=>e.remove());
  const stories=$('match-answers');if(!stories)return;
  stories.querySelectorAll('.match-story-photo').forEach(e=>e.remove());
  const rest=(m.photos||[]).slice(1),cards=[...stories.querySelectorAll('.q-card')];
  const frame=(ph,k)=>{const f=document.createElement('figure');f.className='match-story-photo';const d=document.createElement('div');d.style.backgroundImage='url('+ph.src+')';d.style.backgroundPosition=ph.position||'50% 40%';d.style.backgroundSize=ph.size||'cover';d.setAttribute('role','img');d.setAttribute('aria-label',m.name+'의 사진 '+(k+2));f.append(d);return f;};
  rest.forEach((ph,k)=>{const card=cards[k];const f=frame(ph,k);if(card&&k<cards.length-1)card.after(f);else stories.append(f);});
}
/* ── 상대 프로필 위쪽 머리 (시안 B): 맨 위에서는 뒤로 · 더보기만, 본문 이름이 머리 밑으로 사라지면 작은 사진 + 이름이 떠올라요 */
function topBar(m){
  const top=match.querySelector('.ob-top'),scroller=match.querySelector('.detail-scroll');if(!top||!scroller)return;
  /* 다른 사람을 열면 맨 위(사진)부터 */
  if(match.dataset.pvWho!==String(matchIndex)){match.dataset.pvWho=String(matchIndex);scroller.scrollTop=0;}
  let who=top.querySelector('.pv-head');
  if(!who){who=document.createElement('div');who.className='pv-head';who.setAttribute('aria-hidden','true');who.innerHTML='<span class="pv-head-av"></span><strong class="pv-head-name"></strong>';top.querySelector('button')?.after(who);}
  const p=m.photos?.[0];const av=who.querySelector('.pv-head-av');
  av.style.backgroundImage=p?`url("${p.src}")`:'';av.style.backgroundPosition=p?.position||'50% 30%';
  who.querySelector('.pv-head-name').textContent=m.name;
  const sync=()=>{const name=match.querySelector('#pv-them .pv-name');/* 내용이 머리 뒤로 지나가므로 머리 아래 끝을 기준으로 */const edge=top.getBoundingClientRect().bottom;
    top.classList.toggle('is-scrolled',scroller.scrollTop>2);
    top.classList.toggle('show-who',!!name&&name.getBoundingClientRect().bottom<edge+4);};
  if(!scroller.dataset.pvHead){scroller.dataset.pvHead='1';scroller.addEventListener('scroll',()=>match.__pvHead?.(),{passive:true});}
  match.__pvHead=sync;requestAnimationFrame(sync);
}

const prev=renderPreview;
renderPreview=function(){const r=prev.apply(this,arguments);buildMine();return r;};
if(typeof renderMatch==='function'){const prevMatch=renderMatch;renderMatch=function(){const r=prevMatch.apply(this,arguments);buildTheirs();return r;};}
const prevShow=show;
/* 다른 화면에서 상대 프로필로 새로 들어오면 같은 사람이어도 맨 위 · 첫 사진부터 보여요.
   (프로필 안에서 다시 그려질 때 · 더 깊은 화면에서 뒤로 돌아올 때는 보던 자리를 그대로 둬요) */
function resetMatchView(){const scroller=match?.querySelector('.detail-scroll'),strip=$('match-gallery');
  if(scroller)scroller.scrollTop=0;
  if(strip&&strip.scrollLeft){strip.scrollTo({left:0,behavior:'instant'});strip.dispatchEvent(new Event('scroll'));}
  match?.__pvHead?.();}
show=function(name){const entering=name==='match-profile'&&!!match&&match.hidden&&window.__navHint!=='pop';const r=prevShow.apply(this,arguments);if(entering)resetMatchView();if(name==='preview'||name==='match-profile')requestAnimationFrame(drawAll);return r;};
document.fonts?.ready.then(drawAll);
if(!preview.hidden)buildMine();
if(match&&!match.hidden)buildTheirs();
window.yhProfileFacts={html:factsHTML,mount,draw:drawAll};
})();
