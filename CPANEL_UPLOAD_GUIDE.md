# 📤 מדריך העלאה אוטומטית ל-cPanel

## 🎯 סקירה

מערכת EduGen2 כעת תומכת ב**העלאה אוטומטית** של קורסים שנוצרו ישירות ל-**bdnhost.net/Resources/**!

לאחר יצירת קורס (ZIP), המערכת יכולה להעלות אותו אוטומטית לשרת cPanel שלך, לחלץ אותו, ולפרסם אותו ברשת - הכל בלחיצת כפתור אחת! 🚀

---

## 🔑 שלב 1: הגדרת API Token ב-cPanel

### 1.1 התחברות ל-cPanel

```
https://shlomi.online:2083
```

- **Username:** shlomion
- **Password:** (הססמה שלך)

### 1.2 יצירת API Token

1. בתפריט cPanel, חפש **"Manage API Tokens"** (תחת Security)
2. לחץ על **"Create"**
3. מלא את הפרטים:
   - **Name:** `EduGen2-Upload`
   - **Permissions:** בחר **"All Features"** או לפחות **"Files"**
   - אל תגדיר תאריך תפוגה (או שים תאריך רחוק)
4. לחץ **"Create"**
5. **העתק את ה-Token** (מתחיל ב-`YOUR_TOKEN_HERE...`)

⚠️ **חשוב:** ה-Token מוצג רק פעם אחת! שמור אותו במקום בטוח.

---

## ⚙️ שלב 2: הגדרת המערכת

### 2.1 עדכון `.env.local`

ערוך את הקובץ `.env.local` בשורש הפרויקט:

```bash
# cPanel Auto-Upload Configuration
CPANEL_HOST=shlomi.online
CPANEL_USERNAME=shlomion
CPANEL_API_TOKEN=YOUR_ACTUAL_TOKEN_HERE_FROM_STEP_1
CPANEL_TARGET_PATH=public_html/Resources

# Set to 'true' to enable auto-upload by default
AUTO_UPLOAD_ENABLED=true
```

### 2.2 החלף את ה-Token

במקום `YOUR_ACTUAL_TOKEN_HERE_FROM_STEP_1`, הדבק את ה-Token האמיתי שקיבלת מ-cPanel.

**דוגמה:**
```
CPANEL_API_TOKEN=ABC123XYZ456...
```

---

## 🚀 שלב 3: שימוש במערכת

### 3.1 הפעלת השרת

```bash
npm run dev
```

### 3.2 יצירת קורס

1. הזן נושא לקורס (למשל: "סוכני AI 2025")
2. המתן ליצירת הסילבוס
3. לחץ על **"ייצור ויצוא אחוד (ZIP)"**

### 3.3 העלאה אוטומטית

תראה checkbox חדש תחת הכפתור:

```
☑️ העלאה אוטומטית ל-bdnhost.net
```

- **✅ מסומן:** הקורס יועלה אוטומטית + יורד למחשב
- **☐ לא מסומן:** רק הורדה למחשב (ללא העלאה)

### 3.4 תהליך ההעלאה

כאשר העלאה אוטומטית מופעלת:

1. **יצירת הקורס** - מייצר את כל הפרקים
2. **הורדה מקומית** - שומר ZIP במחשב שלך
3. **העלאה לשרת** 📤 - מעלה את ה-ZIP ל-cPanel
4. **חילוץ** 📦 - מחלץ את הקבצים בשרת
5. **ניקוי** 🧹 - מוחק את ה-ZIP (משאיר רק תיקייה)
6. **הצלחה!** 🎉 - הקורס זמין ברשת

---

## 🌐 גישה לקורסים שהועלו

לאחר העלאה מוצלחת, הקורס יהיה זמין ב:

```
https://bdnhost.net/Resources/[Course-Name]/
```

**דוגמה:**
```
https://bdnhost.net/Resources/AI-Agents-2025/
https://bdnhost.net/Resources/AI-Agents-2025/index.html
https://bdnhost.net/Resources/AI-Agents-2025/lesson-1.html
```

---

## 🛠️ פתרון בעיות

### ❌ "Invalid API token"

**בעיה:** ה-Token לא תקין או פג תוקף.

**פתרון:**
1. צור Token חדש ב-cPanel
2. עדכן את `.env.local` עם ה-Token החדש
3. הפעל מחדש את `npm run dev`

---

### ❌ "Upload failed: 403 Forbidden"

**בעיה:** ה-Token לא מורשה לגשת ל-File Manager.

**פתרון:**
1. ב-cPanel, מחק את ה-Token הישן
2. צור Token חדש עם **"All Features"** permission
3. עדכן את `.env.local`

---

### ❌ "Cannot write to directory"

**בעיה:** התיקייה `public_html/Resources` לא קיימת או אין הרשאות כתיבה.

**פתרון:**
1. התחבר ל-cPanel File Manager
2. וודא שהתיקייה `/home4/shlomion/public_html/Resources` קיימת
3. אם לא, צור אותה:
   - נווט ל-`public_html`
   - לחץ **"+ Folder"**
   - שם: `Resources`

---

### ⚠️ "Upload succeeded but extraction failed"

**בעיה:** הקובץ הועלה אבל לא חולץ.

**פתרון:**
1. התחבר ל-cPanel File Manager
2. נווט ל-`public_html/Resources`
3. מצא את קובץ ה-ZIP
4. לחיצה ימנית → **"Extract"**
5. מחק את ה-ZIP לאחר החילוץ

---

### 🐌 "העלאה איטית"

**סיבה:** קורסים גדולים (5 פרקים) יכולים לקחת 10-30 שניות להעלות.

**טיפ:**
- אל תסגור את הדפדפן בזמן ההעלאה
- המתן להודעת "הצלחה!"
- הקובץ גם כן נשמר במחשב שלך (בזמן ההעלאה)

---

## 🔒 אבטחה

### ✅ מה בטוח

- ה-API Token מאוחסן ב-`.env.local` (לא נשלח ל-Git)
- ה-Token מוצפן ב-HTTPS
- רק אתה (בעל החשבון) יכול ליצור Token
- ניתן לבטל Token בכל עת ב-cPanel

### ⚠️ אל תעשה

- **אל תשתף** את ה-API Token עם אף אחד
- **אל תעלה** את `.env.local` ל-GitHub
- **אל תפרסם** את ה-Token בפומבי
- **אל תשאיר** Token עם "All Features" אם אינך צריך

---

## 🎛️ תצורות מתקדמות

### שינוי נתיב היעד

אם אתה רוצה להעלות לתיקייה אחרת:

```bash
# .env.local
CPANEL_TARGET_PATH=public_html/MyCustomFolder
```

### ביטול העלאה אוטומטית כברירת מחדל

```bash
# .env.local
AUTO_UPLOAD_ENABLED=false
```

עדיין תוכל להפעיל בממשק עם ה-checkbox.

---

## 📊 מה עובד מאחורי הקלעים?

### תהליך העלאה טכני:

1. **`uploadService.ts`** - קובץ שירות חדש
   - `uploadToCPanel()` - פונקציה ראשית
   - `uploadZipFile()` - מעלה באמצעות cPanel UAPI `Fileman::upload_files`
   - `extractZipOnServer()` - מחלץ באמצעות `Fileman::extract_files`
   - `deleteZipFile()` - מנקה ZIP באמצעות `Fileman::delete_files`

2. **cPanel UAPI** - ממשק API של cPanel
   - Endpoint: `https://shlomi.online:2083/execute/Fileman/...`
   - Auth: Basic (Base64)
   - Method: GET/POST
   - Format: JSON

3. **App.tsx** - שילוב בממשק
   - `autoUploadEnabled` state
   - `uploadStatus` state
   - `downloadAsZip()` - מעלה לאחר יצירת ZIP

---

## 🧪 בדיקת החיבור

אם אתה רוצה לבדוק שה-Token עובד לפני יצירת קורס:

### 1. פתח Browser Console (F12)

### 2. הרץ:

```javascript
const config = {
  cpanelHost: 'shlomi.online',
  cpanelUsername: 'shlomion',
  cpanelApiToken: 'YOUR_TOKEN',
  targetPath: 'public_html/Resources'
};

const auth = btoa(`${config.cpanelUsername}:${config.cpanelApiToken}`);

fetch(`https://${config.cpanelHost}:2083/execute/Fileman/list_files?dir=/${config.targetPath}`, {
  headers: { 'Authorization': `Basic ${auth}` }
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(e => console.error('Error:', e));
```

אם אתה רואה `Success:` עם רשימת קבצים - הכל עובד! ✅

---

## 💡 שאלות נפוצות

### Q: האם אני חייב להשתמש בהעלאה אוטומטית?
**A:** לא! זה אופציונלי לחלוטין. אם ה-checkbox לא מסומן, הקורס רק יורד למחשב שלך.

### Q: מה קורה אם אני מעלה קורס עם אותו שם פעמיים?
**A:** הקורס הישן יוחלף (overwrite). זה שימושי לעדכונים.

### Q: האם אני יכול להעלות ידנית?
**A:** כן! הורד את ה-ZIP והעלה אותו ידנית דרך cPanel File Manager.

### Q: כמה זמן לוקחת העלאה?
**A:** 10-30 שניות לקורס של 5 פרקים (תלוי במהירות האינטרנט).

### Q: האם אני יכול להשבית את ההעלאה זמנית?
**A:** כן! פשוט הסר את הסימון מה-checkbox לפני לחיצה על "ייצור ויצוא".

### Q: מה הגודל המקסימלי לקובץ?
**A:** cPanel בדרך כלל מאפשר עד 50MB. קורסי EduGen2 בדרך כלל 1-5MB.

---

## 🎉 סיכום

עכשיו יש לך:

✅ **יצירת קורסים** - AI מייצר תוכן חינוכי מקצועי
✅ **הורדה מקומית** - ZIP נשמר במחשב שלך
✅ **העלאה אוטומטית** - קורס מתפרסם אוטומטית ברשת
✅ **ממשק פשוט** - checkbox אחד להפעלה/כיבוי
✅ **בטיחות** - API Token מוצפן ומאובטח

**תהנה מהיעילות החדשה! 🚀**

---

## 📞 תמיכה

אם יש בעיות:

1. בדוק את Browser Console (F12) לשגיאות
2. ודא שה-Token תקין ב-cPanel
3. נסה ליצור Token חדש עם "All Features"
4. בדוק שהתיקייה `public_html/Resources` קיימת

**זקוק לעזרה נוספת?** פנה לתמיכה טכנית. 💬
