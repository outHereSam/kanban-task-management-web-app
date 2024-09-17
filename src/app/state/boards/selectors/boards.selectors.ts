import { createFeatureSelector, createSelector } from '@ngrx/store';
import { boardAdapter, BoardState } from '../board.state';

export const selectBoardState = createFeatureSelector<BoardState>('boards');

export const {
  selectAll: selectAllBoards,
  selectEntities: selectBoardEntities,
  selectIds: selectBoardIds,
  selectTotal: selectTotalBoards,
} = boardAdapter.getSelectors(selectBoardState);

// Select a single board
export const selectBoardById = (id: string) =>
  createSelector(selectBoardEntities, (entities) => entities[id]);

export const selectBoardLoading = createSelector(
  selectBoardState,
  (state: BoardState) => state.loading
);
export const selectBoardError = createSelector(
  selectBoardState,
  (state: BoardState) => state.error
);
