# 🔄 מדריך המרה ל-OpenRouter - EduGen2

## 📋 סיכום השינויים

המערכת הומרה בהצלחה מ-**Google Gemini API** ל-**OpenRouter API**!

### ✅ מה שונה?

| היבט | לפני (Gemini) | אחרי (OpenRouter) |
|------|---------------|-------------------|
| **SDK** | `@google/genai` | `openai` |
| **API Key** | `GEMINI_API_KEY` | `OPENROUTER_API_KEY` |
| **Endpoint** | Google Gemini | `https://openrouter.ai/api/v1` |
| **Models** | gemini-3-pro-preview<br>gemini-3-flash-preview | anthropic/claude-3.5-sonnet<br>(או כל מודל אחר) |
| **Structured Output** | Type system של Gemini | JSON mode של OpenAI |
| **Grounding** | Google Search (הוסר) | אין (לא נדרש) |

---

## 🚀 הוראות הפעלה מהירות

### שלב 1: השג API Key מ-OpenRouter

1. **גש ל-[OpenRouter](https://openrouter.ai/keys)**
2. **התחבר** עם Google/GitHub או צור חשבון
3. **לחץ על "Create Key"**
4. **העתק את המפתח** (מתחיל ב-`sk-or-v1-...`)
5. **הוסף קרדיט** (לפחות $5) ב-[דף הביילינג](https://openrouter.ai/credits)

### שלב 2: הגדר את המפתח בפרויקט

ערוך את הקובץ `.env.local`:

```bash
OPENROUTER_API_KEY=sk-or-v1-YOUR-ACTUAL-KEY-HERE
```

### שלב 3: הרץ את האפליקציה

```bash
npm run dev
```

פתח דפדפן ב-`http://localhost:3000` ✅

---

## 🧠 בחירת מודלים

### מודלים מומלצים (בקובץ `services/aiService.ts`):

#### 1️⃣ **Claude 3.5 Sonnet** (ברירת מחדל - מומלץ!)

```typescript
const MODELS = {
  CONTENT_GENERATION: "anthropic/claude-3.5-sonnet",
  TREND_DISCOVERY: "anthropic/claude-3.5-sonnet",
  STUDENT_INSIGHTS: "anthropic/claude-3.5-sonnet"
};
```

**יתרונות:**
- ✅ איכות גבוהה מאוד בעברית
- ✅ מצוין לתוכן חינוכי מורכב
- ✅ תמיכה טובה ב-JSON mode
- 💰 **עלות:** ~$3 לכל מליון tokens

---

#### 2️⃣ **GPT-4 Turbo** (חלופה מצוינת)

```typescript
const MODELS = {
  CONTENT_GENERATION: "openai/gpt-4-turbo",
  TREND_DISCOVERY: "openai/gpt-4-turbo",
  STUDENT_INSIGHTS: "openai/gpt-3.5-turbo" // זול יותר לתובנות פשוטות
};
```

**יתרונות:**
- ✅ מהיר מאוד
- ✅ איכות גבוהה
- ✅ תמיכה מצוינת ב-JSON
- 💰 **עלות:** ~$10 לכל מליון tokens

---

#### 3️⃣ **Gemini Pro 1.5** (להישאר עם Gemini!)

```typescript
const MODELS = {
  CONTENT_GENERATION: "google/gemini-pro-1.5",
  TREND_DISCOVERY: "google/gemini-pro-1.5",
  STUDENT_INSIGHTS: "google/gemini-pro-1.5"
};
```

**יתרונות:**
- ✅ זול מאוד!
- ✅ נשאר עם Google אבל דרך OpenRouter
- ✅ איכות טובה
- 💰 **עלות:** ~$0.50 לכל מליון tokens

---

#### 4️⃣ **GPT-3.5 Turbo** (אופציה חסכונית)

```typescript
const MODELS = {
  CONTENT_GENERATION: "openai/gpt-4-turbo", // תוכן מורכב
  TREND_DISCOVERY: "openai/gpt-3.5-turbo",  // רעיונות
  STUDENT_INSIGHTS: "openai/gpt-3.5-turbo"  // תובנות
};
```

**יתרונות:**
- ✅ זול מאוד!
- ✅ מהיר
- ⚠️ איכות בינונית בעברית
- 💰 **עלות:** ~$0.50 לכל מליון tokens

---

## 🔧 שינויים טכניים מפורטים

### 1. **החלפת SDK**

**לפני:**
```typescript
import { GoogleGenAI, Type } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**אחרי:**
```typescript
import OpenAI from "openai";
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true
});
```

---

### 2. **פורמט קריאות API**

**לפני (Gemini):**
```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Your prompt here",
  config: {
    responseMimeType: "application/json",
    responseSchema: { type: Type.OBJECT, properties: {...} }
  }
});
```

**אחרי (OpenRouter):**
```typescript
const response = await openrouter.chat.completions.create({
  model: "anthropic/claude-3.5-sonnet",
  messages: [
    { role: "system", content: "You are an expert..." },
    { role: "user", content: "Your prompt here" }
  ],
  response_format: { type: "json_object" },
  temperature: 0.7,
  max_tokens: 3000
});
```

---

### 3. **טיפול ב-JSON Responses**

**לפני:**
```typescript
const result = JSON.parse(response.text || "{}");
```

**אחרי:**
```typescript
const content = response.choices[0]?.message?.content || "{}";
const result = parseJSONResponse(content); // מנקה markdown blocks
```

---

### 4. **הסרת Google Search Grounding**

**לפני:**
```typescript
config: {
  tools: [{ googleSearch: {} }], // חיפוש בזמן אמת
  ...
}
```

**אחרי:**
```typescript
// אין Grounding - המודל משתמש בידע שלו
// הפרומפט מבקש טרנדים "לשבוע הנוכחי" כדי לקבל מידע רלוונטי
```

---

## 💡 טיפים למעבר חלק

### 1. **בדיקת מודלים**

נסה מודלים שונים על ידי שינוי ה-`MODELS` בקובץ `services/aiService.ts`:

```typescript
// ניסוי 1: Claude 3.5 Sonnet
const MODELS = {
  CONTENT_GENERATION: "anthropic/claude-3.5-sonnet",
  TREND_DISCOVERY: "anthropic/claude-3.5-sonnet",
  STUDENT_INSIGHTS: "anthropic/claude-3.5-sonnet"
};

