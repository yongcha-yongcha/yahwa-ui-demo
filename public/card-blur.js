/* 인연 카드 · 사진 아래쪽 background blur와 사진 색 번짐. 값은 tokens.css의 --card-* */
(()=>{
const grid=document.getElementById('daily-grid');
if(!grid)return;
const LAYERS=6;
const hues=new Map();
/* 사진 아래쪽 45%의 색상을 채도가 높은 픽셀 위주로 뽑습니다 */
function hueOf(src){
  if(!hues.has(src))hues.set(src,new Promise(done=>{
    const im=new Image();
    im.onload=()=>{
      const c=document.createElement('canvas');c.width=40;c.height=60;
      const x=c.getContext('2d',{willReadFrequently:true});
      x.drawImage(im,0,0,40,60);
      const d=x.getImageData(0,33,40,27).data;
      let R=0,G=0,B=0,W=0;
      for(let i=0;i<d.length;i+=4){const w=1+(Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2]))/32;R+=d[i]*w;G+=d[i+1]*w;B+=d[i+2]*w;W+=w;}
      const r=R/W/255,g=G/W/255,b=B/W/255,mx=Math.max(r,g,b),gap=mx-Math.min(r,g,b);
      let h=210;
      if(gap){h=mx===r?((g-b)/gap)%6:mx===g?(b-r)/gap+2:(r-g)/gap+4;h=(h*60+360)%360;}
      done(Math.round(h));
    };
    im.onerror=()=>done(210);
    im.src=src;
  }));
  return hues.get(src);
}
function decorate(){
  grid.querySelectorAll('.daily-card').forEach(card=>{
    const thumb=card.querySelector('.match-sheet-thumb'),photo=card.querySelector('.fx-batch-image');
    if(!thumb||!photo||thumb.querySelector('.card-tint'))return;
    for(let i=0;i<LAYERS;i++){
      const layer=document.createElement('div');
      layer.className='card-blur-layer';
      layer.style.setProperty('--i',i);
      layer.style.setProperty('--d',2**(LAYERS-1-i));
      thumb.append(layer);
    }
    const tint=document.createElement('div');tint.className='card-tint';thumb.append(tint);
    const src=(photo.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/)||[])[1];
    if(src)hueOf(src).then(h=>card.style.setProperty('--card-hue',h));
  });
}
new MutationObserver(decorate).observe(grid,{childList:true,subtree:true});
decorate();
})();
