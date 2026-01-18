
import React from 'react';
import htm from 'htm';
import { TaskStatus } from '../types.ts';

const html = htm.bind(React.createElement);

const StatsView = ({ tasks }) => {
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const total = tasks.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const daysInMonth = 31;
  const activity = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.6
  }));

  return html`
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5">
        <h3 className="text-sm font-bold text-[#8e8e93] mb-4 uppercase">Общий прогресс</h3>
        <div className="relative h-4 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-[#2481cc] transition-all duration-500" 
            style=${{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="dark:text-white font-medium">${percentage}% Выполнено</span>
          <span className="text-[#8e8e93]">${completed} / ${total} задач</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5">
        <h3 className="text-sm font-bold text-[#8e8e93] mb-4 uppercase">Активность в Мае</h3>
        <div className="calendar-grid">
          ${['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map(d => html`
            <div key=${d} className="text-[10px] text-center text-[#8e8e93] pb-2 font-bold">${d}</div>
          `)}
          ${activity.map(d => html`
            <div 
              key=${d.day} 
              className=${`aspect-square rounded-md flex items-center justify-center text-[11px] transition-colors
                ${d.active ? 'bg-[#2481cc] text-white' : 'bg-gray-50 dark:bg-black/10 text-gray-400'}
              `}
            >
              ${d.day}
            </div>
          `)}
        </div>
        <p className="text-[11px] text-[#8e8e93] mt-4 text-center italic">
          Ваша продуктивность выросла на 12% по сравнению с прошлым месяцем!
        </p>
      </div>
    </div>
  `;
};

export default StatsView;
