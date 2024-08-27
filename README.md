# Quran Data

## مقدمة

مشروع `quran_data` يوفر بيانات شاملة عن القرآن الكريم، بما في ذلك السور، الآيات، والصوتيات. يوفر المشروع قواعد البيانات بصيغ متعددة مثل JSON وCSV وSQLite، ويشمل أيضًا واجهة برمجة تطبيقات (API) لعرض هذه المعلومات وتسهيل الوصول إليها.

![quran_data](./unused/Quran-Data.webp)

## هيكل المشروع

```
📂 quran_data
│
├── 📂 api
│   ├── 📂 controllers
│   │   └── surahController.mjs          # مسؤول عن معالجة الطلبات المتعلقة بالسور والآيات.
│   ├── 📂 middleware
│   │   └── rateLimiter.mjs              # إدارة الحد من عدد الطلبات لتحسين الأداء والأمان.
│   ├── 📂 routes
│   │   └── apiRoutes.mjs                # تعريف المسارات الخاصة بواجهة برمجة التطبيقات (API).
│   ├── 📂 utils
│   │   ├── errorHandler.mjs             # معالجة الأخطاء في تطبيق الويب.
│   │   ├── errorUtils.mjs               # أدوات مساعدة لمعالجة الأخطاء.
│   │   └── notFoundHandler.mjs          # معالجة المسارات غير المعروفة.
│   ├── config.mjs                       # إعدادات التكوين الخاصة بالتطبيق.
│   └── server.js                        # نقطة الدخول للتطبيق وتشغيل الخادم.
│
├── 📂 data
│   ├── mainDataQuran.json                # البيانات الرئيسية المتعلقة بالقرآن الكريم.
│   ├── 📂 json
│   │   ├── metadata.json                # بيانات تعريفية حول السور.
│   │   ├── 📂 surah
│   │   │   └── surah_1.json             # بيانات السور بشكل مفصل.
│   │   ├── 📂 verses
│   │   │   └── 001_001.json             # بيانات الآيات لكل سورة.
│   │   ├── 📂 audio
│   │   │   └── audio_surah_1.json       # بيانات الصوتيات لكل سورة.
│   │   └── ...
│   ├── 📂 sqlite
│   │   ├── database.sqlite              # قاعدة البيانات بصيغة SQLite.
│   └── 📂 csv
│       └── database.csv                 # قاعدة البيانات بصيغة CSV.
├── 📂 scripts
│   ├── jsonToCsv.mjs                    # سكربت لتحويل بيانات JSON إلى CSV.
│   ├── jsonToSqlite.mjs                 # سكربت لتحويل بيانات JSON إلى SQLite.
│   └── splitData.mjs                   # سكربت لتقسيم البيانات الكبيرة إلى ملفات أصغر.
│
├── 📂 docs
│   └── api_documentation.md             # توثيق واجهة برمجة التطبيقات (API).
│
└── 📄 README.md
```

## كيفية التشغيل

1. **تثبيت التبعيات:**

   تأكد من أنك في المجلد الرئيسي للمشروع ثم قم بتثبيت التبعيات باستخدام npm:

   ```bash
   npm install
   ```

2. **تشغيل الخادم:**

   لتشغيل الخادم، استخدم الأمر التالي:

   ```bash
   npm start
   ```

   سيتم تشغيل الخادم على المنفذ المحدد في ملف `config.mjs`.

3. **تشغيل السكربتات:**

   لتحويل بيانات JSON إلى CSV أو SQLite، استخدم السكربتات الموجودة في مجلد `scripts`. على سبيل المثال:

   ```bash
   node scripts/jsonToCsv.mjs
   ```

   ```bash
   node scripts/jsonToSqlite.mjs
   ```

## تفاصيل البيانات

### mainDataQuran.json

يحتوي على بيانات مفصلة عن السور والآيات بما في ذلك النصوص، عدد الآيات، عدد الكلمات، عدد الحروف، الصوتيات، والمزيد. الهيكل العام للبيانات هو كما يلي:

