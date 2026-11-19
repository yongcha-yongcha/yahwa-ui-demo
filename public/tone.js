/* 1차 피드백 F1~F4 비교용 (2026-11-15) · tone.css와 함께 써요
   - 시연 도구의 "디자인 컨셉" 아래에 "배경"과 "버튼 색" 고르기를 붙여요.
   - 고른 값은 이 브라우저에 남고(yahwa-tone-bg / -btn / -open), 처음부터 다시 시작해도 유지돼요.
   - 주소로도 고를 수 있어요: ?bg=sky|white · ?btn=deep|deep50|soft|mid · ?open=white|deep|sky200|sky300 · ?cardrow=in|below · ?pager=num|peek|chip */
(()=>{
const root=document.documentElement;
const OPT={bg:{key:'yahwa-tone-bg',vals:['sky','white'],def:'sky'},btn:{key:'yahwa-tone-btn',vals:['deep','deep50','soft','mid'],def:'deep'},open:{key:'yahwa-tone-open',vals:['white','deep','sky200','sky300'],def:'white'},cardrow:{key:'yahwa-tone-row-v4',vals:['in','below'],def:'below'} /* 2026-11-19: 다시 카드 아래가 기본. 인연 열어보기 → 연 뒤 같은 자리 "프로필 보기 ›"(시안 home-no-actions A). 카드 안에 버튼이 들어가면 서로 연결됨 버튼이 사진을 가려서. 예전 선택이 남아 있어도 새 기본으로 보이게 저장 이름을 바꿨어요 */,pager:{key:'yahwa-tone-pager-v2',vals:['num','peek','chip'],def:'peek'},certstack:{key:'yahwa-tone-certstack',vals:['off','on'],def:'off'} /* 2026-11-18 인증 여러 개일 때 겹친 배지 보여 주기 */ /* 2026-11-16: 옆 카드 살짝이 기본. 예전에 고른 값이 남아 있어도 새 기본으로 보이게 저장 이름을 바꿨어요 */};
const q=new URLSearchParams(location.search);
const read=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const write=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const cur={};
for(const [name,o] of Object.entries(OPT)){
 const fromQ=q.get(name);
 let v=o.vals.includes(fromQ)?fromQ:read(o.key);
 if(!o.vals.includes(v))v=o.def;
 if(o.vals.includes(fromQ))write(o.key,v);
 cur[name]=v;root.dataset[name]=v;
}
/* 배경 끄기(2026-11-16): 처음 그려졌을 때 그라데이션이 있던 화면만 골라 두고, 끌 때 그 화면에만 흰 바탕을 덮어요 */
let gradScreens=null;
function findGrad(){if(gradScreens)return gradScreens;const all=[...document.querySelectorAll('.phone>.screen:not(.gnb-layer):not(#welcome):not(#splash)')];if(!all.length)return [];
 const saved=all.map(e=>e.style.getPropertyValue('background'));all.forEach(e=>e.style.removeProperty('background'));
 gradScreens=all.filter(e=>/gradient/.test(getComputedStyle(e).backgroundImage));all.forEach((e,i)=>{if(saved[i])e.style.setProperty('background',saved[i],'important');});return gradScreens;}
/* 끌 때는 그 화면 안의 '바탕색' 토큰도 흰색으로 바꿔요. 아래 버튼 영역처럼 바탕색으로 번지는 부분이 미색 띠로 남지 않게 (2026-11-16) */
function paintBg(){const off=cur.bg==='white'&&root.dataset.theme!=='b';findGrad().forEach(e=>{if(off){e.style.setProperty('background','#FFFFFF','important');e.style.setProperty('--color-bg-page','#FFFFFF');}else{e.style.removeProperty('background');e.style.removeProperty('--color-bg-page');}});}
function sync(){paintBg();document.querySelectorAll('[data-tone-pick]').forEach(b=>{const [n,v]=b.dataset.tonePick.split(':');b.setAttribute('aria-pressed',String(cur[n]===v));});}
function set(n,v){if(!OPT[n]||!OPT[n].vals.includes(v))return;cur[n]=v;root.dataset[n]=v;write(OPT[n].key,v);sync();}
window.yhTone={get:()=>({...cur}),set};
document.addEventListener('click',e=>{const b=e.target.closest('[data-tone-pick]');if(!b)return;e.preventDefault();const [n,v]=b.dataset.tonePick.split(':');set(n,v);});

function seg(label,name,items){return `<div class="dock-tone"><span class="dock-concept-label">${label}</span><div class="dock-concept-seg" role="group" aria-label="${label}">${items.map(([v,t,hex])=>`<button type="button" data-tone-pick="${name}:${v}"${hex?' class="tone-2l"':''}><span>${t}</span>${hex?`<small>${hex}</small>`:''}</button>`).join('')}</div></div>`;}
function mount(){
 const dock=document.querySelector('.demo-dock');if(!dock||dock.querySelector('.dock-tone'))return sync();
 /* 2026-11-16 정리: 앱 전체에 걸리는 비교(배경 · 버튼 색)는 "디자인 비교" 한 섹션, 인연 홈에만 걸리는 비교는 오늘의 인연 블록 안 */
 const box=document.createElement('section');box.className='dock-section dock-design';
 box.innerHTML='<h2>디자인 비교</h2>'+seg('배경 · 위쪽 하늘 그라데이션','bg',[['sky','켜기'],['white','끄기 (흰 배경)']])+seg('버튼 색','btn',[['deep','진한 파랑','보조 sky100'],['deep50','진한 파랑','보조 sky50'],['soft','sky200','#B7D7EC'],['mid','sky300','#92C0DF']])+seg('인증 배지 · 여러 개일 때','certstack',[['off','하나'],['on','겹친 배지']]);
 const head=dock.querySelector('.dock-head');head?head.after(box):dock.prepend(box);
 const time=document.querySelector('.time-demo');if(time&&!time.querySelector('.dock-tone')){const w=document.createElement('div');w.className='dock-tone-row';w.innerHTML=seg('인연 열어보기 버튼','open',[['white','흰 + 파랑','sky700'],['deep','진한 파랑','#377398'],['sky200','sky200','#B7D7EC'],['sky300','sky300','#92C0DF']])+seg('인연 열어보기 자리','cardrow',[['below','카드 아래'],['in','카드 안']])+seg('넘김 표시','pager',[['peek','옆 카드 살짝'],['num','아래 숫자'],['chip','사진 위 숫자']]);time.append(w);}
 sync();
}
if(document.readyState==='complete')mount();else addEventListener('load',mount);
document.addEventListener('yh-theme',paintBg);
})();
