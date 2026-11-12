# 소개 미리보기 2차 시안 생성기. 1차에서 고른 A·B·D 방향마다 두 개씩 만든다.
from build import HERE, page, svg, NAME, REGION, GENDER, TAGS, FACTS

META = f'<p class="r-meta">{svg("지역")}{REGION}<i></i>{GENDER}</p>'
TAGLINE = f'<ul class="r-tags" aria-label="해시태그">{"".join(f"<li>#{t}</li>" for t in TAGS)}</ul>'
BASE_CSS = '''
.r-name{margin:28px 0 0;font:400 30px/1.3 var(--font-serif);letter-spacing:-.5px}
.r-meta{display:flex;align-items:center;gap:4px;margin:8px 0 0;font-size:14px;color:var(--color-fg-secondary)}
.r-meta .fi{width:16px;height:16px;color:var(--color-fg-tertiary)}
.r-meta i{width:2px;height:2px;margin:0 4px;border-radius:50%;background:var(--color-fg-subtle)}
.r-tags{display:flex;flex-wrap:wrap;gap:4px 12px;margin:12px 0 0;padding:0;list-style:none;font-size:13px;color:var(--color-fg-accent-strong)}
.r-h{margin:0 0 12px;font-size:12px;font-weight:500;color:var(--color-fg-tertiary)}
'''
LIFE = [('흡연', '비흡연'), ('음주', '술은 가끔'), ('종교', '무교'), ('학력', '대학교 졸업')]

# ───────── A1. 정돈, 더 가볍게: 박스 없이 세 칸 + 손그림 세로선, 생활은 한 줄
A1_CSS = BASE_CSS + '''
.a1-key{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:stretch;margin-top:32px;padding:20px 0;border-radius:20px;background:var(--color-bg-surface)}
.a1-key>div{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center}
.a1-key .fi{color:var(--color-fg-accent);margin-bottom:4px}
.a1-key b{font-size:17px;font-weight:600;line-height:1.35}
.a1-key small{font-size:11px;color:var(--color-fg-subtle)}
.a1-key svg.v{width:6px;height:auto;align-self:stretch;fill:none;stroke:var(--color-border-default);stroke-width:1.4;stroke-linecap:round}
.a1-life{display:flex;flex-wrap:wrap;gap:8px 16px;margin:16px 4px 0;padding:0;list-style:none;font-size:13px;color:var(--color-fg-secondary)}
.a1-life li{display:inline-flex;align-items:center;gap:6px}
.a1-life .fi{width:16px;height:16px;color:var(--color-fg-tertiary)}
'''
VLINE = '<svg class="v" viewBox="0 0 6 60" preserveAspectRatio="none" aria-hidden="true"><path d="M3 4q-1.6 13 .2 26t-.4 26"/></svg>'
A1_BODY = f'''<h2 class="r-name">{NAME}</h2>{META}{TAGLINE}
<div class="a1-key" role="list" aria-label="나에 대해">{VLINE.join(f'<div role="listitem">{svg(k)}<b>{FACTS[k]}</b><small>{k}</small></div>' for k in ['하는 일','키','성격'])}</div>
<ul class="a1-life" aria-label="생활">{''.join(f'<li>{svg(k)}{v}</li>' for k,v in LIFE)}</ul>'''

# ───────── A2. 말하는 목록: 아이콘 타일 + 짧은 문장, 생활은 옅은 칩
A2_CSS = BASE_CSS + '''
.a2-list{display:flex;flex-direction:column;gap:12px;margin:32px 0 0;padding:0;list-style:none}
.a2-list li{display:flex;align-items:center;gap:12px;font-size:15px}
.a2-list .t{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:var(--color-bg-notice);color:var(--color-fg-accent-strong)}
.a2-list b{font-weight:600}
.a2-life{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.a2-life span{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:16px;background:var(--color-bg-muted);font-size:13px;color:var(--color-fg-secondary)}
'''
A2_ROWS = [('하는 일', '<b>회사</b>에서 일해요'), ('키', '키 <b>168cm</b>'), ('성격', '<b>INFP</b>예요')]
A2_BODY = f'''<h2 class="r-name">{NAME}</h2>{META}{TAGLINE}
<ul class="a2-list" aria-label="나에 대해">{''.join(f'<li><span class="t">{svg(k)}</span><span>{v}</span></li>' for k,v in A2_ROWS)}</ul>
<div class="a2-life" aria-label="생활">{''.join(f'<span>{v}</span>' for _,v in LIFE)}</div>'''

