/* 관심 온보딩 툴팁 (시안 "처음 한 번만 알려 주는 관심 툴팁")
   1) 아직 관심을 보내지 않은 상대 프로필을 처음 열면 0.6초 뒤 "나도 관심 있어요" 위에 안내가 떠서 4초 뒤 사라져요.
   2) 처음 관심을 보내면 지금의 하트 효과(1.8초)가 사라져 갈 즈음(1.4초, 리프 적립 토스트가 떠 있으면 사라진 뒤) 하단 메뉴 마음함 탭 위에 안내가 떠서 3초 뒤 사라져요.
   3) 상대가 먼저 보낸 관심에 답해 서로 호감이 되면, 같은 때(1.4초, 토스트가 사라진 뒤) 편지 버튼 위에 "편지로 먼저 인사해 볼까요?"가 3초 떠요.
      이때는 마음함 안내를 띄우지 않고 다음 첫 관심 때로 미뤄요.
   4) 이미 서로 호감인 프로필을 열었는데 아직 편지를 주고받지 않았으면(편지 버튼이 "편지 보내기") 0.6초 뒤 같은 편지 안내가 3초.
      편지 안내(3 · 4)는 사람마다 이 로그인에서 한 번만 — 하트를 눌러 그 자리에서 봤으면 본 것으로 쳐요.
      안내는 모두 스크롤해도 정해진 시간(프로필 4초 · 편지 3초 · 마음함 3초) 동안 그대로 떠 있어요. 안내는 모두 화면을 톡 누르면 닫히고, 끌어서 스크롤하는 건 누름으로 치지 않아요.
   1) 2) 안내는 이 로그인에서 한 번만. 로그아웃(또는 시연 초기화)하면 기억을 지워 다시 로그인하면 처음처럼 떠요. */
(()=>{
const $=id=>document.getElementById(id);
const profile=$('match-profile'),like=$('send-interest');
if(!profile||!like)return;
const phone=profile.closest('.phone')||document.querySelector('.phone');
const KEY='yahwa-onboard-tips';
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}};
const mark=k=>{const v=read();v[k]=true;write(v);};
const forget=()=>{try{localStorage.removeItem(KEY)}catch(e){}};

