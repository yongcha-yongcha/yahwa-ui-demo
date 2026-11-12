# 소개 미리보기 1차 시안 생성기. 공통 화면 틀(사진 유지)에 시안별 '이름 아래 영역'만 바꿔 끼운다.
import pathlib
HERE = pathlib.Path(__file__).parent

# 데모 데이터 (앱의 '가득' 프리셋과 같음)
NAME, REGION, GENDER = '하늘', '서울', '여성'
TAGS = ['산책메이트', '카페탐방러', '다정한사람', '에겐녀', '필름감성']
FACTS = {'하는 일': '직장인', '키': '168cm', '성격': 'INFP', '학력': '대학교 졸업', '종교': '무교', '흡연': '비흡연', '음주': '가끔'}

# 손그림 선 아이콘 (앱의 정보 아이콘과 같은 결)
P = {
    '하는 일': 'M4 8h16v11H4ZM9 8V5h6v3M4 13h16',
    '키': 'M7 3h10v18H7ZM7 7h4M7 11h6M7 15h4',
    '성격': 'M4 5h16v12H9l-5 4ZM8 9h8M8 13h5',
    '학력': 'm2 8 10-5 10 5-10 5ZM6 11v6q6 5 12 0v-6',
    '종교': 'M12 3v18M6 9h12',
    '흡연': 'M3 13h18v5H3ZM16 13v5M7 3q-3 3 0 5M12 3q-3 3 0 5',
    '음주': 'M7 3h10v5a5 5 0 0 1-10 0ZM12 13v8M8 21h8',
    '지역': 'M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11ZM12 8.5v3',
}
def svg(k, cls='fi'):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="{P[k]}"/></svg>'

HEAD = '''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<link rel="stylesheet" href="tokens.css">
<style>
*{box-sizing:border-box}
html,body{height:100%;margin:0}
body{background:var(--color-bg-page);color:var(--color-fg-primary);font:400 14px/1.6 var(--font-sans);-webkit-font-smoothing:antialiased}
button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.ic{display:inline-block;flex:none;width:var(--s,20px);height:var(--s,20px);background:currentColor;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}
.i-back{--m:var(--ic-chevron-left-large);--s:24px}.i-next{--m:var(--ic-chevron-right);--s:20px}.i-down{--m:var(--ic-chevron-down);--s:16px}
.app{position:relative;height:100%;max-width:430px;margin:0 auto;display:flex;flex-direction:column;overflow:hidden;background:var(--color-bg-page)}
.top{flex:none;height:52px;padding:0 20px;display:flex;align-items:center;justify-content:space-between}
.back{width:44px;height:44px;margin-left:-10px;border:0;background:none;display:grid;place-items:center}
.back .ic{transform:translateX(-8px)}
.cnt{font-size:12px;color:var(--color-fg-accent-strong);font-variant-numeric:tabular-nums}
.gauge{flex:none;height:3px;margin:0 20px;border-radius:3px;background:var(--color-bg-notice);overflow:hidden}
.gauge i{display:block;width:100%;height:100%;background:var(--color-bg-button-primary)}
.body{flex:1;min-height:0;overflow-y:auto;padding:28px 20px 32px;scrollbar-width:none}
.body::-webkit-scrollbar{display:none}
h1{margin:0;font:400 28px/1.45 var(--font-serif);letter-spacing:-.5px}
.lead{margin:12px 0 0;font-size:13px;line-height:1.7;color:var(--color-fg-tertiary)}
.lead small{display:block;font-size:11px;color:var(--color-fg-subtle)}
.photo{position:relative;margin-top:28px;height:330px;border-radius:90px 90px 18px 18px;overflow:hidden;background:var(--color-bg-notice)}
.photo img{width:100%;height:100%;object-fit:cover;display:block}
.photo .arrow{position:absolute;right:8px;top:50%;margin-top:-22px;width:44px;height:44px;border:0;border-radius:50%;background:color-mix(in srgb,var(--white) 82%,transparent);display:grid;place-items:center;color:var(--color-fg-primary)}
.photo .count{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);padding:2px 8px;border-radius:10px;background:color-mix(in srgb,var(--cool-neutral-900) 45%,transparent);color:var(--white);font-size:11px;font-variant-numeric:tabular-nums}
.me{scroll-margin-top:96px}
.qa{margin-top:40px}
.qa h3{margin:0 0 8px;font:400 19px/1.7 var(--font-serif);color:var(--color-fg-accent-strong)}
.qa p{margin:0;font-size:14px;line-height:2;color:var(--color-fg-secondary)}
.bottom{flex:none;padding:12px 20px calc(20px + env(safe-area-inset-bottom,0px));background:var(--color-bg-page);box-shadow:0 -1px 0 var(--color-border-default)}
.cta{width:100%;height:52px;border:0;border-radius:14px;background:var(--color-bg-button-primary);color:var(--white);font-size:15px;font-weight:600}
.fi{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
__EXTRA__
</style></head><body><div class="app">
<div class="top"><button type="button" class="back" aria-label="이전 화면"><i class="ic i-back" aria-hidden="true"></i></button><span class="cnt">5 / 5</span></div>
<div class="gauge"><i></i></div>
<div class="body" id="body">
<h1>당신의 첫 소개,<br>이렇게 보여요.</h1>
<p class="lead">상대방에게 보여줄 첫 소개예요.<small>가상 정보와 예시 사진을 사용한 시연용 프로필 · 사진을 옆으로 넘겨보세요</small></p>
<div class="photo"><img src="img/p1.jpg" alt="내 대표 사진"><button type="button" class="arrow" aria-label="다음 사진"><i class="ic i-next" aria-hidden="true"></i></button><span class="count">1 / 5</span></div>
<section class="me" id="me" aria-label="나의 정보">
__BODY__
</section>
<section class="qa"><h3>“간단한 자기소개를 들려주세요”</h3><p>서울에서 일하는 하늘이에요. 주말에는 동네 카페를 찾거나 산책하며 여유로운 시간을 보내는 걸 좋아해요.</p></section>
</div>
<div class="bottom"><button type="button" class="cta">이 소개로 완성하기</button></div>
</div>
<script>
/* 비교 페이지에서 #me로 열면 이름 영역부터 보이게 */
if(location.hash==='#me'){const b=document.getElementById('body'),m=document.getElementById('me');requestAnimationFrame(()=>{b.scrollTop=m.offsetTop-b.offsetTop-80;});}
__SCRIPT__
</script></body></html>
'''

