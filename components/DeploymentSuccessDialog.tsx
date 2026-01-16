
import React, { useState } from 'react';
import { X, CheckCircle2, Globe, Copy, ExternalLink, Folder } from 'lucide-react';

interface DeploymentSuccessDialogProps {
  onClose: () => void;
  folderName: string;
  url: string;
}

const DeploymentSuccessDialog: React.FC<DeploymentSuccessDialogProps> = ({ onClose, folderName, url }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Success Icon Area */}
        <div className="bg-green-500 p-8 flex flex-col items-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold">ההעלאה הצליחה!</h2>
          <p className="text-green-100 opacity-90 mt-1 text-center">המדריך הופץ בהצלחה לשרת ה-cPanel שלך</p>
        </div>

        {/* Details Area */}
        <div className="p-6 space-y-4">
          
          {/* Folder Name */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2">
              <Folder size={12} /> שם התיקייה בשרת
            </div>
            <div className="text-gray-800 font-mono text-sm break-all font-bold">
              {folderName}
            </div>
          </div>

          {/* URL Area */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Globe size={16} className="text-blue-500" /> הכתובת הישירה למדריך
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-700 text-xs font-mono truncate dir-ltr">
                {url}
              </div>
              <button 
                onClick={copyToClipboard}
                className={`p-3 rounded-xl transition-all shadow-sm flex items-center justify-center ${
                  copied ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="העתק כתובת"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t flex flex-col gap-3">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink size={18} />
            פתיחת המדריך בשרת
          </a>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-white text-gray-600 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            סגור חלון
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentSuccessDialog;
