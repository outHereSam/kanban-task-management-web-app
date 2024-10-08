import { createAction, props } from '@ngrx/store';
import { Board, Task } from '../../../models/board.model';

// Board Load Actions
export const loadBoards = createAction('[Boards] Load Boards');
export const loadBoardsSuccess = createAction(
  '[Boards] Load Boards Success',
  props<{ boards: Board[] }>()
);
export const loadBoardsFailure = createAction(
  '[Boards] Load Boards Failure',
  props<{ error: string }>()
);

// Board Actions
export const addBoard = createAction(
  '[Boards] Add Board',
  props<{ board: Board }>()
);
export const updateBoard = createAction(
  '[Boards] Update Board',
  props<{ board: Partial<Board> & { id: number } }>()
);
export const deleteBoard = createAction(
  '[Boards] Delete Board',
  props<{ id: number }>()
);

// Task Actions
export const addTask = createAction(
  '[Task] Add Task',
  props<{ boardId: number; columnName: string; task: Task }>()
);

export const updateTaskStatus = createAction(
  '[Task] Update Task Status',
  props<{ boardId: number; columnName: string; task: Task }>()
);
export const updateTask = createAction(
  '[Task] Update Task',
  props<{ boardId: number; columnName: string; task: Task }>()
);

export const updateSubtask = createAction(
  '[Task] Update Subtask',
  props<{ boardId: number; task: Task }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ boardId: number; columnName: string; taskId: number }>()
);

export const reorderTasks = createAction(
  '[Board] Reorder Tasks',
  props<{
    boardId: number;
    columnName: string;
    previousIndex: number;
    currentIndex: number;
  }>()
);

export const moveTask = createAction(
  '[Board] Move Task',
  props<{
    boardId: number;
    sourceColumnName: string;
    destinationColumnName: string;
    previousIndex: number;
    currentIndex: number;
  }>()
);
