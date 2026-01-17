# 🔄 Proxy Server - מדריך הפעלה

## 🎯 למה נדרש Proxy Server?

בגלל הגבלות **CORS** (Cross-Origin Resource Sharing) בדפדפנים, לא ניתן לשלוח בקשות API ישירות מהאפליקציה (localhost:3001) לשרת cPanel (shlomi.online:2083).

**הפתרון:** שרת Proxy מקומי שמתווך בין הדפדפן ל-cPanel!

```
Browser (localhost:3001)
    ↓ [No CORS!]
Proxy Server (localhost:3002)
    ↓ [API calls]
cPanel (shlomi.online:2083)
```

---

## 🚀 הפעלה מהירה

### אופציה 1: הרצת שני השרתים בנפרד (מומלץ!)

פתח **2 טרמינלים**:

**טרמינל 1 - Proxy Server:**
```bash
npm run server
```

אתה אמור לראות:
```
🚀 EduGen2 Proxy Server running on http://localhost:3002
   Health check: http://localhost:3002/health
   Ready to proxy cPanel uploads!
```

**טרמינל 2 - Vite Dev Server:**
```bash
npm run dev
```

אתה אמור לראות:
```
VITE v6.2.0  ready in XXX ms
➜  Local:   http://localhost:3001/
```

---

### אופציה 2: הרצת שני השרתים ביחד

**טרמינל אחד - הכל יחד:**
```bash
npm run start:all
```

זה יריץ את שני השרתים במקביל! 🎉

---

## ✅ בדיקה שהכל עובד

### 1. בדוק שהProxy Server רץ

פתח דפדפן ב:
```
http://localhost:3002/health
```

אתה אמור לראות:
```json
{
  "status": "ok",
  "message": "EduGen2 Proxy Server is running",
  "timestamp": "2026-01-16T..."
}
```

### 2. בדוק את האפליקציה

פתח:
```
http://localhost:3001
```

צור קורס, סמן ✅ "העלאה אוטומטית", ולחץ Export!

---

## 🔧 איך זה עובד מאחורי הקלעים?

### ארכיטקטורה:

```
┌─────────────────────────────────────────────┐
│  Browser (React App)                         │
│  http://localhost:3001                      │
│                                              │
│  [User clicks Export + Upload]              │
│         ↓                                    │
│  uploadService.ts:                          │
│  - Converts ZIP to Base64                   │
│  - fetch('http://localhost:3002/api/...')  │
└──────────────────┬──────────────────────────┘
                   │ No CORS!
                   ↓
┌─────────────────────────────────────────────┐
│  Proxy Server (Node.js/Express)             │
│  http://localhost:3002                      │
│                                              │
│  server.js:                                 │
│  - Receives ZIP (Base64)                    │
│  - Converts to Buffer                       │
│  - Sends to cPanel API                      │
│         ↓                                    │
│  Routes:                                    │
│  POST /api/upload-course                    │
│  POST /api/test-cpanel                      │
│  GET  /health                               │
└──────────────────┬──────────────────────────┘
                   │ HTTPS + Auth
                   ↓
┌─────────────────────────────────────────────┐
│  cPanel API                                 │
│  https://shlomi.online:2083                │
│                                              │
│  - Upload: /execute/Fileman/upload_files   │
│  - Extract: /execute/Fileman/extract_files │
│  - Delete: /execute/Fileman/delete_files   │
└─────────────────────────────────────────────┘
```

---

## 📡 API Endpoints

### 1. **Health Check**
```http
GET http://localhost:3002/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "EduGen2 Proxy Server is running",
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

---

### 2. **Test cPanel Connection**
```http
POST http://localhost:3002/api/test-cpanel
Content-Type: application/json

{
  "cpanelHost": "shlomi.online",
  "cpanelUsername": "shlomion",
  "cpanelApiToken": "YOUR_TOKEN",
  "targetPath": "public_html/Resources"
}
```

**Response:**
```json
{
  "success": true,
  "message": "חיבור ל-cPanel הצליח! ✅",
  "filesCount": 5
}
```

---

### 3. **Upload Course (Complete Workflow)**
```http
POST http://localhost:3002/api/upload-course
Content-Type: application/json