# ───────── B1. 필름 스트립, 더 얇게: 흰 상자 없이 프레임 칸 + 가장자리 인쇄 글자
MONO = 'ui-monospace,SFMono-Regular,Menlo,monospace'
B1_CSS = BASE_CSS + f'''
.b1-head{{display:flex;align-items:baseline;gap:12px;margin-top:28px}}
.b1-head .r-name{{margin:0}}
.b1-stamp{{font:500 12px/1 {MONO};letter-spacing:1px;color:var(--gold-600)}}
.b1-roll{{margin-top:28px;padding:20px 0;background:var(--gold-50);position:relative;border-radius:4px}}
.b1-roll::before,.b1-roll::after{{content:"";position:absolute;left:8px;right:8px;height:6px;background:radial-gradient(ellipse 3px 2px,var(--color-bg-page) 0 2.5px,transparent 3px) 0 0/14px 6px repeat-x}}
.b1-roll::before{{top:6px}}.b1-roll::after{{bottom:6px}}
.b1-edge{{display:flex;justify-content:space-between;padding:0 16px;margin-bottom:8px;font:500 11px/1 {MONO};letter-spacing:1px;color:var(--gold-500)}}
.b1-frames{{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:0 8px}}
.b1-f{{padding:12px;background:color-mix(in srgb,var(--white) 70%,transparent);display:flex;flex-direction:column;gap:2px}}
.b1-f:first-child{{border-radius:3px 0 0 3px}}.b1-f:last-child{{border-radius:0 3px 3px 0}}
.b1-f small{{font-size:11px;color:var(--color-fg-tertiary)}}
.b1-f b{{font-size:17px;font-weight:600;line-height:1.35}}
.b1-life{{display:flex;flex-wrap:wrap;gap:4px 16px;margin:12px 16px 0;font-size:13px;color:var(--color-fg-secondary)}}
.b1-life em{{font:500 11px/1 {MONO};font-style:normal;color:var(--gold-500);margin-right:4px}}
'''
B1_BODY = f'''<div class="b1-head"><h2 class="r-name">{NAME}</h2><span class="b1-stamp">SEOUL '26</span></div>{META}{TAGLINE}
<div class="b1-roll" role="group" aria-label="나의 정보">
<div class="b1-edge" aria-hidden="true"><span>YAHWA 400</span><span>▸01</span><span>▸02</span><span>▸03</span></div>
<div class="b1-frames">{''.join(f'<div class="b1-f"><small>{k}</small><b>{FACTS[k]}</b></div>' for k in ['하는 일','키','성격'])}</div>
<p class="b1-life">{''.join(f'<span><em>{i:02d}</em>{v}</span>' for i,(_,v) in enumerate(LIFE,4))}</p>
</div>'''

# ───────── B2. 세로 필름 옆줄: 왼쪽 세로 스트립에 프레임 번호, 오른쪽에 정보
B2_CSS = BASE_CSS + f'''
.b2-head{{display:flex;align-items:baseline;gap:12px;margin-top:28px}}
.b2-head .r-name{{margin:0}}
.b2-stamp{{font:500 12px/1 {MONO};letter-spacing:1px;color:var(--gold-600)}}
.b2-reel{{display:grid;grid-template-columns:32px 1fr;margin-top:32px}}
.b2-strip{{grid-column:1;grid-row:1/span 9;border-radius:4px;background:var(--gold-100);position:relative}}
.b2-strip::before,.b2-strip::after{{content:"";position:absolute;top:6px;bottom:6px;width:5px;background:radial-gradient(ellipse 2px 3px,var(--color-bg-page) 0 2.2px,transparent 2.8px) 0 0/5px 12px repeat-y}}
.b2-strip::before{{left:3px}}.b2-strip::after{{right:3px}}
.b2-row{{grid-column:2;grid-row:auto;display:grid;grid-template-columns:0 1fr;align-items:center;min-height:56px;padding-left:16px}}
.b2-row em{{position:relative;z-index:1;font:500 11px/1 {MONO};font-style:normal;color:var(--gold-600);margin-left:-44px;width:24px;display:block;text-align:center}}
.b2-row small{{display:block;font-size:11px;color:var(--color-fg-tertiary)}}
.b2-row b{{font-size:16px;font-weight:600}}
.b2-row.sm{{min-height:40px}}
.b2-row.sm b{{font-size:14px;font-weight:500;color:var(--color-fg-secondary)}}
.b2-row.sm small{{display:inline;margin-right:8px}}
.b2-gap{{grid-column:2;height:12px}}
'''
def b2row(i, k, v, sm=False):
    return f'<div class="b2-row{" sm" if sm else ""}"><em>{i:02d}</em><span><small>{k}</small>{"" if sm else ""}<b>{v}</b></span></div>'
