import { createReducer, on } from '@ngrx/store';
import { boardAdapter, initialBoardState } from '../board.state';
import {
  addBoard,
  deleteBoard,
  loadBoardsFailure,
  loadBoards,
  loadBoardsSuccess,
  updateBoard,
  addTask,
  updateSubtask,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from '../actions/boards.actions';

export const boardReducer = createReducer(
  initialBoardState,
  on(loadBoards, (state) => ({ ...state, loading: true, error: null })),
  on(loadBoardsSuccess, (state, { boards }) =>
    boardAdapter.setAll(boards, { ...state, loading: false, error: null })
  ),
  on(loadBoardsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addBoard, (state, { board }) => boardAdapter.addOne(board, state)),
  on(updateBoard, (state, { board }) =>
    boardAdapter.updateOne({ id: board.id, changes: board }, state)
  ),
  on(deleteBoard, (state, { id }) => boardAdapter.removeOne(id, state)),

  // Add Task
  on(addTask, (state, { boardId, columnName, task }) => {
    const board = state.entities[boardId];

    if (!board) return state;

    const updatedColumns = board.columns.map((column) => {
      if (column.name === columnName) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        };
      }
      return column;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    return boardAdapter.updateOne(
      { id: boardId, changes: updatedBoard },
      state
    );
  }),

  // Update Task Status
  on(updateTaskStatus, (state, { boardId, columnName, task }) => {
    const board = state.entities[boardId];

    if (!board) return state;

    // Step 1: Remove the task from its original column
    // TODO: Remove deleting of task from one column when updating task
    const updatedColumns = board.columns.map((column) => {
      if (column.name === columnName) {
        const updatedTasks = column.tasks.filter((t) => t.id !== task.id);
        return {
          ...column,
          tasks: updatedTasks,
        };
      }
      return column;
    });

    // Step 2: Add the task to the new column (based on its updated status)
    const columnsWithUpdatedTask = updatedColumns.map((column) => {
      if (column.name === task.status) {
        return {
          ...column,
          tasks: [...column.tasks, task], // Append the updated task while preserving the other tasks
        };
      }
      return column;
    });

    // Create the updated board with the modified columns
    const updatedBoard = {
      ...board,
      columns: columnsWithUpdatedTask,
    };

    return boardAdapter.updateOne(
      { id: boardId, changes: updatedBoard },
      state
    );
  }),

  // Update subtask
  on(updateSubtask, (state, { boardId, task }) => {
    const board = state.entities[boardId];

    if (!board) return state;

    // Find the column where the task belongs
    const columnsWithUpdatedTask = board.columns.map((column) => {
      if (column.name === task.status) {
        // Find the task that needs to be updated within this column
        const updatedTasks = column.tasks.map((existingTask) => {
          if (existingTask.id === task.id) {
            // Replace the task with the updated version (including updated subtasks)
            return { ...task };
          }
          return existingTask;
        });

        return {
          ...column,
          tasks: updatedTasks,
        };
      }
      return column;
    });

    // Create the updated board with the modified columns
    const updatedBoard = {
      ...board,
      columns: columnsWithUpdatedTask,
    };

    return boardAdapter.updateOne(
      { id: boardId, changes: updatedBoard },
      state
    );
  }),

  // Update Task
  on(updateTask, (state, { boardId, task }) => {
    const board = state.entities[boardId];

    if (!board) return state;

    // Find the column where the task belongs
    const columnsWithUpdatedTask = board.columns.map((column) => {
      if (column.name === task.status) {
        // Find the task that needs to be updated within this column
        const updatedTasks = column.tasks.map((existingTask) => {
          if (existingTask.id === task.id) {
            // Replace the task with the updated version (including updated subtasks)
            return { ...task };
          }
          return existingTask;
        });

        return {
          ...column,
          tasks: updatedTasks,
        };
      }
      return column;
    });

    // Create the updated board with the modified columns
    const updatedBoard = {
      ...board,
      columns: columnsWithUpdatedTask,
    };

    return boardAdapter.updateOne(
      { id: boardId, changes: updatedBoard },
      state
    );
  }),
  on(deleteTask, (state, { boardId, columnName, taskId }) => {
    const board = state.entities[boardId];

    if (!board) return state;

    const updatedColumns = board.columns.map((column) => {
      if (column.name === columnName) {
        const updatedTasks = column.tasks.filter((task) => task.id !== taskId);
        return {
          ...column,
          tasks: updatedTasks,
        };
      }
      return column;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    return boardAdapter.updateOne(
      { id: boardId, changes: updatedBoard },
      state
    );
  })
);
