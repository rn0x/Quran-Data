import express from 'express';
import { getSurah, getAllSurahs, getAllVerses, getVerse, getAudio, getVersesByJuz, getSajdaVerses } from '../controllers/surahController.mjs';
import { handleError } from '../utils/errorUtils.mjs'
const router = express.Router();


router.get('/surahs', getAllSurahs);

router.get('/surah', getSurah);

router.get('/verses', getAllVerses);

router.get('/verse', getVerse);

router.get('/sajda', getSajdaVerses);

router.get('/audio', getAudio);

router.get('/juz', getVersesByJuz);

router.use((req, res) => {
    handleError(res, 404, '404 - The requested resource was not found in /api/', {
        message: 'The requested URL was not found on this server.',
    });
});

export default router;
