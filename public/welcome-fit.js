/* 웰컴 · 사진 · 로고 · 하트를 한 장으로 묶기 (시안 W1 · 2026-11-13)
   설계 크기 360 × 596(화면 780 − 아래 시트 184)의 그림을 화면에 꽉 차게 같은 비율로 키워요.
   사진이 화면을 덮는 방식 그대로(가운데 기준) 키우니, 어떤 기기에서도 로고와 하트가 사진 속 같은 자리에 있어요.
   위 문구(h1)는 묶지 않아 글자 크기가 기기마다 같아요.
   스플래시도 같은 묶음을 같은 계산으로 놓아, 웰컴으로 넘어갈 때 문구 · 로고 · 하트가 제자리예요 (시안 S1 · 2026-11-21) */
(()=>{
  const DESIGN_W=360,DESIGN_H=596,SHEET=184;
  document.querySelectorAll('#welcome .welcome-visual, #splash .welcome-visual').forEach(visual=>{
    const stage=visual.querySelector('.welcome-stage');
    if(!stage)return;
    const fit=()=>{
      /* 홈 화면 앱에서는 그림 영역이 상태 표시줄 뒤까지 올라가요(offsetTop 음수). 구도는 상태 표시줄 아래 영역 기준으로 맞추고,
         사진은 묶음 밖으로 넉넉히 넘치게 그려져 있어 상태 표시줄 칸도 덮어요 (2026-11-13) */
      const off=Math.max(0,-visual.offsetTop),w=visual.clientWidth,a=visual.clientHeight-SHEET-off;
      if(!w||a<=0)return;
      const k=Math.max(w/DESIGN_W,a/DESIGN_H);
      stage.style.setProperty('--wl-k',k);
      stage.style.setProperty('--wl-x',(w-DESIGN_W*k)/2+'px');
      stage.style.setProperty('--wl-y',off+(a-DESIGN_H*k)/2+'px');
    };
    new ResizeObserver(fit).observe(visual);
    fit();
  });
})();
