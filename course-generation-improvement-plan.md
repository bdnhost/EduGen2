# תוכנית שיפור למחולל המדריכים החכם EduGen2

## מבוא: אבחון והבנת הבעיות הנוכחיות

לאחר בחינה מעמיקה של המדריך שנוצר ושל קוד המקור (`aiService.ts`), זיהינו את הבעיה המרכזית שכיניתם בצדק "**סינדרום השלד**". המערכת הנוכחית מייצרת מבנה טכני תקין, אך חסר תוכן פדגוגי עשיר, אלמנטים אינטראקטיביים משמעותיים, והקשר מעשי.

## תוכנית השיפור המוצעת

### חלק א': שדרוג הפרומפטים למודל ה-AI (זמן יישום מוערך: 1-2 ימים)

> **הערת יישום**: בהתאם לדגשי ההנהלה, יש לתת תשומת לב מיוחדת לכל הגדרות **Media Prompts** עם הנחייה לסגנון תמונות **Flat Vector 2D** עם פירוט ספציפי של התוכן הטכני שיופיע בשקף.

#### 1. שדרוג פרומפט הנחיית המערכת (System Prompt)

כך נראית הנחיית המערכת כיום:
```
You are an expert educational content creator specializing in interactive Hebrew assignments
```

הנחיית מערכת מוצעת חדשה:
```
You are a World-Class Instructional Designer and Educational Content Architect specializing in creating rich, immersive learning experiences for non-technical users.

Your mission is NEVER to produce a "skeleton". Every piece of content must be a Masterpiece with these requirements:

1. The Clerk Test: Ensure an office clerk with zero technical background can follow every instruction step-by-step.
2. Instructional Scaffolding: Break complex ideas into micro-concepts. Build difficulty gradually.
3. Real-world Context: Every technical concept must include a real-world metaphor and practical example.
4. Enforced Interactivity: Every 3-4 content blocks must include a Quiz or Flashcard. This is non-negotiable.
5. Pro-Tip Layer: Every topic must contain expert-level insights that add value beyond basics.
6. Verbosity: Be richly descriptive. A "powerful feature" should be explained in 150+ words with concrete examples.

If your content feels like a premium course rather than a cheap summary, you've succeeded. Remember: Be the bridge between complete novice and professional expert.
```

#### 2. העשרת פרומפט יצירת התוכן

כך נראית תחילת הפרומפט כיום:
```
צור תוכן חינוכי אינטראקטיבי מלא בעברית לפרק ${lessonNumber} מתוך ${totalLessons} במדריך הקצר "${courseName}".
נושא: "${topic}".

דרישות:
- שפה: עברית בלבד
- פדגוגיה: Bloom's Taxonomy, Scaffolding
- נרטיב: כלול סמני רגש כמו [excited], [thoughtful], [pauses], [smiles]
```

הפרומפט המוצע:
```
צור תוכן חינוכי עמוק ומעשי בעברית לפרק ${lessonNumber} מתוך ${totalLessons} במדריך "${courseName}".
נושא: "${topic}".

תזכורת חשובה - הימנע בכל מחיר מ"סינדרום השלד"! אל תיצור רק מבנה מוכן - מלא אותו בתוכן עשיר, מעמיק, ומקצועי.

עקרונות פדגוגיים מחייבים:
1. מבחן הפקידה: תארי לעצמך פקידה ללא רקע טכני. האם היא תוכל לבצע את המשימה בדיוק לפי ההוראות שלך? אם לא, הוסף הסברים מפורטים יותר, צילומי מסך מתוארים, ושלבים מדויקים.

2. פיגומי למידה: פרק כל רעיון מורכב למיקרו-מושגים. הסבר כל מושג בנפרד עם מטאפורה מעולם המשרד.

3. דוגמאות אמיתיות: אל תשתמש במשפטים כלליים כמו "הטרמינל עוצמתי" - במקום זאת, כתוב: "בעזרת פקודת mkdir אחת, יצרת הרגע 12 תיקיות חודשיות עם תתי-תיקיות לכל ימי השבוע. זה ייקח שעתיים בגרירת עכבר."

4. אינטראקטיביות מחייבת: כל 2-3 שקפי תוכן חייבים להסתיים בשקף Quiz או כרטיסיית פלאש. ליצירת Flashcards יש לכלול לפחות 5 מושגים מקצועיים.

5. שכבת מומחה: כל סעיף חייב לכלול תיבת "טיפ מקצועי" או "האם ידעת?" שמוסיפה מידע ברמת מומחה מעבר למידע הבסיסי.

נרטיב ושפה:
- כלול סמני רגש כמו [excited], [thoughtful], [pauses], [smiles], [whispers] (לטיפים), [speaks firmly] (להדגשות)
- חובה להשתמש בסימן "..." בין משפטים לציון הפסקות נשימה טבעיות
- TV-Anchor Test: תארי לעצמך שאת מנחה תוכנית טלוויזיה ולא סתם קריינית. הקול והנימה חייבים "לתפוס" את המשתמש
- Cross-Checking: עבור כל חלק שכתבת שאלי את עצמך: "האם זהו חלק ממדריך יוקרתי ומעמיק, או סתם תקציר זול?"

הנחיות למדיה חזותית:
- כל media_prompt חייב להיות ב-English ולהכיל את המילים "Strictly 2D Flat Vector Infographic"
- לתיאור המדיה בכל שקף, ציין את התוכן הטכני הספציפי שצריך להופיע באינפוגרפיקה
- דוגמה לפרומפט טוב: "Strictly 2D Flat Vector Infographic showing step-by-step Excel AutoFilter process, with cursor hovering over filter icon, purple/pink color scheme, white background, clean lines"
```

