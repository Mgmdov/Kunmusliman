/* Азан: выбор записи и автоматическое воспроизведение в момент намаза (пока приложение открыто).
   Файлы лежат в папке azan/. Чтобы добавить запись — положить файл azan/azan-N.m4a и дописать её в AZAN_LIST. */
(function () {
  const AZAN_LIST = [
    { id: 'azan-1', name: 'Азан 1' },
    { id: 'azan-2', name: 'Азан 2' },
    { id: 'azan-3', name: 'Азан 3' },
    { id: 'azan-4', name: 'Азан 4' },
    { id: 'azan-5', name: 'Азан 5' }
  ];
  const KEY = 'azan_choice_v1';
  const sel = document.getElementById('azanSelect');
  const testBtn = document.getElementById('azanTestBtn');
  const stopBtn = document.getElementById('azanStopBtn');
  const hint = document.getElementById('azanHint');
  if (!sel) return;

  let audio = null, lastPlayed = '';
  const say = t => { if (hint) hint.textContent = t || ''; };
  const choice = () => { try { return localStorage.getItem(KEY) || 'none'; } catch (e) { return 'none'; } };

  AZAN_LIST.forEach(a => { const o = document.createElement('option'); o.value = a.id; o.textContent = a.name; sel.appendChild(o); });
  sel.value = AZAN_LIST.some(a => a.id === choice()) ? choice() : 'none';

  function stop() { if (audio) { try { audio.pause(); } catch (e) {} audio = null; } if (stopBtn) stopBtn.hidden = true; }

  function play(id) {
    stop();
    if (!AZAN_LIST.some(a => a.id === id)) return;
    audio = new Audio('azan/' + id + '.m4a');
    audio.addEventListener('ended', stop);
    audio.addEventListener('error', () => { say('Не удалось загрузить запись. Проверьте интернет.'); stop(); });
    audio.play().then(() => { if (stopBtn) stopBtn.hidden = false; say(''); })
      .catch(() => { say('Браузер не дал включить звук сам. Нажмите «Прослушать» — после этого азан будет звучать вовремя.'); stop(); });
  }

  sel.addEventListener('change', () => {
    try { localStorage.setItem(KEY, sel.value); } catch (e) {}
    say(sel.value === 'none' ? 'Азан выключен.' : 'Азан будет звучать в начало каждого намаза, пока приложение открыто.');
  });
  testBtn && testBtn.addEventListener('click', () => { const id = choice() !== 'none' ? choice() : sel.value; if (id === 'none') { say('Сначала выберите запись.'); return; } play(id); });
  stopBtn && stopBtn.addEventListener('click', stop);

  // Проверка раз в 5 секунд: наступило ли время намаза (в часовом поясе выбранного места)
  setInterval(() => {
    if (choice() === 'none' || typeof latestPrayerTimings === 'undefined' || !latestPrayerTimings) return;
    const cur = nowInTz(prayerTz);
    const t = latestPrayerTimings;
    ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(k => {
      if (!t[k]) return;
      const stamp = new Date().toDateString() + k;
      if (toMin(t[k]) === cur && lastPlayed !== stamp) { lastPlayed = stamp; play(choice()); }
    });
  }, 5000);
})();
