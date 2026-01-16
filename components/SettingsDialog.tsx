
import React, { useState } from 'react';
import { X, Server, ShieldCheck, Globe, FolderOpen, Save, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { CPanelSettings } from '../types';

interface SettingsDialogProps {
  onClose: () => void;
  settings: CPanelSettings;
  onSave: (settings: CPanelSettings) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<CPanelSettings>(settings);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const testConnection = async () => {
    if (!localSettings.domain || !localSettings.apiToken) {
      setTestStatus('error');
      return;
    }
    setTestStatus('testing');
    
    // Simulating a cPanel UAPI call
    // Note: In a real app, this might hit CORS issues unless using a proxy.
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Randomly succeed for demo, but logically check domain/token existence
      const success = localSettings.domain.includes('.') && localSettings.apiToken.length > 5;
      setTestStatus(success ? 'success' : 'error');
    } catch (e) {
      setTestStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Server size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">הגדרות פריסה (Deployment)</h2>
              <p className="text-blue-100 text-xs">הגדרת חיבור אוטומטי לשרת cPanel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5 bg-gray-50">
          <div className="grid gap-4">
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex justify-between items-center">
                <span className="flex items-center gap-2"><Globe size={16} className="text-blue-500" /> דומיין השרת (CPANEL_DOMAIN)</span>
                {testStatus === 'success' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Wifi size={10}/> מחובר</span>}
                {testStatus === 'error' && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1"><WifiOff size={10}/> שגיאה</span>}
              </label>
              <input 
                type="text" 
                placeholder="example.com"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-sm"
                value={localSettings.domain}
                onChange={e => { setLocalSettings({...localSettings, domain: e.target.value}); setTestStatus('idle'); }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-500" /> שם משתמש
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-sm"
                  value={localSettings.username}
                  onChange={e => setLocalSettings({...localSettings, username: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">פורט (Port)</label>
                <input 
                  type="text" 
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-sm"
                  value={localSettings.port}
                  onChange={e => setLocalSettings({...localSettings, port: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                🔑 API Token (CPANEL_API_TOKEN)
              </label>
              <input 
                type="password" 
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-sm"
                value={localSettings.apiToken}
                onChange={e => setLocalSettings({...localSettings, apiToken: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FolderOpen size={16} className="text-blue-500" /> תיקיית יעד בשרת
              </label>
              <input 
                type="text" 
                placeholder="public_html/guides"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all text-sm"
                value={localSettings.remotePath}
                onChange={e => setLocalSettings({...localSettings, remotePath: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3">
             <button 
                onClick={testConnection}
                disabled={testStatus === 'testing'}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 ${
                    testStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                    testStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                    'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
             >
                {testStatus === 'testing' ? <Loader2 size={18} className="animate-spin" /> : <Wifi size={18} />}
                {testStatus === 'success' ? 'החיבור תקין!' : testStatus === 'error' ? 'חיבור נכשל - נסה שוב' : 'בדיקת חיבור לשרת'}
             </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
            <strong>שים לב:</strong> הפרטים נשמרים בדפדפן המקומי שלך בלבד. במידה והשרת חוסם בקשות צד-לקוח (CORS), ההעלאה עשויה להיכשל ללא שרת מתווך (Proxy).
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all">
            ביטול
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 flex items-center gap-2 transition-all"
          >
            <Save size={18} />
            שמור הגדרות
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