B2_BODY = f'''<div class="b2-head"><h2 class="r-name">{NAME}</h2><span class="b2-stamp">SEOUL '26</span></div>{META}{TAGLINE}
<div class="b2-reel" role="group" aria-label="나의 정보"><div class="b2-strip" aria-hidden="true"></div>
{''.join(b2row(i,k,FACTS[k]) for i,k in enumerate(['하는 일','키','성격'],1))}
<div class="b2-gap"></div>
{''.join(b2row(i,k,v,True) for i,(k,v) in enumerate([('흡연','비흡연'),('음주','가끔'),('종교','무교'),('학력','대학교 졸업')],4))}
</div>'''

# ───────── D 공통: 값을 문장으로 바꾸는 규칙 (빈 항목은 빠짐)
D_SCRIPT = r'''
const FULL={job:'직장인',height:'168',mbti:'INFP',edu:'대학교 졸업',religion:'무교',smoking:'비흡연',drinking:'가끔'};
const SPARSE={job:'직장인',height:'168'};
const JOB={'직장인':'회사에서 일하는','자영업':'내 가게를 꾸리는','프리랜서':'프리랜서로 일하는','전문직':'전문직으로 일하는','학생':'공부하는'};
const DRINK={'마시지 않아요':'술은 <mark>마시지 않아요</mark>','가끔':'술은 <mark>가끔</mark> 마셔요','즐기는 편이에요':'술은 <mark>즐기는 편</mark>이에요'};
const SMOKE={'비흡연':'담배는 <mark>피우지 않아요</mark>','가끔':'담배는 <mark>가끔</mark> 피워요','흡연':'담배를 <mark>피워요</mark>','전자담배':'<mark>전자담배</mark>를 피워요'};
const REL=v=>v==='무교'?'종교는 <mark>없어요</mark>':v==='기타'?'종교가 <mark>있어요</mark>':`<mark>${v}</mark>를 믿어요`;
const EDU={'고등학교 졸업':'<mark>고등학교</mark>를 졸업했어요','대학교 재학':'<mark>대학교</mark>에 다니고 있어요','대학교 졸업':'<mark>대학교</mark>를 졸업했어요','대학원 재학·졸업':'<mark>대학원</mark>에서 공부했어요'};
function sentence(d){
  const out=[];const j=JOB[d.job]||'';
  if(d.mbti&&d.mbti!=='잘 모르겠어요')out.push(`${j?j+' ':''}<mark>${d.mbti}</mark>예요`);
  else if(j)out.push(`<mark>${j}</mark> 사람이에요`);
  if(d.height)out.push(`키는 <mark>${d.height}cm</mark>예요`);
  if(d.drinking)out.push(DRINK[d.drinking]);
  if(d.smoking)out.push(SMOKE[d.smoking]);
  if(d.religion)out.push(REL(d.religion));
  if(d.edu)out.push(EDU[d.edu]);
  return out.map(s=>s+'.').join(' ');
}
const FIELDS=[['하는 일','job'],['키','height'],['성격','mbti'],['술','drinking'],['담배','smoking'],['종교','religion'],['학력','edu']];
function render(){const d=location.hash==='#sparse'?SPARSE:FULL;document.querySelectorAll('[data-say]').forEach(el=>el.innerHTML=sentence(d));
 document.querySelectorAll('[data-form]').forEach(el=>el.innerHTML=FIELDS.map(([l,k])=>{let v=d[k]||'';if(k==='height'&&v)v+='cm';return `<div class="f${v?'':' is-empty'}"><small>${l}</small><b>${v||'—'}</b></div>`;}).join(''));}
render();addEventListener('hashchange',()=>{render();const b=document.getElementById('body'),m=document.getElementById('me');b.scrollTop=m.offsetTop-b.offsetTop-80;});
if(location.hash==='#sparse'){const b=document.getElementById('body'),m=document.getElementById('me');requestAnimationFrame(()=>{b.scrollTop=m.offsetTop-b.offsetTop-80;});}
'''
NOTE_CSS = '''
.d-note{position:relative;margin-top:36px;padding:28px 20px 12px 28px;border-radius:4px 4px 16px 4px;background:var(--color-bg-surface);box-shadow:var(--story-note-shadow);
 background-image:linear-gradient(90deg,transparent 15px,var(--story-note-margin) 15px 16px,transparent 16px),repeating-linear-gradient(transparent 0 27px,var(--story-note-rule) 27px 28px);background-position:0 0,0 19px}
.d-tapes{display:flex;flex-wrap:wrap;gap:6px 8px;margin:-42px -4px 12px -12px;padding:0;list-style:none}
.d-tapes li{padding:2px 10px;font-size:12px;line-height:20px;font-weight:500;transform:rotate(var(--r))}
.d-tapes li:nth-child(4n+1){background:var(--story-tape-1);color:var(--story-tape-1-fg);--r:-2deg}
.d-tapes li:nth-child(4n+2){background:var(--story-tape-2);color:var(--story-tape-2-fg);--r:1.5deg}
.d-tapes li:nth-child(4n+3){background:var(--story-tape-3);color:var(--story-tape-3-fg);--r:-1deg}
.d-tapes li:nth-child(4n+4){background:var(--story-tape-4);color:var(--story-tape-4-fg);--r:2deg}
.d-sign{margin:0;text-align:right;font:400 13px/28px var(--font-serif);color:var(--color-fg-tertiary)}
'''
TAPES = f'<ul class="d-tapes" aria-label="해시태그">{"".join(f"<li>#{t}</li>" for t in TAGS)}</ul>'

