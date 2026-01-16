import React from 'react';
import { X, Copy, Terminal, Server, Globe, Database } from 'lucide-react';

interface TechnicalGuideProps {
  onClose: () => void;
}

const TechnicalGuide: React.FC<TechnicalGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Terminal size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Base44 Integration Guide</h2>
              <p className="text-gray-400 text-sm">מפרט טכני לאינטגרציה עם מערכת ה-LMS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50">
          
          {/* Step 1: Initialization */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-blue-700">
              <Globe size={24} />
              <h3 className="text-lg font-bold">1. ייזום המטלה (Client Side)</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              כאשר מערכת Base44 מפנה תלמיד למטלה (קובץ ה-HTML שנוצר), חובה להוסיף את הפרמטרים הבאים ל-URL.
              הגנרטור קורא אותם אוטומטית ומטמיע אותם בטופס ההגשה.
            </p>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 relative group overflow-x-auto" dir="ltr">
              <span className="text-green-400">GET</span> https://assignment-host.com/chapter-1.html<span className="text-yellow-400">?base44StudentId=USER_123&base44AssignmentId=ASSIGN_456</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li><strong>base44StudentId</strong>: מזהה חד-ערכי של התלמיד במערכת.</li>
              <li><strong>base44AssignmentId</strong>: מזהה המטלה/הפעילות במערכת.</li>
            </ul>
          </section>

          {/* Step 2: Submission */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4 text-purple-700">
              <Server size={24} />
              <h3 className="text-lg font-bold">2. קבלת הגשה (Webhook / Server Side)</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              בסיום המטלה, הדפדפן יבצע שליחת טופס רגילה (Standard Form POST) לכתובת שהוגדרה בשדה <code>submissionUrl</code>.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-sm text-gray-700 mb-2">Request Headers</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-700" dir="ltr">
                        POST /api/webhook/submission HTTP/1.1<br/>
                        Content-Type: application/x-www-form-urlencoded
                    </div>
                </div>
                <div>
                     <h4 className="font-bold text-sm text-gray-700 mb-2">Form Body Parameters</h4>
                     <ul className="text-sm space-y-2 text-gray-600 font-mono bg-gray-50 p-3 rounded" dir="ltr">
                         <li><span className="text-blue-600">base44StudentId</span>: "USER_123"</li>
                         <li><span className="text-blue-600">base44AssignmentId</span>: "ASSIGN_456"</li>
                         <li><span className="text-blue-600">submission_content</span>: JSON_STRING</li>
                     </ul>
                </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>חשוב:</strong> השרת חייב להחזיר דף HTML (או הפניה ל-URL הצלחה), כיוון שהדפדפן של התלמיד מנווט לכתובת זו. אין להחזיר JSON בלבד.
            </div>
          </section>

          {/* Step 3: Payload Structure */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-green-700">
              <Database size={24} />
              <h3 className="text-lg font-bold">3. מבנה הנתונים (JSON Payload)</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              השדה <code>submission_content</code> הוא מחרוזת JSON המכילה את כל תשובות התלמיד והמטא-דאטה.
            </p>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto" dir="ltr">
<pre>{`{
  "answers": {
    "quiz": {
      "q0": true,          // Question ID : Is Correct?
      "q1": false
    },
    "text": {
      "analysis": "User input text...",
      "plan": "User plan explanation...",
      "reflection": "User reflection..."
    },
    "file": "uploaded-filename.pdf"  // If file was uploaded
  },
  "meta": {
    "score": 85,           // Calculated Score (0-100)
    "timeSpent": 12,       // Minutes
    "finishedAt": "2023-10-25T14:30:00.000Z"
  }
}`}</pre>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium">
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalGuide;
