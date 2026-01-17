# דו"ח טכני: בעיות במערכת מחולל המדריכים EduGen2

## סקירה כללית

לאחר ביצוע שיפורים במנוע יצירת המדריכים ובדיקת המערכת, עדיין קיימות מספר בעיות טכניות שמשפיעות על תפקוד המדריכים. בעיות אלו מתמקדות בשתי נקודות עיקריות:

1. **שגיאת JavaScript** (`Uncaught SyntaxError: Unexpected token ','`)
2. **בעיות עם נגן האודיו ותמונות**

מסמך זה מפרט את הבעיות, מזהה את הקבצים המעורבים, ומציג אבחנה טכנית מקיפה.

## בעיה #1: שגיאת JavaScript - Unexpected token ','

### תיאור הבעיה
בעת טעינת המדריך בדפדפן מופיעה השגיאה `Uncaught SyntaxError: Unexpected token ','` בקונסול, אשר מונעת את הפעלת פונקציות JavaScript מסויימות, כולל:
- כפתורי ניווט "המשך למשימה" לא עובדים
- מעבר בין מסכים לא פעיל

### קבצים מעורבים
- `services/generatorService.ts` - קובץ שמכיל את פונקציית `generateAssignmentHTML` שמייצרת את ה-HTML לדפי המדריך
- הקבצים שנוצרים: `lesson-{X}.html`

### אבחנה טכנית
בדקתי את הקוד בקובץ `generatorService.ts` וזיהיתי את הגורם האפשרי לבעיה:

1. **תבניות מחרוזת משולבות (Template strings)**: 
   ```javascript
   const audioSources = [
       { section: 0, path: "${welcomeAudioPath}", label: "הקלטת פתיחה" },
       { section: 1, path: "${caseAudioPath}", label: "הקלטת המשימה" },
       { section: 2, path: "${summaryAudioPath}", label: "הקלטת סיכום" }
   ];
   ```
   
   כאשר קוד זה נכתב לדף HTML כמחרוזת, התבניות כמו `${welcomeAudioPath}` אינן מוחלפות בנתיבים בפועל מכיוון שהן כבר בתוך תבנית מחרוזת אחת. התוצאה היא קוד JavaScript שגוי בקובץ HTML הסופי.

2. **שגיאת סגירת תג script**: ייתכן שישנה בעיה בסגירת תג `</script>` בתבנית HTML או חוסר באסקיפינג נכון.

## בעיה #2: בעיות עם תמונות ונגן האודיו

### תיאור הבעיה
1. **תמונות**: תמונות placeholder לא נטענות עם שגיאות `ERR_NAME_NOT_RESOLVED` בקונסול
2. **נגן אודיו**: האודיו לא פעיל למרות התיקונים שנעשו

### קבצים מעורבים
- `services/generatorService.ts`
- קבצי תמונה בנתיב `ch{lessonNumber}/assets/task_ch{lessonNumber}_welcome/media_{lessonNumber}.png`
- קבצי אודיו בנתיב `ch{lessonNumber}/assets/task_ch{lessonNumber}_welcome/{fileName}`

### אבחנה טכנית

**בעיית תמונות**:
למרות המעבר ל-SVG מוטמע בbase64, עדיין ישנה שגיאה. הסיבה נראית קשורה לאופן בו מיוצרת תמונת ה-placeholder. ניסיתי להחליף את קוד ה-placeholder מ:
```
onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80/f3f4f6/4f46e5?text=${s.lessonNumber}'"
```
ל:
```
onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2Z...'"
```

אך הבעיה נמשכת. ייתכן שיש בעיה ב:
1. אסקיפינג לא נכון של מחרוזות ה-base64
2. שגיאת סינטקס בתוך מחרוזת ה-JavaScript שנוצרת

**בעיית האודיו**:
1. שגיאה בנתיבי קבצים - הנתיבים לא מקודדים נכון
2. עדיין ישנה בעיה ב-`audioSources` כי הנתיבים לא מוחלפים בערכים הנכונים בגלל בעיית התבניות

## המלצות לפתרון

### לשגיאת JavaScript

1. **שינוי גישת יצירת קוד ה-JavaScript**:
   במקום להשתמש בתבניות מחרוזת בתוך תבנית מחרוזת, ליצור את ה-JavaScript באופן שונה:
   ```javascript
   const audioSourcesJS = `
   const audioSources = [
       { section: 0, path: "${welcomeAudioPath.replace(/\\/g, '\\\\')}", label: "הקלטת פתיחה" },
       { section: 1, path: "${caseAudioPath.replace(/\\/g, '\\\\')}", label: "הקלטת המשימה" },
       { section: 2, path: "${summaryAudioPath.replace(/\\/g, '\\\\')}", label: "הקלטת סיכום" }
   ];`;
   ```
   ואז לשבץ את המחרוזת `audioSourcesJS` בתוך ה-HTML.

2. **בדיקת HTML סופי מיוצר**:
   לפני פרסום המדריך, לשמור קובץ HTML מוכן אחד בדיסק ולבדוק בו את תקינות קוד ה-JavaScript.

### לבעיית תמונות/אודיו

1. **פתרון קבוע לתמונות placeholder**:
   לייצר תמונות ממשיות בשלב יצירת המדריך, או לכלול את התמונות הבסיסיות בתיקיית assets של המדריך.

2. **נגן אודיו חלופי**:
   לשקול החלפת מימוש נגן האודיו לגישה פשוטה יותר שאינה מסתמכת על JavaScript דינמי.

3. **בעיית encodingUri**:
   לוודא שנעשה שימוש נכון ב-`encodeURIComponent` עבור הנתיבים, ולוודא שאין שימוש כפול.

## הערכה כללית

הבעיה המרכזית נראית קשורה ל**אסקיפינג ותבניות מחרוזת משולבות** בקובץ `services/generatorService.ts`. כאשר מייצרים HTML המכיל JavaScript באמצעות תבניות מחרוזת, יש לשים לב במיוחד לאופן בו משולבים המשתנים והמחרוזות, במיוחד כאשר יש צורך לשמר משתני JavaScript (כגון `${variable}`) בקוד הסופי.

צעד נכון לבדיקה ופתרון הוא ליצור גישה אלטרנטיבית לניהול קוד ה-JavaScript - למשל, לשמור את סקריפט ההפעלה בקובץ נפרד ולטעון אותו באמצעות תג `<script src="...">` במקום להטמיע אותו ישירות בתבנית HTML.
