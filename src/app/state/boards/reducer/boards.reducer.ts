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

    const updatedColumns = board.columns.map((column) => {
      if (column.name === columnName) {
        const updatedTasks = column.tasks.map((t) =>
          t.id === task.id ? { ...t, ...task } : t
        );
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
