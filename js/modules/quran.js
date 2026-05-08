var quranFullData = null, quranCurrentSurah = 1, quranCurrentAyah = 1, quranBookmarks = [], quranTajweed = false;
var currentVisibleAyah = 1;
var arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabic(n) { return String(n).split('').map(function(d) { return arabicNums[parseInt(d)]; }).join(''); }

async function loadQuranData() {
    try {
        var saved = localStorage.getItem('quran_full_data');
        if (saved) { quranFullData = JSON.parse(saved); return; }
        var r = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
        var d = await r.json();
        quranFullData = d.data;
        localStorage.setItem('quran_full_data', JSON.stringify(quranFullData));
    } catch(e) {}
}

function openQuran(surah, ayah) {
    document.getElementById('quranOverlay').classList.add('active');
    if (!quranFullData) {
        loadQuranData().then(function() {
            showSurah(surah || 1, ayah || 1);
        });
    } else {
        showSurah(surah || 1, ayah || 1);
    }
}

function scrollToAyah(ayah) {
    currentVisibleAyah = ayah;
    quranCurrentAyah = ayah;
    setTimeout(function() {
        var container = document.getElementById('quranTextContainer');
        var text = document.getElementById('quranText').innerHTML;
        var marker = '﴿' + toArabic(ayah) + '﴾';
        var index = text.indexOf(marker);
        if (index > 0) {
            container.scrollTop = (index / text.length) * container.scrollHeight - container.clientHeight / 3;
        }
    }, 400);
}

function closeQuran() {
    document.getElementById('quranOverlay').classList.remove('active');
    document.getElementById('surahList').classList.remove('active');
    document.getElementById('quranSettings').classList.remove('active');
    document.getElementById('quranBookmarks').classList.remove('active');
}

function showQuranControls() {
    var h = document.getElementById('quranHeader');
    var f = document.getElementById('quranFooter');
    if (h.classList.contains('hidden')) {
        h.classList.remove('hidden');
        f.classList.remove('hidden');
        setTimeout(function() { h.classList.add('hidden'); f.classList.add('hidden'); }, 3000);
    }
}

function showSurah(surah, ayah) {
    if (!quranFullData) return;
    quranCurrentSurah = surah;
    currentVisibleAyah = ayah || 1;
    quranCurrentAyah = ayah || 1;
    var s = quranFullData.surahs[surah-1];
    document.getElementById('quranSurahName').textContent = s.englishName;
    var txt = '';
    s.ayahs.forEach(function(a) {
        txt += a.text + ' ﴿' + toArabic(a.numberInSurah) + '﴾ ';
    });
    document.getElementById('quranText').innerHTML = txt;
    document.getElementById('quranText').style.color = document.getElementById('quranColorSelect').value;
    if (quranTajweed) applyTajweed();
    document.getElementById('quranTextContainer').scrollTop = 0;
    if (ayah && ayah > 1) scrollToAyah(ayah);
}

function applyTajweed() {
    var text = document.getElementById('quranText').innerHTML;
    text = text.replace(/(ٓ|ٰ|۟|۠|ۡ|ۢ|ۣ|ۤ|ۥ|ۦ|ۧ|ۨ|۩|۪|۫|۬|ۭ)/g, '<span class="tajweed-madd">$&</span>');
    text = text.replace(/(مّ|نّ)/g, '<span class="tajweed-ghunna">$&</span>');
    document.getElementById('quranText').innerHTML = text;
}

function toggleTajweed() {
    quranTajweed = document.getElementById('quranTajweedSelect').value === 'on';
    if (quranTajweed) {
        document.getElementById('quranText').classList.add('tajweed-mode');
    } else {
        document.getElementById('quranText').classList.remove('tajweed-mode');
    }
    showSurah(quranCurrentSurah, currentVisibleAyah);
}

function toggleSurahList() {
    var list = document.getElementById('surahList');
    if (list.classList.contains('active')) {
        list.classList.remove('active');
    } else {
        buildSurahList();
        list.classList.add('active');
    }
}

function buildSurahList() {
    if (!quranFullData) return;
    var html = '';
    quranFullData.surahs.forEach(function(s) {
        html += '<div class="surah-list-item" onclick="selectSurah('+s.number+')"><span>'+s.number+'. '+s.englishName+'</span><span style="color:#999;">'+s.name+'</span></div>';
    });
    document.getElementById('surahListContent').innerHTML = html;
}

function selectSurah(n) {
    toggleSurahList();
    showSurah(n, 1);
}

function nextSurah() {
    if (quranCurrentSurah < 114) showSurah(quranCurrentSurah + 1, 1);
    else showSurah(1, 1);
}

function prevSurah() {
    if (quranCurrentSurah > 1) showSurah(quranCurrentSurah - 1, 1);
    else showSurah(114, 1);
}

