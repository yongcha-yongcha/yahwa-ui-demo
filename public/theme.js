/* 야화 컨셉 A / B 전환 (2026-11-13)
   - A: 지금까지 다듬은 기본 시안 · B: 여름빛 필름 (theme-b.css · A와 같고 바탕 색감만 달라요)
   - 처음 B의 필름 입자 · 날짜 도장 · 글꼴 바꾸기는 design-mockups/theme-b/theme-v1.js에 보관
   - 고르는 곳: 시연 도구 맨 위 “0. 디자인 컨셉”, 상단 막대의 A/B, 주소 ?theme=b
   - 기능 · 기록(localStorage 상태)은 A/B가 같아요. 보이는 모습만 바뀝니다. */
(()=>{
const KEY='yahwa-theme',root=document.documentElement;
const LABEL={a:'A · 하늘 편지',b:'B · 여름빛 필름'};
const read=()=>{try{return localStorage.getItem(KEY)}catch(e){return null}};
const write=v=>{try{localStorage.setItem(KEY,v)}catch(e){}};
const q=new URLSearchParams(location.search).get('theme');
/* 2026-11-16: 시연 도구의 디자인 컨셉 고르기는 뺐어요. 기본은 A, 주소에 ?theme=b를 붙일 때만 B */
let theme=q==='b'?'b':'a';write(theme);
root.dataset.theme=theme;

function sync(){
 document.querySelectorAll('[data-theme-pick]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themePick===theme)));
 const cur=document.getElementById('tb-current');if(cur)cur.textContent=theme==='b'?'A와 같고 바탕만 여름빛 필름이에요. 크림 인화지 위로 복숭아 · 민트 빛이 번져요.':'하늘빛 손그림과 고운바탕 글씨. 지금까지 다듬은 기본 시안이에요.';
}
function set(t){theme=t==='b'?'b':'a';root.dataset.theme=theme;write(theme);sync();document.dispatchEvent(new CustomEvent('yh-theme',{detail:theme}));}
window.yhTheme={get:()=>theme,set,label:LABEL};

function mountControls(){
 const dock=document.querySelector('.demo-dock');
 if(dock&&!dock.querySelector('.dock-concept')){const w=document.createElement('div');w.className='dock-concept';w.innerHTML='<span class="dock-concept-label">디자인 컨셉</span><div class="dock-concept-seg" role="group" aria-label="디자인 컨셉"><button type="button" data-theme-pick="a"><b>A</b><span>하늘 편지</span></button><button type="button" data-theme-pick="b"><b>B</b><span>여름빛 필름</span></button></div><p class="dock-concept-note" id="tb-current"></p>';const head=dock.querySelector('.dock-head');head?head.after(w):dock.prepend(w);}
 sync();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-pick]');if(b){e.preventDefault();set(b.dataset.themePick);}});

function boot(){document.querySelector('.demo-dock .dock-concept')?.remove();document.querySelectorAll('.tb-grain,.tb-caption,.tb-stamp,.tb-leak,#tb-serif').forEach(el=>el.remove());}
if(document.readyState==='complete')boot();else addEventListener('load',boot);
})();