# ───────── D1. 쪽지 정리판: 형광펜 한 색, 빈 항목은 문장에서 빠짐
D1_CSS = BASE_CSS + NOTE_CSS + '''
.d1-say{margin:4px 0 0;word-break:keep-all;font:400 15px/28px var(--font-serif);color:var(--color-fg-primary)}
.d1-say mark{background:linear-gradient(transparent 60%,var(--story-tape-1) 60% 90%,transparent 90%);color:inherit;padding:0 1px}
'''
D1_BODY = f'''<h2 class="r-name">{NAME}</h2>{META}
<div class="d-note">{TAPES}<p class="d1-say" data-say></p><p class="d-sign">— {NAME} 씀</p></div>'''

# ───────── D2. 빈칸 채우기 쪽지: 인쇄된 칸 이름 + 손으로 채운 답
D2_CSS = BASE_CSS + NOTE_CSS + '''
.d2-title{margin:0;font:500 11px/28px var(--font-sans);letter-spacing:2px;color:var(--color-fg-subtle)}
.d2-form{display:grid;grid-template-columns:repeat(6,1fr);column-gap:12px}
.d2-form .f{display:flex;align-items:baseline;gap:8px;height:56px;padding-top:6px;flex-direction:column;justify-content:flex-start}
.d2-form .f small{font-size:11px;line-height:16px;color:var(--color-fg-tertiary)}
.d2-form .f b{font:400 16px/28px var(--font-serif);color:var(--color-fg-accent-strong);margin-top:-2px}
.d2-form .f{grid-column:span 2}
.d2-form .f:nth-child(n+4){grid-column:span 3}
.d2-form .f.is-empty b{color:var(--color-fg-disabled,var(--color-fg-subtle))}
'''
D2_BODY = f'''<h2 class="r-name">{NAME}</h2>{META}
<div class="d-note">{TAPES}<p class="d2-title">ABOUT ME</p><div class="d2-form" data-form></div><p class="d-sign">— {NAME} 씀</p></div>'''

if __name__ == '__main__':
  PAGES = {
    'a1': ('소개 미리보기 2차 A1', A1_BODY, A1_CSS, ''),
    'a2': ('소개 미리보기 2차 A2', A2_BODY, A2_CSS, ''),
    'b1': ('소개 미리보기 2차 B1', B1_BODY, B1_CSS, ''),
    'b2': ('소개 미리보기 2차 B2', B2_BODY, B2_CSS, ''),
    'd1': ('소개 미리보기 2차 D1', D1_BODY, D1_CSS, D_SCRIPT),
    'd2': ('소개 미리보기 2차 D2', D2_BODY, D2_CSS, D_SCRIPT),
}
  for k, (t, b, c, s) in PAGES.items():
    (HERE / f'{k}.html').write_text(page(t, b, c, s))
  print('built', ', '.join(PAGES))
