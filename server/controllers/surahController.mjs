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

export const getAllVerses = (req, res) => {
    try {
        const surahId = req.query.surah_id;
        const surahPath = path.join(surahFolderPath, `surah_${surahId}.json`);

        if (!fs.existsSync(surahPath)) {
            return handleError(res, 404, 'The requested verses do not exist.', {
                surah_id: surahId,
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

export const getSurah = (req, res) => {
    const surahId = req.query.surah_id;
    const surahPath = path.join(surahFolderPath, `surah_${surahId}.json`);

    if (!fs.existsSync(surahPath)) {
        return handleError(res, 404, '⚠️ The requested surah does not exist.', {
            surah_id: surahId,
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.originalUrl
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
            surah_id: surahId,
            message: error.message,
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.originalUrl
        });
    }
};

export const getVerse = (req, res) => {
    const surahId = req.query.surah_id;
    const verseId = req.query.verse_id;
    const versePath = path.join(versesFolderPath, `${String(surahId).padStart(3, '0')}_${String(verseId).padStart(3, '0')}.json`);

    if (verseId) {
        // Fetch a specific verse
        if (!fs.existsSync(versePath)) {
            return handleError(res, 404, '⚠️ The requested verse does not exist.', {
                surah_id: surahId,
                verse_id: verseId,
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.originalUrl
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
                surah_id: surahId,
                verse_id: verseId,
                message: error.message,
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.originalUrl
            });
        }
    } else {
        // Fetch all verses of the surah
        const surahVersesPath = path.join(versesFolderPath, `${String(surahId).padStart(3, '0')}_*.json`);
        const verseFiles = glob.sync(surahVersesPath);

        if (verseFiles.length === 0) {
            return handleError(res, 404, '⚠️ No verses found for the specified surah.', {
                surah_id: surahId,
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.originalUrl
            });
        }

        try {
            const allVerses = verseFiles.map(file => fs.readJSONSync(file));
            res.json({
                success: true,
                result: allVerses
            });
        } catch (error) {
            handleError(res, 500, 'An error occurred while fetching verses data.', {
                surah_id: surahId,
                message: error.message,
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.originalUrl
            });
        }
    }
};

export const getAudio = (req, res) => {
    const surahId = req.query.surah_id;
    const audioPath = path.join(audioFolderPath, `audio_surah_${surahId}.json`);

    if (!fs.existsSync(audioPath)) {
        return handleError(res, 404, 'The requested audio does not exist.', {
            surah_id: surahId,
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
            surah_id: surahId,
            message: error.message,
        });
    }
};

export const getVersesByJuz = (req, res) => {
    const juzId = parseInt(req.query.juz_id, 10);
    const surahFiles = fs.readdirSync(surahFolderPath);

    let allVerses = [];

    try {
        for (const file of surahFiles) {
            const filePath = path.join(surahFolderPath, file);
            const surahData = fs.readJSONSync(filePath);

            if (surahData.verses) {
                const verses = surahData.verses.filter(verse => verse.juz === juzId)
                    .map(verse => ({
                        ...verse,
                        surahName: surahData.name.ar,
                        surahNumber: surahData.number
                    }));

                allVerses = allVerses.concat(verses);
            }
        }

        if (allVerses.length === 0) {
            return handleError(res, 404, 'No verses found for the specified juz.', { juzId });
        }

        res.json({
            success: true,
            result: allVerses
        });
    } catch (error) {
        handleError(res, 500, 'An error occurred while fetching verses by juz.', {
            juz_id: juzId,
            message: error.message,
        });
    }
};

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