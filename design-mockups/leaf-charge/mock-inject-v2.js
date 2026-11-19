(() => {
const V0 = window.__V || 'list';const GRAY = /Gray$/.test(V0);const V = V0.replace('Gray','');
const LF = c => '<svg class="w-lf ' + c + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18C3 7 12 3 21 3c0 10-5 17-13 16M4 22 16 9"/></svg>';
const CV = '<svg class="w-cv" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const css = `
.w-lf{width:16px;height:16px;flex:none;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.w-lf.base{stroke:var(--cool-neutral-500)}
.w-lf.gain{stroke:var(--sky-500);width:14px;height:14px}
.w-lf.bal{stroke:var(--sky-500);width:20px;height:20px}
.w-cv{width:16px;height:16px;flex:none;fill:none;stroke:var(--color-fg-muted);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.w-bal{margin-top:20px;padding:0 4px 0 20px;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.w-bal small{font:400 13px/1.4 var(--font-sans);color:var(--color-fg-muted)}
.w-bal .n{display:flex;align-items:center;gap:6px;font:600 24px/1 var(--font-sans);color:var(--color-fg-primary);letter-spacing:-.4px;font-variant-numeric:tabular-nums}
.w-bal .l{display:flex;align-items:center;gap:12px}
.w-bal .w-hist{display:flex;align-items:center;min-width:44px;min-height:44px;justify-content:center}
.w-pack{display:flex;align-items:center;gap:8px;min-height:64px;padding:0;font-variant-numeric:tabular-nums}
.w-amt{flex:1;min-width:0;display:flex;align-items:center;gap:6px;white-space:nowrap}
.w-amt b{font:600 17px/1 var(--font-sans);color:var(--color-fg-primary);letter-spacing:-.2px}
.w-plus{display:flex;align-items:center;gap:3px;margin-left:4px;font:600 14px/1 var(--font-sans);color:var(--sky-600)}
.w-plus i{font-style:normal;color:var(--sky-500);font-weight:500;margin-right:1px}
.w-price{flex:none;font:500 15px/1 var(--font-sans);color:var(--color-fg-primary)}
.w-list{padding:0 12px 0 16px}
.w-list .w-pack{box-shadow:0 -1px 0 var(--color-border-default)}
.w-list .w-pack:first-child{box-shadow:none}
.w-tiles{display:grid;gap:8px;margin-top:4px}
.w-tiles .w-pack{padding:0 12px 0 16px;border-radius:16px;background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-default)}
#features .w-note{margin:12px 0 0;text-align:center;font:400 12px/1.5 var(--font-sans);color:var(--color-fg-muted)}
.w-more .rw-row{min-height:56px}
`;
const packs = [[90, 0, 8900], [170, 30, 16900], [350, 150, 34900], [700, 600, 69900], [1400, 1600, 139000]];
const pack = ([b, g, p]) => '<div class="w-pack"><span class="w-amt">' + LF('base') + '<b>' + b.toLocaleString() + '</b>'
  + (g ? '<span class="w-plus"><i>+</i>' + LF('gain') + g.toLocaleString() + '</span>' : '') + '</span><span class="w-price">' + p.toLocaleString() + '원</span>' + CV + '</div>';
const balance = '<div class="mp-card w-bal"><span class="l"><small>보유 리프</small></span><span class="l"><span class="n">' + LF('bal') + '90</span><span class="w-hist" aria-label="리프 내역">' + CV + '</span></span></div>';
const list = V === 'list' ? '<div class="mp-card w-list" style="margin-top:4px">' + packs.map(pack).join('') + '</div>' : '<div class="w-tiles">' + packs.map(pack).join('') + '</div>';
const more = '<div class="rw-sh">리프 더 모으기</div><div class="mp-card rw-list w-more">'
  + '<div class="rw-row"><span class="rw-k"><b>무료 리프 받기</b></span><span class="rw-v">2 / 5' + CV + '</span></div>'
  + '<div class="rw-row"><span class="rw-k"><b>포인트를 리프로 바꾸기</b><small>150P당 1리프</small></span><span class="rw-v">10,300P' + CV + '</span></div></div>';
const html = '<h1>리프 충전</h1>' + balance + '<div class="rw-sh">충전<em>파란 숫자는 보너스 리프</em></div>' + list + '<p class="w-note">시연용 충전이며 실제 결제되지 않아요.</p>' + more;
const gray = GRAY ? `#fx-body .mp-card,#fx-body .w-tiles .w-pack{background:var(--cool-neutral-50);box-shadow:none}#fx-body .w-list .w-pack,#fx-body .rw-row{box-shadow:0 -1px 0 var(--cool-neutral-100)}#fx-body .w-list .w-pack:first-child,#fx-body .rw-row:first-child{box-shadow:none}` : '';
const s = document.createElement('style'); s.textContent = css + gray; document.head.appendChild(s);
document.getElementById('fx-body').innerHTML = html + '<div style="height:120px"></div>';
})();