def page(title, body, extra, script=''):
    return HEAD.replace('__TITLE__', title).replace('__BODY__', body).replace('__EXTRA__', extra).replace('__SCRIPT__', script)

# ─────────────────────────────────────────────
# A. 잘 정리된 한 장 (관습을 따르는 안전안)
A_CSS = '''
.a-name{margin:28px 0 0;font:400 30px/1.3 var(--font-serif);letter-spacing:-.5px}
.a-meta{display:flex;align-items:center;gap:4px;margin-top:8px;font-size:14px;color:var(--color-fg-secondary)}
.a-meta .fi{width:16px;height:16px;color:var(--color-fg-tertiary)}
.a-meta i{width:2px;height:2px;margin:0 4px;border-radius:50%;background:var(--color-fg-subtle)}
.a-tags{display:flex;flex-wrap:wrap;gap:4px 12px;margin:12px 0 0;padding:0;list-style:none;font-size:13px;color:var(--color-fg-accent-strong)}
.a-sec{margin-top:32px}
.a-sec h2{margin:0 0 12px;font-size:12px;font-weight:500;color:var(--color-fg-tertiary)}
.a-key{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.a-key div{padding:16px 12px;border-radius:16px;background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-default);display:flex;flex-direction:column;gap:4px}
.a-key .fi{color:var(--color-fg-accent);margin-bottom:4px}
.a-key b{font-size:16px;font-weight:600;line-height:1.4}
.a-key small{font-size:11px;color:var(--color-fg-subtle)}
.a-life{display:flex;flex-wrap:wrap;gap:8px}
.a-life span{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px 0 10px;border-radius:18px;background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-default);font-size:13px;color:var(--color-fg-secondary)}
.a-life .fi{width:16px;height:16px;color:var(--color-fg-tertiary)}
'''
A_BODY = f'''<h2 class="a-name">{NAME}</h2>
<p class="a-meta">{svg('지역')}{REGION}<i></i>{GENDER}</p>
<ul class="a-tags" aria-label="해시태그">{''.join(f'<li>#{t}</li>' for t in TAGS)}</ul>
<div class="a-sec"><h2>나에 대해</h2><div class="a-key">{''.join(f'<div>{svg(k)}<b>{FACTS[k]}</b><small>{k}</small></div>' for k in ['하는 일','키','성격'])}</div></div>
<div class="a-sec"><h2>생활</h2><div class="a-life">{''.join(f'<span>{svg(k)}{v}</span>' for k,v in [('흡연','비흡연'),('음주','술은 가끔'),('종교','무교'),('학력','대학교 졸업')])}</div></div>'''