{
  "zipBase64": "UEsDBBQAAA...",
  "courseName": "AI-Agents-2025",
  "config": {
    "cpanelHost": "shlomi.online",
    "cpanelUsername": "shlomion",
    "cpanelApiToken": "YOUR_TOKEN",
    "targetPath": "public_html/Resources"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "קורס \"AI-Agents-2025\" הועלה בהצלחה...",
  "url": "https://bdnhost.net/Resources/AI-Agents-2025/"
}
```

זה מריץ אוטומטית:
1. ✅ Upload ZIP → cPanel
2. ✅ Extract ZIP → תיקייה
3. ✅ Delete ZIP → ניקוי

---

## ⚙️ הגדרות מתקדמות

### שינוי פורט של Proxy

**`.env.local`:**
```bash
PROXY_PORT=3002
PROXY_URL=http://localhost:3002
```

אם פורט 3002 תפוס, שנה ל-3003 או כל מספר אחר.

### הפעלה ב-Production Mode

```bash
# Build the frontend
npm run build

# Serve via Vite preview
npm run preview

# Run proxy (separate terminal)
npm run server
```

---

## 🐛 פתרון בעיות

### ❌ "שרת ה-Proxy לא רץ"

**בעיה:** האפליקציה מנסה להתחבר ל-proxy אבל הוא לא רץ.

**פתרון:**
```bash
# הרץ את הproxy בטרמינל נפרד:
npm run server

# או הרץ הכל ביחד:
npm run start:all
```

---

### ❌ "Error: listen EADDRINUSE :::3002"

**בעיה:** פורט 3002 כבר בשימוש.

**פתרון 1 - סגור תהליך קיים:**
```bash
# Windows (PowerShell):
Get-Process -Name node | Stop-Process -Force

# Linux/Mac:
lsof -ti:3002 | xargs kill -9
```

**פתרון 2 - שנה פורט:**

`.env.local`:
```bash
PROXY_PORT=3003
```

`services/uploadService.ts`:
```typescript
const PROXY_URL = process.env.PROXY_URL || 'http://localhost:3003';
```

---

### ❌ "Cannot find module 'express'"

**בעיה:** Dependencies לא מותקנים.

**פתרון:**
```bash
npm install
```

---

### ❌ "Upload failed: 401 Unauthorized"

**בעיה:** API Token לא תקין או פג תוקף.

**פתרון:**
1. התחבר ל-cPanel: https://shlomi.online:2083
2. Security → Manage API Tokens
3. מחק את ה-Token הישן
4. צור Token חדש עם "Full Access"
5. עדכן ב-`.env.local`
6. הפעל מחדש את ה-proxy: `npm run server`

---

### ⚠️ Proxy רץ אבל לא מגיב

**בדיקה:**
```bash
# בדוק שהproxy רץ:
curl http://localhost:3002/health

# או בדפדפן:
http://localhost:3002/health
```

אם אתה רואה `{"status":"ok"}` - הproxy עובד!

---

## 🔐 אבטחה

### ✅ מה בטוח:

- ה-API Token לא נחשף לדפדפן
- כל הקריאות דרך HTTPS
- הproxy רץ רק ב-localhost (לא נגיש מרשת חיצונית)
- Token מאוחסן ב-`.env.local` (לא ב-Git)

### ⚠️ הערות אבטחה:

1. **אל תריץ את הproxy על פורט פתוח לאינטרנט** (רק localhost!)
2. **אל תשתף את ה-Token** עם אחרים
3. **אל תעלה `.env.local` ל-GitHub**
4. בproduction - **העבר את הproxy לשרת מרוחק** מאובטח

---

## 📊 Logs

הProxy Server מדפיס logs מפורטים:

```
[Upload] Starting upload of AI-Agents-2025...
[Upload] ✅ ZIP uploaded successfully
[Extract] Extracting AI-Agents-2025.zip...
[Extract] ✅ ZIP extracted successfully
[Delete] Cleaning up AI-Agents-2025.zip...
[Delete] ✅ ZIP deleted (cleanup))
[Workflow] ✅ Complete! Course available at: https://bdnhost.net/Resources/AI-Agents-2025/
```

---

## 💡 טיפים

### 1. הרץ את הProxy ברקע (Linux/Mac)

```bash
npm run server &
```

### 2. הוסף alias מהיר

**PowerShell:**
```powershell
function Start-EduGen {
    Start-Process powershell -ArgumentList "npm run server" -NoNewWindow
    npm run dev
}
```

**Bash:**
```bash
alias edugen='npm run server & npm run dev'
```

### 3. בדוק שני השרתים רצים

```bash
# Proxy:
curl http://localhost:3002/health

# Vite:
curl http://localhost:3001
```

---

## 🎉 סיכום

עכשיו יש לך:

✅ **Proxy Server** - מתווך בין הדפדפן ל-cPanel
✅ **ללא CORS** - הבעיה נפתרה!
✅ **העלאה אוטומטית** - עובדת מצוין
✅ **שני סקריפטים:**
   - `npm run server` - רק proxy
   - `npm run start:all` - proxy + vite יחד

**הרץ את הproxy ותהנה מהעלאה אוטומטית! 🚀**
