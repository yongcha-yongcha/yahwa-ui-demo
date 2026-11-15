/* 인증번호 입력 · 한 칸씩 채우기와 완료 모션 */
(()=>{
const $=id=>document.getElementById(id);
const screen=$('verify-code');
if(!screen)return;
const ANSWER='123456',LEN=6;
const input=$('otp-input'),box=$('otp'),msg=$('otp-msg'),meta=$('otp-meta'),pad=$('otp-keypad'),done=$('otp-done'),doneText=$('otp-done-text'),check=$('otp-check');
const OUT='cubic-bezier(0.23, 1, 0.32, 1)',IN_OUT='cubic-bezier(0.77, 0, 0.175, 1)';
const MOTION={digit:80,gather:360,morph:300,check:510,text:320,hold:900,checkLead:30,textLead:280};
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));

input.insertAdjacentHTML('beforebegin',Array.from({length:LEN},()=>'<div class="otp-cell"></div>').join(''));
const cells=[...box.querySelectorAll('.otp-cell')];
const DEL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"/><path d="M12 9.5l5 5M17 9.5l-5 5"/></svg>';
pad.innerHTML=['1','2','3','4','5','6','7','8','9','','0','del'].map(k=>k===''?'<span></span>':k==='del'?`<button class="otp-key is-del" type="button" data-k="del" aria-label="지우기">${DEL}</button>`:`<button class="otp-key" type="button" data-k="${k}">${k}</button>`).join('');

let code=[],status='idle',run=0,running=[];
const busy=()=>status==='checking'||status==='done';
function tween(el,frames,duration,easing='ease-out'){const a=el.animate(frames,{duration,easing,fill:'both'});running.push(a);return a}
function say(text,info){msg.textContent=text;msg.classList.toggle('is-info',!!info)}
function render(){
  cells.forEach((c,i)=>{
    const on=i<code.length,cur=status==='idle'&&i===code.length;
    c.className='otp-cell'+(status==='error'?' is-error':on?' is-filled':cur?' is-current':'');
    c.innerHTML=on?`<span>${code[i]}</span>`:cur?'<i class="otp-caret"></i>':'';
  });
}
function pop(i){
  const d=cells[i].firstElementChild;
  if(d&&!reduced())d.animate([{transform:'scale(.8)',opacity:.4},{transform:'scale(1)',opacity:1}],{duration:120,easing:OUT});
}
function accept(value){
  if(busy())return;
  if(status==='error'){status='idle';say('')}
  const before=code.length;
  code=[...value.replace(/\D/g,'').slice(0,LEN)];
  input.value=code.join('');
  render();
  if(code.length>before)pop(code.length-1);
  if(code.length===LEN)submit();
}
function clearError(){status='idle';code=[];input.value='';say('');render()}
async function submit(){
  const id=run;
  status='checking';input.readOnly=true;
  await wait(240);
  if(id!==run)return;
  if(code.join('')===ANSWER){playSuccess(id);return}
  status='error';input.readOnly=false;input.value='';
  say('인증번호가 맞지 않아요. 다시 입력해 주세요.');render();
  if(!reduced())box.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:240,easing:'ease-out'});
}
function showText(){
  doneText.textContent='인증되었어요';
  tween(doneText,reduced()?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translate(-50%,8px)'},{opacity:1,transform:'translate(-50%,0)'}],MOTION.text,OUT);
}
/* 숫자 사라짐 → 칸이 가운데로 모임 → 동그라미 → 체크 → 문구 */
async function playSuccess(id){
  status='done';input.blur();
  const live=()=>id===run;
  tween(meta,[{opacity:1},{opacity:0}],120);
  tween(pad,[{transform:'translateY(0)'},{transform:'translateY(100%)'}],240,OUT);
  if(reduced()){
    cells.forEach(c=>tween(c,[{opacity:1},{opacity:0}],120));
    await wait(120);if(!live())return;
    done.hidden=false;
    tween(done,[{opacity:0},{opacity:1}],200);
    tween(check,[{strokeDashoffset:0},{strokeDashoffset:0}],1);
    showText();
  }else{
    cells.forEach(c=>tween(c.firstElementChild,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.8)'}],MOTION.digit,OUT));
    await wait(MOTION.digit);if(!live())return;
    const mid=box.offsetWidth/2;
    cells.forEach(c=>tween(c,[{transform:'translateX(0)'},{transform:`translateX(${mid-(c.offsetLeft+c.offsetWidth/2)}px)`}],MOTION.gather,IN_OUT));
    await wait(MOTION.gather);if(!live())return;
    const size=done.offsetWidth||64,ix=(size-cells[0].offsetWidth)/2,iy=(size-cells[0].offsetHeight)/2;
    done.hidden=false;box.classList.add('is-done');
    tween(done,[{clipPath:`inset(${iy}px ${ix}px round 12px)`,backgroundColor:'var(--otp-fill-bg)'},{clipPath:`inset(0px 0px round ${size/2}px)`,backgroundColor:'var(--otp-done-bg)'}],MOTION.morph,OUT);
    await wait(MOTION.morph-MOTION.checkLead);if(!live())return;
    tween(check,[{strokeDashoffset:1.01},{strokeDashoffset:0}],MOTION.check,OUT);
    await wait(MOTION.check-MOTION.textLead);if(!live())return;
    showText();
  }
  await wait(MOTION.text+MOTION.hold);
  if(live())show('terms');
}
function reset(){
  run++;
  running.forEach(a=>a.cancel());running=[];
  code=[];status='idle';input.value='';input.readOnly=false;say('');
  done.hidden=true;box.classList.remove('is-done');doneText.textContent='';
  render();
}

input.addEventListener('input',()=>accept(input.value));
input.addEventListener('keydown',e=>{if(status==='error'&&e.key==='Backspace'){e.preventDefault();clearError()}});
pad.addEventListener('mousedown',e=>e.preventDefault());
pad.addEventListener('click',e=>{
  const b=e.target.closest('[data-k]');
  if(!b||busy())return;
  if(b.dataset.k!=='del'){accept(input.value+b.dataset.k);return}
  if(status==='error')clearError();else accept(input.value.slice(0,-1));
});
$('otp-resend').addEventListener('click',()=>{reset();say('인증번호를 다시 보냈어요.',true);input.focus({preventScroll:true})});

let visible=!screen.hidden;
new MutationObserver(()=>{
  const now=!screen.hidden;
  if(now===visible)return;
  visible=now;reset();
  if(now){
    const p=$('demo-phone').value.replace(/\D/g,'');
    $('otp-phone').textContent=p.slice(0,3)+'-'+p.slice(3,7)+'-'+p.slice(7);
    input.focus({preventScroll:true});
  }
}).observe(screen,{attributes:true,attributeFilter:['hidden']});
render();
})();
