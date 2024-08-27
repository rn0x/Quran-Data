import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { handleError } from '../utils/errorUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسارات البيانات
const metadataPath = path.join(__dirname, '..', '..', 'data', 'json', 'metadata.json');
const surahFolderPath = path.join(__dirname, '..', '..', 'data', 'json', 'surah');
const versesFolderPath = path.join(__dirname, '..', '..', 'data', 'json', 'verses');
const audioFolderPath = path.join(__dirname, '..', '..', 'data', 'json', 'audio');

// الحصول على جميع السور
export const getAllSurahs = (req, res) => {
    try {
        const metadata = fs.readJSONSync(metadataPath);
        res.json({
            success: true,
            result: metadata
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching surah metadata.', {
            message: error.message,
        });
    }
};

// الحصول على جميع الآيات لسورة معينة
export const getAllVerses = (req, res) => {
    try {
        const surahNumber = req.query.number;
        const surahPath = path.join(surahFolderPath, `surah_${surahNumber}.json`);

        if (!fs.existsSync(surahPath)) {
            return handleError(res, 404, 'The requested verses do not exist.', {
                surahNumber: surahNumber,
            });
        }

        const surahData = fs.readJSONSync(surahPath);
        res.json({
            success: true,
            result: surahData.verses
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching verses data.', {
            message: error.message,
        });
    }
};

// الحصول على سورة معينة
export const getSurah = (req, res) => {
    const surahNumber = req.query.number;
    const surahPath = path.join(surahFolderPath, `surah_${surahNumber}.json`);

    if (!fs.existsSync(surahPath)) {
        return handleError(res, 404, 'The requested surah does not exist.', {
            surahNumber: surahNumber,
        });
    }

    try {
        const surahData = fs.readJSONSync(surahPath);
        res.json({
            success: true,
            result: surahData
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching surah data.', {
            surahNumber: surahNumber,
            message: error.message,
        });
    }
};

// الحصول على آية معينة
export const getVerse = (req, res) => {
    const surahNumber = req.query.number;
    const verseNumber = req.query.verseNumber;
    const versePath = path.join(versesFolderPath, `${String(surahNumber).padStart(3, '0')}_${String(verseNumber).padStart(3, '0')}.json`);

    if (!fs.existsSync(versePath)) {
        return handleError(res, 404, 'The requested verse does not exist.', {
            surahNumber: surahNumber,
            verseNumber: verseNumber,
        });
    }

    try {
        const verseData = fs.readJSONSync(versePath);
        res.json({
            success: true,
            result: verseData
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching verse data.', {
            surahNumber: surahNumber,
            verseNumber: verseNumber,
            message: error.message,
        });
    }
};

// الحصول على ملف الصوت لسورة معينة
export const getAudio = (req, res) => {
    const surahNumber = req.query.number;
    const audioPath = path.join(audioFolderPath, `audio_surah_${surahNumber}.json`);

    if (!fs.existsSync(audioPath)) {
        return handleError(res, 404, 'The requested audio does not exist.', {
            surahNumber: surahNumber,
        });
    }

    try {
        const audioData = fs.readJSONSync(audioPath);
        res.json({
            success: true,
            result: audioData
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching audio data.', {
            surahNumber: surahNumber,
            message: error.message,
        });
    }
};

// الحصول على جميع الآيات بناءً على رقم الجزء
export const getVersesByJuz = (req, res) => {
    const juzNumber = parseInt(req.query.number, 10);
    const surahFiles = fs.readdirSync(surahFolderPath);

    let allVerses = [];

    try {
        for (const file of surahFiles) {
            const filePath = path.join(surahFolderPath, file);
            const surahData = fs.readJSONSync(filePath);

            if (surahData.verses) {
                const verses = surahData.verses.filter(verse => verse.juz === juzNumber)
                    .map(verse => ({
                        ...verse,
                        surahName: surahData.name.ar,
                        surahNumber: surahData.number
                    }));

                allVerses = allVerses.concat(verses);
            }
        }

        if (allVerses.length === 0) {
            return handleError(res, 404, 'No verses found for the specified juz.', { juzNumber });
        }

        res.json({
            success: true,
            result: allVerses
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching verses by juz.', {
            juzNumber,
            message: error.message,
        });
    }
};

// الحصول على الآيات التي تحتوي على سجود
export const getSajdaVerses = (req, res) => {
    const surahFiles = fs.readdirSync(surahFolderPath);
    let sajdaVerses = [];

    try {
        for (const file of surahFiles) {
            const filePath = path.join(surahFolderPath, file);
            const surahData = fs.readJSONSync(filePath);

            if (surahData.verses) {
                const verses = surahData.verses.filter(verse => verse.sajda)
                    .map(verse => ({
                        ...verse,
                        surahName: surahData.name.ar,
                        surahNumber: surahData.number
                    }));

                sajdaVerses = sajdaVerses.concat(verses);
            }
        }

        if (sajdaVerses.length === 0) {
            return handleError(res, 404, 'No verses with sajda found.', {});
        }

        res.json({
            success: true,
            result: sajdaVerses
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching sajda verses.', {
            message: error.message,
        });
    }
};