/* 웰컴 · 사진 · 로고 · 하트를 한 장으로 묶기 (시안 W1 · 2026-11-13)
   설계 크기 360 × 596(화면 780 − 아래 시트 184)의 그림을 화면에 꽉 차게 같은 비율로 키워요.
   사진이 화면을 덮는 방식 그대로(가운데 기준) 키우니, 어떤 기기에서도 로고와 하트가 사진 속 같은 자리에 있어요.
   위 문구(h1)는 묶지 않아 글자 크기가 기기마다 같아요. */
(()=>{
  const DESIGN_W=360,DESIGN_H=596,SHEET=184;
  const visual=document.querySelector('#welcome .welcome-visual'),stage=visual?.querySelector('.welcome-stage');
  if(!stage)return;
  const fit=()=>{
    const w=visual.clientWidth,a=visual.clientHeight-SHEET;
    if(!w||a<=0)return;
    const k=Math.max(w/DESIGN_W,a/DESIGN_H);
    stage.style.setProperty('--wl-k',k);
    stage.style.setProperty('--wl-x',(w-DESIGN_W*k)/2+'px');
    stage.style.setProperty('--wl-y',(a-DESIGN_H*k)/2+'px');
  };
  new ResizeObserver(fit).observe(visual);
  fit();
})();
