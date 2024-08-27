# وثائق API - Quran Data

هذه الوثائق تشرح واجهات برمجة التطبيقات (API) المستخدمة في مشروع `quran_data`. تحتوي الوثائق على معلومات حول كيفية استخدام كل نقطة نهاية (endpoint) وكيفية التعامل مع الاستجابات والأخطاء المحتملة.

---

## 1. نظرة عامة

- **القاعدة الأساسية**: `http://localhost:PORT/api`
- **إعدادات CORS**: مفعلة 🌐
- **تحديد معدل الطلبات**: مفعل ⏳

---

## 2. نقاط النهاية (Endpoints)

### 2.1. الحصول على جميع السور

- **الطريقة**: `GET`
- **النقطة النهاية**: `/api/surahs`
- **الاستعلامات (Queries)**:
  - `number` (اختياري): رقم السورة
  - `verseNumber` (اختياري): رقم الآية
  - `sajda` (اختياري): إذا كانت قيمة `true`، سيتم جلب الآيات التي تحتوي على سجود
- **الاستجابة**:
  - **200 OK**: عند النجاح، يتم إرجاع بيانات السور أو الآية أو الآيات.
  - **404 Not Found**: إذا لم يتم العثور على المورد المطلوب.
  - **500 Internal Server Error**: عند حدوث خطأ في الخادم.

**مثال على طلب:**

**طلب:**
```http
GET /api/surahs
```

**استجابة:**
```json
{
  "success": true,
  "result": [ /* بيانات السور */ ]
}
```

### 2.2. الحصول على جميع الآيات لسورة معينة

- **الطريقة**: `GET`
- **النقطة النهاية**: `/api/surahs/verses`
- **الاستعلامات (Queries)**:
  - `number`: رقم السورة
- **الاستجابة**:
  - **200 OK**: عند النجاح، يتم إرجاع بيانات الآيات للسورة المحددة.
  - **404 Not Found**: إذا لم يتم العثور على الآيات للسورة المحددة.
  - **500 Internal Server Error**: عند حدوث خطأ في الخادم.

**مثال على طلب:**

**طلب:**
```http
GET /api/surahs/verses?number=1
```

**استجابة:**
```json
{
  "success": true,
  "result": [ /* بيانات الآيات للسورة 1 */ ]
}
```

### 2.3. الحصول على الصوتيات لسورة معينة

- **الطريقة**: `GET`
- **النقطة النهاية**: `/api/surahs/audio`
- **الاستعلامات (Queries)**:
  - `number`: رقم السورة
- **الاستجابة**:
  - **200 OK**: عند النجاح، يتم إرجاع بيانات الصوتيات للسورة المحددة.
  - **404 Not Found**: إذا لم يتم العثور على الصوتيات للسورة المحددة.
  - **500 Internal Server Error**: عند حدوث خطأ في الخادم.

**مثال على طلب:**

**طلب:**
```http
GET /api/surahs/audio?number=1
```

**استجابة:**
```json
{
  "success": true,
  "result": [ /* بيانات الصوتيات للسورة 1 */ ]
}
```

### 2.4. الحصول على الآيات في جزء معين

- **الطريقة**: `GET`
- **النقطة النهاية**: `/api/surahs/juz`
- **الاستعلامات (Queries)**:
  - `number`: رقم الجزء
- **الاستجابة**:
  - **200 OK**: عند النجاح، يتم إرجاع جميع الآيات في الجزء المحدد.
  - **404 Not Found**: إذا لم يتم العثور على أي آيات في الجزء المحدد.
  - **500 Internal Server Error**: عند حدوث خطأ في الخادم.

**مثال على طلب:**

**طلب:**
```http
GET /api/surahs/juz?number=1
```

**استجابة:**
```json
{
  "success": true,
  "result": [ /* بيانات الآيات في الجزء 1 */ ]
}
```

### 2.5. الحصول على الآيات التي تحتوي على سجود

- **الطريقة**: `GET`
- **النقطة النهاية**: `/api/surahs/sajda`
- **الاستجابة**:
  - **200 OK**: عند النجاح، يتم إرجاع الآيات التي تحتوي على سجود.
  - **404 Not Found**: إذا لم يتم العثور على آيات تحتوي على سجود.
  - **500 Internal Server Error**: عند حدوث خطأ في الخادم.

**مثال على طلب:**

**طلب:**
```http
GET /api/surahs/sajda
```

**استجابة:**
```json
{
  "success": true,
  "result": [ /* بيانات الآيات التي تحتوي على سجود */ ]
}
```

---

## 3. إدارة الأخطاء

- **المعالجة**: يتم التعامل مع الأخطاء من خلال `errorHandler` و `notFoundHandler`.
- **الأخطاء المحتملة**:
  - **404 Not Found**: عند طلب مورد غير موجود.
  - **500 Internal Server Error**: عند حدوث خطأ غير متوقع في الخادم.

---

## 4. تفاصيل تكوين الخادم

- **المنفذ**: يتم تحديده في `config.mjs`.
- **إعدادات CORS**: مفعلة لجميع المصادر 🌐
- **تحديد معدل الطلبات**: مفعلة لتحديد عدد الطلبات المسموح بها ⏳

---

## 5. أمثلة على الاستخدام

### 5.1. JavaScript

**مثال على استخدام `fetch` في JavaScript:**

```javascript
// الحصول على جميع السور
fetch('http://localhost:PORT/api/surahs')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// الحصول على جميع الآيات لسورة معينة
fetch('http://localhost:PORT/api/surahs/verses?number=1')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

### 5.2. cURL

**مثال على استخدام cURL:**

```bash
# الحصول على جميع السور
curl -X GET "http://localhost:PORT/api/surahs"
# الحصول على جميع الآيات لسورة معينة
curl -X GET "http://localhost:PORT/api/surahs/verses?number=1"
```

### 5.3. Python

**مثال على استخدام `requests` في Python:**

```python
import requests

# الحصول على جميع السور
response = requests.get('http://localhost:PORT/api/surahs')
data = response.json()
print(data)

# الحصول على جميع الآيات لسورة معينة
response = requests.get('http://localhost:PORT/api/surahs/verses', params={'number': 1})
data = response.json()
print(data)
```