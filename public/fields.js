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

/* 전화번호 자동 하이픈 (2026-11-19): type="tel" 칸에 쓰는 대로 010-1234-5678 꼴로 바꿔요. 숫자만 남기고 최대 11자리,
   02 지역번호는 02-123-4567 / 02-1234-5678, 나머지는 3-3-4 / 3-4-4. 커서는 같은 숫자 뒤에 그대로 둬요. 지우기(백스페이스)로 하이픈 앞에서 지워도 숫자가 지워져요. */
(()=>{
const fmt=v=>{const d=v.replace(/\D/g,'').slice(0,11);if(!d)return '';
 if(d.startsWith('02')){if(d.length<3)return d;if(d.length<6)return d.slice(0,2)+'-'+d.slice(2);if(d.length<10)return d.slice(0,2)+'-'+d.slice(2,5)+'-'+d.slice(5);return d.slice(0,2)+'-'+d.slice(2,6)+'-'+d.slice(6,10);}
 if(d.length<4)return d;if(d.length<8)return d.slice(0,3)+'-'+d.slice(3);if(d.length<11)return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6);return d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7);};
const apply=(el,del)=>{const pos=el.selectionStart??el.value.length,before=el.value.slice(0,pos).replace(/\D/g,'').length;const next=fmt(el.value);if(next===el.value)return;el.value=next;
 let n=0,i=0;while(i<next.length&&n<before){if(/\d/.test(next[i]))n++;i++;}if(!del)while(i<next.length&&next[i]==='-'&&before>0)i++;try{el.setSelectionRange(i,i);}catch(_){}};
document.addEventListener('beforeinput',e=>{const el=e.target;if(!(el instanceof HTMLInputElement)||el.type!=='tel'||e.inputType!=='deleteContentBackward')return;const p=el.selectionStart;if(p&&p===el.selectionEnd&&el.value[p-1]==='-'){e.preventDefault();el.value=el.value.slice(0,p-2)+el.value.slice(p);el.setSelectionRange(p-2,p-2);apply(el,true);el.dispatchEvent(new Event('input',{bubbles:true}));}},true);
document.addEventListener('input',e=>{const el=e.target;if(el instanceof HTMLInputElement&&el.type==='tel')apply(el,/^delete/.test(e.inputType||''));},true);
const all=()=>document.querySelectorAll('input[type=tel]').forEach(el=>{if(el.value&&el.value!==fmt(el.value)&&document.activeElement!==el)el.value=fmt(el.value);});
document.addEventListener('focusin',e=>{if(e.target instanceof HTMLInputElement&&e.target.type==='tel')apply(e.target,false);});
new MutationObserver(all).observe(document.body,{childList:true,subtree:true});all();
})();
