/* Wheel Picker · 위아래로 넘겨 가운데에 맞추는 바텀시트 선택
   한 칸(지역 등)과 여러 칸(생년월일 년 · 월 · 일)을 같은 시트로 그려요 */
(()=>{
const phone=document.querySelector('.phone');
if(!phone)return;
const ROW=48;
const DRAWER='cubic-bezier(0.32, 0.72, 0, 1)';
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

const layer=document.createElement('div');
layer.className='wheel-layer';layer.hidden=true;
layer.innerHTML='<div class="wheel-dim"></div><div class="wheel-sheet" role="dialog" aria-modal="true" aria-labelledby="wheel-title"><h2 id="wheel-title"></h2><p class="wheel-cap" id="wheel-cap"></p><div class="wheel-tools"><button class="wheel-back" type="button" hidden><span class="ic ic-chevron-left" aria-hidden="true"></span><span class="wheel-back-label"></span></button></div><div class="wheel-wrap"></div><button class="ob-next wheel-done" type="button"></button></div>';
phone.append(layer);
const $=s=>layer.querySelector(s);
const dim=$('.wheel-dim'),sheet=$('.wheel-sheet'),wrap=$('.wheel-wrap'),done=$('.wheel-done'),back=$('.wheel-back');

let cfg=null,cols=[],settling=true,sound=true,audio=null,trigger=null,lastPointer=false;
document.addEventListener('pointerdown',()=>{lastPointer=true},true);
document.addEventListener('keydown',()=>{lastPointer=false;layer.classList.remove('is-pointer')},true);
/* 선택 햅틱: 앱이 window.yhHaptic(type)을 넣어 주면 그걸 쓰고(아이폰 UISelectionFeedbackGenerator), 없으면 안드로이드 웹 진동 */
function haptic(){
  if(settling)return;
  try{if(typeof window.yhHaptic==='function'){window.yhHaptic('selection');return;}navigator.vibrate?.(4);}catch(e){}
}
function tick(){
  if(!sound||settling)return;
  /* 아이폰 무음 스위치를 따르는 효과음으로 알림 */
  try{if(navigator.audioSession)navigator.audioSession.type='ambient';audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.setValueAtTime(650,audio.currentTime);g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.025);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.03);}catch(e){}
}
const currentValues=()=>cols.map(c=>c.values[c.index]?.value);

/* 한 칸(열) */
function column(spec,k){
  const list=document.createElement('div');
  list.className='wheel-list';list.setAttribute('role','listbox');list.tabIndex=0;
  list.setAttribute('aria-label',spec.label||$('#wheel-title').textContent);
  const c={list,values:spec.values,index:0};
  c.paint=()=>{const now=currentValues();[...list.children].forEach((b,i)=>{const d=Math.abs(i-c.index),off=cfg.isDisabled?.(k,c.values[i].value,now);b.setAttribute('aria-selected',String(i===c.index));b.classList.toggle('is-off',!!off);b.style.opacity=off?.2:d===0?1:d===1?.55:.25;});
    const cur=list.children[c.index];if(cur)list.setAttribute('aria-activedescendant',cur.id);};
  list.replaceChildren(...c.values.map((v,i)=>{const b=document.createElement('button');b.type='button';b.className='wheel-item';b.id=`wheel-item-${k}-${i}`;b.textContent=v.label;b.setAttribute('role','option');b.tabIndex=-1;b.onclick=()=>list.scrollTo({top:i*ROW,behavior:reduced()?'auto':'smooth'});return b}));
  c.index=Math.max(0,c.values.findIndex(v=>v.value===spec.current));
  list.addEventListener('scroll',()=>{const n=Math.max(0,Math.min(c.values.length-1,Math.round(list.scrollTop/ROW)));if(n!==c.index){c.index=n;cols.forEach(x=>x.paint());tick();haptic()}});
  list.addEventListener('keydown',e=>{
    if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?c.values.length-1:Math.max(0,Math.min(c.values.length-1,c.index+(e.key==='ArrowDown'?1:-1)));list.scrollTo({top:next*ROW})}
    if(e.key==='ArrowRight'&&cols[k+1]){e.preventDefault();cols[k+1].list.focus()}
    if(e.key==='ArrowLeft'&&cols[k-1]){e.preventDefault();cols[k-1].list.focus()}
    if(e.key==='Enter'){e.preventDefault();done.click()}
  });
  return c;
}
function fill(){
  settling=true;
  const specs=cfg.columns||[{values:cfg.values,current:cfg.current,label:cfg.caption}];
  cols=specs.map(column);
  wrap.replaceChildren(...cols.map(c=>c.list));
  wrap.classList.toggle('is-multi',cols.length>1);
  wrap.style.setProperty('--wheel-cols',specs.map(s=>s.flex||1).map(f=>f+'fr').join(' '));
  requestAnimationFrame(()=>{cols.forEach(c=>{c.list.scrollTop=c.index*ROW});cols.forEach(c=>c.paint());requestAnimationFrame(()=>{settling=false})});
}
done.addEventListener('click',()=>{if(!cfg)return;const v=currentValues();cfg.onDone(cfg.columns?v:v[0])});
back.addEventListener('click',()=>cfg?.back?.onClick());
dim.addEventListener('click',()=>close());
sheet.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}});

/* cfg: {title, caption, values:[{value,label}], current, doneLabel, back:{label,onClick}, trigger, onDone(value)}
   여러 칸: values 대신 columns:[{values, current, label, flex}], onDone([값, 값, 값]), isDisabled(칸, 값, 지금 값들) */
function open(next){
  const wasOpen=!layer.hidden;
  cfg=next;
  $('#wheel-title').textContent=next.title;
  $('#wheel-cap').textContent=next.caption||'';
  done.textContent=next.doneLabel||'선택 완료';
  back.hidden=!next.back;
  if(next.back)$('.wheel-back-label').textContent=next.back.label;
  if(trigger&&trigger!==next.trigger)trigger.classList.remove('is-open');
  trigger=next.trigger||null;trigger?.classList.add('is-open');
  layer.hidden=false;
  layer.classList.toggle('is-pointer',lastPointer);
  document.querySelectorAll('.screen').forEach(el=>el.inert=true);
  fill();
  cols[0]?.list.focus({preventScroll:true});
  if(!wasOpen&&!reduced()){
    sheet.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:300,easing:DRAWER});
    dim.animate([{opacity:0},{opacity:1}],{duration:200,easing:'ease-out'});
  }
}
function close(){
  if(layer.hidden)return;
  const end=()=>{layer.hidden=true;document.querySelectorAll('.screen').forEach(el=>el.inert=false);trigger?.classList.remove('is-open');trigger?.focus({preventScroll:true});cfg=null};
  if(reduced())return end();
  sheet.animate([{transform:'translateY(0)'},{transform:'translateY(100%)'}],{duration:240,easing:DRAWER}).onfinish=end;
  dim.animate([{opacity:1},{opacity:0}],{duration:200,easing:'ease-out'});
}
window.yhWheel={open,close};
})();
