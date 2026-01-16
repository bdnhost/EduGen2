
import React from 'react';
import { AssignmentData, NarrationData } from '../types';
import { Info, ShieldAlert, Target, Award, Sparkles } from 'lucide-react';

interface EditorProps {
  data: AssignmentData;
  onChange: (data: AssignmentData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = React.useState<string>('pedagogical');

  const handleChange = (field: keyof AssignmentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleNarrationChange = (part: keyof NarrationData, field: 'script' | 'fileName', value: string) => {
    const newNarration = { ...data.narration };
    newNarration[part] = { ...newNarration[part], [field]: value };
    handleChange('narration', newNarration);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden text-right" dir="rtl">
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
        {[
          { id: 'pedagogical', label: '🎓 פיקוח פדגוגי' },
          { id: 'narration', label: '🎧 בימוי קולי' },
          { id: 'meta', label: '⚙️ הגדרות' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'pedagogical' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                    <Award size={24} className="text-yellow-300" />
                    <h3 className="text-lg font-black">ניתוח פדגוגי AI</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                        <div className="text-[10px] font-black uppercase opacity-60">Bloom Level</div>
                        <div className="text-xl font-black">{data.pedagogicalReview.bloomLevel}</div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                        <div className="text-[10px] font-black uppercase opacity-60">Scaffolding</div>
                        <div className="text-xl font-black">{data.pedagogicalReview.scaffoldingScore}%</div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <Target size={18} className="shrink-0" />
                        <div>
                            <div className="text-xs font-black mb-1">אסטרטגיית מעורבות:</div>
                            <p className="text-sm opacity-90 leading-relaxed">{data.pedagogicalReview.engagementStrategy}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                    <h4 className="font-black text-green-900 flex items-center gap-2 mb-2 text-sm">
                        <Sparkles size={16} /> רציונל פדגוגי לפרק זה
                    </h4>
                    <p className="text-sm text-green-800 leading-relaxed">{data.pedagogicalReview.instructionalRationale}</p>
                </div>

                <div className="p-5 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <h4 className="font-black text-yellow-900 flex items-center gap-2 mb-2 text-sm">
                        <ShieldAlert size={16} /> המלצה לשיפור פדגוגי
                    </h4>
                    <p className="text-sm text-yellow-800 leading-relaxed">{data.pedagogicalReview.suggestedImprovement}</p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'narration' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                <h4 className="font-black text-indigo-900 flex items-center gap-2 mb-3">
                    <Info size={18} />
                    מדריך בימוי ElevenLabs V3 Alpha
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-indigo-700">
                    <div className="bg-white/50 p-2 rounded-lg border border-indigo-50"><code>[excited]</code> אנרגטי</div>
                    <div className="bg-white/50 p-2 rounded-lg border border-indigo-50"><code>[thoughtful]</code> עמוק</div>
                    <div className="bg-white/50 p-2 rounded-lg border border-indigo-50"><code>[whispers]</code> לחישה</div>
                    <div className="bg-white/50 p-2 rounded-lg border border-indigo-50"><code>[pauses]</code> השהייה</div>
                </div>
            </div>

            {(['welcome', 'caseStudy', 'summary'] as const).map((part) => (
              <div key={part} className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-gray-700 capitalize">{part} Part Script</span>
                </div>
                <textarea 
                  className="w-full p-4 border rounded-xl h-40 text-sm focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed text-right"
                  value={data.narration[part].script}
                  onChange={e => handleNarrationChange(part, 'script', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
