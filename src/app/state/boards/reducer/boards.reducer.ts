import { createReducer, on } from '@ngrx/store';
import { boardAdapter, initialBoardState } from '../board.state';
import {
  addBoard,
  deleteBoard,
  loadBoardsFailure,
  loadBoards,
  loadBoardsSuccess,
  updateBoard,
} from '../actions/boards.actions';

export const boardReducer = createReducer(
  initialBoardState,
  on(loadBoards, (state) => ({ ...state, loading: true, error: null })),
  on(loadBoardsSuccess, (state) => ({ ...state, loading: false, error: null })),
  on(loadBoardsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addBoard, (state, { board }) => boardAdapter.addOne(board, state)),
  on(updateBoard, (state, { board }) =>
    boardAdapter.updateOne({ id: board.id, changes: board }, state)
  ),
  on(deleteBoard, (state, { id }) => boardAdapter.removeOne(id, state))
);
