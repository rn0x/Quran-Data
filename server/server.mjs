import express from 'express';
import config from './config.mjs';
import cors from 'cors';
import rateLimiter from './middleware/rateLimiter.mjs';
import apiRoutes from './routes/apiRoutes.mjs';
import notFoundHandler from './utils/notFoundHandler.mjs';
import errorHandler from './utils/errorHandler.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFolderPath = path.join(__dirname, '..', 'data');
const apiDefinitionPath = path.join(__dirname,'..', 'docs','api-definition.yaml');
const publicFolderPath = path.join(__dirname, 'public');
const publicHtmlFilePath = path.join(__dirname, 'public', 'docs.html');

const app = express();

// Disable the X-Powered-By header
app.disable('x-powered-by');

// تفعيل CORS
app.use(cors());

// تقديم ملفات الوثائق من مجلد public
app.use('/docs/api-definition.yaml', express.static(apiDefinitionPath));
app.use('/', express.static(publicFolderPath));
app.get('/docs', (req, res) => {
    res.sendFile(publicHtmlFilePath);
});
// إعداد باقي المسارات
app.use(rateLimiter);
app.use('/data', express.static(dataFolderPath));
app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`[QURAN-DATA]-[${new Date().toISOString()}] 🚀 Server is running on http://localhost:${config.port}`);
});
