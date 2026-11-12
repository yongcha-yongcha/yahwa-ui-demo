# A1 생활 칩 · 색연필 빗금 변형 10개 생성기.
# 칩 크기를 재서 그 위에 색연필로 빗줄을 그은 듯한 SVG를 그린다(같은 시드 = 늘 같은 모양).
import json
from build import HERE, page, svg
from build3 import TOP, LIFE, LIFE2, LBL
from build2 import A1_CSS

HATCH_JS = r'''
const NS='http://www.w3.org/2000/svg';
const TONE={sky:['#92C0DF','#245D7E'],rose:['#DDAFB7','#7D3749'],gold:['#D1BF9A','#6C582C'],sage:['#9FC4B7','#3C6555']};
const ORDER=['sky','rose','gold','sage'];
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
/* 각도 a의 평행선들을 사각형 [x0,x1]×[y0,y1] 안에서 자른 선분 목록 */
function lines(x0,y0,x1,y1,a,gap,r){
  const rad=a*Math.PI/180,dx=Math.cos(rad),dy=-Math.sin(rad),nx=-dy,ny=dx;
  const ts=[[x0,y0],[x1,y0],[x0,y1],[x1,y1]].map(([x,y])=>x*nx+y*ny);
  const out=[];
  for(let t=Math.min(...ts)+gap*r();t<Math.max(...ts);t+=gap*(.7+.6*r())){
    let s0=-1e9,s1=1e9,ok=true;
    for(const [p,q,lo,hi] of [[nx*t,dx,x0,x1],[ny*t,dy,y0,y1]]){
      if(Math.abs(q)<1e-9){if(p<lo||p>hi)ok=false;continue;}
      let a1=(lo-p)/q,a2=(hi-p)/q;if(a1>a2)[a1,a2]=[a2,a1];s0=Math.max(s0,a1);s1=Math.min(s1,a2);
    }
    if(ok&&s1-s0>2)out.push([nx*t+dx*s0,ny*t+dy*s0,nx*t+dx*s1,ny*t+dy*s1]);
  }
  return out;
}
/* 전체 연하기: 1 = 처음 농도 */
const SOFT=.68;
function stroke(g,d,col,w,op){op=(op*SOFT).toFixed(2);const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('stroke',col);p.setAttribute('stroke-width',w);p.setAttribute('stroke-opacity',op);p.setAttribute('fill','none');p.setAttribute('stroke-linecap','round');g.append(p);}
function hatchInto(g,x0,y0,x1,y1,o,col,r,zig){
  const angles=[o.angle,...(o.cross?[o.cross]:[])];
  angles.forEach((a,ai)=>{
    const segs=lines(x0,y0,x1,y1,a,o.gap*(ai?1.4:1),r);
    if(zig){let d='';segs.forEach((s,i)=>{const [ax,ay,bx,by]=i%2?[s[2],s[3],s[0],s[1]]:s;d+=(i?'L':'M')+ax.toFixed(1)+' '+ay.toFixed(1)+'L'+bx.toFixed(1)+' '+by.toFixed(1);});stroke(g,d,col,o.w,o.op[1]);return;}
    segs.forEach(([ax,ay,bx,by])=>{
      const L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,t0=r()*o.trim,t1=r()*o.trim;
      const sx=ax+ux*t0+(r()-.5)*o.jit,sy=ay+uy*t0+(r()-.5)*o.jit,ex=bx-ux*t1+(r()-.5)*o.jit,ey=by-uy*t1+(r()-.5)*o.jit;
      const mx=(sx+ex)/2+(r()-.5)*1.6,my=(sy+ey)/2+(r()-.5)*1.6;
      stroke(g,`M${sx.toFixed(1)} ${sy.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,col,(o.w*(.8+.4*r())).toFixed(2),(o.op[0]+(o.op[1]-o.op[0])*r()).toFixed(2));
    });
  });
}
function roughRect(g,w,h,rad,col,r){
  for(let k=0;k<2;k++){const j=()=>(r()-.5)*1.6,i=1.5;
    const d=`M${i+rad+j()} ${i+j()}L${w-i-rad+j()} ${i+j()}Q${w-i+j()} ${i+j()} ${w-i+j()} ${i+rad+j()}L${w-i+j()} ${h-i-rad+j()}Q${w-i+j()} ${h-i+j()} ${w-i-rad+j()} ${h-i+j()}L${i+rad+j()} ${h-i+j()}Q${i+j()} ${h-i+j()} ${i+j()} ${h-i-rad+j()}L${i+j()} ${i+rad+j()}Q${i+j()} ${i+j()} ${i+rad+3} ${i+j()}`;
    stroke(g,d,col,k?0.9:1.3,k?.45:.8);}
}
function draw(){
  document.querySelectorAll('[data-hz]').forEach(list=>{
    const o=JSON.parse(list.dataset.hz);
    list.querySelectorAll(':scope>li').forEach((el,i)=>{
      el.querySelector('svg.hzs')?.remove();
      const w=el.offsetWidth,h=el.offsetHeight,r=rng(i+1+(o.seed||0)),tone=TONE[o.one||ORDER[i%4]];
      el.style.setProperty('--ink',tone[1]);
      const s=document.createElementNS(NS,'svg');s.setAttribute('class','hzs');s.setAttribute('width',w);s.setAttribute('height',h);s.setAttribute('aria-hidden','true');
      const g=document.createElementNS(NS,'g');g.setAttribute('filter','url(#pencil)');s.append(g);
      const rad=Math.min(o.rad??h/2,h/2),cid='c'+Math.random().toString(36).slice(2,8);
      let box=[o.pad,o.pad,w-o.pad,h-o.pad];
      if(o.region==='under')box=[o.pad,h*.5,w-o.pad,h-o.pad+2];
      if(o.region==='left')box=[-2,-2,Math.min(w*.42,72),h+2];
      if(o.region==='dot'){const ib=el.querySelector('.fi').getBoundingClientRect(),eb=el.getBoundingClientRect(),cx=ib.left-eb.left+ib.width/2,cy=h/2,R=15;box=[cx-R,cy-R,cx+R,cy+R];
        const c=document.createElementNS(NS,'clipPath');c.id=cid;const e=document.createElementNS(NS,'ellipse');e.setAttribute('cx',cx);e.setAttribute('cy',cy);e.setAttribute('rx',R);e.setAttribute('ry',R-1.5);c.append(e);s.prepend(c);g.setAttribute('clip-path',`url(#${cid})`);}
      if(o.clip){const c=document.createElementNS(NS,'clipPath');c.id=cid;const q=document.createElementNS(NS,'rect');q.setAttribute('x',o.pad);q.setAttribute('y',o.pad);q.setAttribute('width',w-o.pad*2);q.setAttribute('height',h-o.pad*2);q.setAttribute('rx',Math.max(rad-o.pad,2));c.append(q);s.prepend(c);g.setAttribute('clip-path',`url(#${cid})`);}
      if(o.region==='left'){const m=document.createElementNS(NS,'linearGradient');m.id=cid+'g';m.innerHTML='<stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>';const mk=document.createElementNS(NS,'mask');mk.id=cid+'m';mk.innerHTML=`<rect x="-4" y="-4" width="${box[2]+4}" height="${h+8}" fill="url(#${cid}g)"/>`;s.prepend(m,mk);g.setAttribute('mask',`url(#${cid}m)`);}
      hatchInto(g,...box,o,tone[0],r,o.zig);
      if(o.outline)roughRect(s,w,h,rad,tone[0],r);
      el.prepend(s);
    });
  });
}
(document.fonts?.ready||Promise.resolve()).then(()=>requestAnimationFrame(draw));
/* 칩 크기가 바뀌면(글꼴 로딩·화면 폭) 다시 그림 */
let rz;new ResizeObserver(()=>{clearTimeout(rz);rz=setTimeout(()=>{const li=document.querySelector('[data-hz]>li');const sv=li?.querySelector('svg.hzs');if(!sv||+sv.getAttribute('width')!==li.offsetWidth)draw();},60);}).observe(document.querySelector('[data-hz]'));
'''
FILTER = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="pencil" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.25" result="g"/><feComposite in="d" in2="g" operator="in"/></filter></svg>'

