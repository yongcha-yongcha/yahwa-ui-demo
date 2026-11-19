(async () => {
const M = window.__M || 'letters';
const w = ms => new Promise(r => setTimeout(r, ms));
const css = `
#heart-list{display:block!important;grid-template-columns:none!important}
.hl-list{display:grid;width:100%}
.hl-row{display:flex;align-items:center;gap:12px;width:100%;min-height:84px;padding:16px 0;border:0;border-bottom:1px solid var(--color-border-default);background:none;text-align:left;font:inherit;color:inherit}
.hl-ph{position:relative;width:48px;height:48px;border-radius:50%;background-size:cover;background-position:50% 35%;flex:none}
.hl-me{position:absolute;right:-4px;bottom:-4px;width:22px;height:22px;border-radius:50%;background-size:cover;background-position:50% 30%;box-shadow:0 0 0 2px var(--color-bg-page,#fff)}
.hl-copy{flex:1;min-width:0;display:grid;gap:6px}
.hl-name{display:flex;align-items:baseline;gap:6px;font:600 15px/21px var(--font-sans);color:var(--color-fg-primary)}
.hl-name small{font:400 12px/1 var(--font-sans);color:var(--color-fg-muted)}
.hl-line{display:block;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font:400 13px/19px var(--font-sans);color:var(--cool-neutral-700)}
.hl-line.is-new{font-weight:600;color:var(--cool-neutral-900)}
.hl-line.is-mine{color:var(--cool-neutral-500)}
.hl-line.is-love{color:var(--color-fg-love)}
.hl-line.is-love b{font-weight:700}
.hl-side{flex:none;align-self:stretch;display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;padding:3px 0 6px;min-width:28px}
.hl-d{font:400 12px/1 var(--font-sans);color:var(--color-fg-muted);font-variant-numeric:tabular-nums}
.hl-dot{width:6px;height:6px;border-radius:50%;background:var(--color-fg-love)}
.hl-row.is-off .hl-ph{filter:grayscale(1) blur(1.5px);opacity:.55}
.hl-row.is-off .hl-name,.hl-row.is-off .hl-name small,.hl-row.is-off .hl-line{color:var(--cool-neutral-400)}
.hl-pill{flex:none;height:32px;padding:0 14px;border:0;border-radius:16px;display:inline-flex;align-items:center;font:600 13px/1 var(--font-sans);background:var(--color-bg-surface,#fff);color:var(--cool-neutral-900);box-shadow:inset 0 0 0 1px var(--cool-neutral-300)}
.hl-icon{flex:none;width:44px;height:44px;margin-right:-10px;display:grid;place-items:center;color:var(--cool-neutral-800)}
.hl-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.hl-pill.is-line{background:var(--btn-tertiary-bg);color:var(--btn-tertiary-fg);box-shadow:inset 0 0 0 1px var(--btn-tertiary-line)}
`;

const TV = window.__TAB || 'T2';
const tabCss = {
 T1: `.heart-tabs{display:flex!important;flex-direction:row!important;grid-template-columns:none!important;justify-content:flex-start;gap:20px!important;border-bottom:0!important}
.heart-tabs button{flex:none!important;width:auto!important;min-width:44px;padding:10px 0!important;color:var(--cool-neutral-400)!important;font:600 15px/1.4 var(--font-sans)!important}
.heart-tabs button[aria-selected="true"]{color:var(--cool-neutral-900)!important}
.heart-tabs button::after{display:none!important}
.heart-tabs button[aria-selected="true"]::after{display:block!important;left:0!important;right:0!important;bottom:4px!important;height:2px!important;background:var(--cool-neutral-900)!important}
.heart-tabs small{display:none!important}
.heart-tabs .mk-tdot{position:absolute;top:8px;right:-8px;width:5px;height:5px;border-radius:50%;background:var(--color-fg-love)}`,
 T2: `.heart-tabs button{color:var(--cool-neutral-500)!important;font-weight:500!important}
.heart-tabs button[aria-selected="true"]{color:var(--cool-neutral-900)!important;font-weight:700!important}
.heart-tabs button[aria-selected="true"]::after{background:var(--cool-neutral-900)!important}
.heart-tabs small,.heart-tabs button[aria-selected="true"] small{background:transparent!important;color:var(--cool-neutral-400)!important;min-width:0!important;padding:0!important}
.heart-tabs button[aria-selected="true"] small{color:var(--cool-neutral-600)!important}`,
 T3: `.heart-tabs{display:grid!important;grid-template-columns:repeat(3,1fr);gap:4px!important;padding:4px!important;border:0!important;border-radius:12px!important;background:var(--cool-neutral-100)!important}
.heart-tabs button{min-height:36px!important;padding:0!important;border-radius:9px!important;color:var(--cool-neutral-500)!important;font:500 13px/1 var(--font-sans)!important}
.heart-tabs button[aria-selected="true"]{background:var(--color-bg-surface,#fff)!important;color:var(--cool-neutral-900)!important;font-weight:600!important;box-shadow:0 1px 2px rgba(26,33,38,.08)!important}
.heart-tabs button::after{display:none!important}
.heart-tabs small{display:none!important}`,
 T4: `.heart-tabs{display:flex!important;flex-direction:row!important;grid-template-columns:none!important;justify-content:flex-start;gap:8px!important;border-bottom:0!important}
.heart-tabs button{flex:none!important;width:auto!important;min-height:36px!important;padding:0 14px!important;border-radius:18px!important;background:var(--cool-neutral-50)!important;color:var(--cool-neutral-600)!important;font:500 13px/1 var(--font-sans)!important}
.heart-tabs button[aria-selected="true"]{background:var(--cool-neutral-900)!important;color:#fff!important;font-weight:600!important}
.heart-tabs button::after{display:none!important}
.heart-tabs small{background:transparent!important;color:inherit!important;opacity:.6;min-width:0!important;padding:0!important}`
}[TV];
const s = document.createElement('style'); s.textContent = css + tabCss; document.head.appendChild(s);
const P = {
  bom: '/profile-sample-5.png', slow: '/portraits-single-v2/person-02-2.jpg', summer: '/portraits-single-v2/person-03-3.jpg', wave: '/portraits-single-v2/person-04-4.jpg',
  sky: '/portraits-single-v2/person-05-3.jpg', warm: '/portraits-single-v2/person-06-2.jpg', moon: '/portraits-single-v2/person-07-3.jpg', blue: '/portraits-single-v2/person-08-4.jpg', me: '/profile-sample-1.png'
};
const row = o => '<div class="hl-row' + (o.off ? ' is-off' : '') + '"><span class="hl-ph" style="background-image:url(\'' + o.img + '\')">' + (o.me ? '<span class="hl-me" style="background-image:url(\'' + P.me + '\')"></span>' : '') + '</span>'
  + '<span class="hl-copy"><span class="hl-name">' + o.n + (o.age ? '<small>' + o.age + '</small>' : '') + '</span><span class="hl-line ' + (o.cls || '') + '">' + o.line + '</span></span>'
  + (o.icon ? '<span class="hl-icon" aria-label="편지 쓰기"><svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/></svg></span>' : o.pill ? '<span class="hl-pill' + (o.pillLine ? ' is-line' : '') + '">' + o.pill + '</span>' : (o.d || o.dot) ? '<span class="hl-side"><span class="hl-d">' + (o.d || '') + '</span>' + (o.dot ? '<i class="hl-dot" aria-label="새 소식"></i>' : '<i></i>') + '</span>' : '')
  + '</div>';
let target, html;
if (M === 'letters') {
  target = document.getElementById('chat-list');
  html = [
    { n: '봄빛', img: P.bom, line: '프로필 속 산책 이야기가 마음에 남았어요. 함께 이야기 나눠보고 싶어요.', cls: 'is-new', d: 'D-3', dot: 1 },
    { n: '느린오후', img: P.slow, line: '좋아하는 전시 이야기를 더 들려주실래요?', cls: 'is-new', d: 'D-3', dot: 1 },
    { n: '하늘조각', img: P.sky, line: '산책 이야기가 마음에 남았어요. 주말엔 어디를 걸으세요?', cls: 'is-mine', d: 'D-3' },
    { n: '포근한날', img: P.warm, line: '커피를 좋아하신다는 이야기를 보고 편지를 써요.', cls: 'is-mine', d: 'D-2' },
    { n: '푸른밤', img: P.blue, line: '<b>서로 연결됨</b> · 연락처 공개', cls: 'is-love', d: 'D-7' }
  ].map(row).join('');
} else {
  show('heartbox'); await w(500);
  const tab = M === 'sent' ? 'sent' : M.startsWith('mutual') ? 'mutual' : 'received';
  document.querySelector('[data-heart-tab=' + tab + ']').click(); await w(400);
  target = document.getElementById('heart-list');
  if (TV === 'T1') { document.querySelectorAll('.heart-tabs button').forEach(b => { const sp = b.querySelector('span'); if (sp) sp.textContent = { sent: '보낸', received: '받은', mutual: '서로' }[b.dataset.heartTab]; if (b.dataset.heartTab === 'received') { const d = document.createElement('i'); d.className = 'mk-tdot'; sp.style.position = 'relative'; sp.appendChild(d); } }); }
  if (M === 'recv') html = [
    { n: '봄빛', age: '26세', img: P.bom, line: '호감을 받았어요', cls: 'is-new', d: 'D-6', dot: 1 },
    { n: '느린오후', age: '29세', img: P.slow, line: '호감을 받았어요', cls: 'is-new', d: 'D-5', dot: 1 },
    { n: '여름산책', age: '27세', img: P.summer, line: '호감을 받았어요', d: 'D-4' },
    { n: '작은파도', age: '30세', img: P.wave, line: '받은 지 3일이 지났어요', off: 1, pill: '다시 보기' }
  ].map(row).join('');
  else if (M === 'sent') html = [
    { n: '하늘조각', age: '25세', img: P.sky, line: '호감을 보냈어요', cls: 'is-mine', d: 'D-5' },
    { n: '포근한날', age: '28세', img: P.warm, line: '호감을 보냈어요', cls: 'is-mine', d: 'D-2' }
  ].map(row).join('');
  else {
    const base = [{ n: '달빛편지', age: '31세', img: P.moon }, { n: '푸른밤', age: '26세', img: P.blue }];
    html = base.map(b => row(Object.assign({}, b, { line: '<b>서로 호감</b>', cls: 'is-love', me: 1, icon: 1 }))).join('');
  }
}
target.innerHTML = '<div class="hl-list">' + html + '</div>';
})();
