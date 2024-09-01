import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسارات المجلدات حيث سيتم تخزين البيانات
const mainDataQuranPath = path.join(__dirname, '..', 'data', 'mainDataQuran.json');
const dataFolderPath = path.join(__dirname, '..', 'data', 'json');
const surahFolderPath = path.join(dataFolderPath, 'surah');
const versesFolderPath = path.join(dataFolderPath, 'verses');
const audioFolderPath = path.join(dataFolderPath, 'audio');

// التأكد من وجود المجلدات
fs.ensureDirSync(dataFolderPath);
fs.ensureDirSync(surahFolderPath);
fs.ensureDirSync(versesFolderPath);
fs.ensureDirSync(audioFolderPath);

// قراءة البيانات الأصلية من ملف JSON
const quranData = fs.readJSONSync(mainDataQuranPath);

// إنشاء metadata للسور
const surahMetadata = quranData.map((surah) => ({
    number: surah.number,
    name: surah.name,
    revelation_place: surah.revelation_place,
    verses_count: surah.verses_count,
    words_count: surah.words_count,
    letters_count: surah.letters_count,
}));

// حفظ ملف metadata.json
const metadataFilePath = path.join(dataFolderPath, 'metadata.json');
fs.writeJSONSync(metadataFilePath, surahMetadata, { spaces: 2 });


// تقسيم البيانات إلى ملفات JSON فردية
quranData.forEach((surah) => {
    // حفظ ملف السورة
    const surahFilePath = path.join(surahFolderPath, `surah_${surah.number}.json`);
    fs.writeJSONSync(surahFilePath, surah, { spaces: 2 });

    // تقسيم الآيات وحفظ كل آية في ملف منفصل
    surah.verses.forEach((verse) => {
        const verseFileName = `${String(surah.number).padStart(3, '0')}_${String(verse.number).padStart(3, '0')}.json`;
        const verseFilePath = path.join(versesFolderPath, verseFileName);
        fs.writeJSONSync(verseFilePath, verse, { spaces: 2 });
    });

    // حفظ ملف الصوتيات لكل سورة
    const audioFilePath = path.join(audioFolderPath, `audio_surah_${surah.number}.json`);
    fs.writeJSONSync(audioFilePath, surah.audio, { spaces: 2 });
});

console.log('Data successfully split into individual JSON files.');
