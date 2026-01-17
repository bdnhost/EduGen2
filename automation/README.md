# 🤖 EduGen2 Automation System

מערכת ייצור קורסים אוטומטית עבור EduGen2.

## 📁 קבצים

- **config.json** - הגדרות מערכת האוטומציה
- **queue.json** - רשימת נושאים לקורסים
- **progress.json** - לוג התקדמות והיסטוריה
- **autoGenerator.js** - מנוע ייצור הקורסים
- **scheduler.js** - מתזמן להרצה אוטומטית

## 🚀 התקנה

```bash
# התקן את התלויות החדשות
npm install
```

## ⚙️ הגדרה

### 1. ערוך את `config.json`

```json
{
  "schedule": {
    "enabled": true,           // הפעל/כבה אוטומציה
    "interval": "hourly"       // תדירות: hourly, daily, weekly
  },
  "limits": {
    "maxCoursesPerDay": 4,     // מקסימום קורסים ליום
    "maxCoursesPerRun": 1      // כמה קורסים בכל הרצה
  },
  "autoUpload": {
    "enabled": true            // העלאה אוטומטית לשרת
  }
}
```

### 2. הוסף נושאים ל-`queue.json`

```json
{
  "courses": [
    {
      "id": 1,
      "topic": "מבוא לבינה מלאכותית",
      "status": "pending",
      "priority": 1
    }
  ]
}
```

## 📝 שימוש

### יצירת קורס בודד (ידנית)

```bash
npm run auto:generate
```

### בדיקת סטטוס

```bash
npm run auto:status
```

### הפעלת מתזמן

```bash
# רץ לפי לוח זמנים
npm run auto:scheduler

# רץ מיד + לפי לוח זמנים
npm run auto:scheduler:now
```

## 🎛️ אפשרויות לוח זמנים

ערוך `config.json`:

### תדירויות מוכנות:
- `"hourly"` - כל שעה
- `"daily"` - פעם ביום (9:00 בבוקר)
- `"weekly"` - פעם בשבוע (יום ראשון 9:00)
- `"every-6-hours"` - כל 6 שעות
- `"every-12-hours"` - כל 12 שעות

### Cron מותאם אישית:
```json
{
  "schedule": {
    "customCron": "0 */2 * * *"  // כל שעתיים
  }
}
```

פורמט Cron:
```
* * * * *
│ │ │ │ │
│ │ │ │ └── יום בשבוע (0-6, 0=ראשון)
│ │ │ └──── חודש (1-12)
│ │ └────── יום בחודש (1-31)
│ └──────── שעה (0-23)
└────────── דקה (0-59)
```

## 📊 מעקב אחר התקדמות

### בטרמינל (CLI)

```bash
npm run auto:status
```

תוצאה:
```json
{
  "queue": {
    "pending": 3,
    "completed": 1,
    "failed": 0
  },
  "progress": {
    "totalGenerated": 1,
    "coursesGeneratedToday": 1
  }
}
```

### בקובץ progress.json

כל קורס שנוצר נשמר בהיסטוריה:

```json
{
  "history": [
    {
      "id": 1,
      "topic": "בינה מלאכותית",
      "timestamp": "2025-01-17T10:00:00Z",
      "uploaded": true,
      "url": "https://bdnhost.net/Resources/..."
    }
  ]
}
```

## 🔔 התראות

המערכת מציגה התראות:
- ✅ קורס נוצר בהצלחה
- 📤 קורס הועלה לשרת
- ⚠️ הגעת למגבלה יומית
- ❌ שגיאה ביצירת קורס

## 🛠️ טיפול בשגיאות

אם יצירת קורס נכשלת:
- הקורס מסומן כ-`failed` ב-queue.json
- השגיאה נשמרת ב-progress.json
- המערכת ממשיכה לקורס הבא (לפי הגדרת `retry.onError`)

## 📋 דוגמאות שימוש

### דוגמה 1: ייצור יומי בשעה 9 בבוקר

```json
{
  "schedule": {
    "enabled": true,
    "interval": "daily"
  },
  "limits": {
    "maxCoursesPerDay": 4
  }
}
```

```bash
npm run auto:scheduler
```

### דוגמה 2: ייצור ידני של קורס בודד

```bash
npm run auto:generate
```

### דוגמה 3: בדיקת התקדמות

```bash
npm run auto:status
```

## 🔄 שדרוג מקובץ CSV

אם יש לך רשימת נושאים ב-CSV, ניתן להמיר אותה ל-JSON:

```csv
priority,topic
1,מבוא לבינה מלאכותית
2,Excel מתקדם
3,עיצוב UI/UX
```

המרה:
```bash
# TODO: להוסיף סקריפט המרה
```

## 📞 תמיכה

- בעיות? פתח Issue ב-GitHub
- שאלות? בדוק את [GUIDE.md](../GUIDE.md)

---

**הערה:** מערכת האוטומציה היא בגרסת Beta. נא לבדוק את הפלט לפני שימוש בייצור.
