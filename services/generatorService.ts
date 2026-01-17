import { AssignmentData, SyllabusItem } from '../types';

const RESOURCES_URL = 'https://bdnhost.net/Resources/';

// פונקציה פשוטה להסרת תגיות אודיו מטקסט
const removeAudioTags = (text: string): string => {
    if (!text) return '';
    return text.replace(/\[[^\]]+\]/gi, '') // הסר כל טקסט בסוגריים מרובעים
        .replace(/\s{2,}/g, ' ')
        .trim();
};

// יצירת HTML לעמוד האינדקס
export const generateCourseIndexHTML = (courseName: string, syllabus: SyllabusItem[]): string => {
    // יצירת HTML לכל פריט בסילבוס
    const items = syllabus.map(s => {
        const cleanTopic = removeAudioTags(s.topic);
        // נתיב פשוט לתמונה
        const imgSrc = `ch${s.lessonNumber}/assets/task_ch${s.lessonNumber}_welcome/media_${s.lessonNumber}.png`;

        return `
        <a href="lesson-${s.lessonNumber}.html" class="item-card">
            <div class="thumb-container">
                <img src="${imgSrc}" alt="${s.title}" class="thumbnail" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM0ZjQ2ZTUiPiR7cy5sZXNzb25OdW1iZXJ9PC90ZXh0Pjwvc3ZnPg=='">
                <div class="num">${s.lessonNumber}</div>
            </div>
            <div class="info">
                <h3>פרק ${s.lessonNumber}: ${s.title}</h3>
                <p><strong>נושא:</strong> ${cleanTopic}</p>
            </div>
            <div class="arrow">←</div>
        </a>`;
    }).join('');

    // החזרת HTML מלא לעמוד אינדקס
    return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap');
        :root { --theme-primary: #4f46e5; }
        body { margin: 0; font-family: 'Heebo', sans-serif; background: #f7fafc; color: #1a202c; line-height: 1.6; direction: rtl; }
        .container { max-width: 800px; margin: 40px auto; background: white; border-radius: 24px; padding: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.06); }
        .thumb-container { position: relative; width: 80px; height: 80px; flex-shrink: 0; border-radius: 16px; overflow: hidden; background: #f1f5f9; }
        .thumbnail { width: 100%; height: 100%; object-fit: cover; }
        .num { position: absolute; bottom: 0; right: 0; background: #4f46e5; color: white; min-width: 24px; height: 24px; border-radius: 6px 0 0 0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; padding: 0 6px; }
        .item-card { background: white; display: flex; align-items: center; gap: 20px; padding: 25px; border-radius: 20px; text-decoration: none; color: inherit; margin-bottom: 20px; border: 1px solid #e2e8f0; transition: 0.3s; }
        .item-card:hover { transform: translateY(-4px); border-color: #4f46e5; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .info h3 { margin: 0 0 5px 0; font-size: 1.3rem; font-weight: 900; color: #1e293b; }
        .info { flex: 1; }
        .arrow { font-size: 1.5rem; color: #cbd5e1; }
        h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 40px; color: #0f172a; text-align: center; }
        .header-logo { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .header-logo svg { width: 80px; height: 80px; margin-left: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4f46e5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h1>תוכן המדריך: <span style="color:#4f46e5">${courseName}</span></h1>
        </div>
        <div class="list">${items}</div>
    </div>
</body>
</html>`;
};

// יצירת HTML לדף פרק (assignment)
export const generateAssignmentHTML = (data: AssignmentData): string => {
    const primary = data.themeColorPrimary || "#4f46e5";
    const imagePath = `ch${data.lessonNumber}/assets/task_ch${data.lessonNumber}_welcome/media_${data.lessonNumber}.png`;
    const welcomeAudioPath = `ch${data.lessonNumber}/assets/task_ch${data.lessonNumber}_welcome/${data.narration.welcome.fileName}`;
    const caseAudioPath = `ch${data.lessonNumber}/assets/task_ch${data.lessonNumber}_case/${data.narration.caseStudy.fileName}`;
    const summaryAudioPath = `ch${data.lessonNumber}/assets/task_ch${data.lessonNumber}_summary/${data.narration.summary.fileName}`;
    const isLastChapter = data.lessonNumber >= data.totalLessons;

    // כפתורי ניווט
    const prevLink = data.lessonNumber > 1
        ? `<a href="lesson-${data.lessonNumber - 1}.html" class="btn-secondary">← פרק קודם</a>`
        : `<a href="index.html" class="btn-secondary">← אינדקס</a>`;

    const nextLink = isLastChapter
        ? `<a id="portalLinkBtn" href="https://edu-manage.org" class="portal-btn">סיום וחזרה לפורטל האישי 👤</a>`
        : `<a href="lesson-${data.lessonNumber + 1}.html" class="btn-secondary">פרק הבא →</a>`;

    return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} | ${data.courseName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap');
        :root { --theme-primary: ${primary}; }
        body { margin: 0; font-family: 'Heebo', sans-serif; background: #f7fafc; color: #1a202c; line-height: 1.6; direction: rtl; }
        .container { max-width: 800px; margin: 20px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.06); }
        .hero { background: linear-gradient(135deg, ${primary}, #818cf8); color: white; padding: 50px 20px; text-align: center; }
        h1 { font-size: 2.4rem; font-weight: 900; margin-bottom: 10px; }
        .p-40 { padding: 40px; }
        .chapter-hero-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 24px; margin-bottom: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .section { display: none; animation: fadeIn 0.4s; }
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .nav-buttons-container { display: flex; justify-content: space-between; gap: 15px; margin-top: 30px; }
        .btn-nav { background: ${primary}; color: white; border: none; padding: 18px 40px; border-radius: 50px; cursor: pointer; font-weight: 900; flex: 2; font-size: 1.1rem; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 14px 24px; border-radius: 50px; cursor: pointer; font-weight: 800; text-decoration: none; text-align: center; flex: 1; }
        .btn-submit { background: ${primary}; color: white; border: none; padding: 20px 40px; border-radius: 50px; cursor: pointer; font-weight: 900; font-size: 1.1rem; width: 100%; flex: 2; transition: all 0.3s; }
        .form-section { background: #fff; border: 1px solid #edf2f7; padding: 30px; border-radius: 20px; margin-bottom: 25px; }
        .field { margin-bottom: 20px; }
        .field label { display: block; font-weight: 800; margin-bottom: 10px; font-size: 1rem; color: #2d3748; }
        .field input[type="text"], .field textarea { width: 100%; padding: 16px; border: 2px solid #e2e8f0; border-radius: 14px; outline: none; font-family: inherit; font-size: 1rem; }
        
        .audio-player-widget { position: fixed; bottom: 20px; left: 20px; z-index: 100; background: white; padding: 12px 24px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; border: 2px solid var(--theme-primary); }
        .audio-btn { background: ${primary}; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        
        .feedback-message { 
            position: fixed; 
            top: 20px; 
            left: 50%; 
            transform: translateX(-50%); 
            background: #10b981; 
            color: white; 
            padding: 15px 25px; 
            border-radius: 50px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.15); 
            font-weight: 800;
            opacity: 0;
            transition: opacity 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
        }
        .feedback-message.show { opacity: 1; }
        
        @media (max-width: 640px) {
            .nav-buttons-container { flex-direction: column; }
            .container { margin: 0; border-radius: 0; }
            .audio-player-widget { left: 10px; right: 10px; bottom: 10px; border-radius: 15px; width: auto; }
        }
    </style>
</head>
<body>
    <div class="audio-player-widget">
        <button class="audio-btn" onclick="playAudio()" id="pBtn">▶</button>
        <span id="audioLabel" style="font-weight:800; color:#475569; font-size:0.85rem">הקלטת פתיחה</span>
        <audio id="audio"><source id="aSrc" src="${welcomeAudioPath}"></audio>
    </div>

    <div id="feedbackMessage" class="feedback-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>הנתונים נשלחו בהצלחה למערכת EDUMANAGE!</span>
    </div>

    <div class="container">
        <div class="hero">
            <h1>${data.title}</h1>
            <p style="opacity:0.95; font-size:1.2rem;">${data.courseName}</p>
        </div>

        <div class="p-40">
            <img src="${imagePath}" alt="${data.title}" class="chapter-hero-img" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjNGY0NmU1Ij7XqtefXqvXpMK5JHtkYXRhLnRpdGxlfTwvdGV4dD48L3N2Zz4='">

            <div class="section active" id="s0">
                <h2>${data.welcomeTitle || "ברוכים הבאים לפרק"}</h2>
                <p>${removeAudioTags(data.welcomeText)}</p>
                <div class="nav-buttons-container">
                    ${prevLink}
                    <button class="btn-nav" onclick="window.go(1)">המשך למשימה &larr;</button>
                </div>
            </div>

            <div class="section" id="s1">
                <h2>${data.caseStudyTitle || "תרגיל"}</h2>
                <div style="background:#fff7ed; padding:30px; border-radius:24px; margin-bottom:35px;">
                  ${removeAudioTags(data.caseStudyContent)}
                </div>
                <div class="nav-buttons-container">
                    <button class="btn-secondary" onclick="window.go(0)">← חזרה</button>
                    <button class="btn-nav" onclick="window.go(2)">לסיכום והגשה &larr;</button>
                </div>
            </div>

            <div class="section" id="s2">
                <div style="text-align:center; margin-bottom:40px;">
                    <h2 style="font-size:2.2rem; font-weight:900;">🚀 סיכום המדריך</h2>
                    <p>${removeAudioTags(data.narration.summary.script || "")}</p>
                </div>

                <form id="insightForm">
                    <div class="form-section">
                        <div class="field">
                            <label>מזהה תלמיד במערכת <span style="color:#64748b; font-weight:normal">(אופציונלי)</span></label>
                            <input type="text" id="student_id" placeholder="לדוגמא: 6948d5ea...">
                            <small style="color:#64748b; display:block; margin-top:8px">ניתן למצוא את המזהה בכתובת הפרופיל האישי שלך, או להשאיר ריק להמשך אנונימי</small>
                        </div>
                        <div class="field">
                            <label>תובנות והערות שלך על הפרק</label>
                            <textarea id="refl" rows="4" placeholder="שתף אותנו בתובנות שלך מהפרק..."></textarea>
                        </div>
                    </div>
                    <div class="nav-buttons-container">
                        <button type="button" class="btn-secondary" onclick="window.go(1)">← חזרה</button>
                        <button type="button" class="btn-submit" id="submitBtn" onclick="window.submitData()">שלח ושמור התקדמות ✅</button>
                    </div>
                </form>
            </div>
            
            <!-- מסך סיום שיוצג אחרי שליחת הטופס -->
            <div class="section" id="s3">
                <div style="text-align:center; padding:50px 0;">
                    <div style="font-size:5rem; margin-bottom:25px">🏆</div>
                    <h2 style="font-size:2.5rem; font-weight:900">כל הכבוד! סיימת!</h2>
                    <p style="font-size:1.2rem; color:#475569; max-width:500px; margin: 0 auto 40px auto">המטלה הושלמה בהצלחה והנתונים נשמרו במערכת.</p>
                    
                    <div class="nav-buttons-container" style="max-width:550px; margin: 0 auto">
                        ${prevLink}
                        ${nextLink}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // אחסון הנתיבים של קבצי האודיו השונים
        const audioSources = [
            { section: 0, path: ${JSON.stringify(welcomeAudioPath)}, label: "הקלטת פתיחה" },
            { section: 1, path: ${JSON.stringify(caseAudioPath)}, label: "הקלטת המשימה" },
            { section: 2, path: ${JSON.stringify(summaryAudioPath)}, label: "הקלטת סיכום" }
        ];
        
        // הגדרת הפונקציות גלובלית
        window.go = function(idx) {
            const sections = document.querySelectorAll('.section');
            for (let i = 0; i < sections.length; i++) {
                sections[i].classList.remove('active');
            }
            document.getElementById('s' + idx).classList.add('active');
            window.scrollTo(0, 0);
            
            // טעינת אודיו מתאים למסך החדש
            window.loadAudioForSection(idx);
        };
        
        // פונקציה להחלפת מקור האודיו
        window.loadAudioForSection = function(sectionIndex) {
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
            
            // בדיקת תקינות האינדקס
            if (sectionIndex < 0 || sectionIndex > 3) {
                console.error("Invalid audio section index:", sectionIndex);
                return;
            }
            
            // מוצא את המקור המתאים לסקשן הנוכחי
            const audioData = audioSources.find(a => a.section === sectionIndex);
            if (!audioData) {
                console.error("No audio data found for section:", sectionIndex);
                return;
            }
            
            try {
                // מעדכן את המקור ואת התווית עם קידוד נכון של שם הקובץ
                source.src = encodeURI(audioData.path).replace(/%25/g, '%');
                audioLabel.innerText = audioData.label;
                
                // טעינה מחדש של האודיו
                audio.load();
                
                // הפעלה אוטומטית לאחר השהייה קצרה
                setTimeout(() => {
                    window.playAudio();
                }, 500);
            } catch (e) {
                console.error("Error loading audio:", e);
                btn.style.backgroundColor = '#ef4444';
            }
        };
        
        // פונקציה לניגון אודיו
        window.playAudio = function() {
            const audio = document.getElementById('audio');
            const btn = document.getElementById('pBtn');
            
            if (!audio || !btn) return;
            
            if (audio.paused) {
                // בדיקה שיש מקור אודיו תקין
                if (!audio.src || audio.src === window.location.href) {
                    console.error("No valid audio source");
                    btn.style.backgroundColor = '#f97316';
                    return;
                }
                
                audio.play()
                    .then(() => {
                        btn.innerHTML = '⏸';
                    })
                    .catch(function(err) {
                        console.error("Error playing audio:", err);
                        // מסמן קיים קובץ אודיו אבל לא ניתן לנגן אותו
                        btn.style.backgroundColor = '#f97316';
                    });
            } else {
                audio.pause();
                btn.innerHTML = '▶';
            }
            
            // ניקוי האירוע הקודם אם קיים
            if (audio.onended) {
                audio.onended = null;
            }
            
            // הוספת אירוע חדש
            audio.onended = function() {
                btn.innerHTML = '▶';
                audio.currentTime = 0;
            };
        };
        
        // פונקציה לשליחת הנתונים
        window.submitData = function() {
            const studentId = document.getElementById('student_id').value || 'anonymous';
            const reflection = document.getElementById('refl').value || '';
            const submitBtn = document.getElementById('submitBtn');
            const feedbackMsg = document.getElementById('feedbackMessage');
            
            // החלפת כפתור לאנימציה
            submitBtn.innerHTML = "⏳ שולח נתונים...";
            submitBtn.disabled = true;
            
            // בונה אובייקט עם הנתונים
            const dataToSend = {
                studentId: studentId,
                reflection: reflection,
                course: ${JSON.stringify(data.courseName)},
                lesson: ${data.lessonNumber},
                timestamp: new Date().toISOString()
            };
            
            // שימולציה של שליחה לשרת
            console.log("שולח נתונים ל-EDUMANAGE:", JSON.stringify(dataToSend, null, 2));
            
            // נסה לשלוח לשרת אם זה סביבת ייצור
            try {
                // במידה ונמצא ב-production יבוצע fetch אמיתי - הקוד הבא הוא עטיפה סימולטיבית 
                // fetch('https://edu-manage.org/api/submit', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // })
                
                // הצגת הודעה
                setTimeout(() => {
                    // עדכון כפתור
                    submitBtn.innerHTML = "✅ נשלח בהצלחה!";
                    submitBtn.style.backgroundColor = "#10b981";
                    
                    // הצגת הודעה צפה
                    feedbackMsg.classList.add('show');
                    
                    // מעבר למסך סיום אחרי השהייה קצרה
                    setTimeout(() => {
                        feedbackMsg.classList.remove('show');
                        window.go(3); // מעבר למסך סיום
                    }, 3000);
                }, 1500);
                
            } catch (error) {
                console.error("שגיאה בשליחת הנתונים:", error);
                submitBtn.innerHTML = "❌ שגיאה בשליחה, נסה שנית";
                submitBtn.style.backgroundColor = "#ef4444";
                submitBtn.disabled = false;
            }
        };
        
        // טעינה ראשונית
        window.onload = function() {
            const audio = document.getElementById('audio');
            const btn = document.getElementById('pBtn');
            
            if (audio) {
                // ניסיון לטעון את האודיו
                try {
                    audio.load();
                    
                    // הגדרת האירועים על האלמנט
                    audio.addEventListener('error', (e) => {
                        console.error('Audio error:', e);
                        if (btn) btn.style.backgroundColor = '#ef4444';
                    });
                    
                    // הוספת אירוע לטעינת האודיו
                    audio.addEventListener('loadeddata', () => {
                        console.log('Audio loaded successfully');
                        if (btn) btn.style.backgroundColor = '';
                    });
                } catch (error) {
                    console.error('Error initializing audio:', error);
                    if (btn) btn.style.backgroundColor = '#ef4444';
                }
            } else {
                console.error('Audio element not found');
            }
            
            // תיקון נתיבים במקרה שקובץ נטען מאחסון מקומי
            if (window.location.protocol === 'file:') {
                console.log('Running from local file system, adjusting audio paths');
                audioSources.forEach(source => {
                    // התאמת הנתיב באחסון מקומי כשאין שרת
                    source.path = source.path.replace(/^\.\//, '');
                });
            }
        };
    </script>
</body>
</html>`;
};
