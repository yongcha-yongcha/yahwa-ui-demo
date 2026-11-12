/* 나를 담은 해시태그 · 아이콘 타일 주제 탭(추천부터) + 칩 한 종류 + 아래 개수 · 건너뛰기 (시안 C1) */
(()=>{
const root=document.getElementById('hashtags');
if(!root||typeof renderTags!=='function'||typeof tagGroups!=='function')return;
const MAX=5,FIRST=10;
const REC=['다정한사람','산책메이트','카페탐방러','필름감성','대화가좋아','느긋한주말','작은행복','전시메이트','천천히스며드는','빵지순례','노을수집','잘들어주는'];
const body=root.querySelector('.detail-scroll');
/* 주제 아이콘(기존 그래픽, tagGroups 순서와 같음) */
const ICONS=["M7 19Q7 11 12 11Q18 11 18 19M5 20Q12 18 20 20M12 3V6M4 7L6 9M20 7L18 9", "M7 9Q12 4 17 9Q22 15 16 20Q9 23 5 16Q3 12 7 9M8 12h.1M16 12h.1M9 16Q12 19 15 16", "M4 6Q12 4 20 7L20 16L13 17L7 21L7 17L4 16ZM8 10H16M8 13H13", "M3 12L12 4L21 12M6 10V21H18V10M10 21V15H14V21", "M5 9H16V16Q15 21 10 21Q5 20 5 16ZM16 10Q23 9 21 14Q20 17 16 16M8 6Q6 4 8 2M12 6Q14 4 12 2", "M4 5Q8 3 12 6Q16 3 20 5V20Q16 18 12 21Q8 18 4 20ZM12 6V21", "M5 8H20V21H4V8ZM9 8V4H15V8M8 9V20M16 9V20", "M3 8H8L10 5H15L17 8H21V21H3ZM16 14A4 4 0 1 1 8 14A4 4 0 1 1 16 14"];
const TONES=['var(--tag-tile-1)','var(--tag-tile-2)','var(--tag-tile-3)'];
const bottom=root.querySelector('.ob-bottom');
const next=bottom.querySelector('.ob-next');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let cur='추천',open=false,toastT;

/* 아래 영역: 고른 수와 다섯 칸 막대, 건너뛰기 */
const tally=document.createElement('div');tally.className='ht-tally';
tally.innerHTML='<span class="ht-tally-text" aria-live="polite"></span><span class="ht-dots" aria-hidden="true">'+'<span></span>'.repeat(MAX)+'</span>';
const row=document.createElement('div');row.className='ht-row';
const skip=document.createElement('button');skip.type='button';skip.className='ht-skip';skip.textContent='건너뛰기';
next.before(row);row.append(skip,next);bottom.prepend(tally);

function say(text){document.querySelector('.fx-toast')?.remove();const el=document.createElement('div');el.className='fx-toast';el.setAttribute('role','status');el.textContent=text;document.querySelector('.phone').append(el);clearTimeout(toastT);toastT=setTimeout(()=>el.remove(),2000);}
function fitScroll(){const b=getComputedStyle(bottom),gap=parseFloat(b.bottom)||0;body.style.bottom=Math.ceil(gap+bottom.offsetHeight+8)+'px';}
const groups=()=>tagGroups();
const pool=c=>{if(c!=='추천')return (groups().find(([t])=>t===c)||[,[]])[1];const all=new Set(groups().flatMap(([,t])=>t));return REC.filter(t=>all.has(t));};
const chip=t=>{const on=selectedTags.has(t),off=!on&&selectedTags.size>=MAX;return `<button type="button" class="ht-chip${off?' is-off':''}" data-tag="${esc(t)}" aria-pressed="${on}"><span class="ic ic-check" aria-hidden="true"></span>#${esc(t)}</button>`;};

function sync(){
  const n=selectedTags.size;
  tally.querySelector('.ht-tally-text').innerHTML=n?`<b>${n}</b> / ${MAX} 골랐어요`:`${MAX}개까지 고를 수 있어요`;
  tally.querySelectorAll('.ht-dots span').forEach((d,i)=>d.classList.toggle('is-on',i<n));
  body.querySelectorAll('.ht-tab').forEach(b=>{const c=b.dataset.cat;const k=c==='추천'?0:pool(c).filter(t=>selectedTags.has(t)).length;const s=b.querySelector('.ht-badge');s.textContent=k?k:'';b.setAttribute('aria-label',c+(k?` · ${k}개 골랐어요`:''));});
  body.querySelectorAll('.ht-chip').forEach(b=>{const on=selectedTags.has(b.dataset.tag);b.setAttribute('aria-pressed',on);b.classList.toggle('is-off',!on&&n>=MAX);});
  skip.hidden=true;next.textContent=n?`태그 ${n}개로 미리보기`:'건너뛰고 미리보기';
  fitScroll();
}
function list(){
  const all=pool(cur),show=open?all:all.slice(0,FIRST);
  body.querySelector('.ht-chips').innerHTML=show.map(chip).join('')+(all.length>FIRST&&!open?`<button type="button" class="ht-more" data-more><span class="ic ic-chevron-down" aria-hidden="true"></span>${all.length-FIRST}개 더 보기</button>`:'');
  sync();
}
function render(){
  syncGenderTags();
  const cats=['추천',...groups().map(([t])=>t)];
  if(!cats.includes(cur))cur='추천';
  const tileOf=(c,i)=>c==='추천'?'<span class="ht-tile is-rec" aria-hidden="true">#</span>':`<span class="ht-tile" style="background:${TONES[(i-1)%3]}" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${ICONS[i-1]||''}"/></svg></span>`;
  body.innerHTML=`<h1>나를 담은 해시태그</h1><p class="ob-intro">나를 닮은 단어를 골라 주세요. 최대 ${MAX}개, 건너뛰어도 괜찮아요.</p><div class="ht-tabs" role="tablist" aria-label="해시태그 주제">${cats.map((c,i)=>`<button type="button" class="ht-tab" role="tab" data-cat="${esc(c)}" aria-selected="${c===cur}">${tileOf(c,i)}<small class="ht-badge"></small><span class="ht-tab-label">${esc(c)}</span></button>`).join('')}</div><div class="ht-chips" role="group" aria-label="${esc(cur)} 해시태그"></div>`;
  list();
  const bar=body.querySelector('.ht-tabs');const edge=()=>{const max=bar.scrollWidth-bar.clientWidth;bar.classList.toggle('has-more-l',bar.scrollLeft>2);bar.classList.toggle('has-more-r',bar.scrollLeft<max-2);};bar.addEventListener('scroll',()=>requestAnimationFrame(edge),{passive:true});edge();
}
function toggle(t){
  if(selectedTags.has(t))selectedTags.delete(t);
  else{if(selectedTags.size>=MAX){say(`${MAX}개까지 고를 수 있어요. 하나를 빼고 골라 주세요`);return;}selectedTags.add(t);window.yhHaptic?.('selection');}
  window.yhPersist?.();sync();
}
body.addEventListener('click',e=>{
  const tab=e.target.closest('.ht-tab');if(tab){cur=tab.dataset.cat;open=false;body.querySelectorAll('.ht-tab').forEach(b=>b.setAttribute('aria-selected',b===tab));body.querySelector('.ht-chips').setAttribute('aria-label',cur+' 해시태그');list();const bar=tab.parentElement,l=tab.offsetLeft,r=l+tab.offsetWidth;if(l<bar.scrollLeft)bar.scrollTo({left:l-12,behavior:'smooth'});else if(r>bar.scrollLeft+bar.clientWidth)bar.scrollTo({left:r-bar.clientWidth+12,behavior:'smooth'});return;}
  const c=e.target.closest('.ht-chip');if(c){toggle(c.dataset.tag);return;}
  if(e.target.closest('[data-more]')){open=true;list();}
});
skip.onclick=()=>show('preview');

/* 기존 렌더러 대체 */
renderTags=function(){render();};
const prevShow=show;
show=function(name){if(name==='hashtags'){cur='추천';open=false;}const r=prevShow.apply(this,arguments);if(name==='hashtags')render();return r;};
render();
})();