```json
[
  {
    "number": 0, // رقم السورة
    "name": {
      "ar": "", // الاسم بالعربية
      "en": "", // الاسم بالإنجليزية
      "transliteration": "" // الاسم بالنقل الصوتي
    },
    "revelation_place": {
      "ar": "", // مكان النزول بالعربية
      "en": "" // مكان النزول بالإنجليزية
    },
    "verses_count": 0, // عدد الآيات في السورة
    "words_count": 0, // عدد الكلمات في السورة
    "letters_count": 0, // عدد الحروف في السورة
    "verses": [
      {
        "number": 0, // رقم الآية في السورة
        "text": {
          "ar": "", // النص بالعربية
          "en": "" // النص بالإنجليزية
        },
        "juz": 0, // الجزء الذي تنتمي إليه الآية
        "page": 0, // رقم الصفحة التي تظهر فيها الآية
        "sajda": false // معلومات حول السجدة
      }
    ],
    "audio": [
      {
        "id": 0, // معرف التسجيل الصوتي
        "reciter": {
          "ar": "", // اسم القارئ بالعربية
          "en": "" // اسم القارئ بالإنجليزية
        },
        "rewaya": {
          "ar": "", // الرواية بالعربية
          "en": "" // الرواية بالإنجليزية
        },
        "server": "", // اسم الخادم
        "link": "" // رابط التسجيل الصوتي
      }
    ]
  }
]
```

## كيفية استخدام واجهة برمجة التطبيقات (API)

لمزيد من المعلومات حول كيفية استخدام واجهة برمجة التطبيقات، راجع ملف [`docs/api_documentation.md`](./docs/api_documentation.md).

## دعم Docker

يوفر `quran_data` دعمًا لتشغيله داخل حاوية Docker. اتبع الخطوات أدناه لبناء الصورة وتشغيل الحاوية.

### بناء الصورة

1. **تأكد من تثبيت Docker:**

   تأكد من أنك قد قمت بتثبيت Docker على جهازك. يمكنك تنزيله وتثبيته من [موقع Docker الرسمي](https://www.docker.com/get-started).

2. **بناء صورة Docker:**

   انتقل إلى جذر مشروعك ثم استخدم الأمر التالي لبناء الصورة:

   ```bash
   docker build -t quran_data .
   ```

### تشغيل الحاوية

1. **تشغيل حاوية Docker:**

   بعد بناء الصورة، يمكنك تشغيل الحاوية باستخدام الأمر التالي:

   ```bash
   docker run -d -p 3000:5000 -e PORT=5000 -e API_RATE_LIMIT=300 --name quran_data_container quran_data
   ```

   - `-d`: تشغيل الحاوية في الخلفية.
   - `-p 3000:5000`: تعيين المنفذ 5000 في الحاوية إلى المنفذ 3000 على جهازك.
   - `--name quran_data_container`: تعيين اسم للحاوية.

2. **الوصول إلى التطبيق:**

   يمكنك الوصول إلى التطبيق عبر متصفح الويب باستخدام العنوان التالي:

   ```
   http://localhost:3000
   ```

### إيقاف الحاوية

لإيقاف الحاوية، استخدم الأمر التالي:

```bash
docker stop quran_data_container
```

### حذف الحاوية والصورة

إذا كنت ترغب في حذف الحاوية والصورة، استخدم الأوامر التالية:

```bash
docker rm quran_data_container
docker rmi quran_data
```

## المساهمة

إذا كنت ترغب في المساهمة في هذا المشروع، يرجى فتح طلبات سحب (Pull Requests) عبر GitHub وتقديم اقتراحاتك أو التعديلات التي ترغب في إضافتها.

## الترخيص

يتم ترخيص هذا المشروع تحت [رخصة MIT](./LICENSE).

- مثال على الواجهة [quran-data](https://quran.i8x.net/)

## تحميل القاعدة

<div align="center">

[![json](./unused/but-json.png)](https://github.com/rn0x/Quran-Json/releases/download/v2.0.0/database.json)

[![sqlite](./unused/but-sqlite.png)](https://github.com/rn0x/Quran-Json/releases/download/v2.0.0/database.sqlite)

[![csv](./unused/but-csv.png)](https://github.com/rn0x/Quran-Json/releases/download/v2.0.0/database.csv)

</div>
