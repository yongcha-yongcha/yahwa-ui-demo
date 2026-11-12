# A1 '생활' 영역 변형 생성기. 위쪽(이름 · 지역 · 태그 · 세 칸)은 A1 그대로, 생활 네 가지만 바꾼다.
from build import HERE, page, svg, NAME, FACTS
from build2 import META, TAGLINE, A1_CSS, VLINE, LIFE

TOP = f'''<h2 class="r-name">{NAME}</h2>{META}{TAGLINE}
<div class="a1-key" role="list" aria-label="나에 대해">{VLINE.join(f'<div role="listitem">{svg(k)}<b>{FACTS[k]}</b><small>{k}</small></div>' for k in ['하는 일','키','성격'])}</div>'''
LBL = {'흡연': '담배', '음주': '술', '종교': '종교', '학력': '학력'}
LIFE2 = [('흡연', '비흡연'), ('음주', '가끔'), ('종교', '무교'), ('학력', '대학교 졸업')]

V = {}
# L1. 큰 칩 · 테두리 (요청안): 40px, 아이콘 18, 글자 14
V['l1'] = ('큰 칩 · 테두리', '''
.lf{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0;padding:0;list-style:none}
.lf li{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 12px;border-radius:20px;background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-default);font-size:14px;color:var(--color-fg-primary)}
.lf .fi{color:var(--color-fg-tertiary)}
''', f'<ul class="lf" aria-label="생활">{"".join(f"<li>{svg(k)}{v}</li>" for k,v in LIFE)}</ul>')

# L2. 큰 칩 · 채움: 테두리 없이 흰 바탕, 위 상자와 같은 재질
V['l2'] = ('큰 칩 · 흰 채움', '''
.lf{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0;padding:0;list-style:none}
.lf li{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 12px;border-radius:20px;background:var(--color-bg-surface);font-size:14px;color:var(--color-fg-primary)}
.lf .fi{color:var(--color-fg-accent)}
''', f'<ul class="lf" aria-label="생활">{"".join(f"<li>{svg(k)}{v}</li>" for k,v in LIFE)}</ul>')

# L3. 큰 칩 · 파스텔: 네 가지 색이 하나씩 (자기소개 화면 테이프 색)
V['l3'] = ('큰 칩 · 파스텔', '''
.lf{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0;padding:0;list-style:none}
.lf li{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 12px;border-radius:20px;font-size:14px;font-weight:500}
.lf li:nth-child(1){background:color-mix(in srgb,var(--sky-100) 80%,transparent);color:var(--story-tape-1-fg)}
.lf li:nth-child(2){background:color-mix(in srgb,var(--rose-100) 90%,transparent);color:var(--story-tape-2-fg)}
.lf li:nth-child(3){background:var(--gold-100);color:var(--story-tape-3-fg)}
.lf li:nth-child(4){background:var(--sage-100);color:var(--story-tape-4-fg)}
''', f'<ul class="lf" aria-label="생활">{"".join(f"<li>{svg(k)}{v}</li>" for k,v in LIFE)}</ul>')

# L4. 2×2 타일: 같은 폭 네 칸, 아이콘 + 라벨(작게) + 값
V['l4'] = ('2×2 타일', '''
.lf{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 0;padding:0;list-style:none}
.lf li{display:flex;align-items:center;gap:12px;height:56px;padding:0 16px;border-radius:16px;background:var(--color-bg-surface)}
.lf .fi{color:var(--color-fg-accent)}
.lf span{display:flex;flex-direction:column;line-height:1.35}
.lf small{font-size:11px;color:var(--color-fg-subtle)}
.lf b{font-size:14px;font-weight:500}
''', f'<ul class="lf" aria-label="생활">{"".join(f"<li>{svg(k)}<span><small>{LBL[k]}</small><b>{v}</b></span></li>" for k,v in LIFE2)}</ul>')

# L5. 한 상자로 합치기: 위 세 칸 상자 아래쪽에 손그림 가로선 + 네 칸 작은 줄
V['l5'] = ('한 상자로 합치기', '''
.a1-key{border-radius:20px 20px 0 0;padding-bottom:16px}
.lf{display:grid;grid-template-columns:repeat(4,1fr);margin:0;padding:12px 8px 16px;list-style:none;border-radius:0 0 20px 20px;background:var(--color-bg-surface);position:relative}
.lf::before{content:"";position:absolute;left:20px;right:20px;top:0;height:6px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 6' preserveAspectRatio='none'%3E%3Cpath d='M2 3q40-2 80 .4t80-.2 70 .3 66-.5' fill='none' stroke='%23E3E7EA' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E") center/100% 6px no-repeat}
.lf li{display:flex;flex-direction:column;align-items:center;gap:4px;padding-top:8px;text-align:center}
.lf .fi{width:16px;height:16px;color:var(--color-fg-tertiary)}
.lf b{font-size:13px;font-weight:500;line-height:1.35;word-break:keep-all}
''', f'<ul class="lf" aria-label="생활">{"".join(f"<li>{svg(k)}<b>{v}</b></li>" for k,v in LIFE)}</ul>')

# L6. 소제목 + 큰 칩: '생활' 소제목을 두고 그 아래 큰 칩 (묶음이 분명함)
V['l6'] = ('소제목 + 큰 칩', '''
.lf-h{margin:24px 0 8px;font-size:12px;font-weight:500;color:var(--color-fg-tertiary)}
.lf{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.lf li{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 12px;border-radius:12px;background:var(--color-bg-muted);font-size:14px;color:var(--color-fg-primary)}
.lf .fi{color:var(--color-fg-secondary)}
''', '<p class="lf-h">생활</p>' + f'<ul class="lf" aria-label="생활">{"".join(f"<li>{svg(k)}{v}</li>" for k,v in LIFE)}</ul>')

if __name__ == '__main__':
    for k, (name, css, body) in V.items():
        (HERE / f'{k}.html').write_text(page(f'A1 생활 {name}', TOP + body, A1_CSS.replace('.a1-life', '.x-unused') + css))
    print('built', ', '.join(V))
