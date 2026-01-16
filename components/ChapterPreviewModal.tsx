
import React from 'react';
import { X, ExternalLink, Edit3, BookOpen, AlertCircle } from 'lucide-react';
import { AssignmentData, SyllabusItem } from '../types';
import { generateAssignmentHTML } from '../services/generatorService';

interface ChapterPreviewModalProps {
  item: SyllabusItem | 'index';
  courseTitle: string;
  syllabus: SyllabusItem[];
  onClose: () => void;
  onEdit?: (item: SyllabusItem) => void;
}

const ChapterPreviewModal: React.FC<ChapterPreviewModalProps> = ({ item, courseTitle, syllabus, onClose, onEdit }) => {
  const isIndex = item === 'index';
  const hasData = !isIndex && item.generatedData;

  const renderContent = () => {
    if (isIndex) {
      // For now, index is best viewed as a structured list in this preview or we could generate its HTML
      return (
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-800">תצוגת דף הבית (Index)</h2>
          <p className="text-gray-500 max-w-sm mx-auto">כך ייראה דף הנחיתה של המדריך הכולל את כל הפרקים שנוצרו.</p>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-right space-y-4 max-w-md mx-auto">
             {syllabus.map((s, i) => (
               <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">{s.lessonNumber}</div>
                  <div className="font-bold text-gray-700 text-sm">{s.title}</div>
               </div>
             ))}
          </div>
        </div>
      );
    }

    if (hasData && item.generatedData) {
      const html = generateAssignmentHTML(item.generatedData);
      return (
        <iframe 
          srcDoc={html} 
          title="Quick Preview" 
          className="w-full h-full border-0" 
          sandbox="allow-scripts allow-forms allow-modals"
        />
      );
    }

    return (
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 h-full bg-gray-50">
        <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center animate-pulse">
          <AlertCircle size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h2>
          <p className="text-gray-500 max-w-md">התוכן האינטראקטיבי של פרק זה טרם נוצר. ניתן לראות את התכנון הראשוני למטה:</p>
        </div>
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border-t-4 border-yellow-500 text-right">
            <div className="text-xs font-bold text-yellow-600 uppercase mb-2">נושא מתוכנן</div>
            <div className="text-lg font-bold text-gray-800 mb-2">{item.topic}</div>
            <div className="text-sm text-gray-600 leading-relaxed">{item.description}</div>
        </div>
        <button 
          onClick={() => onEdit?.(item)}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          <Edit3 size={18} />
          צור תוכן עכשיו
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4 md:p-10 font-sans" dir="rtl">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full h-full max-w-6xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
              <X size={24} />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div>
              <h3 className="font-black text-gray-800">
                {isIndex ? 'תצוגת אינדקס' : `תצוגה מקדימה: ${item.title}`}
              </h3>
              <p className="text-xs text-gray-500">{courseTitle}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isIndex && (
              <button 
                onClick={() => onEdit?.(item)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-sm transition-all"
              >
                <Edit3 size={16} />
                {hasData ? 'ערוך תוכן' : 'צור תוכן'}
              </button>
            )}
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
            >
              סגור
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-gray-100 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChapterPreviewModal;
