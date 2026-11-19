(() => {
const V = window.__V || 'A';
const LF = '<svg class="rw-lf" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18C3 7 12 3 21 3c0 10-5 17-13 16M4 22 16 9"/></svg>';
const CV = '<svg class="w-cv" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const css = `
#features .w-sub{margin:8px 0 0;font:400 13px/1.6 var(--font-sans);color:var(--color-fg-muted)}
.w-cv{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.w-bal{margin-top:20px;padding:20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.w-bal small{display:block;font:400 12px/1.4 var(--font-sans);color:var(--color-fg-muted)}
.w-bal .n{display:flex;align-items:center;gap:6px;margin-top:8px;font:600 28px/1 var(--font-sans);color:var(--color-fg-primary);letter-spacing:-.5px}
.w-bal .n span{font:500 15px/1 var(--font-sans);color:var(--color-fg-muted)}
.w-bal .n .rw-lf{width:20px;height:20px}
.w-link{display:flex;align-items:center;gap:2px;min-height:44px;font:500 13px/1 var(--font-sans);color:var(--color-fg-secondary)}
.w-link .w-cv{color:var(--color-fg-muted)}
.w-pack{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 0;box-shadow:0 -1px 0 var(--color-border-default)}
.w-pack:first-child{box-shadow:none}
.w-k{flex:1;min-width:0;display:grid;gap:4px}
.w-k b{display:flex;align-items:center;gap:6px;font:600 16px/1.4 var(--font-sans);color:var(--sky-600);letter-spacing:-.2px}
.w-k b .rw-lf{width:16px;height:16px}
.w-k b{white-space:nowrap}.w-k b>*{flex:none}
.w-k b span{font-weight:400;font-size:14px;color:var(--color-fg-secondary)}
.w-k small{display:flex;align-items:center;gap:6px;font:400 12px/1.4 var(--font-sans);color:var(--color-fg-muted)}
.w-tag{white-space:nowrap;margin-left:2px;font:600 11px/1 var(--font-sans);padding:4px 6px;border-radius:6px;background:var(--cool-neutral-50);color:var(--color-fg-secondary)}
.w-price{flex:none;min-width:88px;height:36px;padding:0 12px;border-radius:10px;display:grid;place-items:center;font:600 14px/1 var(--font-sans);color:var(--btn-tertiary-fg);background:var(--btn-tertiary-bg);box-shadow:inset 0 0 0 1px var(--btn-tertiary-line);font-variant-numeric:tabular-nums}
.w-price-t{flex:none;font:600 15px/1 var(--font-sans);color:var(--color-fg-primary);font-variant-numeric:tabular-nums}
.w-radio{flex:none;width:20px;height:20px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--cool-neutral-300)}
.w-pack.is-on .w-radio{box-shadow:inset 0 0 0 6px var(--cool-neutral-900)}
.w-sel .w-pack{padding:12px 16px;margin:0 -16px;border-radius:0}
.w-sel .w-pack.is-on{background:var(--cool-neutral-50)}
.w-cta{position:sticky;bottom:0;margin-top:16px}
#features .w-cta .btn{margin:0}
.w-more .rw-row{min-height:56px}
`;
const packs = [[90, 8900], [200, 16900], [500, 34900], [1300, 69900], [3000, 139000]];
const base = 8900 / 90;
const off = (n, p) => Math.round((1 - (p / n) / base) * 100);
const won = v => v.toLocaleString() + '원';
const tag = (n, p, i) => { const o = off(n, p); return i === 2 ? '<span class="w-tag">많이 골라요</span>' : o >= 5 && i === 4 ? '<span class="w-tag">가장 알뜰</span>' : ''; };
const sub = (n, p, i) => { const o = off(n, p); return '<small>1리프 약 ' + Math.round(p / n) + '원' + (o > 0 ? ' · ' + o + '% 알뜰' : '') + '</small>'; };

const balance = '<div class="mp-card w-bal"><div><small>보유 리프</small><div class="n">' + LF + '90<span>리프</span></div></div><span class="w-link">내역' + CV + '</span></div>';

const listA = '<div class="mp-card rw-list">' + packs.map(([n, p], i) => '<div class="w-pack"><span class="w-k"><b>' + LF + n.toLocaleString() + '<span>리프</span>' + tag(n, p, i) + '</b>' + sub(n, p, i) + '</span><span class="w-price">' + won(p) + '</span></div>').join('') + '</div>';

const listB = '<div class="mp-card rw-list w-sel">' + packs.map(([n, p], i) => '<div class="w-pack' + (i === 2 ? ' is-on' : '') + '"><span class="w-radio"></span><span class="w-k"><b>' + LF + n.toLocaleString() + '<span>리프</span>' + tag(n, p, i) + '</b>' + sub(n, p, i) + '</span><span class="w-price-t">' + won(p) + '</span></div>').join('') + '</div>';

const more = '<div class="rw-sh">리프 더 모으기</div><div class="mp-card rw-list w-more">'
  + '<div class="rw-row"><span class="rw-k"><b>무료 리프 받기</b></span><span class="rw-v">2 / 5' + CV + '</span></div>'
  + '<div class="rw-row"><span class="rw-k"><b>포인트를 리프로 바꾸기</b><small>150P당 1리프</small></span><span class="rw-v">10,300P' + CV + '</span></div></div>';

const note = '<p class="rw-note">시연용 충전이며 실제 결제되지 않아요.</p>';
let html = '<h1>리프 충전</h1>' + balance;
if (V === 'A') html += '<div class="rw-sh">충전<em>누르면 바로 충전돼요</em></div>' + listA + note + more;
else html += '<div class="rw-sh">충전할 리프</div>' + listB + note + '<div class="w-cta"><button type="button" class="btn btn-primary btn-M btn-block">34,900원 충전하기</button></div>' + more;

const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
const body = document.getElementById('fx-body');
body.innerHTML = html + '<div style="height:120px"></div>';
})();