CHIP_CSS = '''
.lf{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0;padding:0;list-style:none}
.lf li{position:relative;isolation:isolate;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 12px;font-size:14px;font-weight:500;color:var(--ink,var(--color-fg-primary))}
.lf li .fi{color:var(--ink,var(--color-fg-tertiary))}
svg.hzs{position:absolute;left:0;top:0;z-index:-1;overflow:visible;pointer-events:none}
'''
TILE_CSS = '''
.lf{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 0;padding:0;list-style:none}
.lf li{position:relative;isolation:isolate;display:flex;align-items:center;gap:12px;height:56px;padding:0 16px;color:var(--ink,var(--color-fg-primary))}
.lf li .fi{color:var(--ink)}
.lf span{display:flex;flex-direction:column;line-height:1.35}
.lf small{font-size:11px;opacity:.75}
.lf b{font-size:14px;font-weight:500}
svg.hzs{position:absolute;left:0;top:0;z-index:-1;overflow:visible;pointer-events:none}
'''
def chips(o):
    return f"<ul class=\"lf\" aria-label=\"생활\" data-hz='{json.dumps(o)}'>" + ''.join(f'<li>{svg(k)}<span>{v}</span></li>' for k, v in LIFE) + '</ul>'
def tiles(o):
    return f"<ul class=\"lf\" aria-label=\"생활\" data-hz='{json.dumps(o)}'>" + ''.join(f'<li>{svg(k)}<span><small>{LBL[k]}</small><b>{v}</b></span></li>' for k, v in LIFE2) + '</ul>'

