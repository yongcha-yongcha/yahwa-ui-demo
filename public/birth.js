/* 기본 프로필 · 생년월일 (시안 A, 휠로 고르기)
   이름 아래 칸을 누르면 년 · 월 · 일 세 칸 휠(wheel.js)이 올라와요. 상대에게는 만 나이로만 보이고(window.yhMyAge),
   소개 미리보기 위치 줄이 "29세 · 서울 · 남성"처럼 바뀌어요. 만 19세 미만은 넘어갈 수 없어요. */
(()=>{
const $=id=>document.getElementById(id);
const nick=$('nickname'),next=$('profile-next'),err=$('profile-error');
if(!nick||!next||!window.yhWheel)return;
const KEY='yahwa-demo-birth',MIN_AGE=19,FIRST=1940;
const today=()=>new Date();
const ageOf=([y,m,d])=>{const t=today();let a=t.getFullYear()-y;if(t.getMonth()+1<m||(t.getMonth()+1===m&&t.getDate()<d))a--;return a;};
const lastDay=(y,m)=>new Date(y,m,0).getDate();
const label=([y,m,d])=>`${y}년 ${m}월 ${d}일`;

/* 이름 칸 아래에 넣어요 */
const anchor=nick.closest('.tf-wrap')||nick;
anchor.insertAdjacentHTML('afterend','<span class="ob-field" id="birth-label">생년월일</span><button type="button" class="choice-trigger is-placeholder" id="birth-trigger" aria-labelledby="birth-label birth-value" aria-describedby="birth-help" aria-haspopup="dialog"><span id="birth-value">생년월일을 골라 주세요</span><span class="ic ic-chevron-down" aria-hidden="true"></span></button><p class="ob-help" id="birth-help" aria-live="polite">상대에게는 만 나이로만 보여요.</p>');
const trigger=$('birth-trigger'),valueEl=$('birth-value'),help=$('birth-help');

let birth=null;
function apply(b,{quiet}={}){
  birth=b;
  if(!b){window.yhMyAge='';return;}
  const a=ageOf(b);
  valueEl.textContent=label(b);trigger.classList.remove('is-placeholder');
  const ok=a>=MIN_AGE;
  window.yhMyAge=ok?String(a):'';
  trigger.classList.toggle('is-invalid',!ok);
  help.classList.toggle('is-error',!ok);
  help.innerHTML=ok?`<b>만 ${a}세</b>로 소개돼요.`:'만 19세 이상만 가입할 수 있어요.';
  if(!quiet){try{localStorage.setItem(KEY,b.join('-'))}catch(e){}}
  if(ok&&err?.textContent.includes('생년월일'))err.textContent='';
  if(typeof renderPreview==='function'&&!$('preview')?.hidden)renderPreview();
}
/* 시연 값: 저장된 값이 없으면 다른 예시 값처럼 미리 채워 둬요 */
let saved=null;try{saved=localStorage.getItem(KEY)}catch(e){}
apply((saved||'1997-4-2').split('-').map(Number),{quiet:true});

trigger.addEventListener('click',()=>{
  const t=today(),[y,m,d]=birth||[t.getFullYear()-30,1,1];
  const years=[];for(let v=FIRST;v<=t.getFullYear()-MIN_AGE+1;v++)years.push({value:v,label:v+'년'});
  yhWheel.open({title:'생년월일',caption:'상대에게는 만 나이로만 보여요.',trigger,doneLabel:'선택 완료',
    columns:[{values:years,current:y,label:'년도',flex:1.3},{values:[...Array(12)].map((_,i)=>({value:i+1,label:(i+1)+'월'})),current:m,label:'월'},{values:[...Array(31)].map((_,i)=>({value:i+1,label:(i+1)+'일'})),current:d,label:'일'}],
    /* 그 달에 없는 날은 흐리게, 고르면 마지막 날로 맞춰요 */
    isDisabled:(k,v,[yy,mm])=>k===2&&v>lastDay(yy,mm),
    onDone:([yy,mm,dd])=>{apply([yy,mm,Math.min(dd,lastDay(yy,mm))]);yhWheel.close();if(typeof persist==='function')persist();}});
});

/* 다음으로: 생년월일이 없거나 만 19세 미만이면 멈춰요 (기존 이름 · 성별 · 지역 확인보다 먼저) */
next.addEventListener('click',e=>{
  const name=nick.value.trim();if(name.length<2)return;
  if(!birth){e.stopImmediatePropagation();err.textContent='생년월일을 골라 주세요.';trigger.focus();return;}
  if(ageOf(birth)<MIN_AGE){e.stopImmediatePropagation();err.textContent='만 19세 이상만 가입할 수 있어요.';trigger.focus();}
},true);
})();