/* 툴팁 하나 (불투명한 Cool Neutral 900 바탕, 꼬리로 대상을 가리켜요) */
let tip=null,hideTimer=0,openTimer=0;
function hide(){clearTimeout(hideTimer);const t=tip;tip=null;if(!t)return;
  if(reduce()){t.remove();return;}
  t.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(2px) scale(.98)'}],{duration:140,easing:'ease-in'}).onfinish=()=>t.remove();}
function showTip(target,html,{ms,small,keep}){
  hide();if(!target||!target.offsetParent)return;
  const t=document.createElement('div');t.className='yh-tip'+(small?' is-small':'');if(keep)t.dataset.keep='1';t.setAttribute('role','status');t.innerHTML=html;phone.append(t);
  const pr=phone.getBoundingClientRect(),tr=target.getBoundingClientRect(),w=t.offsetWidth,cx=tr.left-pr.left+tr.width/2;
  const left=Math.max(12,Math.min(pr.width-12-w,cx-w/2));
  t.style.left=left+'px';t.style.bottom=(pr.bottom-tr.top+(small?4:10))+'px';t.style.setProperty('--tip-ax',(cx-left)+'px');
  t.animate(reduce()?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(4px) scale(.96)'},{opacity:1,transform:'none'}],{duration:180,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
  tip=t;hideTimer=setTimeout(hide,ms);
}

/* 호감 보내기 모션 막(.lb-fx)이나 리프 적립 토스트(.fx-toast)가 떠 있으면 같은 자리라 사라진 뒤 200ms에 보여요 */
function afterToast(cb){const t=document.querySelector('.lb-fx')||document.querySelector('.fx-toast');if(!t){cb();return;}
  const mo=new MutationObserver(()=>{if(!t.isConnected){mo.disconnect();clearTimeout(cap);setTimeout(cb,200);}});mo.observe(t.parentNode||document.body,{childList:true});
  const cap=setTimeout(()=>{mo.disconnect();cb();},4000);}

/* 편지 안내 (사람마다 한 번) */
const letterBtn=$('write-letter');
const who=()=>String(typeof demoMatches!=='undefined'&&demoMatches[matchIndex]?.id!=null?demoMatches[matchIndex].id:matchIndex);
const mutual=()=>typeof incomingInterestIds!=='undefined'&&typeof sentInterests!=='undefined'&&incomingInterestIds.has(matchIndex)&&sentInterests.has(matchIndex);
const noLetter=()=>!!letterBtn&&(letterBtn.getAttribute('aria-label')||letterBtn.textContent).trim()==='편지 보내기';
const letterSeen=()=>(read().letter||[]).includes(who());
function letterTip(){if(!letterBtn||letterSeen())return;showTip(letterBtn,'편지로 먼저 인사해 볼까요?',{ms:3000,keep:true});const v=read();v.letter=[...new Set([...(v.letter||[]),who()])];write(v);}

/* 1) 프로필 안내 · 4) 이미 서로 호감인 프로필의 편지 안내 */
function onProfileOpen(){
  clearTimeout(openTimer);hide();
  if(mutual()){if(noLetter()&&!letterSeen())openTimer=setTimeout(()=>{if(profile.hidden||!mutual()||!noLetter())return;letterTip();},reduce()?0:600);return;}
  if(read().profile||typeof sentInterests==='undefined'||sentInterests.has(matchIndex))return;
  openTimer=setTimeout(()=>{if(profile.hidden||sentInterests.has(matchIndex)||read().profile)return;
    showTip(like,'마음이 가면 호감을 보내 보세요.',{ms:4000,keep:true});mark('profile');},reduce()?0:600);
}
/* 2) 마음함 안내 */
let tabTimer=0;
like.addEventListener('click',()=>{
  clearTimeout(openTimer);hide();mark('profile');
  /* 원래 click 처리(관심 저장 · 하트 효과)가 끝난 뒤에 확인해요 */
  setTimeout(()=>{if(typeof sentInterests==='undefined'||!sentInterests.has(matchIndex))return;
    if(typeof incomingInterestIds!=='undefined'&&incomingInterestIds.has(matchIndex)){clearTimeout(tabTimer);
      tabTimer=setTimeout(()=>afterToast(()=>{if(profile.hidden||!noLetter())return;letterTip();}),reduce()?0:1400);return;}
    if(read().hearts)return;
    mark('hearts');clearTimeout(tabTimer);
    tabTimer=setTimeout(()=>afterToast(()=>{const tab=document.querySelector('#gnb-layer [data-go="heartbox"]')||document.querySelector('.home-nav [data-go="heartbox"]');if(profile.hidden||!tab)return;
      showTip(tab,'<span class="yh-tip-heart" aria-hidden="true"></span>보낸 호감은 마음함에 모여요',{ms:3000,small:true});
      if(!reduce()){const s=tab.querySelector('.nav-symbol')||tab;s.animate([{transform:'scale(1)'},{transform:'scale(1.18)',offset:.4},{transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});}
    }),reduce()?0:1400);
  },0);
});

/* 화면을 바꾸면 · 화면 어디든 누르면 바로 닫아요 */
if(typeof show==='function'){const base=show;window.show=function(name,...rest){const r=base.call(this,name,...rest);if(name==='match-profile')onProfileOpen();else{clearTimeout(openTimer);clearTimeout(tabTimer);hide();}return r;};}
/* 톡 누를 때만 닫아요: 스크롤하려고 손을 대거나 10px 넘게 끄는 건 누름으로 치지 않아요 */
let downAt=null;
phone.addEventListener('pointerdown',e=>{downAt=tip?{x:e.clientX,y:e.clientY}:null;},true);
phone.addEventListener('pointercancel',()=>{downAt=null;},true);
phone.addEventListener('pointerup',e=>{const d=downAt;downAt=null;if(!tip||!d||Math.hypot(e.clientX-d.x,e.clientY-d.y)>=10)return;
  if(!tip.contains(e.target)&&e.target!==like&&!like.contains(e.target))hide();},true);
/* 스크롤: 안내는 모두 정해진 시간 동안 그대로 (keep · 작은 안내) */
profile.querySelector('.detail-scroll')?.addEventListener('scroll',()=>{if(tip&&!tip.classList.contains('is-small')&&!tip.dataset.keep)hide();},{passive:true});

/* 로그아웃 · 시연 초기화: 기억을 지워 다시 로그인하면 처음처럼 */
document.addEventListener('click',e=>{const b=e.target.closest('[data-fx="logout"],[data-fx="reset"]');if(b)forget();},true);
/* 시연 도구용: 지금 프로필 안내를 다시 확인 · 한 사람의 편지 안내 기억 지우기 */
const forgetLetter=()=>{const v=read();v.letter=(v.letter||[]).filter(x=>x!==who());write(v);};
window.yhOnboardTips={forget,state:read,open:()=>{if(!profile.hidden)onProfileOpen();},forgetLetter,letterSeen,noLetter};
})();
