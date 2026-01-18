
import React from 'react';
import { ThemeType } from '../types';

interface ProfileViewProps {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ theme, setTheme }) => {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user || {
    first_name: 'Пользователь',
    username: 'unknown',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 flex flex-col items-center shadow-sm border border-black/5 dark:border-white/5">
        <div className="relative">
            {user.photo_url ? (
                <img src={user.photo_url} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-[#2481cc]/20 mb-4 object-cover" />
            ) : (
                <div className="w-24 h-24 rounded-full bg-[#2481cc] flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {user.first_name[0]}
                </div>
            )}
            <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 border-4 border-white dark:border-[#2c2c2e] rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold dark:text-white">{user.first_name} {user.last_name || ''}</h2>
        <p className="text-[#8e8e93] text-sm">{user.username ? `@${user.username}` : 'ID: ' + user.id}</p>
      </div>

      <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5">
        <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
          <h3 className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-widest">Персонализация</h3>
        </div>
        
        {(['light', 'dark', 'system'] as ThemeType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className="w-full px-4 py-4 flex justify-between items-center hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
          >
            <span className="text-sm dark:text-white">
              {t === 'light' ? 'Светлая' : t === 'dark' ? 'Темная' : 'Системная'}
            </span>
            {theme === t && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2481cc]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <button 
        onClick={() => tg?.close()}
        className="w-full py-4 text-red-500 text-sm font-medium"
      >
        Закрыть приложение
      </button>
    </div>
  );
};

export default ProfileView;