function toggleQuranBookmarks() {
    var b = document.getElementById('quranBookmarks');
    if (b.classList.contains('active')) { b.classList.remove('active'); }
    else { loadBookmarks(); b.classList.add('active'); }
}

function addBookmark() {
    var s = quranFullData.surahs[quranCurrentSurah-1];
    quranCurrentAyah = currentVisibleAyah;
    var ayahText = s.ayahs[currentVisibleAyah-1].text.substring(0, 80);
    
    var exists = quranBookmarks.find(function(b) {
        return b.surah === quranCurrentSurah && b.ayah === currentVisibleAyah;
    });
    if (exists) return;
    
    quranBookmarks.push({
        surah: quranCurrentSurah,
        ayah: currentVisibleAyah,
        surahName: s.englishName,
        ayahPreview: ayahText
    });
    localStorage.setItem('quran_bookmarks', JSON.stringify(quranBookmarks));
    loadBookmarks();
    
    var notif = document.createElement('div');
    notif.textContent = '🔖 Аят ' + toArabic(currentVisibleAyah) + ' сохранён!';
    notif.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#FFD700;color:#000;padding:10px 20px;border-radius:20px;z-index:999999;font-weight:bold;';
    document.body.appendChild(notif);
    setTimeout(function() { notif.remove(); }, 2000);
}

function loadBookmarks() {
    var saved = localStorage.getItem('quran_bookmarks');
    if (saved) quranBookmarks = JSON.parse(saved);
    var list = document.getElementById('quranBookmarksList');
    if (!quranBookmarks.length) { list.innerHTML = '<p style="color:#999;">Нет закладок</p>'; return; }
    list.innerHTML = quranBookmarks.map(function(b, i) {
        return '<div onclick="openQuran('+b.surah+','+b.ayah+');toggleQuranBookmarks();" style="padding:12px;background:rgba(255,255,255,0.1);border-radius:12px;margin-bottom:8px;color:#FFF;cursor:pointer;">' +
            '📌 <b>'+b.surahName+'</b> — Аят '+toArabic(b.ayah)+'<br>' +
            '<small style="color:#999;">'+b.ayahPreview+'...</small>' +
            '<button onclick="event.stopPropagation();deleteBookmark('+i+')" style="float:right;background:none;border:none;color:#F44;font-size:1.2rem;">✕</button>' +
        '</div>';
    }).join('');
}

function deleteBookmark(i) {
    quranBookmarks.splice(i, 1);
    localStorage.setItem('quran_bookmarks', JSON.stringify(quranBookmarks));
    loadBookmarks();
}

// Отслеживание видимого аята при скролле
document.getElementById('quranTextContainer').addEventListener('scroll', function() {
    var container = this;
    var scrollRatio = container.scrollTop / (container.scrollHeight - container.clientHeight);
    var totalAyahs = quranFullData.surahs[quranCurrentSurah-1].ayahs.length;
    currentVisibleAyah = Math.max(1, Math.min(totalAyahs, Math.floor(scrollRatio * totalAyahs) + 1));
});

// Долгое нажатие = закладка
var pressTimer;
document.getElementById('quranTextContainer').addEventListener('touchstart', function(e) {
    pressTimer = setTimeout(function() {
        addBookmark();
        navigator.vibrate && navigator.vibrate(50);
    }, 800);
});
document.getElementById('quranTextContainer').addEventListener('touchend', function() { clearTimeout(pressTimer); });
document.getElementById('quranTextContainer').addEventListener('touchmove', function() { clearTimeout(pressTimer); });

function toggleQuranSettings() {
    document.getElementById('quranSettings').classList.toggle('active');
}
function closeQuranSettings() {
    document.getElementById('quranSettings').classList.remove('active');
}

function changeQuranFont() {
    var f = document.getElementById('quranFontSelect').value;
    document.getElementById('quranText').style.fontFamily = f;
    localStorage.setItem('quran_font', f);
}

function changeQuranSize() {
    var s = document.getElementById('quranFontSize').value;
    document.getElementById('quranText').style.fontSize = s + 'px';
    document.getElementById('quranSizeValue').textContent = s + 'px';
    localStorage.setItem('quran_size', s);
}

function changeQuranColor() {
    var c = document.getElementById('quranColorSelect').value;
    document.getElementById('quranText').style.color = c;
    localStorage.setItem('quran_color', c);
}

function loadQuranSettings() {
    var f = localStorage.getItem('quran_font') || 'Amiri';
    var s = localStorage.getItem('quran_size') || '28';
    var c = localStorage.getItem('quran_color') || '#FFD700';
    document.getElementById('quranFontSelect').value = f;
    document.getElementById('quranFontSize').value = s;
    document.getElementById('quranColorSelect').value = c;
    document.getElementById('quranText').style.fontFamily = f;
    document.getElementById('quranText').style.fontSize = s + 'px';
    document.getElementById('quranText').style.color = c;
    document.getElementById('quranSizeValue').textContent = s + 'px';
}

loadQuranSettings();
loadQuranData();
