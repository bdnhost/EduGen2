
import React from 'react';
import { StudentState, Competencies } from '../types';
import { TrendingUp, Award, Zap, Clock } from 'lucide-react';

interface StudentDashboardProps {
  state: StudentState;
  courseTitle: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ state, courseTitle }) => {
  return (
    <div className="p-6 bg-white rounded-[2rem] shadow-xl border border-gray-100 font-sans" dir="rtl">
      {/* AI Insight Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white mb-8 shadow-lg shadow-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <Zap size={24} className="text-yellow-300 animate-pulse" />
          <h2 className="text-xl font-black">התובנה של Gemini להיום:</h2>
        </div>
        <p className="text-blue-50 text-lg leading-relaxed">{state.ai_insight}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Progress */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                התקדמות כללית
              </h3>
              <span className="text-2xl font-black text-blue-600">{state.overall_progress}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                style={{ width: `${state.overall_progress}%` }}
              ></div>
            </div>
          </div>

          {/* Competency Bars */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Award size={20} className="text-purple-600" />
              מיומנויות שנרכשו
            </h3>
            <div className="space-y-4">
              {Object.entries(state.competencies).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{key}</span>
                    <span className="font-bold text-gray-800">{value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-700"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 text-center">
            <Zap size={32} className="text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-black text-yellow-700">{state.momentum}</div>
            <div className="text-xs font-bold text-yellow-600 uppercase">מומנטום למידה</div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
            <Clock size={32} className="text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-blue-700">פעיל לאחרונה</div>
            <div className="text-xs text-blue-600">{new Date(state.last_active).toLocaleDateString('he-IL')}</div>
          </div>
          
          <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
            המשך מהנקודה האחרונה
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
