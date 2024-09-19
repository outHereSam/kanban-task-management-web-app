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
  updateTask,
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

  // Update Task
  on(updateTask, (state, { boardId, columnName, task }) => {
    const board = state.entities[boardId];

    if (!board) return state;

    // Step 1: Remove the task from its original column
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
  })
);
