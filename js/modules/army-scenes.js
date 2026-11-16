/* Kunmusliman v50: иллюстрации-сцены исторических кампаний (SVG, без изображений) */
(function () {
  'use strict';
  // тема: небо [верх, низ], свет (sun/moon/none), местность, цвет земли, особенности
  var T = {
    badr:       { sky: ['#1b2a4a', '#e8a45c'], light: 'sun',  land: 'dunes',    ground: '#8a6238', extra: 'wells', army: [3, 8] },
    uhud:       { sky: ['#2a2f4d', '#c9794a'], light: 'sun',  land: 'mountain', ground: '#5b3d2b', extra: 'archers', army: [2, 6] },
    khandaq:    { sky: ['#0d1630', '#3a557a'], light: 'moon', land: 'trench',   ground: '#6f5a3c', extra: 'tents', army: [2, 5] },
    khaybar:    { sky: ['#2c3552', '#d9a35c'], light: 'sun',  land: 'fort',     ground: '#7a5a3a', extra: 'palms', army: [2, 6] },
    mutah:      { sky: ['#3a2a3e', '#e0875a'], light: 'sun',  land: 'dunes',    ground: '#8b5e3c', extra: 'banners', army: [4, 9] },
    fath:       { sky: ['#1c2a52', '#f2c879'], light: 'sun',  land: 'kaaba',    ground: '#a07a4a', extra: 'none', army: [3, 7] },
    hunain:     { sky: ['#2a3a5a', '#d49a5a'], light: 'sun',  land: 'valley',   ground: '#6b4a2e', extra: 'banners', army: [4, 9] },
    tabuk:      { sky: ['#4a7ab0', '#f6d9a0'], light: 'sun',  land: 'dunes',    ground: '#b8894e', extra: 'palms', army: [3, 8] },
    yarmouk:    { sky: ['#24405a', '#a8c09a'], light: 'sun',  land: 'gorge',    ground: '#5d6b45', extra: 'river', army: [4, 9] },
    qadisiyyah: { sky: ['#31405c', '#d8b078'], light: 'sun',  land: 'river',    ground: '#7d6c40', extra: 'banners', army: [4, 9] },
    hattin:     { sky: ['#3a2b48', '#e69a62'], light: 'sun',  land: 'horns',    ground: '#7a5434', extra: 'banners', army: [3, 8] },
    aynjalut:   { sky: ['#1f3a3a', '#a8c8a0'], light: 'sun',  land: 'spring',   ground: '#566b3a', extra: 'palms', army: [3, 7] }
  };
  function rnd(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function soldier(x, y, s, col, spear) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + col + '"><g class="as-bob" style="animation-delay:-' + ((Number(x) * 7 % 10) / 10 * 1.1).toFixed(2) + 's"><circle cx="0" cy="-17" r="3.2"/><path d="M-4 -13h8l2 13h-12z"/>' + (spear ? '<rect x="6" y="-30" width="1.3" height="32"/><path d="M6.6 -34l3 5h-6z"/>' : '') + '</g></g>';
  }
  function horse(x, y, s, col) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + col + '"><ellipse cx="0" cy="-9" rx="10" ry="4.5"/><path d="M8 -11l5-8 3 2-4 9z"/><rect x="-8" y="-6" width="2" height="8"/><rect x="-3" y="-6" width="2" height="8"/><rect x="3" y="-6" width="2" height="8"/><rect x="7" y="-6" width="2" height="8"/><circle cx="2" cy="-18" r="2.8"/></g>'; }
  function banner(x, y, col) { return '<g><rect x="' + x + '" y="' + (y - 44) + '" width="1.6" height="46" fill="#2a1d10"/><path d="M' + (x + 1.6) + ' ' + (y - 44) + 'h16l-4 6 4 6h-16z" fill="' + col + '" class="as-flag"/></g>'; }
  window.armyScene = function (id) {
    var t = T[id] || T.badr, W = 400, H = 170, r = rnd(id.length * 97 + id.charCodeAt(0)), o = [];
    var gy = 118;
    o.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" class="army-scene">');
    o.push('<defs><linearGradient id="sk' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + t.sky[0] + '"/><stop offset="1" stop-color="' + t.sky[1] + '"/></linearGradient><radialGradient id="gl' + id + '"><stop offset="0" stop-color="#fff4c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff4c8" stop-opacity="0"/></radialGradient><linearGradient id="gr' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + t.ground + '"/><stop offset="1" stop-color="#1a110a"/></linearGradient></defs>');
    o.push('<rect width="' + W + '" height="' + H + '" fill="url(#sk' + id + ')"/>');
    for (var i = 0; i < 26; i++) o.push('<circle class="as-star" style="animation-delay:-' + (i % 7 * 0.45).toFixed(2) + 's" cx="' + (r() * W).toFixed(0) + '" cy="' + (r() * 70).toFixed(0) + '" r="' + (0.5 + r()).toFixed(1) + '" fill="#fff" opacity="' + (0.25 + r() * .5).toFixed(2) + '"/>');
    if (t.light === 'sun') o.push('<circle class="as-glow" cx="300" cy="' + (gy - 22) + '" r="46" fill="url(#gl' + id + ')"/><circle cx="300" cy="' + (gy - 22) + '" r="15" fill="#ffe7a3"/>');
    if (t.light === 'moon') o.push('<circle cx="310" cy="38" r="40" fill="url(#gl' + id + ')" opacity=".6"/><path d="M310 22a17 17 0 100 32 13 13 0 010-32z" fill="#fff1c0"/>');
    var L = t.land;
    // дальний план
    if (L === 'mountain' || L === 'horns' || L === 'valley' || L === 'gorge') {
      o.push('<path d="M0 ' + gy + 'L40 70 70 95 120 52 170 98 220 62 270 100 330 58 400 ' + gy + 'Z" fill="#241a24" opacity=".75"/>');
      if (L === 'horns') o.push('<path d="M150 ' + gy + 'L175 70 190 ' + (gy - 22) + ' 205 66 235 ' + gy + 'Z" fill="#2c1e20"/>');
      if (L === 'mountain') o.push('<path d="M250 ' + gy + 'L300 48 360 ' + gy + 'Z" fill="#33232a"/><path d="M300 48l-14 28 12-6 6 10 8-9z" fill="#5b4348" opacity=".7"/>');
    } else if (L === 'fort') {
      o.push('<g fill="#2c2018"><rect x="250" y="62" width="110" height="' + (gy - 62) + '"/>' + [0, 1, 2, 3, 4, 5].map(function (k) { return '<rect x="' + (250 + k * 20) + '" y="55" width="12" height="9"/>'; }).join('') + '<rect x="240" y="48" width="28" height="' + (gy - 48) + '"/><rect x="342" y="48" width="28" height="' + (gy - 48) + '"/></g><rect x="296" y="86" width="18" height="' + (gy - 86) + '" rx="9" fill="#e0a84a" opacity=".5"/>');
    } else if (L === 'kaaba') {
      o.push('<g><rect x="168" y="62" width="64" height="' + (gy - 62) + '" fill="#0d0d10"/><rect x="168" y="76" width="64" height="5" fill="#e0b050"/><rect x="190" y="92" width="16" height="' + (gy - 92) + '" fill="#e0b050" opacity=".8"/></g><path d="M80 ' + gy + 'L130 80 175 ' + gy + 'Z" fill="#3a2a22" opacity=".8"/><path d="M230 ' + gy + 'L280 74 340 ' + gy + 'Z" fill="#3a2a22" opacity=".8"/>');
    } else {
      o.push('<path d="M0 ' + gy + 'Q80 92 160 ' + gy + 'T320 ' + (gy - 4) + 'T400 ' + gy + 'Z" fill="#3a2a20" opacity=".7"/>');
    }
    // земля
    o.push('<path d="M0 ' + gy + 'Q100 ' + (gy - 10) + ' 200 ' + (gy - 2) + 'T400 ' + (gy - 6) + 'V' + H + 'H0Z" fill="url(#gr' + id + ')"/>');
    if (L === 'trench') o.push('<path d="M0 ' + (gy + 16) + 'Q100 ' + (gy + 8) + ' 200 ' + (gy + 14) + 'T400 ' + (gy + 10) + 'V' + (gy + 26) + 'Q300 ' + (gy + 30) + ' 200 ' + (gy + 28) + 'T0 ' + (gy + 32) + 'Z" fill="#120c07"/><path d="M0 ' + (gy + 16) + 'Q100 ' + (gy + 8) + ' 200 ' + (gy + 14) + 'T400 ' + (gy + 10) + '" stroke="#c9a46a" stroke-opacity=".4" fill="none"/>');
    if (L === 'river' || L === 'gorge' || t.extra === 'river') o.push('<path d="M0 ' + (gy + 22) + 'Q100 ' + (gy + 12) + ' 200 ' + (gy + 22) + 'T400 ' + (gy + 18) + 'V' + (gy + 36) + 'H0Z" fill="#35708a" opacity=".85"/><path d="M20 ' + (gy + 26) + 'h60M140 ' + (gy + 30) + 'h80M270 ' + (gy + 26) + 'h60" stroke="#bfe6f0" stroke-opacity=".5" stroke-width="1.5"/>');
    if (L === 'spring') o.push('<ellipse cx="200" cy="' + (gy + 20) + '" rx="70" ry="9" fill="#4aa0a8" opacity=".85"/>');
    if (t.extra === 'wells') o.push('<g fill="#2a1d10"><ellipse cx="90" cy="' + (gy + 14) + '" rx="14" ry="4"/><ellipse cx="150" cy="' + (gy + 20) + '" rx="12" ry="3.5"/></g><ellipse cx="90" cy="' + (gy + 13) + '" rx="10" ry="2.5" fill="#4aa0a8"/>');
    if (t.extra === 'palms') [40, 355, 385].forEach(function (x, k) { o.push('<g transform="translate(' + x + ' ' + (gy + 4) + ')" fill="#12220f"><rect x="-1.5" y="-40" width="3" height="40"/><path d="M0 -40q-18 -3-26 8q14 -8 26 -2q-4-14-20-14q18 2 20 10q2-12 18-14q-14 6-14 16q12-6 26 2q-8-11-26-8z"/></g>'); });
    if (t.extra === 'tents') [60, 120, 330].forEach(function (x) { o.push('<path d="M' + (x - 22) + ' ' + (gy + 8) + 'L' + x + ' ' + (gy - 20) + ' ' + (x + 22) + ' ' + (gy + 8) + 'Z" fill="#c9b78e" opacity=".85"/><path d="M' + x + ' ' + (gy - 20) + 'v28" stroke="#5a4630"/>'); });
    // войско: два строя
    var n = t.army[0] + Math.floor(r() * (t.army[1] - t.army[0] + 1));
    o.push('<g class="as-adv-l">');
    for (var k = 0; k < n; k++) { var x = 20 + k * (170 / n) + r() * 8, y = gy + 10 + (k % 3) * 9, sc = 0.9 + (k % 3) * 0.12; o.push(soldier(x.toFixed(0), y, sc.toFixed(2), '#0b0806', k % 2 === 0)); }
    o.push('</g>');
    var m = Math.max(2, n - 1);
    o.push('<g class="as-adv-r">');
    for (var q = 0; q < m; q++) { var x2 = 218 + q * (160 / m) + r() * 8, y2 = gy + 10 + (q % 3) * 9; o.push(q % 3 === 1 && id !== 'khandaq' ? horse(x2.toFixed(0), y2, 1.05, '#0b0806') : soldier(x2.toFixed(0), y2, (0.9 + (q % 3) * .12).toFixed(2), '#0b0806', true)); }
    o.push('</g>');
    o.push('<g class="as-clash" transform="translate(200 ' + (gy + 4) + ')"><path class="as-sp1" d="M-6 -14l3 8-8-3z" fill="#ffd77a"/><path class="as-sp2" d="M5 -18l2 9-7-5z" fill="#fff1c0"/><circle class="as-sp3" cx="0" cy="-8" r="3" fill="#ffb347"/></g>');
    if (t.extra === 'banners' || t.extra === 'archers') { o.push(banner(100, gy + 6, '#3a9367')); o.push(banner(300, gy + 6, '#2b7a55')); }
    else o.push(banner(120, gy + 6, '#3a9367'));
    o.push('<g class="as-cloud c1"><ellipse cx="60" cy="26" rx="34" ry="6" fill="#fff" opacity=".13"/><ellipse cx="84" cy="31" rx="24" ry="5" fill="#fff" opacity=".1"/></g><g class="as-cloud c2"><ellipse cx="250" cy="42" rx="40" ry="6" fill="#fff" opacity=".1"/></g>');
    o.push('<g class="as-dust"><ellipse cx="110" cy="' + (gy + 24) + '" rx="46" ry="7" fill="#f0d6a0" opacity=".22"/><ellipse cx="290" cy="' + (gy + 26) + '" rx="52" ry="7" fill="#f0d6a0" opacity=".2"/></g>');
    // пыль и виньетка
    o.push('<rect y="' + (gy - 14) + '" width="' + W + '" height="40" fill="#f0d6a0" opacity=".08"/><rect width="' + W + '" height="' + H + '" fill="none" stroke="#e8c777" stroke-opacity=".35" stroke-width="2"/>');
    o.push('</svg>');
    return o.join('');
  };
  var MAP = { muta: 'mutah', hunayn: 'hunain', jalut: 'aynjalut' };
  window.armySceneFor = function (key) { key = String(key || '').replace(/^battle_/, ''); return window.armyScene(MAP[key] || key); };
})();
