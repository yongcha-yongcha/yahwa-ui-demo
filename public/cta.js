/* 상태에 맞춰 바뀌는 버튼 (CTA 시안 D) · 사진 · 일상 정보 단계
   이야기(story.js)와 해시태그(hashtags.js)는 각 파일에서 직접 바꾼다. */
(()=>{
const photoBtn=document.querySelector('#photos .ob-next');
const detailBtn=document.getElementById('details-next');
const detail=document.getElementById('details');
if(!photoBtn||!detailBtn||!detail)return;
const FIELDS=['job','height','mbti','education','religion','smoking','drinking'];
function photos(){
  const urls=typeof photoUrls!=='undefined'?photoUrls:[];
  const n=urls.filter(Boolean).length,cover=!!urls[0];
  photoBtn.disabled=!cover;
  photoBtn.textContent=cover?`사진 ${n}장으로 계속하기`:'대표 사진을 1장 올려 주세요';
}
function details(){
  const any=FIELDS.some(id=>{const el=document.getElementById(id);return el&&String(el.value||'').trim()&&el.value!=='선택해 주세요';});
  detailBtn.textContent=any?'다음':'나중에 채우고 계속하기';
}
const sync=()=>{photos();details();};
/* 사진 칸이 바뀌면(추가 · 삭제 · 순서) 다시 센다 */
const grid=document.querySelector('#photos .photo-grid');
if(grid)new MutationObserver(photos).observe(grid,{childList:true,subtree:true});
/* 일상 정보는 입력 · 휠 선택 뒤에 다시 본다 */
detail.addEventListener('input',details);detail.addEventListener('change',details);
document.addEventListener('click',()=>setTimeout(details,0));
if(typeof show==='function'){const base=show;window.show=function(...a){const r=base.apply(this,a);sync();return r;};}
sync();
})();
