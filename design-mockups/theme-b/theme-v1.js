/* 야화 컨셉 A / B 전환 (2026-11-13)
   - A: 지금까지 다듬은 기본 시안 · B: 여름빛 필름 (theme-b.css)
   - 고르는 곳: 시연 도구 맨 위 “0. 디자인 컨셉”, 상단 막대의 A/B, 주소 ?theme=b
   - 기능 · 기록(localStorage 상태)은 A/B가 같아요. 보이는 모습만 바뀝니다. */
(()=>{
const KEY='yahwa-theme',root=document.documentElement;
const LABEL={a:'A · 하늘 편지',b:'B · 여름빛 필름'};
const read=()=>{try{return localStorage.getItem(KEY)}catch(e){return null}};
const write=v=>{try{localStorage.setItem(KEY,v)}catch(e){}};
const q=new URLSearchParams(location.search).get('theme');
let theme=(q==='a'||q==='b')?q:(read()==='b'?'b':'a');if(q==='a'||q==='b')write(q);
root.dataset.theme=theme;

/* 고운바탕을 직접 쓴 규칙은 B에서 맑은 고딕으로 바꿔요 (A 규칙은 손대지 않음) */
function splitTop(s){const out=[];let d=0,cur='';for(const ch of s){if(ch==='('||ch==='[')d++;else if(ch===')'||ch===']')d--;if(ch===','&&!d){out.push(cur.trim());cur='';}else cur+=ch;}if(cur.trim())out.push(cur.trim());return out;}
function scope(sel){return splitTop(sel).map(x=>/^(html|:root)\b/.test(x)?x.replace(/^(html|:root)/,'html[data-theme="b"]'):'html[data-theme="b"] '+x).join(',');}
function cloneSerif(){
 const css=[];
 const walk=rules=>{for(const r of rules){if(r.cssRules&&!(r instanceof CSSStyleRule)){walk(r.cssRules);continue;}if(!(r instanceof CSSStyleRule))continue;const ff=r.style.fontFamily||'';if(!/Gowun Batang/i.test(ff))continue;const px=parseFloat(r.style.fontSize)||0;const big=px>=17,mid=px>=15;css.push(scope(r.selectorText)+'{font-family:var(--font-sans)!important;font-weight:'+(big||mid?600:500)+(big?';letter-spacing:-0.02em':'')+'}');}};
 for(const s of document.styleSheets){let rules;try{rules=s.cssRules}catch(e){continue}if(!rules||s.ownerNode?.id==='tb-serif')continue;walk(rules);}
 let el=document.getElementById('tb-serif');if(!el){el=document.createElement('style');el.id='tb-serif';document.head.append(el);}el.textContent=css.join('\n');
}

/* 필름 질감 · 날짜 도장 */
const STAMP_TARGETS='#discovery .daily-card:not(.is-locked) .match-sheet-thumb,#match-gallery,#preview-photo,#welcome .welcome-visual';
function stampText(){const d=new Date(window.yhNow?window.yhNow():Date.now());const p=n=>String(n).padStart(2,'0');return "'"+String(d.getFullYear()).slice(2)+' '+p(d.getMonth()+1)+' '+p(d.getDate());}
function decorate(){
 if(root.dataset.theme!=='b')return;
 const phone=document.querySelector('.phone');if(phone&&!phone.querySelector(':scope>.tb-grain')){const g=document.createElement('div');g.className='tb-grain';g.setAttribute('aria-hidden','true');phone.append(g);}
 document.querySelectorAll('#discovery .daily-card.is-locked:not(.is-ready)').forEach(c=>{let d=c.querySelector(':scope>.tb-caption');if(!d){d=document.createElement('div');d.className='tb-caption';d.setAttribute('aria-hidden','true');d.innerHTML='<strong>아직 현상 중인 한 장</strong><span></span>';c.append(d);}const h=((c.querySelector('.locked-overlay')?.textContent||'')+' '+(c.getAttribute('aria-label')||'')).match(/\d{1,2}:00/);const t=h?h[0]+'에 선명해져요':'곧 선명해져요';const sp=d.querySelector('span');if(sp.textContent!==t)sp.textContent=t;});
 document.querySelectorAll(STAMP_TARGETS).forEach(el=>{if(el.querySelector(':scope>.tb-stamp'))return;if(getComputedStyle(el).position==='static')el.style.position='relative';const l=document.createElement('i');l.className='tb-leak';l.setAttribute('aria-hidden','true');const s=document.createElement('span');s.className='tb-stamp';s.setAttribute('aria-hidden','true');s.textContent=stampText();el.append(l,s);});
}
let pend=0;const mo=new MutationObserver(()=>{if(pend)return;pend=requestAnimationFrame(()=>{pend=0;decorate();});});

function sync(){
 document.querySelectorAll('[data-theme-pick]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themePick===theme)));
 const cur=document.getElementById('tb-current');if(cur)cur.textContent=theme==='b'?'한여름 오후 바닷가의 필름 한 장. 크림 인화지 · 소다빛 청록 · 날짜 도장.':'하늘빛 손그림과 고운바탕 글씨. 지금까지 다듬은 기본 시안이에요.';
}
function set(t){theme=t==='b'?'b':'a';root.dataset.theme=theme;write(theme);decorate();sync();document.dispatchEvent(new CustomEvent('yh-theme',{detail:theme}));}
window.yhTheme={get:()=>theme,set,label:LABEL};

function mountControls(){
 const dock=document.querySelector('.demo-dock');
 if(dock&&!dock.querySelector('.dock-concept')){const w=document.createElement('div');w.className='dock-concept';w.innerHTML='<span class="dock-concept-label">디자인 컨셉</span><div class="dock-concept-seg" role="group" aria-label="디자인 컨셉"><button type="button" data-theme-pick="a"><b>A</b><span>하늘 편지</span></button><button type="button" data-theme-pick="b"><b>B</b><span>여름빛 필름</span></button></div><p class="dock-concept-note" id="tb-current"></p>';const head=dock.querySelector('.dock-head');head?head.after(w):dock.prepend(w);}
 sync();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-pick]');if(b){e.preventDefault();set(b.dataset.themePick);}});

function boot(){cloneSerif();mountControls();decorate();mo.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='complete')boot();else addEventListener('load',boot);
})();