// ניסוי 2: GPT-4 + GPT-3.5 (חסכוני)
const MODELS = {
  CONTENT_GENERATION: "openai/gpt-4-turbo",
  TREND_DISCOVERY: "openai/gpt-3.5-turbo",
  STUDENT_INSIGHTS: "openai/gpt-3.5-turbo"
};

// ניסוי 3: Gemini דרך OpenRouter
const MODELS = {
  CONTENT_GENERATION: "google/gemini-pro-1.5",
  TREND_DISCOVERY: "google/gemini-pro-1.5",
  STUDENT_INSIGHTS: "google/gemini-pro-1.5"
};
```

### 2. **ניטור עלויות**

- בדוק את השימוש שלך ב-[OpenRouter Dashboard](https://openrouter.ai/activity)
- לכל בקשה, OpenRouter מציג כמה tokens נצרכו
- הגדר **limit חודשי** בהגדרות החשבון

### 3. **אופטימיזציה של פרומפטים**

אם התוכן לא מספיק טוב:

1. **הגדל `temperature`** (0.8-0.9) ליצירתיות יותר
2. **הוסף דוגמאות** לפרומפט (few-shot learning)
3. **נסה מודל אחר** - לכל מודל יש חוזקות שונות

### 4. **שגיאות נפוצות ופתרונות**

| שגיאה | פתרון |
|-------|--------|
| `Invalid API key` | בדוק שהמפתח נכון ב-`.env.local` |
| `Insufficient credits` | הוסף קרדיט ב-[OpenRouter Credits](https://openrouter.ai/credits) |
| `Model not found` | בדוק ש-Model ID נכון ב-[Models List](https://openrouter.ai/models) |
| `JSON parse error` | המודל החזיר טקסט לא תקין - נסה מודל אחר |
| `Rate limit exceeded` | חכה כמה שניות, או שדרג את התוכנית |

---

## 🎯 השוואת עלויות

### תרחיש לדוגמה: יצירת קורס מלא (5 פרקים)

| פעולה | Tokens (בערך) | Claude 3.5 | GPT-4 Turbo | Gemini Pro | GPT-3.5 |
|-------|---------------|------------|-------------|------------|---------|
| Syllabus | 2,000 | $0.006 | $0.020 | $0.001 | $0.001 |
| פרק 1 | 8,000 | $0.024 | $0.080 | $0.004 | $0.004 |
| פרק 2 | 8,000 | $0.024 | $0.080 | $0.004 | $0.004 |
| פרק 3 | 8,000 | $0.024 | $0.080 | $0.004 | $0.004 |
| פרק 4 | 8,000 | $0.024 | $0.080 | $0.004 | $0.004 |
| פרק 5 | 8,000 | $0.024 | $0.080 | $0.004 | $0.004 |
| **סה"כ** | **42,000** | **$0.126** | **$0.420** | **$0.021** | **$0.021** |

💡 **המלצה:** התחל עם **Gemini Pro** או **GPT-3.5** לניסויים, ועבור ל-**Claude 3.5** לייצור סופי.

---

## 📊 מעקב אחר שימוש

### בקוד (Console Logs):

פתח את Developer Tools (F12) בדפדפן וראה:

```javascript
// בכל קריאה, תראה:
Content generation completed successfully
Student insight generated
Syllabus created with 5 chapters
```

### ב-OpenRouter Dashboard:

1. גש ל-[https://openrouter.ai/activity](https://openrouter.ai/activity)
2. ראה:
   - מספר בקשות
   - Tokens שנצרכו
   - עלות כוללת
   - מודלים שנעשה בהם שימוש

---

## 🔐 אבטחה

### ⚠️ חשוב!

1. **אל תשתף את ה-API Key** שלך עם אף אחד
2. **אל תעלה `.env.local` ל-Git** (כבר ב-`.gitignore`)
3. **הגדר Rate Limits** ב-OpenRouter Dashboard
4. **השתמש ב-Environment Variables** תמיד

### Production:

אם אתה מפרסם את האפליקציה:

1. **העבר API calls לשרת** (Backend)
2. **אל תשאיר `dangerouslyAllowBrowser: true`**
3. השתמש ב-**Proxy Server** להגנה על ה-API Key

---

## 🆘 תמיכה ובעיות

### אם משהו לא עובד:

1. **בדוק את Console** (F12 → Console tab)
2. **וודא שה-API Key תקין** (`.env.local`)
3. **בדוק שיש קרדיט** ([OpenRouter Credits](https://openrouter.ai/credits))
4. **נסה מודל אחר** - אולי המודל הנוכחי לא זמין

### Logs שימושיים:

```bash
# הרץ עם logs מפורטים
npm run dev

# בדוק שגיאות ב-Browser Console (F12)
# חפש:
# - "Content generation error"
# - "Trend discovery failed"
# - "Student insight error"
```

---

## 🎉 סיכום

**המערכת הומרה בהצלחה!**

✅ OpenRouter SDK מותקן
✅ aiService.ts מעודכן
✅ vite.config.ts מוגדר
✅ .env.local מוכן לשימוש
✅ README מעודכן

**הצעד הבא שלך:**
1. השג API Key מ-[OpenRouter](https://openrouter.ai/keys)
2. שים אותו ב-`.env.local`
3. הרץ `npm run dev`
4. צור קורס ראשון! 🚀

---

**תהנה מהמעבר ל-OpenRouter! 🎓**
