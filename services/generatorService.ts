import { AssignmentData, SyllabusItem } from '../types';

// --- Assets & Icons (SVGs) ---

const ICONS = {
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    target: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    case: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    analysis: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    plan: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    upload: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    finish: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    flashcards: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h20"/><path d="M20 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 7v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7"/></svg>`
};

// --- Shared Components & Styles ---

const getLmsBanner = () => `
    <div class="lms-banner">
        <div class="lms-banner-content">
            <span class="lms-text">🎓 <strong>רוצה להעמיק?</strong> בקר באתר המרכזי</span>
            <a href="https://edu-manage.org/" class="lms-btn">LearningHub</a>
            <span class="lms-divider">|</span>
            <span class="lms-text">🚀 <strong>חדש כאן?</strong></span>
            <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" class="lms-btn-outline">הרשם חינם</a>
        </div>
    </div>
`;

const getGlobalHeader = (title: string, isIndex: boolean = false) => `
    <header class="global-header">
        <nav class="global-nav">
            <div class="nav-links">
                <a href="https://edu-manage.org" class="nav-link">פורטל ראשי</a>
                <a href="${isIndex ? '#' : 'index.html'}" class="nav-link">תוכן המדריך</a>
            </div>
            <a href="index.html" class="nav-brand">
                <span class="logo">🎓</span>
                LearningHub
            </a>
        </nav>
    </header>

    <nav class="breadcrumbs" aria-label="breadcrumb">
        <div class="breadcrumbs-content">
            <a href="https://edu-manage.org">ראשי</a>
            <span>/</span>
            <a href="index.html">מדריך</a>
            <span>/</span>
            <span class="current">${title}</span>
        </div>
    </nav>
`;

const getGlobalFooter = () => `
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h3><span class="brand-icon">🎓</span> LearningHub</h3>
                    <p class="footer-description">
                        פורטל הלמידה והחדשנות המוביל בישראל. מדריכים, כלים דיגיטליים ובינה מלאכותית.
                    </p>
                    <div style="margin-top: 1rem;">
                        <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" 
                           class="btn-pill">
                            🚀 התחל ללמוד חינם
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>ניווט</h4>
                    <ul class="footer-links">
                        <li><a href="index.html" class="footer-link">דף המדריך</a></li>
                        <li><a href="https://edu-manage.org/" class="footer-link">החשבון שלי</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>EduManage</h4>
                    <ul class="footer-links">
                        <li><a href="https://edu-manage.org/" class="footer-link">אודות</a></li>
                        <li><a href="#" class="footer-link">צור קשר</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-copyright">
                    <div>© 2025 <a href="https://edu-manage.org/" style="color: inherit; text-decoration: none;">EduManage</a> • כל הזכויות שמורות</div>
                </div>
            </div>
        </div>
    </footer>
`;

