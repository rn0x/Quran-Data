// routes/surahRoutes.mjs
import express from 'express';
import { getSurah, getAllSurahs, getAllVerses, getVerse, getAudio, getVersesByJuz, getSajdaVerses } from '../controllers/surahController.mjs';
import { handleError } from '../utils/errorUtils.mjs'
const router = express.Router();

// الحصول على السور أو سورة معينة أو آيات تحتوي على سجود
router.get('/surahs', (req, res, next) => {
    if (req.query.number && req.query.verseNumber) {
        // جلب آية معينة في سورة معينة
        getVerse(req, res, next);
    } else if (req.query.number) {
        // جلب سورة معينة
        getSurah(req, res, next);
    } else if (req.query.sajda === "true") {
        // جلب الآيات التي تحتوي على سجود
        getSajdaVerses(req, res, next);
    } else {
        // جلب جميع السور
        getAllSurahs(req, res, next);
    }
});

// الحصول على جميع الآيات لسورة معينة
router.get('/surahs/verses', getAllVerses);

// الحصول على الصوتيات لسورة معينة
router.get('/surahs/audio', getAudio);

// الحصول على الآيات في جزء معين 
router.get('/surahs/juz', getVersesByJuz);

// معالجة المسارات غير المعروفة في نطاق `/api/`
router.use((req, res) => {
    handleError(res, 404, '404 - The requested resource was not found in /api/', {
        message: 'The requested URL was not found on this server.',
    });
});

export default router;