### חלק ב': הרחבת מבנה ה-JSON (זמן יישום מוערך: 2-3 ימים)

#### 1. הוספת שדות חדשים לכרטיסי מושגים (Flashcards) ושאלות משופרים

```javascript
// שדות חדשים להוספה לכל פרק
"richFlashcards": [
  {
    "term": "פקודת cd במרחב הקבצים",
    "definition": "פקודה לשינוי התיקייה הנוכחית",
    "realWorldExample": "בדיוק כמו לפתוח דלת חדשה במשרד ולכנס לחדר אחר",
    "commonMistake": "לשכוח את המיקום הנוכחי בעץ התיקיות",
    "proTip": "השתמשו ב-'cd -' לחזרה מהירה לתיקייה הקודמת"
  }
],

"stepByStepGuides": [
  {
    "title": "יצירת טבלת משימות אוטומטית",
    "goal": "ליצור בקליק אחד את כל תיקיות הפרויקט הנדרשות",
    "difficultyLevel": "מתחילים", // או "בינוני", "מתקדם"
    "prerequisites": ["גישה להרשאות ניהול", "התקנת Excel"],
    "steps": [
      {
        "number": 1,
        "title": "פתחו את אקסל",
        "description": "לחצו על התפריט 'קובץ' ואז 'חדש'",
        "visualDescription": "כפתור כחול בצד שמאל עליון של המסך",
        "watchOutFor": "ודאו שאתם משתמשים בגרסה 2022 ומעלה"
      },
      // עוד צעדים...
    ],
    "verificationStep": "בדקו שנפתח חלון עם X תיקיות חדשות"
  }
],

// דיון התמודדות עם תרחישים מורכבים
"challengeScenarios": [
  {
    "title": "לקוח כועס דורש החזר",
    "situation": "לקוח התקשר זועם על שחשבונית נשלחה פעמיים",
    "challenge": "כיצד להרגיע את הלקוח ולנתב את הפנייה לגורם המתאים",
    "expertApproach": "להקשיב תחילה בלי להתגונן, לאשר את הטעות, להציע פתרון מיידי",
    "bestPractices": [
      "להימנע מ'העברת אשמה' למחלקות אחרות",
      "לתעד את השיחה מיד אחריה",
      "לבדוק האם זו בעיה מערכתית שיכולה לחזור"
    ] 
  }
]
```

#### 2. הוספת שדות למידע פדגוגי וקישורים לכלים חיצוניים

```javascript
"externalResources": [
  {
    "title": "מדריך וידאו: שימוש ב-Excel לאוטומציה",
    "type": "video", // או "article", "downloadable_template", "tool"
    "url": "https://www.youtube.com/watch?v=example",
    "description": "סרטון מצוין המראה כיצד לבנות פתרון אוטומטי לניהול כלל המשימות המשרדיות",
    "durationMinutes": 12
  }
],

"downloadableTemplates": [
  {
    "title": "תבנית מוכנה לטבלת Excel לניהול משימות",
    "fileType": "xlsx",
    "downloadPath": "templates/task_manager_template.xlsx",
    "instructions": "הורידו את הקובץ, פתחו ב-Excel, ובקליק אחד תוכלו להתחיל לנהל את כל המשימות המשרדיות"
  }
],

"pedagogicalMetadata": {
  "bloomsLevel": "Apply",
  "learningStyles": ["visual", "kinesthetic", "auditory"],
  "estimatedCompletionTimeMinutes": 45,
  "prerequisiteKnowledge": ["שימוש בסיסי במחשב", "היכרות עם Excel ברמה בסיסית"],
  "knowledgeGraph": {
    "centralConcept": "אוטומציה משרדית",
    "relatedConcepts": [
      {
        "name": "מאקרו Excel",
        "relationship": "enabler",
        "importanceLevel": 9
      }
      // עוד מושגים קשורים
    ]
  }
}
```