B = dict(angle=58, gap=3, w=1.8, op=[.5, .9], trim=5, jit=1.2, pad=1)
V = {
    'h1': ('촘촘한 빗금', 'chip', {**B, 'clip': True, 'pad': 0}, '알약 모양 안을 45~60°로 촘촘히 칠함. 가장 단정한 색연필 칩'),
    'h2': ('느슨한 빗금', 'chip', {**B, 'gap': 5, 'trim': 2, 'jit': 2.4, 'pad': -1, 'w': 1.6}, '선 간격을 넓히고 끝이 칩 밖으로 살짝 삐져나옴. 빠르게 쓱쓱 칠한 느낌'),
    'h3': ('빗금 + 연필 테두리', 'chip', {**B, 'gap': 4.4, 'clip': True, 'pad': 2, 'outline': True, 'op': [.35, .7]}, '연하게 칠하고 같은 색 연필로 테두리를 두 번 그음. 스티커 같은 윤곽'),
    'h4': ('교차 빗금', 'chip', {**B, 'gap': 4.6, 'cross': -32, 'clip': True, 'pad': 0, 'op': [.3, .65], 'w': 1.4}, '두 방향으로 엇갈려 칠한 크로스 해칭. 질감이 가장 진함'),
    'h5': ('밑줄 칠하기', 'chip', {**B, 'gap': 2.8, 'region': 'under', 'pad': 2, 'trim': 3, 'angle': 70}, '글자 아래 절반만 색연필로 칠함. 노트에 밑줄 친 느낌이라 가장 가벼움'),
    'h6': ('지그재그 낙서', 'chip', {**B, 'gap': 4.2, 'zig': True, 'clip': True, 'pad': 0, 'op': [.6, .6], 'w': 1.3, 'angle': 75}, '한 번에 이어 그은 지그재그로 채움. 손으로 칠한 티가 가장 많이 남'),
    'h7': ('아이콘 동그라미', 'chip', {**B, 'gap': 2.6, 'region': 'dot', 'pad': 0, 'op': [.5, .9]}, '아이콘 뒤에만 색연필 동그라미, 글자는 회색 칩 없이. 가장 조용함'),
    'h8': ('한 색 빗금', 'chip', {**B, 'clip': True, 'pad': 0, 'one': 'sky', 'gap': 3.6, 'op': [.35, .7]}, '네 칩 모두 하늘색 하나로. 해시태그 · 위 세 칸과 색이 맞아 차분함'),
    'h9': ('2×2 타일 · 빗금 채움', 'tile', {**B, 'clip': True, 'pad': 0, 'rad': 16, 'gap': 3.6, 'op': [.35, .75]}, 'L4 타일 전체를 색연필로 칠함. 라벨이 있어 뜻이 분명'),
    'h10': ('2×2 타일 · 모서리 칠하기', 'tile', {**B, 'region': 'left', 'clip': True, 'pad': 0, 'rad': 16, 'gap': 3, 'op': [.45, .85]}, '타일 왼쪽(아이콘 쪽)만 칠하고 오른쪽으로 갈수록 흐려짐. 흰 타일 바탕 위'),
}
H7_CSS = '.lf li{padding-left:6px}.lf li span{color:var(--color-fg-primary)}'
H10_CSS = '.lf li{background:var(--color-bg-surface);border-radius:16px}'

if __name__ == '__main__':
    for k, (name, kind, o, _) in V.items():
        css = A1_CSS.replace('.a1-life', '.x-unused') + (CHIP_CSS if kind == 'chip' else TILE_CSS)
        if k == 'h7': css += H7_CSS
        if k == 'h10': css += H10_CSS
        body = TOP + (chips(o) if kind == 'chip' else tiles(o)) + FILTER
        (HERE / f'{k}.html').write_text(page(f'A1 생활 {name}', body, css, HATCH_JS))
    print('built', ', '.join(V))
