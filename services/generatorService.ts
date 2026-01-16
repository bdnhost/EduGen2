
import { AssignmentData, SyllabusItem } from '../types';

const RESOURCES_URL = 'https://bdnhost.net/Resources/';

const getLmsBanner = () => `
    <div class="lms-banner">
        <div class="lms-banner-content">
            <span class="lms-text">🎓 <strong>מרכז הידע</strong> - למדריכים נוספים בקר בפורטל המשאבים</span>
            <a href="${RESOURCES_URL}" target="_blank" class="lms-btn">למאגר המדריכים</a>
        </div>
    </div>
`;

const getGlobalHeader = (title: string, isIndex: boolean = false) => `
    <header class="global-header">
        <nav class="global-nav">
            <div class="nav-links">
                <a href="${RESOURCES_URL}" class="nav-link" target="_blank">מאגר המדריכים</a>
                <a href="${isIndex ? '#' : 'index.html'}" class="nav-link">תוכן המדריך</a>
            </div>
            <a href="index.html" class="nav-brand">
                <span class="logo">🎓</span> LearningHub
            </a>
        </nav>
    </header>
`;

const getGlobalFooter = () => `
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h3>🎓 LearningHub</h3>
                    <p>פורטל הלמידה והחדשנות המוביל בישראל.</p>
                </div>
            </div>
            <div class="footer-bottom">
                <div>© 2025 EduManage • כל הזכויות שמורות</div>
            </div>
        </div>
    </footer>
`;

const getSharedStyles = (primaryColor: string, secondaryColor: string) => `
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap');
    :root {
        --theme-primary: ${primaryColor};
        --theme-accent: ${secondaryColor};
        --surface: #ffffff;
        --text-main: #1a202c;
        --text-muted: #718096;
        --border-color: #e2e8f0;
    }
    * { box-sizing: border-box; }
    body {
        margin: 0; font-family: 'Heebo', sans-serif; background: #f7fafc;
        color: var(--text-main); line-height: 1.6; direction: rtl;
    }
    .lms-banner { background: #4f46e5; color: white; padding: 0.75rem; font-size: 0.9rem; text-align: center; font-weight: 500; position: relative; z-index: 60; }
    .lms-btn { background: white; color: #4f46e5; padding: 4px 14px; border-radius: 20px; text-decoration: none; font-weight: 800; margin-right: 12px; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .global-header { background: white; border-bottom: 1px solid var(--border-color); padding: 1rem; position: sticky; top: 0; z-index: 50; }
    .global-nav { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; }
    .nav-brand { font-weight: 900; text-decoration: none; color: black; font-size: 1.2rem; }
    .nav-links { display: flex; gap: 1.5rem; }
    .nav-link { text-decoration: none; color: var(--text-muted); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
    .nav-link:hover { color: var(--theme-primary); }
    
    .audio-player-widget {
        position: fixed; bottom: 20px; left: 20px; z-index: 100;
        background: white; padding: 12px 24px; border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px;
        border: 2px solid var(--theme-primary);
    }
    .audio-btn { background: var(--theme-primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }

    .container { max-width: 850px; margin: 30px auto; background: white; border-radius: 24px; box-shadow: 0 15px 50px rgba(0,0,0,0.06); overflow: hidden; }
    .p-40 { padding: 40px; }
    .form-section { background: #fff; border: 1px solid #edf2f7; padding: 30px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-weight: 800; margin-bottom: 10px; font-size: 1rem; color: #2d3748; }
    .field input[type="text"], .field textarea {
        width: 100%; padding: 16px; border: 2px solid #e2e8f0; border-radius: 14px; outline: none; transition: all 0.2s; font-family: inherit; font-size: 1rem;
    }
    .field input:focus, .field textarea:focus { border-color: var(--theme-primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
    .required { color: #e53e3e; margin-right: 4px; }
    
    .btn-submit { background: var(--theme-primary); color: white; border: none; padding: 20px 40px; border-radius: 50px; cursor: pointer; font-weight: 900; font-size: 1.2rem; width: 100%; transition: all 0.3s; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2); }
    .btn-submit:hover { background: #000; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
    .btn-submit:disabled { background: #cbd5e0; cursor: not-allowed; transform: none; box-shadow: none; }

    .nav-buttons-container { display: flex; flex-direction: row; justify-content: space-between; gap: 15px; margin-top: 25px; }
    .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 14px 24px; border-radius: 50px; cursor: pointer; font-weight: 800; text-decoration: none; text-align: center; flex: 1; transition: 0.2s; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; }
    .btn-secondary:hover { background: #e2e8f0; color: #1e293b; }

    .chapter-hero-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 24px; margin-bottom: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 4px solid white; }
    .portal-btn { background: #1e1b4b; color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex: 2; transition: 0.3s; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(30, 27, 75, 0.2); }
    .portal-btn:hover { background: #000; transform: scale(1.03); }

    .resources-footer-btn { 
        display: block; width: 100%; padding: 20px; background: #fff; border: 2px solid var(--theme-primary); 
        color: var(--theme-primary); text-decoration: none; text-align: center; font-weight: 900; 
        border-radius: 18px; margin-top: 30px; transition: 0.3s; 
    }
    .resources-footer-btn:hover { background: var(--theme-primary); color: #fff; transform: translateY(-3px); }

    @media (max-width: 640px) {
        .nav-buttons-container { flex-direction: column; }
        .container { margin: 0; border-radius: 0; }
        .audio-player-widget { left: 10px; right: 10px; bottom: 10px; border-radius: 15px; width: auto; justify-content: center; }
        .hero { padding: 40px 15px !important; }
        .hero h1 { font-size: 1.7rem !important; }
        .p-40 { padding: 20px; }
        h2 { font-size: 1.5rem; }
        .global-nav { flex-direction: column; gap: 10px; text-align: center; }
        .nav-links { gap: 1rem; }
    }
`;

