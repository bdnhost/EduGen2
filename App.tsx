import React, { useState, useEffect } from 'react';
import { Download, Play, ArrowLeft, Wand2, Loader2, FileText, CheckCircle2, ListOrdered, Calendar, Layers, PackageCheck } from 'lucide-react';
import JSZip from 'jszip';
import { INITIAL_DATA } from './constants';
import { AssignmentData, SyllabusItem } from './types';
import Editor from './components/Editor';
import { generateAssignmentHTML, generateCourseIndexHTML } from './services/generatorService';
import { generateAssignmentFromTopic, generateSyllabus } from './services/aiService';

// Loading stages text
const LOADING_STAGES = [
  "מנתח את נושא המדריך...",
  "מזהה את מושגי היסוד החשובים...",
  "בונה גשר פדגוגי לפרק הבא...",
  "מנסח שאלות ואתגרי חשיבה...",
  "מעצב את המדריך..."
];

type AppView = 'input' | 'planning_syllabus' | 'syllabus' | 'generating' | 'generating_batch' | 'result';

function App() {
  const [view, setView] = useState<AppView>('input');
  const [topic, setTopic] = useState('');
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [data, setData] = useState<AssignmentData>(INITIAL_DATA);
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  
  // Loading State
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  
  // Batch State
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, currentTitle: '' });
  
  // Store the English title for ZIP naming
  const [courseTitleEn, setCourseTitleEn] = useState('');

  // --- Effects ---

  // Update preview whenever data changes
  useEffect(() => {
    if (view === 'result') {
      const html = generateAssignmentHTML(data);
      setHtmlPreview(html);
    }
  }, [data, view]);

  // Cycle through loading messages
  useEffect(() => {
    let interval: number;
    if (view === 'generating') {
      interval = window.setInterval(() => {
        setLoadingStageIndex(prev => (prev + 1) % LOADING_STAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [view]);

  // --- Handlers ---

  const handleGenerateSingle = async () => {
    if (!topic.trim()) return;
    
    setView('generating');
    setLoadingStageIndex(0);
    
    try {
      const generatedData = await generateAssignmentFromTopic(topic);
      setData(generatedData);
      setView('result');
    } catch (error) {
      console.error(error);
      alert("אירעה שגיאה ביצירת המדריך. אנא נסה שנית.");
      setView('input');
    }
  };

  const handlePlanCourse = async () => {
    if (!topic.trim()) return;
    setView('planning_syllabus');
    
    try {
      const { syllabus: items, englishTitle } = await generateSyllabus(topic);
      setSyllabus(items);
      setCourseTitleEn(englishTitle);
      setView('syllabus');
    } catch (error) {
       console.error(error);
       alert("אירעה שגיאה בתכנון המדריך");
       setView('input');
    }
  };

  const handleSelectSyllabusItem = async (item: SyllabusItem) => {
      // If already generated, use it
      if (item.generatedData) {
          setData(item.generatedData);
          setView('result');
          return;
      }

      setView('generating');
      setLoadingStageIndex(0);

      try {
        // Didactic Context Calculation
        const index = syllabus.findIndex(s => s.lessonNumber === item.lessonNumber);
        const previousTopic = index > 0 ? syllabus[index - 1].topic : undefined;
        const nextTopic = index < syllabus.length - 1 ? syllabus[index + 1].topic : undefined;

        const generatedData = await generateAssignmentFromTopic(item.topic, { 
            courseName: topic,
            lessonNumber: item.lessonNumber,
            totalLessons: syllabus.length,
            previousTopic,
            nextTopic
        });
        
        // Save back to syllabus cache
        const newSyllabus = [...syllabus];
        if (index >= 0) newSyllabus[index].generatedData = generatedData;
        setSyllabus(newSyllabus);

        setData(generatedData);
        setView('result');
      } catch (error) {
        console.error(error);
        alert("אירעה שגיאה ביצירת הפרק. אנא נסה שנית.");
        setView('syllabus');
      }
  };

  const handleGenerateAll = async () => {
      setView('generating_batch');
      const newSyllabus = [...syllabus];
      
      for (let i = 0; i < newSyllabus.length; i++) {
          if (!newSyllabus[i].generatedData) {
              setBatchProgress({
                  current: i + 1,
                  total: newSyllabus.length,
                  currentTitle: newSyllabus[i].title
              });
              
              const previousTopic = i > 0 ? newSyllabus[i - 1].topic : undefined;
              const nextTopic = i < newSyllabus.length - 1 ? newSyllabus[i + 1].topic : undefined;

              try {
                  const data = await generateAssignmentFromTopic(newSyllabus[i].topic, {
                    courseName: topic,
                    lessonNumber: newSyllabus[i].lessonNumber,
                    totalLessons: newSyllabus.length,
                    previousTopic,
                    nextTopic
                  });
                  newSyllabus[i].generatedData = data;
                  setSyllabus([...newSyllabus]); // Update state incrementally to show progress checkboxes?
              } catch (e) {
                  console.error(`Failed to generate item ${i}`, e);
              }
          }
      }
      setSyllabus(newSyllabus);
      setView('syllabus'); // Go back to syllabus view, now populated
  };

  const handleDownloadZip = async () => {
      setIsExporting(true);
      try {
          const zip = new JSZip();
          // Use English title for folder name, fallback to generic if empty
          const safeName = courseTitleEn 
              ? courseTitleEn.replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '-')
              : `Guide-${topic.replace(/\s+/g, '-')}`;
              
          const folder = zip.folder(safeName);
          
          if (!folder) throw new Error("Could not create zip folder");

          // 1. Generate Course Index
          const indexHTML = generateCourseIndexHTML(topic, syllabus);
          folder.file("index.html", indexHTML);

          // 2. Generate each assignment
          syllabus.forEach(item => {
              if (item.generatedData) {
                  const html = generateAssignmentHTML(item.generatedData);
                  folder.file(`chapter-${item.lessonNumber}.html`, html);
              }
          });

          // 3. Download
          const content = await zip.generateAsync({ type: "blob" });
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${safeName}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

      } catch (e) {
          console.error(e);
          alert('Failed to generate ZIP');
      } finally {
          setIsExporting(false);
      }
  };

  const handleDownloadSingle = () => {
    setIsExporting(true);
    try {
        const html = generateAssignmentHTML(data);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Guide-Chapter-${data.title.replace(/\s+/g, '-').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error(e);
        alert('Failed to generate file');
    } finally {
        setIsExporting(false);
    }
  };

  // --- Views ---

  if (view === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center transition-all hover:scale-[1.01]">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <Wand2 className="text-white w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">מחולל מדריכים</h1>
          <p className="text-gray-500 mb-8">הזן נושא למדריך שברצונך ליצור. המערכת תיצור עבורך סילבוס ותוכן מלא.</p>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="למשל: מדריך פייתון למתחילים, יסודות הגינון..."
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateSingle()}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={handleGenerateSingle}
                    disabled={!topic.trim()}
                    className="py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex flex-col items-center justify-center gap-1"
                    >
                    <Wand2 className="w-5 h-5" />
                    צור פרק בודד
                </button>
                <button
                    onClick={handlePlanCourse}
                    disabled={!topic.trim()}
                    className="py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex flex-col items-center justify-center gap-1"
                    >
                    <ListOrdered className="w-5 h-5" />
                    תכנן תוכן מדריך
                </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1"><CheckCircle2 size={12}/> תוכן אינטראקטיבי</div>
            <div className="flex items-center gap-1"><CheckCircle2 size={12}/> כרטיסיות פלאש</div>
            <div className="flex items-center gap-1"><CheckCircle2 size={12}/> מותאם אישית</div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'planning_syllabus') {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-800">מתכנן את תוכן המדריך...</h2>
            <p className="text-gray-500">בונה רשימת פרקים מדורגת עבור "{topic}"</p>
        </div>
      );
  }

  if (view === 'generating_batch') {
      const pct = Math.round((batchProgress.current / batchProgress.total) * 100);
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                <Layers className="absolute inset-0 m-auto text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">מייצר את כל פרקי המדריך</h2>
            <p className="text-gray-500 mb-4">מעבד כעת: {batchProgress.currentTitle}</p>
            
            <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
                 <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
            </div>
            <div className="text-sm font-bold text-green-700">{batchProgress.current} מתוך {batchProgress.total}</div>
        </div>
      );
  }

  if (view === 'syllabus') {
      const allGenerated = syllabus.length > 0 && syllabus.every(s => s.generatedData);
      
      return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <button onClick={() => setView('input')} className="text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-2">
                             <ArrowLeft size={16}/> חזרה
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">תוכן עניינים: {topic}</h1>
                        <p className="text-gray-600">נהל וצור את כל פרקי המדריך במקום אחד</p>
                    </div>
                    
                    <div className="flex gap-2">
                        {!allGenerated ? (
                             <button 
                                onClick={handleGenerateAll}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 animate-pulse"
                            >
                                <Layers size={18} />
                                צור אוטומטית את כל הפרקים
                            </button>
                        ) : (
                             <button 
                                onClick={handleDownloadZip}
                                disabled={isExporting}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                            >
                                {isExporting ? <Loader2 className="animate-spin"/> : <PackageCheck size={18} />}
                                הורד מדריך מלא (ZIP)
                            </button>
                        )}
                    </div>
                </header>

                <div className="grid gap-4">
                    {syllabus.map((item, idx) => (
                        <div key={idx} className={`bg-white p-6 rounded-xl shadow-sm border transition-all flex items-start justify-between gap-4 group ${item.generatedData ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-blue-400'}`}>
                             <div className="flex items-start gap-4">
                                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-bold ${item.generatedData ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                     {item.lessonNumber}
                                 </div>
                                 <div>
                                     <div className="flex items-center gap-2">
                                         <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                                         {item.generatedData && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold border border-green-200">מוכן</span>}
                                     </div>
                                     <div className="text-sm font-medium text-gray-500 mb-2">נושא: {item.topic}</div>
                                     <p className="text-gray-600 text-sm">{item.description}</p>
                                 </div>
                             </div>
                             <button 
                                onClick={() => handleSelectSyllabusItem(item)}
                                className={`px-5 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${item.generatedData ? 'bg-white border border-green-200 text-green-700 hover:bg-green-50' : 'bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700'}`}
                             >
                                 {item.generatedData ? (
                                     <>
                                        <FileText size={16} />
                                        צפה / ערוך
                                     </>
                                 ) : (
                                     <>
                                        <Wand2 size={16} />
                                        צור תוכן
                                     </>
                                 )}
                             </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  }

  if (view === 'generating') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
        <div className="relative w-24 h-24 mb-8">
           <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
           <Wand2 className="absolute inset-0 m-auto text-blue-600 w-8 h-8 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">מייצר את המדריך שלך...</h2>
        
        <div className="h-8 overflow-hidden relative w-full max-w-md text-center">
            <div className="transition-all duration-500 transform translate-y-0 text-gray-500 font-medium">
              {LOADING_STAGES[loadingStageIndex]}
            </div>
        </div>
        
        <div className="mt-8 w-64 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress"></div>
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 0% }
            100% { width: 100% }
          }
          .animate-progress {
            animation: progress 10s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Result View (Editor + Preview)
  return (
    <div className="flex h-screen bg-gray-100 font-sans" dir="rtl">
      <div className="w-1/3 min-w-[400px] flex flex-col h-full shadow-xl z-10 bg-white border-l border-gray-200">
        <header className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setView(syllabus.length > 0 ? 'syllabus' : 'input')}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                  title="חזרה"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="font-bold text-gray-800 text-lg">עריכת מדריך</h1>
                  <div className="text-xs text-blue-600 font-medium truncate max-w-[150px]">{data.title}</div>
                </div>
            </div>
            
            <div className="flex gap-2">
                 <button 
                    onClick={handleDownloadSingle}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
                 >
                    <Download size={16} />
                    {isExporting ? 'שומר...' : 'הורד HTML'}
                 </button>
            </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
            <Editor data={data} onChange={setData} />
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-8 h-full overflow-hidden flex flex-col">
         <div className="flex justify-between items-end mb-4 px-2">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wider">תצוגה מקדימה חיה</h2>
            </div>
            <button 
               onClick={() => setHtmlPreview(generateAssignmentHTML(data))}
               className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <Play size={12} /> רענן תצוגה
            </button>
         </div>
         
         <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            {htmlPreview ? (
                <iframe 
                    srcDoc={htmlPreview}
                    title="Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 gap-2">
                    <Loader2 className="animate-spin" /> טוען תצוגה...
                </div>
            )}
         </div>
      </div>
    </div>
  );
}

export default App;