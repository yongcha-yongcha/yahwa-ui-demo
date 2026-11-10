/* 텍스트 필드 · 지우기 버튼과 오류 상태 연결 */
(()=>{
const $=id=>document.getElementById(id);
const X='<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6"/></svg>';

/* 입력 중일 때만 보이는 지우기 버튼 */
function addClear(input){
  if(!input||input.parentElement.classList.contains('tf-wrap'))return;
  const wrap=document.createElement('div');wrap.className='tf-wrap';
  input.before(wrap);wrap.append(input);
  const btn=document.createElement('button');
  btn.type='button';btn.className='tf-clear';btn.setAttribute('aria-label','입력 지우기');btn.tabIndex=-1;btn.innerHTML=X;
  wrap.append(btn);
  const sync=()=>wrap.classList.toggle('has-value',!!input.value);
  input.addEventListener('input',sync);input.addEventListener('focus',sync);sync();
  btn.addEventListener('mousedown',e=>e.preventDefault());
  btn.addEventListener('click',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();});
}
['demo-phone','nickname','height'].forEach(id=>addClear($(id)));

/* 오류 문구가 나오면 해당 필드를 오류 상태로 표시 */
const setInvalid=(field,errorId)=>{
  if(!field)return;
  field.classList.add('is-invalid');field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',errorId);
  field.addEventListener('input',()=>{clearInvalid(field);$(errorId).textContent='';},{once:true});
};
function clearInvalid(field){field.classList.remove('is-invalid');field.removeAttribute('aria-invalid');}
const TARGET={
  'verify-error':()=>$('demo-phone'),
  'profile-error':el=>el.textContent.includes('닉네임')?$('nickname'):el.textContent.includes('성별')&&!document.querySelector('[name=gender]:checked')?document.querySelector('#profile .ob-choices'):null,
  'info-error':()=>$('height'),
  'photo-error':el=>el.textContent.includes('대표 사진')?document.querySelector('#photos .photo-slot'):null
};
Object.entries(TARGET).forEach(([id,pick])=>{
  const el=$(id);if(!el)return;
  new MutationObserver(()=>{
    if(el.textContent.trim())setInvalid(pick(el),id);
    else document.querySelectorAll(`[aria-describedby="${id}"].is-invalid`).forEach(clearInvalid);
  }).observe(el,{childList:true,characterData:true,subtree:true});
});
})();
