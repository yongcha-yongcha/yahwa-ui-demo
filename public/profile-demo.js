/* 시연 도구 · 상대 프로필: 지금 보고 있는 사람과의 관심 상황을 바꿔 보기
   - 아무도 안 보냄 / 상대가 먼저 보냄(뱃지 · "나에게 호감을 보냈어요") / 내가 먼저 보냄(회색 하트 · 회색 칩) / 서로 호감(로즈 하트 · 칩 · 편지 안내)
   - 서로 호감으로 바꾸면 이 사람의 편지 안내 기억을 지워서, 편지를 아직 주고받지 않았으면 0.6초 뒤 편지 안내가 다시 떠요.
   - 편지 안내 상태: 지금 보는 사람에게 편지 안내가 뜨는지, 안 뜨면 왜 안 뜨는지 한 줄로 보여 줘요.
   - 안내 툴팁 처음부터: 프로필 · 마음함 · 편지 안내 기억을 모두 지우고 지금 화면에서 다시 확인해요.
   - 받은 관심을 바꾼 건 yahwa-demo-interest에 남아 새로고침해도 같고, 시연 초기화 · 로그아웃 · 시연 직전으로 되돌리기에서 지워져요. */
(()=>{
const dockEmpty=document.getElementById('dock-empty');
if(!dockEmpty||typeof sentInterests==='undefined'||typeof incomingInterestIds==='undefined')return;
const KEY='yahwa-demo-interest';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}};
/* 저장해 둔 받은 관심 바꿈을 다시 적용 */
Object.entries(read()).forEach(([i,on])=>{i=+i;if(on)incomingInterestIds.add(i);else incomingInterestIds.delete(i);});

const STATES=[['none','아무도 안 보냄'],['in','상대가 먼저 보냄'],['sent','내가 먼저 보냄'],['mutual','서로 호감']];
const box=document.createElement('div');box.className='dock-story dock-interest';box.id='dock-interest';box.hidden=true;
box.innerHTML=`<p class="dock-sub">이 사람과의 관심 상황</p><div class="dock-motion" role="group" aria-label="이 사람과의 관심 상황">${STATES.map(([k,l])=>`<button type="button" data-interest="${k}" aria-pressed="false">${l}</button>`).join('')}</div>
<div class="dock-motion"><button type="button" data-tips-reset>안내 툴팁 처음부터</button></div>
<p class="dock-note dock-letter-why" id="dock-letter-why" role="status"></p>
<p class="dock-note">지금 보고 있는 사람에게만 적용돼요. 서로 호감은 편지를 아직 주고받지 않았으면 편지 안내가 다시 떠요.</p>`;
dockEmpty.before(box);

const current=()=>{const i=incomingInterestIds.has(matchIndex),s=sentInterests.has(matchIndex);return i&&s?'mutual':i?'in':s?'sent':'none';};
const why=box.querySelector('#dock-letter-why');
function letterWhy(){const t=window.yhOnboardTips;if(!t?.noLetter)return '';
  if(current()!=='mutual')return '편지 안내: 서로 호감일 때만 떠요.';
  if(!t.noLetter())return '편지 안내: 이미 편지를 주고받은 사람이라 안 떠요.';
  if(t.letterSeen())return '편지 안내: 이 사람은 이미 한 번 봤어요. 서로 호감을 다시 누르면 다시 떠요.';
  return '편지 안내: 프로필을 열면 0.6초 뒤 떠요.';}
let whyTimer=0;
const sync=()=>{const k=current();box.querySelectorAll('[data-interest]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.interest===k));
  why.textContent=letterWhy();why.hidden=!why.textContent;
  /* 안내가 뜨고 나면 "이미 한 번 봤어요"로 바뀌도록 한 번 더 */
  clearTimeout(whyTimer);whyTimer=setTimeout(()=>{why.textContent=letterWhy();why.hidden=!why.textContent;},1200);};
function apply(k){
  const i=matchIndex,inc=k==='in'||k==='mutual',sent=k==='sent'||k==='mutual';
  window.yhLikePop?.stop?.();
  if(inc)incomingInterestIds.add(i);else incomingInterestIds.delete(i);
  if(sent)sentInterests.add(i);else sentInterests.delete(i);
  const o=read();o[i]=inc;write(o);
  if(k==='mutual')window.yhOnboardTips?.forgetLetter?.();
  window.yhPersist?.();
  if(typeof syncNotificationBadges==='function')syncNotificationBadges();
  if(typeof renderHearts==='function')try{renderHearts();}catch(e){}
  syncInterestAction();sync();
  window.yhOnboardTips?.open?.();
}
box.addEventListener('click',e=>{
  const b=e.target.closest('[data-interest]');if(b){apply(b.dataset.interest);return;}
  if(e.target.closest('[data-tips-reset]')){window.yhOnboardTips?.forget?.();window.yhOnboardTips?.open?.();}
});
/* 관심을 직접 보내거나 다른 사람을 열면 눌림 표시도 따라가요 */
const baseSync=syncInterestAction;window.syncInterestAction=function(...a){const r=baseSync.apply(this,a);sync();return r;};
const baseShow=show;window.show=function(name,...rest){const r=baseShow.call(this,name,...rest);box.hidden=name!=='match-profile';if(!box.hidden){dockEmpty.hidden=true;sync();}return r;};
/* 처음 상태로 돌아가는 버튼들에서 받은 관심 바꿈도 지워요 */
document.addEventListener('click',e=>{if(e.target.closest('[data-fx="logout"],[data-fx="reset"],[data-demo-restore]'))try{localStorage.removeItem(KEY)}catch(err){}},true);
box.hidden=typeof active!=='string'||active!=='match-profile';if(!box.hidden)sync();
})();