const getSharedStyles = (primaryColor: string, secondaryColor: string) => `
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap');

    :root {
        --theme-primary: ${primaryColor};
        --theme-accent: ${secondaryColor};
        --theme-light: #f8faff;
        --surface: #ffffff;
        --text-main: #1a202c;
        --text-muted: #718096;
        --border-color: #e2e8f0;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    /* Global Reset & Typography */
    * { box-sizing: border-box; }
    body {
        margin: 0;
        font-family: 'Heebo', sans-serif;
        background: #f0f4f8;
        color: var(--text-main);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        line-height: 1.6;
    }

    /* Banner */
    .lms-banner {
        background: linear-gradient(90deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 0.6rem 0;
        font-size: 0.9rem;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: var(--shadow-md);
    }
    .lms-banner-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 0 1rem;
    }
    .lms-btn {
        background: white;
        color: #059669;
        padding: 0.25rem 0.75rem;
        border-radius: 99px;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.8rem;
        transition: transform 0.2s;
    }
    .lms-btn:hover { transform: scale(1.05); }
    .lms-btn-outline {
        background: rgba(255,255,255,0.2);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 99px;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.8rem;
        border: 1px solid rgba(255,255,255,0.4);
        transition: background 0.2s;
    }
    .lms-btn-outline:hover { background: rgba(255,255,255,0.3); }

    /* Header Styles */
    .global-header {
        background: var(--surface);
        border-bottom: 1px solid var(--border-color);
        padding: 0.8rem 0;
    }

    .global-nav {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav-brand {
        font-size: 1.4rem;
        font-weight: 900;
        text-decoration: none;
        color: var(--text-main);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .nav-links { display: flex; gap: 1.5rem; }
    .nav-link {
        color: var(--text-muted);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }
    .nav-link:hover { color: var(--theme-primary); }

    /* Breadcrumbs */
    .breadcrumbs {
        background: white;
        border-bottom: 1px solid var(--border-color);
        padding: 0.8rem 0;
        margin-bottom: 2rem;
    }
    .breadcrumbs-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    .breadcrumbs a { color: var(--theme-primary); text-decoration: none; font-weight: 500; }
    .breadcrumbs .current { color: var(--text-main); font-weight: 600; }

    /* Footer Styles */
    .global-footer {
        background: #1a202c;
        color: #e2e8f0;
        padding: 4rem 0 2rem;
        margin-top: auto;
    }

    .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .footer-main { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
    
    .footer-brand h3 { color: white; margin-bottom: 1rem; font-size: 1.5rem; display: flex; align-items: center; gap: 8px; }
    .footer-description { opacity: 0.7; line-height: 1.6; max-width: 400px; font-size: 0.95rem; }
    
    .footer-section h4 { color: white; margin-bottom: 1.2rem; font-size: 1.1rem; font-weight: 700; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 0.8rem; }
    .footer-link { color: #a0aec0; text-decoration: none; transition: color 0.2s; }
    .footer-link:hover { color: white; }

    .footer-bottom {
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 2rem;
        text-align: center;
        font-size: 0.9rem;
        opacity: 0.6;
    }

    .btn-pill {
        display: inline-block;
        background: #10b981;
        color: white;
        padding: 0.7rem 1.5rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        font-size: 0.95rem;
        transition: all 0.3s;
        box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4);
    }
    .btn-pill:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 8px -1px rgba(16, 185, 129, 0.5); }

    /* Concept Card Style (Used in Index) */
    .concept-card {
        background: white;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: var(--shadow-sm);
        margin-bottom: 1.5rem;
        border: 1px solid var(--border-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        display: block;
        color: inherit;
        position: relative;
        overflow: hidden;
    }
    .concept-card::before {
        content: '';
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: 6px;
        background: var(--theme-primary);
        opacity: 0.8;
    }
    .concept-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--theme-primary);
    }

    /* SVG Utilities */
    .icon { width: 20px; height: 20px; vertical-align: middle; }
    .icon-lg { width: 24px; height: 24px; }
    .icon-xl { width: 32px; height: 32px; }
    
    @media (max-width: 768px) {
        .footer-main { grid-template-columns: 1fr; gap: 2rem; }
        .global-nav { flex-direction: column; gap: 1rem; }
        .footer-container { text-align: center; }
        .footer-main { text-align: center; justify-items: center; }
    }
`;


// --- Main Generators ---

