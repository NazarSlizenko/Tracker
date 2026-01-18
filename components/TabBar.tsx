
import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Задачи', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'stats', label: 'Статистика', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'profile', label: 'Профиль', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return html`
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-md border-t border-[#d1d1d6] dark:border-[#3a3a3c] safe-area-bottom flex justify-around items-center h-16 max-w-md mx-auto">
      ${tabs.map(tab => html`
        <button 
          key=${tab.id}
          onClick=${() => onTabChange(tab.id)}
          className=${`flex flex-col items-center justify-center flex-1 space-y-1 transition-colors ${activeTab === tab.id ? 'text-[#2481cc]' : 'text-[#8e8e93]'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d=${tab.icon} />
          </svg>
          <span className="text-[10px] font-medium">${tab.label}</span>
        </button>
      `)}
    </nav>
  `;
};

export default TabBar;
