(() => {
const V = window.__V || 'A';
const LEAF = '<svg class="lf" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18C3 7 12 3 21 3c0 10-5 17-13 16M4 22 16 9"/></svg>';
const CHEV = '<svg class="cv" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
const CHECK = '<svg class="ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const css = `
.f8 h1{margin:0}
.f8 .f8-sub{margin:8px 0 0;font:400 13px/1.6 var(--font-sans);color:var(--color-fg-muted);word-break:keep-all}
.f8 .f8-sh{display:flex;align-items:center;justify-content:space-between;min-height:40px;margin:24px 0 0;font:600 13px/1 var(--font-sans);color:var(--color-fg-muted)}
.f8 .f8-sh em{font-style:normal;font-weight:500;font-size:12px;color:var(--color-fg-secondary)}
.f8 .f8-sh em b{color:var(--color-fg-primary);font-weight:600}
.f8 .mp-card{margin-top:4px}
.f8 .f8-list{padding:0 16px}
.f8 .f8-row{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 0;box-shadow:0 -1px 0 var(--color-border-default)}
.f8 .f8-row:first-child{box-shadow:none}
.f8 .f8-k{flex:1;min-width:0;display:grid;gap:4px}
.f8 .f8-k b{font:500 15px/1.4 var(--font-sans);color:var(--color-fg-primary);letter-spacing:-.2px}
.f8 .f8-k small{display:flex;align-items:center;gap:4px;font:400 12px/1.4 var(--font-sans);color:var(--color-fg-muted)}
.f8 .f8-k small i{font-style:normal;color:var(--cool-neutral-800);font-weight:600}
.f8 .lf{width:14px;height:14px;flex:none;fill:none;stroke:var(--cool-neutral-500);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.f8 .cv{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.f8 .ck{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.f8 .f8-v{flex:none;display:flex;align-items:center;gap:2px;min-height:44px;font:500 13px/1 var(--font-sans);color:var(--color-fg-secondary)}
.f8 .f8-v.go{color:var(--color-fg-secondary)}
.f8 .f8-v.done{color:var(--color-fg-muted);gap:4px}
.f8 .f8-row.is-done .f8-k b{color:var(--color-fg-secondary)}
.f8 .f8-note{margin:8px 4px 0;font:400 12px/1.5 var(--font-sans);color:var(--color-fg-muted)}
.f8 .f8-invite{padding:20px;display:grid;gap:12px}
.f8 .f8-invite .top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.f8 .f8-invite b{font:500 15px/1.4 var(--font-sans);color:var(--color-fg-primary)}
.f8 .f8-invite p{margin:4px 0 0;font:400 12px/1.5 var(--font-sans);color:var(--color-fg-muted);word-break:keep-all}
.f8 .f8-big{flex:none;display:flex;align-items:center;gap:4px;font:600 20px/1 var(--font-sans);color:var(--color-fg-primary)}
.f8 .f8-big .lf{width:18px;height:18px}
.f8 .f8-sum{padding:20px;display:grid;gap:12px}
.f8 .f8-sum small{font:400 12px/1.4 var(--font-sans);color:var(--color-fg-muted)}
.f8 .f8-sum .n{display:flex;align-items:baseline;gap:6px;font:600 28px/1 var(--font-sans);color:var(--color-fg-primary);letter-spacing:-.5px}
.f8 .f8-sum .n span{font:500 15px/1 var(--font-sans);color:var(--color-fg-muted)}
.f8 .f8-sum .n .lf{width:20px;height:20px;align-self:center}
.f8 .bar{height:6px;border-radius:3px;background:var(--cool-neutral-100);overflow:hidden}
.f8 .bar i{display:block;height:100%;width:40%;border-radius:3px;background:var(--cool-neutral-800)}
.f8 .f8-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px}
.f8 .f8-tile{display:grid;justify-items:center;gap:6px;padding:16px 8px;border-radius:16px;background:var(--color-bg-surface);box-shadow:inset 0 0 0 1px var(--color-border-default);text-align:center}
.f8 .f8-tile b{font:500 14px/1.3 var(--font-sans);color:var(--color-fg-primary)}
.f8 .f8-tile small{display:flex;align-items:center;gap:3px;font:600 12px/1 var(--font-sans);color:var(--cool-neutral-800)}
.f8 .f8-tile em{font-style:normal;font:500 12px/1 var(--font-sans);color:var(--color-fg-secondary);display:flex;align-items:center;gap:3px;min-height:20px}
.f8 .f8-tile.is-done{background:var(--cool-neutral-50);box-shadow:none}
.f8 .f8-tile.is-done em{color:var(--color-fg-muted)}
`;
const reward = (n, extra) => `<small>${LEAF}<i>+${n}</i>${extra ? ' · ' + extra : ''}</small>`;
const row = (name, sub, v, cls = '') => `<div class="f8-row ${cls}"><span class="f8-k"><b>${name}</b>${sub}</span>${v}</div>`;
const prog = t => `<span class="f8-v">${t}${CHEV}</span>`;
const go = (t = '시작하기') => `<span class="f8-v go">${t}${CHEV}</span>`;
const done = (t = '받았어요') => `<span class="f8-v done">${CHECK}${t}</span>`;

const missions = '<div class="mp-card f8-list">'
  + row('첫 관심 보내기', reward(5, '한 명마다'), prog('1 / 2명'))
  + row('오늘의 인연 8명 확인', reward(3, '다 보면 보너스 소개 1명'), prog('4 / 8명'))
  + row('익명 이야기 첫 글', reward(1), done(), 'is-done')
  + row('익명 이야기 첫 댓글', reward(1), go())
  + '</div><p class="f8-note">매일 0시에 새로 시작해요.</p>';

const trustList = '<div class="mp-card f8-list">'
  + row('학력 인증', reward(20, '한 번만'), done(), 'is-done')
  + row('직장 인증', reward(20, '한 번만'), go('인증하기'))
  + row('소득 인증', reward(30, '한 번만'), go('인증하기'))
  + '</div>';

const tile = (name, n, state) => `<div class="f8-tile${state ? ' is-done' : ''}"><b>${name}</b><small>${LEAF}+${n}</small><em>${state ? CHECK + '받았어요' : '인증하기' + CHEV}</em></div>`;
const trustTiles = '<div class="f8-tiles">' + tile('학력', 20, 1) + tile('직장', 20, 0) + tile('소득', 30, 0) + '</div>';

const invite = '<div class="mp-card f8-invite"><div class="top"><div><b>친구에게 야화 알려 주기</b><p>초대 링크로 가입한 친구가 프로필 승인을 받으면 받아요.</p></div><span class="f8-big">' + LEAF + '+160</span></div><button type="button" class="btn btn-primary btn-M btn-block">초대 링크 보내기</button></div>';

const summary = '<div class="mp-card f8-sum" style="margin-top:20px"><small>오늘 모은 리프</small><div class="n">' + LEAF + '<b>6</b><span>/ 15</span></div><div class="bar"><i></i></div><small>미션 5개 중 2개 완료 · 매일 0시에 새로 시작해요</small></div>';

const C = window.__C || 'sky';
const PAL = {sky:['--sky-500','--sky-600','--sky-500'], mint:['--mint-500','--mint-700','--mint-500']}[C];
const css2 = `.f8{--leaf-ic:var(${PAL[0]});--leaf-tx:var(${PAL[1]});--leaf-bar:var(${PAL[2]})}
.f8 .lf{stroke:var(--leaf-ic)}
.f8 .f8-k small i,.f8 .f8-tile small,.f8 .f8-big{color:var(--leaf-tx)}
.f8 .f8-sum .n b{font-weight:600;color:var(--leaf-tx)}
.f8 .bar i{background:var(--leaf-bar)}`;
let html;
if (V === 'A') {
  html = '<h1>작은 활동, 새로운 인연</h1><p class="f8-sub">매일 하는 일과 인증으로 리프를 받을 수 있어요.</p>'
    + '<div class="f8-sh">오늘의 미션<em><b>2</b> / 5 완료</em></div>' + missions
    + '<div class="f8-sh">신뢰를 더해요<em>인증마다 한 번</em></div>' + trustList
    + '<div class="f8-sh">친구 초대</div>' + invite;
} else {
  html = '<h1>작은 활동, 새로운 인연</h1>' + summary
    + '<div class="f8-sh">오늘의 미션</div>' + missions.replace('<p class="f8-note">매일 0시에 새로 시작해요.</p>', '')
    + '<div class="f8-sh">신뢰를 더해요<em>인증마다 한 번</em></div>' + trustTiles
    + '<div class="f8-sh">친구 초대</div>' + invite;
}
const s = document.createElement('style'); s.textContent = css + css2; document.head.appendChild(s);
const body = document.getElementById('fx-body');
body.classList.add('f8');
body.innerHTML = html + '<div style="height:120px"></div>';
})();
