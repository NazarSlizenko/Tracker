
import React from 'react';
import { Task, TaskStatus } from '../types.ts';
import TaskCard from '../components/TaskCard.tsx';

interface HomeViewProps {
  tasks: Task[];
  filter: 'all' | TaskStatus;
  setFilter: (f: 'all' | TaskStatus) => void;
  onToggleStatus: (id: string, status: TaskStatus) => void;
  onEdit: (id: string) => void;
  onAdd: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ tasks, filter, setFilter, onToggleStatus, onEdit, onAdd }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-200/50 dark:bg-white/5 p-1 rounded-xl flex items-center mb-4 backdrop-blur-sm">
        <button 
          onClick={() => setFilter('all')}
          className={`flex-1 text-[13px] py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-white dark:bg-[#2c2c2e] shadow-sm font-semibold dark:text-white' : 'text-gray-500'}`}
        >
          Все
        </button>
        <button 
          onClick={() => setFilter(TaskStatus.IN_WORK)}
          className={`flex-1 text-[13px] py-2 rounded-lg transition-all ${filter === TaskStatus.IN_WORK ? 'bg-white dark:bg-[#2c2c2e] shadow-sm font-semibold dark:text-white' : 'text-gray-500'}`}
        >
          В работе
        </button>
        <button 
          onClick={() => setFilter(TaskStatus.COMPLETED)}
          className={`flex-1 text-[13px] py-2 rounded-lg transition-all ${filter === TaskStatus.COMPLETED ? 'bg-white dark:bg-[#2c2c2e] shadow-sm font-semibold dark:text-white' : 'text-gray-500'}`}
        >
          Сделано
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onToggleStatus={onToggleStatus} onEdit={onEdit} />
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-[#8e8e93]">Задач пока нет</p>
          </div>
        )}
      </div>

      <button 
        onClick={onAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#2481cc] text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default HomeView;
