# 해시태그 글자 변형 생성기. 지금 앱(A1 + H9)과 같은 화면에서 해시태그 줄만 바꾼다.
from build import HERE, page, svg, NAME, REGION, GENDER, TAGS, FACTS
from build2 import BASE_CSS, A1_CSS, VLINE
from build4 import HATCH_JS, FILTER, TILE_CSS, tiles, V as HV

MP = '<span class="mp" aria-hidden="true"></span>'
META = f'<p class="r-meta">{MP}{REGION}<i></i>{GENDER}</p>'
KEY = f'''<div class="a1-key" role="list" aria-label="나에 대해">{VLINE.join(f'<div role="listitem">{svg(k)}<b>{FACTS[k]}</b><small>{k}</small></div>' for k in ['하는 일','키','성격'])}</div>'''
LIFE = tiles(HV['h9'][2])
UL = '<svg class="ul" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true"><path d="M2 4q24-2.6 48-.6t48-.8"/></svg>'

COMMON = A1_CSS.replace('.a1-life', '.x-unused') + TILE_CSS + '''
.mp{display:inline-block;width:16px;height:16px;flex:none;background:var(--color-fg-tertiary);-webkit-mask:var(--ic-map-pin) center/contain no-repeat;mask:var(--ic-map-pin) center/contain no-repeat}
.r-tags{margin-top:12px}
'''
def tagline(cls, fmt=lambda t: f'#{t}'):
    return f'<ul class="r-tags {cls}" aria-label="해시태그">' + ''.join(f'<li>{fmt(t)}</li>' for t in TAGS) + '</ul>'

T = {
    't0': ('지금 · 13px', '', tagline(''), '지금 앱. 13px 보통 굵기, 진한 하늘색'),
    't1': ('14px', '.r-tags{font-size:14px;gap:4px 12px}', tagline(''), '한 단계만 키움. 줄 수는 그대로 1~2줄'),
    't2': ('15px', '.r-tags{font-size:15px;gap:4px 14px}', tagline(''), '지역 · 성별(14px)보다 살짝 커서 눈에 먼저 들어옴'),
    't3': ('14px · 중간 굵기', '.r-tags{font-size:14px;font-weight:500;gap:4px 12px}', tagline(''), '크기는 14로 두고 500 굵기로 또렷하게'),
    't4': ('# 옅게', '.r-tags{font-size:14px;gap:4px 12px;color:var(--color-fg-primary)}.r-tags em{font-style:normal;color:var(--sky-400);margin-right:1px}', tagline('', lambda t: f'<em>#</em>{t}'), '#만 하늘색으로 옅게, 단어는 본문색. 글자가 차분하고 읽기 쉬움'),
    't5': ('바탕체 15px', '.r-tags{font:400 15px/1.6 var(--font-serif);gap:2px 14px}', tagline(''), '이름과 같은 고운바탕. 손글씨 노트 느낌'),
    't6': ('색연필 밑줄', '.r-tags{font-size:14px;gap:6px 14px}.r-tags li{position:relative}.r-tags .ul{position:absolute;left:-2px;right:-2px;bottom:-3px;width:calc(100% + 4px);height:6px;fill:none;stroke:var(--sky-300);stroke-width:2.4;stroke-linecap:round;opacity:.7}', tagline('', lambda t: f'#{t}{UL}'), '14px에 하늘색 색연필 밑줄. 아래 생활 타일과 재료가 이어짐'),
    't7': ('옅은 칩', '.r-tags{gap:8px}.r-tags li{height:28px;padding:0 10px;border-radius:14px;background:var(--color-bg-notice);font-size:13px;font-weight:500;line-height:28px}', tagline(''), '글자는 13 그대로, 옅은 하늘 바탕을 깔아 크게 보이게. 해시태그 화면의 칩과는 다른 모양'),
}

if __name__ == '__main__':
    for k, (name, css, line, _) in T.items():
        body = f'<h2 class="r-name">{NAME}</h2>{META}{line}{KEY}{LIFE}{FILTER}'
        (HERE / f'{k}.html').write_text(page(f'해시태그 글자 {name}', body, COMMON + css, HATCH_JS))
    print('built', ', '.join(T))
