import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'json2csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسارات الملفات
const jsonFilePath = path.join(__dirname, '../data/mainDataQuran.json'); 
const csvFilePath = path.join(__dirname, '../data/csv/database.csv');  


// قراءة بيانات JSON
fs.readJSON(jsonFilePath)
  .then(jsonData => {
    // تحويل بيانات JSON إلى CSV
    const csvData = parse(jsonData);

    // كتابة بيانات CSV إلى الملف
    return fs.writeFile(csvFilePath, csvData);
  })
  .then(() => {
    console.log(`CSV file has been saved to ${csvFilePath}`);
  })
  .catch(error => {
    console.error('Error converting JSON to CSV:', error);
  });
