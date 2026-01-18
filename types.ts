
// TaskStatus as a constant for runtime values
export const TaskStatus = {
  IN_WORK: 'v_rabote',
  COMPLETED: 'vipolneno'
} as const;

// TaskStatus as a type for compile-time safety
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

// Task interface defines the structure of a single task
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  userName: string;
  createdAt: number;
}

// ViewType defines the allowed navigation states
export type ViewType = 'home' | 'stats' | 'profile' | 'create' | 'edit';

// ThemeType defines supported UI themes
export type ThemeType = 'light' | 'dark' | 'system';
