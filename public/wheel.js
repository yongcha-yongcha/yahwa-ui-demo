/* Wheel Picker · 위아래로 넘겨 가운데에 맞추는 바텀시트 선택 */
(()=>{
const phone=document.querySelector('.phone');
if(!phone)return;
const ROW=48;
const DRAWER='cubic-bezier(0.32, 0.72, 0, 1)';
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

const layer=document.createElement('div');
layer.className='wheel-layer';layer.hidden=true;
layer.innerHTML='<div class="wheel-dim"></div><div class="wheel-sheet" role="dialog" aria-modal="true" aria-labelledby="wheel-title"><h2 id="wheel-title"></h2><p class="wheel-cap" id="wheel-cap"></p><div class="wheel-tools"><button class="wheel-back" type="button" hidden><span class="ic ic-chevron-left" aria-hidden="true"></span><span class="wheel-back-label"></span></button></div><div class="wheel-wrap"><div class="wheel-list" role="listbox" tabindex="0" aria-labelledby="wheel-cap"></div></div><button class="ob-next wheel-done" type="button"></button></div>';
phone.append(layer);
const $=s=>layer.querySelector(s);
const dim=$('.wheel-dim'),sheet=$('.wheel-sheet'),list=$('.wheel-list'),done=$('.wheel-done'),back=$('.wheel-back');

let cfg=null,values=[],index=0,settling=true,sound=true,audio=null,trigger=null,lastPointer=false;
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
function paint(){
  [...list.children].forEach((b,i)=>{const d=Math.abs(i-index);b.setAttribute('aria-selected',String(i===index));b.style.opacity=d===0?1:d===1?.55:.25});
  const cur=list.children[index];if(cur)list.setAttribute('aria-activedescendant',cur.id);
}
function fill(){
  settling=true;
  list.replaceChildren(...values.map((v,i)=>{const b=document.createElement('button');b.type='button';b.className='wheel-item';b.id='wheel-item-'+i;b.textContent=v.label;b.setAttribute('role','option');b.tabIndex=-1;b.onclick=()=>list.scrollTo({top:i*ROW,behavior:reduced()?'auto':'smooth'});return b}));
  index=Math.max(0,values.findIndex(v=>v.value===cfg.current));
  requestAnimationFrame(()=>{list.scrollTop=index*ROW;paint();requestAnimationFrame(()=>{settling=false})});
}
list.addEventListener('scroll',()=>{const n=Math.max(0,Math.min(values.length-1,Math.round(list.scrollTop/ROW)));if(n!==index){index=n;paint();tick();haptic()}});
list.addEventListener('keydown',e=>{
  if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?values.length-1:Math.max(0,Math.min(values.length-1,index+(e.key==='ArrowDown'?1:-1)));list.scrollTo({top:next*ROW})}
  if(e.key==='Enter'){e.preventDefault();done.click()}
});
done.addEventListener('click',()=>{if(cfg&&values[index])cfg.onDone(values[index].value)});
back.addEventListener('click',()=>cfg?.back?.onClick());
dim.addEventListener('click',()=>close());
sheet.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}});

/* cfg: {title, caption, values:[{value,label}], current, doneLabel, back:{label,onClick}, trigger, onDone(value)} */
function open(next){
  const wasOpen=!layer.hidden;
  cfg=next;values=next.values;
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
  list.focus({preventScroll:true});
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
