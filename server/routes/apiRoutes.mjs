import express from 'express';
import { getSurah, getAllSurahs, getAllVerses, getVerse, getAudio, getVersesByJuz, getSajdaVerses, getPage } from '../controllers/surahController.mjs';
import { handleError } from '../utils/errorUtils.mjs'
const router = express.Router();


router.get('/surahs', getAllSurahs);

router.get('/surah/:surah_id?', getSurah);

router.get('/verses/:surah_id?', getAllVerses);

router.get('/verse/:surah_id?/:verse_id?', getVerse);

router.get('/sajda', getSajdaVerses);

router.get('/audio/:surah_id?', getAudio);

router.get('/juz/:juz_id?', getVersesByJuz);

router.get('/pages/:surah_id?/:verse_id?', getPage);

router.use((req, res) => {
    handleError(res, 404, '404 - The requested resource was not found in /api/', {
        message: 'The requested URL was not found on this server.',
    });
});

export default router;
