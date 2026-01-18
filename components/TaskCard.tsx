
import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onToggleStatus?: (id: string, status: TaskStatus) => void;
  onEdit: (id: string) => void;
  // Added optional isAdmin and onDelete for compatibility with AdminView
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onEdit, isAdmin, onDelete }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div className="bg-white dark:bg-[#2c2c2e] rounded-xl shadow-sm overflow-hidden border border-black/5 dark:border-white/5 flex flex-col transition-all active:scale-[0.98]">
      <div className="p-4 flex items-start gap-3">
        {/* Only show toggle button if onToggleStatus is provided */}
        {onToggleStatus && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleStatus(task.id, task.status); }}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${isCompleted ? 'bg-[#2481cc] border-[#2481cc]' : 'border-[#d1d1d6] dark:border-[#3a3a3c]'}`}
          >
            {isCompleted && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
        
        <div className="flex-1" onClick={() => onEdit(task.id)}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className={`font-semibold text-base ${isCompleted ? 'text-[#8e8e93] line-through' : 'text-black dark:text-white'}`}>
                {task.title}
              </h3>
              {/* Show user name in admin mode */}
              {isAdmin && (
                <div className="text-[10px] text-[#2481cc] font-bold mt-0.5">ID: {task.userName}</div>
              )}
            </div>
            {/* Show delete button in admin mode if onDelete is provided */}
            {isAdmin && onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="text-red-500 p-1 active:scale-90 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-[#8e8e93] line-clamp-1 mt-0.5">
            {task.description || 'Нет описания'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
