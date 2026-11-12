# 자기소개 답변 사이 구분선 개선 시안 생성기. 위쪽은 지금 앱(A1 + H9 + 해시태그 14px), 답변 영역만 바꾼다.
from build import HERE, page, NAME
from build4 import HATCH_JS, FILTER
from build5 import COMMON, META, KEY, LIFE, tagline

QA = [
    ('간단한 자기소개를 들려주세요', '서울에서 일하는 하늘이에요. 주말에는 동네 카페를 찾거나 산책하며 여유로운 시간을 보내는 걸 좋아해요.'),
    ('이런 사람에게 마음이 가요', '작은 일에도 다정하게 말하고, 서로의 시간을 존중하는 사람에게 마음이 가요. 함께 걷다가 오늘 있었던 사소한 이야기를 나눌 수 있으면 좋겠어요.'),
    ('연인이 생기면 함께 하고 싶은 일은?', '날씨 좋은 날 함께 도시락을 준비해서 한강으로 소풍을 가고 싶어요. 좋아하는 음악을 나누며 천천히 걸어도 좋겠어요.'),
]
PHOTOS = ['img/p1.jpg', 'img/p2.jpg']
TOP = f'<h2 class="r-name">{NAME}</h2>{META}' + tagline('') + KEY + LIFE + FILTER
BASE = COMMON + '''
.r-tags{font-size:14px;gap:4px 12px}
.qa{display:none}
.ans{margin-top:8px}
.q h3{margin:0;font:400 19px/1.8 var(--font-serif);color:var(--color-fg-accent-strong);word-break:keep-all}
.q p{margin:8px 0 0;font-size:14px;line-height:2;color:var(--color-fg-secondary);word-break:keep-all}
.ph{margin:24px 0 28px}
.ph img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px}
'''
WAVE = '<svg class="wv" viewBox="0 0 40 10" aria-hidden="true"><path d="M2 5q4.5-4 9 0t9 0 9 0 9 0"/></svg>'

def answers(q_html, between_photo=True):
    out = []
    for i, (q, a) in enumerate(QA):
        out.append(q_html(i, q, a))
        if between_photo and i < len(PHOTOS):
            out.append(f'<figure class="ph"><img src="{PHOTOS[i]}" alt="나의 일상 사진 {i+1}"></figure>')
    return '<div class="ans" id="qa">' + ''.join(out) + '</div>'

plain = lambda i, q, a: f'<section class="q"><h3>“{q}”</h3><p>{a}</p></section>'
S = {
    's0': ('지금', '.q{margin-top:30px;padding-top:22px;border-top:1px solid var(--color-border-control)}.ph+.q{margin-top:0}', answers(plain),
           '질문마다 위에 회색 선. 사진 바로 뒤에도 선이 와서 선이 두 번씩 끊어 보여요'),
    's1': ('여백만', '.q{margin-top:48px}.ph{margin:32px 0 40px}.ph+.q{margin-top:0}.ans>.q:first-child{margin-top:48px}', answers(plain),
           '선을 모두 빼고 간격을 넓힘(질문 앞 48). 고운바탕 하늘색 질문이 그 자체로 구역 제목 역할'),
    's2': ('작은 번호', '.q{margin-top:44px}.ph{margin:28px 0 36px}.ph+.q{margin-top:0}.q .n{display:block;margin-bottom:4px;font:500 11px/16px var(--font-sans);letter-spacing:2px;color:var(--sky-400)}',
           answers(lambda i, q, a: f'<section class="q"><span class="n">{i+1:02d} / {len(QA):02d}</span><h3>“{q}”</h3><p>{a}</p></section>'),
           '선 대신 질문 위에 작은 순서 번호. 몇 개 중 몇 번째인지 알려 주며 구역을 나눔'),
    's3': ('손그림 물결', '.q{margin-top:40px}.ph{margin:28px 0 32px}.ph+.q{margin-top:0}.wv{display:block;width:40px;height:10px;margin:0 0 16px;fill:none;stroke:var(--color-border-accent-soft);stroke-width:1.4;stroke-linecap:round}',
           answers(lambda i, q, a: f'<section class="q">{WAVE}<h3>“{q}”</h3><p>{a}</p></section>'),
           '긴 회색 선 대신 질문 앞에 짧은 손그림 물결 하나. 선이 화면을 가로지르지 않아 덜 끊겨 보임'),
    's4': ('노트 카드', '.q{margin-top:16px;padding:20px;border-radius:20px;background:var(--color-bg-surface)}.ans>.q:first-child{margin-top:32px}.ph{margin:16px 0}.q h3{font-size:18px}',
           answers(plain),
           '질문과 답을 흰 카드 한 장에 담음. 위 세 칸 상자와 같은 재질이라 화면이 한 묶음으로 보임'),
    's5': ('테이프 질문', '.q{margin-top:44px}.ph{margin:28px 0 36px}.ph+.q{margin-top:0}.q .tp{display:inline-block;padding:2px 10px;font-size:12px;line-height:20px;font-weight:500;transform:rotate(-1.5deg)}.q:nth-of-type(3n+1) .tp{background:var(--story-tape-1);color:var(--story-tape-1-fg)}.q:nth-of-type(3n+2) .tp{background:var(--story-tape-2);color:var(--story-tape-2-fg);transform:rotate(1deg)}.q:nth-of-type(3n) .tp{background:var(--story-tape-3);color:var(--story-tape-3-fg)}.q h3{margin-top:8px}',
           answers(lambda i, q, a: f'<section class="q"><span class="tp">이야기 {i+1}</span><h3>“{q}”</h3><p>{a}</p></section>'),
           '질문 위에 자기소개 화면과 같은 마스킹 테이프 라벨. 쓰던 노트가 그대로 보이는 느낌'),
    's6': ('연필 옆줄', '.q{margin-top:44px}.ph{margin:28px 0 36px}.ph+.q{margin-top:0}.q p{position:relative;padding-left:16px}.q p::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:2px;border-radius:1px;background:var(--sky-200)}',
           answers(plain),
           '구역 선을 빼고, 답변 왼쪽에만 연한 하늘색 세로줄. 질문과 답이 한 덩어리로 묶여 보임'),
}
SCRIPT = HATCH_JS + "if(location.hash==='#qa'){const b=document.getElementById('body'),q=document.getElementById('qa');requestAnimationFrame(()=>{b.scrollTop=q.offsetTop-b.offsetTop-60;});}"

if __name__ == '__main__':
    for k, (name, css, ans, _) in S.items():
        (HERE / f'{k}.html').write_text(page(f'답변 구분 {name}', TOP + ans, BASE + css, SCRIPT))
    print('built', ', '.join(S))