### חלק ג': תיקונים טכניים לשגיאת הנגן (זמן יישום מוערך: 0.5-1 יום)

הבעיה בנגן האודיו בשלבים האחרונים נובעת לרוב משגיאות `Off-by-one` (הפניה לאינדקס שלא קיים) או מאי-איפוס הנגן בין מעברי מסכים.

```javascript
// הצעה לתיקון קוד נגן האודיו בקובץ generatorService.ts:
function loadAudioForSection(sectionIndex) {
  const audio = document.getElementById('audio');
  const source = document.getElementById('aSrc');
  const audioLabel = document.getElementById('audioLabel');
  const btn = document.getElementById('pBtn');
  
  if (!audio || !source || !audioLabel || !btn) {
    console.error("Missing audio elements");
    return; // מניעת שימוש במרכיבים לא קיימים
  }
  
  // עצירת האודיו הנוכחי ואיפוס
  audio.pause();
  audio.currentTime = 0;
  btn.innerHTML = '▶';
  
  // קביעת מקור האודיו בהתאם למסך
  let basePath = `ch${data.lessonNumber}/assets/`;
  let audioFile = '';
  let labelText = '';
  
  // בדיקת תקינות האינדקס
  if (sectionIndex < 0 || sectionIndex > 3) {
    console.error("Invalid audio section index:", sectionIndex);
    return;
  }
  
  if (sectionIndex === 0) {
    audioFile = `task_ch${data.lessonNumber}_welcome/${data.narration.welcome.fileName}`;
    labelText = 'הקלטת פתיחה';
  } else if (sectionIndex === 1) {
    audioFile = `task_ch${data.lessonNumber}_case/${data.narration.caseStudy.fileName}`;
    labelText = 'הקלטת המשימה';
  } else if (sectionIndex === 2) {
    audioFile = `task_ch${data.lessonNumber}_summary/${data.narration.summary.fileName}`;
    labelText = 'הקלטת סיכום';
  } else if (sectionIndex === 3) {
    // מסך סיום - אין צורך באודיו חדש
    return;
  }
  
  // בדיקת קיום הקובץ לפני הגדרתו
  if (audioFile) {
    // עדכון המקור החדש ושימוש ב-encodeURIComponent להגנה מפני תווים מיוחדים
    source.src = basePath + encodeURIComponent(audioFile);
    audioLabel.innerText = labelText;
    
    // טעינה מחדש והגדרת חריגות
    try {
      audio.load();
      console.log("Loaded audio:", audioFile);
    } catch (e) {
      console.error("Error loading audio:", e);
      btn.style.backgroundColor = '#ef4444';
    }
  }
}
```

## הצעה לסדר שינויים ויישום

1. **שלב ראשון (יום 1)**: יישום שינויי הפרומפטים (שדרוג System Prompt ומעבר על כל הפרומפטים)
2. **שלב שני (יום 2-3)**: הרחבת מבנה ה-JSON והתאמת קוד עיבוד התוצאות
3. **שלב שלישי (יום 4)**: תיקוני נגן האודיו ובדיקות אינטגרציה
4. **שלב רביעי (יום 5)**: יצירת מדריך לדוגמה ומדידת שיפור האיכות

## אינדיקטורים להצלחה

1. **עומק תוכן**: הגדלה של 40%+ בכמות התוכן המפורט ואורך ההסברים
2. **אינטראקטיביות**: לפחות 5 כרטיסי פלאש ו-3 שאלות בדיקה לכל פרק
3. **יישומיות**: נוכחות של לפחות 2 מדריכים מעשיים צעד-אחר-צעד לכל פרק
4. **עושר פדגוגי**: שימוש במטאפורות, דוגמאות מעשיות, והסברים המותאמים למשתמשי קצה
5. **תקינות טכנית**: פתרון בעיית הנגן בסוף כל פרק

## ציטוט לסיום

> "במקום בו אנשים חושבים שהם מקבלים 'מדריך', ספקו להם 'חוויית למידה מקצועית'."

---
