const AYATS = [
    { arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ', translation: 'Хвала Аллаху, Господу миров', source: 'Аль-Фатиха, 1:2' },
    { arabic: 'إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ', translation: 'Поистине, Аллах — с терпеливыми', source: 'Аль-Бакара, 2:153' },
    { arabic: 'وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًۭا', translation: 'Тому, кто боится Аллаха, Он создаёт выход из положения', source: 'Ат-Таляк, 65:2' },
    { arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', translation: 'Поистине, за каждой тягостью наступает облегчение', source: 'Аш-Шарх, 94:5' },
    { arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ', translation: 'Скажи: «Он — Аллах Единый, Аллах Самодостаточный»', source: 'Аль-Ихляс, 112:1-2' },
    { arabic: 'ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا۟', translation: 'Аллах — Покровитель тех, которые уверовали', source: 'Аль-Бакара, 2:257' },
    { arabic: 'وَٱذْكُر رَّبَّكَ فِى نَفْسِكَ', translation: 'Поминай Господа твоего про себя', source: 'Аль-Араф, 7:205' }
];
function getDailyAyah() { const today = new Date().toDateString(); const saved = localStorage.getItem('daily_ayah'); if (saved) { const data = JSON.parse(saved); if (data.date === today) return data.ayah; } const randomIndex = Math.floor(Math.random() * AYATS.length); localStorage.setItem('daily_ayah', JSON.stringify({ date: today, ayah: randomIndex })); return randomIndex; }
function displayAyah(index) { const ayah = AYATS[index]; document.getElementById('fullAyahArabic').textContent = ayah.arabic; document.getElementById('fullAyahTranslation').textContent = ayah.translation; document.getElementById('fullAyahSource').textContent = ayah.source; document.getElementById('homeAyahArabic').textContent = ayah.arabic; document.getElementById('homeAyahTranslation').textContent = ayah.translation; }
function refreshAyah() { const randomIndex = Math.floor(Math.random() * AYATS.length); const today = new Date().toDateString(); localStorage.setItem('daily_ayah', JSON.stringify({ date: today, ayah: randomIndex })); displayAyah(randomIndex); }
document.getElementById('refreshAyahBtn')?.addEventListener('click', refreshAyah);
setTimeout(() => displayAyah(getDailyAyah()), 300);