export const generateCourseIndexHTML = (courseName: string, syllabus: SyllabusItem[]): string => {
  const itemsHTML = syllabus.map(item => `
    <a href="lesson-${item.lessonNumber}.html" class="concept-card">
        <div style="display: flex; align-items: start; gap: 1.5rem;">
            <div style="
                background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));
                color: white;
                width: 56px; height: 56px;
                border-radius: 16px;
                display: flex; align-items: center; justify-content: center;
                font-size: 1.5rem; font-weight: 800;
                flex-shrink: 0;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
                ${item.lessonNumber}
            </div>
            <div style="flex: 1;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 700;">${item.title}</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 0.8rem;">
                     <span style="background: var(--theme-light); color: var(--theme-primary); padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(0,0,0,0.05);">
                        ${item.topic}
                    </span>
                </div>
                <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem;">${item.description}</p>
            </div>
            <div style="align-self: center; background: #f1f5f9; padding: 10px; border-radius: 50%; color: var(--theme-primary); transition: background 0.2s;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
        </div>
    </a>
  `).join('');

  const primaryColor = "#4f46e5"; 
  const secondaryColor = "#818cf8";

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseName} - תוכן המדריך | EduManage</title>
    <style>
        ${getSharedStyles(primaryColor, secondaryColor)}
        
        .hero {
            background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
            padding: 4rem 2rem;
            text-align: center;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }
        /* Decorative Background Pattern */
        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: radial-gradient(var(--theme-primary) 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.05;
        }

        .container { max-width: 900px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 1; }
        
        .hero h1 { 
            font-size: 3rem; 
            margin-bottom: 1rem; 
            background: linear-gradient(to right, var(--theme-primary), var(--theme-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 900;
        }
        .hero p { font-size: 1.25rem; color: var(--text-muted); max-width: 600px; margin: 0 auto; }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .section-header h2 { margin: 0; font-size: 1.5rem; color: var(--text-main); }
    </style>
</head>
<body>
    ${getLmsBanner()}
    ${getGlobalHeader(courseName, true)}

    <div class="hero">
        <div class="container">
            <div style="font-size: 4rem; margin-bottom: 1rem;">📚</div>
            <h1>${courseName}</h1>
            <p>מדריך מקצועי: ידע, כלים ותרגול מעשי</p>
        </div>
    </div>

    <main class="container">
        <div style="margin-bottom: 4rem;">
            <div class="section-header">
                <span style="color: var(--theme-primary);">${ICONS.book}</span>
                <h2>פרקי המדריך</h2>
            </div>
            <div class="lesson-list">
                ${itemsHTML}
            </div>
        </div>
    </main>

    ${getGlobalFooter()}
</body>
</html>`;
};

export const generateAssignmentHTML = (data: AssignmentData): string => {
  // Helpers
  const chartBarsHTML = data.chartData.map(item => `
    <div class="bar">
        <div class="bar-fill" style="height: ${item.value * 10}%;">
            <span class="bar-value">${item.value}</span>
        </div>
        <div class="bar-label">${item.label}</div>
    </div>
  `).join('');

  const objectivesHTML = data.objectives.map(obj => `
    <li>
        <span class="check-icon">✓</span>
        ${obj}
    </li>`).join('');

  const questionsHTML = data.questions.map((q, idx) => `
    <div class="question" data-question="${q.id}">
        <div class="question-header">
            <div class="question-badge">שאלה ${idx + 1}</div>
            <div class="question-text">${q.text}</div>
        </div>
        <div class="options">
            ${q.options.map((opt) => `
            <div class="option" onclick="selectOption(this, '${q.id}', ${opt.isCorrect})">
                <div class="radio-circle"></div>
                <input type="radio" name="${q.id}" id="${opt.id}" style="display:none">
                <label for="${opt.id}">${opt.text}</label>
            </div>
            `).join('')}
        </div>
        <div class="feedback" id="feedback-${q.id}"></div>
    </div>
  `).join('');

  const draggableItemsHTML = data.planItems.map((item, idx) => `
    <div class="draggable-item" draggable="true" data-item="item-${idx}">
        <span class="drag-handle">⋮⋮</span>
        ${item}
    </div>
  `).join('');
  
  const flashcardsHTML = (data.flashcards || []).map((card, idx) => `
    <div class="flashcard-container">
        <div class="flashcard" onclick="this.classList.toggle('flipped')">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <div style="font-size:1.5rem; margin-bottom:10px;">💡</div>
                    <h3>${card.term}</h3>
                    <div style="font-size:0.8rem; color:#64748b; margin-top:10px;">לחץ להפוך</div>
                </div>
                <div class="flashcard-back">
                    <p>${card.definition}</p>
                </div>
            </div>
        </div>
    </div>
  `).join('');

  const progressPercent = data.totalLessons > 0 ? (data.lessonNumber / data.totalLessons) * 100 : 0;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} | ${data.courseName}</title>
    <style>
        ${getSharedStyles(data.themeColorPrimary, data.themeColorSecondary)}
        
        /* --- Assignment Specific Styles --- */
        
        .main-container {
            max-width: 900px;
            margin: -60px auto 40px; /* Overlap the header */
            background: var(--surface);
            border-radius: 24px;
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 10;
        }

        /* Decorative Header Background */
        .assignment-header-bg {
            background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%);
            padding: 80px 20px 100px;
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .assignment-header-bg::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px);
            background-size: 24px 24px;
        }
        
        .assignment-meta-header {
            position: relative;
            z-index: 2;
        }
        .course-badge {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(4px);
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 1rem;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .main-title { font-size: 2.5rem; font-weight: 900; margin: 0 0 1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
        .meta-grid {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
            flex-wrap: wrap;
            font-size: 0.95rem;
        }
        .meta-pill { display: flex; align-items: center; gap: 6px; opacity: 0.9; }

        /* Progress Bar */
        .progress-section {
            background: #fff;
            padding: 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .progress-bar-container { width: 100%; height: 6px; background: #f1f5f9; }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--theme-primary), var(--theme-accent));
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            width: 0%;
        }
        .progress-text {
            text-align: center; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; padding: 6px;
            border-bottom: 1px solid var(--border-color);
        }

        /* Content Areas */
        .content { padding: 40px; flex: 1; }
        
        .section { display: none; animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .section.active { display: block; }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .section-header-block {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #f1f5f9;
        }
        .section-icon-box {
            width: 50px; height: 50px;
            background: var(--theme-light);
            color: var(--theme-primary);
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
        }
        .section-titles h2 { margin: 0; font-size: 1.6rem; color: var(--text-main); line-height: 1.2; }
        .section-titles p { margin: 4px 0 0; color: var(--text-muted); font-size: 0.95rem; }

        /* Welcome Box */
        .welcome-card {
            background: white;
            border-radius: 12px;
        }

        /* Context Box */
        .context-card {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
        }
        .context-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 6px; height: 100%;
            background: var(--theme-primary);
        }
        
        .timeline-container { margin: 16px 0; }
        .timeline-info { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--theme-primary); margin-bottom: 6px; }
        .timeline-bar-bg { height: 8px; background: white; border-radius: 4px; overflow: hidden; }
        .timeline-bar-fill { height: 100%; background: var(--theme-primary); border-radius: 4px; }

        .objectives-box {
            background: white;
            border: 1px solid var(--border-color);
            padding: 24px;
            border-radius: 16px;
            margin-top: 32px;
            box-shadow: var(--shadow-sm);
        }
        .objectives-box h4 { margin-top: 0; display: flex; align-items: center; gap: 8px; font-size: 1.1rem; }
        .objectives-box ul { padding: 0; list-style: none; margin: 0; }
        .objectives-box li {
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            color: #4a5568;
        }
        .check-icon {
            color: white; background: #10b981;
            width: 20px; height: 20px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.7rem; font-weight: bold; flex-shrink: 0; margin-top: 3px;
        }

        /* Flashcards */
        .flashcards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0 40px;
        }
        .flashcard-container {
            perspective: 1000px;
            height: 200px;
        }
        .flashcard {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            cursor: pointer;
        }
        .flashcard.flipped {
            transform: rotateY(180deg);
        }
        .flashcard-inner {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }
        .flashcard-front, .flashcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }
        .flashcard-front {
            background-color: white;
            color: var(--text-main);
        }
        .flashcard-back {
            background-color: var(--theme-light);
            color: var(--text-main);
            transform: rotateY(180deg);
            border-color: var(--theme-primary);
        }
        .flashcard-back p { font-size: 0.95rem; line-height: 1.5; margin: 0; }


        /* Case Study - File Look */
        .case-file {
            background: #fff;
            border: 1px solid #e2e8f0;
            padding: 0;
            border-radius: 16px;
            margin: 24px 0;
            box-shadow: var(--shadow-md);
            overflow: hidden;
        }
        .case-header {
            background: #f8fafc;
            padding: 16px 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex; align-items: center; gap: 10px;
            font-weight: 700; color: #475569;
            font-size: 0.9rem; letter-spacing: 0.5px;
        }
        .case-body { padding: 30px; line-height: 1.8; color: #334155; font-size: 1.05rem; }
        
        /* Quiz */
        .question {
            background: white;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 24px;
            border: 1px solid var(--border-color);
            transition: transform 0.2s;
        }
        .question:hover { border-color: var(--theme-primary); }
        
        .question-header { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .question-badge {
            background: var(--theme-light); color: var(--theme-primary);
            font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 6px;
            align-self: flex-start;
        }
        .question-text { font-weight: 700; font-size: 1.15rem; color: var(--text-main); }
        
        .option {
            padding: 16px; border: 2px solid var(--border-color); border-radius: 12px; margin-bottom: 12px;
            cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 14px;
            background: white;
        }
        .radio-circle {
            width: 20px; height: 20px; border-radius: 50%; border: 2px solid #cbd5e0;
            transition: all 0.2s; flex-shrink: 0;
        }
        .option:hover { border-color: var(--theme-primary); background: var(--theme-light); }
        .option.selected { border-color: var(--theme-primary); background: #eff6ff; }
        .option.selected .radio-circle { border-color: var(--theme-primary); background: var(--theme-primary); box-shadow: inset 0 0 0 4px white; }
        
        .option.correct { border-color: #10b981; background: #ecfdf5; }
        .option.incorrect { border-color: #ef4444; background: #fef2f2; }
        
        .feedback { margin-top: 16px; padding: 16px; border-radius: 10px; display: none; font-size: 0.95rem; font-weight: 500; }
        .feedback.success { background: #d1fae5; color: #065f46; border: 1px solid #10b981; }
        .feedback.error { background: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }
        
        /* Chart */
        .chart-card {
            background: white; padding: 32px; border-radius: 16px;
            border: 1px solid var(--border-color); margin: 32px 0;
            box-shadow: var(--shadow-sm);
        }
        .bar-chart {
            display: flex; align-items: flex-end; justify-content: space-around;
            height: 260px; padding-top: 40px; gap: 16px;
        }
        .bar { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; height: 100%; justify-content: flex-end; }
        .bar-fill {
            width: 100%; max-width: 50px;
            background: linear-gradient(180deg, var(--theme-accent) 0%, var(--theme-primary) 100%);
            border-radius: 8px 8px 0 0;
            display: flex; align-items: flex-start; justify-content: center;
            color: white; font-weight: 700; font-size: 0.85rem; padding-top: 8px;
            transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .bar-label { font-size: 0.85rem; color: var(--text-muted); text-align: center; font-weight: 500; }

        /* Inputs */
        .input-group { margin-bottom: 24px; position: relative; }
        .input-label { display: block; font-weight: 700; margin-bottom: 10px; color: var(--text-main); font-size: 1.05rem; }
        .input-field {
            width: 100%; padding: 16px; border: 2px solid var(--border-color); border-radius: 12px;
            font-size: 1rem; font-family: inherit; transition: all 0.2s;
            background: #f8fafc;
        }
        .input-field:focus { 
            outline: none; border-color: var(--theme-primary); background: white; 
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }
        
        /* Drag Drop */
        .drag-drop-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 32px 0; }
        @media (max-width: 768px) { .drag-drop-container { grid-template-columns: 1fr; } }
        
        .draggable-item {
            background: white; padding: 16px; margin-bottom: 12px; border-radius: 10px;
            cursor: grab; border: 1px solid var(--border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            transition: all 0.2s; display: flex; align-items: center; gap: 10px; font-weight: 500;
        }
        .draggable-item:hover { transform: translateY(-2px); border-color: var(--theme-primary); box-shadow: var(--shadow-md); }
        .drag-handle { color: #cbd5e0; cursor: grab; }
        
        .drop-zone {
            min-height: 80px; background: #f8fafc; border: 2px dashed #cbd5e0;
            border-radius: 12px; padding: 16px; margin-bottom: 16px;
            transition: all 0.2s;
        }
        .drop-zone.drag-over { border-color: var(--theme-primary); background: #e0e7ff; }
        .drop-zone:empty::before {
            content: attr(data-placeholder);
            color: #94a3b8; font-size: 0.9rem; text-align: center; display: block; margin-top: 10px;
        }
        
        /* Buttons */
        .button-group { 
            display: flex; gap: 16px; justify-content: center; margin-top: 48px; 
            padding-top: 32px; border-top: 1px solid #f1f5f9; 
        }
        .btn {
            padding: 14px 32px; border: none; border-radius: 14px; font-size: 1rem;
            font-weight: 700; cursor: pointer; transition: all 0.3s;
            display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary { 
            background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)); 
            color: white; 
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .btn-primary:hover:not(:disabled) { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 16px rgba(79, 70, 229, 0.4); 
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(1); }
        
        .btn-secondary { background: white; color: var(--text-muted); border: 2px solid var(--border-color); }
        .btn-secondary:hover { background: #f8fafc; border-color: #cbd5e0; color: var(--text-main); }

        /* File Upload */
        .file-upload-area {
            border: 3px dashed #cbd5e0; border-radius: 16px; padding: 48px; text-align: center;
            cursor: pointer; transition: all 0.3s; background: #f8fafc;
            color: var(--text-muted);
        }
        .file-upload-area:hover { border-color: var(--theme-primary); background: #f0f9ff; color: var(--theme-primary); }
        
        /* Summary */
        .completion-screen { text-align: center; padding: 40px 20px; }
        .completion-icon { 
            font-size: 5rem; margin-bottom: 24px; 
            display: inline-block;
            animation: bounce 2s infinite; 
        }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-20px);} 60% {transform: translateY(-10px);} }
        
        .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin: 40px 0; }
        .summary-card {
            background: white; padding: 24px; border-radius: 16px; text-align: center;
            box-shadow: var(--shadow-md); border: 1px solid var(--border-color);
        }
        .summary-number { font-size: 2.5rem; font-weight: 900; color: var(--theme-primary); margin-bottom: 4px; }
        .summary-label { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        .teaser-box {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 1px solid #10b981;
            padding: 24px; border-radius: 16px; margin: 32px 0;
            position: relative; overflow: hidden;
        }
        .teaser-box h4 { color: #047857; margin: 0 0 8px 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
        .teaser-box p { color: #064e3b; margin: 0; }

    </style>
</head>
<body>
    ${getLmsBanner()}
    ${getGlobalHeader(data.title)}

    <div class="assignment-header-bg">
        <div class="assignment-meta-header">
            <span class="course-badge">${data.courseName} | ${data.semester}</span>
            <h1 class="main-title">${data.title}</h1>
            <div class="meta-grid">
                <div class="meta-pill"><span>🗣️</span> ${data.lecturerName}</div>
                <div class="meta-pill"><span>⏱️</span> ${data.timeEstimate}</div>
                <div class="meta-pill"><span>📅</span> ${data.dueDate}</div>
                <div class="meta-pill"><span>💯</span> ${data.weight}</div>
            </div>
        </div>
    </div>

    <main class="main-container">
        
        <div class="progress-section">
            <div class="progress-bar-container">
                <div class="progress-fill" id="progressBar"></div>
            </div>
            <div class="progress-text" id="progressText">0% הושלם</div>
        </div>
        
        <div class="content">
            <!-- Section 0: Welcome -->
            <div class="section active" id="section-0">
                <div class="welcome-card">
                    
                    ${(data.topic || data.contextDescription) ? `
                    <div class="context-card">
                        <div style="font-weight: 700; color: var(--theme-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            ${ICONS.book} הקשר לימודי ורצף הוראה
                        </div>
                        
                        ${(data.lessonNumber && data.totalLessons) ? `
                        <div class="timeline-container">
                             <div class="timeline-info">
                                <span>פרק ${data.lessonNumber}</span>
                                <span>מתוך ${data.totalLessons}</span>
                             </div>
                             <div class="timeline-bar-bg">
                                 <div class="timeline-bar-fill" style="width: ${progressPercent}%"></div>
                             </div>
                        </div>
                        ` : ''}

                        ${data.topic ? `<div style="margin-bottom: 8px; font-weight:700; color:#1e293b;">נושא: ${data.topic}</div>` : ''}
                        
                        <div style="color: #475569; font-size: 0.95rem;">${data.contextDescription}</div>
                        
                        ${data.prerequisite ? `
                        <div style="margin-top: 16px; background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px; font-size: 0.9rem; border: 1px solid #bfdbfe;">
                            📋 <strong>ידע קודם נדרש:</strong> ${data.prerequisite}
                        </div>` : ''}
                    </div>
                    ` : ''}
                    
                    <h3 style="font-size: 1.8rem; margin-bottom: 16px; color: var(--text-main); line-height: 1.3;">${data.welcomeTitle}</h3>
                    <p style="font-size: 1.1rem; color: #4a5568; margin-bottom: 24px;">${data.welcomeText}</p>
                    
                     <div class="objectives-box" style="margin-bottom: 32px;">
                         <h4 style="margin-bottom: 16px; color: var(--theme-primary);">${ICONS.flashcards} מושגי מפתח (לחץ להפוך)</h4>
                         <div class="flashcards-grid">
                            ${flashcardsHTML}
                         </div>
                    </div>

                    <div class="objectives-box">
                        <h4>${ICONS.target} מטרות הפרק</h4>
                        <ul>${objectivesHTML}</ul>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="nav.next()">התחל ללמוד &larr;</button>
                </div>
            </div>

            <!-- Section 1: Case Study & Quiz -->
            <div class="section" id="section-1">
                <div class="section-header-block">
                    <div class="section-icon-box">${ICONS.case}</div>
                    <div class="section-titles">
                        <h2>הקשר ורקע</h2>
                        <p>קרא את המקרה וענה על השאלות</p>
                    </div>
                </div>
                
                <div class="case-file">
                    <div class="case-header">
                        <span>📁</span> ${data.caseStudyTitle}
                    </div>
                    <div class="case-body">
                        ${data.caseStudyContent}
                    </div>
                </div>
                
                <div id="quiz-container">
                    ${questionsHTML}
                </div>

                <div class="button-group">
                    <button class="btn btn-secondary" onclick="nav.prev()">חזור</button>
                    <button class="btn btn-primary" id="btn-sec-1" onclick="nav.next()" disabled>המשך</button>
                </div>
            </div>

            <!-- Section 2: Analysis -->
            <div class="section" id="section-2">
                <div class="section-header-block">
                    <div class="section-icon-box">${ICONS.analysis}</div>
                    <div class="section-titles">
                        <h2>${data.analysisTitle}</h2>
                        <p>ניתוח נתונים וקבלת החלטות</p>
                    </div>
                </div>

                <p style="margin-bottom: 24px; font-size: 1.1rem; color: #4a5568;">${data.analysisDescription}</p>

                <div class="chart-card">
                    <h4 style="text-align: center; margin-bottom: 10px; color: var(--text-main); font-size: 1.1rem;">${data.chartTitle}</h4>
                    <div class="bar-chart">
                        ${chartBarsHTML}
                    </div>
                </div>

                <div class="input-group">
                    <label class="input-label">${data.analysisQuestionText}</label>
                    <textarea class="input-field" id="input-analysis" rows="5" 
                        oninput="validateInput('analysis', this.value, ${data.analysisMinChars})"
                        placeholder="כתוב כאן... (מינימום ${data.analysisMinChars} תווים)"></textarea>
                    <div style="text-align: left; font-size: 0.85rem; margin-top: 8px; color: var(--text-muted); font-weight: 500;">
                        <span id="count-analysis">0</span> / ${data.analysisMinChars}
                    </div>
                </div>

                <div class="button-group">
                    <button class="btn btn-secondary" onclick="nav.prev()">חזור</button>
                    <button class="btn btn-primary" id="btn-sec-2" onclick="nav.next()" disabled>המשך</button>
                </div>
            </div>

            <!-- Section 3: Plan (Sort) -->
            <div class="section" id="section-3">
                <div class="section-header-block">
                    <div class="section-icon-box">${ICONS.plan}</div>
                    <div class="section-titles">
                        <h2>${data.planTitle}</h2>
                        <p>תכנון וביצוע</p>
                    </div>
                </div>

                <p style="margin-bottom: 24px; font-size: 1.1rem; color: #4a5568;">${data.planDescription}</p>

                <div class="drag-drop-container">
                    <div style="background: #f8fafc; padding: 20px; border-radius: 16px; border:1px solid #e2e8f0;">
                        <h4 style="margin-bottom: 16px; color: var(--text-main); font-size: 1rem;">🗂️ פעולות זמינות (גרירה)</h4>
                        <div id="draggables">
                            ${draggableItemsHTML}
                        </div>
                    </div>
                    <div style="background: #eff6ff; padding: 20px; border-radius: 16px; border:1px solid #bfdbfe;">
                        <h4 style="margin-bottom: 16px; color: var(--theme-primary); font-size: 1rem;">🎯 סדר הפעולות (שחרור)</h4>
                        <div class="drop-zone" data-step="1" data-placeholder="גרור לכאן את השלב הראשון"></div>
                        <div class="drop-zone" data-step="2" data-placeholder="גרור לכאן את השלב השני"></div>
                        <div class="drop-zone" data-step="3" data-placeholder="גרור לכאן את השלב השלישי"></div>
                        <div class="drop-zone" data-step="4" data-placeholder="גרור לכאן את השלב הרביעי"></div>
                    </div>
                </div>

                <div class="input-group">
                    <label class="input-label">${data.planQuestionText}</label>
                    <textarea class="input-field" id="input-plan" rows="4"
                        oninput="validateInput('plan', this.value, ${data.planMinChars})"
                        placeholder="הסבר את בחירותיך..."></textarea>
                    <div style="text-align: left; font-size: 0.85rem; margin-top: 8px; color: var(--text-muted); font-weight: 500;">
                        <span id="count-plan">0</span> / ${data.planMinChars}
                    </div>
                </div>

                <div class="button-group">
                    <button class="btn btn-secondary" onclick="nav.prev()">חזור</button>
                    <button class="btn btn-primary" id="btn-sec-3" onclick="nav.next()" disabled>המשך</button>
                </div>
            </div>

            <!-- Section 4: File & Reflection -->
            <div class="section" id="section-4">
                 <div class="section-header-block">
                    <div class="section-icon-box">${ICONS.upload}</div>
                    <div class="section-titles">
                        <h2>סיכום והגשה</h2>
                        <p>העלאת קבצים ורפלקציה</p>
                    </div>
                </div>

                <div class="file-upload-area" onclick="document.getElementById('fileInput').click()">
                    <div style="margin-bottom: 16px; color: var(--theme-primary);">${ICONS.upload.replace('width="24"', 'width="48"').replace('height="24"', 'height="48"')}</div>
                    <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">לחץ להעלאת קובץ (אופציונלי)</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">PDF, Word, Excel</p>
                    <input type="file" id="fileInput" style="display:none" onchange="handleFile(this)">
                </div>
                <div id="file-info" style="display:none; margin-top: 16px; background: #ecfdf5; padding: 12px 16px; border-radius: 10px; color: #065f46; border: 1px solid #10b981; font-weight: 600;">
                    ✅ קובץ נבחר: <span id="filename"></span>
                </div>

                <div class="input-group" style="margin-top: 40px;">
                    <label class="input-label">${data.reflectionQuestionText}</label>
                    <textarea class="input-field" id="input-reflection" rows="4"
                         oninput="validateInput('reflection', this.value, ${data.reflectionMinChars})"
                         placeholder="שתף במחשבותיך..."></textarea>
                    <div style="text-align: left; font-size: 0.85rem; margin-top: 8px; color: var(--text-muted); font-weight: 500;">
                        <span id="count-reflection">0</span> / ${data.reflectionMinChars}
                    </div>
                </div>

                 <div class="button-group">
                    <button class="btn btn-secondary" onclick="nav.prev()">חזור</button>
                    <button class="btn btn-primary" id="btn-sec-4" onclick="finishAssignment()" disabled>סיום והגשה</button>
                </div>
            </div>

            <!-- Section 5: Summary -->
            <div class="section" id="section-5">
                <div class="completion-screen">
                    <div class="completion-icon">🎉</div>
                    <h2 style="font-size: 2rem; margin-bottom: 10px;">כל הכבוד!</h2>
                    <p style="font-size: 1.2rem; color: var(--text-muted);">סיימת את הפרק בהצלחה</p>
                </div>

                <div class="summary-grid">
                     <div class="summary-card">
                        <div class="summary-number" id="final-score">0</div>
                        <div class="summary-label">ציון משוער</div>
                    </div>
                     <div class="summary-card">
                        <div class="summary-number" id="final-time">0</div>
                        <div class="summary-label">דקות</div>
                    </div>
                </div>
                
                ${data.nextLessonTeaser ? `
                <div class="teaser-box">
                    <h4>💡 בפרק הבא...</h4>
                    <p>${data.nextLessonTeaser}</p>
                </div>
                ` : ''}
                
                <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin-top: 32px; border: 1px solid var(--border-color); text-align: center;">
                    <h4 style="margin: 0 0 8px 0;">תשובותיך נשמרו.</h4>
                    <p style="margin: 0; color: var(--text-muted);">מומלץ לשמור עותק של התשובות לשימוש עתידי.</p>
                </div>

                <div class="button-group">
                    <button class="btn btn-primary" onclick="window.print()">🖨️ שמור כ-PDF</button>
                </div>
            </div>
        </div>
    </main>

    ${getGlobalFooter()}

    <script>
        // Data & State
        const CONFIG = {
            totalSections: 5,
            requiredQuestions: ${data.questions.length},
            charLimits: {
                analysis: ${data.analysisMinChars},
                plan: ${data.planMinChars},
                reflection: ${data.reflectionMinChars}
            }
        };

        const state = {
            currentSection: 0,
            answers: {
                quiz: {},
                text: {},
                drag: {},
                file: null
            },
            startTime: Date.now()
        };

        // Navigation
        const nav = {
            next: () => {
                document.getElementById('section-' + state.currentSection).classList.remove('active');
                state.currentSection++;
                document.getElementById('section-' + state.currentSection).classList.add('active');
                updateProgress();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            prev: () => {
                document.getElementById('section-' + state.currentSection).classList.remove('active');
                state.currentSection--;
                document.getElementById('section-' + state.currentSection).classList.add('active');
                updateProgress();
            }
        };

        function updateProgress() {
            const pct = Math.round((state.currentSection / CONFIG.totalSections) * 100);
            document.getElementById('progressBar').style.width = pct + '%';
            document.getElementById('progressText').innerText = pct + '% הושלם';
        }

        // Quiz Logic
        window.selectOption = (el, qId, isCorrect) => {
            // UI
            const parent = el.closest('.options');
            parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
            el.classList.add('selected');
            el.querySelector('input').checked = true;

            const fb = document.getElementById('feedback-' + qId);
            fb.classList.remove('success', 'error');
            fb.style.display = 'block';

            if(isCorrect) {
                el.classList.add('correct');
                fb.classList.add('success');
                fb.innerText = '✓ תשובה נכונה';
            } else {
                el.classList.add('incorrect');
                fb.classList.add('error');
                fb.innerText = '✗ נסה שוב';
            }

            state.answers.quiz[qId] = isCorrect;
            checkSection1();
        }

        function checkSection1() {
            const answered = Object.keys(state.answers.quiz).length;
            const btn = document.getElementById('btn-sec-1');
            btn.disabled = answered < CONFIG.requiredQuestions;
        }

        // Text Validation
        window.validateInput = (type, val, min) => {
            const countEl = document.getElementById('count-' + type);
            const len = val.trim().length;
            countEl.innerText = len;
            countEl.style.color = len >= min ? '#10b981' : '#ef4444';
            countEl.style.fontWeight = len >= min ? 'bold' : 'normal';
            
            state.answers.text[type] = val;
            
            // Check buttons
            if(type === 'analysis') document.getElementById('btn-sec-2').disabled = len < min;
            if(type === 'plan') document.getElementById('btn-sec-3').disabled = len < min;
            if(type === 'reflection') checkSection4();
        }

        // Drag Drop
        let dragged = null;
        document.querySelectorAll('.draggable-item').forEach(item => {
            item.addEventListener('dragstart', e => { 
                dragged = e.target; 
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            });
            item.addEventListener('dragend', e => { 
                e.target.style.opacity = '1';
                dragged = null;
            });
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
            zone.addEventListener('dragleave', e => { zone.classList.remove('drag-over'); });
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                if(dragged && !zone.hasChildNodes()) { // Only 1 item per zone
                    zone.innerHTML = ''; 
                    zone.appendChild(dragged);
                    checkSection3();
                } else if (dragged && zone.children.length > 0) {
                     // Allow swapping or replacing if needed, for now just replace logic or append if we wanted list
                     const existing = zone.children[0];
                     // Optional: return existing to pool? For now, simplistic swap
                     document.getElementById('draggables').appendChild(existing);
                     zone.appendChild(dragged);
                     checkSection3();
                }
            });
        });

        function checkSection3() {
            // Simple check: user placed at least 3 items?
            const placed = document.querySelectorAll('.drop-zone .draggable-item').length;
            const hasText = (state.answers.text['plan'] || '').length >= CONFIG.charLimits.plan;
            document.getElementById('btn-sec-3').disabled = !(placed >= 3 && hasText);
        }

        // File
        window.handleFile = (input) => {
            if(input.files && input.files[0]) {
                document.getElementById('file-info').style.display = 'block';
                document.getElementById('filename').innerText = input.files[0].name;
                state.answers.file = input.files[0].name;
            }
        }
        
        function checkSection4() {
             const len = (state.answers.text['reflection'] || '').length;
             document.getElementById('btn-sec-4').disabled = len < CONFIG.charLimits.reflection;
        }

        // Finish
        window.finishAssignment = () => {
            nav.next(); // Go to summary
            
            // Calc Score (Simple Gamification)
            let score = 0;
            // Quiz: 30 pts
            const correctCount = Object.values(state.answers.quiz).filter(v => v).length;
            score += Math.round((correctCount / CONFIG.requiredQuestions) * 30);
            // Text: 70 pts (if completed)
            score += 70;

            document.getElementById('final-score').innerText = score;
            document.getElementById('final-time').innerText = Math.round((Date.now() - state.startTime) / 60000);
            
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('progressText').innerText = '100% הושלם';
        }

    </script>
</body>
</html>`;
};