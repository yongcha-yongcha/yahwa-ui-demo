(() => {
const css = `
#chat-list .mk-row{min-height:84px}
#chat-list .mk-row .chat-list-copy{display:grid;gap:6px;min-width:0}
#chat-list .mk-name{display:flex;align-items:center;gap:6px;font:600 15px/21px var(--font-sans);color:var(--color-fg-primary)}
#chat-list .mk-dot{width:6px;height:6px;border-radius:50%;background:var(--color-fg-love);flex:none}
#chat-list .mk-line{display:block;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font:400 13px/19px var(--font-sans);color:var(--color-fg-muted)}
#chat-list .mk-line b{font-weight:600;color:var(--cool-neutral-800)}
#chat-list .mk-line .st{color:var(--color-fg-muted)}
#chat-list .mk-line .st.is-read{font-weight:600;color:var(--cool-neutral-800)}
#chat-list .mk-line.is-love,#chat-list .mk-line.is-love b{color:var(--color-fg-love)}
#chat-list .mk-row .fx-badge{align-self:flex-start;margin-top:4px}
`;
const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
const rows = [
  { n: '봄빛', img: '/profile-sample-5.png', dot: 1, line: '<b>받은 편지</b> · 프로필 속 산책 이야기가 마음에 남았어요.', d: 'D-3' },
  { n: '느린오후', img: '/portraits-single-v2/person-02-2.jpg', line: '<b>받은 편지</b> · 좋아하는 전시 이야기를 더 들려주실래요?', d: 'D-3' },
  { n: '하늘조각', img: '/portraits-single-v2/person-05-3.jpg', line: '<b>보낸 편지</b> · <span class="st">안 읽음</span> · 산책 이야기가 마음에 남았어요.', d: 'D-3' },
  { n: '포근한날', img: '/portraits-single-v2/person-06-2.jpg', line: '<b>보낸 편지</b> · <span class="st is-read">읽음</span> · 커피를 좋아하신다는 이야기를 보고…', d: 'D-2' },
  { n: '푸른밤', img: '/portraits-single-v2/person-08-4.jpg', line: '<b>서로 연결됨</b> · 연락처 공개', love: 1, d: 'D-7' }
];
document.getElementById('chat-list').innerHTML = rows.map(r => '<button class="chat-list-row mk-row' + (r.dot ? ' is-unread' : '') + '"><span class="fx-portrait" style="background-image:url(\'' + r.img + '\');background-size:cover;background-position:50% 40%"></span><span class="chat-list-copy"><span class="mk-name">' + r.n + (r.dot ? '<i class="mk-dot" aria-label="안 읽음"></i>' : '') + '</span><span class="mk-line' + (r.love ? ' is-love' : '') + '">' + r.line + '</span></span><span class="fx-badge">' + r.d + '</span></button>').join('');
})();
