export interface Subtask {
  title: string;
  isCompleted: boolean;
}
export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}
export interface Column {
  name: string;
  tasks: Task[];
}
export interface Board {
  id: number;
  name: string;
  columns: Column[];
}
