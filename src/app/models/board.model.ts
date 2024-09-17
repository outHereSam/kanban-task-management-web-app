interface Subtask {
  title: string;
  isCompleted: boolean;
}
interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}
interface Column {
  name: string;
  tasks: Task[];
}
export interface Board {
  id: number;
  name: string;
  columns: Column[];
}
