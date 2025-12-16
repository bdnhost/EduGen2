import React from 'react';
import { AssignmentData, Question } from '../types';
import { Plus, Trash2, ArrowUp, ArrowDown, BookOpen, Layers } from 'lucide-react';

interface EditorProps {
  data: AssignmentData;
  onChange: (data: AssignmentData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = React.useState<string>('meta');

  const handleChange = (field: keyof AssignmentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateQuestion = (idx: number, field: keyof Question, value: any) => {
    const newQuestions = [...data.questions];
    newQuestions[idx] = { ...newQuestions[idx], [field]: value };
    handleChange('questions', newQuestions);
  };

  const updateOption = (qIdx: number, oIdx: number, text: string) => {
    const newQuestions = [...data.questions];
    newQuestions[qIdx].options[oIdx].text = text;
    handleChange('questions', newQuestions);
  };

  const setCorrectOption = (qIdx: number, oIdx: number) => {
    const newQuestions = [...data.questions];
    newQuestions[qIdx].options.forEach((o, i) => o.isCorrect = i === oIdx);
    handleChange('questions', newQuestions);
  };

  const updateFlashcard = (idx: number, field: 'term' | 'definition', value: string) => {
      const newCards = [...(data.flashcards || [])];
      newCards[idx][field] = value;
      handleChange('flashcards', newCards);
  };

  const addFlashcard = () => {
      handleChange('flashcards', [...(data.flashcards || []), { term: 'New Term', definition: 'Definition' }]);
  };
  
  const removeFlashcard = (idx: number) => {
      const newCards = [...(data.flashcards || [])];
      newCards.splice(idx, 1);
      handleChange('flashcards', newCards);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 scrollbar-hide">
        {['Meta', 'Context', 'Concepts', 'Intro', 'Case Study', 'Quiz', 'Analysis', 'Plan', 'Styles'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === tab.toLowerCase()
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {tab === 'Concepts' ? 'Concepts ⭐' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">פרטים כלליים</h3>
            <Input label="Guide Chapter Title" value={data.title} onChange={v => handleChange('title', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Guide Name" value={data.courseName} onChange={v => handleChange('courseName', v)} />
              <Input label="Author/Lecturer" value={data.lecturerName} onChange={v => handleChange('lecturerName', v)} />
              <Input label="Version/Semester" value={data.semester} onChange={v => handleChange('semester', v)} />
              <Input label="Pace/Due Date" value={data.dueDate} onChange={v => handleChange('dueDate', v)} />
              <Input label="Estimated Time" value={data.timeEstimate} onChange={v => handleChange('timeEstimate', v)} />
              <Input label="Weight/Importance" value={data.weight} onChange={v => handleChange('weight', v)} />
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500"/>
              הקשר ורצף לימודי
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
              הגדר את המיקום של הפרק במדריך. זה יעזור ללומדים להבין את הרצף.
            </div>
            
            <div className="space-y-4">
               <Input label="נושא הפרק (Topic)" value={data.topic} onChange={v => handleChange('topic', v)} />
               
               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">פרק נוכחי (מספר)</label>
                       <input 
                         type="number" 
                         className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                         value={data.lessonNumber}
                         onChange={e => handleChange('lessonNumber', parseInt(e.target.value))}
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">סה"כ פרקים במדריך</label>
                       <input 
                         type="number" 
                         className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                         value={data.totalLessons}
                         onChange={e => handleChange('totalLessons', parseInt(e.target.value))}
                       />
                   </div>
               </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
                <TextArea 
                label="הקשר לפרקים קודמים" 
                value={data.contextDescription} 
                onChange={v => handleChange('contextDescription', v)} 
                />
                <p className="text-xs text-gray-500 -mt-3">תאר כיצד פרק זה מתחבר לחומר שנלמד בפרקים הקודמים.</p>

                <Input 
                label="ידע קודם נדרש (Prerequisite)" 
                value={data.prerequisite} 
                onChange={v => handleChange('prerequisite', v)} 
                />

                <Input 
                label="טיזר לפרק הבא (Next Chapter)" 
                value={data.nextLessonTeaser || ''} 
                onChange={v => handleChange('nextLessonTeaser', v)} 
                />
            </div>
          </div>
        )}

        {activeTab === 'concepts' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Layers size={20} className="text-purple-500"/>
                        מושגי מפתח (Flashcards)
                    </h3>
                    <button onClick={addFlashcard} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={16} /> הוסף מושג
                    </button>
                </div>

                <div className="space-y-4">
                    {(data.flashcards || []).map((card, idx) => (
                        <div key={idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm relative group">
                             <button 
                                onClick={() => removeFlashcard(idx)}
                                className="absolute top-2 left-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                 <Trash2 size={16} />
                             </button>
                             <div className="space-y-3">
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">מושג / מונח</label>
                                     <input 
                                        className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                        value={card.term}
                                        onChange={e => updateFlashcard(idx, 'term', e.target.value)}
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">הגדרה / הסבר</label>
                                     <textarea 
                                        className="w-full p-2 border rounded bg-white h-20 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={card.definition}
                                        onChange={e => updateFlashcard(idx, 'definition', e.target.value)}
                                     />
                                 </div>
                             </div>
                        </div>
                    ))}
                    {(data.flashcards || []).length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-dashed">
                            אין כרטיסיות. לחץ על "הוסף מושג" כדי להתחיל.
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'intro' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">פתיח ומטרות</h3>
            <Input label="Welcome Title" value={data.welcomeTitle} onChange={v => handleChange('welcomeTitle', v)} />
            <TextArea label="Welcome Text" value={data.welcomeText} onChange={v => handleChange('welcomeText', v)} />
            
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Objectives (One per line)</label>
              <textarea 
                className="w-full p-2 border rounded-md h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.objectives.join('\n')}
                onChange={e => handleChange('objectives', e.target.value.split('\n'))}
              />
            </div>
          </div>
        )}

        {activeTab === 'case study' && (
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-gray-800 border-b pb-2">תיאור מקרה (Case Study)</h3>
             <Input label="Case Study Title" value={data.caseStudyTitle} onChange={v => handleChange('caseStudyTitle', v)} />
             <div className="pt-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML allowed)</label>
               <textarea 
                  className="w-full p-2 border rounded-md h-64 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  value={data.caseStudyContent}
                  onChange={e => handleChange('caseStudyContent', e.target.value)}
               />
               <p className="text-xs text-gray-500 mt-1">Use &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt; tags for formatting.</p>
             </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-gray-800">שאלות סגורות (Quiz)</h3>
             </div>
             
             {data.questions.map((q, qIdx) => (
               <div key={q.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                 <div className="mb-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase">Question {qIdx + 1}</label>
                   <input 
                      className="w-full p-2 border rounded mt-1 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={q.text}
                      onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                   />
                 </div>
                 
                 <div className="space-y-2 mt-3">
                   {q.options.map((opt, oIdx) => (
                     <div key={opt.id} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          checked={opt.isCorrect}
                          onChange={() => setCorrectOption(qIdx, oIdx)}
                          className="w-4 h-4 text-green-600 cursor-pointer"
                        />
                        <input 
                          className={`flex-1 p-1 border rounded text-sm transition-colors ${opt.isCorrect ? 'border-green-500 bg-green-50 text-green-800 font-medium' : ''}`}
                          value={opt.text}
                          onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                        />
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-gray-800 border-b pb-2">גרף וניתוח (Analysis)</h3>
             <Input label="Section Title" value={data.analysisTitle} onChange={v => handleChange('analysisTitle', v)} />
             <TextArea label="Description" value={data.analysisDescription} onChange={v => handleChange('analysisDescription', v)} />
             
             <div className="border-t pt-4">
               <Input label="Chart Title" value={data.chartTitle} onChange={v => handleChange('chartTitle', v)} />
               <div className="mt-4 grid grid-cols-2 gap-4">
                 {data.chartData.map((item, idx) => (
                   <div key={idx} className="p-2 border rounded bg-gray-50">
                      <Input label={`Bar ${idx + 1} Label`} value={item.label} 
                        onChange={v => {
                          const newChart = [...data.chartData];
                          newChart[idx].label = v;
                          handleChange('chartData', newChart);
                        }} 
                      />
                      <div className="mt-2">
                         <label className="block text-xs font-medium text-gray-600">Value (1-10)</label>
                         <input 
                           type="number" step="0.5" max="10" min="0"
                           className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                           value={item.value}
                           onChange={e => {
                              const newChart = [...data.chartData];
                              newChart[idx].value = parseFloat(e.target.value);
                              handleChange('chartData', newChart);
                           }}
                         />
                      </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="border-t pt-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Question</label>
               <input 
                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                 value={data.analysisQuestionText}
                 onChange={e => handleChange('analysisQuestionText', e.target.value)}
               />
               <div className="mt-2">
                  <label className="block text-xs text-gray-500">Min Characters</label>
                  <input type="number" className="w-24 p-1 border rounded text-sm" value={data.analysisMinChars} onChange={e => handleChange('analysisMinChars', parseInt(e.target.value))} />
               </div>
             </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-gray-800 border-b pb-2">תכנית פעולה (Sort)</h3>
             <Input label="Section Title" value={data.planTitle} onChange={v => handleChange('planTitle', v)} />
             <TextArea label="Description" value={data.planDescription} onChange={v => handleChange('planDescription', v)} />
             
             <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Draggable Items (One per line)</label>
              <textarea 
                className="w-full p-2 border rounded-md h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.planItems.join('\n')}
                onChange={e => handleChange('planItems', e.target.value.split('\n'))}
              />
            </div>

            <div className="border-t pt-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">Reflection Question</label>
               <input 
                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                 value={data.planQuestionText}
                 onChange={e => handleChange('planQuestionText', e.target.value)}
               />
            </div>
          </div>
        )}

        {activeTab === 'styles' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">עיצוב (Styles)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={data.themeColorPrimary} 
                    onChange={e => handleChange('themeColorPrimary', e.target.value)}
                    className="h-10 w-10 cursor-pointer border rounded"
                  />
                  <span className="text-sm font-mono text-gray-500">{data.themeColorPrimary}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={data.themeColorSecondary} 
                    onChange={e => handleChange('themeColorSecondary', e.target.value)}
                    className="h-10 w-10 cursor-pointer border rounded"
                  />
                  <span className="text-sm font-mono text-gray-500">{data.themeColorSecondary}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const Input = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const TextArea = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea className="w-full p-2 border rounded-md text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default Editor;