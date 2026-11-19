(async () => {
const V = window.__V || 'A', TAB = window.__T || 'received';
const w = ms => new Promise(r => setTimeout(r, ms));
document.querySelector('[data-heart-tab=' + TAB + ']')?.click();
await w(500);
const css = `
.heart-tabs button[aria-selected="true"]{color:var(--cool-neutral-900)!important}
.heart-tabs button[aria-selected="true"]::after{background:var(--cool-neutral-900)!important}
.heart-tabs small,.heart-tabs button[aria-selected="true"] small{background:transparent!important;color:var(--cool-neutral-500)!important;min-width:0!important;padding:0!important}
.heart-tabs button[aria-selected="true"] small{color:var(--cool-neutral-700)!important}
.heart-card-badge{display:none!important}
.mk-d{position:absolute;z-index:2;top:8px;right:8px;padding:4px 8px;border-radius:10px;background:color-mix(in srgb,var(--cool-neutral-950) 42%,transparent);color:#fff;font:600 12px/1.3 var(--font-sans);font-variant-numeric:tabular-nums;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.mk-dt{margin-left:auto;font:500 12px/1 var(--font-sans);color:rgba(255,255,255,.86);font-variant-numeric:tabular-nums}
.mk-new{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--color-fg-love);margin:0 0 0 4px;vertical-align:middle;position:relative;top:-6px}
.heart-person-photo{position:relative}
`;
const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
const days = { received: [6, 3, 2, 1], sent: [5, 2], mutual: [] }[TAB] || [];
document.querySelectorAll('#heart-list .heart-person').forEach((c, i) => {
  const d = days[i];
  if (d) {
    if (V === 'A') { const e = document.createElement('span'); e.className = 'mk-d'; e.textContent = 'D-' + d; c.querySelector('.heart-person-photo').appendChild(e); }
    else { const line = c.querySelector('.card-name-line'); const e = document.createElement('span'); e.className = 'mk-dt'; e.textContent = 'D-' + d; (c.querySelector('.person-age')?.parentElement || line).appendChild(e); }
  }
  if (TAB === 'received' && i < 2) { const n = c.querySelector('.card-name-line strong'); const dot = document.createElement('i'); dot.className = 'mk-new'; dot.setAttribute('aria-label', '새로 온 마음'); n.appendChild(dot); }
});
})();