# ─────────────────────────────────────────────
# B. 필름 한 롤 (컨택트 시트 · 프레임 번호)
B_CSS = '''
.b-head{display:flex;align-items:baseline;gap:12px;margin-top:28px}
.b-name{margin:0;font:400 30px/1.3 var(--font-serif);letter-spacing:-.5px}
.b-stamp{font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:1px;color:var(--gold-600)}
.b-meta{margin:8px 0 0;font-size:14px;color:var(--color-fg-secondary)}
.b-tags{display:flex;flex-wrap:wrap;gap:4px 12px;margin:12px 0 0;padding:0;list-style:none;font-size:13px;color:var(--color-fg-accent-strong)}
.b-roll{margin-top:28px;padding:14px 12px;border-radius:6px;background:var(--gold-50);position:relative;box-shadow:inset 0 0 0 1px var(--gold-200)}
.b-roll::before,.b-roll::after{content:"";position:absolute;left:12px;right:12px;height:4px;background:radial-gradient(circle,var(--gold-200) 0 1.6px,transparent 2px) 0 0/12px 4px repeat-x}
.b-roll::before{top:5px}.b-roll::after{bottom:5px}
.b-cap{display:flex;justify-content:space-between;margin:4px 2px 8px;font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:1px;color:var(--gold-600)}
.b-frames{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.b-frames.sm{grid-template-columns:repeat(2,1fr);margin-top:6px}
.b-f{position:relative;padding:12px 10px 10px;border-radius:4px;background:var(--color-bg-surface);display:flex;flex-direction:column;gap:2px;min-height:76px}
.b-f em{position:absolute;right:8px;top:8px;font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;font-style:normal;color:var(--gold-500)}
.b-f small{font-size:11px;color:var(--color-fg-tertiary)}
.b-f b{margin-top:auto;font-size:16px;font-weight:600;line-height:1.3}
.b-frames.sm .b-f{min-height:0;flex-direction:row;align-items:center;gap:8px;padding:10px}
.b-frames.sm .b-f b{margin:0;font-size:14px;font-weight:500}
.b-frames.sm .b-f em{position:static;order:-1}
.b-frames.sm .b-f small{order:0}
.b-frames.sm .b-f b{order:1;margin-left:auto}
'''
def bf(i, k, v):
    return f'<div class="b-f"><em>{i:02d}</em><small>{k}</small><b>{v}</b></div>'
B_BODY = f'''<div class="b-head"><h2 class="b-name">{NAME}</h2><span class="b-stamp">SEOUL '26</span></div>
<p class="b-meta">{REGION}에서 지내요 · {GENDER}</p>
<ul class="b-tags" aria-label="해시태그">{''.join(f'<li>#{t}</li>' for t in TAGS)}</ul>
<div class="b-roll" role="group" aria-label="나의 정보">
<div class="b-cap"><span>FRAME OF ME</span><span>01—07</span></div>
<div class="b-frames">{bf(1,'하는 일','직장인')}{bf(2,'키','168cm')}{bf(3,'성격','INFP')}</div>
<div class="b-frames sm">{bf(4,'흡연','비흡연')}{bf(5,'음주','가끔')}{bf(6,'종교','무교')}{bf(7,'학력','대학교 졸업')}</div>
</div>'''

# ─────────────────────────────────────────────
# C. 엔드 크레딧 (가운데 정렬 · 관습을 깬 안)
C_CSS = '''
.c{text-align:center;padding-top:36px}
.c-role{margin:0;font-size:11px;letter-spacing:3px;color:var(--color-fg-subtle)}
.c-name{margin:8px 0 0;font:400 34px/1.25 var(--font-serif);letter-spacing:2px}
.c-meta{margin:8px 0 0;font-size:13px;color:var(--color-fg-secondary);letter-spacing:.5px}
.c-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:0 14px;max-width:320px;margin:16px auto 0;font:400 14px/1.9 var(--font-serif);color:var(--color-fg-accent-strong)}
.c-tags span{white-space:nowrap}
.c-mark{display:block;width:40px;height:12px;margin:28px auto;color:var(--color-border-accent-soft)}
.c-roll{display:grid;grid-template-columns:1fr 1fr;column-gap:20px;row-gap:12px;margin:0;align-items:baseline}
.c-roll dt{text-align:right;font-size:11px;letter-spacing:2px;color:var(--color-fg-tertiary)}
.c-roll dd{margin:0;text-align:left;font:400 16px/1.4 var(--font-serif);color:var(--color-fg-primary)}
.c-sub{margin:28px 0 12px;font-size:11px;letter-spacing:3px;color:var(--color-fg-subtle)}
.c-roll.sm dd{font-size:14px;color:var(--color-fg-secondary)}
'''
WAVE = '<svg class="c-mark" viewBox="0 0 40 12" aria-hidden="true"><path d="M2 6q4.5-5 9 0t9 0 9 0 9 0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
C_BODY = f'''<div class="c">
<p class="c-role">STARRING</p>
<h2 class="c-name">{NAME}</h2>
<p class="c-meta">{REGION} · {GENDER}</p>
<p class="c-tags" aria-label="해시태그">{''.join(f'<span>#{t}</span>' for t in TAGS)}</p>
{WAVE}
<dl class="c-roll">{''.join(f'<dt>{k}</dt><dd>{FACTS[k]}</dd>' for k in ['하는 일','키','성격'])}</dl>
<p class="c-sub">EVERYDAY</p>
<dl class="c-roll sm">{''.join(f'<dt>{k}</dt><dd>{v}</dd>' for k,v in [('흡연','비흡연'),('음주','가끔'),('종교','무교'),('학력','대학교 졸업')])}</dl>
</div>'''

