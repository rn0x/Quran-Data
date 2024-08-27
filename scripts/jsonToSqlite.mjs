import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFilePath = path.join(__dirname, '../data/mainDataQuran.json'); 
const dbFilePath = path.join(__dirname, '../data/sqlite/database.sqlite');

// قراءة بيانات JSON
const readJsonData = async () => {
    try {
        const data = await fs.readJSON(jsonFilePath);
        return data;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        throw error;
    }
};

// إنشاء قاعدة بيانات SQLite
const createDatabase = async () => {
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database
    });

    // إنشاء الجداول
    await db.exec(`
        CREATE TABLE IF NOT EXISTS surahs (
            number INTEGER PRIMARY KEY,
            name_ar TEXT,
            name_en TEXT,
            name_transliteration TEXT,
            revelation_place_ar TEXT,
            revelation_place_en TEXT,
            verses_count INTEGER,
            words_count INTEGER,
            letters_count INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS verses (
            surah_number INTEGER,
            number INTEGER,
            text_ar TEXT,
            text_en TEXT,
            juz INTEGER,
            page INTEGER,
            sajda BOOLEAN,
            PRIMARY KEY (surah_number, number),
            FOREIGN KEY (surah_number) REFERENCES surahs (number)
        );
        
        CREATE TABLE IF NOT EXISTS audio (
            id INTEGER PRIMARY KEY,
            surah_number INTEGER,
            reciter_ar TEXT,
            reciter_en TEXT,
            rewaya_ar TEXT,
            rewaya_en TEXT,
            server TEXT,
            link TEXT,
            FOREIGN KEY (surah_number) REFERENCES surahs (number)
        );
    `);

    return db;
};

// إدراج البيانات إلى قاعدة البيانات
const insertData = async (db, data) => {
    try {
        for (const surah of data) {
            // إدراج بيانات السورة
            await db.run(`
                INSERT INTO surahs (
                    number, name_ar, name_en, name_transliteration,
                    revelation_place_ar, revelation_place_en,
                    verses_count, words_count, letters_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(number) DO UPDATE SET
                    name_ar=excluded.name_ar,
                    name_en=excluded.name_en,
                    name_transliteration=excluded.name_transliteration,
                    revelation_place_ar=excluded.revelation_place_ar,
                    revelation_place_en=excluded.revelation_place_en,
                    verses_count=excluded.verses_count,
                    words_count=excluded.words_count,
                    letters_count=excluded.letters_count;
            `, [
                surah.number, surah.name.ar, surah.name.en, surah.name.transliteration,
                surah.revelation_place.ar, surah.revelation_place.en,
                surah.verses_count, surah.words_count, surah.letters_count
            ]);

            // إدراج بيانات الآيات
            for (const verse of surah.verses) {
                await db.run(`
                    INSERT INTO verses (
                        surah_number, number, text_ar, text_en,
                        juz, page, sajda
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(surah_number, number) DO UPDATE SET
                        text_ar=excluded.text_ar,
                        text_en=excluded.text_en,
                        juz=excluded.juz,
                        page=excluded.page,
                        sajda=excluded.sajda;
                `, [
                    surah.number, verse.number, verse.text.ar, verse.text.en,
                    verse.juz, verse.page, verse.sajda
                ]);
            }

            // إدراج بيانات التسجيل الصوتي
            for (const audio of surah.audio) {
                await db.run(`
                    INSERT INTO audio (
                        id, surah_number, reciter_ar, reciter_en,
                        rewaya_ar, rewaya_en, server, link
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        reciter_ar=excluded.reciter_ar,
                        reciter_en=excluded.reciter_en,
                        rewaya_ar=excluded.rewaya_ar,
                        rewaya_en=excluded.rewaya_en,
                        server=excluded.server,
                        link=excluded.link;
                `, [
                    audio.id, surah.number, audio.reciter.ar, audio.reciter.en,
                    audio.rewaya.ar, audio.rewaya.en, audio.server, audio.link
                ]);
            }
        }
        console.log('Data successfully inserted into database');
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
};

// تنفيذ السكربت
const run = async () => {
    try {
        const jsonData = await readJsonData();
        const db = await createDatabase();
        await insertData(db, jsonData);
        await db.close();
    } catch (error) {
        console.error('Error during data processing:', error);
    }
};

run();