export const generateCourseIndexHTML = (courseName: string, syllabus: SyllabusItem[]): string => {
  const primary = "#4f46e5";
  const items = syllabus.map(s => `
    <a href="lesson-${s.lessonNumber}.html" class="item-card">
        <div class="num">${s.lessonNumber}</div>
        <div class="info">
            <h3>פרק ${s.lessonNumber}: ${s.title}</h3>
            <p><strong>נושא:</strong> ${s.topic}</p>
        </div>
        <div class="arrow">←</div>
    </a>
  `).join('');

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseName}</title>
    <style>
        ${getSharedStyles(primary, "#818cf8")}
        .container { max-width: 800px; margin: 40px auto; padding: 0; }
        .index-inner { padding: 40px 20px; }
        .item-card { background: white; display: flex; align-items: center; gap: 20px; padding: 25px; border-radius: 20px; text-decoration: none; color: inherit; margin-bottom: 20px; border: 1px solid #e2e8f0; transition: 0.3s; }
        .item-card:hover { transform: translateY(-4px); border-color: ${primary}; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .num { background: ${primary}; color: white; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; font-size: 1.2rem; }
        .info { flex: 1; }
        .info h3 { margin: 0 0 5px 0; font-size: 1.3rem; font-weight: 900; color: #1e293b; }
        .info p { margin: 0; color: #64748b; font-size: 0.95rem; }
        .arrow { font-size: 1.5rem; color: #cbd5e1; }
        h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 40px; color: #0f172a; text-align: center; }
    </style>
</head>
<body>
    ${getLmsBanner()}
    ${getGlobalHeader(courseName, true)}
    <div class="container">
        <div class="index-inner">
            <h1>תוכן המדריך: <span style="color:${primary}">${courseName}</span></h1>
            <div class="list">${items}</div>
        </div>
    </div>
    ${getGlobalFooter()}
</body>
</html>`;
};

export const generateAssignmentHTML = (data: AssignmentData): string => {
  const primary = data.themeColorPrimary || "#4f46e5";
  const secondary = data.themeColorSecondary || "#818cf8";
  
  // FIXED: Standard logic for end-of-course detection
  const isLastChapter = data.lessonNumber >= data.totalLessons;
  
  // ALIGNED: Folder structure based on Media Generator production patterns
  const welcomeAudio = `task_ch${data.lessonNumber}_welcome/${data.narration.welcome.fileName}`;
  const caseAudio = `task_ch${data.lessonNumber}_case/${data.narration.caseStudy.fileName}`;
  const summaryAudio = `task_ch${data.lessonNumber}_summary/${data.narration.summary.fileName}`;
  const imagePath = `task_ch${data.lessonNumber}_welcome/media_${data.lessonNumber}.png`;

  const flashcardsHTML = data.flashcards.map(f => `
    <div class="card" onclick="this.classList.toggle('flip')">
        <div class="front">${f.term}</div>
        <div class="back">${f.definition}</div>
    </div>
  `).join('');

  const questionsHTML = data.questions.map((q, i) => `
    <div class="q-box" data-qid="${q.id}">
        <p style="font-size:1.1rem; margin-bottom:15px"><strong>${i+1}. ${q.text}</strong></p>
        ${q.options.map(o => `
            <label class="opt">
                <input type="radio" name="${q.id}" value="${o.text}" onchange="recordAnswer('${q.id}', '${o.text}', ${o.isCorrect})">
                <span style="margin-right:10px">${o.text}</span>
            </label>
        `).join('')}
    </div>
  `).join('');

  const prevLink = data.lessonNumber > 1 
    ? `<a href="lesson-${data.lessonNumber - 1}.html" class="btn-secondary">← פרק קודם</a>` 
    : `<a href="index.html" class="btn-secondary">← אינדקס</a>`;
    
  // FIXED: portal return button with dynamic ID sync
  const nextLink = isLastChapter 
    ? `<a id="portalLinkBtn" href="https://edu-manage.org" class="portal-btn">סיום וחזרה לפורטל האישי 👤</a>`
    : `<a href="lesson-${data.lessonNumber + 1}.html" class="btn-secondary">פרק הבא →</a>`;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        ${getSharedStyles(primary, secondary)}
        .hero { background: linear-gradient(135deg, ${primary}, ${secondary}); color: white; padding: 70px 20px; text-align: center; }
        .section { display: none; animation: fadeIn 0.4s ease-out; } 
        .section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 25px 0; }
        .card { height: 140px; cursor: pointer; position: relative; perspective: 1000px; }
        .front, .back { position: absolute; inset: 0; background: #fff; border: 2px solid #f1f5f9; display: flex; align-items: center; justify-content: center; padding: 20px; border-radius: 18px; backface-visibility: hidden; transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .back { background: ${primary}; color: white; transform: rotateY(180deg); text-align: center; font-weight: 800; border: none; }
        .card.flip .front { transform: rotateY(180deg); }
        .card.flip .back { transform: rotateY(0deg); }
        
        .q-box { background: #f8fafc; padding: 30px; border-radius: 24px; margin-bottom: 25px; border: 1px solid #e2e8f0; }
        .opt { display: flex; align-items: center; padding: 15px 20px; background: white; border-radius: 14px; margin-top: 12px; cursor: pointer; border: 2px solid #f1f5f9; transition: 0.2s; font-weight: 500; }
        .opt:hover { border-color: ${primary}; background: #f5f3ff; }
        .opt input { width: 20px; height: 20px; accent-color: ${primary}; }

        .btn-nav { background: ${primary}; color: white; border: none; padding: 18px 40px; border-radius: 50px; cursor: pointer; font-weight: 900; width: 100%; transition: 0.3s; font-size: 1.1rem; }
        .btn-nav:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        h2 { font-size: 2rem; font-weight: 900; color: #1e293b; margin-bottom: 20px; }
    </style>
</head>
<body>
    ${getLmsBanner()}
    <div class="audio-player-widget">
        <button class="audio-btn" onclick="playAudio()" id="pBtn">▶</button>
        <span id="audioLabel" style="font-weight:800; color:#475569; font-size:0.85rem">פתיחה</span>
        <audio id="audio"><source id="aSrc" src="${welcomeAudio}"></audio>
    </div>

    <div class="container" id="mainContainer">
        <div class="hero">
            <h1 style="margin-bottom:10px; font-size:2.4rem; font-weight:900">${data.title}</h1>
            <p style="opacity:0.95; font-size:1.2rem; font-weight:500">${data.courseName}</p>
        </div>

        <div class="p-40">
            <img src="${imagePath}" alt="${data.title}" class="chapter-hero-img" onerror="this.style.display='none'">

            <div class="section active" id="s0">
                <h2>${data.welcomeTitle}</h2>
                <p style="font-size:1.1rem; color:#475569; margin-bottom:30px">${data.welcomeText}</p>
                <div class="cards">${flashcardsHTML}</div>
                <div class="nav-buttons-container">
                    ${prevLink}
                    <button class="btn-nav" style="flex:2" onclick="go(1)">המשך למשימה &larr;</button>
                </div>
            </div>

            <div class="section" id="s1">
                <h2>${data.caseStudyTitle}</h2>
                <div style="background:#fff7ed; padding:30px; border-radius:24px; margin-bottom:35px; border:2px solid #ffedd5; font-size:1.05rem; line-height:1.8; color:#7c2d12">${data.caseStudyContent}</div>
                <div class="quiz">${questionsHTML}</div>
                <div class="nav-buttons-container">
                    <button class="btn-secondary" onclick="go(0)">← חזרה</button>
                    <button class="btn-nav" style="flex:2" onclick="go(2)">לסיכום והגשה &larr;</button>
                </div>
            </div>

            <div class="section" id="s2">
                <div style="text-align:center; margin-bottom:40px;">
                    <h2 style="font-size:2.2rem; font-weight:900;">🚀 הגשת המשימה</h2>
                    <p style="color:#64748b">נא להזין מזהה תלמיד לצורך שמירה וסיום המדריך</p>
                </div>

                <form id="insightForm">
                    <div class="form-section">
                        <div class="field">
                            <label>מזהה תלמיד במערכת <span class="required">*</span></label>
                            <input type="text" id="student_id" required placeholder="לדוגמא: 6948d5ea..." oninput="syncPortalLink()">
                            <small style="color:#64748b; display:block; margin-top:8px">ניתן למצוא את המזהה בכתובת הפרופיל האישי שלך</small>
                        </div>
                        <div class="field">
                            <label>${data.reflectionQuestionText}</label>
                            <textarea id="refl" rows="4" placeholder="שתף אותנו בתובנות שלך מהפרק..."></textarea>
                        </div>
                    </div>
                    <div class="nav-buttons-container">
                        <button type="button" class="btn-secondary" onclick="go(1)">← חזרה</button>
                        <button type="button" class="btn-submit" style="flex:2" id="submitBtn" onclick="submitFinal()">✅ שלח ושמור התקדמות</button>
                    </div>
                </form>
            </div>

            <div class="section" id="s3">
                <div style="text-align:center; padding:50px 0;">
                    <div style="font-size:5rem; margin-bottom:25px">🏆</div>
                    <h2 style="font-size:2.5rem; font-weight:900">כל הכבוד! סיימת!</h2>
                    <p style="font-size:1.2rem; color:#475569; max-width:500px; margin: 0 auto 40px auto">התשובות שלך נשלחו בהצלחה. המטלה נשמרה בתיק האישי שלך.</p>
                    
                    <div class="nav-buttons-container" style="max-width:550px; margin: 0 auto">
                        ${prevLink}
                        ${nextLink}
                    </div>
                    
                    ${isLastChapter ? `
                    <div style="margin-top:40px; border-top:2px dashed #e2e8f0; padding-top:40px">
                         <p style="font-weight:800; margin-bottom:15px; color:#1e293b">רוצה להעמיק בנושאים נוספים?</p>
                         <a href="${RESOURCES_URL}" target="_blank" class="resources-footer-btn">📂 מעבר למאגר המדריכים והמשאבים המלא</a>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_URL = 'https://edu-manage.org/api/functions/submitGuideForm';
        const quizLog = {};
        const audioPaths = ["${welcomeAudio}", "${caseAudio}", "${summaryAudio}"];
        const labels = ["פתיחה", "משימה", "סיכום"];

        window.onload = () => {
            const sid = new URLSearchParams(window.location.search).get('base44StudentId');
            if(sid) {
                document.getElementById('student_id').value = sid;
                syncPortalLink();
            }
        };

        function syncPortalLink() {
            const sid = document.getElementById('student_id').value.trim();
            const btn = document.getElementById('portalLinkBtn');
            if(btn) {
                if(sid) btn.href = 'https://edu-manage.org/PublicView?type=student&id=' + sid;
                else btn.href = 'https://edu-manage.org';
            }
        }

        function go(idx) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const target = document.getElementById('s'+idx);
            if(target) target.classList.add('active');
            
            const a = document.getElementById('audio');
            const source = document.getElementById('aSrc');
            const label = document.getElementById('audioLabel');
            
            if(audioPaths[idx]) {
                source.src = audioPaths[idx];
                a.load();
                label.innerText = labels[idx] || "נגן";
            }
            if(idx === 3) syncPortalLink();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function playAudio() {
            const a = document.getElementById('audio');
            const b = document.getElementById('pBtn');
            if(a.paused) { a.play(); b.innerText='⏸'; } else { a.pause(); b.innerText='▶'; }
        }

        function recordAnswer(qid, text, correct) {
            quizLog[qid] = { answer: text, isCorrect: correct };
        }

        async function submitFinal() {
            const sid = document.getElementById('student_id').value.trim();
            if(!sid) { alert('נא למלא מזהה תלמיד'); return; }

            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.textContent = '⏳ שולח נתונים...';

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        student_id: sid,
                        guide_name: "${data.courseName}",
                        guide_chapter: "${data.title}",
                        form_data: { reflection: document.getElementById('refl').value, quiz: quizLog }
                    })
                });
                if(res.ok) { go(3); } else { throw new Error(); }
            } catch(e) {
                alert('שגיאה בשמירת המטלה. נסה שוב.');
                btn.disabled = false;
                btn.textContent = '✅ נסה שוב';
            }
        }
    </script>
</body>
</html>`;
};