# ─────────────────────────────────────────────
# D. 건네는 쪽지 (문장형 · 테이프 해시태그)
D_CSS = '''
.d-name{margin:28px 0 0;font:400 30px/1.3 var(--font-serif);letter-spacing:-.5px}
.d-meta{display:flex;align-items:center;gap:4px;margin-top:8px;font-size:14px;color:var(--color-fg-secondary)}
.d-meta .fi{width:16px;height:16px;color:var(--color-fg-tertiary)}
.d-meta i{width:2px;height:2px;margin:0 4px;border-radius:50%;background:var(--color-fg-subtle)}
.d-note{position:relative;margin-top:32px;padding:28px 20px 16px 28px;border-radius:4px 4px 16px 4px;background:var(--color-bg-surface);box-shadow:var(--story-note-shadow);
 background-image:linear-gradient(90deg,transparent 15px,var(--story-note-margin) 15px 16px,transparent 16px),repeating-linear-gradient(transparent 0 27px,var(--story-note-rule) 27px 28px);background-position:0 0,0 19px}
.d-tapes{display:flex;flex-wrap:wrap;gap:6px 8px;margin:-40px -4px 12px -12px}
.d-tape{padding:2px 10px;font-size:12px;line-height:20px;font-weight:500;transform:rotate(var(--r))}
.d-tape:nth-child(4n+1){background:var(--story-tape-1);color:var(--story-tape-1-fg);--r:-2deg}
.d-tape:nth-child(4n+2){background:var(--story-tape-2);color:var(--story-tape-2-fg);--r:1.5deg}
.d-tape:nth-child(4n+3){background:var(--story-tape-3);color:var(--story-tape-3-fg);--r:-1deg}
.d-tape:nth-child(4n+4){background:var(--story-tape-4);color:var(--story-tape-4-fg);--r:2deg}
.d-say{word-break:keep-all;margin:8px 0 0;font:400 15px/28px var(--font-serif);color:var(--color-fg-primary)}
.d-say mark{background:linear-gradient(transparent 58%,var(--story-tape-1) 58% 92%,transparent 92%);color:inherit;padding:0 2px}
.d-say mark.r{background-image:linear-gradient(transparent 58%,var(--story-tape-2) 58% 92%,transparent 92%)}
.d-say mark.g{background-image:linear-gradient(transparent 58%,var(--story-tape-3) 58% 92%,transparent 92%)}
.d-sign{margin:0;text-align:right;font:400 13px/28px var(--font-serif);color:var(--color-fg-tertiary)}
'''
D_BODY = f'''<h2 class="d-name">{NAME}</h2>
<p class="d-meta">{svg('지역')}{REGION}<i></i>{GENDER}</p>
<div class="d-note">
<div class="d-tapes" aria-label="해시태그">{''.join(f'<span class="d-tape">#{t}</span>' for t in TAGS)}</div>
<p class="d-say">회사에서 일하는 <mark>INFP</mark>예요. 키는 <mark class="r">168cm</mark>이고, 술은 <mark class="g">가끔</mark> 마시고 담배는 <mark>피우지 않아요</mark>. 종교는 <mark class="r">없고</mark>, <mark class="g">대학교를 졸업</mark>했어요.</p>
<p class="d-sign">— {NAME} 씀</p>
</div>'''

PAGES = {
    'a': ('소개 미리보기 시안 A', A_BODY, A_CSS),
    'b': ('소개 미리보기 시안 B', B_BODY, B_CSS),
    'c': ('소개 미리보기 시안 C', C_BODY, C_CSS),
    'd': ('소개 미리보기 시안 D', D_BODY, D_CSS),
}
if __name__ == '__main__':
    for k, (t, b, c) in PAGES.items():
        (HERE / f'{k}.html').write_text(page(t, b, c))
    print('built', ', '.join(PAGES))
