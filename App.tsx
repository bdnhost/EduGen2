
import React, { useState, useEffect } from 'react';
import { SyllabusItem, AssignmentData, StudentState, GuideIdea } from './types';
import { generateSyllabus, generateAssignmentFromTopic, generateStudentInsight, fetchTrendingIdeas } from './services/aiService';
import { generateAssignmentHTML, generateCourseIndexHTML } from './services/generatorService';
import { uploadToCPanel, getUploadConfig } from './services/uploadService';
import StudentDashboard from './components/StudentDashboard';
import ChapterPreviewModal from './components/ChapterPreviewModal';
import { Download, Wand2, Eye, Zap, Sparkles, Lightbulb, Package, CheckCircle, RefreshCcw, LayoutGrid, Cpu, Briefcase, Heart, Palette, GraduationCap, Upload, Server } from 'lucide-react';
import JSZip from 'jszip';
import { GUIDE_IDEAS } from './constants';

function App() {
  const [view, setView] = useState<'input' | 'syllabus'>('input');
  const [topic, setTopic] = useState('');
  const [englishTitle, setEnglishTitle] = useState('My-Guide');
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('מייצר תוכן...');
  const [batchProgress, setBatchProgress] = useState<{current: number, total: number} | null>(null);
  const [previewChapter, setPreviewChapter] = useState<SyllabusItem | 'index' | null>(null);
  
  const [currentIdeas, setCurrentIdeas] = useState<GuideIdea[]>(GUIDE_IDEAS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Auto-upload state
  const [autoUploadEnabled, setAutoUploadEnabled] = useState(
    process.env.AUTO_UPLOAD_ENABLED === 'true'
  );
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const [studentState, setStudentState] = useState<StudentState>({
    completed_items: [],
    competencies: { "תפעול דיגיטלי": 0, "שימוש ב-AI": 0, "יישומי אופיס": 0, "אבטחת מידע": 0 },
    overall_progress: 0,
    momentum: 100,
    last_active: new Date().toISOString(),
    ai_insight: "העולם הדיגיטלי משתנה מהר. המפתח הוא ללמוד איך לרתום את הטכנולוגיה לטובתנו!"
  });

  const categories = [
    { id: 'All', name: 'הכל', icon: <LayoutGrid size={16}/> },
    { id: 'Trending', name: 'מגמות שבועיות', icon: <Zap size={16} className="text-yellow-500 animate-pulse"/> },
    { id: 'Tech', name: 'טכנולוגיה', icon: <Cpu size={16}/> },
    { id: 'Business', name: 'עסקים', icon: <Briefcase size={16}/> },
    { id: 'Soft Skills', name: 'פיתוח אישי', icon: <Heart size={16}/> },
    { id: 'Creative', name: 'יצירתיות', icon: <Palette size={16}/> },
  ];

  const handleDiscoverTrends = async () => {
    setIsDiscovering(true);
    try {
      const trends = await fetchTrendingIdeas();
      if (trends.length > 0) {
        setCurrentIdeas(prev => {
          const nonTrends = prev.filter(i => i.category !== 'Trending');
          return [...trends, ...nonTrends];
        });
        setActiveCategory('Trending');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDiscovering(false);
    }
  };

  const filteredIdeas = activeCategory === 'All' 
    ? currentIdeas 
    : currentIdeas.filter(i => i.category === activeCategory);

  const handleStart = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setLoadingText('מנתח נושא ובונה סילבוס פדגוגי...');
    try {
      const { syllabus: chapters, englishTitle: eng } = await generateSyllabus(topic);
      setSyllabus(chapters);
      setEnglishTitle(eng);
      setView('syllabus');
      const insight = await generateStudentInsight(studentState, topic);
      setStudentState(prev => ({ ...prev, ai_insight: insight }));
    } catch (e) {
        alert("שגיאה ביצירת הסילבוס. נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectIdea = (ideaTitle: string) => {
    setTopic(ideaTitle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateChapterContent = async (item: SyllabusItem) => {
    setIsLoading(true);
    setLoadingText(`יוצר תוכן אינטראקטיבי לפרק ${item.lessonNumber}...`);
    try {
      const content = await generateAssignmentFromTopic(item.topic, topic, item.lessonNumber, syllabus.length);
      setSyllabus(prev => prev.map(s => s.id === item.id ? { ...s, generatedData: content } : s));
    } catch (e) {
      alert("ייצור התוכן נכשל.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportAllChapters = async () => {
    setIsLoading(true);
    setBatchProgress({ current: 0, total: syllabus.length });
    let updatedSyllabus = [...syllabus];
    for (let i = 0; i < updatedSyllabus.length; i++) {
      const chapter = updatedSyllabus[i];
      setBatchProgress({ current: i + 1, total: syllabus.length });
      if (!chapter.generatedData) {
        setLoadingText(`מייצר את פרק ${chapter.lessonNumber}: ${chapter.title}...`);
        try {
          const content = await generateAssignmentFromTopic(chapter.topic, topic, chapter.lessonNumber, syllabus.length);
          updatedSyllabus[i] = { ...chapter, generatedData: content };
          setSyllabus([...updatedSyllabus]);
        } catch (e) { console.error(e); }
      }
    }
    await downloadAsZip(updatedSyllabus);
    setBatchProgress(null);
    setIsLoading(false);
  };

  const downloadAsZip = async (currentSyllabus = syllabus) => {
    const zip = new JSZip();
    const sanitizedCourseName = englishTitle.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const mediaMetadata: any[] = [];
    zip.file('index.html', generateCourseIndexHTML(topic, currentSyllabus));
    currentSyllabus.forEach(item => {
      if (item.generatedData) {
        item.generatedData.totalLessons = currentSyllabus.length;
        zip.file(`lesson-${item.lessonNumber}.html`, generateAssignmentHTML(item.generatedData));
        ['welcome', 'caseStudy', 'summary'].forEach(partKey => {
           const part = (item.generatedData!.narration as any)[partKey];
           mediaMetadata.push({
              id: `task_ch${item.lessonNumber}_${partKey}`,
              course_id: sanitizedCourseName,
              title: `${item.title} - ${partKey}`,
              entity_type: "assignment",
              script: part.script,
              prompt: partKey === 'welcome' ? item.generatedData!.imagePrompt : null,
              filename: part.fileName,
              image_filename: `media_${item.lessonNumber}.png`,
              width: 1024, height: 1024,
              stability: 0.5, similarity_boost: 0.8, model_id: "eleven_v3"
           });
        });
      }
    });
    zip.file('media.json', JSON.stringify(mediaMetadata, null, 2));
    const content = await zip.generateAsync({ type: 'blob' });

    // Download locally
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${sanitizedCourseName}_Course.zip`;
    link.click();

    // Auto-upload to cPanel if enabled
    if (autoUploadEnabled) {
      const uploadConfig = getUploadConfig();
      if (uploadConfig) {
        setUploadStatus('מעלה לשרת...');
        setLoadingText(`📤 מעלה את "${sanitizedCourseName}" ל-bdnhost.net/Resources/...`);
        try {
          const result = await uploadToCPanel(content, sanitizedCourseName, uploadConfig);
          if (result.success) {
            setUploadStatus(`✅ ${result.message}`);
            setTimeout(() => setUploadStatus(''), 5000);
            alert(`🎉 הצלחה!\n\n${result.message}\n\nהקורס זמין עכשיו ב:\nhttps://bdnhost.net/Resources/${sanitizedCourseName}/`);
          } else {
            setUploadStatus(`❌ ${result.message}`);
            console.error('Upload failed:', result.error);
            alert(`העלאה נכשלה: ${result.error || result.message}\n\nהקובץ הורד למחשב שלך בהצלחה.`);
          }
        } catch (error: any) {
          setUploadStatus('❌ שגיאה בהעלאה');
          console.error('Upload error:', error);
          alert(`שגיאה בהעלאה: ${error.message}\n\nהקובץ הורד למחשב שלך בהצלחה.`);
        }
      } else {
        setUploadStatus('⚠️ העלאה לא הוגדרה');
        console.warn('Upload config not found in environment variables');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right pb-20 selection:bg-indigo-100 selection:text-indigo-900" dir="rtl">
      {isLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={36} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">EduGen <span className="text-indigo-600">Active</span></h2>
          <p className="text-slate-500 font-bold text-lg max-w-md">{loadingText}</p>
          {batchProgress && (
            <div className="mt-8 w-full max-w-md px-10">
                <div className="flex justify-between text-xs font-black text-indigo-600 mb-2">
                    <span>{Math.round((batchProgress.current / batchProgress.total) * 100)}%</span>
                    <span>פרק {batchProgress.current} מתוך {batchProgress.total}</span>
                </div>
                <div className="h-3 bg-indigo-50 rounded-full overflow-hidden border border-indigo-100 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-500" style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }} />
                </div>
            </div>
          )}
        </div>
      )}

      {view === 'input' && (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen flex flex-col items-center py-12 md:py-24 px-4">
          <div className="max-w-6xl w-full flex flex-col items-center">
            {/* Minimalist Hero */}
            <div className="w-full max-w-3xl text-center mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black mb-6 border border-indigo-100 shadow-sm">
                  <GraduationCap size={14} /> מחולל המדריכים האינטראקטיבי
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                  בנה מדריך <br/> <span className="text-indigo-600">חכם יותר.</span>
               </h1>
               <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                 הכנס נושא, וקבל סילבוס פדגוגי, תוכן אינטראקטיבי וקובצי ZIP מוכנים להפצה בתוך דקות.
               </p>
               
               <div className="relative mb-8 group max-w-2xl mx-auto">
                 <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="מה נלמד היום? (למשל: סייבר אישי)"
                    className="w-full px-10 py-8 bg-white border-2 border-slate-200 rounded-[2.5rem] outline-none text-2xl text-center shadow-xl shadow-slate-100 focus:border-indigo-400 focus:shadow-2xl focus:shadow-indigo-100 transition-all font-black"
                 />
                 <button 
                  onClick={handleStart}
                  className="mt-8 w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-indigo-200 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                  <Wand2 size={30} /> התחל ייצור סילבוס
                 </button>
               </div>
            </div>

            {/* Ideas Section */}
            <div className="w-full max-w-6xl mt-12">
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
                    <Lightbulb size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">השראה לתוכן</h2>
                    <p className="text-slate-500 font-bold">בחר נושא קיים או סרוק את הרשת לטרנדים</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleDiscoverTrends}
                  disabled={isDiscovering}
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] font-black text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-lg group active:scale-95"
                >
                  <RefreshCcw size={20} className={isDiscovering ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                  {isDiscovering ? 'סורק מגמות עולמיות...' : 'גלה טרנדים (AI Discovery)'}
                </button>
              </div>

              {/* Categorization */}
              <div className="flex flex-wrap justify-center gap-3 mb-14">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-black transition-all border-2 ${
                      activeCategory === cat.id 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-105' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30'
                    }`}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Ideas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredIdeas.map((idea) => (
                  <button 
                    key={idea.id}
                    onClick={() => selectIdea(idea.title)}
                    className={`relative p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 text-right group overflow-hidden flex flex-col items-start ${idea.isTrend ? 'bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100 ring-2 ring-indigo-50 ring-offset-4' : ''}`}
                  >
                    {idea.isTrend && (
                      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <Zap size={12} fill="white"/> Weekly Trend
                      </div>
                    )}
                    <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-500 origin-right">{idea.icon}</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{idea.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">{idea.description}</p>
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                      התחל לבנות <span className="text-xl">←</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'syllabus' && (
        <div className="max-w-6xl mx-auto px-6 py-12 md:pb-40">
          <header className="mb-14 flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">{topic}</h1>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                 <span className="px-5 py-2 bg-indigo-100 text-indigo-700 rounded-full font-black text-sm border border-indigo-200">סילבוס פדגוגי מאושר</span>
                 <span className="px-5 py-2 bg-slate-100 text-slate-600 rounded-full font-black text-sm border border-slate-200">{syllabus.length} פרקים</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              <button onClick={exportAllChapters} className="flex items-center gap-4 px-10 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-100 hover:bg-black transition-all active:scale-95">
                <Package size={26} /> ייצור ויצוא אחוד (ZIP)
              </button>

              {/* Auto-Upload Toggle */}
              <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-[2rem] border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoUploadEnabled}
                    onChange={(e) => setAutoUploadEnabled(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-700">
                    <Upload size={18} />
                    <span>העלאה אוטומטית ל-bdnhost.net</span>
                  </div>
                </label>
                {uploadStatus && (
                  <span className="text-xs font-bold px-3 py-1 bg-white rounded-full border border-slate-200">{uploadStatus}</span>
                )}
              </div>
            </div>
          </header>

          <StudentDashboard state={studentState} courseTitle={topic} />

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {syllabus.map((item) => (
               <div key={item.id} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col border-b-[8px] border-b-slate-100 hover:border-b-indigo-500 relative group">
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-xs font-black px-5 py-2 rounded-2xl bg-indigo-50 text-indigo-700 uppercase tracking-widest">פרק {item.lessonNumber}</div>
                    {item.generatedData && (
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <CheckCircle size={24} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-10 leading-relaxed flex-grow font-medium">{item.description}</p>
                  
                  <div className="flex flex-col gap-4 mt-auto">
                    {item.generatedData ? (
                      <button onClick={() => setPreviewChapter(item)} className="w-full py-5 bg-slate-50 text-slate-900 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 transition-all">
                        <Eye size={20} /> תצוגה מקדימה ופיקוח
                      </button>
                    ) : (
                      <button onClick={() => generateChapterContent(item)} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-black shadow-xl shadow-indigo-50 transition-all active:scale-95">
                        <Wand2 size={20} /> יצירת תוכן
                      </button>
                    )}
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {previewChapter && (
        <ChapterPreviewModal 
          item={previewChapter}
          courseTitle={topic}
          syllabus={syllabus}
          onClose={() => setPreviewChapter(null)}
        />
      )}
    </div>
  );
}

export default App;
